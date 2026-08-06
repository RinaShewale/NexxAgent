import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Command, 
  Clock, 
  ArrowRight, 
  Layout, 
  History, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const recentItems = [
    { id: 1, title: 'Portfolio Dashboard', type: 'Project', icon: Layout },
    { id: 2, title: 'Finance App UI', type: 'History', icon: History },
  ];

  const quickActions = [
    { id: 3, title: 'Generate new app...', icon: Sparkles, color: 'text-purple-400' },
    { id: 4, title: 'View Documentation', icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md p-4 pt-[12vh]"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: -20, scale: 0.98, opacity: 0 }} 
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: -20, scale: 0.98, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="max-w-2xl mx-auto bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Section */}
        <div className="relative flex items-center px-6 border-b border-white/5 bg-white/[0.02]">
          <Search size={20} className="text-white/20" />
          <input 
            autoFocus 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, actions, or tools..." 
            className="w-full bg-transparent p-6 outline-none text-lg text-white placeholder-white/20 font-medium" 
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:block text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white/40 font-sans">ESC</kbd>
          </div>
        </div>

        {/* Results Body */}
        <div className="max-h-[450px] overflow-y-auto p-2 custom-scrollbar">
          
          {/* Quick Actions Group */}
          <section className="mb-4">
            <h3 className="px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">Quick Actions</h3>
            {quickActions.map((item) => (
              <SearchItem key={item.id} icon={item.icon} title={item.title} iconClass={item.color} />
            ))}
          </section>

          {/* Recent Group */}
          <section className="mb-2">
            <h3 className="px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">Recent</h3>
            {recentItems.map((item) => (
              <SearchItem 
                key={item.id} 
                icon={item.icon} 
                title={item.title} 
                badge={item.type} 
                rightIcon={<Clock size={14} />} 
              />
            ))}
          </section>

          {/* Empty State when typing */}
          {query && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Search size={20} className="text-white/20" />
              </div>
              <p className="text-sm text-white/40">No exact matches for <span className="text-white">"{query}"</span></p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-4">
            <FooterKey hint="Navigate" keys={['↑', '↓']} />
            <FooterKey hint="Open" keys={['↵']} />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/20 font-medium italic">
            <Command size={10} /> Powered by Nexx Search
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Sub-component for individual search rows
function SearchItem({ icon: Icon, title, badge, rightIcon, iconClass = "text-white/40" }) {
  return (
    <div className="flex items-center justify-between p-3 px-4 hover:bg-white/5 rounded-xl cursor-pointer group transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${iconClass}`}>
          <Icon size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{title}</span>
          {badge && <span className="text-[10px] text-white/20 group-hover:text-white/40">{badge}</span>}
        </div>
      </div>
      
      <div className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all">
        {rightIcon || <ArrowRight size={16} />}
      </div>
    </div>
  );
}

// Sub-component for Footer instructions
function FooterKey({ hint, keys }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/20 font-medium">{hint}</span>
      <div className="flex gap-1">
        {keys.map(k => (
          <kbd key={k} className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white/40 min-w-[1.2rem] text-center">
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}