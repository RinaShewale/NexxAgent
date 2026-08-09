import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000"
];

const ImageSplitSection = () => {
  const container = useRef();

  useEffect(() => {
    const cards = container.current.querySelectorAll('.image-card');
    
    cards.forEach((card) => {
      const left = card.querySelector('.img-left-inner');
      const right = card.querySelector('.img-right-inner');

      gsap.to(left, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        x: -40, // Move left side further left
        ease: "none"
      });

      gsap.to(right, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        x: 40, // Move right side further right
        ease: "none"
      });
    });

    // Refresh ScrollTrigger after images might have loaded
    ScrollTrigger.refresh();
  }, []);

  return (
    <section ref={container} className="py-20 px-10 flex flex-wrap justify-center gap-16 min-h-screen">
      {images.map((src, i) => (
        <div key={i} className="image-card relative w-[300px] h-[450px] flex gap-1">
          {/* Left half container */}
          <div className="w-1/2 h-full overflow-hidden">
             <div className="img-left-inner w-[200%] h-full">
                <img src={src} className="h-full w-full object-cover grayscale opacity-80" alt="" />
             </div>
          </div>
          {/* Right half container */}
          <div className="w-1/2 h-full overflow-hidden">
             <div className="img-right-inner w-[200%] h-full -translate-x-1/2">
                <img src={src} className="h-full w-full object-cover grayscale opacity-80" alt="" />
             </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ImageSplitSection;