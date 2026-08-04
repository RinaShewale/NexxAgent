import { motion, AnimatePresence } from 'framer-motion';
import { getFileIcon } from '../../utils/getFileIcon';

export default function EditorTabs({ openFiles, activeFile, onSelect, onClose }) {
  return (
    <div className="flex items-center bg-[#0D0E10] border-b border-[#282728] overflow-x-auto scrollbar-none h-11 no-scrollbar">
      <AnimatePresence mode="popLayout">
        {openFiles.map((file) => {
          const name = file.path.split('/').pop();
          const { icon, color } = getFileIcon(name);
          const isActive = file.path === activeFile;

          return (
            <motion.div
              key={file.path}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => onSelect(file.path)}
              className={`
                group relative flex items-center gap-2.5 px-4 h-full cursor-pointer 
                transition-all duration-200 border-r border-[#282728] min-w-max select-none
                ${isActive ? 'bg-[#161618]' : 'hover:bg-[#161618]/50'}
              `}
            >
              {/* File Icon with Muted Opacity when inactive */}
              <span 
                className={`text-[12px] transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70'}`}
                style={{ color: isActive ? color : '#818263' }}
              >
                {icon}
              </span>

              {/* Filename with Tracking Tight for Premium Feel */}
              <span className={`
                text-[12px] font-medium tracking-tight truncate max-w-[140px] transition-colors
                ${isActive ? 'text-[#F8FAFA]' : 'text-[#818263] group-hover:text-[#C5C6C8]'}
              `}>
                {name}
              </span>

              {/* Dirty State Indicator (LED style) */}
              {file.isDirty && (
                <div className="flex items-center justify-center ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5C6C8] shadow-[0_0_8px_rgba(197,198,200,0.4)]" />
                </div>
              )}

              {/* Functional Close Button */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClose(file.path); 
                }} 
                className={`
                  p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200
                  hover:bg-[#282728] text-[#4F5052] hover:text-[#F8FAFA] ml-1
                `}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Framer Motion Active Tab Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F8FAFA] shadow-[0_0_10px_rgba(248,250,250,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide scrollbar but keep functionality */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}