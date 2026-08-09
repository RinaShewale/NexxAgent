import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [lang, setLang] = useState('IT');

  const toggleLanguage = () => {
    setLang(prev => (prev === 'IT' ? 'EN' : 'IT'));
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-8 md:p-12 flex justify-end items-start z-[100] pointer-events-none">
      <div className="flex items-center gap-8 pointer-events-auto">
        
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="text-[#B55500] font-light text-xs md:text-sm tracking-widest hover:opacity-50 transition-opacity duration-300 outline-none"
        >
          {lang}
        </button>

        {/* Custom Minimalist Menu Icon */}
        <button className="group flex items-center gap-1 cursor-pointer h-12 outline-none">
          {/* Left Vertical Line */}
          <motion.div 
            className="w-[1px] bg-[#B55500]"
            initial={{ height: 24 }}
            whileHover={{ height: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Right Vertical Line */}
          <motion.div 
            className="w-[1px] bg-[#B55500]"
            initial={{ height: 24 }}
            whileHover={{ height: 32 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          
          {/* Optional: Screen reader text */}
          <span className="sr-only">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;