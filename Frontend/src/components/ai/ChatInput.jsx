
// ChatInput.js
import { useState, useRef } from 'react';
import Spinner from '../shared/Spinner';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  return (
    <div className="p-4 bg-[#020617] border-t border-white/5">
      <div className="relative flex items-end gap-2 bg-slate-900/50 border border-white/10 rounded-2xl p-2 focus-within:border-teal-500/50 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask NexxAgent..."
          className="flex-1 bg-transparent border-none outline-none text-xs p-2 text-slate-200 resize-none max-h-32 scrollbar-none"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-500 transition-all disabled:opacity-20 shadow-lg shadow-teal-600/20"
        >
          {disabled ? <Spinner size="sm" className="text-white" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
        </button>
      </div>
    </div>
  );
}