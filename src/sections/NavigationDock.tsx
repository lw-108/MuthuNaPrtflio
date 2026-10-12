import { useState, useEffect } from "react";
import { Compass, Cpu, Layers, Trophy, Wrench, Mail, Home, Activity } from "lucide-react";
import mbLogo from "../assets/mb.png";

const SECTIONS = [
  { id: "home", label: "HOME", icon: <Home className="w-3.5 h-3.5" /> },
  { id: "about", label: "ABOUT", icon: <Compass className="w-3.5 h-3.5" /> },
  { id: "work", label: "WORK", icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "skills", label: "SKILLS", icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: "timeline", label: "MILESTONES", icon: <Trophy className="w-3.5 h-3.5" /> },
  { id: "services", label: "SERVICES", icon: <Wrench className="w-3.5 h-3.5" /> },
  { id: "contact", label: "CONTACT", icon: <Mail className="w-3.5 h-3.5" /> },
];

export default function NavigationDock() {
  const [activeSection, setActiveSection] = useState("home");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setIsVisible(scrollPos > 320);

      // Determine active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SECTIONS[i].id);
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <nav
        aria-label="Floating telemetry navigation"
        className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-[#0a0503]/90 border border-white/20 shadow-2xl backdrop-blur-xl text-white font-mono text-xs"
      >
        {/* Brand Mini Avatar */}
        <a
          href="#home"
          className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full hover:bg-white/10 transition-colors"
          title="Return to Home"
        >
          <img src={mbLogo} alt="MB" className="w-4 h-4 object-contain" />
          <span className="hidden md:inline-block font-sans font-bold text-[11px] tracking-tight">MB</span>
        </a>

        <div className="h-4 w-[1px] bg-white/20 mx-0.5" />

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                  isActive
                    ? "bg-[#f5603a] text-white shadow-lg shadow-[#f5603a]/25 scale-105"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {sec.icon}
                <span className="hidden sm:inline-block">{sec.label}</span>
              </a>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-2 pr-2 border-l border-white/20 text-[10px] text-emerald-400">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>1000 Hz</span>
        </div>
      </nav>
    </div>
  );
}
