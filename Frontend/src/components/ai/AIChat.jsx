// AIChat.js
import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAIStream } from '../../hooks/useAIStream';
import Spinner from '../shared/Spinner';

export default function AIChat({ sandboxID, onFilesChanged }) {
  const { messages, streaming, error, sendMessage, clearChat } = useAIStream(sandboxID);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (!streaming && messages.length > 0 && messages[messages.length - 1]?.role === 'ai') onFilesChanged?.();
  }, [streaming]);

  return (
    <div className="flex flex-col h-full bg-[#020617]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Agent Assistant</span>
        </div>
        <button onClick={clearChat} className="text-[10px] text-slate-600 hover:text-slate-300 transition-colors uppercase font-bold tracking-tighter">Reset</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-slide-in">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 border border-teal-500/20">✦</div>
            <h3 className="text-sm font-semibold text-slate-200">How can I help today?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">I can generate code, fix bugs, or explain complex logic in your sandbox.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={msg.id} message={{ ...msg, streaming: streaming && i === messages.length - 1 && msg.role === 'ai' }} />
        ))}
        {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={streaming} />
    </div>
  );
}
