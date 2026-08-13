import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft, Monitor, Code2, Terminal as TermIcon, Zap, Globe, ExternalLink } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState('preview'); // preview | code | terminal
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (viewState === 'generating') return <GeneratingPage />;
  if (viewState !== 'editor') return null;

  const views = [
    { id: 'preview', label: 'Preview', icon: <Monitor size={16} /> },
    { id: 'code', label: 'Architect', icon: <Code2 size={16} /> },
    { id: 'terminal', label: 'Console', icon: <TermIcon size={16} /> }
  ];

  return (
    <div className="h-screen w-screen flex bg-[#FDF3E4] text-[#34170A] overflow-hidden selection:bg-[#A35100]/20">
      
      {/* ── LEFT SIDEBAR (AI DIALOGUE) ── */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 400 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="h-full border-r border-[#A35100]/10 bg-[#F7EDE0]/50 backdrop-blur-xl relative z-30 overflow-hidden"
      >
        <div className="w-[400px] h-full">
          <AIChat sandboxID={sandboxID} />
        </div>
      </motion.aside>

      {/* ── MAIN WORKSPACE ── */}
      <main className="flex-1 relative flex flex-col p-4 md:p-6 overflow-hidden">
        
        {/* Workspace Top Rail */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-white border border-[#A35100]/10 rounded-2xl text-[#A35100] hover:shadow-lg transition-all active:scale-95"
            >
              <PanelLeft size={20} strokeWidth={1.5} />
            </button>
            <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-[#F7EDE0] border border-[#A35100]/5 rounded-2xl text-[11px] font-medium opacity-60">
              <Globe size={14} className="text-[#A35100]" />
              <span className="truncate max-w-[200px] font-mono">{previewUrl || 'nexus-instance-v1.local'}</span>
            </div>
          </div>

          <button className="group flex items-center gap-3 px-8 py-3 bg-[#A35100] text-[#FDF3E4] rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#A35100]/20 hover:bg-[#854200] transition-all active:scale-95">
            <Zap size={14} fill="currentColor" />
            Deploy Vision
          </button>
        </div>

        {/* The "Canvas" */}
        <div className="flex-1 relative bg-white rounded-[2.5rem] border border-[#A35100]/10 shadow-[0_40px_100px_-30px_rgba(163,81,0,0.12)] overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' && (
              <motion.div key="p" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex-1 h-full">
                <PreviewPanel previewUrl={previewUrl} />
              </motion.div>
            )}
            
            {activeTab === 'code' && (
              <motion.div key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex-1 flex h-full overflow-hidden">
                <div className="w-64 border-r border-[#A35100]/5 bg-[#FDF3E4]/20 hidden md:block">
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

        {/* ── FLOATING VIEW DOCK ── */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 p-1.5 bg-[#34170A]/90 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveTab(v.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeTab === v.id 
                  ? 'bg-[#A35100] text-white shadow-lg' 
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {v.icon}
                <span className={activeTab === v.id ? 'block' : 'hidden'}>{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}