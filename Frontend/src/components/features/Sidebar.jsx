import React from 'react';
import { 
  Monitor, History, Plus, Layout, Grid, Settings, 
  Sparkles, LogOut, LogIn, PanelLeftClose, PanelLeftOpen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isCollapsed, setIsCollapsed, activeTab, setActiveTab, onSettings, onLogin, onLogout, isAuthenticated, user }) {
  const menu = [
    { label: 'Explore', items: [{ id: 'Playground', icon: Monitor }, { id: 'History', icon: History }] },
    { label: 'Build', items: [{ id: 'New app', icon: Plus }, { id: 'My apps', icon: Layout }, { id: 'Gallery', icon: Grid }] }
  ];

  return (
    <aside className="flex flex-col h-full bg-[#050505] transition-all duration-300">
      {/* Header */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-8 h-8 shrink-0 bg-white rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <Sparkles className="text-black" size={18} />
          </motion.div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-lg tracking-tight text-white whitespace-nowrap"
            >
              Nexx
            </motion.span>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)} 
            className="p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-white transition-colors"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {/* Manual Toggle for Collapsed State */}
      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mb-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 px-3 space-y-6 mt-4">
        {menu.map((group) => (
          <div key={group.label}>
            {!isCollapsed ? (
              <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.2em] px-3 mb-2">
                {group.label}
              </p>
            ) : (
              <div className="h-px bg-white/5 mx-2 mb-4" />
            )}
            
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    title={isCollapsed ? item.id : ''}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {/* Active Background Glow */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeBackground"
                        className="absolute inset-0 bg-white/10 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <item.icon size={20} className={`relative z-10 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                    
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium relative z-10"
                      >
                        {item.id}
                      </motion.span>
                    )}

                    {/* Active Indicator Dot */}
                    {isActive && isCollapsed && (
                      <motion.div 
                        layoutId="activeDot"
                        className="absolute -left-1 w-1 h-4 bg-white rounded-full" 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Auth */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <button 
          onClick={onSettings} 
          title={isCollapsed ? "Settings" : ""}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-2.5 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5`}
        >
          <Settings size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </button>

        {isAuthenticated ? (
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2 bg-white/[0.03] rounded-2xl border border-white/5`}>
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${user?.name || 'user'}`} 
                className="w-8 h-8 rounded-full bg-white/10 border border-white/10 shrink-0" 
                alt="user" 
              />
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                  <p className="text-[11px] font-bold text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-[9px] text-green-500 font-medium">Pro Plan</p>
                </motion.div>
              )}
            </div>
            {!isCollapsed && (
              <button 
                onClick={onLogout} 
                className="p-2 text-white/20 hover:text-red-400 transition-colors hover:bg-red-400/10 rounded-lg"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            title={isCollapsed ? "Sign In" : ""}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold transition-all shadow-lg shadow-white/5 ${isCollapsed ? 'px-0' : 'px-4'}`}
          >
            <LogIn size={18} />
            {!isCollapsed && <span className="text-xs uppercase tracking-wider">Sign In</span>}
          </motion.button>
        )}
      </div>
    </aside>
  );
}