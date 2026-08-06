import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Loader2 } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className="max-w-3xl mx-auto w-full group">
      <div className="relative flex flex-col bg-zinc-900/50 border border-white/10 rounded-[24px] focus-within:border-white/20 focus-within:bg-zinc-900/80 transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-md">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
          }}
          onKeyDown={(e) => { 
            if (e.key === 'Enter' && !e.shiftKey) { 
              e.preventDefault(); 
              handleSend(); 
            } 
          }}
          placeholder="Ask Nexx to build something..."
          className="w-full bg-transparent border-none outline-none text-sm leading-relaxed p-5 text-white placeholder-zinc-600 resize-none min-h-[60px] max-h-[200px]"
          rows={1}
        />
        
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">
               <Terminal size={12} className="text-zinc-500" />
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                 {disabled ? 'Processing...' : 'Ready'}
               </span>
            </div>
          </div>

          <motion.button
            whileHover={value.trim() ? { scale: 1.05 } : {}}
            whileTap={value.trim() ? { scale: 0.95 } : {}}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
              value.trim() && !disabled 
                ? 'bg-white text-black hover:bg-zinc-200' 
                : 'bg-white/5 text-zinc-700 cursor-not-allowed'
            }`}
          >
            {disabled ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            <span>Send</span>
          </motion.button>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
        <p className="text-[10px] text-zinc-600 font-medium tracking-tight">
          <span className="text-zinc-400">Shift + Enter</span> for new line
        </p>
      </div>
    </div>
  );
}