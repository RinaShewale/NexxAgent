import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileTree } from '../../hooks/useFileTree';
import FileTree from './FileTree';
import { RefreshCw, FolderTree, Search } from 'lucide-react';

export default function FileExplorer({ agentUrl, onFileClick }) {
  const { tree, loading, refresh } = useFileTree(agentUrl);

  return (
    <div className="flex flex-col h-full bg-[#000] border-r border-white/5 select-none">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-5 h-12 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Explorer
          </span>
        </div>
        
        <button 
          onClick={refresh} 
          disabled={loading}
          className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-3 p-3"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-white/5 rounded animate-pulse" />
                  <div className="h-2 bg-white/5 rounded animate-pulse w-full" />
                </div>
              ))}
            </motion.div>
          ) : tree?.length > 0 ? (
            <FileTree tree={tree} onFileClick={onFileClick} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
              <FolderTree size={32} className="mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-center">Empty<br/>Workspace</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Meta */}
      <div className="px-5 py-2 border-t border-white/5 bg-black flex items-center justify-between">
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Root: /sandbox</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
        </div>
      </div>
    </div>
  );
}