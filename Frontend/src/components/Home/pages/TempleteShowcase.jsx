import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles, Play, ExternalLink, ArrowRight, Compass, Flame, Box, ShieldCheck } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const templates = [
  {
    id: "01",
    title: "RESEDA",
    tag: "Architecture",
    category: "Spatial Design / 3D",
    image: "/images/ai_1.webp",
    video: "https://v.ftcdn.net/05/18/83/43/700_F_518834311_S6T9E4X7uV5vWzW9k6jE6o9fGj1q1n2d_ST.mp4",
    liveUrl: "https://reseda-preview.example.com"
  },
  {
    id: "02",
    title: "WELLNESS",
    tag: "Lifestyle",
    category: "Holistic / E-Commerce",
    image: "/images/ai_2.webp",
    video: "https://v.ftcdn.net/04/77/53/34/700_F_477533481_9U4rWkZkU7pYkZ7kR9mGzQ2vR6kS8o3f_ST.mp4",
    liveUrl: "https://wellness-preview.example.com"
  },
  {
    id: "03",
    title: "KLIPSAN",
    tag: "Editorial",
    category: "Typography / Publishing",
    image: "/images/ai_3.webp",
    video: "https://v.ftcdn.net/02/10/51/33/700_F_210513364_mX2rUfB6H7p3KjR6X6zO2v9S8yL3lWv7_ST.mp4",
    liveUrl: "https://klipsan-preview.example.com"
  },
  {
    id: "04",
    title: "RANDI ELISE",
    tag: "Fashion",
    category: "Haute Couture / Motion",
    image: "/images/ai_4.webp",
    video: "https://v.ftcdn.net/02/59/82/53/700_F_259825318_KqGZ2vY5k8R9mN6L3J1zO2v9S8yL3lWv7_ST.mp4",
    liveUrl: "https://randielise-preview.example.com"
  },
];

const methodology = [
  {
    num: "01",
    icon: Compass,
    title: "Spatial Prototyping",
    tag: "Phase I",
    desc: "We define volumetric hierarchies, lighting contours, and behavioral flows before writing a single line of production code."
  },
  {
    num: "02",
    icon: Flame,
    title: "Kinetic Choreography",
    tag: "Phase II",
    desc: "Micro-interactions engineered with sub-pixel precision. GSAP and WebGL synchronize to create weightless user motion."
  },
  {
    num: "03",
    icon: Box,
    title: "Synthetic Intelligence",
    tag: "Phase III",
    desc: "Seamless ingestion of real-time AI pipelines, elevating standard interfaces into adaptive, reactive digital ecosystems."
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Bespoke Deployment",
    tag: "Phase IV",
    desc: "Edge-computed performance, multi-region CDN caching, and 100/100 Lighthouse benchmark scores standard on every build."
  }
];

