import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const bigTextRef = useRef(null);
  const infoSectionRef = useRef(null);
  const [canHover, setCanHover] = useState(true);
  const phrase = "let's work together";

  // Detect hover-capable pointer to prevent stuck infinite animation on mobile touch
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia ? gsap.matchMedia() : null;

      const setupAnimations = (isMobile) => {
        // 1. Scroll-based animation for Big Heading (Parallax + Scale)
        gsap.fromTo(bigTextRef.current, 
          { 
            y: isMobile ? 40 : 100, 
            scale: isMobile ? 0.95 : 0.9, 
            opacity: 0 
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: isMobile ? "top 90%" : "top bottom", 
              end: isMobile ? "center 60%" : "center center",
              scrub: isMobile ? 0.5 : 1,
            }
          }
        );

        // 2. Scroll-based reveal for the bottom info grid (mobile uses smaller y offset to prevent overflow clipping)
        gsap.from(".reveal-scroll", {
          y: isMobile ? 40 : 150,
          opacity: 0,
          stagger: isMobile ? 0.05 : 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: isMobile ? "top 60%" : "top 20%", 
            end: "bottom bottom",
            scrub: isMobile ? 0.5 : 1,
          }
        });

        // 3. Horizontal slide for the line decoration on scroll
        gsap.fromTo(".footer-line", 
          { scaleX: 0 },
          { 
            scaleX: 1,
            scrollTrigger: {
              trigger: footerRef.current,
              start: isMobile ? "top 70%" : "top 50%",
              end: "bottom bottom",
              scrub: isMobile ? 1 : 2,
            }
          }
        );
      };

      if (mm) {
        mm.add("(min-width: 768px)", () => setupAnimations(false));
        mm.add("(max-width: 767px)", () => setupAnimations(true));
      } else {
        setupAnimations(window.innerWidth < 768);
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Framer Motion Hover Variants
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
        repeat: canHover ? Infinity : 0, // Infinite on desktop, single on touch screens
        repeatType: "mirror"
      }
    }
  };

  return (
    <footer 
      ref={footerRef} 
      className="w-full min-h-[100dvh] md:min-h-screen bg-[#FDF2E3] text-[#964B00] px-5 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-12 pt-16 sm:pt-20 md:pt-32 flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* Main CTA Section */}
      <div className="flex-grow flex items-center justify-center w-full">
        <motion.a 
          ref={bigTextRef}
          href="mailto:lorenzo@lannino.com" 
          variants={containerVariants}
          initial="initial"
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          className="group relative flex flex-row items-center justify-center gap-2 sm:gap-6 md:gap-10 cursor-pointer p-2 sm:p-6 md:p-10 w-fit max-w-full md:w-auto mx-auto active:opacity-90"
        >
          {/* Headline Text: single responsive row, prevents awkward clipping on mobile */}
          <div className="flex overflow-hidden pb-1 sm:pb-2 md:pb-[4em]">
            <h2 className="text-[6.8vw] sm:text-[8.5vw] md:text-[10vw] font-light tracking-tighter leading-none flex flex-nowrap whitespace-nowrap lowercase">
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
          
          {/* Arrow Icon: sits harmoniously next to headline on all screens with visible stroke */}
          <div className="relative overflow-hidden pb-1 sm:pb-1 md:pb-[1em] flex-shrink-0 flex items-center">
            <motion.div
              className="relative"
              whileHover={{ x: 5, y: -5 }}
              whileTap={{ x: 3, y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowUpRight 
                strokeWidth={0.5} 
                className="w-6 h-6 sm:w-14 sm:h-14 md:w-28 md:h-28 stroke-[1.25] md:stroke-[0.5]" 
              />
            </motion.div>
          </div>

          {/* Underline Decoration: sits neatly under CTA lockup on mobile, untouched on desktop */}
          <div className="footer-line absolute bottom-0 md:bottom-6 left-0 md:left-12 right-0 md:right-12 h-[1px] bg-[#964B00] origin-left opacity-20" />
        </motion.a>
      </div>

      {/* Footer Info Section: 2 columns on mobile, 3 columns on desktop */}
      <div 
        ref={infoSectionRef} 
        className="grid grid-cols-2 md:grid-cols-3 w-full mt-10 sm:mt-16 md:mt-24 items-start md:items-end gap-y-8 sm:gap-y-10 md:gap-y-0 text-[10px] uppercase tracking-[0.3em] font-medium"
      >
        {/* Left: Socials */}
        <div className="col-span-1 flex flex-col gap-3 md:gap-4 reveal-scroll items-start">
          <p className="opacity-40">Connect</p>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-6 normal-case tracking-tight font-light text-sm md:text-base">
            {['LinkedIn', 'GitHub', 'Behance'].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="relative group overflow-hidden w-fit py-0.5 md:py-0 active:opacity-60 transition-opacity"
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">{link}</span>
                <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-[#964B00] italic">
                  {link}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Branding: Anchored full-width at the bottom on mobile, centered on desktop */}
        <div className="col-span-2 md:col-span-1 order-last md:order-none flex flex-col items-center text-center gap-2 reveal-scroll pt-2 sm:pt-4 md:pt-0">
          <div className="h-[1px] w-12 bg-[#964B00] opacity-20 mb-2 sm:mb-3 md:mb-4" />
          <p className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tighter normal-case">
            NEX<span className="font-medium">AGENT</span>
          </p>
          <p className="opacity-30 tracking-[0.3em] sm:tracking-[0.5em] text-[8px]">Nexus Intelligence © 2026</p>
        </div>

        {/* Right: Contact */}
        <div className="col-span-1 flex flex-col items-end gap-3 md:gap-4 reveal-scroll text-right">
          <p className="opacity-40">Inquiries</p>
          <a 
            href="mailto:nexagent.com" 
            className="normal-case tracking-tight font-light text-sm md:text-base group py-0.5 md:py-0 active:opacity-60 transition-opacity inline-block"
          >
            NexAgent.com
            <div className="h-[1px] w-0 group-hover:w-full bg-[#964B00] transition-all duration-500 ease-out opacity-50" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;