import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  ExternalLink, 
  Globe,
  Loader2
} from 'lucide-react';

export default function PreviewPanel({ previewUrl }) {
  const [device, setDevice] = useState('desktop');
  const [manualReloadKey, setManualReloadKey] = useState(0);
  const iframeRef = useRef(null);
  
  // Logic remains identical
  const widths = { 
    desktop: '100%', 
    tablet: '768px', 
    mobile: '375px' 
  };

  useEffect(() => {
    if (iframeRef.current && previewUrl) {
      const current = iframeRef.current.src;
      if (current !== previewUrl) {
        iframeRef.current.src = previewUrl;
      }
    }
  }, [previewUrl]);

  const handleReload = () => setManualReloadKey((k) => k + 1);

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden">
      {/* Premium Toolbar */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black z-20">
        <div className="flex items-center gap-4">
          {/* Device Toggle Pilled */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
            <DeviceButton 
              active={device === 'desktop'} 
              onClick={() => setDevice('desktop')} 
              icon={<Monitor size={14} />} 
              label="Desktop"
            />
            <DeviceButton 
              active={device === 'tablet'} 
              onClick={() => setDevice('tablet')} 
              icon={<Tablet size={14} />} 
              label="Tablet"
            />
            <DeviceButton 
              active={device === 'mobile'} 
              onClick={() => setDevice('mobile')} 
              icon={<Smartphone size={14} />} 
              label="Mobile"
            />
          </div>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <button
            onClick={handleReload}
            title="Reload preview"
            className="p-2 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-lg group"
          >
            <RotateCw size={16} className="group-active:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Technical URL Bar */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full max-w-[400px] group transition-all hover:border-white/10">
          <Globe size={12} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
          <span className="text-[10px] font-mono text-zinc-500 truncate select-all">
            {previewUrl || 'localhost:3000'}
          </span>
          <ExternalLink size={12} className="text-zinc-700 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Preview Workspace */}
      <div className="flex-1 p-6 md:p-10 flex justify-center items-start overflow-auto custom-scrollbar bg-[radial-gradient(circle_at_center,_#0a0a0a_0%,_#000_100%)]">
        <motion.div
          initial={false}
          animate={{ width: widths[device] }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white rounded-[24px] h-full shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden border border-white/10 relative group"
        >
          {previewUrl ? (
            <>
              {/* Iframe Logic Unchanged */}
              <iframe
                key={manualReloadKey}
                ref={iframeRef}
                src={previewUrl}
                className="w-full h-full border-none"
                title="Preview"
              />
              {/* Subtle glass overlay on top edge for depth */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-[#fcfcfc]">
              <div className="relative mb-4">
                <Loader2 size={32} className="text-zinc-200 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Syncing with Sandbox...
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile Breadcrumb (Visible only on very small screens) */}
      <div className="md:hidden px-6 py-2 border-t border-white/5 bg-black text-center">
         <span className="text-[9px] font-mono text-zinc-600 truncate block">
          {previewUrl}
         </span>
      </div>
    </div>
  );
}

/** 
 * Sub-component for Device Selection 
 */
function DeviceButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
        ${active 
          ? 'bg-white text-black shadow-lg scale-[1.02]' 
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
        }
      `}
    >
      {icon}
      <span className={`text-[10px] font-bold uppercase tracking-tight ${active ? 'block' : 'hidden lg:block'}`}>
        {label}
      </span>
    </button>
  );
}