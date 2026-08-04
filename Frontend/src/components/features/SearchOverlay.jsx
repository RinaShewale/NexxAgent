import { Search, Command, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchOverlay({ onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md p-4 pt-[15vh] flex justify-center"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 20, scale: 0.95, opacity: 0 }} 
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl bg-[#000000] border border-[#262626] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Animated Input Bar */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center px-6 border-b border-[#262626]"
        >
          <Search className="text-[#595959]" size={20} />
          <input 
            autoFocus
            placeholder="Search anything..." 
            className="flex-1 bg-transparent p-6 outline-none text-lg text-white placeholder-[#424242]"
          />
          <div className="flex items-center gap-2">
             <kbd className="hidden md:block bg-[#262626] border border-[#424242] rounded-lg px-2 py-1 text-[10px] text-[#777777] font-sans">
               ESC
             </kbd>
             <button onClick={onClose} className="p-2 hover:bg-[#262626] rounded-full transition-colors">
                <X size={18} className="text-[#595959]" />
             </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="p-4 space-y-1">
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             transition={{ delay: 0.2 }}
             className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#595959] font-bold"
           >
             Recent Searches
           </motion.div>
           
           <SearchItem label="Modern CRM Dashboard" delay={0.25} />
           <SearchItem label="Tailwind Animation Lib" delay={0.3} />
        </div>
      </motion.div>
    </motion.div>
  );
}

const SearchItem = ({ label, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ x: 5 }}
    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#262626] cursor-pointer transition-colors group"
  >
    <div className="w-8 h-8 bg-[#262626] group-hover:bg-[#424242] rounded-lg flex items-center justify-center transition-colors">
      <Command size={14} className="text-[#595959] group-hover:text-white" />
    </div>
    <span className="text-sm text-[#777777] group-hover:text-white font-medium transition-colors">
      {label}
    </span>
  </motion.div>
);