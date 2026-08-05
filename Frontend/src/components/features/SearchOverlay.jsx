import React from 'react';
import { motion } from 'framer-motion';
import { Search, Command } from 'lucide-react';

export default function SearchOverlay({ onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl p-4 pt-[15vh]"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl mx-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-[32px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-8 border-b border-[#1a1a1a]">
          <Search size={22} className="text-[#424242]" />
          <input autoFocus placeholder="Search projects, components..." className="w-full bg-transparent p-8 outline-none text-xl text-white" />
          <kbd className="text-[10px] bg-[#1a1a1a] px-2 py-1 rounded text-[#424242]">ESC</kbd>
        </div>
        <div className="p-4 max-h-[400px] overflow-y-auto">
           <div className="p-4 hover:bg-[#111] rounded-2xl cursor-pointer flex items-center gap-4 group transition-all">
              <Command size={16} className="text-[#424242] group-hover:text-white" />
              <span className="text-sm text-[#777777] group-hover:text-white">Recent: Portfolio Dashboard</span>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}