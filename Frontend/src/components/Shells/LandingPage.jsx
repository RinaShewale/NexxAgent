import React, { useState, useEffect } from 'react'; // Added useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSandboxStore from '../../store/sandboxStore';
import { useSandbox } from '../../hooks/useSandbox';
import { ArrowRight, Terminal, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { error, setError, setInitialPrompt } = useSandboxStore();
  const { triggerStartSandbox } = useSandbox();
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  // --- ADD THIS BLOCK TO FIX THE SCROLLBAR ---
  useEffect(() => {
    // Force the body and html to hide scrollbars immediately on mount
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Clean up/Allow scrolling again when leaving this page
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);
  // -------------------------------------------

  const handleStartGenerate = () => {
    if (!prompt.trim()) return;
    setError(null);
    setInitialPrompt(prompt);
    triggerStartSandbox(prompt);
    navigate('/shell');
  };

  const suggestions = ["SaaS Dashboard", "AI Portfolio", "Crypto Tracker"];

  return (
    // Added "w-full h-full" and "fixed" to ensure it covers everything
    <div className="fixed inset-0 w-screen h-screen bg-[#FDF3E4] text-[#34170A] flex flex-col items-center justify-center overflow-hidden z-50">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dvwthyt94/image/upload/v1672322316/noise_yvsk9m.png')` }}
        />
        <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-[#A35100]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-[#A35100]/3 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 w-full max-w-5xl px-6 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A35100]/10 bg-[#A35100]/5 mb-8">
              <Sparkles size={12} className="text-[#A35100]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A35100]">Neural Engine V2</span>
            </div>
            
            <h1 className="text-6xl md:text-[110px] font-light tracking-tighter mb-6 leading-[0.9] text-[#34170A]">
              Build your vision <br />
              <span className="italic font-serif font-light text-[#A35100]">in seconds.</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-[#34170A]/60 text-lg md:text-xl font-light mb-12">
              Deploy high-performance applications and autonomous workflows 
              using only natural language.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-3xl mx-auto w-full group"
          >
            <div className="relative flex items-center p-2 bg-white/40 backdrop-blur-2xl border border-[#A35100]/10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(163,81,0,0.1)] transition-all duration-500 focus-within:border-[#A35100]/30 focus-within:shadow-[0_30px_60px_-15px_rgba(163,81,0,0.2)] focus-within:bg-white/60">
              <div className="pl-6 pr-2 text-[#A35100]/40 group-focus-within:text-[#A35100] transition-colors">
                <Terminal size={20} strokeWidth={1.5} />
              </div>

              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartGenerate()}
                placeholder="Describe the application you want to build..."
                className="w-full bg-transparent border-none outline-none focus:ring-0 px-2 py-6 text-[#34170A] placeholder:text-[#34170A]/30 text-lg md:text-xl font-light"
              />

              <button
                onClick={handleStartGenerate}
                className="group/btn flex items-center gap-2 px-8 py-4 bg-[#34170A] hover:bg-[#A35100] text-white rounded-[1.8rem] transition-all duration-300 font-medium whitespace-nowrap shadow-lg active:scale-95"
              >
                Generate
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => setPrompt(item)}
                  className="px-6 py-2.5 rounded-full border border-[#34170A]/5 bg-[#34170A]/5 text-[10px] uppercase tracking-[0.15em] font-bold text-[#34170A]/50 hover:bg-[#A35100] hover:text-white hover:border-[#A35100] transition-all duration-300 active:scale-95"
                >
                  + {item}
                </button>
              ))}
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 text-[#A35100] text-[10px] font-bold tracking-[0.2em] uppercase"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}