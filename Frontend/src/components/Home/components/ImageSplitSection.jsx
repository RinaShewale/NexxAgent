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
      
      // 1. FIXED LINE ANIMATION
      gsap.fromTo(
        ".split-center-line",
        { 
          scaleY: 0, // Start at 0 height
        },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            // Start growing as soon as the top of this section enters the bottom of the screen
            start: "top bottom", 
            // End when the bottom of this section reaches the bottom of the screen
            end: "bottom bottom",
            scrub: true,
          }
        }
      );

      // 2. Parallax + Horizontal Split for all cards
      const cards = containerRef.current.querySelectorAll('.image-card-wrapper');
      cards.forEach((card, idx) => {
        const isLeft = card.classList.contains('card-left');
        const imgLeftInner = card.querySelector('.img-left-inner');
        const imgRightInner = card.querySelector('.img-right-inner');

        // Upward movement (Parallax)
        gsap.fromTo(
          card,
          { y: 100 },
          {
            y: -100,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );

        // Splitting the image in half horizontally on scroll
        if (imgLeftInner && imgRightInner) {
          gsap.to(imgLeftInner, {
            x: -30,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
          gsap.to(imgRightInner, {
            x: 30,
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
      // overflow-visible is important so the line can "reach up" into the Hero section
      className="relative w-full min-h-screen py-32 bg-[#FDF3E4] flex items-center justify-center overflow-visible"
    >
      {/* 
        THE CONNECTING LINE 
        Starts -33vh above the section to close the gap with the Hero stem.
      */}
      <div 
        className="split-center-line absolute left-1/2 -translate-x-1/2 -top-[33vh] w-[6px] bg-[#A35100] z-10 origin-top" 
        style={{ height: 'calc(100% + 33vh)' }}
      />

      <div className="relative w-full max-w-[1300px] px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 z-20">
        {images.map((item, i) => (
          <div 
            key={i} 
            className={`image-card-wrapper ${i < 2 ? 'card-left' : 'card-right'} relative w-full h-[400px] md:h-[500px] flex gap-[2px] overflow-hidden`}
          >
            {/* Left Half */}
            <div className="w-1/2 h-full overflow-hidden">
              <div className="img-left-inner w-[200%] h-full">
                <img src={item.src} className="h-full w-full object-cover grayscale brightness-90" alt="" />
              </div>
            </div>
            {/* Right Half */}
            <div className="w-1/2 h-full overflow-hidden">
              <div className="img-right-inner w-[200%] h-full -translate-x-1/2">
                <img src={item.src} className="h-full w-full object-cover grayscale brightness-90" alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageSplitSection;