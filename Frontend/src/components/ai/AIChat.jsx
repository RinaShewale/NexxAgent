import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAIStream } from '../../hooks/useAIStream';
import useSandboxStore from '../../store/sandboxStore';

export default function AIChat({ sandboxID, onFilesChanged }) {
  const { initialPrompt, setInitialPrompt } = useSandboxStore();
  const { messages, streaming, error, sendMessage, clearChat } = useAIStream(sandboxID);
  const bottomRef = useRef(null);
  const hasTriggeredInitial = useRef(false);
  const wasStreamingRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (wasStreamingRef.current && !streaming) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === 'ai') {
        onFilesChanged?.();
      }
    }
    wasStreamingRef.current = streaming;
  }, [streaming, messages, onFilesChanged]);

  useEffect(() => {
    if (initialPrompt && !hasTriggeredInitial.current && messages.length === 0 && sandboxID) {
      hasTriggeredInitial.current = true;
      const promptToSend = initialPrompt;
      setInitialPrompt('');
      sendMessage(promptToSend);
    }
  }, [initialPrompt, sandboxID, messages.length, sendMessage, setInitialPrompt]);

  return (
    <div className="flex flex-col h-full bg-[#0D0E10] relative selection:bg-[#F8FAFA]/10">
      {/* High-End Toolbar Header */}
      <div className="h-12 px-4 border-b border-[#282728] flex items-center justify-between bg-[#0D0E10]/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center relative">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F8FAFA] shadow-[0_0_8px_#F8FAFA]" />
            {streaming && (
              <motion.span 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-3 h-3 rounded-full border border-[#F8FAFA] opacity-50" 
              />
            )}
          </div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#818263]">
            Agent Assistant
          </h2>
        </div>
        
        <button 
          onClick={clearChat} 
          className="text-[10px] font-bold text-[#4F5052] hover:text-[#F8FAFA] transition-all uppercase tracking-tighter"
        >
          Clear History
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-custom">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col items-center justify-center text-center px-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#161618] border border-[#282728] flex items-center justify-center mb-6 shadow-2xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F8FAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
              </div>
              <h3 className="text-[15px] font-medium text-[#F8FAFA] tracking-tight">How can I assist you?</h3>
              <p className="text-[12px] text-[#818263] mt-2 leading-relaxed max-w-[220px] font-medium">
                I can generate components, debug logic, or refine your application structure.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatMessage 
                    message={{ 
                      ...msg, 
                      streaming: streaming && i === messages.length - 1 && msg.role === 'ai' 
                    }} 
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] font-medium flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-[#282728] bg-[#0D0E10]">
        <ChatInput onSend={sendMessage} disabled={streaming} />
        
        <div className="mt-3 flex items-center justify-center gap-4 opacity-30">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#282728]" />
          <span className="text-[9px] font-bold text-[#4F5052] uppercase tracking-[0.2em]">Context: Project Root</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#282728]" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-custom::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
          transition: background 0.3s;
        }
        .scrollbar-custom:hover::-webkit-scrollbar-thumb {
          background: #282728;
        }
      `}} />
    </div>
  );
}