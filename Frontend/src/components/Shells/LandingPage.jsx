import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSandboxStore from '../../store/sandboxStore';
import { useSandbox } from '../../hooks/useSandbox';
import { ArrowRight, Terminal } from 'lucide-react';

export default function LandingPage() {
  const { error, setError, setInitialPrompt } = useSandboxStore();
  const { triggerStartSandbox } = useSandbox();
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleStartGenerate = () => {
    if (!prompt.trim()) return;
    setError(null);
    setInitialPrompt(prompt);
    triggerStartSandbox(prompt);
    navigate('/shell');
  };

  const suggestions = ["SaaS Dashboard", "AI Portfolio", "Crypto Tracker"];

  return (
    <div className="relative min-h-screen w-full bg-[#FDF3E4] text-[#34170A] font-sans selection:bg-[#A35100]/20 overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dvwthyt94/image/upload/v1672322316/noise_yvsk9m.png')` }}
        />
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-[#A35100]/5 rounded-full blur-[140px]" />
      </div>

      <main className="relative z-10 w-full max-w-5xl px-6">
        <div className="text-center">
          
          {/* Headline Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-[120px] font-light tracking-tighter mb-4 leading-[0.85] text-[#34170A]">
              Build your vision <br />
              <span className="italic font-serif font-light text-[#A35100]">in seconds.</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-[#34170A]/50 text-lg md:text-xl font-light mb-12 mt-6">
              Deploy high-performance applications and autonomous workflows <br className="hidden md:block" />
              with simple natural language.
            </p>
          </motion.div>

          {/* Main Input Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-3xl mx-auto w-full"
          >
            <div className="relative flex items-center p-2 bg-[#F7EDE0]/60 backdrop-blur-xl border border-[#A35100]/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(163,81,0,0.15)]">
              
              {/* Icon Decoration */}
              <div className="pl-5 pr-2 text-[#A35100]/30">
                <Terminal size={20} strokeWidth={1.5} />
              </div>

              {/* The Input - No Outline */}
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartGenerate()}
                placeholder="Describe the application you want to build..."
                className="w-full bg-transparent border-none outline-none focus:ring-0 px-2 py-5 text-[#34170A] placeholder:text-[#34170A]/20 text-lg md:text-xl font-light"
              />

              {/* Generate Button */}
              <button
                onClick={handleStartGenerate}
                className="group flex items-center gap-2 px-8 py-4 bg-[#A35100] hover:bg-[#854200] text-[#FDF3E4] rounded-2xl transition-all duration-300 font-medium whitespace-nowrap shadow-lg shadow-[#A35100]/20 active:scale-95"
              >
                Generate
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Interactive Suggestions */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => setPrompt(item)}
                  className="px-5 py-2 rounded-full border border-[#34170A]/5 bg-[#34170A]/5 text-[10px] uppercase tracking-[0.15em] font-bold text-[#34170A]/40 hover:bg-[#A35100]/10 hover:text-[#A35100] hover:border-[#A35100]/20 transition-all duration-300"
                >
                  + {item}
                </button>
              ))}
            </div>
            
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="mt-6 text-[#A35100] text-[10px] font-bold tracking-[0.2em] uppercase"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>

      {/* Styles for global cleanup */}
      <style jsx global>{`
        body {
          background-color: #FDF3E4;
        }
        /* Removes the blue/black highlight box on mobile/chrome */
        input:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        ::selection {
          background: rgba(163, 81, 0, 0.15);
          color: #A35100;
        }
      `}</style>
    </div>
  );
}