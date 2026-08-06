import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function ErrorBanner({ message, onRetry }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0, x: [0, -2, 2, -2, 2, 0] }}
      className="flex items-center gap-4 px-5 py-4 bg-black border border-rose-500/30 rounded-2xl shadow-[0_20px_50px_rgba(244,63,94,0.1)] relative overflow-hidden"
    >
      {/* Red Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />

      <div className="relative shrink-0 w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
        <AlertCircle size={20} className="text-rose-500" />
      </div>

      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-black text-rose-500/50 uppercase tracking-[0.2em]">System_Exception</span>
        <span className="text-sm font-medium text-zinc-200 leading-tight tracking-tight">
          {message}
        </span>
      </div>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="shrink-0 flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
        >
          Retry
          <RefreshCcw size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}