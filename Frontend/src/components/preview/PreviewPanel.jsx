import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink, Globe, Loader2 } from 'lucide-react';

export default function PreviewPanel({ previewUrl }) {
  const [device, setDevice] = useState('desktop');
  const [manualReloadKey, setManualReloadKey] = useState(0);
  const iframeRef = useRef(null);
  
  const widths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  useEffect(() => {
    if (iframeRef.current && previewUrl) {
      const current = iframeRef.current.src;
      if (current !== previewUrl) iframeRef.current.src = previewUrl;
    }
  }, [previewUrl]);

  return (
    <div className="flex-1 flex flex-col bg-[#EBE0CF] overflow-hidden font-sans">
      {/* Nexus Toolbar */}
      <div className="h-20 border-b border-[#A35100]/10 flex items-center justify-between px-8 bg-[#FDF3E4] z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 p-1 bg-[#EBE0CF]/40 rounded-full border border-[#A35100]/5">
            <DeviceButton active={device === 'desktop'} onClick={() => setDevice('desktop')} icon={<Monitor size={14} />} />
            <DeviceButton active={device === 'tablet'} onClick={() => setDevice('tablet')} icon={<Tablet size={14} />} />
            <DeviceButton active={device === 'mobile'} onClick={() => setDevice('mobile')} icon={<Smartphone size={14} />} />
          </div>

          <button onClick={() => setManualReloadKey(k => k + 1)} className="p-2 text-[#A35100]/40 hover:text-[#A35100] transition-colors">
            <RotateCw size={16} />
          </button>
        </div>

        {/* URL Bar */}
        <div className="hidden md:flex items-center gap-4 px-6 py-2 bg-white border border-[#A35100]/10 rounded-full min-w-[300px]">
          <Globe size={12} className="text-[#A35100]/40" />
          <span className="text-[10px] font-mono text-[#34170A] opacity-60 truncate">
            {previewUrl || 'nexus-local:3000'}
          </span>
          <ExternalLink size={12} className="text-[#A35100]/20 ml-auto" />
        </div>
      </div>

      {/* Preview Workspace */}
      <div className="flex-1 p-8 md:p-12 flex justify-center items-start overflow-auto custom-scrollbar">
        <motion.div
          animate={{ width: widths[device] }}
          className="bg-white rounded-3xl h-full shadow-[0_40px_80px_-20px_rgba(163,81,0,0.15)] overflow-hidden border border-[#A35100]/10 relative"
        >
          {previewUrl ? (
            <iframe key={manualReloadKey} ref={iframeRef} src={previewUrl} className="w-full h-full border-none" title="Preview" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white opacity-40">
              <Loader2 size={24} className="animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Instance...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function DeviceButton({ active, onClick, icon }) {
  return (
    <button onClick={onClick} className={`p-2.5 rounded-full transition-all ${active ? 'bg-[#A35100] text-[#FDF3E4]' : 'text-[#A35100]/30 hover:bg-[#A35100]/5'}`}>
      {icon}
    </button>
  );
}