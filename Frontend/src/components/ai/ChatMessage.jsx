import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Copy, Check } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  
  const elements = useMemo(() => {
    return message.content.split(/(```[\w]*\n?[\s\S]*?```)/g).map((part, i) => {
      if (part.startsWith('```')) {
        const lang = part.match(/^```(\w+)/)?.[1] || 'code';
        const code = part.replace(/^```[\w]*\n?/, '').replace(/```$/, '').trim();
        
        return (
          <div key={i} className="my-6 rounded-xl border border-white/10 bg-[#050505] overflow-hidden group/code shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{lang}</span>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <Copy size={14} />
              </button>
            </div>
            <pre className="p-5 overflow-x-auto font-mono text-[13px] leading-relaxed text-zinc-300">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={i} className="space-y-4 text-[14px] leading-relaxed text-zinc-300">
          {part.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      );
    });
  }, [message.content]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Stylized Avatar */}
      <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
        isUser 
          ? 'bg-zinc-900 border-white/10 text-zinc-500' 
          : 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
      }`}>
        {isUser ? <User size={18} /> : <Sparkles size={18} />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">
          {isUser ? 'Sender' : 'Nexx Intelligence'}
        </span>
        
        <div className={`relative px-1 py-1 rounded-2xl transition-all ${
          isUser ? 'text-zinc-100' : 'text-zinc-300'
        }`}>
          {elements}
          
          {/* Blue Glowing Cursor */}
          {message.streaming && (
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block w-1.5 h-4 bg-blue-500 ml-1 rounded-full shadow-[0_0_10px_#3b82f6]" 
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}