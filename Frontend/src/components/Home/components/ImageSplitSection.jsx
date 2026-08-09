import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
    alt: "Portrait 1"
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
    alt: "Portrait 2"
  },
  {
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000",
    alt: "Portrait 3"
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000",
    alt: "Portrait 4"
  }
];

const ImageSplitSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Central line growth: extends directly from bottom of Hero's l-stem
      gsap.fromTo(
        ".split-center-line",
        { scaleY: 0.1 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
            end: "bottom 20%",
            scrub: true,
          }
        }
      );

      // 2. Parallax Upward movement + Horizontal Split for Left side images
      const leftCards = containerRef.current.querySelectorAll('.card-left');
      leftCards.forEach((card, idx) => {
        const imgLeftInner = card.querySelector('.img-left-inner');
        const imgRightInner = card.querySelector('.img-right-inner');

        gsap.fromTo(
          card,
          { y: 80 + idx * 20, x: 0 },
          {
            y: -40 - idx * 15,
            x: -20 - idx * 10,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom top",
              scrub: 1,
            }
          }
        );

        if (imgLeftInner && imgRightInner) {
          gsap.to(imgLeftInner, {
            x: -25,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
          gsap.to(imgRightInner, {
            x: 25,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      });

      // 3. Parallax Upward movement + Horizontal Split for Right side images
      const rightCards = containerRef.current.querySelectorAll('.card-right');
      rightCards.forEach((card, idx) => {
        const imgLeftInner = card.querySelector('.img-left-inner');
        const imgRightInner = card.querySelector('.img-right-inner');

        gsap.fromTo(
          card,
          { y: 80 + idx * 20, x: 0 },
          {
            y: -40 - idx * 15,
            x: 20 + idx * 10,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom top",
              scrub: 1,
            }
          }
        );

        if (imgLeftInner && imgRightInner) {
          gsap.to(imgLeftInner, {
            x: -25,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
          gsap.to(imgRightInner, {
            x: 25,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[110vh] pt-12 pb-32 bg-[#FDF3E4] flex items-center justify-center"
    >
      {/* 
        CENTRAL VERTICAL STEM LINE 
        Extends -top-[33vh] up to touch the exact bottom of Hero's l-stem.
        This connects the Hero stem seamlessly into this section without any gap!
      */}
      <div className="split-center-line absolute left-1/2 -translate-x-1/2 -top-[33vh] bottom-0 w-[6px] bg-[#A35100] z-10 origin-top" />

      {/* IMAGES CONTAINER (2 images on left of line, 2 images on right of line) */}
      <div className="relative w-full max-w-[1300px] px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 z-20 mt-12">
        
        {/* LEFT 2 IMAGES */}
        {images.slice(0, 2).map((item, i) => (
          <div 
            key={i} 
            className="card-left relative w-full h-[360px] md:h-[460px] flex gap-1 shadow-md hover:shadow-xl transition-shadow rounded-sm overflow-hidden"
          >
            <div className="w-1/2 h-full overflow-hidden">
              <div className="img-left-inner w-[200%] h-full">
                <img src={item.src} className="h-full w-full object-cover grayscale opacity-90 hover:opacity-100 transition-opacity" alt={item.alt} />
              </div>
            </div>
            <div className="w-1/2 h-full overflow-hidden">
              <div className="img-right-inner w-[200%] h-full -translate-x-1/2">
                <img src={item.src} className="h-full w-full object-cover grayscale opacity-90 hover:opacity-100 transition-opacity" alt={item.alt} />
              </div>
            </div>
          </div>
        ))}

        {/* RIGHT 2 IMAGES */}
        {images.slice(2, 4).map((item, i) => (
          <div 
            key={i + 2} 
            className="card-right relative w-full h-[360px] md:h-[460px] flex gap-1 shadow-md hover:shadow-xl transition-shadow rounded-sm overflow-hidden"
          >
            <div className="w-1/2 h-full overflow-hidden">
              <div className="img-left-inner w-[200%] h-full">
                <img src={item.src} className="h-full w-full object-cover grayscale opacity-90 hover:opacity-100 transition-opacity" alt={item.alt} />
              </div>
            </div>
            <div className="w-1/2 h-full overflow-hidden">
              <div className="img-right-inner w-[200%] h-full -translate-x-1/2">
                <img src={item.src} className="h-full w-full object-cover grayscale opacity-90 hover:opacity-100 transition-opacity" alt={item.alt} />
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default ImageSplitSection;