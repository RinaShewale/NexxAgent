import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Logic Hooks
import useSandboxStore from '../../store/sandboxStore';
import { useSandbox } from '../../hooks/useSandbox';
import useAuth from '../../hooks/useAuth';
import LoginPage from '../auth/LoginPage';
import Sidebar from '../features/Sidebar';
import TopNav from '../features/TopNav';
import SearchOverlay from '../features/SearchOverlay';
import SettingsModal from '../features/SettingsModal';
import NotificationPanel from '../features/NotificationPanel';
import HeroSection from '../features/HeroSection';

export default function LandingPage() {
  // UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('Playground');
  const [prompt, setPrompt] = useState('');

  // App Logic
  const { error, setError, setInitialPrompt } = useSandboxStore();
  const { triggerStartSandbox } = useSandbox();
  const { user, isAuthenticated, logout } = useAuth();

  const handleStart = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setInitialPrompt(prompt);
    await triggerStartSandbox(prompt);
  };

  if (showLogin) return <LoginPage onCancel={() => setShowLogin(false)} />;

  return (
    /* Main Background changed to #000000, Selection changed to #424242 */
    <div className="flex h-screen w-full bg-[#000000] text-[#e5e5e5] font-sans overflow-hidden selection:bg-[#424242] selection:text-white">
      
      {/* 1. SIDEBAR - Use #262626 for sidebar contrast if possible via props or internal style */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSettings={() => setIsSettingsOpen(true)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={logout}
        className="bg-[#262626] border-r border-[#424242]"
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* 2. TOP NAV - Use #262626 for background and #424242 for borders */}
        <TopNav 
          onSearch={() => setIsSearchOpen(true)} 
          onNotify={() => setIsNotifyOpen(!isNotifyOpen)} 
          isNotifyOpen={isNotifyOpen}
          style={{ backgroundColor: '#000000', borderBottom: '1px solid #262626' }}
        />

        {/* 3. OVERLAYS */}
        <AnimatePresence>
          {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
          {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
          {isNotifyOpen && <NotificationPanel onClose={() => setIsNotifyOpen(false)} />}
        </AnimatePresence>

        {/* 4. MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            {/* Background Glow: Replaced teal with #595959 and #262626 for a sophisticated monochrome atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-gradient-to-b from-[#595959]/20 via-[#262626]/10 to-transparent blur-[120px]" />
            </div>

            <HeroSection 
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleStart}
              error={error}
              /* Assuming HeroSection accepts style/class overrides for the new palette */
              primaryColor="#777777" 
              secondaryColor="#424242"
            />
        </div>
      </main>
    </div>
  );
}