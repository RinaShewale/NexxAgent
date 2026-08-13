import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Copy, Check } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const elements = useMemo(() => {
    return message.content.split(/(```[\w]*\n?[\s\S]*?```)/g).map((part, i) => {
      if (part.startsWith('```')) {
        const lang = part.match(/^```(\w+)/)?.[1] || 'code';
        const code = part.replace(/^```[\w]*\n?/, '').replace(/```$/, '').trim();
        
        return (
          <div key={i} className="my-6 rounded-2xl border border-[#A35100]/10 bg-[#1A0B05] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-5 py-2.5 bg-black/20 border-b border-white/5">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FDF3E4]/30">{lang}</span>
              <button onClick={() => copyCode(code)} className="text-[#FDF3E4]/20 hover:text-[#FDF3E4] transition-colors">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-5 overflow-x-auto font-mono text-[13px] leading-relaxed text-[#FDF3E4]/90">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={i} className={`text-base leading-relaxed ${isUser ? 'text-[#34170A]' : 'font-serif italic text-[#34170A]/90'}`}>
          {part}
        </div>
      );
    });
  }, [message.content, isUser, copied]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-4 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border ${
          isUser ? 'bg-[#34170A] border-[#34170A]' : 'bg-[#A35100]/10 border-[#A35100]/20'
        }`}>
          {isUser ? <User size={14} className="text-[#FDF3E4]" /> : <Sparkles size={14} className="text-[#A35100]" />}
        </div>

        <div className={`
          ${isUser 
            ? 'bg-[#F7EDE0] border border-[#A35100]/10 px-5 py-3 rounded-2xl rounded-tr-none shadow-sm' 
            : 'pt-2 w-full'}
        `}>
          {elements}
          {message.streaming && (
            <span className="inline-block w-1.5 h-4 bg-[#A35100] ml-2 animate-pulse" />
          )}
        </div>
      </div>
    </motion.div>
  );
}