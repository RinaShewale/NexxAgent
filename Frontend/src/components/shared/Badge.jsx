import { motion } from 'framer-motion';

const variants = {
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  zinc: 'bg-white/5 text-zinc-400 border-white/10',
};

export default function Badge({ label, variant = 'zinc', dot = false }) {
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 
        text-[10px] font-bold uppercase tracking-widest 
        rounded-full border transition-all duration-300
        ${variants[variant]}
      `}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <motion.span 
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"
          />
        </span>
      )}
      <span className="leading-none">{label}</span>
    </span>
  );
}