import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
    // Reset height if auto-expanding logic was applied
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const isActive = value.trim().length > 0 && !disabled;

  return (
    <div className="relative group p-0.5">
      {/* Background Glow Effect on Focus */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#282728] to-[#4F5052] rounded-[18px] opacity-0 group-focus-within:opacity-20 blur-sm transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative flex flex-col bg-[#161618] border border-[#282728] rounded-[16px] focus-within:border-[#4F5052] transition-all duration-300 shadow-2xl">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // Simple auto-expand logic
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={(e) => { 
            if (e.key === 'Enter' && !e.shiftKey) { 
              e.preventDefault(); 
              handleSend(); 
            } 
          }}
          placeholder="Describe a feature or fix..."
          className="w-full bg-transparent border-none outline-none text-[13px] leading-relaxed p-4 text-[#F8FAFA] placeholder-[#818263] resize-none min-h-[52px] max-h-40 scrollbar-none"
          rows={1}
        />
        
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0D0E10] border border-[#282728]">
               <div className={`w-1 h-1 rounded-full ${disabled ? 'bg-[#818263] animate-pulse' : 'bg-[#F8FAFA]'}`} />
               <span className="text-[9px] font-bold text-[#818263] uppercase tracking-widest">
                 {disabled ? 'Agent Thinking' : 'Ready'}
               </span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSend}
            disabled={!isActive}
            className={`flex items-center justify-center h-8 px-4 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all duration-300 ${
              isActive 
                ? 'bg-[#F8FAFA] text-[#0D0E10] hover:bg-[#C5C6C8] shadow-[0_0_15px_rgba(248,250,250,0.15)]' 
                : 'bg-[#282728] text-[#4F5052] cursor-not-allowed'
            }`}
          >
            <AnimatePresence mode="wait">
              {disabled ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Processing
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Subtle Hint Bar */}
      <div className="flex items-center justify-between mt-2 px-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500">
        <span className="text-[10px] text-[#4F5052] font-medium">
          Shift + Enter for new line
        </span>
        <div className="flex gap-1">
           <span className="px-1.5 py-0.5 rounded border border-[#282728] bg-[#161618] text-[9px] text-[#818263] font-bold">⌘</span>
           <span className="px-1.5 py-0.5 rounded border border-[#282728] bg-[#161618] text-[9px] text-[#818263] font-bold">ENTER</span>
        </div>
      </div>
    </div>
  );
}