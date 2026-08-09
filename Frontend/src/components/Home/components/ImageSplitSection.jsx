import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000", alt: "Portrait 1" },
  { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000", alt: "Portrait 2" },
  { src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000", alt: "Portrait 3" },
  { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000", alt: "Portrait 4" }
];

const ImageSplitSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. LINE ANIMATION - REVISED TO BRIDGE HERO GAP
      gsap.fromTo(
        ".split-center-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom", // Starts growing as soon as the Hero starts leaving
            end: "bottom center", 
            scrub: 1.5,
          }
        }
      );

      // 2. BLUE CURVE LOGIC (U-Shape Movement) - Unchanged
      const cards = containerRef.current.querySelectorAll('.image-card-wrapper');
      cards.forEach((card, i) => {
        const isLeft = i < 2;
        const isOuter = i === 0 || i === 3;
        const xMove = isLeft ? (isOuter ? -250 : -80) : (isOuter ? 250 : 80);
        const yMove = isOuter ? -350 : -120; 

        gsap.fromTo(
          card,
          { y: 150, x: 0, filter: "blur(0px)" },
          {
            y: yMove,
            x: xMove,
            filter: "blur(4px)",
            ease: "power2.in", 
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            }
          }
        );

        const img = card.querySelector('img');
        gsap.fromTo(img, { scale: 1.2 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card, start: "top bottom", end: "bottom top", scrub: true
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-32 bg-[#FDF3E4] flex items-center justify-center overflow-visible"
    >
      {/* THE CONNECTING LINE: Bridges the 31.5vh gap from the Hero stem */}
      <div 
        className="split-center-line absolute left-1/2 -translate-x-1/2 -top-[31.5vh] w-[6px] bg-[#A35100] z-10 origin-top" 
        style={{ height: 'calc(100% + 31.5vh)' }}
      />

      <div className="relative w-full max-w-[1300px] px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 z-20">
        {images.map((item, i) => (
          <div key={i} className="image-card-wrapper relative w-full max-w-[240px] mx-auto aspect-square overflow-hidden" style={{ willChange: "transform, filter" }}>
            <img src={item.src} className="h-full w-full object-cover grayscale brightness-90" alt={item.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};
  
export default ImageSplitSection;