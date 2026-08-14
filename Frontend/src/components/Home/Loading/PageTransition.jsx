import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PageTransition = () => {
  const location = useLocation();
  const outlet = useOutlet();
  
  // This state will hold the "visible" content
  const [displayOutlet, setDisplayOutlet] = useState(outlet);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const topLayerRef = useRef(null);
  const midLayerRef = useRef(null);
  const contentRef = useRef(null);
  const prevPath = useRef(location.pathname);

  const paths = {
    initial: "M 0 100 L 100 100 L 100 100 Q 50 100 0 100 Z",
    curveUp: "M 0 100 L 100 100 L 100 50 Q 50 -40 0 50 Z", 
    full: "M 0 100 L 100 100 L 100 0 Q 50 0 0 0 Z",
    exit: "M 0 0 L 100 0 L 100 0 Q 50 -40 0 0 Z",
  };

  useEffect(() => {
    // Only trigger if the path actually changed to prevent glitches on query params
    if (location.pathname !== prevPath.current) {
      handlePageChange();
      prevPath.current = location.pathname;
    }
  }, [location.pathname]);

  const handlePageChange = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        ScrollTrigger.refresh();
      }
    });

    // 1. PREPARE LAYERS
    tl.set([topLayerRef.current, midLayerRef.current], { 
      attr: { d: paths.initial }, 
      visibility: 'visible',
      opacity: 1
    })
    
    // 2. ANIMATE LIQUID UP (Closing)
    .to(midLayerRef.current, {
      attr: { d: paths.curveUp },
      duration: 0.6,
      ease: "power4.in"
    })
    .to(midLayerRef.current, {
        attr: { d: paths.full },
        duration: 0.4,
        ease: "power2.out"
    })
    .to(topLayerRef.current, {
      attr: { d: paths.curveUp },
      duration: 0.6,
      ease: "power4.in"
    }, "-=0.7")
    .to(topLayerRef.current, {
        attr: { d: paths.full },
        duration: 0.4,
        ease: "power2.out"
    }, "-=0.2")

    // 3. THE SWAP (Occurs while screen is 100% covered)
    .call(() => {
      // At this exact moment, we update the state to the new outlet
      setDisplayOutlet(outlet); 
      window.scrollTo(0, 0);
      // Reset content positioning for the entrance animation
      gsap.set(contentRef.current, { opacity: 0, y: 20 });
    })
    // Small buffer to ensure React has rendered the new component behind the scenes
    .to({}, { duration: 0.1 }) 

    // 4. ANIMATE LIQUID UP (Opening/Exit)
    .to(topLayerRef.current, {
      attr: { d: paths.exit },
      duration: 0.8,
      ease: "power4.inOut",
    })
    .to(midLayerRef.current, {
      attr: { d: paths.exit },
      duration: 0.8,
      ease: "power4.inOut",
    }, "-=0.6")

    // 5. REVEAL NEW CONTENT
    .to(contentRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        // IMPORTANT: clearProps is vital for AppShell fixed positioning
        gsap.set(contentRef.current, { clearProps: "all" });
        gsap.set([topLayerRef.current, midLayerRef.current], { visibility: 'hidden' });
      }
    }, "-=0.5");
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FDF3E4]">
      {/* Liquid Overlay */}
      <svg 
        className="fixed top-0 left-0 w-full h-[100vh] z-[9999] pointer-events-none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path ref={midLayerRef} fill="#B55500" d={paths.initial} />
        <path ref={topLayerRef} fill="#34170A" d={paths.initial} />
      </svg>

      {/* Content Wrapper */}
      <div 
        ref={contentRef} 
        className="w-full relative"
      >
        {/* We render displayOutlet, which only updates when the screen is covered */}
        {displayOutlet}
      </div>

      <style jsx global>{`
        /* Prevent scroll bounce during transition which causes white bars */
        html, body {
          overscroll-behavior: none;
          background-color: #34170A; /* Matches top layer color to hide gaps */
        }
      `}</style>
    </div>
  );
};

export default PageTransition;