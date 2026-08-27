import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const HowItWorks = () => {
  const containerRef = useRef(null);
  const scrollSectionRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".process-panel");
      
      // 1. HERO ENTRANCE
      const heroTl = gsap.timeline();
      heroTl.from(".hero-title span", {
        yPercent: 100,
        rotate: 2,
        opacity: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: "expo.out"
      }).from(".hero-sub", {
        opacity: 0,
        y: 20,
        duration: 1
      }, "-=1");

      // 2. HORIZONTAL SCROLL ENGINE
      let scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          start: "top top",
          end: () => `+=${scrollSectionRef.current.offsetWidth * 3}`,
          onUpdate: (self) => {
            gsap.to(progressRef.current, { scaleX: self.progress, duration: 0.1, ease: "none" });
          }
        }
      });

      // 3. PANEL ENTRANCES
      sections.forEach((panel) => {
        const header = panel.querySelector(".panel-header");
        const visual = panel.querySelector(".panel-visual");
        
        gsap.from(header, {
          y: 30,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: "left 70%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // 4. TYPING EFFECT (Step 1)
      gsap.to(".typing-content", {
        duration: 3,
        text: '"Build a brutalist dashboard for a crypto-fintech app using neon accents and heavy borders."',
        ease: "none",
        scrollTrigger: {
          trigger: ".typing-content",
          containerAnimation: scrollTween,
          start: "left 50%",
        }
      });

      // 5. DEVICE ANIMATION (Step 4)
      gsap.from(".device-frame", {
        y: 100,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".device-container",
          containerAnimation: scrollTween,
          start: "left 60%",
        }
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#FDF3E4] text-[#34170A] selection:bg-[#A35100] selection:text-white font-sans overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative">
        <div className="hero-sub font-mono text-[10px] tracking-[0.6em] uppercase opacity-50 mb-12">
          Architecture / Workflow
        </div>
        <div className="max-w-[90vw] lg:max-w-7xl">
          <h1 className="hero-title text-[9vw] sm:text-[7vw] lg:text-[6.5vw] font-serif leading-[1.1] md:leading-[0.9] italic mb-8">
            <span className="inline-block overflow-hidden pb-2">
               <span className="inline-block">From</span>
            </span>{" "}
            <span className="inline-block overflow-hidden pb-2">
               <span className="text-[#A35100] inline-block">Idea</span>
            </span> 
            <br /> 
            <span className="inline-block overflow-hidden pb-4">
               <span className="inline-block">to Interface.</span>
            </span>
          </h1>
        </div>
      </section>

      {/* MAIN HORIZONTAL SCROLL */}
      <section ref={scrollSectionRef} className="flex h-screen w-[600vw] overflow-hidden bg-[#F9EFE0]">
        
        {/* 01: INPUT */}
        <div className="process-panel w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            <div className="panel-header">
              <span className="font-mono text-[#A35100] text-xs tracking-widest mb-4 block">01 / INPUT</span>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Describe it.</h2>
              <p className="text-lg opacity-70 max-w-sm">Natural language processing converts your vision into technical specs.</p>
            </div>
            <div className="panel-visual bg-white p-8 md:p-12 shadow-xl border border-[#34170A]/5 relative min-h-[250px] flex flex-col justify-center rounded-sm">
              <div className="flex gap-4 items-start">
                <div className="w-[2px] h-16 bg-[#A35100] flex-shrink-0" />
                <p className="typing-content font-serif text-xl md:text-2xl italic leading-relaxed text-[#34170A]"></p>
                <span className="w-3 h-8 bg-[#A35100] animate-pulse -ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* 02: BRAIN */}
        <div className="process-panel w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-24 bg-[#34170A] text-[#FDF3E4]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
             <div className="panel-visual order-2 lg:order-1 relative flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 border border-dashed border-[#A35100]/60 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute flex flex-col items-center">
                    <div className="text-3xl font-serif italic text-[#A35100] animate-pulse">Thinking...</div>
                </div>
             </div>
             <div className="panel-header order-1 lg:order-2">
              <span className="font-mono text-[#A35100] text-xs tracking-widest mb-4 block">02 / BRAIN</span>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-6">AI Logic.</h2>
              <p className="text-lg opacity-60">Synthesizing structure, accessibility, and visual hierarchy from raw text.</p>
            </div>
          </div>
        </div>

        {/* 03: CODE */}
        <div className="process-panel w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            <div className="panel-header">
              <span className="font-mono text-[#A35100] text-xs tracking-widest mb-4 block">03 / BUILD</span>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Clean Code.</h2>
              <p className="text-lg opacity-70">Production-ready React & Tailwind components generated in seconds.</p>
            </div>
            <div className="panel-visual bg-[#1a1a1a] p-6 md:p-8 rounded-sm shadow-2xl font-mono text-xs md:text-sm overflow-hidden border-l-[6px] border-[#A35100]">
               <div className="text-gray-500 mb-2">// Interface.tsx</div>
               <div className="text-blue-400">export const UI = () =&gt; (</div>
               <div className="pl-4 text-green-400">&lt;div className="responsive-grid"&gt;</div>
               <div className="pl-8 text-gray-300">&lt;Dashboard /&gt;</div>
               <div className="pl-4 text-green-400">&lt;/div&gt;</div>
               <div className="text-blue-400">);</div>
            </div>
          </div>
        </div>

        {/* 04: ADAPTIVE (MULTI-SCREEN) */}
        <div className="process-panel w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-24 bg-[#A35100] text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            
            {/* MULTI-DEVICE VISUAL */}
            <div className="device-container order-2 lg:order-1 relative h-[300px] md:h-[400px] flex items-center justify-center">
               
               {/* Desktop */}
               <div className="device-frame absolute w-64 md:w-80 h-40 md:h-48 border-2 border-white/40 rounded-lg bg-white/5 backdrop-blur-sm p-3 -translate-x-12 -translate-y-8">
                  <div className="flex gap-1 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded mb-2" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-white/10 rounded" />
                    <div className="h-12 bg-white/10 rounded" />
                    <div className="h-12 bg-white/10 rounded" />
                  </div>
               </div>

               {/* Tablet */}
               <div className="device-frame absolute w-32 md:w-40 h-48 md:h-56 border-2 border-white/60 rounded-xl bg-white/10 backdrop-blur-md p-3 translate-x-12 translate-y-4 z-10 shadow-2xl">
                  <div className="w-8 h-1 bg-white/30 mx-auto rounded-full mb-4" />
                  <div className="space-y-2">
                    <div className="w-full h-8 bg-white/20 rounded" />
                    <div className="w-full h-16 bg-white/10 rounded" />
                    <div className="w-full h-8 bg-white/20 rounded" />
                  </div>
               </div>

               {/* Mobile */}
               <div className="device-frame absolute w-16 md:w-20 h-32 md:h-40 border-2 border-white/80 rounded-2xl bg-white/20 backdrop-blur-lg p-2 translate-x-28 translate-y-16 z-20 shadow-2xl">
                  <div className="w-4 h-1 bg-white/40 mx-auto rounded-full mb-3" />
                  <div className="space-y-2">
                    <div className="w-full h-10 bg-white/30 rounded" />
                    <div className="w-full h-10 bg-white/30 rounded" />
                  </div>
               </div>
            </div>

            <div className="panel-header order-1 lg:order-2">
              <span className="font-mono text-[#34170A] text-xs tracking-widest mb-4 block font-bold">04 / ADAPTIVE</span>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Every Screen.</h2>
              <p className="text-lg opacity-90">Fluid layouts that recalibrate based on viewport size. Desktop, tablet, and mobile perfected.</p>
            </div>
          </div>
        </div>

        {/* 05: SPEED */}
        <div className="process-panel w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-24 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            <div className="panel-header">
              <span className="font-mono text-[#A35100] text-xs tracking-widest mb-4 block">05 / SPEED</span>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Built Fast.</h2>
              <p className="text-lg opacity-70">Optimized performance metrics for zero-latency user experiences.</p>
            </div>
            <div className="panel-visual text-center">
               <div className="text-[18vw] lg:text-[12vw] font-serif italic text-[#A35100] leading-none">100</div>
               <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">Core Web Vitals</div>
            </div>
          </div>
        </div>

        {/* 06: LIVE (INFO ONLY) */}
        <div className="process-panel w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-24 bg-[#EBE0CF]">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
              <div className="panel-header">
                <span className="font-mono text-[#A35100] text-xs tracking-widest mb-4 block uppercase">06 / LIVE</span>
                <h2 className="text-5xl md:text-7xl font-serif italic mb-6 leading-tight">Global <br />Deployment.</h2>
                <div className="flex gap-8 mt-4">
                    <div>
                        <div className="text-2xl font-serif italic">24</div>
                        <div className="font-mono text-[9px] opacity-50 uppercase">Regions</div>
                    </div>
                    <div>
                        <div className="text-2xl font-serif italic">99.9%</div>
                        <div className="font-mono text-[9px] opacity-50 uppercase">Uptime</div>
                    </div>
                </div>
              </div>
              <div className="panel-visual relative">
                <div className="absolute inset-0 bg-[#A35100]/10 mix-blend-multiply z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                  alt="Live Dashboard" 
                  className="rounded-sm shadow-2xl grayscale contrast-125"
                />
              </div>
           </div>
        </div>
      </section>

      {/* FINAL SECTION */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-[10vw] md:text-[6vw] font-serif italic mb-12 leading-tight">Ready to <br /><span className="text-[#A35100]">Start Building?</span></h2>
        <div className="h-20 w-[1px] bg-[#34170A]/20" />
      </section>

      {/* PROGRESS TRACKER */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-[#34170A]/5 z-50">
        <div ref={progressRef} className="h-full bg-[#A35100] w-full origin-left scale-x-0" />
      </div>

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[9999] mix-blend-multiply bg-[url('https://res.cloudinary.com/dvwthyt94/image/upload/v1672322316/noise_yvsk9m.png')]" />

    </div>
  );
};

export default HowItWorks;