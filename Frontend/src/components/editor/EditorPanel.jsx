// EditorPanel.js
import { useEffect, useRef } from 'react';
import EditorTabs from './EditorTabs';
import Spinner from '../shared/Spinner';
import { getLanguage } from '../../utils/getFileIcon';

export default function EditorPanel({ openFiles, activeFile, activeFileData, loading, saveStatus, onSelect, onClose, onSave, onContentChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (activeFile) onSave(activeFile); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeFile, onSave]);

  if (!openFiles.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#020617] text-slate-600">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/5 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <p className="text-xs font-medium">Select a file to start building</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#030712] h-full overflow-hidden">
      <EditorTabs openFiles={openFiles} activeFile={activeFile} onSelect={onSelect} onClose={onClose} />
      
      {activeFileData && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/30 border-b border-white/5 text-[10px] font-mono">
            <span className="text-slate-500 uppercase tracking-widest">{activeFileData.path}</span>
            <div className="flex items-center gap-3">
              <span className="text-teal-500/80">{getLanguage(activeFileData.path)}</span>
              <button 
                onClick={() => onSave(activeFile)}
                className={`px-3 py-1 rounded border transition-all ${saveStatus === 'saved' ? 'border-teal-500/30 text-teal-400 bg-teal-500/5' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                {saveStatus === 'saving' ? '...' : 'Save'}
              </button>
            </div>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="bg-[#010409] py-4 px-3 text-right text-slate-700 font-mono text-[11px] leading-[1.6] select-none min-w-[3.5rem] border-r border-white/5">
              {(typeof activeFileData.content === 'string' ? activeFileData.content : String(activeFileData.content || '')).split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              ref={textareaRef}
              value={typeof activeFileData.content === 'string' ? activeFileData.content : String(activeFileData.content || '')}
              onChange={(e) => onContentChange(activeFile, e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent text-slate-300 font-mono text-xs leading-[1.6] p-4 outline-none resize-none overflow-auto scrollbar-thin caret-teal-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
