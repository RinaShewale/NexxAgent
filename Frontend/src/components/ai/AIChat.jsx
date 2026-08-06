import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2, Zap, MessageSquare } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAIStream } from '../../hooks/useAIStream';
import useSandboxStore from '../../store/sandboxStore';

export default function AIChat({ sandboxID, onFilesChanged }) {
  const { initialPrompt, setInitialPrompt } = useSandboxStore();
  const { messages, streaming, error, sendMessage, clearChat } = useAIStream(sandboxID);
  const bottomRef = useRef(null);
  const hasTriggeredInitial = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  useEffect(() => {
    if (initialPrompt && !hasTriggeredInitial.current && messages.length === 0 && sandboxID) {
      hasTriggeredInitial.current = true;
      const promptToSend = initialPrompt;
      setInitialPrompt('');
      sendMessage(promptToSend);
    }
  }, [initialPrompt, sandboxID, messages.length, sendMessage, setInitialPrompt]);

  return (
    <div className="flex flex-col h-full bg-[#000] relative text-zinc-300">
      {/* Premium Header */}
      <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
            {streaming && (
              <motion.div 
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 rounded-full"
              />
            )}
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Nexx Agent v4.0</span>
        </div>
        
        <button 
          onClick={clearChat} 
          className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-all group"
          title="Clear History"
        >
          <Trash2 size={16} className="group-active:scale-90 transition-transform" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
                <Sparkles className="text-white" size={28} />
                <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">How can I help you build?</h3>
              <p className="text-sm text-zinc-500 mt-2 max-w-[280px] leading-relaxed">
                Describe a feature, ask for code, or let me debug your interface.
              </p>
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

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-3"
          >
            <Zap size={14} />
            {error}
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Bottom Input Section */}
      <div className="p-6 pt-0 bg-gradient-to-t from-black via-black to-transparent">
        <ChatInput onSend={sendMessage} disabled={streaming} />
      </div>
    </div>
  );
}