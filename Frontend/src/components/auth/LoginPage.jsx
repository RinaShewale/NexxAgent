import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import useAuth from '../../hooks/useAuth';

export default function LoginPage({ onCancel }) {
  const { loginWithGoogle, loading, user, isAuthenticated, logout } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const glowRef1 = useRef(null);
  const glowRef2 = useRef(null);
  const cardRef = useRef(null);

  const handleGoogleLogin = () => {
    setIsRedirecting(true);
    loginWithGoogle();
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Ambient glow drift, looping, independent of React state
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
    tl.to(glowRef1.current, { x: 30, y: 20, duration: 8 }, 0);
    tl.to(glowRef2.current, { x: -30, y: -20, duration: 9 }, 0);

    // Card entrance: subtle 3D settle
    gsap.fromTo(
      cardRef.current,
      { y: 24, opacity: 0, rotateX: -4 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 }
    );

    return () => tl.kill();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#FDF3E4] text-[#A35100] flex flex-col font-sans antialiased selection:bg-[#A35100] selection:text-[#FDF3E4]">
      {/* Subtlest background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          ref={glowRef1}
          className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-[#A35100]/10 rounded-full blur-[120px]"
        />
        <div
          ref={glowRef2}
          className="absolute -bottom-[25%] -right-[10%] w-[70%] h-[70%] bg-[#A35100]/[0.06] rounded-full blur-[120px]"
        />
      </div>

      {/* Top Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex items-center justify-between px-8 py-6"
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="w-8 h-8 rounded-lg bg-[#A35100] flex items-center justify-center text-[#FDF3E4] shadow-lg shadow-[#A35100]/20"
          >
            <span className="text-xl">✦</span>
          </motion.div>
          <span className="font-serif italic text-lg tracking-tight text-[#A35100]">NexxAgent</span>
        </div>

        {onCancel && (
          <motion.button
            whileHover={{ x: 2 }}
            onClick={onCancel}
            className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#A35100]/60 hover:text-[#A35100] transition-colors"
          >
            Cancel
          </motion.button>
        )}
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[400px]" style={{ perspective: 1000 }}>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="text-center mb-10"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold opacity-50">
              Studio Access
            </span>
            <h1 className="text-4xl font-serif italic tracking-tight mb-3">
              {isAuthenticated ? "Welcome back" : "Sign in to Studio"}
            </h1>
            <p className="text-[#A35100]/70 text-[15px] leading-relaxed">
              {isAuthenticated
                ? "You are currently signed in to your account."
                : "Manage your autonomous agents and sandboxes."}
            </p>
          </motion.div>

          <div
            ref={cardRef}
            className="bg-[#FDF3E4] border border-[#A35100]/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-[#A35100]/5"
          >
            <AnimatePresence mode="wait">
              {isAuthenticated && user ? (
                <motion.div
                  key="authenticated"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-[#A35100]/5 border border-[#A35100]/10"
                  >
                    <img
                      src={user.avatar || 'https://via.placeholder.com/64'}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border border-[#A35100]/40 object-cover"
                    />
                    <div className="overflow-hidden">
                      <p className="font-medium text-[#A35100] truncate">{user.name}</p>
                      <p className="text-xs text-[#A35100]/50 truncate">{user.email}</p>
                    </div>
                  </motion.div>

                  <div className="grid gap-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onCancel}
                      className="w-full py-3 rounded-xl bg-[#A35100] text-[#FDF3E4] font-semibold text-[11px] uppercase tracking-[0.3em] hover:bg-[#8a4400] transition-colors"
                    >
                      Enter Workspace
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={logout}
                      className="w-full py-3 rounded-xl bg-[#A35100]/5 text-[#A35100]/70 font-medium text-[11px] uppercase tracking-[0.3em] hover:bg-red-500/10 hover:text-red-600 transition-all"
                    >
                      Sign Out
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="unauthenticated"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={loading || isRedirecting}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#A35100] text-[#FDF3E4] font-semibold text-[11px] uppercase tracking-[0.3em] hover:bg-[#8a4400] transition-all disabled:opacity-50"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isRedirecting ? (
                        <motion.svg
                          key="spinner"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="animate-spin h-5 w-5 text-[#FDF3E4]"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </motion.svg>
                      ) : (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3 normal-case tracking-normal font-semibold text-sm"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          Continue with Google
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <p className="text-[11px] text-center text-[#A35100]/50 px-4 leading-relaxed">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 p-8 flex justify-center"
      >
        <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#A35100]/40">
          <span className="text-[#A35100]/50">© {new Date().getFullYear()} NexxAgent</span>
          <a href="#" className="hover:text-[#A35100] transition-colors">Status</a>
          <a href="#" className="hover:text-[#A35100] transition-colors">Docs</a>
          <a href="#" className="hover:text-[#A35100] transition-colors">Support</a>
        </div>
      </motion.footer>

      {/* Grain Overlay — matches the About page's texture treatment */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.05] z-[100] mix-blend-multiply"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dvwthyt94/image/upload/v1672322316/noise_yvsk9m.png')` }}
      />
    </div>
  );
}