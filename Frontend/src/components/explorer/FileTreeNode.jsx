
// FileTreeNode.js (simplified version for flow)
import { useState } from 'react';
import { getFileIcon } from '../../utils/getFileIcon';

export default function FileTreeNode({ node, depth = 0, onFileClick }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isFolder = node.type === 'folder';
  const { icon, color } = getFileIcon(node.name);

  return (
    <div className="select-none">
      <div 
        onClick={() => isFolder ? setExpanded(!expanded) : onFileClick(node.path)}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={`flex items-center gap-2 py-1 px-2 rounded-md text-xs cursor-pointer transition-colors ${isFolder ? 'text-slate-300 hover:bg-white/5' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
      >
        {isFolder && (
          <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" /></svg>
        )}
        <span className="text-sm" style={{ color: isFolder ? '#60a5fa' : color }}>{isFolder ? '📁' : icon}</span>
        <span className="truncate">{node.name}</span>
      </div>
      {isFolder && expanded && node.children?.map(child => (
        <FileTreeNode key={child.path} node={child} depth={depth + 1} onFileClick={onFileClick} />
      ))}
    </div>
  );
}