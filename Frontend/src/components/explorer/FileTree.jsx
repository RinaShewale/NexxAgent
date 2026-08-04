import { motion } from 'framer-motion';
import FileTreeNode from './FileTreeNode';

export default function FileTree({ tree, onFileClick }) {
  // Sophisticated Empty State
  if (!tree || tree.length === 0) {
    return (
      <div className="px-4 py-12 flex flex-col items-center justify-center text-center opacity-40">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818263" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
          <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#818263]">
          No files indexed
        </span>
      </div>
    );
  }

  // Animation variants for the tree sequence
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Rapid-fire entry for high-performance feel
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -4 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-1 select-none"
    >
      {tree.map((node) => (
        <motion.div key={node.path} variants={itemVariants}>
          <FileTreeNode 
            node={node} 
            depth={0} 
            onFileClick={onFileClick} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}