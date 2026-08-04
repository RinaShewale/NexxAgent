import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopNav({ onSearch, onNotify }) {
  return (
    <header className="flex items-center justify-end px-10 h-20">
      <div className="flex items-center gap-4">
        <button onClick={onSearch} className="p-2.5 text-[#595959] hover:text-white transition-colors">
          <Search size={20} />
        </button>
        <button onClick={onNotify} className="p-2.5 text-[#595959] hover:text-white transition-colors">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}