
// EditorTabs.js
import { getFileIcon } from '../../utils/getFileIcon';

export default function EditorTabs({ openFiles, activeFile, onSelect, onClose }) {
  return (
    <div className="flex items-center bg-[#020617] border-b border-white/5 overflow-x-auto scrollbar-none">
      {openFiles.map((file) => {
        const name = file.path.split('/').pop();
        const { icon, color } = getFileIcon(name);
        const isActive = file.path === activeFile;

        return (
          <div
            key={file.path}
            onClick={() => onSelect(file.path)}
            className={`group flex items-center gap-2 px-4 py-2.5 cursor-pointer text-xs transition-all border-r border-white/5 min-w-max ${isActive ? 'bg-slate-900 text-teal-400 border-b-2 border-b-teal-500' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <span style={{ color }}>{icon}</span>
            <span className="truncate max-w-[120px]">{name}</span>
            {file.isDirty && <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />}
            <button onClick={(e) => { e.stopPropagation(); onClose(file.path); }} className="opacity-0 group-hover:opacity-100 hover:text-white ml-2 transition-opacity">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}