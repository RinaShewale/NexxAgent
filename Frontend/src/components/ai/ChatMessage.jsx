import { useEffect, useRef } from 'react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const codeBlockRef = useRef(null);

  // Very basic code block rendering — split on triple backtick
  const parts = message.content.split(/(```[\w]*\n?[\s\S]*?```)/g);

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isUser ? 'bg-violet-600 text-white' : 'bg-gradient-to-br from-blue-600 to-violet-700 text-white'
      }`}>
        {isUser ? 'U' : '✦'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
        isUser
          ? 'bg-violet-600/25 border border-violet-500/30 text-violet-100'
          : 'bg-white/5 border border-white/8 text-gray-200'
      }`}>
        {parts.map((part, i) => {
          if (part.startsWith('```')) {
            const code = part.replace(/^```[\w]*\n?/, '').replace(/```$/, '');
            return (
              <pre key={i} className="mt-2 mb-2 bg-black/40 rounded-lg p-2.5 overflow-x-auto text-[11px] text-emerald-300 border border-white/5 scrollbar-thin">
                <code>{code}</code>
              </pre>
            );
          }
          return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
        })}
        {/* Streaming cursor */}
        {message.streaming && (
          <span className="inline-block w-1.5 h-3 bg-violet-400 ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}
