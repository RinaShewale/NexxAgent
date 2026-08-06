import { motion } from 'framer-motion';

export default function IconButton({ onClick, title, children, className = '', disabled = false, active = false }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`
        relative flex items-center justify-center w-10 h-10 rounded-xl 
        transition-all duration-200 border outline-none
        ${disabled 
          ? 'opacity-20 cursor-not-allowed border-transparent' 
          : active 
            ? 'text-white bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
            : 'text-zinc-500 hover:text-white border-transparent hover:bg-white/5 hover:border-white/10'
        }
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>

      {active && (
        <motion.span 
          layoutId="activeDot"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" 
        />
      )}
    </motion.button>
  );
}