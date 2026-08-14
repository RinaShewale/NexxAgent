import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink, Globe, Loader2 } from 'lucide-react';

export default function PreviewPanel({ previewUrl, buildVersion }) {
  const [device, setDevice] = useState('desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const widths = { 
    desktop: '100%', 
    tablet: '768px', 
    mobile: '375px' 
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setReloadKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  useEffect(() => {
    if (buildVersion > 0) {
      setIsRefreshing(true);
      const timer = setTimeout(() => {
        setReloadKey((k) => k + 1);
        setIsRefreshing(false);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [buildVersion]);

  const iframeSrc = previewUrl
    ? `${previewUrl}${previewUrl.includes('?') ? '&' : '?'}_v=${reloadKey}`
    : null;

  return (
    // MAIN WRAPPER: Forced hidden overflow
    <div className="flex flex-col h-full w-full bg-[#EBE0CF]/20 overflow-hidden">
      
      {/* 1. TOP NAVBAR */}
      <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-[#A35100]/10 shrink-0 z-30">
        <div className="flex items-center gap-2 bg-[#FDF3E4] p-1 rounded-xl border border-[#A35100]/10 shadow-sm">
          <DeviceBtn active={device === 'desktop'} onClick={() => setDevice('desktop')} icon={<Monitor size={14} />} />
          <DeviceBtn active={device === 'tablet'} onClick={() => setDevice('tablet')} icon={<Tablet size={14} />} />
          <DeviceBtn active={device === 'mobile'} onClick={() => setDevice('mobile')} icon={<Smartphone size={14} />} />
        </div>

        <div className="flex-1 max-w-lg mx-6 flex items-center gap-3 px-4 py-2 bg-white border border-[#A35100]/10 rounded-full shadow-inner">
          <Globe size={12} className="text-[#A35100]/40" />
          <span className="flex-1 text-[10px] font-mono text-[#34170A]/40 truncate">{previewUrl || 'connecting...'}</span>
          <button onClick={() => previewUrl && window.open(previewUrl, '_blank')}>
            <ExternalLink size={12} className="text-[#A35100]/30 hover:text-[#A35100]" />
          </button>
        </div>

        <button
          onClick={handleRefresh}
          className={`p-2.5 rounded-xl transition-all ${isRefreshing ? 'bg-[#A35100] text-white' : 'text-[#A35100]/40 hover:bg-[#A35100]/5'}`}
        >
          <RotateCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 2. DEVICE AREA: Centers the mockup and prevents outer scroll */}
      <div className="flex-1 w-full flex justify-center items-center p-6 md:p-10 overflow-hidden bg-transparent">
        <motion.div 
          animate={{ 
            width: widths[device],
            height: '100%' // Makes it fill the available height exactly
          }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="bg-black rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(52,23,10,0.3)] border-[8px] border-[#34170A] overflow-hidden relative shadow-2xl"
        >
          {iframeSrc ? (
            <iframe
              key={reloadKey}
              src={iframeSrc}
              // "no-scrollbar" ensures the black div area stays clean
              className="w-full h-full border-none bg-white no-scrollbar"
              title="Vision Preview"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#111]">
              <Loader2 className="animate-spin text-white/20 mb-3" size={24} />
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Connecting</p>
            </div>
          )}
          
          {/* Refresh Overlay */}
          {isRefreshing && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50">
               <div className="bg-white text-[#34170A] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                 <Loader2 size={12} className="animate-spin" />
                 Updating
               </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function DeviceBtn({ active, onClick, icon }) {
  return (
    <button onClick={onClick} className={`p-2 rounded-lg transition-all ${active ? 'bg-[#A35100] text-white' : 'text-[#A35100]/40 hover:bg-[#A35100]/5'}`}>
      {icon}
    </button>
  );
}