import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, PanelLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Logic Hooks
import useSandboxStore from '../../store/sandboxStore';
import { useFileEditor } from '../../hooks/useFileEditor';
import { useFileTree } from '../../hooks/useFileTree';

// Nexus Components
import AIChat from '../ai/AIChat';
import FileExplorer from '../explorer/FileExplorer';
import EditorPanel from '../editor/EditorPanel';
import PreviewPanel from '../preview/PreviewPanel';
import TerminalPanel from '../terminal/TerminalPanel';
import GeneratingPage from './GeneratingPage';

export default function AppShell() {
  const navigate = useNavigate();
  const { sandboxID, agentUrl, previewUrl, viewState, reset } = useSandboxStore();
  
  // Data Fetching & State Management
  const { refresh: refreshTree } = useFileTree(agentUrl);
  const { 
    openFiles, activeFile, activeFileData, loading, saveStatus, 
    openFile, closeFile, updateContent, saveFile, setActiveFile 
  } = useFileEditor(agentUrl);

  const [activeRightTab, setActiveRightTab] = useState('preview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bottomHeight, setBottomHeight] = useState(240);
  const isDraggingRef = useRef(false);

  const handleReset = () => {
    reset();
    navigate('/dashboard');
  };

  const handleFilesChanged = useCallback(() => refreshTree(), [refreshTree]);

  // Handle Terminal Resizing
  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const h = window.innerHeight - e.clientY;
    setBottomHeight(Math.max(120, Math.min(h, window.innerHeight * 0.6)));
  }, []);

  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    if (agentUrl && viewState === 'editor') refreshTree();
  }, [agentUrl, viewState, refreshTree]);

  // If generation failed (or the store was never set), viewState falls
  // back to 'landing'. Without this, a failed generate leaves the user
  // stuck on a blank /shell route since nothing here renders for 'landing'.
  useEffect(() => {
    if (viewState === 'landing') {
      navigate('/dashboard');
    }
  }, [viewState, navigate]);

  const theme = {
    bg: "#FDF3E4",
    surface: "#EBE0CF",
    accent: "#A35100",
    text: "#34170A",
    border: "rgba(163, 81, 0, 0.1)"
  };

  if (viewState === 'generating') return <GeneratingPage />;

  // Guard against rendering the editor shell before we actually
  // have a sandbox to point it at (e.g. brief tick between
  // 'landing' state and the redirect effect above firing).
  if (viewState !== 'editor') return null;

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden antialiased select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: 'Inter, sans-serif' }}
    >
      
      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-8 h-20 border-b relative z-50 bg-[#FDF3E4]" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-12">
          <button onClick={handleReset} className="group flex items-center gap-3">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black">Return</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-px h-8 bg-[#A35100]/20" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-serif italic leading-none">Nexus Studio.</h1>
              <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-40">Creative Engine v4.0</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A35100]" />
            <span className="text-[10px] uppercase tracking-widest font-black opacity-40">Node Synced</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-[#FDF3E4] bg-[#A35100] rounded-full shadow-xl shadow-[#A35100]/10"
          >
            <Zap size={14} fill="currentColor" />
            Deploy
          </motion.button>
        </div>
      </header>

      {/* ── BODY ── */}
      <main className="flex-1 flex overflow-hidden">

        {/* LEFT: AI AGENT DIALOGUE */}
        <motion.div
          initial={false}
          animate={{ width: isSidebarOpen ? 420 : 0 }}
          style={{ backgroundColor: theme.surface }}
          className="border-r border-[#A35100]/10 flex flex-col overflow-hidden shrink-0 relative z-30"
        >
          <AIChat sandboxID={sandboxID} onFilesChanged={handleFilesChanged} />
        </motion.div>

        {/* RIGHT: WORKSPACE AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/40">

          {/* TAB STRIP */}
          <div className="flex items-center justify-between px-8 h-16 border-b bg-[#FDF3E4]" style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-10">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`transition-colors ${isSidebarOpen ? 'text-[#A35100]' : 'text-[#A35100]/30'}`}
              >
                <PanelLeft size={20} />
              </button>

              <nav className="flex gap-12">
                {['preview', 'code'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveRightTab(tab)}
                    className={`relative text-[10px] font-black uppercase tracking-[0.4em] transition-all ${
                      activeRightTab === tab ? 'text-[#A35100]' : 'text-[#A35100]/30 hover:text-[#A35100]/60'
                    }`}
                  >
                    {tab}
                    {activeRightTab === tab && (
                      <motion.div layoutId="tabMarker" className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-[#A35100]" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
              <Globe size={14} />
              <span>{previewUrl || 'nexus-local:3000'}</span>
            </div>
          </div>

          {/* CONTENT VIEWPORT */}
          <div className="flex-1 flex overflow-hidden relative p-4">
            <div className="flex-1 rounded-[32px] overflow-hidden border border-[#A35100]/10 bg-white shadow-2xl shadow-[#A35100]/5 flex flex-col">
              
              <AnimatePresence mode="wait">
                {activeRightTab === 'preview' ? (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 h-full">
                    <PreviewPanel previewUrl={previewUrl} />
                  </motion.div>
                ) : (
                  <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 flex overflow-hidden">
                      {/* Sub-Sidebar: File Explorer */}
                      <div className="w-72 border-r border-[#A35100]/5 h-full">
                        <FileExplorer agentUrl={agentUrl} onFileClick={openFile} />
                      </div>
                      
                      {/* Code Editor */}
                      <div className="flex-1 h-full overflow-hidden">
                        <EditorPanel
                          openFiles={openFiles} 
                          activeFile={activeFile} 
                          activeFileData={activeFileData}
                          loading={loading} 
                          saveStatus={saveStatus} 
                          onSelect={setActiveFile}
                          onClose={closeFile} 
                          onSave={saveFile} 
                          onContentChange={updateContent}
                        />
                      </div>
                    </div>

                    {/* Resize Gutter (Horizontal) */}
                    <div 
                      className="h-[2px] bg-[#A35100]/5 hover:bg-[#A35100]/40 cursor-row-resize transition-all z-40"
                      onMouseDown={(e) => {
                        isDraggingRef.current = true;
                        document.body.style.cursor = 'row-resize';
                      }}
                    />

                    {/* Bottom Console: Terminal */}
                    <div style={{ height: bottomHeight }} className="shrink-0">
                      <TerminalPanel agentUrl={agentUrl} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Global CSS for buttery scrolling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(163, 81, 0, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(163, 81, 0, 0.3); }
      `}} />
    </div>
  );
}