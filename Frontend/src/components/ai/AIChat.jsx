import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAIStream } from '../../hooks/useAIStream';

// Added onBuildComplete prop
export default function AIChat({ sandboxID, onBuildComplete }) {
  const { messages, streaming, sendMessage, clearChat } = useAIStream(sandboxID);
  const bottomRef = useRef(null);
  const prevStreaming = useRef(streaming);

  // TRIGGER: Automatic Preview Update
  useEffect(() => {
    // If we were streaming and now we stopped, the AI is done writing files.
    if (prevStreaming.current === true && streaming === false) {
      if (onBuildComplete) onBuildComplete();
    }
    prevStreaming.current = streaming;
  }, [streaming, onBuildComplete]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  return (
    <div className="flex flex-col h-full bg-[#EBE0CF] relative text-[#34170A] font-sans selection:bg-[#A35100]/20">
      <div className="h-24 px-8 border-b border-[#A35100]/10 flex items-center justify-between bg-[#FDF3E4]/60 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#A35100]" />
            {streaming && (
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.4, 0] }} 
                transition={{ duration: 1.5, repeat: Infinity }} 
                className="absolute w-2.5 h-2.5 bg-[#A35100] rounded-full" 
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Agent Dialogue</span>
            <span className="text-base font-serif italic">Collective Intelligence</span>
          </div>
        </div>
        <button onClick={clearChat} className="p-3 hover:bg-red-500/10 rounded-full text-[#A35100]/30 hover:text-red-600 transition-all">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh] flex flex-col items-center justify-center text-center opacity-30">
                <Sparkles className="mb-6 text-[#A35100]" size={40} />
                <h3 className="text-2xl font-serif italic">Awaiting your directive</h3>
              </motion.div>
            ) : (
              messages.map((msg, i) => (
                <ChatMessage 
                   key={msg.id || i} 
                   message={{ ...msg, streaming: streaming && i === messages.length - 1 && msg.role === 'ai' }} 
                />
              ))
            )}
          </AnimatePresence>
          <div ref={bottomRef} className="h-10" />
        </div>
      </div>

      <div className="pt-2 pb-10 bg-gradient-to-t from-[#EBE0CF] via-[#EBE0CF] to-transparent">
        <ChatInput onSend={sendMessage} disabled={streaming} />
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A3510020; border-radius: 10px; }
      `}</style>
    </div>
  );
}