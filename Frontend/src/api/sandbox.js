const BASE_URL = '/api';

/**
 * POST /api/sandbox/start
 * Returns { sandboxID, previewUrl, agentUrl }
 */
export async function startSandbox() {
  const controller = new AbortController();
  // 3 minutes timeout - Pods can be slow to pull images
  const TIMEOUT_MS = 3 * 60 * 1000; 
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}/sandbox/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to start sandbox (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    console.log('[Sandbox] Started:', data.sandboxID);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Sandbox creation timed out. The system is still provisioning; please wait a moment and refresh.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Checks if the agent is responsive.
 * Note: agentUrl usually points to a different subdomain.
 */
export async function checkSandboxAlive(agentUrl) {
  if (!agentUrl) return false;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    
    const res = await fetch(`${agentUrl}/list-files`, { signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (err) {
    console.warn('[Sandbox] Agent not reachable yet...');
    return false;
  }
}