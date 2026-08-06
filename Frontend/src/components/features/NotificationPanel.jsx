import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Zap, 
  MessageSquare, 
  Clock, 
  BellOff,
  MoreHorizontal,
  Trash2
} from 'lucide-react';

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'update',
      title: 'System Update',
      desc: 'Nexx Engine v4.2 is now live with 2x faster generation.',
      time: '2m ago',
      unread: true,
      icon: <Zap size={16} className="text-yellow-500" />,
      bg: 'bg-yellow-500/10'
    },
    {
      id: 2,
      type: 'success',
      title: 'Deployment Successful',
      desc: 'Your "Finance Dashboard" is now live on the edge.',
      time: '1h ago',
      unread: true,
      icon: <CheckCircle2 size={16} className="text-emerald-500" />,
      bg: 'bg-emerald-500/10'
    },
    {
      id: 3,
      type: 'social',
      title: 'New Feedback',
      desc: 'Sarah left a comment on your Portfolio project.',
      time: '5h ago',
      unread: false,
      icon: <MessageSquare size={16} className="text-blue-500" />,
      bg: 'bg-blue-500/10'
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <>
      {/* Backdrop for focus */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
      />

      <motion.div 
        initial={{ x: '100%', opacity: 0.5 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: '100%', opacity: 0.5 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#080808] border-l border-white/5 z-[100] shadow-[[-20px_0_50px_rgba(0,0,0,0.5)]] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Notifications
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="bg-blue-500 text-[10px] px-1.5 py-0.5 rounded-full text-white">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={markAllRead}
              className="text-[11px] font-bold text-white/40 hover:text-white transition-colors"
            >
              Mark all as read
            </button>
            <button className="text-white/20 hover:text-white">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <motion.div 
                  key={n.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative p-4 mx-2 my-1 rounded-2xl transition-all border border-transparent ${
                    n.unread ? 'bg-white/[0.03] border-white/5' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 shrink-0 rounded-xl ${n.bg} flex items-center justify-center`}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm font-bold truncate ${n.unread ? 'text-white' : 'text-white/60'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-white/20 whitespace-nowrap flex items-center gap-1">
                          <Clock size={10} /> {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  </div>

                  {/* Unread Indicator */}
                  {n.unread && (
                    <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  )}

                  {/* Actions on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => removeNotification(n.id)}
                      className="p-1.5 bg-[#080808] border border-white/10 rounded-lg text-white/40 hover:text-red-400 shadow-xl"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-20">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-4">
                  <BellOff size={24} />
                </div>
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs">No new notifications for you.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <button className="w-full py-3 rounded-xl border border-white/10 text-white/40 text-[11px] font-bold uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
            Archive All
          </button>
        </div>
      </motion.div>
    </>
  );
}