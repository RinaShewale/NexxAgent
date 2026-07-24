import express from "express";
import morgan from "morgan";
import { v4 as uuid } from "uuid";

import { createPod } from "./kubernetes/pod.js";
import { createService } from "./kubernetes/service.js";
import { k8sCoreV1Api } from "./kubernetes/config.js";

import { createSandboxKey } from "./config/redis.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

function sleep(ms = 3000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Wait until both containers are ready
async function waitForPodReady(podName) {

    let retries = 0;

    while (retries < 60) {

        try {

            const response = await k8sCoreV1Api.readNamespacedPod({
                name: podName,
                namespace: "default",
            });

            const statuses = response.status?.containerStatuses;

            if (!statuses) {
                console.log("Waiting for container statuses...");
                await sleep();
                retries++;
                continue;
            }

            console.log(
                statuses.map((c) => ({
                    name: c.name,
                    ready: c.ready,
                    state: c.state,
                }))
            );

            const allReady = statuses.every((c) => c.ready);

            if (allReady) {
                console.log("✅ All containers are ready");
                return;
            }

            console.log("Waiting for containers...");

        } catch (err) {

            console.log("Pod check error:", err.message);

        }

        await sleep();
        retries++;
    }

    throw new Error("Pod ready timeout");
}

app.post("/api/sandbox/start", async (req, res) => {

    try {

        const sandboxID = uuid();

        console.log("Creating Sandbox:", sandboxID);


        await Promise.all([
            createPod(sandboxID),
            createService(sandboxID),
            createSandboxKey(sandboxID),
        ]);


        console.log("✅ Pod and Service created");


        await waitForPodReady(
            `sandbox-pod-${sandboxID}`
        );


        console.log("✅ Pod ready");


        return res.status(201).json({
            message: "Sandbox created successfully",
            sandboxID,
            previewUrl: `http://${sandboxID}.preview.localhost`,
            agentUrl: `http://${sandboxID}.agent.localhost`,
        });


    } catch (error) {

        console.error("Sandbox Error:", error);


        return res.status(500).json({
            message: "Failed to create sandbox",
            error: error.message,
        });

    }

});



app.get("/api/sandbox/health", (req, res) => {

    res.json({
        status: "ok",
        message: "Sandbox API Running",
    });

});

export default app;