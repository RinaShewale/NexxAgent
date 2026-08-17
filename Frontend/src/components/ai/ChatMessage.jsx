import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8 md:mb-10`}
    >
      <div className={`flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar: Smaller and cleaner on mobile */}
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border ${
          isUser ? 'bg-[#34170A] border-[#34170A]' : 'bg-white border-[#A35100]/20'
        }`}>
          {isUser ? <User size={12} className="text-[#FDF3E4]" /> : <Sparkles size={12} className="text-[#A35100]" />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 overflow-hidden`}>
          <div className={`${isUser ? 'bg-[#F7EDE0] border border-[#A35100]/10 px-4 py-3 rounded-2xl rounded-tr-none shadow-sm' : 'w-full'}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className={`mb-3 last:mb-0 leading-relaxed ${!isUser ? 'font-serif italic text-lg text-[#34170A]/90' : 'text-sm font-medium text-[#34170A]'}`}>
                    {children}
                  </p>
                ),
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  
                  return !inline && match ? (
                    <div className="relative my-4 rounded-xl overflow-hidden border border-[#A35100]/10 bg-[#1A0B05] shadow-lg max-w-full">
                      <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#FDF3E4]/40">{match[1]}</span>
                        <button onClick={() => copyToClipboard(codeString)} className="text-[#FDF3E4]/30 hover:text-white transition-colors">
                          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="overflow-x-auto custom-scrollbar">
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            fontSize: '12px',
                            backgroundColor: 'transparent',
                          }}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ) : (
                    <code className="bg-[#A35100]/10 text-[#A35100] px-1.5 py-0.5 rounded font-mono text-[11px] font-bold" {...props}>
                      {children}
                    </code>
                  );
                },
                ul: ({children}) => <ul className="list-disc ml-5 mb-3 space-y-1 text-sm text-[#34170A]/70">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal ml-5 mb-3 space-y-1 text-sm text-[#34170A]/70">{children}</ol>,
                h3: ({children}) => <h3 className="text-base font-serif font-bold mb-2 mt-4 text-[#34170A]">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
            
            {message.streaming && (
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-4 bg-[#A35100] ml-1 align-middle"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}