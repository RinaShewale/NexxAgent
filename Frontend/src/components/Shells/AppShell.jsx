import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Globe, 
  Code2, 
  Play, 
  PanelLeft, 
  ChevronRight,
  LogOut,
  Monitor
} from 'lucide-react';

// Logic Hooks & Components (Paths preserved)
import FileExplorer from '../explorer/FileExplorer';
import EditorPanel from '../editor/EditorPanel';
import PreviewPanel from '../preview/PreviewPanel';
import TerminalPanel from '../terminal/TerminalPanel';
import AIChat from '../ai/AIChat';
import LandingPage from './LandingPage';
import GeneratingPage from './GeneratingPage';
import LoginPage from '../auth/LoginPage'; 
import useSandboxStore from '../../store/sandboxStore';
import { useFileEditor } from '../../hooks/useFileEditor';
import { useFileTree } from '../../hooks/useFileTree';
import useAuth from '../../hooks/useAuth';

export default function AppShell() {
  const { sandboxID, previewUrl, agentUrl, viewState, initialPrompt, reset } = useSandboxStore();
  const { refresh: refreshTree } = useFileTree(agentUrl);
  const { openFiles, activeFile, activeFileData, loading, saveStatus, openFile, closeFile, updateContent, saveFile, setActiveFile } = useFileEditor(agentUrl);
  const { user, isAuthenticated, logout } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState('preview');
  const [bottomHeight, setBottomHeight] = useState(240);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isDraggingRef = useRef(null);

  useEffect(() => {
    if (agentUrl && viewState === 'editor') refreshTree();
  }, [agentUrl, viewState, refreshTree]);

  const handleFilesChanged = useCallback(() => refreshTree(), [refreshTree]);

  if (showLogin) return <LoginPage onCancel={() => setShowLogin(false)} />;
  if (viewState === 'landing') return <LandingPage />;
  if (viewState === 'generating') return <GeneratingPage />;

  return (
    <div className="h-screen w-screen bg-[#000] flex flex-col overflow-hidden text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* PRIMARY HEADER */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-white/5 bg-black/80 backdrop-blur-xl z-[50] sticky top-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={reset} 
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all group"
          >
            <ArrowLeft size={18} className="group-active:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Sparkles className="text-black" size={18} />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-white">Nexx Studio</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">v4.0.2-Stable</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Engine Status */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
            <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-blue-500 rounded-full" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Sync Active</span>
          </div>
          
          <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-black uppercase tracking-widest text-black bg-white hover:bg-zinc-200 rounded-xl transition-all active:scale-95 shadow-xl shadow-white/5">
            <Zap size={14} className="fill-black" />
            Deploy App
          </button>

          {/* User Section */}
          <div className="h-6 w-px bg-white/10 mx-2" />
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-xl border border-white/10 grayscale group-hover:grayscale-0 transition-all" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
              </div>
              <button onClick={logout} className="p-2 text-zinc-600 hover:text-rose-400 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT: AI CHAT SIDEBAR */}
        <motion.div 
          initial={false}
          animate={{ width: isSidebarOpen ? 380 : 0 }}
          className="border-r border-white/5 bg-black flex flex-col overflow-hidden shrink-0 relative z-30 shadow-2xl"
        >
          <AIChat sandboxID={sandboxID} onFilesChanged={handleFilesChanged} />
        </motion.div>

        {/* WORKSPACE AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
          
          {/* TAB STRIP */}
          <div className="flex items-center justify-between px-6 h-12 border-b border-white/5 bg-black">
            <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`p-2 rounded-lg transition-all ${!isSidebarOpen ? 'bg-blue-500 text-white' : 'text-zinc-600 hover:text-white'}`}
                >
                  <PanelLeft size={18} />
                </button>

                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 relative">
                    {['preview', 'code'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveRightTab(tab)}
                            className={`relative px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest z-10 transition-colors ${
                                activeRightTab === tab ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            {tab === 'preview' ? 'Preview' : 'Source Code'}
                            {activeRightTab === tab && (
                                <motion.div layoutId="workspaceTab" className="absolute inset-0 bg-white rounded-lg -z-10" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Globe size={12} className="text-blue-400" />
                    <span className="text-[10px] font-bold text-blue-400 font-mono">Nexx-Local:3000</span>
                </div>
            </div>
          </div>

          {/* MAIN CONTENT SPLIT */}
          <div className="flex-1 flex overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeRightTab === 'preview' ? (
                <motion.div 
                    key="preview" 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex-1"
                >
                    <PreviewPanel previewUrl={previewUrl} />
                </motion.div>
              ) : (
                <motion.div 
                    key="code" 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex"
                >
                  {/* File Explorer Sidebar */}
                  <div className="w-[260px] border-r border-white/5 bg-black shrink-0">
                    <FileExplorer agentUrl={agentUrl} onFileClick={openFile} />
                  </div>

                  {/* Editor & Terminal Vertical Split */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1">
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

                    {/* Resize Handle Horizontal */}
                    <div 
                      className="h-1 bg-white/5 hover:bg-blue-500/50 cursor-row-resize transition-all relative z-40"
                      onMouseDown={() => isDraggingRef.current = 'bottom'}
                    />

                    {/* Terminal Bottom Panel */}
                    <div style={{ height: bottomHeight }} className="bg-black border-t border-white/5">
                      <TerminalPanel agentUrl={agentUrl} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* DRAG OVERLAY */}
      {isDraggingRef.current && (
        <div 
          className="fixed inset-0 z-[100] cursor-row-resize"
          onMouseMove={(e) => {
            if (isDraggingRef.current === 'bottom') {
              const h = window.innerHeight - e.clientY;
              setBottomHeight(Math.max(100, Math.min(h, window.innerHeight * 0.7)));
            }
          }}
          onMouseUp={() => isDraggingRef.current = null}
        />
      )}

      {/* CUSTOM SCROLLBAR GLOBAL */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #333; }
        * { scrollbar-width: thin; scrollbar-color: #1a1a1a transparent; }
      `}} />
    </div>
  );
} 