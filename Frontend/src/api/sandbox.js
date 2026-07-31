const BASE_URL = '/api';

/**
 * POST /api/sandbox/start
 * Returns { sandboxID, previewUrl, agentUrl }
 */
export async function startSandbox(retries = 3, delayMs = 2000) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const TIMEOUT_MS = 3 * 60 * 1000; 
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${BASE_URL}/sandbox/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        if ([502, 503, 504].includes(res.status) && attempt < retries) {
          console.warn(`[Sandbox] Attempt ${attempt} returned ${res.status}. Retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
        const friendlyMessage = res.status === 502
          ? 'Sandbox backend service returned 502 Bad Gateway. The backend service may still be starting up or unreachable. Please verify backend server status.'
          : `Failed to start sandbox (${res.status}): ${errorText || 'Server error'}`;
        throw new Error(friendlyMessage);
      }

      const data = await res.json();
      console.log('[Sandbox] Started successfully:', data.sandboxID);
      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Sandbox creation timed out. The system is still provisioning; please wait a moment and refresh.');
      }
      lastError = err;
      if (attempt < retries && err.message.includes('502')) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        break;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error('Failed to start sandbox after retries.');
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