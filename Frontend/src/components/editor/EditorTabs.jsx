import { AnimatePresence } from "framer-motion";

export default function EditorTabs({ openFiles, activeFile, onSelect, onClose }) {
  return (
    <div className="flex items-center bg-[#FDF3E4]/80 backdrop-blur-md border-b border-[#A35100]/20 overflow-x-auto h-12 no-scrollbar">
      <AnimatePresence mode="popLayout">
        {openFiles.map((file) => {
          const name = file.path.split('/').pop();
          const isActive = file.path === activeFile;

          return (
            <motion.div
              key={file.path}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => onSelect(file.path)}
              className={`
                group relative flex items-center gap-3 px-6 h-full cursor-pointer 
                transition-all border-r border-[#A35100]/10 min-w-max select-none
                ${isActive ? 'bg-white shadow-[0_-4px_10px_rgba(163,81,0,0.05)]' : 'hover:bg-white/50'}
              `}
            >
              <span className={`
                text-[10px] font-bold uppercase tracking-[0.15em] transition-colors
                ${isActive ? 'text-[#A35100]' : 'text-[#A35100]/50'}
              `}>
                {name}
              </span>

              {file.isDirty && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#A35100]" 
                />
              )}

              <motion.button 
                whileHover={{ scale: 1.2, color: '#ef4444' }}
                onClick={(e) => { e.stopPropagation(); onClose(file.path); }} 
                className={`p-1 rounded-full ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <X size={12} className="text-[#A35100]/40" />
              </motion.button>

              {isActive && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#A35100]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}