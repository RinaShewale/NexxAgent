import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DescriptionSection = () => {
  const containerRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. THE CONTINUOUS LINE
      gsap.fromTo(
        ".desc-center-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            // START: Exactly when the top of this section hits the middle of the screen
            // This is the exact moment the ImageSplitSection line finishes its work.
            start: "top center", 
            end: "bottom center",
            scrub: 1.5, 
          }
        }
      );

      // 2. Reveal logic for text (unchanged)
      const revealItems = containerRef.current.querySelectorAll('.desc-left-item, .desc-right-word, .desc-right-label');
      revealItems.forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 30, filter: "blur(8px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 85%", end: "top 60%", scrub: 1 }
          }
        );
      });

      // 3. Dot reveal
      gsap.fromTo(".desc-dot", { scale: 0, opacity: 0 }, {
          scale: 1, opacity: 1, ease: "back.out(2)",
          scrollTrigger: { trigger: ".desc-dot", start: "top 90%", end: "top 80%", scrub: 0.5 }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-[140vh] py-32 bg-[#FDF3E4] flex text-[#A35100] overflow-hidden select-none">
      {/* 
          INITIAL STYLE: 
          transform: 'scaleY(0)' ensures the line is hidden until the scroll triggers.
      */}
      <div 
        className="desc-center-line absolute left-1/2 -translate-x-1/2 top-0 w-[6px] bg-[#A35100] z-10 origin-top h-full" 
        style={{ transform: 'scaleY(0)' }} 
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 flex z-20">
        <div className="w-1/2 pr-8 md:pr-20 flex flex-col justify-around py-12 space-y-24 text-right items-end">
          <div className="desc-left-item max-w-md space-y-3">
            <h3 className="text-xl md:text-3xl font-light">Creative Developer</h3>
            <p className="text-xs md:text-sm font-light opacity-80 leading-relaxed">I build websites that tell a story and stay with you...</p>
          </div>
          <div className="desc-left-item max-w-md space-y-3">
            <h3 className="text-xl md:text-3xl font-light">UX/UI Designer</h3>
            <p className="text-xs md:text-sm font-light opacity-80 leading-relaxed">I don't just make "pretty websites"...</p>
          </div>
          <div className="desc-left-item max-w-md space-y-3">
            <h3 className="text-xl md:text-3xl font-light">Detail lover</h3>
            <p className="text-xs md:text-sm font-light opacity-80 leading-relaxed">A great project is made of many small details...</p>
          </div>
        </div>

        <div className="w-1/2 pl-8 md:pl-16 flex flex-col justify-center py-12 space-y-16">
          <div className="desc-right-label space-y-2">
            <p className="text-xs md:text-sm font-light uppercase tracking-[0.2em] opacity-70">Focused on building websites that are:</p>
          </div>
          <div className="flex flex-col space-y-12 md:space-y-16">
            <h2 className="desc-right-word text-[7vw] md:text-[8vw] font-extralight leading-none lowercase tracking-tight">interactive</h2>
            <h2 className="desc-right-word text-[7vw] md:text-[8vw] font-extralight leading-none lowercase tracking-tight">immersive</h2>
            <div className="relative flex items-center">
              <h2 className="desc-right-word text-[7vw] md:text-[8vw] font-extralight leading-none lowercase tracking-tight">impactful</h2>
              <div className="desc-dot ml-4 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#A35100] self-end mb-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection;