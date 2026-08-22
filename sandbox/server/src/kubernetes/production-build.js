//production-build.js

import { k8sBatchV1Api } from "./config.js";

export async function createProductionBuildJob(projectId) {
    const jobName = `production-build-${projectId}`;

    const jobManifest = {
        apiVersion: "batch/v1",
        kind: "Job",

        metadata: {
            name: jobName,
            labels: {
                app: "production-build",
                projectId,
            },
        },

        spec: {
            backoffLimit: 2,

           
            ttlSecondsAfterFinished: 300,

            template: {
                metadata: {
                    labels: {
                        app: "production-build",
                        projectId,
                    },
                },

                spec: {
                    restartPolicy: "Never",

                    containers: [
                        {
                            name: "build-container",

                            image: "node:20-alpine",

                            env: [
                                {
                                    name: "PROJECT_ID",
                                    value: projectId,
                                },
                                {
                                    name: "AWS_ACCESS_KEY_ID",
                                    valueFrom: {
                                        secretKeyRef: {
                                            name: "aws",
                                            key: "AWS_ACCESS_KEY_ID",
                                        },
                                    },
                                },
                                {
                                    name: "AWS_SECRET_ACCESS_KEY",
                                    valueFrom: {
                                        secretKeyRef: {
                                            name: "aws",
                                            key: "AWS_SECRET_ACCESS_KEY",
                                        },
                                    },
                                },
                                {
                                    name: "AWS_REGION",
                                    valueFrom: {
                                        secretKeyRef: {
                                            name: "aws",
                                            key: "AWS_REGION",
                                        },
                                    },
                                },
                            ],

                            command: [
                                "sh",
                                "-c",
                                `
                                set -e

                                echo "🚀 Production build started"
                                echo "Project ID: $PROJECT_ID"

                                echo "📦 Installing AWS SDK for build scripts..."

                                mkdir -p /build-tools
                                cp /scripts/*.mjs /build-tools/
                                cd /build-tools

                                npm init -y

                                npm install @aws-sdk/client-s3

                                echo "☁️ Downloading project from S3..."

                                node /build-tools/download-project.mjs

                                echo "📁 Project files:"
                                ls -la /workspace

                                echo "📦 Installing project dependencies..."

                                cd /workspace

                                npm install

                                echo "🏗️ Running Vite production build..."
                                echo "Base path: /$PROJECT_ID/production/"

                                # --base must match the S3 key structure that
                                # upload-production.mjs uploads to:
                                #   s3://nexagent-bucket/<projectId>/production/...
                                # The S3 static website endpoint serves files
                                # from that same path, so index.html's asset
                                # URLs need this exact prefix or they'll 404.
                                npm run build -- --base=/$PROJECT_ID/production/

                                echo "✅ Production build completed"

                                echo "📁 Build output:"
                                ls -la /workspace/dist

                                echo "☁️ Uploading production build to S3..."

                                cd /build-tools

                                node /build-tools/upload-production.mjs

                                echo "🎉 Production build uploaded successfully"
                                `,
                            ],

                            resources: {
                                requests: {
                                    cpu: "250m",
                                    memory: "256Mi",
                                },

                                limits: {
                                    cpu: "500m",
                                    memory: "1Gi",
                                },
                            },

                            volumeMounts: [
                                {
                                    name: "build-workspace",
                                    mountPath: "/workspace",
                                },

                                {
                                    name: "build-scripts",
                                    mountPath: "/scripts",
                                },
                            ],
                        },
                    ],

                    volumes: [
                        {
                            name: "build-workspace",
                            emptyDir: {},
                        },

                        {
                            name: "build-scripts",

                            configMap: {
                                name: `production-build-scripts-${projectId}`,
                            },
                        },
                    ],
                },
            },
        },
    };

    await k8sBatchV1Api.createNamespacedJob({
        namespace: "default",
        body: jobManifest,
    });

    console.log(
        `🏗️ Production build Job created: ${jobName}`
    );

    return jobName;
}