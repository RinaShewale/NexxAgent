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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-10`}
    >
      <div className={`flex gap-4 md:gap-6 max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border shadow-sm ${
          isUser ? 'bg-[#34170A] border-[#34170A]' : 'bg-[#FDF3E4] border-[#A35100]/20'
        }`}>
          {isUser ? <User size={14} className="text-[#FDF3E4]" /> : <Sparkles size={14} className="text-[#A35100]" />}
        </div>

        {/* Message Body */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full overflow-hidden`}>
          <div className={`w-full ${isUser ? 'bg-[#F7EDE0] border border-[#A35100]/10 px-5 py-3 rounded-2xl rounded-tr-none shadow-sm' : ''}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className={`mb-4 last:mb-0 leading-relaxed ${!isUser ? 'font-serif italic text-[17px] text-[#34170A]/90' : 'text-sm text-[#34170A]'}`}>
                    {children}
                  </p>
                ),
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  
                  return !inline && match ? (
                    <div className="relative my-6 group rounded-xl overflow-hidden border border-[#A35100]/20 shadow-2xl">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#1A0B05] border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FDF3E4]/30">{match[1]}</span>
                        <button onClick={() => copyToClipboard(codeString)} className="hover:text-white transition-colors text-[#FDF3E4]/20">
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          padding: '1.25rem',
                          fontSize: '0.85rem',
                          backgroundColor: '#1A0B05', // Deep brown-black to match theme
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-[#A35100]/10 text-[#A35100] px-1.5 py-0.5 rounded font-mono text-xs font-bold" {...props}>
                      {children}
                    </code>
                  );
                },
                ul: ({children}) => <ul className="list-disc ml-6 mb-4 space-y-1 text-[#34170A]/80">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal ml-6 mb-4 space-y-1 text-[#34170A]/80">{children}</ol>,
                h3: ({children}) => <h3 className="text-lg font-serif mb-2 mt-4 text-[#34170A]">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
            
            {message.streaming && (
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-5 bg-[#A35100] ml-1 align-middle"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}