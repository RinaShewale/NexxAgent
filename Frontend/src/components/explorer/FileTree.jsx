import React from 'react';
import FileTreeNode from './FileTreeNode';

export default function FileTree({ tree, onFileClick }) {
  if (!tree) return null;
  
  return (
    <div className="py-2">
      {tree.map((node) => (
        <FileTreeNode 
          key={node.path} 
          node={node} 
          depth={0} 
          onFileClick={onFileClick} 
        />
      ))}
    </div>
  );
}