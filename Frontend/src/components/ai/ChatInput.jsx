import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

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
    <div className="w-full">
      <div className="relative flex flex-col bg-[#fdf9f3] border border-[#A35100]/10 rounded-2xl shadow-lg focus-within:shadow-xl transition-all duration-500 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
          }}
          onKeyDown={(e) => { 
            if (e.key === 'Enter' && !e.shiftKey) { 
              e.preventDefault(); 
              handleSend(); 
            } 
          }}
          placeholder="Describe your vision..."
          className="w-full bg-transparent border-none outline-none text-sm p-5 text-[#34170A] placeholder-[#A35100]/30 resize-none min-h-[60px]"
          rows={1}
        />
        
        <div className="flex items-center justify-between px-4 pb-4">
          <span className="text-[9px] font-bold text-[#A35100]/40 uppercase tracking-[0.2em] px-2">
            {disabled ? 'Synthesizing...' : 'Ready to build'}
          </span>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${
              value.trim() && !disabled 
                ? 'bg-[#A35100] text-[#FDF3E4] shadow-md shadow-[#A35100]/20' 
                : 'bg-[#A35100]/10 text-[#A35100]/30 cursor-not-allowed'
            }`}
          >
            {disabled ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
}










