import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Cpu, Globe, Check, Loader2 } from 'lucide-react';

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("Initializing Nexx engine...");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p < 98 ? p + Math.random() * 1.5 : p;
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { id: 1, label: 'Environment Setup', threshold: 15, icon: <Globe size={14} /> },
    { id: 2, label: 'Contextual Analysis', threshold: 40, icon: <Cpu size={14} /> },
    { id: 3, label: 'Neural Component Synthesis', threshold: 75, icon: <Sparkles size={14} /> },
    { id: 4, label: 'Optimizing Interface', threshold: 95, icon: <Terminal size={14} /> },
  ];

  useEffect(() => {
    const activeStep = [...steps].reverse().find(s => progress >= s.threshold);
    if (activeStep) setCurrentMessage(activeStep.label);
  }, [progress]);

  return (
    <div className="h-screen w-screen bg-[#000] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Layer: Matching Landing Page Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_transparent_65%)] opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl flex flex-col items-center z-10"
      >
        {/* The Neural Core (Central Visual) */}
        <div className="relative mb-16">
            {/* Pulsing Rings */}
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                        opacity: [0, 0.2, 0], 
                        scale: [0.8, 1.5 + i * 0.2, 1.8],
                        borderWidth: ['1px', '1px', '0px']
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
                    className="absolute inset-0 border border-white/20 rounded-full"
                />
            ))}
            
            <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center relative backdrop-blur-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-white/10 rounded-3xl scale-90"
                />
                <Sparkles className="text-white" size={32} />
            </div>
        </div>

        {/* Text Feedback */}
        <div className="text-center mb-12">
            <AnimatePresence mode="wait">
                <motion.h2 
                    key={currentMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl font-bold tracking-tight text-white mb-2"
                >
                    {currentMessage}
                </motion.h2>
            </AnimatePresence>
            <p className="text-white/40 text-sm font-mono uppercase tracking-[0.2em]">Executing Synthesis_Sequence v4.0</p>
        </div>

        {/* High-Precision Progress Bar */}
        <div className="w-full px-12 mb-12">
            <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-white/40" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Processing</span>
                </div>
                <span className="text-xl font-bold font-mono tabular-nums">{Math.floor(progress)}%</span>
            </div>
            
            <div className="h-[6px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 40 }}
                    className="h-full bg-gradient-to-r from-zinc-500 via-white to-white rounded-full relative shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                    <div className="absolute top-0 right-0 w-8 h-full bg-white blur-sm opacity-50" />
                </motion.div>
            </div>
        </div>

        {/* Activity Log (Steps) */}
        <div className="w-full max-w-sm space-y-2">
          {steps.map((step) => {
            const isCompleted = progress > step.threshold;
            const isActive = progress <= step.threshold && progress > (step.threshold - 25);
            
            return (
              <div 
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-white/[0.03] border-white/10 opacity-100' 
                    : isActive 
                      ? 'bg-white/[0.01] border-white/20 opacity-100'
                      : 'border-transparent opacity-20'
                }`}
              >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isCompleted ? 'text-green-400 bg-green-400/10' : 'bg-white/5'}`}>
                        {isCompleted ? <Check size={12} strokeWidth={3} /> : step.icon}
                    </div>
                    <span className={`text-xs font-medium ${isCompleted ? 'text-white/80' : 'text-white/40'}`}>
                        {step.label}
                    </span>
                </div>
                {isActive && (
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"
                    />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom Metadata */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/10">
        <span className="text-[10px] font-mono tracking-widest uppercase">Instance-ID: NEXX_882</span>
        <div className="w-1 h-1 bg-white/10 rounded-full" />
        <span className="text-[10px] font-mono tracking-widest uppercase">Secure Sandbox</span>
      </div>
    </div>
  );
}