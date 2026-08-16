import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Hero = () => {
  const container = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.set(container.current, { autoAlpha: 1 })
      
      // --- DESKTOP ANIMATIONS (Logic strictly preserved) ---
      .fromTo(".l-stem", 
        { scaleY: 0 }, 
        { scaleY: 1, transformOrigin: "center", duration: 1.5, ease: "expo.inOut" }
      )
      .fromTo(".stroke-left, .stroke-right", 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 
        "-=0.7"
      )
      .fromTo(".name-left", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 1.2, ease: "power4.out" }, "-=0.6")
      .fromTo(".name-right", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1.2, ease: "power4.out" }, "-=1")
      .fromTo(".sub-label", { opacity: 0 }, { opacity: 0.6, duration: 1, stagger: 0.1 }, "-=0.5")

      // --- PREMIUM MOBILE ANIMATIONS ---
      .fromTo(".m-subtitle", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 0.3)
      .fromTo(".m-title-inner", 
        { y: "115%" }, 
        { y: "0%", duration: 1.2, ease: "expo.out", stagger: 0.12 }, 
        0.5
      )
      .fromTo(".m-btn-container", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.4")
      .fromTo(".m-footer", { opacity: 0 }, { opacity: 0.4, duration: 1 }, "-=0.2");
      
    }, container);

    return () => ctx.revert();
  }, []);

  const themeColor = "#A35100"; // Primary Theme
  const highlightColor = "#34170A"; // Your requested dark color
  const bgColor = "#FDF3E4";   

  return (
    <section 
      ref={container} 
      className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden select-none"
      style={{ 
        backgroundColor: bgColor, 
        color: themeColor, 
        fontFamily: "'Inter', sans-serif",
        opacity: 0,
        visibility: 'hidden'
      }}
    >
      {/* ----------------- MOBILE VIEW (NexAgent Style) ----------------- */}
      <div className="md:hidden flex flex-col items-center justify-center w-full px-8 text-center h-full gap-12">
        
        {/* Top Subtitle */}
        <p className="m-subtitle text-[14px] italic font-light tracking-wide opacity-80">
          Creative Developer — 2025
        </p>

        {/* Main Headline with Masking Effect */}
        <div className="flex flex-col items-center leading-[1.1]">
          <div className="overflow-hidden py-1 px-2">
            <h1 className="m-title-inner text-[11vw] font-extrabold tracking-tight">Create a</h1>
          </div>
          <div className="overflow-hidden py-1 px-2">
            <h1 className="m-title-inner text-[11vw] font-extrabold tracking-tight">personalized</h1>
          </div>
          <div className="overflow-hidden py-1 px-2">
            <h1 className="m-title-inner text-[11vw] font-extrabold tracking-tight" style={{ color: highlightColor }}>
              experience
            </h1>
          </div>
          <div className="overflow-hidden py-1 px-2">
            <h1 className="m-title-inner text-[11vw] font-extrabold tracking-tight">with code.</h1>
          </div>
        </div>

        {/* Button and Footer */}
        <div className="m-btn-container w-full flex flex-col items-center gap-6 mt-4">
          <button 
            className="w-full max-w-[280px] py-5 rounded-xl text-[13px] font-bold tracking-[0.2em] uppercase transition-all active:scale-95 shadow-lg"
            style={{ backgroundColor: themeColor, color: bgColor }}
          >
            Get Started
          </button>
          
          <p className="m-footer text-[10px] uppercase tracking-[0.25em] font-medium opacity-40">
            Available on desktop only
          </p>
        </div>
      </div>


      {/* ----------------- DESKTOP ONLY VIEW (Strictly Unchanged) ----------------- */}
      <div className="hidden md:flex relative w-full max-w-[1400px] h-full items-center justify-center">
        <div 
          className="l-stem absolute left-1/2 -translate-x-1/2 w-[6px] h-[37vh] bg-[#A35100]" 
          style={{ transform: 'scaleY(0)', transformOrigin: 'center' }} 
        />
        <div className="absolute right-[50%] flex flex-col items-end mr-[5px]">
          <div className="sub-label flex gap-16 mb-[1vw] mr-[4vw] text-[13px] font-light text-right leading-tight tracking-wider uppercase" style={{ opacity: 0 }}>
            <div><p>Creative</p><p>Developer</p></div>
            <div><p>UX/UI</p><p>Designer</p></div>
          </div>
          <div className="name-left relative -translate-y-[-1.2vw] mr-[2vw]" style={{ opacity: 0 }}>
             <h1 className="text-[11vw] leading-[0.8] font-[100] tracking-[0.03em] lowercase">etadicu</h1>
          </div>
          <div className="stroke-left absolute bottom-[-3vw] right-[-5px] w-[4vw] h-[7px] bg-[#A35100] origin-right" style={{ transform: 'scaleX(0)' }} />
        </div>
        <div className="absolute left-[50%] flex flex-col items-start ml-[5px]">
          <div className="stroke-right absolute top-[4vw] left-[-8px] w-[4vw] h-[7px] bg-[#A35100] origin-left z-10" style={{ transform: 'scaleX(0)' }} />
          <div className="name-right -translate-y-[6vw] ml-[2vw]" style={{ opacity: 0 }}>
             <h1 className="text-[11vw] leading-[0.8] font-[100] tracking-[0.03em] lowercase">uminous</h1>
          </div>
          <div className="sub-label flex gap-16 mt-[-3vw] ml-[5vw] text-[15px] font-light leading-snug tracking-normal" style={{ opacity: 0 }}>
            <div><p>Located in</p><p>Venice</p></div>
            <div><p>Working</p><p>worldwide</p></div>
          </div>
        </div>
      </div>

      <style jsx="true" global="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;400;700;800;900&display=swap');
        body { background-color: #FDF3E4; margin: 0; }
        h1 { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>
    </section>
  );
};

export default Hero;