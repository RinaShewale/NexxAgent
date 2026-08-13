import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2, Zap } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAIStream } from '../../hooks/useAIStream';

export default function AIChat({ sandboxID }) {
  const { messages, streaming, error, sendMessage, clearChat } = useAIStream(sandboxID);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  return (
    <div className="flex flex-col h-full bg-[#EBE0CF] relative text-[#34170A] font-sans">
      {/* Header: Nexus Spine Style */}
      <div className="h-20 px-8 border-b border-[#A35100]/10 flex items-center justify-between bg-[#FDF3E4]/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#A35100]" />
            {streaming && (
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute w-2 h-2 bg-[#A35100] rounded-full"
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Agent Dialogue</span>
            <span className="text-sm font-serif italic">Collective Intelligence</span>
          </div>
        </div>
        
        <button 
          onClick={clearChat} 
          className="p-2 hover:bg-[#A35100]/5 rounded-full text-[#A35100]/40 hover:text-[#A35100] transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center opacity-40"
            >
              <Sparkles className="mb-4 text-[#A35100]" size={32} />
              <h3 className="text-xl font-serif italic">Awaiting your directive</h3>
              <p className="text-[10px] uppercase tracking-widest mt-2 max-w-[200px]">Architecting the next epoch of interaction.</p>
            </motion.div>
          ) : (
            messages.map((msg, i) => (
              <ChatMessage 
                key={msg.id || i}
                message={{ 
                  ...msg, 
                  streaming: streaming && i === messages.length - 1 && msg.role === 'ai' 
                }} 
              />
            ))
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Section */}
      <div className="p-6 bg-gradient-to-t from-[#EBE0CF] to-transparent">
        <ChatInput onSend={sendMessage} disabled={streaming} />
      </div>
    </div>
  );
}