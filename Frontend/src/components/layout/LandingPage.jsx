import { useState } from 'react';
import useSandboxStore from '../../store/sandboxStore';
import { useSandbox } from '../../hooks/useSandbox';
import useAuth from '../../hooks/useAuth';
import LoginPage from '../auth/LoginPage';
import ErrorBanner from '../shared/ErrorBanner';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const { error, setInitialPrompt, setError } = useSandboxStore();
  const { triggerStartSandbox } = useSandbox();
  const { user, isAuthenticated, logout } = useAuth();

  const handleStart = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setInitialPrompt(prompt);
    await triggerStartSandbox(prompt);
  };

  if (showLogin) {
    return <LoginPage onCancel={() => setShowLogin(false)} />;
  }

  return (
    <div className="h-screen w-screen bg-[#0D0E10] flex flex-col items-center relative overflow-hidden selection:bg-[#2dd4bf33] font-sans">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-gradient-to-b from-[#2dd4bf08] to-transparent pointer-events-none opacity-50" />
      <div className="absolute top-[-1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#282728] to-transparent" />

      {/* Header */}
      <header className="w-full flex items-center justify-between z-20 max-w-7xl mx-auto px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F8FAFA] flex items-center justify-center text-[#0D0E10]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="font-bold text-[16px] tracking-tighter text-[#F8FAFA]">
            NEXXAGENT <span className="text-[#818263] font-medium">STUDIO</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 bg-[#161618] border border-[#282728] pl-1 pr-3 py-1 rounded-full">
              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border border-[#4F5052] object-cover grayscale" />
              <span className="text-[11px] font-medium text-[#C5C6C8] hidden sm:inline">{user.name}</span>
              <button onClick={logout} className="p-1 hover:text-red-400 text-[#818263] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-1.5 text-[12px] font-medium text-[#F8FAFA] bg-[#161618] hover:bg-[#282728] border border-[#282728] rounded-md transition-all flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center z-10 px-6 -mt-16">
        {error && (
          <div className="w-full max-w-2xl mb-8 animate-slide-up">
            <ErrorBanner message={error} onRetry={handleStart} />
          </div>
        )}

        <div className="flex flex-col items-center text-center mb-10 animate-slide-up">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161618] border border-[#282728] text-[10px] font-bold text-[#2dd4bf] tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2dd4bf] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2dd4bf]"></span>
            </span>
            AI Powered Studio
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#F8FAFA] leading-[0.95] mb-6">
            Ideas to software <br />
            <span className="text-[#818263]">instantly.</span>
          </h1>
          
          <p className="text-[#818263] text-[16px] md:text-[18px] max-w-[500px] leading-relaxed">
            The intelligent workspace for building, deploying, and scaling AI-native applications.
          </p>
        </div>

        {/* Command Center */}
        <div className="w-full max-w-2xl group relative animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute -inset-1 bg-[#2dd4bf15] rounded-[24px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
          
          <div className="relative bg-[#161618] border border-[#282728] rounded-[20px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleStart(); } }}
              placeholder="Deploy a full-stack dashboard with real-time analytics..."
              className="w-full bg-[#0D0E10]/50 border-none outline-none pt-5 px-6 pb-2 text-[#F8FAFA] placeholder-[#4F5052] resize-none h-36 text-lg leading-relaxed"
            />
            
            <div className="flex justify-between items-center px-4 pb-4 pt-2">
              <div className="flex items-center gap-2 ml-2">
                <div className="px-2 py-1 rounded-md bg-[#0D0E10] border border-[#282728] flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  <span className="text-[10px] font-bold text-[#818263] uppercase tracking-widest">Gemini 1.5</span>
                </div>
              </div>
              
              <button 
                onClick={handleStart}
                disabled={!prompt.trim()}
                className={`group px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all flex items-center gap-2 ${
                  prompt.trim() 
                  ? 'bg-[#F8FAFA] text-[#0D0E10] hover:bg-[#C5C6C8] shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95' 
                  : 'bg-[#282728] text-[#4F5052] cursor-not-allowed'
                }`}
              >
                <span>Generate</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hints */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
           {["Portfolio Site", "SaaS CRM", "AI Chatbot UI", "Markdown Editor"].map((text) => (
             <button 
                key={text}
                onClick={() => setPrompt(`Build a ${text}`)}
                className="px-4 py-1.5 text-[11px] font-medium text-[#4F5052] hover:text-[#F8FAFA] hover:border-[#4F5052] border border-[#282728] rounded-full transition-all"
             >
               {text}
             </button>
           ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between border-t border-[#282728]/40 z-10 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#818263] uppercase">
          &copy; {new Date().getFullYear()} NEXXAGENT. STUDIO v1.0
        </p>
        <div className="flex items-center gap-8 mt-6 md:mt-0">
          {['Documentation', 'Security', 'Privacy'].map(link => (
            <a key={link} href="#" className="text-[11px] font-medium text-[#818263] hover:text-[#F8FAFA] transition-colors">{link}</a>
          ))}
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}} />
    </div>
  );
}