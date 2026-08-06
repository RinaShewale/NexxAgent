import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence here
import { Sparkles, Mic, Image as ImageIcon, Plus, ArrowRight, Zap } from 'lucide-react';

export default function HeroSection({ prompt, setPrompt, onGenerate, error }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest mb-6">
          <Zap size={10} className="text-yellow-500 fill-yellow-500" />
          <span>New: Nexx Engine v4.0</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Vision into <span className="text-white/40 italic">Interface.</span>
        </h1>
      </motion.div>

      <div className="w-full max-w-3xl relative">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-white/20 transition-all">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe an interface (e.g., 'A minimalist crypto wallet with glassmorphism'...)"
            className="w-full bg-transparent border-none outline-none p-5 text-lg text-white placeholder-white/20 resize-none h-32 custom-scrollbar"
          />
          
          <div className="flex items-center justify-between p-2 pt-0">
            <div className="flex items-center gap-1">
              <IconButton icon={<Mic size={18}/>} />
              <IconButton icon={<ImageIcon size={18}/>} />
              <IconButton icon={<Plus size={18}/>} />
            </div>

            <button 
              onClick={onGenerate}
              className="flex items-center gap-2 bg-white text-black pl-5 pr-3 py-2.5 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95 group"
            >
              <span className="text-sm">Generate</span>
              <div className="bg-black text-white p-1 rounded-lg group-hover:translate-x-1 transition-transform">
                <ArrowRight size={14} />
              </div>
            </button>
          </div>
        </div>
        
        {/* The component that caused the error */}
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="absolute -bottom-10 left-4 text-red-400 text-xs font-medium bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex gap-2 flex-wrap justify-center opacity-40 hover:opacity-100 transition-opacity">
        {['E-commerce App', 'Portfolio', 'AI Dashboard'].map((hint) => (
          <button 
            key={hint} 
            onClick={() => setPrompt(hint)}
            className="px-4 py-1.5 rounded-lg border border-white/10 text-white/60 text-xs font-medium hover:border-white/40 hover:text-white transition-all"
          >
            {hint}
          </button>
        ))}
      </div>
    </div>
  );
}

const IconButton = ({ icon }) => (
  <button className="p-2.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all">
    {icon}
  </button>
);