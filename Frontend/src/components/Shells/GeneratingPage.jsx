import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSandboxStore from '../../store/sandboxStore';

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0);
  const { status, initialPrompt } = useSandboxStore();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        // If sandbox is ready, speed up to 100%
        if (status === 'ready') return 100;
        // Slow down as we get closer to 90% if not ready yet
        if (p < 90) return p + 0.4;
        return p;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [status]);

  const steps = [
    "Architecting Workspace",
    "Calibrating Neural Nodes",
    "Synthesizing Interface",
    "Finalizing Environment"
  ];

  // Calculate current step based on progress
  const currentStep = steps[Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1)];

  return (
    <div className="h-screen w-screen bg-[#1A0B05] text-[#FFF2E0] flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background Decorative Spine */}
      <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#B55500]/10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center w-full max-w-2xl px-10"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-4 text-[#B55500]">
          Nexus Synthesis
        </span>

        {/* Display the prompt being worked on */}
        <p className="text-[#FFF2E0]/40 text-xs mb-12 italic text-center px-4">
          "{initialPrompt}"
        </p>

        <div className="h-24 flex items-center justify-center overflow-hidden mb-12">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-3xl md:text-5xl font-serif italic text-center tracking-tight"
            >
              {currentStep}...
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Minimalist Progress Spine */}
        <div className="relative w-[2px] h-40 bg-[#FFF2E0]/5 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-[#B55500] shadow-[0_0_15px_rgba(181,85,0,0.5)]"
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>

        <div className="mt-12 font-mono text-[10px] tracking-widest text-[#B55500]">
          {Math.floor(progress)}% COMPLETE
        </div>
        
        {/* Connection status indicator */}
        <div className="mt-4 flex items-center gap-2">
           <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'ready' ? 'bg-green-500' : 'bg-amber-500'}`} />
           <span className="text-[9px] uppercase tracking-tighter opacity-40">
             {status === 'loading' ? 'Creating Cloud Instance...' : 'Instance Ready, Redirecting...'}
           </span>
        </div>
      </motion.div>
    </div>
  );
}