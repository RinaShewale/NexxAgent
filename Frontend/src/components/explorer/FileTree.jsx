// FileTree.jsx
export default function FileTree({ tree, onFileClick }) {
  return (
    <div className="py-2">
      {tree.map((node) => (
        <FileTreeNode key={node.path} node={node} depth={0} onFileClick={onFileClick} />
      ))}
    </div>
  );
}

// FileTreeNode.jsx
import { ChevronRight, Folder, FileText } from 'lucide-react';

export default function FileTreeNode({ node, depth = 0, onFileClick }) {
  const [expanded, setExpanded] = React.useState(depth < 1);
  const isFolder = node.type === 'folder';

  return (
    <div className="relative">
      <div 
        onClick={() => isFolder ? setExpanded(!expanded) : onFileClick(node.path)}
        className="group flex items-center gap-2 py-1 px-3 mx-1 rounded-lg cursor-pointer hover:bg-white/[0.03] transition-all"
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        {isFolder && (
          <ChevronRight 
            size={14} 
            className={`transition-transform duration-200 text-zinc-600 group-hover:text-zinc-400 ${expanded ? 'rotate-90' : ''}`} 
          />
        )}
        {!isFolder && <div className="w-3.5" />}
        
        <span className={isFolder ? 'text-zinc-400' : 'text-zinc-500 group-hover:text-zinc-200'}>
          {isFolder ? <Folder size={14} /> : <FileText size={14} />}
        </span>
        
        <span className={`text-xs font-medium tracking-tight truncate ${isFolder ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-200'}`}>
          {node.name}
        </span>
      </div>

      <AnimatePresence>
        {isFolder && expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative"
          >
            {/* Indentation Line */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-px bg-white/5" 
              style={{ marginLeft: `${depth * 12 + 18}px` }} 
            />
            {node.children?.map(child => (
              <FileTreeNode key={child.path} node={child} depth={depth + 1} onFileClick={onFileClick} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}