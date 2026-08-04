import { motion } from 'framer-motion';

export default function IconButton({ 
  onClick, 
  title, 
  children, 
  className = '', 
  disabled = false, 
  active = false 
}) {
  return (
    <motion.button
      whileHover={!disabled ? { backgroundColor: 'rgba(40, 39, 40, 0.5)' } : {}}
      whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`
        relative flex items-center justify-center w-8 h-8 rounded-md 
        transition-colors duration-200 border outline-none
        ${disabled 
          ? 'opacity-20 cursor-not-allowed border-transparent text-[#4F5052]' 
          : active 
            ? 'text-[#F8FAFA] bg-[#282728] border-[#4F5052] shadow-sm' 
            : 'text-[#818263] hover:text-[#F8FAFA] border-transparent hover:border-[#282728]'
        }
        ${className}
      `}
    >
      {/* 
        Container for children (icons) to ensure they are 
        perfectly centered and sized for a professional IDE look
      */}
      <span className="flex items-center justify-center pointer-events-none">
        {children}
      </span>

      {/* Subtle Active Indicator Dot (optional design flourish) */}
      {active && (
        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F8FAFA] opacity-50" />
      )}
    </motion.button>
  );
}