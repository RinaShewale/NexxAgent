import { motion, AnimatePresence } from 'framer-motion';
import { useFileTree } from '../../hooks/useFileTree';
import FileTree from './FileTree';

export default function FileExplorer({ agentUrl, onFileClick }) {
  const { tree, loading, refresh } = useFileTree(agentUrl);

  return (
    <div className="flex flex-col h-full bg-[#0D0E10] border-r border-[#282728] selection:bg-[#F8FAFA]/10">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-[#282728] bg-[#161618]/30">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#818263]">
            Explorer
          </span>
        </div>
        
        <button 
          onClick={refresh} 
          disabled={loading}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            loading 
              ? 'text-[#F8FAFA] opacity-50' 
              : 'text-[#4F5052] hover:text-[#F8FAFA] hover:bg-[#282728]'
          }`}
          title="Refresh Workspace"
        >
          <motion.svg 
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </motion.svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 scrollbar-custom">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1 p-2"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <div className="w-4 h-4 bg-[#161618] rounded animate-pulse" />
                  <div 
                    className="h-3 bg-[#161618] rounded animate-pulse" 
                    style={{ width: `${Math.random() * 40 + 40}%` }} 
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="file-tree"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <FileTree tree={tree} onFileClick={onFileClick} />
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && (!tree || tree.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-[#161618] border border-[#282728] flex items-center justify-center mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F5052" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
              </svg>
            </div>
            <p className="text-[10px] font-bold text-[#4F5052] uppercase tracking-widest leading-relaxed">
              No files detected <br /> in workspace
            </p>
          </div>
        )}
      </div>

      {/* Technical Footer Detail */}
      <div className="px-4 py-2 border-t border-[#282728] bg-[#0D0E10] flex items-center justify-between">
        <span className="text-[8px] font-bold text-[#4F5052] uppercase tracking-tighter">
          Root: ./sandbox
        </span>
        <div className="flex gap-1.5">
          <div className="w-1 h-1 rounded-full bg-[#818263] opacity-30" />
          <div className="w-1 h-1 rounded-full bg-[#818263] opacity-30" />
          <div className="w-1 h-1 rounded-full bg-[#818263] opacity-30" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-custom::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
        }
        .scrollbar-custom:hover::-webkit-scrollbar-thumb {
          background: #282728;
        }
      `}} />
    </div>
  );
}