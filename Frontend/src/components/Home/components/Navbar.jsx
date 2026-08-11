import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { motion, AnimatePresence, usePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

// --- SUB-COMPONENT: WORK ITEM ---
const WorkItem = ({ title, year, to = "#", onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex justify-between items-center py-2 border-b border-[#FFF2E0]/10 hover:border-[#B55500]/50 transition-colors group cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-4 bg-[#FFF2E0]/5 rounded-sm overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity" />
      <span className="text-sm font-light opacity-60 group-hover:opacity-100 group-hover:italic transition-all">{title}</span>
    </div>
    <span className="text-[8px] font-mono opacity-30">{year}</span>
  </Link>
);

// --- SIDE MENU COMPONENT ---
const SideMenuContent = ({ onClose }) => {
  const pathRef = useRef(null);
  const orangePathRef = useRef(null);
  const containerRef = useRef(null);
  const [isPresent, safeToRemove] = usePresence();

  const initialPath = "M 100 0 L 100 100 L 100 100 Q 100 50 100 0 Z";
  const targetPath = "M 100 0 L 100 100 L 20 100 Q 0 50 20 0 Z";

  useLayoutEffect(() => {
    if (isPresent) {
      const tl = gsap.timeline();
      tl.to(orangePathRef.current, { attr: { d: targetPath }, duration: 1, ease: "expo.out" });
      tl.to(pathRef.current, { attr: { d: targetPath }, duration: 1, ease: "expo.out" }, "-=0.9");
    }
  }, [isPresent]);

  useEffect(() => {
    if (!isPresent) {
      gsap.to([pathRef.current, orangePathRef.current], {
        attr: { d: initialPath },
        duration: 0.8,
        ease: "power4.inOut",
        stagger: 0.1,
        onComplete: safeToRemove 
      });
    }
  }, [isPresent, safeToRemove]);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Community', path: '/community' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Sign in', path: '/login' },
  ];

  const containerVariants = {
    initial: { x: 20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2, ease: "easeOut" } 
    },
    exit: { 
      x: 40,
      opacity: 0,
      transition: { staggerChildren: 0.02, staggerDirection: -1, duration: 0.6 } 
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.4 } }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[4px] cursor-pointer"
      />

      <div className="relative h-full w-full max-w-[600px] pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path ref={orangePathRef} fill="#B55500" d={initialPath} />
          <path ref={pathRef} fill="#34170A" d={initialPath} className="translate-x-[1px]" />
        </svg>

        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10 h-full w-full flex flex-col justify-center items-center pointer-events-auto text-[#FFF2E0] px-10"
        >
          <button onClick={onClose} className="absolute top-10 right-10 p-2 text-[#FFF2E0] opacity-40 hover:opacity-100 hover:rotate-90 transition-all duration-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full max-w-[200px] flex flex-col items-center">
            <motion.p variants={itemVariants} className="text-[9px] tracking-[0.5em] uppercase opacity-20 text-center mb-8">Menu</motion.p>
            <div className="space-y-4 text-center">
              {menuItems.map((item) => (
                <motion.div key={item.label} variants={itemVariants} className="group">
                  <Link to={item.path} onClick={onClose}>
                    <h2 className={`font-light tracking-tight group-hover:italic group-hover:text-[#B55500] transition-all duration-300 ${item.label === 'Sign in' ? 'text-sm opacity-40 mt-4' : 'text-xl md:text-2xl'}`}>
                      {item.label}
                    </h2>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div variants={itemVariants} className="mt-16 w-full opacity-60">
              <p className="text-[8px] tracking-[0.3em] uppercase opacity-20 text-center mb-4">Latest</p>
              <div className="space-y-1">
                 <WorkItem title="Wompo" year="2026" to="/work/wompo" onClick={onClose} />
                 <WorkItem title="Two Halves" year="2025" to="/work/two-halves" onClick={onClose} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SideMenu = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && <SideMenuContent onClose={onClose} />}
  </AnimatePresence>
);

const Navbar = () => {
  const [lang, setLang] = useState('IT');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-8 md:p-12 flex justify-end items-start z-[100] pointer-events-none">
        <div className="flex items-center gap-8 pointer-events-auto">
          <button 
            onClick={() => setLang(l => l === 'IT' ? 'EN' : 'IT')}
            className="text-[#B55500] font-light text-[10px] tracking-widest hover:opacity-50 transition-opacity"
          >
            {lang}
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-1.5 cursor-pointer h-8 group">
            <motion.div className="w-[1px] bg-[#B55500]" animate={{ height: isMenuOpen ? 0 : 20 }} whileHover={{ height: 12 }} />
            <motion.div className="w-[1px] bg-[#B55500]" animate={{ height: isMenuOpen ? 0 : 28 }} whileHover={{ height: 36 }} />
          </button>
        </div>
      </nav>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navbar;