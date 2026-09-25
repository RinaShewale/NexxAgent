import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

const DescriptionSection = () => {
  const containerRef = useRef(null);
  const spineRef = useRef(null);
  const dotRef = useRef(null);

  // Syncs Lenis smooth scrolling with ScrollTrigger
  useLenis(ScrollTrigger.update);

  const data = [
    {
      role: "Experience Engine",
      desc: "Static layouts are a thing of the past: NexAgent generates fluid components and dynamic user journeys that make every digital touchpoint feel alive and deeply Interactive.",
      result: "Interactive"
    },
    {
      role: "Identity Architect",
      desc: "Moving beyond the sea of generic templates: Our AI analyzes your brand soul to ensure every line of code and design choice remains authentically yours and uniquely Individual.",
      result: "Individual"
    },
    {
      role: "Future-Proof Tech",
      desc: "Redefining the boundaries of web production: We combine automated frontend logic with cutting-edge performance to deliver a deployment process that is truly Innovative.",
      result: "Innovative"
    }
  ];

  useLayoutEffect(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      if (isDesktop) {
        // --- DESKTOP ANIMATION ---
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=950%",            // Generous scroll distance: ~300% per slide so it feels slow and relaxed
            pin: true,
            scrub: 1.8,              // Slower, weighted scrub catch-up (eliminates fast jerkiness)
            anticipatePin: 1,        // Eliminates pin jump
            invalidateOnRefresh: true,
          }
        });

        // Initial setup
        gsap.set(".text-group", { opacity: 0, y: 40, filter: "blur(12px)" });
        gsap.set(".char", { y: 120, opacity: 0, skewX: 20, rotateY: 45 });
        gsap.set(".text-group-0", { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(".word-0 .char", { y: 0, opacity: 1, skewX: 0, rotateY: 0 });

        // Timing constants for balanced reading pauses
        const dwellTime = 2.6;       // Generous reading hold on each slide
        const transitionTime = 1.2;  // Smooth, gradual transition time
        const step = dwellTime + transitionTime;

        // Slide Transitions with dedicated hold/reading pauses
        data.forEach((_, i) => {
          if (i === data.length - 1) return;
          const nextIndex = i + 1;
          const switchStart = dwellTime + i * step;

          // Outgoing slide
          tl.to(`.text-group-${i}`, { opacity: 0, y: -40, filter: "blur(10px)", duration: 0.9, ease: "power2.inOut" }, switchStart);
          tl.to(`.word-${i} .char`, { y: -100, opacity: 0, skewX: -20, stagger: 0.015, ease: "power2.in" }, switchStart);

          // Dot pulse at midpoint of switch
          tl.to(dotRef.current, { scale: 2.2, duration: 0.35, yoyo: true, repeat: 1, ease: "power1.inOut" }, switchStart + 0.3);

          // Incoming slide
          tl.to(`.text-group-${nextIndex}`, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power3.out" }, switchStart + 0.45);
          tl.to(`.word-${nextIndex} .char`, { y: 0, opacity: 1, skewX: 0, rotateY: 0, stagger: 0.025, ease: "back.out(1.1)" }, switchStart + 0.45);
        });

        // Total duration includes full reading time for the FINAL slide before unpinning
        const totalDuration = (data.length - 1) * step + dwellTime;

        // Spine and dot fill evenly across the ENTIRE duration
        tl.to(spineRef.current, { scaleY: 1, ease: "none", duration: totalDuration }, 0);
        tl.to(dotRef.current, { top: "100%", ease: "none", duration: totalDuration }, 0);

        // Ensures timeline preserves the final dwell pause
        tl.set({}, {}, totalDuration);

        // Floating ambient effect
        gsap.to(".floating-content", { y: "-=12", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

      } else {
        // --- MOBILE ANIMATION ---
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=650%",            // Extended scroll runway on mobile
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        gsap.set(".text-group", { opacity: 0, y: 30, filter: "blur(10px)" });
        gsap.set(".text-group-0", { opacity: 1, y: 0, filter: "blur(0px)" });

        const dwellMobile = 2.2;
        const transitionMobile = 1.0;
        const stepMobile = dwellMobile + transitionMobile;

        // Mobile pacing with pause to read each slide
        data.forEach((_, i) => {
          if (i === data.length - 1) return;
          const switchStart = dwellMobile + i * stepMobile;
          tl.to(`.text-group-${i}`, { opacity: 0, y: -30, filter: "blur(8px)", duration: 0.8, ease: "power2.inOut" }, switchStart)
            .to(`.text-group-${i + 1}`, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, switchStart + 0.4);
        });

        // Ensure final slide on mobile stays visible before unpinning
        const totalMobileDuration = (data.length - 1) * stepMobile + dwellMobile;
        tl.set({}, {}, totalMobileDuration);
      }

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#FDF3E4] h-screen min-h-[100dvh] w-full overflow-hidden font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-[#A35100]/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-[#A35100]/5 rounded-full blur-[120px]" />

      <div className="flex flex-col lg:flex-row h-full w-full max-w-screen-xl mx-auto items-center justify-center relative px-8 lg:px-16 z-10">

        {/* CONTENT AREA */}
        <div className="w-full lg:w-1/2 floating-content relative h-[60vh] lg:h-[500px] flex items-center justify-center">
          {data.map((item, i) => {
            const parts = item.desc.split(': ');
            return (
              <div 
                key={i} 
                className={`text-group text-group-${i} absolute inset-0 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-4`}
              >
                {/* Center title for mobile */}
                <h2 className="lg:hidden text-[#A35100] text-6xl md:text-7xl font-light italic mb-8">
                  {item.result}
                </h2>

                <h3 className="text-[#A35100] text-[10px] md:text-xs font-bold tracking-[0.6em] uppercase mb-6 lg:mb-8 opacity-60">
                  {item.role}
                </h3>
                
                <h2 className="text-[#A35100] text-3xl md:text-5xl font-light leading-tight mb-6 tracking-tight">
                  {parts[0]}
                </h2>
                
                <p className="text-[#A35100]/70 text-base md:text-lg leading-relaxed max-w-[320px] lg:max-w-sm font-serif italic">
                  {parts[1]}
                </p>
              </div>
            );
          })}
        </div>

        {/* DESKTOP ONLY ELEMENTS */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70vh] w-[1px] bg-[#A35100]/10">
          <div ref={dotRef} className="absolute -left-[5px] top-0 w-[11px] h-[11px] bg-[#A35100] rounded-full z-20 shadow-xl">
            <div className="absolute inset-0 bg-[#A35100] rounded-full animate-ping opacity-30" />
          </div>
          <div ref={spineRef} className="w-full h-full bg-[#A35100] origin-top scale-y-0" />
        </div>

        <div className="hidden lg:flex w-1/2 pl-24 perspective-2000">
          <div className="relative w-full h-40 flex items-center">
            {data.map((item, i) => (
              <div key={i} className={`word-container word-${i} absolute flex whitespace-nowrap`}>
                {item.result.split("").map((char, index) => (
                  <span
                    key={index}
                    className={`char inline-block text-[#A35100] font-medium leading-none select-none 
                      ${index === 0 ? 'text-7xl md:text-[8rem] -ml-2' : 'text-6xl md:text-[8rem] -ml-1'} mr-1`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dvwthyt94/image/upload/v1672322316/noise_yvsk9m.png')` }} />
    </div>
  );
};

export default DescriptionSection;