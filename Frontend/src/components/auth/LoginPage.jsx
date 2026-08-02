import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function LoginPage({ onCancel }) {
  const { loginWithGoogle, loading, user, isAuthenticated, logout } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleLogin = () => {
    setIsRedirecting(true);
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Subtlest background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-teal-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[70%] h-[70%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20">
            <span className="text-xl">✦</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">NexxAgent</span>
        </div>
        
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[400px] animate-in fade-in zoom-in-95 duration-700">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">
              {isAuthenticated ? "Welcome back" : "Sign in to Studio"}
            </h1>
            <p className="text-slate-400 text-[15px]">
              {isAuthenticated 
                ? "You are currently signed in to your account." 
                : "Manage your autonomous agents and sandboxes."}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            {isAuthenticated && user ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <img
                    src={user.avatar || 'https://via.placeholder.com/64'}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border border-teal-500/50 object-cover"
                  />
                  <div className="overflow-hidden">
                    <p className="font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    onClick={onCancel}
                    className="w-full py-3 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Enter Workspace
                  </button>
                  <button
                    onClick={logout}
                    className="w-full py-3 rounded-xl bg-white/5 text-slate-400 font-medium text-sm hover:bg-red-500/10 hover:text-red-400 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading || isRedirecting}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  {isRedirecting ? (
                    <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
                
                <p className="text-[11px] text-center text-slate-500 px-4">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 p-8 flex justify-center">
        <div className="flex gap-6 text-[12px] font-medium text-slate-600">
          <span className="text-slate-700">© {new Date().getFullYear()} NexxAgent</span>
          <a href="#" className="hover:text-slate-400 transition-colors">Status</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Docs</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}