import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

export default function NotificationPanel({ onClose }) {
  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#050505] border-l border-[#1a1a1a] z-[100] shadow-2xl flex flex-col"
    >
      <div className="p-8 border-b border-[#1a1a1a] flex justify-between items-center">
        <h2 className="text-xs font-black uppercase tracking-widest text-[#424242]">Notifications</h2>
        <button onClick={onClose} className="text-[#424242] hover:text-white"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] flex gap-4">
            <CheckCircle2 className="text-white shrink-0" size={18} />
            <div>
              <p className="text-sm font-bold text-white">System Update</p>
              <p className="text-xs text-[#595959] mt-1">Nexx engine has been updated to v4.2.</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}