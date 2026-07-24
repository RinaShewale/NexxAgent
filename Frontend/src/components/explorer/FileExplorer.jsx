// FileExplorer.js
import { useFileTree } from '../../hooks/useFileTree';
import FileTree from './FileTree';
import Spinner from '../shared/Spinner';

export default function FileExplorer({ agentUrl, onFileClick }) {
  const { tree, loading, refresh } = useFileTree(agentUrl);
  return (
    <div className="flex flex-col h-full bg-[#020617]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Workspace</span>
        <button onClick={refresh} className="text-slate-500 hover:text-teal-400 transition-colors">
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {loading && <div className="flex justify-center p-4"><Spinner size="sm" /></div>}
        <FileTree tree={tree} onFileClick={onFileClick} />
      </div>
    </div>
  );
}
