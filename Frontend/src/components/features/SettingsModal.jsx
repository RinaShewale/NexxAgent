import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Monitor, CreditCard, Shield, 
  ChevronRight, Camera, Check, ExternalLink, AlertCircle 
} from 'lucide-react';

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('Account');

  const tabs = [
    { id: 'Account', icon: <User size={18}/> },
    { id: 'Appearance', icon: <Monitor size={18}/> },
    { id: 'Security', icon: <Shield size={18}/> },
    { id: 'Billing', icon: <CreditCard size={18}/> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#090909] border border-white/10 w-full max-w-5xl h-[700px] rounded-[32px] flex overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Navigation */}
        <div className="w-20 md:w-64 border-r border-white/5 bg-white/[0.01] p-4 md:p-6 flex flex-col">
          <div className="mb-8 px-2">
            <h2 className="hidden md:block text-xl font-bold tracking-tight text-white">Settings</h2>
            <div className="md:hidden w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
          
          <nav className="flex-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl text-sm font-medium transition-all relative group ${
                  activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="tabBackground"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="hidden md:block relative z-10">{tab.id}</span>
                {activeTab === tab.id && (
                  <ChevronRight size={14} className="hidden md:block ml-auto opacity-50" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto p-2 bg-white/[0.03] rounded-2xl border border-white/5 hidden md:block">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Current Plan</p>
                <p className="text-xs font-bold text-white">Pro Subscriber</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative bg-black/20">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all z-20"
          >
            <X size={20} />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8 md:p-12"
              >
                {activeTab === 'Account' && <AccountSettings />}
                {activeTab === 'Appearance' && <AppearanceSettings />}
                {activeTab === 'Security' && <SecuritySettings />}
                {activeTab === 'Billing' && <BillingSettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* --- Sub-Components --- */

function AccountSettings() {
  return (
    <div className="max-w-2xl">
      <h3 className="text-2xl font-bold text-white mb-1">Account</h3>
      <p className="text-sm text-white/40 mb-10">Manage your profile and display preferences.</p>

      <div className="space-y-8">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden border-2 border-white/5 group-hover:border-white/20 transition-all">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
            <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
              <Camera size={20} className="text-white" />
            </button>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Profile Photo</h4>
            <p className="text-xs text-white/40 mb-3">JPG, GIF or PNG. Max 1MB.</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">Upload</button>
              <button className="px-3 py-1.5 text-white/40 hover:text-red-400 text-xs font-bold transition-all">Remove</button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Full Name" defaultValue="Felix Henderson" />
          <InputGroup label="User ID" defaultValue="@felix_hx" disabled />
          <div className="md:col-span-2">
            <InputGroup label="Email Address" defaultValue="felix@nexx.studio" />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="max-w-2xl">
      <h3 className="text-2xl font-bold text-white mb-8">Security</h3>
      <div className="space-y-4">
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500 shrink-0 h-fit"><Shield size={24}/></div>
            <div>
              <p className="font-bold text-white">Two-Factor Authentication</p>
              <p className="text-sm text-white/40">Protect your account with an extra security layer.</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
             <div className="w-4 h-4 bg-white rounded-full ml-auto" />
          </div>
        </div>
        
        <button className="w-full p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all text-left flex justify-between items-center group">
          <div>
            <p className="font-bold text-white">Change Password</p>
            <p className="text-sm text-white/40">Last updated 3 months ago.</p>
          </div>
          <ArrowRight className="text-white/20 group-hover:translate-x-1 transition-all" />
        </button>

        <div className="mt-12 p-6 rounded-3xl border border-red-500/20 bg-red-500/5">
          <div className="flex gap-3 text-red-500 mb-2">
            <AlertCircle size={18} />
            <h4 className="font-bold">Danger Zone</h4>
          </div>
          <p className="text-sm text-red-500/60 mb-4">Permanently delete your account and all associated data. This action is irreversible.</p>
          <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-lg text-sm font-bold transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// Fallback for empty tabs
function AppearanceSettings() { return <div className="text-white/40 italic">Appearance settings are coming soon.</div> }
function BillingSettings() { return <div className="text-white/40 italic">Billing management redirected to Stripe...</div> }

/* --- UI Utilities --- */

function InputGroup({ label, defaultValue, disabled }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-black ml-1">{label}</label>
      <input 
        defaultValue={defaultValue}
        disabled={disabled}
        className={`w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/20 transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}

function ArrowRight({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}