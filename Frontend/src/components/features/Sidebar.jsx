import React from 'react';
import { Monitor, History, Plus, Layout, Grid, Settings, Sparkles, LogIn, LogOut, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onSettings, onLogin, onLogout, isAuthenticated, user }) {
  const menu = [
    { label: 'Explore', items: [{ id: 'Playground', icon: Monitor }, { id: 'History', icon: History }] },
    { label: 'Build', items: [{ id: 'New app', icon: Plus }, { id: 'My apps', icon: Layout }, { id: 'Gallery', icon: Grid }] }
  ];

  return (
    <aside className="flex flex-col h-full bg-[#050505] border-r border-[#1a1a1a]">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-white/10 shadow-xl">
            <Sparkles className="text-black" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">Nexx</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-8">
        {menu.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold text-[#424242] uppercase tracking-[0.2em] px-4 mb-3">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === item.id ? 'bg-[#1a1a1a] text-white' : 'text-[#777777] hover:text-white hover:bg-[#1a1a1a]/40'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.id}</span>
                  {activeTab === item.id && <ChevronRight size={14} className="ml-auto opacity-40" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a] space-y-4">
        <button onClick={onSettings} className="w-full flex items-center gap-3 px-4 py-2 text-[#777777] hover:text-white transition-colors">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-2xl border border-[#1a1a1a]">
            <div className="flex items-center gap-3 min-w-0">
              <img src={user?.avatar || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full bg-[#222]" alt="user" />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-[#424242] truncate">Pro Plan</p>
              </div>
            </div>
            <button onClick={onLogout} className="p-2 text-[#424242] hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
}