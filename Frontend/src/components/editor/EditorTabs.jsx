import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function EditorTabs({ openFiles, activeFile, onSelect, onClose }) {
  return (
    <div className="flex items-center bg-[#FDF3E4] border-b border-[#A35100]/10 overflow-x-auto h-14 no-scrollbar">
      <AnimatePresence mode="popLayout">
        {openFiles.map((file) => {
          const name = file.path.split('/').pop();
          const isActive = file.path === activeFile;

          return (
            <motion.div
              key={file.path}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => onSelect(file.path)}
              className={`
                group relative flex items-center gap-4 px-8 h-full cursor-pointer 
                transition-all border-r border-[#A35100]/5 min-w-max select-none
                ${isActive ? 'bg-white' : 'hover:bg-white/40'}
              `}
            >
              {/* Filename */}
              <span className={`
                text-[11px] font-bold uppercase tracking-widest transition-colors
                ${isActive ? 'text-[#A35100]' : 'text-[#A35100]/40 group-hover:text-[#A35100]/70'}
              `}>
                {name}
              </span>

              {/* Dirty State Dot */}
              {file.isDirty && (
                <div className="w-1 h-1 rounded-full bg-[#A35100]" />
              )}

              {/* Close Button */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClose(file.path); 
                }} 
                className={`
                  p-1 transition-all rounded hover:bg-[#A35100]/5
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  text-[#A35100]/40 hover:text-red-500
                `}
              >
                <X size={10} />
              </button>

              {/* Nexus Active Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A35100]"
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}