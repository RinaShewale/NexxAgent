import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditorTabs from './EditorTabs';
import { getLanguage } from '../../utils/getFileIcon';
import { Save, Check, Loader2, Compass } from 'lucide-react';

export default function EditorPanel({ 
  openFiles, activeFile, activeFileData, loading, saveStatus, 
  onSelect, onClose, onSave, onContentChange 
}) {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const content = typeof activeFileData?.content === 'string' ? activeFileData.content : '';
  const lines = content.split('\n');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FDF3E4] p-3 lg:p-6 overflow-hidden">
      {/* Outer Border Wrapper */}
      <div className="flex-1 flex flex-col bg-[#fbf5eb] border border-[#A35100]/20 rounded-sm shadow-[0_4px_20px_-12px_rgba(163,81,0,0.2)] overflow-hidden">
        
        {!openFiles.length ? (
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Subtle Architectural Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#A35100 1px, transparent 1px), linear-gradient(90deg, #A35100 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <Compass size={32} strokeWidth={1} className="text-[#A35100]/20 mb-4 animate-spin-slow" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A35100]/40">
                System Idle
              </h2>
              <div className="mt-2 h-[1px] w-8 bg-[#A35100]/10" />
            </motion.div>
          </div>
        ) : (
          <>
            <EditorTabs openFiles={openFiles} activeFile={activeFile} onSelect={onSelect} onClose={onClose} />
            
            <div className="h-10 flex items-center justify-between px-5 border-b border-[#FDF3E4] bg-white">
              <span className="text-[9px] font-bold text-[#34170A]/40 uppercase tracking-[0.2em] font-mono truncate">
                {activeFileData?.path}
              </span>
              
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-black text-[#A35100]/60 uppercase">{getLanguage(activeFileData?.path)}</span>
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSave(activeFile)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-tighter transition-all ${
                    saveStatus === 'saved' ? 'bg-green-50 text-green-700' : 'bg-[#34170A] text-[#FDF3E4]'
                  }`}
                >
                  {saveStatus === 'saving' ? <Loader2 size={10} className="animate-spin" /> : saveStatus === 'saved' ? <Check size={10} /> : <Save size={10} />}
                  {saveStatus === 'saving' ? 'Sync' : saveStatus === 'saved' ? 'Synced' : 'Commit'}
                </motion.button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div ref={gutterRef} className="bg-[#FDF3E4]/20 py-6 px-4 text-right text-[#A35100]/20 font-mono text-[10px] leading-[1.8] min-w-[3.5rem] border-r border-[#A35100]/5 select-none overflow-hidden">
                {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                value={content}
                onChange={(e) => onContentChange(activeFile, e.target.value)}
                spellCheck={false}
                className="flex-1 bg-white text-[#34170A] font-mono text-[13px] leading-[1.8] p-6 outline-none resize-none overflow-auto custom-scrollbar caret-[#A35100] selection:bg-[#A35100]/10"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}