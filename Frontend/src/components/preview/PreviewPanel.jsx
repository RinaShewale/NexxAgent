import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink, Globe, Loader2 } from 'lucide-react';

export default function PreviewPanel({ previewUrl }) {
  const [device, setDevice] = useState('desktop');
  const widths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  return (
    <div className="flex flex-col h-full bg-[#EBE0CF]/40">
      <div className="h-20 px-8 flex items-center justify-between bg-white/50 backdrop-blur border-b border-[#A35100]/10">
        <div className="flex items-center gap-4 bg-[#FDF3E4] p-1 rounded-2xl border border-[#A35100]/10">
          <DeviceBtn active={device === 'desktop'} onClick={() => setDevice('desktop')} icon={<Monitor size={14} />} />
          <DeviceBtn active={device === 'tablet'} onClick={() => setDevice('tablet')} icon={<Tablet size={14} />} />
          <DeviceBtn active={device === 'mobile'} onClick={() => setDevice('mobile')} icon={<Smartphone size={14} />} />
        </div>

        <div className="flex-1 max-w-md mx-8 flex items-center gap-3 px-6 py-2.5 bg-white border border-[#A35100]/10 rounded-full">
          <Globe size={12} className="text-[#A35100]/40" />
          <span className="flex-1 text-[10px] font-mono opacity-50 truncate">{previewUrl || 'connecting...'}</span>
          <ExternalLink size={12} className="text-[#A35100]/20 cursor-pointer hover:text-[#A35100]" />
        </div>

        <button className="p-3 hover:bg-[#A35100]/5 rounded-xl text-[#A35100]/40 transition-colors">
          <RotateCw size={16} />
        </button>
      </div>

      <div className="flex-1 p-8 md:p-12 flex justify-center items-start overflow-auto custom-scrollbar">
        <motion.div 
          animate={{ width: widths[device] }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-[2rem] h-full shadow-2xl border border-[#A35100]/10 overflow-hidden relative"
        >
          {previewUrl ? (
            <iframe src={previewUrl} className="w-full h-full border-none" title="Vision Preview" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
              <Loader2 className="animate-spin mb-4" size={24} />
              <p className="text-[10px] font-black uppercase tracking-widest">Waking Instance...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function DeviceBtn({ active, onClick, icon }) {
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all ${active ? 'bg-[#A35100] text-white' : 'text-[#A35100]/40 hover:bg-[#A35100]/5'}`}>
      {icon}
    </button>
  );
}