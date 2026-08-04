import { motion } from 'framer-motion';
import { X, User, Monitor, CreditCard, Shield } from 'lucide-react';

export default function SettingsModal({ onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-[#0F0F0F] border border-white/10 w-full max-w-4xl h-[600px] rounded-3xl flex overflow-hidden shadow-3xl"
      >
        {/* Settings Sidebar */}
        <div className="w-64 border-r border-white/5 p-6 space-y-2">
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          <SettingTab icon={<User size={18}/>} label="Account" active />
          <SettingTab icon={<Monitor size={18}/>} label="Appearance" />
          <SettingTab icon={<Shield size={18}/>} label="Security" />
          <SettingTab icon={<CreditCard size={18}/>} label="Billing" />
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-10 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white">
            <X size={24} />
          </button>

          <div className="max-w-md">
            <h3 className="text-lg font-medium mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">Display Name</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-white/20" defaultValue="User" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">Email</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none opacity-50 cursor-not-allowed" disabled defaultValue="user@nexx.studio" />
              </div>
              <button className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/20">Delete Account</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const SettingTab = ({ icon, label, active }) => (
  <button className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all ${active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
    {icon} {label}
  </button>
);