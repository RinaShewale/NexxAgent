import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  
  // Advanced splitting for code blocks and basic markdown patterns
  const elements = useMemo(() => {
    return message.content.split(/(```[\w]*\n?[\s\S]*?```)/g).map((part, i) => {
      // Handle Code Blocks
      if (part.startsWith('```')) {
        const lang = part.match(/^```(\w+)/)?.[1] || 'code';
        const code = part.replace(/^```[\w]*\n?/, '').replace(/```$/, '').trim();
        
        return (
          <div key={i} className="my-4 group relative">
            <div className="absolute top-0 right-4 -translate-y-1/2 px-2 py-0.5 bg-[#282728] border border-[#4F5052] rounded text-[9px] font-bold text-[#818263] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {lang}
            </div>
            <pre className="bg-[#0D0E10] rounded-xl p-4 overflow-x-auto border border-[#282728] shadow-inner font-mono text-[11px] leading-relaxed text-[#C5C6C8] scrollbar-none">
              <code className="block">{code}</code>
            </pre>
          </div>
        );
      }

      // Handle Text Content with Basic Markup (Bold and Lists)
      return (
        <div key={i} className="space-y-2 text-[13px] leading-relaxed text-[#C5C6C8] whitespace-pre-wrap">
          {part.split('\n').map((line, lineIdx) => {
            // Check for Bold: **text**
            let processedLine = line.split(/(\*\*.*?\*\*)/g).map((segment, segIdx) => {
              if (segment.startsWith('**') && segment.endsWith('**')) {
                return <strong key={segIdx} className="text-[#F8FAFA] font-semibold">{segment.slice(2, -2)}</strong>;
              }
              return segment;
            });

            // Check for Bullet points: "- "
            if (line.trim().startsWith('- ')) {
              return (
                <div key={lineIdx} className="flex gap-3 pl-2">
                  <span className="text-[#818263] mt-1.5 w-1 h-1 rounded-full bg-[#4F5052] shrink-0" />
                  <span className="flex-1">{processedLine.slice(1)}</span>
                </div>
              );
            }

            return <p key={lineIdx}>{processedLine}</p>;
          })}
        </div>
      );
    });
  }, [message.content]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse pl-12' : 'flex-row pr-12'}`}
    >
      {/* Avatar Design */}
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all border ${
        isUser 
          ? 'bg-[#161618] border-[#282728] text-[#818263]' 
          : 'bg-[#F8FAFA] border-[#F8FAFA] text-[#0D0E10] shadow-[0_0_15px_rgba(248,250,250,0.2)]'
      }`}>
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        )}
      </div>

      {/* Message Body */}
      <div className={`flex flex-col gap-1 max-w-full ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-1 py-1 text-[9px] font-bold uppercase tracking-[0.2em] mb-1 ${isUser ? 'text-[#4F5052]' : 'text-[#818263]'}`}>
          {isUser ? 'You' : 'Agent'}
        </div>
        
        <div className={`relative px-4 py-3 rounded-2xl border transition-all duration-300 ${
          isUser
            ? 'bg-[#161618]/50 border-[#282728] text-[#F8FAFA]'
            : 'bg-[#161618] border-[#282728] shadow-sm'
        }`}>
          {elements}
          
          {/* Enhanced Streaming Cursor */}
          {message.streaming && (
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
              className="inline-block w-[2px] h-[14px] bg-[#F8FAFA] align-middle ml-1 shadow-[0_0_8px_#F8FAFA]" 
            />
          )}
        </div>

        {/* Timestamp or Status Placeholder (Subtle UX hint) */}
        {!isUser && !message.streaming && (
          <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-bold text-[#4F5052] uppercase tracking-widest">
              Verified by Agent v1.0
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}