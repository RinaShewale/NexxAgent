import { motion } from 'framer-motion';

const variants = {
  // Desaturated Jade
  green: 'bg-[#10b98110] text-[#10b981] border-[#10b98130]',
  // Muted Rose
  red: 'bg-[#f43f5e10] text-[#f43f5e] border-[#f43f5e30]',
  // Soft Amber
  yellow: 'bg-[#f59e0b10] text-[#f59e0b] border-[#f59e0b30]',
  // Indigo Blue
  blue: 'bg-[#3b82f610] text-[#3b82f6] border-[#3b82f630]',
  // Royal Violet
  violet: 'bg-[#8b5cf610] text-[#8b5cf6] border-[#8b5cf630]',
  // Premium Neutral (Studio Theme)
  gray: 'bg-[#161618] text-[#818263] border-[#282728]',
};

export default function Badge({ label, variant = 'gray', dot = false }) {
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 
        text-[9px] font-bold uppercase tracking-[0.15em] 
        rounded-md border transition-all duration-300
        ${variants[variant]}
      `}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <motion.span 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`
              relative inline-flex rounded-full h-1.5 w-1.5 bg-current
              ${variant !== 'gray' ? 'shadow-[0_0_8px_currentColor]' : ''}
            `}
          />
        </span>
      )}
      <span className="leading-none pt-[1px]">{label}</span>
    </span>
  );
}