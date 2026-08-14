import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft, Monitor, Code2, Terminal as TermIcon, Zap, Globe, X } from 'lucide-react';
import useSandboxStore from '../../store/sandboxStore';
import { useFileEditor } from '../../hooks/useFileEditor';
import AIChat from '../ai/AIChat';
import FileExplorer from '../explorer/FileExplorer';
import EditorPanel from '../editor/EditorPanel';
import PreviewPanel from '../preview/PreviewPanel';
import TerminalPanel from '../terminal/TerminalPanel';
import GeneratingPage from './GeneratingPage';

export default function AppShell() {
  const { sandboxID, agentUrl, previewUrl, viewState } = useSandboxStore();
  const { openFiles, activeFile, activeFileData, openFile, closeFile, updateContent, saveFile, setActiveFile, saveStatus } = useFileEditor(agentUrl);
  const [activeTab, setActiveTab] = useState('preview'); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [buildVersion, setBuildVersion] = useState(0);

  // --- FIX SCROLLBAR ---
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleBuildComplete = useCallback(() => setBuildVersion(v => v + 1), []);

  if (viewState === 'generating') return <GeneratingPage />;
  if (viewState !== 'editor') return null;

  const views = [
    { id: 'preview', label: 'Preview', icon: <Monitor size={16} /> },
    { id: 'code', label: 'Architect', icon: <Code2 size={16} /> },
    { id: 'terminal', label: 'Console', icon: <TermIcon size={16} /> }
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen flex bg-[#FDF3E4] text-[#34170A] overflow-hidden z-[50]">
      
      {/* Responsive Sidebar - Overlay on mobile, Side-by-side on desktop */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: sidebarOpen ? (window.innerWidth < 1024 ? '100%' : 400) : 0,
          x: sidebarOpen ? 0 : -400,
          opacity: sidebarOpen ? 1 : 0 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`h-full border-r border-[#A35100]/10 bg-[#F7EDE0] lg:bg-[#F7EDE0]/50 backdrop-blur-xl fixed lg:relative z-[60] overflow-hidden`}
      >
        <div className="w-full lg:w-[400px] h-full relative">
          {/* Close button for mobile sidebar */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 z-[70] p-2 bg-[#34170A] text-white rounded-full"
          >
            <X size={20} />
          </button>
          <AIChat sandboxID={sandboxID} onBuildComplete={handleBuildComplete} />
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col p-3 md:p-6 overflow-hidden min-w-0">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4 px-1 shrink-0 gap-2">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2.5 md:p-3 bg-white border border-[#A35100]/10 rounded-xl md:rounded-2xl text-[#A35100] shadow-sm hover:bg-orange-50 transition-colors"
            >
              <PanelLeft size={20} />
            </button>
            
            {/* Responsive URL bar - hides on small mobiles */}
            <div className="hidden sm:flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-[#F7EDE0] border border-[#A35100]/5 rounded-xl md:rounded-2xl text-[11px] opacity-60 overflow-hidden">
              <Globe size={14} className="text-[#A35100] shrink-0" />
              <span className="truncate max-w-[120px] md:max-w-[200px] font-mono">
                {previewUrl || 'nexus-instance-v1.local'}
              </span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 md:px-8 py-2.5 md:py-3 bg-[#34170A] hover:bg-[#A35100] text-[#FDF3E4] rounded-xl md:rounded-2xl text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all active:scale-95 shadow-md shrink-0">
            <Zap size={14} fill="currentColor" /> 
            <span className="hidden xs:inline">Deploy Vision</span>
            <span className="xs:hidden">Deploy</span>
          </button>
        </div>

        {/* Workspace Panels */}
        <div className="flex-1 relative bg-white rounded-2xl md:rounded-[2.5rem] border border-[#A35100]/10 overflow-hidden flex flex-col shadow-inner">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' && (
              <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 h-full">
                <PreviewPanel previewUrl={previewUrl} buildVersion={buildVersion} />
              </motion.div>
            )}
            {activeTab === 'code' && (
              <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex h-full overflow-hidden">
                <div className="w-56 lg:w-64 border-r border-[#A35100]/5 hidden md:block overflow-y-auto">
                  <FileExplorer agentUrl={agentUrl} onFileClick={openFile} />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <EditorPanel 
                    openFiles={openFiles} activeFile={activeFile} 
                    activeFileData={activeFileData} onSelect={setActiveFile} 
                    onClose={closeFile} onContentChange={updateContent}
                    onSave={saveFile} saveStatus={saveStatus}
                  />
                </div>
              </motion.div>
            )}
            {activeTab === 'terminal' && (
              <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 h-full bg-[#1A0B05]">
                <TerminalPanel agentUrl={agentUrl} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Navigation Bar */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[55] w-fit max-w-[90vw]">
          <div className="flex items-center gap-1 p-1 md:p-1.5 bg-[#34170A]/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveTab(v.id)}
                className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === v.id ? 'bg-[#A35100] text-white shadow-lg' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span className="shrink-0">{v.icon}</span>
                <span className={activeTab === v.id ? 'block' : 'hidden xs:block opacity-40'}>
                  {v.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}