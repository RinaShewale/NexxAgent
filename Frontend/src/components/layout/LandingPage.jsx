// LandingPage.js
import { useState } from 'react';
import useSandboxStore from '../../store/sandboxStore';
import { useSandbox } from '../../hooks/useSandbox';
import ErrorBanner from '../shared/ErrorBanner';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const { error, initialPrompt, setInitialPrompt, setError } = useSandboxStore();
  const { triggerStartSandbox } = useSandbox();

  const handleStart = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setInitialPrompt(prompt);
    await triggerStartSandbox(prompt);
  };

  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-2xl z-10 animate-slide-in">
        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={handleStart} />
          </div>
        )}

        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-3xl shadow-2xl shadow-teal-500/10">✦</div>
          <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">Build at the speed of <span className="text-teal-400">thought.</span></h1>
          <p className="text-slate-400 text-lg max-w-md">NexxAgent turns your descriptions into ready-to-deploy software in seconds.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-3xl blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. Build a modern landing page for a SaaS with dark mode..."
              className="w-full bg-transparent border-none outline-none p-4 text-slate-200 resize-none h-32 text-lg"
            />
            <div className="flex justify-between items-center p-2 border-t border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Powered by Gemini 1.5 Pro</span>
              <button 
                onClick={handleStart}
                className="px-6 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
              >
                Generate ✦
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

