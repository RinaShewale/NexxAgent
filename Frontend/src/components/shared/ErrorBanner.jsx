import { motion } from 'framer-motion';

export default function ErrorBanner({ message, onRetry }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        x: [0, -2, 2, -2, 2, 0] // Subtle shake on entry
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1],
        x: { duration: 0.4, delay: 0.1 }
      }}
      className="flex items-center gap-4 px-5 py-3.5 bg-[#0D0E10] border border-[#f43f5e40] rounded-xl shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)] relative overflow-hidden group"
    >
      {/* Decorative Red Accent Line */}
      <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-[#f43f5e]" />

      {/* Icon with Subtle Pulse */}
      <div className="relative shrink-0 flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-[#f43f5e] blur-lg rounded-full opacity-20"
        />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold text-[#818263] uppercase tracking-[0.25em] font-mono">
          System_Exception
        </span>
        <span className="text-[13px] font-medium text-[#F8FAFA] leading-tight tracking-tight">
          {message}
        </span>
      </div>

      {/* Action Button */}
      {onRetry && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
          className="shrink-0 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#F8FAFA] bg-[#161618] hover:bg-[#f43f5e15] border border-[#282728] hover:border-[#f43f5e50] rounded-lg transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            Retry
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
            </svg>
          </span>
        </motion.button>
      )}
    </motion.div>
  );
}