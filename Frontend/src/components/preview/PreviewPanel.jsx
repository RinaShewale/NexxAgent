import { useMemo, useState } from 'react';

export default function PreviewPanel({ previewUrl }) {
  const [device, setDevice] = useState('desktop');
  const widths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  const proxyUrl = useMemo(() => {
    if (!previewUrl) return null;
    const match = previewUrl.match(/http:\/\/(.*?)\.preview/);
    return match ? `/preview-proxy/${match[1]}/` : previewUrl;
  }, [previewUrl]);

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a]/20">
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#020617]">
        <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
          {['desktop', 'tablet', 'mobile'].map(d => (
            <button key={d} onClick={() => setDevice(d)} className={`p-1.5 rounded transition-all ${device === d ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </button>
          ))}
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-white/5 px-3 py-1 rounded-full">{previewUrl}</div>
      </div>
      <div className="flex-1 p-6 flex justify-center items-start overflow-auto">
        <div 
          style={{ width: widths[device] }} 
          className="bg-white rounded-2xl h-full shadow-2xl shadow-black transition-all duration-300 overflow-hidden border border-white/10"
        >
          {proxyUrl && <iframe src={proxyUrl} className="w-full h-full" title="Preview" />}
        </div>
      </div>
    </div>
  );
}
