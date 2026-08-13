import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Hero = () => {
  const container = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Create timeline
      const tl = gsap.timeline({ delay: 0.5 });

      // FIX: Move visibility into the timeline so it respects the 0.5s delay
      // autoAlpha handles both opacity and visibility to prevent any flickering
      tl.set(container.current, { autoAlpha: 1 })
      
      // 1. Vertical spine grows from center
      .fromTo(".l-stem", 
        { scaleY: 0 }, 
        { scaleY: 1, transformOrigin: "center", duration: 1.5, ease: "expo.inOut" }
      )
      // 2. Horizontal strokes grow
      .fromTo(".stroke-left, .stroke-right", 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 
        "-=0.7"
      )
      // 3. Names reveal
      .fromTo(".name-left", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 1.2, ease: "power4.out" }, "-=0.6")
      .fromTo(".name-right", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1.2, ease: "power4.out" }, "-=1")
      // 4. Labels
      .fromTo(".sub-label", { opacity: 0 }, { opacity: 0.6, duration: 1, stagger: 0.1 }, "-=0.5");
    }, container);

    return () => ctx.revert();
  }, []);

  const themeColor = "#A35100"; 
  const bgColor = "#FDF3E4";   

  return (
    <section 
      ref={container} 
      className="relative w-full h-screen flex items-center justify-center overflow-hidden select-none"
      style={{ 
        backgroundColor: bgColor, 
        color: themeColor, 
        fontFamily: "'Inter', sans-serif",
        // FIX: Start hidden via visibility and opacity
        opacity: 0,
        visibility: 'hidden' 
      }}
    >
      <div className="relative w-full max-w-[1400px] h-full flex items-center justify-center">
        
        {/* 1. CENTRAL VERTICAL STEM */}
        <div 
          className="l-stem absolute left-1/2 -translate-x-1/2 w-[6px] h-[37vh] bg-[#A35100]" 
          style={{ transform: 'scaleY(0)' }} 
        />

        {/* --- LEFT SIDE --- */}
        <div className="absolute right-[50%] flex flex-col items-end mr-[5px]">
          <div className="sub-label flex gap-16 mb-[1vw] mr-[4vw] text-[13px] font-light text-right leading-tight tracking-wider uppercase" style={{ opacity: 0 }}>
            <div><p>Creative</p><p>Developer</p></div>
            <div><p>UX/UI</p><p>Designer</p></div>
          </div>

          <div className="name-left relative -translate-y-[-1.2vw] mr-[2vw]" style={{ opacity: 0 }}>
             <h1 className="text-[11vw] leading-[0.8] font-[100] tracking-[0.03em] lowercase">
              etadicu    
            </h1>
          </div>

          <div 
            className="stroke-left absolute bottom-[-3vw] right-[-5px] w-[4vw] h-[7px] bg-[#A35100] origin-right" 
            style={{ transform: 'scaleX(0)' }} 
          />
        </div>

        {/* --- RIGHT SIDE --- */}
        <div className="absolute left-[50%] flex flex-col items-start ml-[5px]">
          <div 
            className="stroke-right absolute top-[4vw] left-[-8px] w-[4vw] h-[7px] bg-[#A35100] origin-left z-10" 
            style={{ transform: 'scaleX(0)' }} 
          />

          <div className="name-right -translate-y-[6vw] ml-[2vw]" style={{ opacity: 0 }}>
             <h1 className="text-[11vw] leading-[0.8] font-[100] tracking-[0.03em] lowercase">
              uminous
            </h1>
          </div>

          <div className="sub-label flex gap-16 mt-[-3vw] ml-[5vw] text-[15px] font-light leading-snug tracking-normal" style={{ opacity: 0 }}>
            <div><p>Located in</p><p>Venice</p></div>
            <div><p>Working</p><p>worldwide</p></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100;0,14..32,200;1,14..32,100&display=swap');
        
        body {
          background-color: #FDF3E4;
          margin: 0;
        }

        h1 {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-variation-settings: "wght" 100;
        }
      `}</style>
    </section>
  );
};

export default Hero;