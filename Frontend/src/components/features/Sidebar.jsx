import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, History, Plus, Layout, Grid, Settings, Sparkles, LogOut, LogIn } from 'lucide-react';

export default function Sidebar({ 
  activeTab, setActiveTab, onSettings, isAuthenticated, user, onLogin, onLogout 
}) {
  const menuItems = [
    { section: 'Explore', items: [{ id: 'Playground', icon: <Monitor size={18}/> }, { id: 'History', icon: <History size={18}/> }] },
    { section: 'Build', items: [{ id: 'New app', icon: <Plus size={18}/> }, { id: 'My apps', icon: <Layout size={18}/> }, { id: 'Gallery', icon: <Grid size={18}/> }] }
  ];

  return (
    /* Sidebar BG: #000000 | Border: #262626 */
    <motion.aside className="hidden lg:flex flex-col w-64 border-r border-[#262626] bg-[#000000] p-4 z-30">
      <div className="flex items-center gap-3 mb-10 px-2">
        {/* Logo Box: #424242 */}
        <div className="w-8 h-8 bg-[#424242] rounded-lg flex items-center justify-center shadow-lg">
          <Sparkles className="text-white" size={18} />
        </div>
        <span className="font-bold tracking-tighter text-xl text-white">NexxAgent</span>
      </div>

      <nav className="flex-1 space-y-6">
        {menuItems.map((sec) => (
          <div key={sec.section}>
            {/* Section Header: #595959 */}
            <p className="text-[10px] font-bold text-[#595959] uppercase tracking-[0.2em] px-3 mb-2">{sec.section}</p>
            {sec.items.map((item) => (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                label={item.id} 
                active={activeTab === item.id} 
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* FOOTER AREA - Border: #262626 */}
      <div className="mt-auto space-y-2 border-t border-[#262626] pt-4">
        <SidebarItem icon={<Settings size={18}/>} label="Settings" onClick={onSettings} />
        
        {isAuthenticated ? (
          /* User Profile Section - Border: #262626 | Avatar Border: #595959 */
          <div className="flex items-center gap-3 p-2 mt-2 rounded-2xl bg-[#262626]/30 border border-[#262626]">
            <img src={user?.avatar} className="w-8 h-8 rounded-full border border-[#595959]" alt="avatar" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-white">{user?.name}</p>
              <button onClick={onLogout} className="text-[10px] text-[#777777] hover:text-white transition-colors block">Sign Out</button>
            </div>
            <LogOut size={14} className="text-[#595959]" />
          </div>
        ) : (
          /* Login Button - Hover: #777777 */
          <button 
            onClick={onLogin}
            className="flex items-center justify-center gap-2 w-full mt-2 py-3 rounded-2xl bg-white text-black font-bold text-xs hover:bg-[#777777] hover:text-white transition-all shadow-md"
          >
            <LogIn size={16} /> Sign In
          </button>
        )}
      </div>
    </motion.aside>
  );
}

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    /* Active State: BG #262626 | Text White | Inactive Icon: #595959 */
    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all ${
      active 
        ? 'bg-[#262626] text-white shadow-sm' 
        : 'text-[#777777] hover:bg-[#262626]/50 hover:text-white'
    }`}
  >
    <span className={active ? "text-white" : "text-[#595959]"}>{icon}</span>
    <span className="text-[14px] font-medium">{label}</span>
  </button>
);