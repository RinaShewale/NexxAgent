// production-deployer.js

import { k8sBatchV1Api, k8sCoreV1Api, ensureProductionEnvironment } from "./config.js";

import Project from "../models/project.model.js";

import { createProductionDeployment } from "./production.js";
import { createProductionService } from "./production.service.js";
import { createProductionIngress } from "./production.ingress.js";

import { deletePod } from "./pod.js";
import { deleteService } from "./service.js";


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


            // ----------------------------
            // Build successful
            // ----------------------------

            if (
                job.status?.succeeded &&
                job.status.succeeded >= 1
            ) {

                console.log(
                    `✅ Production build completed: ${jobName}`
                );

                return "completed";
            }


            // ----------------------------
            // Build failed (only treat as final once Kubernetes
            // has exhausted backoffLimit retries — checking the
            // "Failed" condition avoids reporting failure while
            // a retry pod is still starting up)
            // ----------------------------

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
//
// The Job itself auto-deletes via ttlSecondsAfterFinished, but the
// ConfigMap it mounts does not — it has to be deleted explicitly or
// it accumulates forever (one per deploy attempt). Best-effort: a
// failure here should never fail the overall deploy.
//
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

        // Already gone is fine — nothing to clean up.
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
//
// Once the production Deployment/Service/Ingress exist (in the
// "production" namespace), the temporary dev sandbox for this
// project — which lives in "default" — is no longer needed.
// The production Deployment is fully independent (separate
// namespace, no Skaffold tracking, no dependency on the sandbox
// pod), so it's safe to tear the sandbox down here.
//
// Best-effort: failures here should never flip the deploy itself to
// "failed" — the site is already live at this point.
//
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
        // Ensure "production" namespace + aws secret exist
        // --------------------------------
        //
        // Runs before anything else so the very first deploy on a
        // fresh cluster doesn't fail with "namespace not found" or
        // "secret not found".

        await ensureProductionEnvironment();


        // --------------------------------
        // Wait for build
        // --------------------------------

        const buildStatus =
            await waitForBuildJob(jobName);


        // --------------------------------
        // Build failed
        // --------------------------------

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


        // Build succeeded — the ConfigMap has done its job, safe to
        // remove now (independent of the rest of the deploy below).
        await cleanupBuildConfigMap(projectId);


        // --------------------------------
        // Create Deployment
        // --------------------------------

        console.log(
            `🚀 Creating production Deployment: ${projectId}`
        );


        const deploymentName =
            await createProductionDeployment(
                projectId
            );


        // --------------------------------
        // Create Service
        // --------------------------------

        console.log(
            `🌐 Creating production Service: ${projectId}`
        );


        const serviceName =
            await createProductionService(
                projectId
            );


        // --------------------------------
        // Create Ingress
        // --------------------------------

        console.log(
            `🌍 Creating production Ingress: ${projectId}`
        );


        const { ingressName, productionPath } =
            await createProductionIngress(
                projectId
            );


        // --------------------------------
        // Build the full production URL
        // --------------------------------
        //
        // With Cloudflare Quick Tunnel there's no fixed domain —
        // just whatever random hostname the tunnel currently has.
        // TUNNEL_BASE_URL is set manually in sandbox-deployment.yml
        // and must be updated whenever `cloudflared tunnel --url`
        // is restarted (its hostname changes every time).
        //
        // Falls back to localhost so local-only testing (no tunnel
        // running) still produces a working link on your own machine.

        const tunnelBaseUrl =
            process.env.TUNNEL_BASE_URL ||
            "http://localhost";

        const productionUrl =
            `${tunnelBaseUrl}${productionPath}`;


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
        project.deploymentName = deploymentName;
        project.serviceName = serviceName;
        project.ingressName = ingressName;
        project.productionUrl = productionUrl;
        project.deployedAt = new Date();


        // --------------------------------
        // Tear down the temporary sandbox
        // --------------------------------
        //
        // The production Deployment is self-sufficient at this point —
        // it lives in its own namespace, Kubernetes keeps it running
        // independently of the sandbox, Skaffold, or this backend
        // process. Free up the sandbox pod's resources now that it's
        // no longer needed.

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