const TemplateShowcase = () => {
  const containerRef = useRef(null);
  const revealRef = useRef(null);
  const heroContentRef = useRef(null);
  const imageRef = useRef(null);
  const galleryRef = useRef(null);
  const methodologyRef = useRef(null);
  const manifestoRef = useRef(null);
  const ctaBoxRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // 1. Sticky Hero Zoom Reveal
      gsap.to(revealRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
        scale: isMobile ? 0.96 : 0.92,
        borderRadius: isMobile ? "24px" : "48px",
        ease: "power2.inOut",
      });

      // Parallax Background Image
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: isMobile ? 40 : 100,
        scale: 1.12,
      });

      // Hero Content Blur Out
      gsap.to(heroContentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "45% top",
          scrub: true,
        },
        opacity: 0,
        y: -60,
        filter: "blur(12px)",
      });

      // 2. Animate Methodology Cards on Right Side Individually
      const cards = gsap.utils.toArray('.methodology-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true, // Once triggered, stays visible permanently
            }
          }
        );
      });

      // 3. Kinetic Manifesto Text Reveal
      const words = gsap.utils.toArray('.manifesto-word');
      gsap.fromTo(words,
        { opacity: 0.2, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.5,
          }
        }
      );

      // 4. CTA Card Reveal
      if (ctaBoxRef.current) {
        gsap.fromTo(ctaBoxRef.current,
          { scale: 0.95, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaBoxRef.current,
              start: "top 85%",
              once: true,
            }
          }
        );
      }

      // Refresh ScrollTrigger to recalculate exact offsets after pinning
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartProject = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="bg-[var(--nexus-bg)] text-[var(--nexus-text)] min-h-screen selection:bg-[var(--nexus-accent)] selection:text-white overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section ref={containerRef} className="relative h-screen md:h-[120vh] w-full flex items-center justify-center">
        <div 
          ref={revealRef} 
          className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0a0a] z-10 origin-center shadow-2xl transition-[border-radius] duration-500"
        >
          <div className="absolute inset-0 w-full h-full">
            <img 
              ref={imageRef}
              src="/images/background-desktop.webp" 
              className="w-full h-full object-cover opacity-50 will-change-transform"
              alt="Nexus Hero Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
          </div>
          
          <div 
            ref={heroContentRef} 
            className="absolute inset-0 flex flex-col items-center justify-center text-[#FDF3E4] px-6 z-20 text-center"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }} 
              className="max-w-5xl mx-auto flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 md:mb-12">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--nexus-accent)] animate-pulse" />
                <span className="text-[9px] md:text-xs tracking-[0.4em] uppercase font-semibold text-white/80">
                  Nexus Intelligence &copy; 2025
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-['Playfair_Display'] italic tracking-tighter leading-[1.05] md:leading-[0.88] mb-8 md:mb-14">
                Elevating <br className="hidden sm:block"/> 
                <span className="not-italic font-medium text-white">digital craft</span>
              </h1>
              
              <motion.button 
                onClick={handleStartProject}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-8 py-4 md:px-12 md:py-6 bg-white text-black rounded-full font-bold text-[10px] md:text-[11px] tracking-[0.25em] overflow-hidden transition-all shadow-2xl"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500 uppercase flex items-center gap-3">
                  Explore Studio
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-[var(--nexus-accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TEMPLATE GALLERY --- */}
      <section 
        id="gallery" 
        ref={galleryRef} 
        className="relative z-20 py-20 md:py-40 px-5 sm:px-8 md:px-16 max-w-[1700px] mx-auto scroll-mt-10"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-32 gap-8 md:gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-['Playfair_Display'] font-medium tracking-tight leading-[1.1] md:leading-[1] text-[var(--nexus-text)]">
              The blueprint of <br className="hidden md:block"/> 
              <span className="italic text-[var(--nexus-accent)]">modern aesthetic.</span>
            </h2>
          </motion.div>
          
         
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-20 md:gap-y-36">
          {templates.map((item, index) => (
            <TemplateItem key={item.id} template={item} index={index} />
          ))}
        </div>
      </section>

   

      {/* --- GSAP SECTION 1: KINETIC MANIFESTO REVEAL --- */}
      <section 
        ref={manifestoRef}
        className="relative z-20 py-24 md:py-36 px-5 sm:px-8 md:px-16 max-w-[1500px] mx-auto text-center"
      >
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold text-[var(--nexus-accent)] block mb-6">
          The Nexus Philosophy
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-['Playfair_Display'] font-light tracking-tight leading-[1.15] text-[var(--nexus-text)]">
          <span className="manifesto-word inline-block mx-2">We</span>
          <span className="manifesto-word inline-block mx-2">don’t</span>
          <span className="manifesto-word inline-block mx-2 font-medium italic text-[var(--nexus-accent)]">build</span>
          <span className="manifesto-word inline-block mx-2">ordinary</span>
          <span className="manifesto-word inline-block mx-2">templates.</span>
          <br className="hidden md:block"/>
          <span className="manifesto-word inline-block mx-2">We</span>
          <span className="manifesto-word inline-block mx-2 font-medium italic text-[var(--nexus-accent)]">sculpt</span>
          <span className="manifesto-word inline-block mx-2">digital</span>
          <span className="manifesto-word inline-block mx-2">legacies.</span>
        </h2>
      </section>

      {/* --- GSAP SECTION 3: STATEMENT CTA BANNER --- */}
      <section className="relative z-20 pb-24 md:pb-36 px-5 sm:px-8 md:px-16 max-w-[1700px] mx-auto">
        <div 
          ref={ctaBoxRef}
          className="relative overflow-hidden rounded-3xl md:rounded-[40px] bg-[#0c0c0c] text-[#FDF3E4] p-10 sm:p-16 md:p-24 shadow-2xl border border-white/10"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--nexus-accent)] opacity-15 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl">
            <span className="text-[9px] md:text-xs uppercase tracking-[0.4em] font-bold text-[var(--nexus-accent)] block mb-6">
              Launch Your Next Chapter
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-7xl font-['Playfair_Display'] font-light tracking-tight leading-[1.08] mb-8 md:mb-10 text-white">
              Ready to redefine your <br className="hidden sm:block"/> 
              <span className="italic font-normal text-white underline decoration-[var(--nexus-accent)] decoration-1 underline-offset-8">
                digital benchmark?
              </span>
            </h2>

            <p className="text-sm sm:text-lg text-white/70 max-w-xl mb-10 md:mb-14 font-light leading-relaxed">
              Experience the power of intelligence and aesthetic precision directly within our live workspace dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
              <motion.a 
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  handleStartProject();
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-9 py-5 md:px-12 md:py-6 bg-white text-black rounded-full font-bold text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-center transition-all shadow-xl hover:bg-[var(--nexus-accent)] hover:text-white inline-flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Enter Dashboard</span>
                <ArrowUpRight size={16} />
              </motion.a>

              <a 
                href="mailto:contact@nexusagent.com"
                className="px-8 py-5 md:px-10 md:py-6 rounded-full border border-white/20 text-white font-medium text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-center hover:bg-white/10 transition-colors"
              >
                Inquire Bespoke
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const TemplateItem = ({ template, index }) => {
  const [hovered, setHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start bottom", "end top"]
  });

  const yRange = isMobile ? [0, 0] : [0, index % 2 === 0 ? -40 : -80];
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const springY = useSpring(y, { stiffness: 90, damping: 25 });

  const handleMouseEnter = () => {
    if (!isMobile) {
      setHovered(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHovered(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  return (
    <motion.a 
      ref={cardRef}
      href={template.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ y: springY }}
      className="group block relative text-inherit no-underline cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media Card Container */}
      <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl md:rounded-3xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] group-hover:border-[var(--nexus-accent)] shadow-xl transition-all duration-500">
        
        {/* Base Image */}
        <motion.img 
          src={template.image} 
          animate={{ 
            scale: hovered ? 1.05 : 1,
            filter: hovered ? "brightness(0.9)" : "brightness(1)"
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt={template.title}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-[1] pointer-events-none" />

        {/* Video Layer */}
        {!isMobile && (
          <video
            ref={videoRef}
            src={template.video}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ease-out pointer-events-none ${
              hovered && videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Hover Center Pill */}
        {!isMobile && (
          <div 
            className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
              hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-3'
            }`}
          >
            <div className="flex items-center gap-3 px-6 py-3.5 bg-black/85 backdrop-blur-md text-white rounded-full shadow-2xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[var(--nexus-accent)] animate-ping" />
              <Play size={11} fill="white" className="ml-0.5" />
              <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase">
                Launch Live Site
              </span>
              <ExternalLink size={12} className="opacity-70" />
            </div>
          </div>
        )}

        {/* Top-Right Tag */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 pointer-events-none">
          <span className="px-3 py-1.5 md:px-4 md:py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[8px] md:text-[9px] font-bold tracking-[0.2em] text-white/90 uppercase shadow-lg">
            Edition {template.id}
          </span>
        </div>

        {/* Top-Left Category Badge */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 pointer-events-none">
          <span className="px-3 py-1.5 md:px-4 md:py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[8px] md:text-[9px] font-medium tracking-[0.2em] text-[var(--nexus-accent)] uppercase shadow-lg">
            {template.tag}
          </span>
        </div>
      </div>

      {/* Description Meta Bar */}
      <div className="mt-5 md:mt-8 flex items-end justify-between px-1">
        <div className="space-y-1.5">
          <p className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--nexus-accent)] opacity-90 group-hover:opacity-100 transition-opacity">
            {template.category || template.tag}
          </p>
          
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-['Playfair_Display'] tracking-tight font-medium uppercase italic text-[var(--nexus-text)] group-hover:text-[var(--nexus-accent)] transition-colors duration-300">
            {template.title}
          </h3>
        </div>
        
        {/* Circular Action Button */}
        <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-[var(--nexus-border)] bg-[var(--nexus-surface)] flex items-center justify-center group-hover:bg-[var(--nexus-accent)] group-hover:border-[var(--nexus-accent)] transition-all duration-500 overflow-hidden shrink-0">
          <ArrowUpRight 
            size={18} 
            className="text-[var(--nexus-text)] group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
          />
        </div>
      </div>
    </motion.a>
  );
};

export default TemplateShowcase;