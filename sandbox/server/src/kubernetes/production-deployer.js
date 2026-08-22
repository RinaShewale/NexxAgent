// production-deployer.js
//
// SIMPLIFIED: production sites are now served directly from S3
// static website hosting, not from a Kubernetes Deployment/Service/
// Ingress. This means:
//   - No "production" namespace, no RBAC for it, no Ingress, no pods
//     to keep alive for deployed sites.
//   - The site is live the instant the build finishes uploading to
//     S3 — genuinely permanent, independent of this backend, this
//     cluster, Skaffold, or your laptop being on at all.
//   - production.js / production.service.js / production.ingress.js
//     are no longer used by this file (kept only if you still want
//     them for reference — safe to delete).

import { k8sBatchV1Api, k8sCoreV1Api } from "./config.js";

import Project from "../models/project.model.js";

import { deletePod } from "./pod.js";
import { deleteService } from "./service.js";


// --------------------------------
// S3 static website endpoint
// --------------------------------
//
// Set S3_WEBSITE_ENDPOINT in your env once you've enabled static
// website hosting on the bucket, e.g.:
//   nexagent-bucket.s3-website-ap-southeast-1.amazonaws.com
// (no "http://" prefix — added below)

const S3_WEBSITE_ENDPOINT =
    process.env.S3_WEBSITE_ENDPOINT ||
    "nexagent-bucket.s3-website-ap-southeast-1.amazonaws.com";


// --------------------------------
// Wait for Build Job
// --------------------------------

async function waitForBuildJob(jobName) {

    const MAX_RETRIES = 120;
    const INTERVAL = 3000;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {

        try {

            const response =
                await k8sBatchV1Api.readNamespacedJob({
                    name: jobName,
                    namespace: "default",
                });


            const job =
                response;


            if (
                job.status?.succeeded &&
                job.status.succeeded >= 1
            ) {

                console.log(
                    `✅ Production build completed: ${jobName}`
                );

                return "completed";
            }


            const failedCondition =
                job.status?.conditions?.find(
                    (c) =>
                        c.type === "Failed" &&
                        c.status === "True"
                );

            if (failedCondition) {

                console.error(
                    `❌ Production build failed: ${jobName}`
                );

                return "failed";
            }


            console.log(
                `⏳ Waiting for production build: ${jobName}`
            );


        } catch (error) {

            console.error(
                `❌ Failed to check build Job ${jobName}:`,
                error.message
            );

            throw error;
        }


        await new Promise((resolve) =>
            setTimeout(resolve, INTERVAL)
        );
    }


    throw new Error(
        `Production build timeout: ${jobName}`
    );
}


// --------------------------------
// Delete the build ConfigMap once the Job is done with it
// --------------------------------

async function cleanupBuildConfigMap(projectId) {

    const configMapName =
        `production-build-scripts-${projectId}`;

    try {

        await k8sCoreV1Api.deleteNamespacedConfigMap({
            name: configMapName,
            namespace: "default",
        });

        console.log(
            `🧹 Deleted build ConfigMap: ${configMapName}`
        );

    } catch (error) {

        const statusCode =
            error?.code ||
            error?.statusCode ||
            error?.response?.statusCode;

        if (statusCode !== 404) {
            console.error(
                `Failed to delete build ConfigMap ${configMapName}:`,
                error.message
            );
        }
    }
}


// --------------------------------
// Cleanup sandbox after a successful deploy
// --------------------------------

async function cleanupProjectSandbox(project) {

    const sandboxID = project.sandboxID;

    if (!sandboxID) {
        return;
    }

    console.log(
        `🧹 Cleaning up sandbox after deploy: ${sandboxID}`
    );

    const results = await Promise.allSettled([
        deletePod(sandboxID),
        deleteService(sandboxID),
    ]);

    results.forEach((r, i) => {
        if (r.status === "rejected") {
            console.error(
                `Sandbox cleanup step ${i} failed for ${sandboxID}:`,
                r.reason?.message ?? r.reason
            );
        }
    });

    project.sandboxID = null;
}


// --------------------------------
// Deploy production
// --------------------------------

export async function deployProduction(
    projectId,
    jobName
) {

    try {

        console.log(
            `🚀 Waiting for production build: ${projectId}`
        );


        // --------------------------------
        // Wait for build
        // --------------------------------

        const buildStatus =
            await waitForBuildJob(jobName);


        if (buildStatus === "failed") {

            await cleanupBuildConfigMap(projectId);

            await Project.findByIdAndUpdate(
                projectId,
                {
                    deploymentStatus: "failed",
                }
            );

            return;
        }


        await cleanupBuildConfigMap(projectId);


        // --------------------------------
        // Build the S3 static website URL
        // --------------------------------
        //
        // No Kubernetes Deployment/Service/Ingress needed — the
        // build already uploaded files to
        //   s3://nexagent-bucket/<projectId>/production/
        // via upload-production.mjs, and S3 static website hosting
        // serves that path directly. This URL is live immediately
        // and works permanently, independent of anything running
        // locally.

        const productionUrl =
            `http://${S3_WEBSITE_ENDPOINT}/${projectId}/production/`;


        console.log(
            `🌍 Production site live at: ${productionUrl}`
        );


        // --------------------------------
        // Load project (need sandboxID for cleanup)
        // --------------------------------

        const project =
            await Project.findById(projectId);

        if (!project) {
            throw new Error(
                `Project not found after deploy: ${projectId}`
            );
        }


        // --------------------------------
        // Update project — mark deployed
        // --------------------------------

        project.deploymentStatus = "deployed";
        project.productionUrl = productionUrl;
        project.deployedAt = new Date();

        // No Kubernetes resources created for production anymore —
        // clear these out in case they were set by an older deploy.
        project.deploymentName = null;
        project.serviceName = null;
        project.ingressName = null;


        // --------------------------------
        // Tear down the temporary sandbox
        // --------------------------------
        //
        // Safe to do immediately — the production site is already
        // live on S3, fully independent of the sandbox pod.

        await cleanupProjectSandbox(project);

        await project.save();


        console.log(
            `🎉 Production deployed successfully: ${productionUrl}`
        );


    } catch (error) {

        console.error(
            `❌ Production deployment failed for ${projectId}:`,
            error.message
        );


        await cleanupBuildConfigMap(projectId);


        await Project.findByIdAndUpdate(
            projectId,
            {
                deploymentStatus: "failed",
            }
        );
    }
}