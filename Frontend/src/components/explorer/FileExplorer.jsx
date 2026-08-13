import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileTree } from '../../hooks/useFileTree';
import FileTree from './FileTree';
import { RefreshCw, FolderTree } from 'lucide-react';

export default function FileExplorer({ agentUrl, onFileClick }) {
  const { tree, loading, refresh } = useFileTree(agentUrl);

  return (
    <div className="flex flex-col h-full bg-[#EBE0CF] select-none font-sans">
      {/* Explorer Header */}
      <div className="flex items-center justify-between px-8 h-20 border-b border-[#A35100]/10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A35100]/40">Directory</span>
        <button 
          onClick={refresh} 
          disabled={loading} 
          className="p-2 text-[#A35100]/40 hover:text-[#A35100] transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <AnimatePresence mode="wait">
          {loading ? (
             <div className="space-y-4 opacity-20">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="h-3 bg-[#A35100] rounded w-full animate-pulse" />
               ))}
             </div>
          ) : tree?.length > 0 ? (
            <FileTree tree={tree} onFileClick={onFileClick} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
              <FolderTree size={32} strokeWidth={1} className="mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-center">No Assets</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}