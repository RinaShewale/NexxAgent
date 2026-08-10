import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSandboxStore from '../../store/sandboxStore';
import { useSandbox } from '../../hooks/useSandbox';
import useAuth from '../../hooks/useAuth';

import Sidebar from '../features/Sidebar';
import TopNav from '../features/TopNav';
import HeroSection from '../features/HeroSection';
import SearchOverlay from '../features/SearchOverlay';
import SettingsModal from '../features/SettingsModal';
import NotificationPanel from '../features/NotificationPanel';
import LoginPage from '../auth/LoginPage'; 

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { error, setError, setInitialPrompt } = useSandboxStore();
  const { triggerStartSandbox } = useSandbox();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState(null); 
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('Playground');
  const [prompt, setPrompt] = useState('');

  const handleStartGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setInitialPrompt(prompt);
    await triggerStartSandbox(prompt);
  };

  if (showLogin) return <LoginPage onCancel={() => setShowLogin(false)} />;

  return (
    <div className="flex h-screen w-full bg-[#000] text-[#fafafa] font-sans overflow-hidden selection:bg-white/20">
      
      {/* DESKTOP SIDEBAR */}
      <motion.div 
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        className="hidden lg:block flex-shrink-0 border-r border-white/5 bg-[#050505]"
      >
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onSettings={() => setActiveOverlay('settings')}
          onLogin={() => setShowLogin(true)}
          onLogout={logout}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      </motion.div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-[70] lg:hidden bg-[#050505]"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(t) => { setActiveTab(t); setIsMobileMenuOpen(false); }} 
                onSettings={() => { setActiveOverlay('settings'); setIsMobileMenuOpen(false); }}
                onLogin={() => { setShowLogin(true); setIsMobileMenuOpen(false); }}
                onLogout={logout}
                isAuthenticated={isAuthenticated}
                user={user}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
        <TopNav 
          activeTab={activeTab}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onSearch={() => setActiveOverlay('search')} 
          onNotify={() => setActiveOverlay('notify')} 
        />

        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-12 pb-24 relative z-10">
              <HeroSection 
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleStartGenerate}
                error={error}
              />
            </div>
        </div>

        <AnimatePresence>
          {activeOverlay === 'search' && <SearchOverlay onClose={() => setActiveOverlay(null)} />}
          {activeOverlay === 'settings' && <SettingsModal onClose={() => setActiveOverlay(null)} />}
          {activeOverlay === 'notify' && <NotificationPanel onClose={() => setActiveOverlay(null)} />}
        </AnimatePresence>
      </main>
    </div>
  );
}