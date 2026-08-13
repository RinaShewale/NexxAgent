import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSandboxStore from '../../store/sandboxStore';
import { useSandbox } from '../../hooks/useSandbox';


export default function LandingPage() {
  const { error, setError, setInitialPrompt } = useSandboxStore();
  const { triggerStartSandbox } = useSandbox();
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleStartGenerate = () => {
    if (!prompt.trim()) return;
    setError(null);
    setInitialPrompt(prompt);

    // Fire-and-forget: triggerStartSandbox synchronously sets
    // status:'loading' + viewState:'generating' before its first
    // `await`, so the store is already correct by the time we navigate.
    triggerStartSandbox(prompt);

    navigate('/shell');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1A0B05] text-[#FFF2E0] font-sans selection:bg-[#B55500]/30 overflow-x-hidden">
    
  

      {/* 2. Ambient Background Elements (Matching the SideMenu aesthetic) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Right Glow */}
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-[#B55500]/10 blur-[120px] rounded-full" />
        {/* Bottom Left Glow */}
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-[#34170A]/50 blur-[100px] rounded-full" />
        
        {/* Subtle Geometric SVG (Optional, matches the curve of your menu) */}
        <svg className="absolute top-0 right-0 h-full w-auto opacity-[0.03] text-[#B55500]" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M 100 0 L 100 100 L 20 100 Q 0 50 20 0 Z" fill="currentColor" />
        </svg>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] tracking-[0.5em] uppercase text-[#B55500] font-bold mb-4 block">
              The Future of Autonomous Agents
            </span>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8 leading-[0.9]">
              Build your vision <br />
              <span className="italic font-serif">in seconds.</span>
            </h1>
          </motion.div>

          {/* Prompt Input Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative group max-w-2xl mx-auto w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#B55500]/20 to-transparent rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-3 p-2 bg-[#34170A]/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartGenerate();
                }}
                placeholder="Describe an application or task..."
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-[#FFF2E0] placeholder:text-[#FFF2E0]/20 text-lg font-light"
              />
              <button
                onClick={handleStartGenerate}
                className="w-full md:w-auto px-8 py-3 bg-[#B55500] hover:bg-[#944600] text-[#FFF2E0] rounded-xl transition-all duration-300 font-medium tracking-tight whitespace-nowrap active:scale-95"
              >
                Generate
              </button>
            </div>
            
            {error && (
              <p className="mt-4 text-[#B55500] text-xs tracking-widest uppercase">{error}</p>
            )}
          </motion.div>

          {/* Subtle Footer Links */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.4 }}
             transition={{ delay: 0.8 }}
             className="mt-20 flex gap-8 justify-center text-[10px] tracking-[0.3em] uppercase font-light"
          >
            <a href="#" className="hover:text-[#B55500] transition-colors">Documentation</a>
            <a href="#" className="hover:text-[#B55500] transition-colors">Showcase</a>
            <a href="#" className="hover:text-[#B55500] transition-colors">Github</a>
          </motion.div>
        </div>
      </main>

      {/* Custom Scrollbar Styling */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #1A0B05;
        }
        ::-webkit-scrollbar-thumb {
          background: #34170A;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #B55500;
        }
      `}</style>
    </div>
  );
}