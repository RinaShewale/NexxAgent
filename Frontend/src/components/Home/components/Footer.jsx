import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const magneticArea = useRef(null);
  const phrase = "let's work together";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth Scroll Reveal for the sections
      gsap.from(".reveal-up", {
        y: 80,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Framer Motion Variants for the "Wave"
  const containerVariants = {
    initial: {},
    hover: {
      transition: {
        staggerChildren: 0.03,
      }
    }
  };

  const letterVariants = {
    initial: { y: 0 },
    hover: { 
      y: -15,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  };

  return (
    <footer 
      ref={footerRef} 
      className="w-full min-h-screen bg-[#FDF2E3] text-[#964B00] px-10 pb-12 pt-32 flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* Main CTA Section */}
      <div className="flex-grow flex items-center justify-center">
        <motion.a 
          ref={magneticArea}
          href="mailto:lorenzo@lannino.com" 
          variants={containerVariants}
          initial="initial"
          whileHover="hover"
          className="group relative flex items-center gap-4 md:gap-10 cursor-pointer p-10"
        >
          <div className="flex overflow-hidden pb-[4em]">
            <h2 className="reveal-up text-[10vw] font-light tracking-tighter leading-none flex lowercase">
              {phrase.split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={letterVariants}
                  className="inline-block whitespace-pre will-change-transform"
                >
                  {char}
                </motion.span>
              ))}
            </h2>
          </div>
          
          <div className="reveal-up relative overflow-hidden pb-[1em]">
            <motion.div
              className="relative"
              whileHover={{ x: 5, y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowUpRight 
                strokeWidth={0.5} 
                className="w-16 h-16 md:w-28 md:h-28" 
              />
            </motion.div>
          </div>

          {/* Underline Decoration */}
          <motion.div 
            className="absolute bottom-6 left-12 right-12 h-[1px] bg-[#964B00] origin-left"
            initial={{ scaleX: 0, opacity: 0 }}
            whileHover={{ scaleX: 1, opacity: 0.2 }}
            transition={{ duration: 0.6, ease: "circOut" }}
          />
        </motion.a>
      </div>

      {/* Footer Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-24 items-end text-[10px] uppercase tracking-[0.3em] font-medium">
        
        {/* Left: Socials */}
        <div className="flex flex-col gap-4 reveal-up">
          <p className="opacity-40">Connect</p>
          <div className="flex gap-6 normal-case tracking-tight font-light text-base">
            {['LinkedIn', 'GitHub', 'Behance'].map((link) => (
              <a key={link} href="#" className="relative group overflow-hidden">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">{link}</span>
                <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-[#964B00] italic">
                  {link}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Center: Branding */}
        <div className="flex flex-col items-center text-center gap-2 reveal-up py-16 md:py-0">
          <div className="h-[1px] w-12 bg-[#964B00] opacity-20 mb-4" />
          <p className="text-4xl font-light tracking-tighter normal-case">
            Lorenzo Lannino
          </p>
          <p className="opacity-30 tracking-[0.5em] text-[8px]">Curated Portfolio © 2026</p>
        </div>

        {/* Right: Contact */}
        <div className="flex flex-col items-end gap-4 reveal-up text-right">
          <p className="opacity-40">Inquiries</p>
          <a href="mailto:lorenzo@lannino.com" className="normal-case tracking-tight font-light text-base group">
            lorenzo@lannino.com
            <div className="h-[1px] w-0 group-hover:w-full bg-[#964B00] transition-all duration-500 ease-out opacity-50" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;