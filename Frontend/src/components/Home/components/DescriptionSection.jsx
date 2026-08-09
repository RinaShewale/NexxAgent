import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DescriptionSection = () => {
  const containerRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".desc-text", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 20%",
          scrub: 1,
        },
        opacity: 0,
        x: 50,
        stagger: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="desc-container relative min-h-screen py-40 flex">
      {/* LEFT CONTENT */}
      <div className="w-1/2 px-20 text-[#B55500]">
        <div className="sticky top-40 space-y-20">
          <div>
            <h3 className="text-xl mb-4">Creative Developer</h3>
            <p className="max-w-xs font-light opacity-80">I build websites that tell a story and stay with you. No noise, just clarity.</p>
          </div>
          <div>
            <h3 className="text-xl mb-4">Detail Lover</h3>
            <p className="max-w-xs font-light opacity-80">Great projects are made of small details. From "ok" to "wow".</p>
          </div>
        </div>
      </div>

      {/* CENTER LINE */}
      <div className="w-[2px] bg-[#B55500] self-stretch" />

      {/* RIGHT CONTENT (The reveal words) */}
      <div className="w-1/2 px-10 text-[#B55500]">
        <div className="sticky top-40 flex flex-col gap-10">
          <p className="text-sm font-light uppercase tracking-widest">Focused on building websites that are:</p>
          {/* Note: We omit the 'i' because the vertical line is the 'I' */}
          <h2 className="desc-text text-[8vw] font-extralight leading-none">nteractive</h2>
          <h2 className="desc-text text-[8vw] font-extralight leading-none">mmersive</h2>
          <h2 className="desc-text text-[8vw] font-extralight leading-none">mpactful</h2>
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection;