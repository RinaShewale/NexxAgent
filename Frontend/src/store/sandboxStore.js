import { create } from 'zustand';

const STORAGE_KEY = 'nexxagent_sandbox_v2';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const useSandboxStore = create((set, get) => ({
  sandboxID: null,
  previewUrl: null,
  agentUrl: null,
  status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
  error: null,
  
  // UI views: 'landing' | 'generating' | 'editor'
  viewState: 'landing', 
  initialPrompt: '',
  elapsedTime: 0,
  
  // List of files worked on by the agent
  generatedFiles: [
    { name: 'metadata.json', status: 'done' },
    { name: 'package.json', status: 'done' }
  ],

  setInitialPrompt: (prompt) => set({ initialPrompt: prompt }),
  setViewState: (viewState) => set({ viewState }),
  setElapsedTime: (time) => set({ elapsedTime: time }),
  setGeneratedFiles: (files) => set({ generatedFiles: files }),
  
  setSandbox: ({ sandboxID, previewUrl, agentUrl }) => {
    const nextState = {
      sandboxID,
      previewUrl,
      agentUrl,
      status: 'ready',
      error: null,
      viewState: 'editor'
    };
    saveToStorage({ sandboxID, previewUrl, agentUrl, initialPrompt: get().initialPrompt });
    set(nextState);
  },

  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: 'error', viewState: 'landing' }),

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      sandboxID: null,
      previewUrl: null,
      agentUrl: null,
      status: 'idle',
      error: null,
      viewState: 'landing',
      initialPrompt: '',
      elapsedTime: 0,
      generatedFiles: []
    });
  },

  restoreFromStorage: () => {
    const saved = loadFromStorage();
    if (saved && saved.sandboxID) {
      set({
        sandboxID: saved.sandboxID,
        previewUrl: saved.previewUrl,
        agentUrl: saved.agentUrl,
        initialPrompt: saved.initialPrompt || '',
        status: 'ready',
        viewState: 'editor'
      });
      return true;
    }
    return false;
  }
}));

export default useSandboxStore;
