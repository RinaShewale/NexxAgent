import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DescriptionSection = () => {
  const containerRef = useRef(null);
  const spineRef = useRef(null);
  const dotRef = useRef(null);

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
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 1.5,
        }
      });

      gsap.set(".text-group", { opacity: 0, y: 40, filter: "blur(15px)" });
      gsap.set(".char", { y: 120, opacity: 0, skewX: 20, rotateY: 45 });

      gsap.set(".text-group-0", { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(".word-0 .char", { y: 0, opacity: 1, skewX: 0, rotateY: 0 });

      tl.to(spineRef.current, { scaleY: 1, ease: "none" }, 0);
      tl.to(dotRef.current, {
        top: "100%",
        ease: "none"
      }, 0);

      data.forEach((_, i) => {
        if (i === data.length - 1) return;

        const nextIndex = i + 1;
        const triggerPoint = i + 0.5;

        tl.to(`.text-group-${i}`, {
          opacity: 0,
          y: -40,
          filter: "blur(10px)",
          duration: 0.6,
          ease: "power2.in"
        }, triggerPoint);

        tl.to(`.word-${i} .char`, {
          y: -100,
          opacity: 0,
          skewX: -20,
          stagger: 0.01,
          ease: "expo.in"
        }, triggerPoint);

        tl.to(dotRef.current, {
          scale: 2,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        }, triggerPoint + 0.2);

        tl.to(`.text-group-${nextIndex}`, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power4.out"
        }, triggerPoint + 0.4);

        tl.to(`.word-${nextIndex} .char`, {
          y: 0,
          opacity: 1,
          skewX: 0,
          rotateY: 0,
          stagger: 0.03,
          ease: "back.out(1.2)"
        }, triggerPoint + 0.4);
      });

      gsap.to(".floating-content", {
        y: "-=15",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#FDF3E4] h-screen w-full overflow-hidden font-sans">

      <div className="bg-blob absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-[#A35100]/5 rounded-full blur-[140px]" />
      <div className="bg-blob absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-[#A35100]/5 rounded-full blur-[120px]" />

      <div className="flex h-full w-full max-w-screen-xl mx-auto items-center relative px-8 md:px-16 z-10">

        {/* LEFT CONTENT */}
        <div className="w-1/2 pr-12 md:pr-24 floating-content">
          <div className="relative h-[450px] flex items-center">
            {data.map((item, i) => {
              const parts = item.desc.split(': ');
              const main = parts[0];
              const sub = parts[1] || "";

              return (
                <div
                  key={i}
                  className={`text-group text-group-${i} absolute inset-0 flex flex-col justify-center`}
                >
                  <h3 className="text-[#A35100] text-[10px] md:text-xs font-bold tracking-[0.6em] uppercase mb-8 opacity-60">
                    {item.role}
                  </h3>
                  <h2 className="text-[#A35100] text-3xl md:text-5xl font-light leading-[1.1] mb-6 tracking-tight overflow-hidden">
                    {main}{sub && ":"}
                  </h2>
                  <p className="text-[#A35100]/70 text-base md:text-lg leading-relaxed max-w-sm font-serif italic">
                    {sub}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CENTER SPINE */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70vh] w-[1px] bg-[#A35100]/10">
          <div
            ref={dotRef}
            className="absolute -left-[5px] top-0 w-[11px] h-[11px] bg-[#A35100] rounded-full z-20 shadow-xl"
          >
            <div className="absolute inset-0 bg-[#A35100] rounded-full animate-ping opacity-30" />
          </div>
          <div ref={spineRef} className="w-full h-full bg-[#A35100] origin-top scale-y-0" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-1/2 pl-12 md:pl-24 perspective-2000">
          <div className="relative w-full h-40 flex items-center">
            {data.map((item, i) => (
              <div
                key={i}
                className={`word-container word-${i} absolute flex whitespace-nowrap`}
              >
                {item.result.split("").map((char, index) => (
                  <span
                    key={index}
                    className={`char inline-block text-[#A35100] font-normal leading-none select-none
                      ${index === 0
                        ? 'text-7xl md:text-[10rem] -ml-2'
                        : 'text-6xl md:text-[8rem] -ml-1'
                      }
                      mr-0.5 md:mr-1
                    `}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dvwthyt94/image/upload/v1672322316/noise_yvsk9m.png')` }}
      />
    </div>
  );
};

export default DescriptionSection;