import { motion } from 'framer-motion';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { 
    sm: 'w-4 h-4', 
    md: 'w-6 h-6', 
    lg: 'w-10 h-10' 
  };

  const strokeWidths = {
    sm: 3,
    md: 2.5,
    lg: 2
  };

  return (
    <div className={`${sizes[size]} ${className} relative flex items-center justify-center`}>
      {/* Background Track - Subtle Raisin Black */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className="absolute inset-0 w-full h-full"
      >
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="#282728" 
          strokeWidth={strokeWidths[size]} 
          className="opacity-50"
        />
      </svg>

      {/* Active Spinner - Seasalt Comet */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-full h-full"
        >
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="#F8FAFA"
            strokeWidth={strokeWidths[size]}
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 2px rgba(248, 250, 250, 0.4))' 
            }}
          />
        </svg>
      </motion.div>

      {/* Central Focal Point (Internal Detail for Premium Feel) */}
      <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-1 h-1 rounded-full bg-[#F8FAFA] opacity-20"
      />
    </div>
  );
}