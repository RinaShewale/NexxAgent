import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Image as ImageIcon, Plus, ArrowUpRight } from 'lucide-react';

export default function HeroSection({ prompt, setPrompt, onGenerate, error }) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
          Build <span className="text-[#424242] italic font-serif">fast.</span>
        </h1>
        <p className="text-[#777777] text-lg md:text-xl max-w-xl mx-auto mb-12 font-medium">
          The AI engine for high-performance interfaces. Just describe your vision.
        </p>
      </motion.div>

      <div className="w-full relative group">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[32px] p-2 shadow-2xl focus-within:border-[#424242] transition-all duration-500">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Build a finance dashboard with dark mode..."
            className="w-full bg-transparent border-none outline-none p-6 text-xl text-white placeholder-[#262626] resize-none h-40"
          />
          
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-1">
              <button className="p-3 text-[#424242] hover:text-white transition-colors"><Mic size={20}/></button>
              <button className="p-3 text-[#424242] hover:text-white transition-colors"><ImageIcon size={20}/></button>
              <button className="p-3 text-[#424242] hover:text-white transition-colors"><Plus size={20}/></button>
            </div>

            <button 
              onClick={onGenerate}
              className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-[#e5e5e5] transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              <span>Generate</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
        
        {error && <p className="absolute -bottom-8 left-6 text-red-500 text-xs font-medium">{error}</p>}
      </div>

      <div className="mt-12 flex gap-3 flex-wrap justify-center">
        {['SaaS Dashboard', 'Mobile App', 'Landing Page'].map((hint) => (
          <button 
            key={hint} 
            onClick={() => setPrompt(hint)}
            className="px-4 py-2 rounded-full border border-[#1a1a1a] text-[#424242] text-xs font-bold hover:border-[#424242] hover:text-white transition-all"
          >
            {hint}
          </button>
        ))}
      </div>
    </div>
  );
}