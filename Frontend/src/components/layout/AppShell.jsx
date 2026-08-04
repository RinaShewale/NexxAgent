import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [bottomHeight, setBottomHeight] = useState(200);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isDraggingRef = useRef(null);

  useEffect(() => {
    if (agentUrl && viewState === 'editor') refreshTree();
  }, [agentUrl, viewState]);

  const handleFilesChanged = useCallback(() => refreshTree(), [refreshTree]);

  if (showLogin) return <LoginPage onCancel={() => setShowLogin(false)} />;
  if (viewState === 'landing') return <LandingPage />;
  if (viewState === 'generating') return <GeneratingPage />;

  return (
    <div className="h-screen w-screen bg-[#0D0E10] flex flex-col overflow-hidden text-[#F8FAFA] selection:bg-[#2dd4bf33]">
      {/* Premium Header */}
      <header className="flex items-center justify-between px-4 h-12 border-b border-[#282728] bg-[#0D0E10]/90 backdrop-blur-xl z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={reset} 
            className="p-1.5 hover:bg-[#282728] rounded-md transition-all duration-200 text-[#818263] hover:text-[#F8FAFA]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#F8FAFA] flex items-center justify-center">
              <div className="w-3 h-3 bg-[#0D0E10] rounded-[1px] rotate-45" />
            </div>
            <span className="font-medium text-[13px] tracking-tight">
              NexxAgent <span className="text-[#818263] font-normal mx-1">/</span> <span className="text-[#F8FAFA]">Studio</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#282728] bg-[#161618] text-[10px] font-medium text-[#818263]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]" />
            Live Sync
          </div>
          
          <button className="px-3 py-1.5 text-[11px] font-semibold text-[#0D0E10] bg-[#F8FAFA] hover:bg-[#C5C6C8] rounded-md transition-all active:scale-95 shadow-sm">
            Deploy
          </button>

          {/* User Auth Info */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-3 border-l border-[#282728]">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-6 h-6 rounded-full border border-[#282728] object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" 
              />
              <button
                onClick={logout}
                className="text-[10px] text-[#818263] hover:text-[#F8FAFA] transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-md hover:bg-[#282728] text-[#F8FAFA] transition-all border border-transparent hover:border-[#4F5052]"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left: AI Chat - Styled with a softer secondary background */}
        <div 
          className={`${isSidebarOpen ? 'w-[360px]' : 'w-0'} transition-all duration-300 ease-in-out border-r border-[#282728] bg-[#0D0E10] flex flex-col overflow-hidden shrink-0`}
        >
          <AIChat sandboxID={sandboxID} onFilesChanged={handleFilesChanged} />
        </div>

        {/* Right: Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0D0E10]">
          {/* Internal Workspace Header */}
          <div className="flex items-center justify-between px-4 h-10 border-b border-[#282728] bg-[#0D0E10]">
            <div className="flex p-[3px] bg-[#161618] rounded-lg border border-[#282728]">
              {['preview', 'code'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveRightTab(tab)}
                  className={`px-3 py-1 rounded-[5px] text-[11px] font-medium capitalize transition-all duration-200 ${
                    activeRightTab === tab 
                      ? 'bg-[#282728] text-[#F8FAFA] shadow-sm' 
                      : 'text-[#818263] hover:text-[#C5C6C8]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-1">
               <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-1.5 rounded-md transition-colors ${!isSidebarOpen ? 'bg-[#F8FAFA] text-[#0D0E10]' : 'text-[#818263] hover:text-[#F8FAFA]'}`}
                title="Toggle Sidebar"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden relative">
            {activeRightTab === 'preview' ? (
              <div className="flex-1 bg-[#161618] animate-in fade-in duration-500">
                <PreviewPanel previewUrl={previewUrl} />
              </div>
            ) : (
              <div className="flex-1 flex overflow-hidden">
                {/* File Explorer Panel */}
                <div 
                  style={{ width: sidebarWidth }} 
                  className="border-r border-[#282728] shrink-0 bg-[#0D0E10]"
                >
                  <FileExplorer agentUrl={agentUrl} onFileClick={openFile} />
                </div>

                {/* Editor & Terminal Section */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex-1 overflow-hidden">
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

                  {/* Horizontal Resize Handle */}
                  <div 
                    className="h-[1px] bg-[#282728] hover:bg-[#2dd4bf] cursor-row-resize transition-colors relative group"
                    onMouseDown={() => isDraggingRef.current = 'bottom'}
                  >
                    <div className="absolute inset-x-0 -top-1 -bottom-1 z-10" />
                  </div>

                  {/* Terminal Panel */}
                  <div 
                    style={{ height: bottomHeight }} 
                    className="bg-[#0D0E10] border-t border-[#282728]"
                  >
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
              // Constraints: min 80px, max 60% of height
              setBottomHeight(Math.max(80, Math.min(h, window.innerHeight * 0.6)));
            }
          }}
          onMouseUp={() => isDraggingRef.current = null}
        />
      )}

      {/* Global Style Inject for the specific palette */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-seasalt: #F8FAFA;
          --color-silver: #C5C6C8;
          --color-gray: #818263;
          --color-davys: #4F5052;
          --color-raisin: #282728;
          --color-night: #0D0E10;
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #282728; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #4F5052; }
      `}} />
    </div>
  );
}