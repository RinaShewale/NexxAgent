import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Image as ImageIcon, Plus } from 'lucide-react';
import ErrorBanner from '../shared/ErrorBanner';
export default function HeroSection({ prompt, setPrompt, onGenerate, error }) {
  return (
    <div className="flex flex-col items-center px-6 py-24 z-10">
      {error && <div className="mb-6 w-full max-w-3xl"><ErrorBanner message={error} /></div>}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4 text-white">
          Build <span className="text-[#777777]">ideas</span> with Nexx
        </h1>
        <p className="text-[#595959] text-lg">Instant software from your imagination.</p>
      </motion.div>

      <div className="w-full max-w-3xl relative group">
        {/* Glow effect changed from Teal to Grayscale (#424242) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#424242]/40 to-[#262626]/40 rounded-[32px] blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
        
        {/* Container BG: #000000 | Border: #262626 */}
        <div className="relative bg-[#000000] border border-[#262626] rounded-[32px] p-2 overflow-hidden shadow-2xl">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe an app... e.g. 'A real estate dashboard for investors'"
            className="w-full bg-transparent border-none outline-none p-6 text-xl font-light placeholder-[#424242] text-white resize-none h-44"
          />
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex gap-1">
              <InputIcon icon={<Mic size={18}/>} />
              <InputIcon icon={<ImageIcon size={18}/>} />
              <InputIcon icon={<Plus size={18}/>} />
            </div>
            {/* Generate Button: BG White | Hover: #777777 */}
            <button 
              onClick={onGenerate}
              disabled={!prompt.trim()}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-[#777777] hover:text-white transition-all disabled:opacity-20"
            >
              <Sparkles size={16} /> Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputIcon = ({ icon }) => (
  /* Icon buttons hover state: #262626 */
  <button className="p-3 text-[#595959] hover:text-white hover:bg-[#262626] rounded-xl transition-all">{icon}</button>
);