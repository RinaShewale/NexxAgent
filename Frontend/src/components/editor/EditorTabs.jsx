import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFileIcon } from '../../utils/getFileIcon';
import { X } from 'lucide-react';

export default function EditorTabs({ openFiles, activeFile, onSelect, onClose }) {
  return (
    <div className="flex items-center bg-[#000] border-b border-white/5 overflow-x-auto h-12 no-scrollbar">
      <AnimatePresence mode="popLayout">
        {openFiles.map((file) => {
          const name = file.path.split('/').pop();
          const { icon, color } = getFileIcon(name);
          const isActive = file.path === activeFile;

          return (
            <motion.div
              key={file.path}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => onSelect(file.path)}
              className={`
                group relative flex items-center gap-3 px-5 h-full cursor-pointer 
                transition-all border-r border-white/5 min-w-max select-none
                ${isActive ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'}
              `}
            >
              {/* File Icon */}
              <span 
                className={`text-[14px] transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60'}`}
                style={{ color: isActive ? color : 'inherit' }}
              >
                {icon}
              </span>

              {/* Filename */}
              <span className={`
                text-[12px] font-bold tracking-tight transition-colors
                ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}
              `}>
                {name}
              </span>

              {/* LED Dirty State */}
              {file.isDirty && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] ml-1" 
                />
              )}

              {/* Close Button */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClose(file.path); 
                }} 
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 text-zinc-500 hover:text-white ml-2"
              >
                <X size={12} />
              </button>

              {/* Active Underline Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}