import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkle } from 'lucide-react';

export default function ChatInput({ onSend, disabled, isMobile }) {
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, isMobile ? 120 : 200)}px`;
    }
  }, [value, isMobile]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative bg-[#FDF3E4] border border-[#A35100]/20 rounded-3xl shadow-xl shadow-[#34170A]/5 overflow-hidden transition-all focus-within:border-[#A35100]/50 focus-within:shadow-[#A35100]/5">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Describe your vision..."
          className="w-full bg-transparent border-none outline-none text-[15px] p-5 pb-1 text-[#34170A] placeholder-[#34170A]/20 resize-none min-h-[60px] custom-scrollbar"
          rows={1}
        />
        
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-2 opacity-40">
            <Sparkle size={10} className={disabled ? 'animate-spin text-[#A35100]' : ''} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              {disabled ? 'Synthesizing...' : 'Vision Engine Ready'}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={`p-2.5 rounded-full transition-all ${
              value.trim() && !disabled 
                ? 'bg-[#34170A] text-[#FDF3E4] shadow-lg' 
                : 'bg-[#34170A]/5 text-[#34170A]/20'
            }`}
          >
            {disabled ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}