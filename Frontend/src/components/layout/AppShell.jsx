import { useState, useRef, useEffect, useCallback } from 'react';
import FileExplorer from '../explorer/FileExplorer';
import EditorPanel from '../editor/EditorPanel';
import PreviewPanel from '../preview/PreviewPanel';
import TerminalPanel from '../terminal/TerminalPanel';
import AIChat from '../ai/AIChat';
import LandingPage from './LandingPage';
import GeneratingPage from './GeneratingPage';
import useSandboxStore from '../../store/sandboxStore';
import { useFileEditor } from '../../hooks/useFileEditor';
import { useFileTree } from '../../hooks/useFileTree';

export default function AppShell() {
  const { sandboxID, previewUrl, agentUrl, viewState, initialPrompt, reset } = useSandboxStore();
  const { refresh: refreshTree } = useFileTree(agentUrl);
  const { openFiles, activeFile, activeFileData, loading, saveStatus, openFile, closeFile, updateContent, saveFile, setActiveFile } = useFileEditor(agentUrl);

  const [activeRightTab, setActiveRightTab] = useState('preview');
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [bottomHeight, setBottomHeight] = useState(200);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isDraggingRef = useRef(null);

  useEffect(() => {
    if (agentUrl && viewState === 'editor') refreshTree();
  }, [agentUrl, viewState]);

  // Stable callback reference so AIChat effects don't re-fire on every parent render
  const handleFilesChanged = useCallback(() => refreshTree(), [refreshTree]);

  if (viewState === 'landing') return <LandingPage />;
  if (viewState === 'generating') return <GeneratingPage />;

  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col overflow-hidden text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <button onClick={reset} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">✦</div>
            <span className="font-semibold text-sm hidden sm:block">NexxAgent <span className="text-teal-500">Studio</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-white/5 rounded-full px-3 py-1 text-[11px] text-slate-500 border border-white/5 items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Live Sync: Connected
          </div>
          <button className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-full transition-all shadow-lg shadow-teal-500/20">
            Deploy
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10" />
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left: AI Chat */}
        <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-white/5 bg-[#020617] flex flex-col overflow-hidden shrink-0`}>
          <AIChat sandboxID={sandboxID} onFilesChanged={handleFilesChanged} />
        </div>

        {/* Right: Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-4 h-12 border-b border-white/5 bg-[#030712]">
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
              {['preview', 'code'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveRightTab(tab)}
                  className={`px-4 py-1 rounded-lg text-xs font-medium capitalize transition-all ${activeRightTab === tab ? 'bg-teal-500/10 text-teal-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {activeRightTab === 'preview' ? (
              <PreviewPanel previewUrl={previewUrl} />
            ) : (
              <div className="flex-1 flex overflow-hidden">
                <div style={{ width: sidebarWidth }} className="border-r border-white/5 shrink-0">
                  <FileExplorer agentUrl={agentUrl} onFileClick={openFile} />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex-1">
                    <EditorPanel
                      openFiles={openFiles} activeFile={activeFile} activeFileData={activeFileData}
                      loading={loading} saveStatus={saveStatus} onSelect={setActiveFile}
                      onClose={closeFile} onSave={saveFile} onContentChange={updateContent}
                    />
                  </div>
                  <div className="h-1 bg-white/5 hover:bg-teal-500/40 cursor-row-resize transition-all" onMouseDown={() => isDraggingRef.current = 'bottom'} />
                  <div style={{ height: bottomHeight }} className="bg-[#010409]">
                    <TerminalPanel agentUrl={agentUrl} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Resize Overlay */}
      {isDraggingRef.current && (
        <div 
          className="fixed inset-0 z-50 cursor-row-resize"
          onMouseMove={(e) => {
            if (isDraggingRef.current === 'bottom') {
              const h = window.innerHeight - e.clientY;
              setBottomHeight(Math.max(100, Math.min(h, 500)));
            }
          }}
          onMouseUp={() => isDraggingRef.current = null}
        />
      )}
    </div>
  );
}