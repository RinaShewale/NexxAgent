import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditorTabs from './EditorTabs';
import { getLanguage } from '../../utils/getFileIcon';

export default function EditorPanel({ 
  openFiles, 
  activeFile, 
  activeFileData, 
  loading, 
  saveStatus, 
  onSelect, 
  onClose, 
  onSave, 
  onContentChange 
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { 
        e.preventDefault(); 
        if (activeFile) onSave(activeFile); 
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeFile, onSave]);

  // Handle line numbers logic safely
  const content = typeof activeFileData?.content === 'string' 
    ? activeFileData.content 
    : String(activeFileData?.content || '');
  const lines = content.split('\n');

  if (!openFiles.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0D0E10] text-[#818263] selection:bg-[#F8FAFA]/10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl border border-[#282728] bg-[#161618] flex items-center justify-center mb-6 shadow-2xl relative group">
            <div className="absolute inset-0 bg-[#F8FAFA]/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="relative opacity-40">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/>
            </svg>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Select a file to begin</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0D0E10] h-full overflow-hidden selection:bg-[#F8FAFA]/20">
      <EditorTabs 
        openFiles={openFiles} 
        activeFile={activeFile} 
        onSelect={onSelect} 
        onClose={onClose} 
      />
      
      <AnimatePresence mode="wait">
        {activeFileData && (
          <motion.div 
            key={activeFile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Metadata Rail */}
            <div className="h-10 flex items-center justify-between px-4 bg-[#161618]/30 border-b border-[#282728]">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-medium text-[#4F5052] uppercase tracking-widest">
                  {activeFileData.path}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-[#818263] uppercase tracking-tighter">
                  {getLanguage(activeFileData.path)}
                </span>
                
                <button 
                  onClick={() => onSave(activeFile)}
                  disabled={saveStatus === 'saving'}
                  className={`
                    flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all
                    ${saveStatus === 'saved' 
                      ? 'text-[#F8FAFA] bg-[#282728] border border-[#4F5052] shadow-[0_0_10px_rgba(255,255,255,0.05)]' 
                      : 'text-[#818263] hover:text-[#F8FAFA] hover:bg-[#161618] border border-transparent'
                    }
                  `}
                >
                  {saveStatus === 'saving' ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-2.5 h-2.5 border-2 border-t-transparent border-[#F8FAFA] rounded-full"
                    />
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><path d="M7 3v5h8"/>
                    </svg>
                  )}
                  {saveStatus === 'saving' ? 'Syncing' : 'Save'}
                </button>
              </div>
            </div>

            {/* Editor Surface */}
            <div className="flex-1 flex overflow-hidden">
              {/* Gutter */}
              <div className="bg-[#161618]/50 py-5 px-3 text-right text-[#4F5052] font-mono text-[11px] leading-[1.6] select-none min-w-[3.5rem] border-r border-[#282728]">
                {lines.map((_, i) => (
                  <div key={i} className="hover:text-[#818263] transition-colors">{i + 1}</div>
                ))}
              </div>

              {/* Textarea Area */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onContentChange(activeFile, e.target.value)}
                spellCheck={false}
                className={`
                  flex-1 bg-transparent text-[#C5C6C8] font-mono text-[13px] leading-[1.6] 
                  p-5 outline-none resize-none overflow-auto scrollbar-custom
                  caret-[#F8FAFA] placeholder-[#4F5052]
                `}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #282728;
          border-radius: 10px;
          border: 2px solid #0D0E10;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #4F5052;
        }
        textarea {
          tab-size: 2;
          -webkit-font-smoothing: antialiased;
        }
      `}} />
    </div>
  );
}