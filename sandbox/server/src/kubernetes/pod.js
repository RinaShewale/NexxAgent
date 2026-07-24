import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxID) {

  const podManifest = {

    apiVersion: "v1",

    kind: "Pod",

    metadata: {

      name: `sandbox-pod-${sandboxID}`,

      labels: {
        app: "sandbox",
        sandboxID,
      },

    },


    spec: {

      restartPolicy: "Never",


      initContainers: [

        {

          name: "init-container",

          image: "template:latest",

          imagePullPolicy: "IfNotPresent",

          command: [
            "sh",
            "-c",
            "cp -r /workspace/. /seed/"
          ],

          volumeMounts: [

            {
              name: "workspace-volume",
              mountPath: "/seed"
            }

          ]

        }

      ],



      containers: [

        {

          name: "sandbox-container",

          image: "template:latest",

          imagePullPolicy: "IfNotPresent",


          ports: [

            {
              name: "http",
              containerPort: 5173
            }

          ],


          resources: {

            requests: {
              cpu: "250m",
              memory: "500Mi"
            },

            limits: {
              cpu: "300m",
              memory: "1Gi"
            }

          },


          // IMPORTANT FIX
          readinessProbe: {

            httpGet: {

              path: "/",

              port: 5173

            },


            initialDelaySeconds: 10,

            periodSeconds: 3,

            timeoutSeconds: 5,

            failureThreshold: 20

          },


          livenessProbe: {

            httpGet: {

              path: "/",

              port: 5173

            },


            initialDelaySeconds: 30,

            periodSeconds: 10,

            timeoutSeconds: 5

          },


          volumeMounts: [

            {

              name: "workspace-volume",

              mountPath: "/workspace"

            }

          ]

        },



        {

          name: "agent-container",

          image: "agent:latest",

          imagePullPolicy: "IfNotPresent",


          resources: {

            requests: {
              cpu: "250m",
              memory: "500Mi"
            },

            limits: {
              cpu: "300m",
              memory: "1Gi"
            }

          },


          volumeMounts: [

            {

              name: "workspace-volume",

              mountPath: "/workspace"

            }

          ]

        }


      ],



      volumes: [

        {

          name: "workspace-volume",

          emptyDir: {}

        }

      ]


    }

  };


  return await k8sCoreV1Api.createNamespacedPod({

    namespace: "default",

    body: podManifest

  });


}



export async function deletePod(sandboxId) {
  try {
    const response = await k8sCoreV1Api.deleteNamespacedPod(
      {
        namespace: "default",
        name: `sandbox-pod-${sandboxId}`,
      },
      {
        gracePeriodSeconds: 0,
      }
    );

    console.log(`✅ Pod ${sandboxId} deleted`);

    return response;
  } catch (error) {
    console.error("Delete Pod Error:", error.message);
    throw error;
  }
}