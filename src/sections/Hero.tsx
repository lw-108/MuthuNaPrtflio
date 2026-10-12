import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import balajiImg from "../assets/balaji.png";
import roboImg from "../assets/robo2.png";
import mbLogo from "../assets/mb.png";
import LiquidReveal from "./Liquidreveal";
import RoboStage from "./RoboStage";
import { ArrowUpRight, Sparkles, Mail, Phone } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<"kid" | "dog" | "saw" | "rover">("kid");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Slow revealing architectural grid entrance
      tl.from(".hero-grid-line-v", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.8,
        stagger: 0.15,
        ease: "power3.inOut",
      })
        .from(
          ".hero-grid-line-h",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.8,
            stagger: 0.15,
            ease: "power3.inOut",
          },
          "-=1.4"
        )
        .from(
          ".hero-crosshair",
          {
            scale: 0,
            rotation: 180,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(2)",
          },
          "-=1.0"
        )
        .from(
          ".hero-fade-in",
          {
            y: 30,
            opacity: 0,
            duration: 1.0,
            stagger: 0.1,
          },
          "-=0.8"
        )
        .from(
          ".hero-stat-card",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#000000] text-white overflow-hidden pt-28 pb-20 px-6 md:px-12 lg:px-20 border-b border-white/15"
    >
      {/* ================= HIGH VISIBILITY ARCHITECTURAL GRID ================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Vertical Guidelines */}
        <div className="hero-grid-line-v absolute top-0 bottom-0 left-[6%] w-[1px] bg-white/10" />
        <div className="hero-grid-line-v absolute top-0 bottom-0 left-[35%] w-[1px] bg-white/10" />
        <div className="hero-grid-line-v absolute top-0 bottom-0 left-[65%] w-[1px] bg-white/10" />
        <div className="hero-grid-line-v absolute top-0 bottom-0 right-[6%] w-[1px] bg-white/10" />

        {/* Horizontal Guidelines */}
        <div className="hero-grid-line-h absolute left-0 right-0 top-24 h-[1px] bg-white/10" />
        <div className="hero-grid-line-h absolute left-0 right-0 top-1/2 h-[1px] bg-white/10" />
        <div className="hero-grid-line-h absolute left-0 right-0 bottom-24 h-[1px] bg-white/10" />

        {/* Electric Orange Architectural Crosshairs */}
        <span className="hero-crosshair absolute left-[6%] top-24 -translate-x-1/2 -translate-y-1/2 text-[#FF5500] font-mono text-xs select-none">
          +
        </span>
        <span className="hero-crosshair absolute left-[35%] top-24 -translate-x-1/2 -translate-y-1/2 text-[#FF5500] font-mono text-xs select-none">
          +
        </span>
        <span className="hero-crosshair absolute left-[65%] top-24 -translate-x-1/2 -translate-y-1/2 text-[#FF5500] font-mono text-xs select-none">
          +
        </span>
        <span className="hero-crosshair absolute right-[6%] top-24 translate-x-1/2 -translate-y-1/2 text-[#FF5500] font-mono text-xs select-none">
          +
        </span>

        <span className="hero-crosshair absolute left-[6%] bottom-24 -translate-x-1/2 translate-y-1/2 text-[#FF5500] font-mono text-xs select-none">
          +
        </span>
        <span className="hero-crosshair absolute right-[6%] bottom-24 translate-x-1/2 translate-y-1/2 text-[#FF5500] font-mono text-xs select-none">
          +
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* ================= TOP STATUS BAR & BADGE ================= */}
        <div className="hero-fade-in flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-2 border border-white">
              <img src={mbLogo} alt="MB Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                MUTHUBALAJI M
              </div>
              <div className="font-mono text-[11px] text-[#FF5500] tracking-wider uppercase font-semibold">
                SALEM, TAMIL NADU, INDIA
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/20 text-white font-mono text-xs tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
              <span>AVAILABLE FOR VENTURES &amp; R&amp;D</span>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#FF5500] text-black font-extrabold text-xs tracking-wider uppercase hover:bg-white hover:text-black transition-all"
            >
              LET&apos;S TALK <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ================= MAIN HERO TITLE & STORYTELLING ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bold Typography, Executive Introduction */}
          <div className="lg:col-span-7 space-y-8">
            <div className="hero-fade-in inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-black border border-white/20 text-white font-mono text-sm tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-[#FF5500]" />
              <span>AI &amp; ROBOTICS PROFESSIONAL · PROJECT DEVELOPER · ENTREPRENEUR</span>
            </div>

            <div className="hero-fade-in space-y-4">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.9] text-white">
                MUTHUBALAJI <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-white to-white">
                  M.
                </span>
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Turning Ideas into Innovation. <br />
                <span className="text-[#FF5500]">Building Technology for the Future.</span>
              </p>
            </div>

            <p className="hero-fade-in text-lg sm:text-xl text-white/90 leading-relaxed font-normal max-w-2xl">
              Agriculture Engineering graduate from <strong className="text-white">The Kavery College of Engineering</strong> with over <strong className="text-white">5+ years of multidisciplinary engineering and leadership experience</strong> across Artificial Intelligence, Robotics, IoT, and Embedded Systems.
            </p>

            <p className="hero-fade-in text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl">
              Mentor behind <span className="text-[#FF5500] font-bold">200+ practical student innovations</span>, 10+ industry builds, and founder of 3 educational technology ventures: <strong className="text-white">U Fill Academy</strong>, <strong className="text-white">Aspire Academy</strong>, and <strong className="text-white">Salem IoT</strong>.
            </p>

            {/* High Visibility Action Buttons */}
            <div className="hero-fade-in flex flex-wrap items-center gap-5 pt-2">
              <a
                href="#work"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF5500] text-black font-extrabold text-base uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-xl shadow-[#FF5500]/25"
              >
                EXPLORE WORKS <ArrowUpRight className="w-5 h-5" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black border-2 border-white text-white font-bold text-base uppercase tracking-wider hover:bg-white hover:text-black transition-all"
              >
                CONTACT DIRECTLY
              </a>
            </div>

            {/* Quick Contact Micro-Row */}
            <div className="hero-fade-in flex flex-wrap items-center gap-6 pt-4 font-mono text-sm text-white/70">
              <a
                href="mailto:msmuthu4545@gmail.com"
                className="flex items-center gap-2 hover:text-[#FF5500] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FF5500]" />
                <span>msmuthu4545@gmail.com</span>
              </a>
              <a
                href="tel:+918610565660"
                className="flex items-center gap-2 hover:text-[#FF5500] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FF5500]" />
                <span>+91 86105 65660</span>
              </a>
            </div>
          </div>

          {/* Right Column: High Visibility Interactive Canvas Stage */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full relative rounded-2xl bg-black border-2 border-white/20 p-4 sm:p-6 shadow-2xl overflow-hidden group hover:border-[#FF5500] transition-colors">
              {/* Header Tab */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5500]" />
                  <span className="font-bold text-white tracking-wider uppercase">
                    INTERACTIVE MECHATRONIC CORE
                  </span>
                </div>
                <span className="text-[#FF5500] font-semibold">HOVER TO DISPLACE</span>
              </div>

              {/* Liquid Reveal Portrait & Robot Reveal */}
              <div className="relative w-full aspect-[4/5] max-h-[460px] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
                <LiquidReveal
                  topSrc={balajiImg}
                  bottomSrc={roboImg}
                  radius={0.28}
                  fade={0.02}
                  spread={0.015}
                  bottomZoom={1.05}
                  auto
                  anchor={[0.5, 0.9]}
                />

                {/* Corner Accents */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded bg-black/80 border border-white/20 font-mono text-[11px] text-white">
                  MUTHUBALAJI M // PROFILE
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded bg-[#FF5500] text-black font-mono text-[11px] font-extrabold uppercase">
                  AI &amp; ROBOTICS
                </div>
              </div>

              {/* 4 Interactive Mechatronic Switchers */}
              <div className="pt-4 grid grid-cols-4 gap-2 font-mono text-xs">
                {(["kid", "dog", "saw", "rover"] as const).map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setActiveStage(stage)}
                    className={`py-2 px-1 rounded-lg border uppercase text-center font-bold tracking-wider transition-all ${
                      activeStage === stage
                        ? "bg-[#FF5500] text-black border-[#FF5500]"
                        : "bg-black text-white/70 border-white/20 hover:border-white hover:text-white"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              {/* Embedded Interactive 3D RoboStage Viewer */}
              <div className="mt-3 relative h-28 w-full rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
                <RoboStage scene={activeStage} className="w-full h-full" tip="above" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= HIGH IMPACT STATS CARDS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/15">
          <div className="hero-stat-card p-6 sm:p-8 rounded-2xl bg-black border-2 border-white/20 hover:border-[#FF5500] transition-colors">
            <div className="text-4xl sm:text-6xl font-black text-[#FF5500] font-sans tracking-tight">
              5+
            </div>
            <div className="mt-2 text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              Years Experience
            </div>
            <div className="text-xs sm:text-sm text-white/60 font-mono mt-1">
              Robotics, AI &amp; Admin
            </div>
          </div>

          <div className="hero-stat-card p-6 sm:p-8 rounded-2xl bg-black border-2 border-white/20 hover:border-[#FF5500] transition-colors">
            <div className="text-4xl sm:text-6xl font-black text-[#FF5500] font-sans tracking-tight">
              200+
            </div>
            <div className="mt-2 text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              Student Projects
            </div>
            <div className="text-xs sm:text-sm text-white/60 font-mono mt-1">
              Practical R&amp;D Mentorship
            </div>
          </div>

          <div className="hero-stat-card p-6 sm:p-8 rounded-2xl bg-black border-2 border-white/20 hover:border-[#FF5500] transition-colors">
            <div className="text-4xl sm:text-6xl font-black text-[#FF5500] font-sans tracking-tight">
              10+
            </div>
            <div className="mt-2 text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              Sector Builds
            </div>
            <div className="text-xs sm:text-sm text-white/60 font-mono mt-1">
              Cross-Disciplinary Industry
            </div>
          </div>

          <div className="hero-stat-card p-6 sm:p-8 rounded-2xl bg-black border-2 border-white/20 hover:border-[#FF5500] transition-colors">
            <div className="text-4xl sm:text-6xl font-black text-[#FF5500] font-sans tracking-tight">
              3
            </div>
            <div className="mt-2 text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              Ventures Founded
            </div>
            <div className="text-xs sm:text-sm text-white/60 font-mono mt-1">
              U Fill, Aspire &amp; Salem IoT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}