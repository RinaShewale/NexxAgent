import React from 'react';
import { Search, Bell, Menu, ChevronRight } from 'lucide-react';

export default function TopNav({ onSearch, onNotify, onMenuClick, activeTab }) {
  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-white/40">App</span>
          <ChevronRight size={14} className="text-white/20" />
          <span className="text-white font-medium">{activeTab}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Modern Search Trigger */}
        <button 
          onClick={onSearch} 
          className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/20 transition-all text-sm group"
        >
          <Search size={14} className="group-hover:scale-110 transition-transform" />
          <span className="pr-8">Quick search...</span>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded opacity-50">⌘K</kbd>
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-2" />

        <button onClick={onNotify} className="p-2 text-white/40 hover:text-white relative transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </button>
      </div>
    </header>
  );
}