import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative bg-[#fdf9f3] border border-[#A35100]/15 rounded-[2rem] shadow-2xl shadow-[#34170A]/5 transition-all duration-500 overflow-hidden focus-within:border-[#A35100]/30">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Describe your vision..."
          className="w-full bg-transparent border-none outline-none text-base p-6 pb-2 text-[#34170A] placeholder-[#A35100]/25 resize-none min-h-[70px]"
          rows={1}
        />
        
        <div className="flex items-center justify-between px-6 pb-5">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${disabled ? 'bg-orange-500 animate-pulse' : 'bg-[#A35100]/20'}`} />
            <span className="text-[10px] font-black text-[#A35100]/40 uppercase tracking-[0.2em]">
              {disabled ? 'Synthesizing...' : 'Ready to build'}
            </span>
          </div>

          <motion.button
            whileHover={!disabled && value.trim() ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${
              value.trim() && !disabled 
                ? 'bg-[#A35100] text-[#FDF3E4] shadow-lg shadow-[#A35100]/20' 
                : 'bg-[#A35100]/5 text-[#A35100]/20 cursor-not-allowed'
            }`}
          >
            {disabled ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
            <span>Send</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}