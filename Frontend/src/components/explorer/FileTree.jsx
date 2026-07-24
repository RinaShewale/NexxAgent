import FileTreeNode from './FileTreeNode';

export default function FileTree({ tree, onFileClick }) {
  if (!tree || tree.length === 0) {
    return (
      <div className="px-3 py-2 text-xs text-gray-600 italic">No files found</div>
    );
  }

  return (
    <div className="py-1">
      {tree.map((node) => (
        <FileTreeNode key={node.path} node={node} depth={0} onFileClick={onFileClick} />
      ))}
    </div>
  );
}
