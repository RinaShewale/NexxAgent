import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Copy } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  
  const elements = useMemo(() => {
    return message.content.split(/(```[\w]*\n?[\s\S]*?```)/g).map((part, i) => {
      if (part.startsWith('```')) {
        const lang = part.match(/^```(\w+)/)?.[1] || 'code';
        const code = part.replace(/^```[\w]*\n?/, '').replace(/```$/, '').trim();
        
        return (
          <div key={i} className="my-6 rounded-xl border border-[#A35100]/10 bg-[#34170A] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#FDF3E4]/40">{lang}</span>
              <button className="text-[#FDF3E4]/40 hover:text-[#FDF3E4] transition-colors"><Copy size={12} /></button>
            </div>
            <pre className="p-5 overflow-x-auto font-mono text-[12px] leading-relaxed text-[#FDF3E4]/90">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={i} className="space-y-4 text-[14px] leading-relaxed">
          {part.split('\n').map((line, idx) => (
            <p key={idx} className={isUser ? 'text-right' : 'text-left'}>{line}</p>
          ))}
        </div>
      );
    });
  }, [message.content, isUser]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: isUser ? 10 : -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col gap-3 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div className={`flex items-center gap-3 mb-1 opacity-40`}>
        {!isUser && <Sparkles size={12} className="text-[#A35100]" />}
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">
          {isUser ? 'Contributor' : 'Nexus Mind'}
        </span>
        {isUser && <User size={12} className="text-[#A35100]" />}
      </div>

      <div className={`relative w-full max-w-[90%] px-1 transition-all ${
        !isUser ? 'border-l-2 border-[#A35100] pl-6' : 'pr-2'
      }`}>
        <div className="text-[#34170A] font-medium leading-relaxed">
          {elements}
          {message.streaming && (
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1 h-4 bg-[#A35100] ml-2" 
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}