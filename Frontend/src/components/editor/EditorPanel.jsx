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
      <div className="flex-1 flex flex-col items-center justify-center bg-[#000] text-zinc-500">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-center mb-6 relative group">
            <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <FileCode size={32} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600">Select a file to edit</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#000] h-full overflow-hidden">
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
            <div className="h-10 flex items-center justify-between px-6 bg-white/[0.01] border-b border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {activeFileData.path}
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                  {getLanguage(activeFileData.path)}
                </span>
                
                <button 
                  onClick={() => onSave(activeFile)}
                  disabled={saveStatus === 'saving'}
                  className={`
                    flex items-center gap-2 transition-all group
                    ${saveStatus === 'saved' ? 'text-blue-400' : 'text-zinc-500 hover:text-white'}
                  `}
                >
                  {saveStatus === 'saving' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : saveStatus === 'saved' ? (
                    <Check size={14} />
                  ) : (
                    <Save size={14} className="group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {saveStatus === 'saving' ? 'Syncing' : saveStatus === 'saved' ? 'Saved' : 'Save'}
                  </span>
                </button>
              </div>
            </div>

            {/* Editor Surface */}
            <div className="flex-1 flex overflow-hidden">
              {/* Gutter */}
              <div className="bg-[#050505] py-6 px-4 text-right text-zinc-700 font-mono text-[11px] leading-[1.6] select-none min-w-[3.5rem] border-r border-white/5">
                {lines.map((_, i) => (
                  <div key={i} className="hover:text-zinc-400 transition-colors">{i + 1}</div>
                ))}
              </div>

              {/* Textarea Area */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onContentChange(activeFile, e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent text-zinc-300 font-mono text-[13px] leading-[1.6] p-6 outline-none resize-none overflow-auto custom-scrollbar caret-blue-500 placeholder-zinc-800"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}