import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSandboxStore from '../../store/sandboxStore';
import { Loader2 } from 'lucide-react';

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0);
  const { status, initialPrompt } = useSandboxStore();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (status === 'ready') return 100;
        if (p < 92) return p + 0.3; // Slow, deliberate crawl
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

  const currentStep = steps[Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1)];

  return (
    <div className="relative h-screen w-screen bg-[#FDF3E4] text-[#34170A] flex flex-col items-center justify-center font-sans overflow-hidden px-6">
      
      {/* 1. Background Texture & Ambient Glow (Matching Landing) */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dvwthyt94/image/upload/v1672322316/noise_yvsk9m.png')` }}
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#A35100]/5 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center w-full max-w-3xl"
      >
        {/* Top Badge */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-12"
        >
          <Loader2 className="w-4 h-4 text-[#A35100] animate-spin" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#A35100]">
            System Synthesis
          </span>
        </motion.div>

        {/* Current Status Text */}
        <div className="h-32 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
              transition={{ duration: 0.8, ease: "circOut" }}
            >
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#34170A] tracking-tight">
                {currentStep}
              </h2>
            </motion.div>
          </AnimatePresence>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="mt-6 text-sm font-light max-w-md line-clamp-1 italic"
          >
            "{initialPrompt || "Initializing creative engine..."}"
          </motion.p>
        </div>

        {/* Elegant Progress Bar */}
        <div className="w-full max-w-md mt-12">
          <div className="relative h-[2px] w-full bg-[#34170A]/10 rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#A35100]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#34170A]/30 uppercase">
              Processing Vision
            </span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A35100] uppercase">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>

        {/* Connection Status Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex items-center gap-3 px-4 py-2 rounded-full border border-[#34170A]/5 bg-white/30 backdrop-blur-sm"
        >
           <div className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'ready' ? 'bg-green-400' : 'bg-[#A35100]'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'ready' ? 'bg-green-500' : 'bg-[#A35100]'}`}></span>
           </div>
           <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">
             {status === 'loading' ? 'Provisioning Instance' : 'Ready for Deployment'}
           </span>
        </motion.div>
      </motion.div>

      {/* Global Style overrides */}
      <style jsx global>{`
        body {
          background-color: #FDF3E4;
        }
      `}</style>
    </div>
  );
}