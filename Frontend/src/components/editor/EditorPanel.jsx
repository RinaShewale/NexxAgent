import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditorTabs from './EditorTabs';
import { getLanguage } from '../../utils/getFileIcon';
import { Save, FileCode, Check, Loader2 } from 'lucide-react';

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

  // Ctrl+S shortcut
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

  const content = typeof activeFileData?.content === 'string' 
    ? activeFileData.content 
    : String(activeFileData?.content || '');
  const lines = content.split('\n');

  if (!openFiles.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FDF3E4] text-[#A35100]/40 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full border border-[#A35100]/10 bg-[#EBE0CF]/30 flex items-center justify-center mb-8">
            <FileCode size={32} strokeWidth={1} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Select an architectural file</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden shadow-inner">
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
            <div className="h-12 flex items-center justify-between px-8 bg-[#FDF3E4]/50 border-b border-[#A35100]/10">
              <span className="text-[9px] font-black text-[#A35100]/60 uppercase tracking-[0.2em] font-mono">
                {activeFileData.path}
              </span>
              
              <div className="flex items-center gap-8">
                <span className="text-[9px] font-bold text-[#A35100]/40 uppercase tracking-widest bg-[#A35100]/5 px-2 py-1 rounded">
                  {getLanguage(activeFileData.path)}
                </span>
                
                <button 
                  onClick={() => onSave(activeFile)}
                  disabled={saveStatus === 'saving'}
                  className={`flex items-center gap-2 transition-all ${
                    saveStatus === 'saved' ? 'text-green-600' : 'text-[#A35100] hover:opacity-70'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : saveStatus === 'saved' ? (
                    <Check size={12} />
                  ) : (
                    <Save size={12} />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {saveStatus === 'saving' ? 'Syncing' : saveStatus === 'saved' ? 'Synced' : 'Save'}
                  </span>
                </button>
              </div>
            </div>

            {/* Editor Surface */}
            <div className="flex-1 flex overflow-hidden bg-white">
              {/* Gutter — scrolls in sync with textarea via overflow-hidden */}
              <div className="bg-[#FDF3E4]/30 py-8 px-4 text-right text-[#A35100]/20 font-mono text-[10px] leading-[1.8] select-none min-w-[4rem] border-r border-[#A35100]/5 overflow-hidden">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Textarea Area */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onContentChange(activeFile, e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent text-[#34170A] font-mono text-[13px] leading-[1.8] p-8 outline-none resize-none overflow-auto custom-scrollbar caret-[#A35100] placeholder-[#A35100]/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}