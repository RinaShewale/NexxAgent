import { motion } from 'framer-motion';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { 
    sm: 'w-4 h-4', 
    md: 'w-8 h-8', 
    lg: 'w-12 h-12' 
  };

  const strokeWidths = { sm: 3, md: 2.5, lg: 2 };

  return (
    <div className={`${sizes[size]} ${className} relative flex items-center justify-center`}>
      {/* Static Track */}
      <svg viewBox="0 0 24 24" fill="none" className="absolute inset-0 w-full h-full opacity-10">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={strokeWidths[size]} className="text-white" />
      </svg>

      {/* Rotating Segment */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth={strokeWidths[size]}
            strokeLinecap="round"
            className="text-white"
            style={{ filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))' }}
          />
        </svg>
      </motion.div>

      {/* Inner Glow Dot */}
      <motion.div 
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]"
      />
    </div>
  );
}