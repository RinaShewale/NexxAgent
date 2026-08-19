import { v4 as uuid } from "uuid";

import Project from "../models/project.model.js";

import { createPod, deletePod } from "../kubernetes/pod.js";
import { createService, deleteService } from "../kubernetes/service.js";
import { k8sCoreV1Api } from "../kubernetes/config.js";
import { createSandboxKey, redis } from "../config/redis.js";

const sleep = (ms = 2000) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const isValidObjectId = (id) =>
    typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

// Wait for pod ready
// 60 retries * 2000ms = 120s (2 min) max wait — comfortably under the
// frontend's 4-minute AbortController timeout in sandbox.js.
async function waitForPodReady(podName) {
    let retries = 0;
    const MAX_RETRIES = 60;

    while (retries < MAX_RETRIES) {
        try {
            const response = await k8sCoreV1Api.readNamespacedPod({
                name: podName,
                namespace: "default",
            });

            const statuses = response.status?.containerStatuses;

            if (!statuses) {
                await sleep();
                retries++;
                continue;
            }

            const allReady = statuses.every((container) => container.ready);

            if (allReady) {
                console.log("✅ Pod Ready:", podName);
                return true;
            }

        } catch (error) {
            // 404 means the pod isn't scheduled/visible yet — keep waiting.
            // Anything else (auth, RBAC, network) is a real failure — fail fast.
            const statusCode = error?.code || error?.statusCode || error?.response?.statusCode;
            if (statusCode !== 404) {
                throw new Error(`Pod readiness check failed: ${error.message}`);
            }
            console.log("Pod not found yet, retrying:", podName);
        }

        await sleep();
        retries++;
    }

    throw new Error(`Pod timeout waiting for ${podName} to become ready`);
}

// Best-effort teardown of anything that may have been created for a sandbox
async function cleanupSandbox(sandboxID) {
    const results = await Promise.allSettled([
        deletePod(sandboxID),
        deleteService(sandboxID),
        redis.del(`sandbox:${sandboxID}`),
    ]);

    results.forEach((r, i) => {
        if (r.status === "rejected") {
            console.error(
                `Cleanup step ${i} failed for sandbox ${sandboxID}:`,
                r.reason?.message ?? r.reason
            );
        }
    });
}

// Create Project
export async function createProject(req, res) {
    try {
        const userId = req.user.userId || req.user.id || req.user._id;
        const { title } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const project = await Project.create({
            user: userId,
            title: title.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Project creation failed",
            error: error.message,
        });
    }
}

// Get Projects
export async function getProjects(req, res) {
    try {
        const userId = req.user.userId || req.user.id || req.user._id;

        const projects = await Project.find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            projects,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get projects",
            error: error.message,
        });
    }
}

// Create Sandbox
export async function createSandbox(req, res) {
    const { projectId, prompt } = req.body || {};
    const userId = req.user.userId || req.user.id || req.user._id;
    let sandboxID = null;

    if (!req.body || (typeof req.body !== 'object')) {
        return res.status(400).json({
            success: false,
            message: 'Request body is required and must be JSON.',
        });
    }

    try {
        let project = null;

        if (projectId) {
            if (!isValidObjectId(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "A valid projectId is required",
                });
            }

            project = await Project.findOne({
                _id: projectId,
                user: userId,
            });

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found",
                });
            }
        } else {
            const title = prompt && typeof prompt === 'string' && prompt.trim()
                ? prompt.trim().slice(0, 120)
                : 'New Sandbox Project';

            project = await Project.create({
                user: userId,
                title,
            });
        }

        sandboxID = uuid();
        const podName = `sandbox-pod-${sandboxID}`;
        console.log("Creating sandbox:", sandboxID);

        await Promise.all([
            createPod(sandboxID, project._id),
            createService(sandboxID),
        ]);

        await waitForPodReady(podName);

        // Start the session TTL only now that the sandbox is confirmed ready.
        await createSandboxKey(sandboxID);

        return res.status(201).json({
            success: true,
            message: "Sandbox created successfully",
            projectId: project._id,
            sandboxID,
            previewUrl: `http://${sandboxID}.preview.localhost`,
            agentUrl: `http://${sandboxID}.agent.localhost`,
        });

    } catch (error) {
        console.error("Sandbox creation failed:", error.message);

        if (sandboxID) {
            await cleanupSandbox(sandboxID);
        }

        return res.status(500).json({
            success: false,
            message: "Sandbox creation failed",
            error: error.message,
        });
    }
}

export function healthCheck(req, res) {
    return res.status(200).json({
        success: true,
        message: "Sandbox API Running",
    });
}