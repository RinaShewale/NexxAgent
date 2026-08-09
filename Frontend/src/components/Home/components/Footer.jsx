import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    // Animation for elements revealing on scroll
    const ctx = gsap.context(() => {
      gsap.from(".footer-reveal", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full min-h-[70vh] bg-[#FFF2E0] text-[#B55500] px-10 pb-10 pt-20 flex flex-col justify-between overflow-hidden"
    >
      {/* 1. The Central Decorative Dot */}
      <div className="flex justify-center mb-10 footer-reveal">
        <div className="w-2 h-2 rounded-full bg-[#B55500]" />
      </div>

      {/* 2. Main Call to Action Section */}
      <div className="flex-grow flex items-center justify-center">
        <a 
          href="mailto:lorenzo@lannino.com" 
          className="group flex items-center gap-6 md:gap-10 hover:opacity-70 transition-opacity duration-500"
        >
          <h2 className="footer-reveal text-[10vw] md:text-[8vw] font-extralight tracking-tight leading-none lowercase italic md:not-italic">
            Let's work together
          </h2>
          <ArrowUpRight 
            strokeWidth={1} 
            className="footer-reveal w-12 h-12 md:w-24 md:h-24 transition-transform duration-500 group-hover:translate-x-3 group-hover:-translate-y-3" 
          />
        </a>
      </div>

      {/* 3. Bottom Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-20 items-end text-[10px] md:text-xs uppercase tracking-[0.2em] font-light">
        
        {/* Left: Socials */}
        <div className="flex flex-col gap-4 footer-reveal">
          <p className="opacity-50">Socials</p>
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-50 transition-opacity">LinkedIn</a>
            <a href="#" className="hover:opacity-50 transition-opacity">GitHub</a>
          </div>
        </div>

        {/* Center: Branding & Copyright */}
        <div className="flex flex-col items-center text-center gap-2 footer-reveal py-10 md:py-0">
          <p className="text-xl md:text-2xl normal-case tracking-normal font-extralight">
            Lorenzo Lannino
          </p>
          <p className="opacity-40">© 2026 Edition</p>
          <a href="#" className="opacity-40 hover:opacity-100 transition-opacity lowercase tracking-normal">
            Privacy Policy
          </a>
        </div>

        {/* Right: Contact */}
        <div className="flex flex-col items-end gap-4 footer-reveal">
          <p className="opacity-50">Contacts</p>
          <a href="mailto:lorenzo@lannino.com" className="hover:opacity-50 transition-opacity">
            lorenzo@lannino.com
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;