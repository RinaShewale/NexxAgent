import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Shield, 
  Monitor, 
  User, 
  Key, 
  Cpu, 
  CreditCard, 
  Copy, 
  Check, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  LogOut,
  Lock,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authDefault, { useAuth as useAuthNamed } from '../../hooks/useAuth';

// Supports both named and default export of useAuth
const useAuthHook = useAuthNamed || authDefault;

export default function SettingsModal({ onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthHook();
  const [avatarError, setAvatarError] = useState(false);

  // Tab State: 'account' if logged in, 'general' if not logged in
  const [tab, setTab] = useState(isAuthenticated ? 'account' : 'general');
  const [savedToast, setSavedToast] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Form States
  const [displayName, setDisplayName] = useState(user?.name || "Nexus Architect");
  const [roleTitle, setRoleTitle] = useState("Autonomous Systems Architect");
  const [apiKey, setApiKey] = useState("nx_live_8492048593028471920_00x");
  const [defaultRegion, setDefaultRegion] = useState('us-east');
  const [defaultFramework, setDefaultFramework] = useState('react-vite');

  // Preferences
  const [noiseTexture, setNoiseTexture] = useState(true);
  const [motionEffects, setMotionEffects] = useState(true);
  const [smoothScroll, setSmoothScroll] = useState(true);
  const [engineModel, setEngineModel] = useState('neural-v2');
  const [autoTimeout, setAutoTimeout] = useState('15');

  // Safe Close Handler (handles both modal onClose and page navigate back)
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(isAuthenticated ? '/dashboard' : '/');
      }
    }
  };

  // Sync tab with auth changes
  useEffect(() => {
    if (!isAuthenticated && (tab === 'account' || tab === 'security' || tab === 'billing')) {
      setTab('general');
    } else if (isAuthenticated && tab === 'general') {
      setTab('account');
    }
  }, [isAuthenticated]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    setApiKey(`nx_live_${randomHex}${Date.now().toString().slice(-4)}_00x`);
    handleSave();
  };

  // Dynamic Tabs definition
  const tabs = useMemo(() => {
    if (isAuthenticated) {
      return [
        { id: 'account', label: 'Account', icon: <User size={15} /> },
        { id: 'engine', label: 'Compute & Engine', icon: <Cpu size={15} /> },
        { id: 'security', label: 'Keys & Security', icon: <Key size={15} /> },
        { id: 'appearance', label: 'Visuals & Motion', icon: <Monitor size={15} /> },
        { id: 'billing', label: 'Usage & Plan', icon: <CreditCard size={15} /> },
      ];
    } else {
      return [
        { id: 'general', label: 'General', icon: <Sliders size={15} /> },
        { id: 'engine', label: 'Compute & Engine', icon: <Cpu size={15} /> },
        { id: 'appearance', label: 'Visuals & Motion', icon: <Monitor size={15} /> },
      ];
    }
  }, [isAuthenticated]);

  // Whether it is rendered as an overlay modal or a standalone page
  const isModal = Boolean(onClose);

  const wrapperClasses = isModal
    ? "fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-[#34170A]/50 backdrop-blur-md"
    : "min-h-screen w-full bg-[#FDF3E4] pt-24 sm:pt-28 md:pt-32 pb-12 px-4 sm:px-6 md:px-8 flex items-center justify-center relative z-10";

  return (
    <div className={wrapperClasses} onClick={isModal ? handleClose : undefined}>
      {/* Hide Scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        html, body, * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Main Settings Card — glassy, centered, no internal scroll */}
      <div 
        className="w-full max-w-5xl bg-white/25 backdrop-blur-2xl backdrop-saturate-150 rounded-[28px] sm:rounded-[36px] flex flex-col md:flex-row overflow-hidden border border-white/40 shadow-[0_25px_70px_-15px_rgba(52,23,10,0.25)] min-h-[560px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 bg-white/10 backdrop-blur-xl border-r border-white/30 p-6 sm:p-7 hidden md:flex flex-col justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#B55500]" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B55500]">
                Studio Preferences
              </span>
            </div>

            <div className="space-y-1.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
                    tab === t.id 
                      ? 'bg-white/70 text-[#B55500] shadow-xs border border-white/50' 
                      : 'text-[#34170A]/45 hover:text-[#34170A] hover:bg-white/30'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Auth Card in Sidebar */}
          {isAuthenticated && user ? (
            <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full border border-[#B55500]/30 overflow-hidden flex-shrink-0">
                  {user.avatar && !avatarError ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#34170A] text-[#FFF2E0] font-serif font-medium flex items-center justify-center text-xs select-none">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-[#34170A] truncate leading-tight">
                    {user.name || "Architect"}
                  </p>
                  <p className="text-[8px] uppercase tracking-widest text-[#B55500] font-bold">
                    Pro Member
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleClose();
                  logout();
                }}
                title="Disconnect"
                className="p-1.5 rounded-lg text-[#34170A]/40 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-[11px] font-bold text-[#34170A]">Guest Mode</p>
                <p className="text-[8px] text-[#B55500] tracking-wider uppercase font-semibold">Not signed in</p>
              </div>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl bg-[#34170A] hover:bg-[#B55500] text-[#FFF2E0] text-[9px] font-bold uppercase tracking-wider transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}
        </aside>

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden flex flex-col bg-white/15 backdrop-blur-xl border-b border-white/30">
          <div className="flex items-center justify-between p-4 pb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B55500]">
              Studio Preferences
            </span>
            <button onClick={handleClose} className="p-1.5 rounded-full text-[#34170A]/50">
              <X size={18} />
            </button>
          </div>
          <div className="flex overflow-x-auto gap-1.5 px-3 pb-3 no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  tab === t.id ? 'bg-white/70 text-[#B55500] shadow-xs' : 'text-[#34170A]/50'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Pane */}
        <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-xl relative overflow-hidden">
          {/* Close / Return Button */}
          <button 
            onClick={handleClose} 
            className="hidden md:flex absolute top-6 right-6 p-2 rounded-full text-[#34170A]/40 hover:text-[#34170A] hover:bg-black/5 transition-colors cursor-pointer z-20"
            title="Close"
          >
            <X size={18} />
          </button>

          {/* Content Container — no scroll, no scrollbar, content flows naturally */}
          <div className="flex-1 overflow-hidden no-scrollbar p-6 sm:p-9 md:p-10">
            <div className="max-w-xl">
              
              {/* NOT LOGGED IN: GENERAL TAB */}
              {!isAuthenticated && tab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-3xl font-serif italic text-[#34170A] mb-1">
                      General Preferences
                    </h4>
                    <p className="text-xs text-[#34170A]/55 font-light">
                      Configure your default local studio settings and deployment targets.
                    </p>
                  </div>

                  {/* Sign In Callout Card */}
                  <div className="p-5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles size={12} className="text-[#B55500]" />
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#B55500]">
                          Cloud Sync & Identity
                        </span>
                      </div>
                      <h5 className="font-serif italic text-base text-[#34170A]">
                        Sign in to activate your Developer Pass
                      </h5>
                      <p className="text-[11px] text-[#34170A]/55 font-light mt-0.5 max-w-sm">
                        Unlock persistent cloud sandboxes, neural API keys, and custom developer profiles.
                      </p>
                    </div>

                    <Link
                      to="/login"
                      className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#34170A] hover:bg-[#B55500] text-[#FFF2E0] text-[10px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <span>Sign in</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  {/* General Settings */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B55500]">
                        Default Cloud Region
                      </label>
                      <select 
                        value={defaultRegion}
                        onChange={(e) => setDefaultRegion(e.target.value)}
                        className="w-full bg-white/60 border border-white/50 px-4 py-3 rounded-2xl outline-none focus:border-[#B55500] text-sm text-[#34170A] transition-colors"
                      >
                        <option value="us-east">US-East (Virginia) • 12ms latency</option>
                        <option value="eu-central">EU-Central (Frankfurt) • 28ms latency</option>
                        <option value="ap-southeast">AP-Southeast (Singapore) • 45ms latency</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B55500]">
                        Default Project Framework
                      </label>
                      <select 
                        value={defaultFramework}
                        onChange={(e) => setDefaultFramework(e.target.value)}
                        className="w-full bg-white/60 border border-white/50 px-4 py-3 rounded-2xl outline-none focus:border-[#B55500] text-sm text-[#34170A] transition-colors"
                      >
                        <option value="react-vite">React + Vite + Tailwind (Recommended)</option>
                        <option value="nextjs">Next.js App Router</option>
                        <option value="typescript">Pure TypeScript / Node.js Engine</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* LOGGED IN: ACCOUNT TAB */}
              {isAuthenticated && tab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-3xl font-serif italic text-[#34170A] mb-1">
                      Account & Identity
                    </h4>
                    <p className="text-xs text-[#34170A]/55 font-light">
                      Manage your authenticated persona and studio subscription tier.
                    </p>
                  </div>

                  {/* Account Header with Live Account Type Badge */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 flex items-center gap-4 shadow-xs">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full border border-[#B55500]/30 p-0.5 bg-white/60 shadow-xs overflow-hidden">
                        {user?.avatar && !avatarError ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            onError={() => setAvatarError(true)}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#34170A] text-[#FFF2E0] font-serif font-medium flex items-center justify-center text-lg select-none">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#B55500]">
                          Account Type: Pro Architect
                        </span>
                        <CheckCircle2 size={12} className="text-[#B55500]" />
                      </div>
                      <h5 className="font-serif italic text-lg text-[#34170A] truncate leading-tight">
                        {user?.name || displayName}
                      </h5>
                      <p className="text-[11px] font-mono text-[#34170A]/50 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Edit Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B55500]">
                        Display Name
                      </label>
                      <input 
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-white/60 border border-white/50 px-4 py-3 rounded-2xl outline-none focus:border-[#B55500] text-sm text-[#34170A] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B55500]">
                        Architect Role / Title
                      </label>
                      <input 
                        type="text"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="w-full bg-white/60 border border-white/50 px-4 py-3 rounded-2xl outline-none focus:border-[#B55500] text-sm text-[#34170A] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B55500]">
                        Assigned Edge Region
                      </label>
                      <select 
                        value={defaultRegion}
                        onChange={(e) => setDefaultRegion(e.target.value)}
                        className="w-full bg-white/60 border border-white/50 px-4 py-3 rounded-2xl outline-none focus:border-[#B55500] text-sm text-[#34170A] transition-colors"
                      >
                        <option value="us-east">US-East (Virginia) • 12ms latency</option>
                        <option value="eu-central">EU-Central (Frankfurt) • 28ms latency</option>
                        <option value="ap-southeast">AP-Southeast (Singapore) • 45ms latency</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: COMPUTE & ENGINE */}
              {tab === 'engine' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-3xl font-serif italic text-[#34170A] mb-1">
                      Compute & Sandbox
                    </h4>
                    <p className="text-xs text-[#34170A]/55 font-light">
                      Configure autonomous runtime environments and synthesis models.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B55500]">
                      Synthesis Model
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div 
                        onClick={() => setEngineModel('neural-v2')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          engineModel === 'neural-v2' 
                            ? 'bg-white/60 border-[#B55500] shadow-xs ring-1 ring-[#B55500]' 
                            : 'bg-white/30 border-white/40 hover:border-white/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif italic font-medium text-sm text-[#34170A]">Neural Engine V2</span>
                          <span className="text-[8px] bg-[#B55500]/10 text-[#B55500] font-bold px-2 py-0.5 rounded-full">Default</span>
                        </div>
                        <p className="text-[11px] text-[#34170A]/50 font-light leading-relaxed">
                          Optimized for low-latency fullstack scaffolding and AST transforms.
                        </p>
                      </div>

                      <div 
                        onClick={() => setEngineModel('code-architect')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          engineModel === 'code-architect' 
                            ? 'bg-white/60 border-[#B55500] shadow-xs ring-1 ring-[#B55500]' 
                            : 'bg-white/30 border-white/40 hover:border-white/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif italic font-medium text-sm text-[#34170A]">Code Architect Pro</span>
                          <span className="text-[8px] bg-[#34170A]/10 text-[#34170A] font-bold px-2 py-0.5 rounded-full">Heavy Reasoning</span>
                        </div>
                        <p className="text-[11px] text-[#34170A]/50 font-light leading-relaxed">
                          Expanded context budget for complex multi-package repositories.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B55500]">
                      Auto-Teardown Idle Timer
                    </label>
                    <select 
                      value={autoTimeout}
                      onChange={(e) => setAutoTimeout(e.target.value)}
                      className="w-full bg-white/60 border border-white/50 px-4 py-3 rounded-2xl outline-none focus:border-[#B55500] text-sm text-[#34170A] transition-colors"
                    >
                      <option value="5">5 Minutes (Aggressive conservation)</option>
                      <option value="15">15 Minutes (Standard recommendation)</option>
                      <option value="30">30 Minutes (Extended development)</option>
                      <option value="60">60 Minutes (Continuous build session)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB: KEYS & SECURITY */}
              {isAuthenticated && tab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-3xl font-serif italic text-[#34170A] mb-1">
                      Keys & Cryptography
                    </h4>
                    <p className="text-xs text-[#34170A]/55 font-light">
                      Manage programmatic access tokens and session authorization.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B55500]">
                        Neural API Key
                      </label>
                      <span className="text-[9px] text-[#34170A]/40 font-mono">Live • Root Scope</span>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-white/60 border border-white/50 rounded-2xl">
                      <input 
                        type={showKey ? "text" : "password"}
                        readOnly 
                        value={apiKey} 
                        className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-[#34170A] outline-none"
                      />
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="p-2 hover:bg-black/5 rounded-xl text-[#34170A]/50 hover:text-[#34170A] transition-colors"
                        title={showKey ? "Hide key" : "Show key"}
                      >
                        {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button 
                        onClick={handleCopyKey}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#34170A] hover:bg-[#B55500] text-[#FFF2E0] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {copiedKey ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedKey ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-[#34170A]/40">Never expose this key in client-side applications.</span>
                      <button 
                        onClick={handleRegenerateKey}
                        className="font-bold uppercase tracking-wider text-[#B55500] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={11} /> Roll Key
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-[#B55500]" />
                      <span className="text-xs font-serif italic text-[#34170A]">Hardware-Isolated Encryption</span>
                    </div>
                    <p className="text-[11px] text-[#34170A]/60 leading-relaxed font-light">
                      Ephemeral microVM state is encrypted via AES-GCM-256. Memory partitions are wiped upon session disconnect.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB: VISUALS & MOTION */}
              {tab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-3xl font-serif italic text-[#34170A] mb-1">
                      Visuals & Performance
                    </h4>
                    <p className="text-xs text-[#34170A]/55 font-light">
                      Fine-tune rendering fidelity, ambient grain, and UI animations.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl">
                      <div>
                        <h5 className="text-sm font-medium text-[#34170A]">Studio Film Grain</h5>
                        <p className="text-[11px] text-[#34170A]/50">Subtle analog film grain texture across surfaces.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={noiseTexture} 
                        onChange={() => setNoiseTexture(!noiseTexture)}
                        className="w-5 h-5 accent-[#B55500] rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl">
                      <div>
                        <h5 className="text-sm font-medium text-[#34170A]">Interactive 3D Tilt & Parallax</h5>
                        <p className="text-[11px] text-[#34170A]/50">Physics-based spring parallax for cards and dialogs.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={motionEffects} 
                        onChange={() => setMotionEffects(!motionEffects)}
                        className="w-5 h-5 accent-[#B55500] rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl">
                      <div>
                        <h5 className="text-sm font-medium text-[#34170A]">Smooth Inertia Scroll</h5>
                        <p className="text-[11px] text-[#34170A]/50">Lenis momentum scrolling across gallery views.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={smoothScroll} 
                        onChange={() => setSmoothScroll(!smoothScroll)}
                        className="w-5 h-5 accent-[#B55500] rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BILLING & USAGE */}
              {isAuthenticated && tab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-3xl font-serif italic text-[#34170A] mb-1">
                      Usage & Allocations
                    </h4>
                    <p className="text-xs text-[#34170A]/55 font-light">
                      Monitor monthly sandbox spin-ups and token throughput.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#34170A]/90 backdrop-blur-md text-[#FFF2E0] space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#B55500] font-bold">Account Tier</span>
                        <h5 className="text-xl font-serif italic text-[#FFF2E0] mt-0.5">Architect Professional</h5>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#B55500]/20 border border-[#B55500]/30 text-[9px] uppercase tracking-wider text-[#FFF2E0] font-bold">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10 text-xs">
                      <div>
                        <p className="text-white/40 text-[9px] uppercase tracking-wider">Sandboxes Spun</p>
                        <p className="font-mono text-sm font-bold mt-0.5">84 / 200</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-[9px] uppercase tracking-wider">Neural Context</p>
                        <p className="font-mono text-sm font-bold mt-0.5">620k / 1.5M tokens</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-4 sm:p-5 bg-white/20 border-t border-white/30 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {savedToast && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0 }}
                    className="text-[10px] uppercase tracking-widest font-bold text-[#B55500] flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} /> Preferences Updated
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleClose}
                className="px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#34170A]/50 hover:text-[#34170A] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#34170A] hover:bg-[#B55500] text-[#FFF2E0] rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
              >
                Save Configurations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}