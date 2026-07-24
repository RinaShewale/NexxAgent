
// GeneratingPage.js
import { useEffect, useState } from 'react';
import Spinner from '../shared/Spinner';

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p < 95 ? p + Math.random() * 2 : p));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-10 text-center">
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full" />
          <Spinner size="lg" className="text-teal-500" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Assembling your workspace...</h2>
          <p className="text-slate-500 text-sm">Spinning up containers, installing dependencies, and configuring AI agents.</p>
        </div>

        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {['Container Prep', 'SDK Install', 'AI Training', 'UI Sync'].map((step, i) => (
            <div key={step} className={`flex items-center gap-2 p-3 rounded-xl border ${progress > (i+1)*20 ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-white/5 border-white/5 text-slate-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${progress > (i+1)*20 ? 'bg-teal-400' : 'bg-slate-700'}`} />
              <span className="text-[10px] font-bold uppercase">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}