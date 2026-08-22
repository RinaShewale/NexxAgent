import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        // --------------------------------
        // Active Sandbox (temporary dev pod)
        // --------------------------------

        // Tracks the currently running sandbox for this project,
        // so it can be cleaned up automatically after a successful
        // production deploy.
        sandboxID: {
            type: String,
            default: null,
        },

        // --------------------------------
        // Production Deployment
        // --------------------------------

        deploymentStatus: {
            type: String,
            enum: [
                "not-deployed",
                "building",
                "deployed",
                "failed",
            ],
            default: "not-deployed",
        },

        // Production website URL
        productionUrl: {
            type: String,
            default: null,
        },

        // Kubernetes Deployment name
        deploymentName: {
            type: String,
            default: null,
        },

        // Kubernetes Service name
        serviceName: {
            type: String,
            default: null,
        },

        // Kubernetes Ingress name
        ingressName: {
            type: String,
            default: null,
        },

        // Kubernetes Build Job name
        buildJobName: {
            type: String,
            default: null,
        },

        // Kubernetes ConfigMap name
        buildConfigMapName: {
            type: String,
            default: null,
        },

        // Deployment completed time
        deployedAt: {
            type: Date,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

const Project = mongoose.model(
    "Project",
    projectSchema
);

export default Project;