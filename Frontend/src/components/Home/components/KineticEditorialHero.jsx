import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const KineticEditorialHero = () => {
  const containerRef = useRef(null);
  const card1 = useRef(null);
  const card2 = useRef(null);
  const card3 = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Idle Floating Animation
      [card1.current, card2.current, card3.current].forEach((card, i) => {
        gsap.to(card, {
          y: "+=15",
          rotation: i % 2 === 0 ? 1 : -1,
          duration: 3 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      // Scroll Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        }
      });

      tl.to(card1.current, { y: -150, x: -20, rotation: -5 }, 0);
      tl.to(card2.current, { y: -200, x: 40, rotation: 8 }, 0);
      tl.to(card3.current, { y: -100, x: -30, rotation: -4 }, 0);
      
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen bg-[#F8EDDB] text-[#934B1C] overflow-hidden select-none flex flex-col justify-between p-12 md:p-20"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6-dark.png')]" />

      {/* --- TYPOGRAPHY (NO CHANGES TO SIZE/POSITION) --- */}
      <div className="w-full flex justify-start z-10">
        <h1 className="text-[12vw] md:text-[140px] font-serif font-medium leading-none uppercase tracking-tighter mix-blend-multiply">
          Never
        </h1>
      </div>

      <div className="w-full flex justify-center z-10 translate-y-[-10%]">
        <h1 className="text-[4vw] md:text-[32px] font-sans font-[200] leading-none uppercase tracking-[1.2em] opacity-40 italic mix-blend-multiply">
          The Same
        </h1>
      </div>

      <div className="w-full flex justify-end z-10">
        <h1 className="text-[16vw] md:text-[180px] font-sans font-black leading-[0.8] uppercase tracking-[-0.06em] mix-blend-multiply">
          Thing
        </h1>
      </div>

      {/* --- CARDS REPOSITIONED TO BLUE DOTS --- */}

      {/* Card 1: WOMPO (Moved to Top-Center-Right Dot) */}
      <div 
        ref={card1}
        className="absolute top-[8%] left-[50%] w-[220px] rounded-2xl border border-white/10 bg-[#42210B] shadow-[0_30px_60px_rgba(66,33,11,0.4)] z-20 overflow-hidden"
      >
        <WindowHeader title="WOMPO" dark />
        <div className="py-10 px-8 flex flex-col items-center text-center text-[#F8EDDB]">
          <div className="text-[16px] mb-2 font-serif italic">Wompo</div>
          <p className="text-[8px] leading-relaxed opacity-50 font-sans uppercase tracking-[0.2em]">Reactive Elements.</p>
        </div>
      </div>

      {/* Card 2: TWO HALVES (Moved to Mid-Center Dot near "SAME") */}
      <div 
        ref={card2}
        className="absolute top-[42%] right-[10%] w-[280px] rounded-2xl border border-[#934B1C]/10 bg-[#fdf8f0]/90 backdrop-blur-md shadow-[0_25px_50px_rgba(147,75,28,0.15)] z-30 overflow-hidden"
      >
        <WindowHeader title="TWO HALVES" />
        <div className="p-8 flex items-center relative h-32">
          <div className="absolute -left-12 w-24 h-24 bg-[#42210B] rounded-full" />
          <div className="ml-16 flex flex-col">
            <div className="text-[11px] font-sans font-black uppercase tracking-tight">Acme Corp</div>
            <div className="text-[8px] opacity-60 mt-1">Amet minim mollit non deserunt ullamco est sit.</div>
          </div>
        </div>
      </div>

      {/* Card 3: OLD PORTFOLIO (Moved to Bottom-Center-Left Dot) */}
      <div 
        ref={card3}
        className="absolute bottom-[12%] left-[30%] w-[240px] rounded-2xl border border-[#934B1C]/10 bg-[#fdf8f0] shadow-[0_20px_50px_rgba(147,75,28,0.1)] z-20 overflow-hidden"
      >
        <WindowHeader title="OLD PORTFOLIO" />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-[10px] font-sans uppercase tracking-[0.2em]">
            Hi! I'm <span className="font-bold border-b-2 border-[#934B1C]/20 pb-0.5">Lorenzo</span>
          </p>
          <p className="text-[7px] opacity-50 mt-2 font-medium tracking-tighter">Professional Web Developer</p>
        </div>
      </div>

    </section>
  );
};

const WindowHeader = ({ title, dark }) => (
  <div className={`flex items-center justify-between px-4 py-3 border-b ${dark ? 'border-white/5 bg-white/5' : 'border-[#934B1C]/5 bg-[#934B1C]/5'}`}>
    <div className="flex gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-white/20' : 'bg-[#934B1C]/20'}`} />
      <div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-white/10' : 'bg-[#934B1C]/10'}`} />
      <div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-white/5' : 'bg-[#934B1C]/5'}`} />
    </div>
    <span className={`text-[7px] font-sans font-bold tracking-[0.4em] uppercase ${dark ? 'text-white/40' : 'text-[#934B1C]/40'}`}>
      {title}
    </span>
    <div className="w-8" />
  </div>
);

export default KineticEditorialHero;