import React from 'react';
import { motion } from 'framer-motion';

const WorkDetail = () => {
  const tags = ["Branding", "UI/UX", "WebGL", "2024"];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-7xl md:text-9xl font-medium tracking-tighter"
            >
              Nova <span className="text-zinc-600">Bank</span>
            </motion.h1>
            <p className="mt-8 text-xl text-zinc-400">
              A digital-first banking platform for the next generation of investors.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs uppercase tracking-widest text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Large Imagery Area */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full aspect-video bg-zinc-900 rounded-3xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
          <div className="absolute bottom-10 left-10">
             <p className="text-sm font-mono text-zinc-500">// DISPLAY_CASE_04</p>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <h4 className="text-zinc-500 uppercase text-xs font-bold tracking-[0.2em] mb-4">The Mission</h4>
            <p className="text-zinc-300 leading-relaxed">
              To simplify complex financial data into beautiful, actionable 
              visualizations that empower users to grow their wealth.
            </p>
          </div>
          <div className="md:col-span-2">
             <h4 className="text-zinc-500 uppercase text-xs font-bold tracking-[0.2em] mb-4">Outcome</h4>
             <p className="text-3xl font-light text-zinc-200">
               Delivered a 40% increase in user engagement and won the "App of the Year" 
               at the Digital Excellence Awards.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;