import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFileIcon } from '../../utils/getFileIcon';

export default function FileTreeNode({ node, depth = 0, onFileClick }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isFolder = node.type === 'folder';
  
  const { icon, color } = getFileIcon(node.name);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isFolder) {
      setExpanded(!expanded);
    } else {
      onFileClick(node.path);
    }
  };

  return (
    <div className="select-none font-sans">
      <motion.div 
        onClick={handleClick}
        className={`group flex items-center gap-2 py-1 px-2 mx-1 rounded-md cursor-pointer transition-all duration-200 ${
          isFolder 
            ? 'text-[#C5C6C8] hover:bg-[#161618]' 
            : 'text-[#818263] hover:text-[#F8FAFA] hover:bg-[#161618]'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* Chevron */}
        {isFolder ? (
          <svg 
            className={`w-3 h-3 transition-transform duration-200 shrink-0 ${expanded ? 'rotate-90' : 'opacity-40'}`} 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <div className="w-3 shrink-0" />
        )}

        {/* Icon */}
        <div className="flex items-center justify-center w-4 h-4 shrink-0 opacity-80 group-hover:opacity-100">
          {isFolder ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={expanded ? "#F8FAFA" : "#818263"} strokeWidth="2">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
            </svg>
          ) : (
             <span className="text-[11px] font-mono font-bold" style={{ color: color || '#818263' }}>
               {typeof icon === 'string' && icon.length <= 2 ? icon : (
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/>
                 </svg>
               )}
             </span>
          )}
        </div>

        <span className="truncate text-[12px] tracking-tight font-medium">
          {node.name}
        </span>
      </motion.div>

      <AnimatePresence>
        {isFolder && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative"
          >
            <div 
              className="absolute top-0 bottom-0 left-0 w-[1px] bg-[#282728] opacity-50" 
              style={{ marginLeft: `${depth * 12 + 13}px` }} 
            />
            {node.children?.map(child => (
              <FileTreeNode key={child.path} node={child} depth={depth + 1} onFileClick={onFileClick} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}