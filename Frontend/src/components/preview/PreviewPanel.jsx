import { useRef, useEffect, useState } from 'react';

export default function PreviewPanel({ previewUrl }) {
  const [device, setDevice] = useState('desktop');
  const [manualReloadKey, setManualReloadKey] = useState(0);
  const iframeRef = useRef(null);
  const widths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  // Sync iframe src only when the actual URL changes, without remounting the element.
  // This prevents the white-screen flash caused by React destroying and recreating the iframe.
  useEffect(() => {
    if (iframeRef.current && previewUrl) {
      const current = iframeRef.current.src;
      // Only update if it's genuinely a different URL (not just a React re-render).
      if (current !== previewUrl) {
        iframeRef.current.src = previewUrl;
      }
    }
  }, [previewUrl]);

  // Manual reload: bump reload key to remount the iframe intentionally
  const handleReload = () => setManualReloadKey((k) => k + 1);

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a]/20">
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#020617]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
            {['desktop', 'tablet', 'mobile'].map(d => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`p-1.5 rounded transition-all capitalize text-xs ${device === d ? 'bg-teal-500/20 text-teal-400 font-medium' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={handleReload}
            title="Reload preview"
            className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 max-w-[300px] truncate">
          {previewUrl || 'No preview URL'}
        </div>
      </div>
      <div className="flex-1 p-6 flex justify-center items-start overflow-auto">
        <div
          style={{ width: widths[device] }}
          className="bg-white rounded-2xl h-full shadow-2xl shadow-black transition-all duration-300 overflow-hidden border border-white/10 relative"
        >
          {previewUrl ? (
            <iframe
              key={manualReloadKey}
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-none"
              title="Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              No Preview Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
