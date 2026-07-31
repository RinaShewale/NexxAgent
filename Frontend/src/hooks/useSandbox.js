import { useEffect } from 'react';
import { startSandbox } from '../api/sandbox';
import useSandboxStore from '../store/sandboxStore';

export function useSandbox() {
  const { status, setSandbox, setStatus, setError, restoreFromStorage, setViewState } = useSandboxStore();

  useEffect(() => {
    // Try to restore previous session on mount
    restoreFromStorage();
  }, []);

  const triggerStartSandbox = async (prompt) => {
    setStatus('loading');
    setViewState('generating');
    try {
      const data = await startSandbox();
      setSandbox({
        sandboxID: data.sandboxID,
        previewUrl: data.previewUrl,
        agentUrl: data.agentUrl,
      });
      return data;
    } catch (err) {
      console.error('[useSandbox] error:', err);
      setError(err.message || 'Failed to start sandbox');
      return null;
    }
  };

  return { status, triggerStartSandbox };
}
