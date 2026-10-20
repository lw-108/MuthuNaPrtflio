import { ArrowUp } from "lucide-react";
import mbLogo from "../assets/mb.png";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#050302] text-white py-16 px-6 md:px-12 lg:px-20 border-t border-white/10 overflow-hidden font-mono text-xs">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Top Colophon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img src={mbLogo} alt="MB Logo" className="h-6 w-auto object-contain" />
              <span className="font-extrabold font-sans text-lg tracking-tight text-white uppercase">
                MUTHUBALAJI M
              </span>
              <span className="text-[10px] text-[#ffd23f] border border-[#ffd23f]/30 px-1.5 py-0.5 rounded">
                AI &amp; ROBOTICS
              </span>
            </div>
            <p className="text-white/80 font-sans text-xs max-w-sm leading-relaxed font-semibold text-[#ffd23f]">
              &ldquo;Turning Ideas into Innovation. Building Technology for the Future.&rdquo;
            </p>
            <p className="text-white/60 font-sans text-xs max-w-sm leading-relaxed font-normal">
              Agriculture Engineering graduate, AI &amp; Robotics Professional, Project Developer, Technical Educator, and Entrepreneur. Founder of U Fill Academy, Aspire Academy, and Salem IoT.
            </p>
            <div className="text-[11px] text-white/50 space-y-1 font-mono">
              <p>EMAIL: msmuthu4545@gmail.com</p>
              <p>PHONE: +91 86105 65660</p>
              <p>LOCATION: Salem, Tamil Nadu, India</p>
            </div>
          </div>

          {/* Quick Jump Links */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-[11px] text-white/40 uppercase tracking-widest mb-3">
              PORTFOLIO SECTIONS
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: "01 HOME", href: "#home" },
                { name: "02 WHO I AM", href: "#about" },
                { name: "03 PROJECTS", href: "#work" },
                { name: "04 EXPERTISE", href: "#skills" },
                { name: "05 MILESTONES", href: "#timeline" },
                { name: "06 VENTURES", href: "#services" },
                { name: "07 CONTACT", href: "#contact" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/70 hover:text-[#f5603a] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Ventures & Back-to-Top Button */}
          <div className="md:col-span-3 flex flex-col md:items-end justify-between h-full space-y-6">
            <button
              onClick={scrollToTop}
              className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-[#f5603a] border border-white/15 hover:border-[#f5603a] text-white hover:text-black transition-all flex items-center gap-2 group text-xs uppercase"
            >
              <span>RETURN TO TOP</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <div className="md:text-right text-[10px] text-white/40 space-y-1">
              <p>U FILL ACADEMY · ASPIRE ACADEMY</p>
              <p className="text-[#ffd23f]">SALEM IOT PROJECT CENTRE</p>
              <p className="text-emerald-400">200+ PROJECTS MENTORED</p>
            </div>
          </div>
        </div>

        {/* Bottom Credits Line */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <p>© 2026 MUTHUBALAJI M. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-1.5">
            AI &amp; ROBOTICS PROFESSIONAL · PROJECT DEVELOPER · ENTREPRENEUR
          </p>
        </div>
      </div>
    </footer>
  );
}
