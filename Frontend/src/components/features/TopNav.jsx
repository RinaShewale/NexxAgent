import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export default function TopNav({ onSearch, onNotify, onMenuClick }) {
  return (
    <header className="flex items-center justify-between lg:justify-end px-6 md:px-10 h-24 sticky top-0 z-40 bg-black/20 backdrop-blur-md">
      <button onClick={onMenuClick} className="lg:hidden p-3 text-white bg-[#111] rounded-xl border border-[#1a1a1a]">
        <Menu size={20} />
      </button>
      
      <div className="flex items-center gap-4">
        <button onClick={onSearch} className="p-3 text-[#595959] hover:text-white transition-colors">
          <Search size={20} />
        </button>
        <button onClick={onNotify} className="p-3 text-[#595959] hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full border-2 border-black" />
        </button>
      </div>
    </header>
  );
}