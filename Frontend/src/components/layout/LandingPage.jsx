import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Logic Hooks (Ensure these paths match your project)
import useSandboxStore from '../../store/sandboxStore';
import { useSandbox } from '../../hooks/useSandbox';
import useAuth from '../../hooks/useAuth';

// Feature Components
import Sidebar from '../features/Sidebar';
import TopNav from '../features/TopNav';
import HeroSection from '../features/HeroSection';
import SearchOverlay from '../features/SearchOverlay';
import SettingsModal from '../features/SettingsModal';
import NotificationPanel from '../features/NotificationPanel';
import LoginPage from '../auth/LoginPage'; 

export default function LandingPage() {
  // 1. Auth & Logic Hooks
  const { user, isAuthenticated, logout } = useAuth();
  const { error, setError, setInitialPrompt } = useSandboxStore();
  const { triggerStartSandbox } = useSandbox();

  // 2. UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState(null); // 'search', 'settings', 'notify'
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('Playground');
  const [prompt, setPrompt] = useState('');

  // 3. Actions
  const handleStartGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setInitialPrompt(prompt);
    await triggerStartSandbox(prompt);
  };

  const closeOverlays = () => setActiveOverlay(null);

  // 4. Conditional Auth Rendering
  if (showLogin) return <LoginPage onCancel={() => setShowLogin(false)} />;

  return (
    <div className="flex h-screen w-full bg-[#000000] text-[#e5e5e5] font-sans overflow-hidden selection:bg-[#424242]">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onSettings={() => setActiveOverlay('settings')}
          onLogin={() => setShowLogin(true)}
          onLogout={logout}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      </div>

      {/* MOBILE SIDEBAR (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-[70] lg:hidden"
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <TopNav 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onSearch={() => setActiveOverlay('search')} 
          onNotify={() => setActiveOverlay('notify')} 
        />

        <div className="flex-1 overflow-y-auto relative px-6 custom-scrollbar">
            {/* Elegant Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-50">
                <div className="absolute inset-0 bg-gradient-to-b from-[#262626]/30 via-transparent to-transparent blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto pt-16 pb-24 relative z-10">
              <HeroSection 
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleStartGenerate}
                error={error}
              />
            </div>
        </div>

        {/* FULL SCREEN OVERLAYS */}
        <AnimatePresence>
          {activeOverlay === 'search' && <SearchOverlay onClose={closeOverlays} />}
          {activeOverlay === 'settings' && <SettingsModal onClose={closeOverlays} />}
          {activeOverlay === 'notify' && <NotificationPanel onClose={closeOverlays} />}
        </AnimatePresence>
      </main>
    </div>
  );
}