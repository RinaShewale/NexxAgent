import * as k8sAPI from '@kubernetes/client-node'

const kc= new k8sAPI.KubeConfig()
kc.loadFromDefault()

export const k8sCoreV1Api = kc.makeApiClient(k8sAPI.CoreV1Api)

