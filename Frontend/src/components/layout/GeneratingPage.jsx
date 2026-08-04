import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p < 95 ? p + Math.random() * 2 : p));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { id: 1, label: 'Container Prep', threshold: 20 },
    { id: 2, label: 'SDK Install', threshold: 45 },
    { id: 3, label: 'AI Training', threshold: 70 },
    { id: 4, label: 'UI Sync', threshold: 90 },
  ];

  return (
    <div className="h-screen w-screen bg-[#0D0E10] flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans selection:bg-[#F8FAFA]/10">
      {/* Dynamic Background Grain/Depth */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.05, 1] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4F5052_0%,_transparent_70%)]" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md flex flex-col items-center z-10"
      >
        {/* Core AI Assembly Loader */}
        <div className="relative w-24 h-24 mb-16">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-[#282728] rounded-2xl"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-8 h-8">
               {/* Animated Scanning Corners */}
               {[0, 90, 180, 270].map((rot) => (
                 <motion.div
                   key={rot}
                   style={{ rotate: rot }}
                   animate={{ opacity: [0.2, 1, 0.2] }}
                   transition={{ duration: 2, repeat: Infinity, delay: rot / 360 }}
                   className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#F8FAFA]"
                 />
               ))}
               <motion.div 
                 animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute inset-1 bg-[#F8FAFA] blur-md rounded-sm"
               />
            </div>
          </div>
        </div>
        
        {/* Textual Feedback */}
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-[18px] font-medium tracking-tight text-[#F8FAFA]">
            Initializing Architecture
          </h2>
          <p className="text-[#818263] text-[13px] font-medium font-mono uppercase tracking-widest">
            Instance.Booting_Sequence
          </p>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full space-y-3 mb-10">
          <div className="flex justify-between items-baseline px-1">
            <motion.span 
              key={Math.floor(progress / 10)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[9px] font-bold text-[#4F5052] uppercase tracking-[0.3em]"
            >
              {progress < 40 ? 'Allocating' : progress < 80 ? 'Optimizing' : 'Finalizing'}
            </motion.span>
            <span className="text-[12px] font-mono text-[#F8FAFA] tabular-nums font-bold">
              {Math.floor(progress)}%
            </span>
          </div>
          
          <div className="relative w-full h-[2px] bg-[#282728] rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#F8FAFA] shadow-[0_0_12px_rgba(248,250,250,0.4)]"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
        </div>
        
        {/* Status Checkpoints */}
        <motion.div 
          className="grid grid-cols-1 w-full gap-2"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {steps.map((step) => {
            const isCompleted = progress > step.threshold;
            const isActive = progress > (step.threshold - 20) && progress <= step.threshold;
            
            return (
              <motion.div 
                key={step.id}
                variants={{
                  hidden: { opacity: 0, x: -5 },
                  show: { opacity: 1, x: 0 }
                }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-[#161618] border-[#282728] text-[#F8FAFA]' 
                    : isActive 
                      ? 'bg-[#161618] border-[#4F5052] text-[#F8FAFA]'
                      : 'bg-transparent border-transparent text-[#4F5052]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#F8FAFA]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  ) : isActive ? (
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }} 
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#F8FAFA]" 
                    />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#282728]" />
                  )}
                  <span className={`text-[11px] font-bold uppercase tracking-widest font-mono transition-colors duration-500 ${isCompleted || isActive ? 'text-[#C5C6C8]' : 'text-[#4F5052]'}`}>
                    {step.label}
                  </span>
                </div>
                
                {isActive && (
                  <span className="text-[9px] font-mono animate-pulse opacity-50">RUNNING...</span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Decorative Metadata Footer */}
      <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-20">
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#4F5052] to-transparent" />
        <p className="text-[10px] font-mono tracking-[0.4em] text-[#818263] uppercase">
          Neural_Engine // Verified
        </p>
      </div>
    </div>
  );
}