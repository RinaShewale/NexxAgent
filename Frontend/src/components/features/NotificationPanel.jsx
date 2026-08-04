import { motion } from 'framer-motion';

export default function NotificationPanel() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute top-16 right-8 w-80 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl z-[50] overflow-hidden"
    >
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-widest opacity-40">Notifications</span>
        <button className="text-[10px] text-blue-400 hover:underline">Clear all</button>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        <div className="p-4 hover:bg-white/5 cursor-pointer border-b border-white/5">
          <p className="text-sm text-white/80">Build Completed</p>
          <p className="text-xs text-white/30 mt-1">Your "E-commerce App" is ready to view.</p>
        </div>
        <div className="p-4 hover:bg-white/5 cursor-pointer">
          <p className="text-sm text-white/80">System Update</p>
          <p className="text-xs text-white/30 mt-1">Nexx Studio v2.4 is now live.</p>
        </div>
      </div>
    </motion.div>
  );
}