import { useState } from "react";
import { Sliders, ArrowRight, Clock } from "lucide-react";

interface VentureService {
  id: string;
  num: string;
  title: string;
  role: string;
  category: string;
  headline: string;
  timeline: string;
  deliverables: string[];
  deliverableTech: string[];
}

const VENTURE_SERVICES: VentureService[] = [
  {
    id: "ufill",
    num: "01",
    title: "U Fill Academy",
    role: "FOUNDER & LEAD INSTRUCTOR",
    category: "TECHNICAL EDUCATION & PRACTICAL SKILLS",
    headline: "Practical skill-based academy training the next generation in AI, Robotics, and IoT.",
    timeline: "Ongoing Academy Programs",
    deliverables: [
      "Artificial Intelligence & Smart Automation fundamentals",
      "Robotics design, electronic circuit integration & mechanics",
      "Mobile & Web Application Development & Animation Development",
      "Embedded Systems, IoT hardware & Abacus cognitive training",
    ],
    deliverableTech: ["Artificial Intelligence", "Robotics", "Embedded Systems", "IoT", "App Dev", "Animation"],
  },
  {
    id: "salemiot",
    num: "02",
    title: "Salem IoT Project Centre",
    role: "FOUNDER & PROJECT DEVELOPER",
    category: "HARDWARE PROTOTYPING & IOT VENTURE",
    headline: "Dedicated technology venture and project development center for practical hardware builds.",
    timeline: "Contract & Prototyping Sprints",
    deliverables: [
      "Custom IoT hardware prototyping & sensor-based monitoring",
      "Wireless communication architectures (Wi-Fi, Bluetooth, LoRa, RF)",
      "Technical support and practical implementation for client builds",
      "Integration of microcontrollers with automated cloud alerts",
    ],
    deliverableTech: ["Internet of Things", "Hardware Prototyping", "Sensor Systems", "Wireless Controls", "ESP32"],
  },
  {
    id: "aspire",
    num: "03",
    title: "Aspire Academy",
    role: "FOUNDER",
    category: "COMMUNICATION & PERSONAL SKILLS",
    headline: "Educational support and foundational skill development for student confidence.",
    timeline: "Structured Cohorts",
    deliverables: [
      "Spoken English fluency, public speaking & presentation confidence",
      "Handwriting enhancement and motor-skill fine-tuning",
      "Holistic learning support and student motivation mentoring",
      "Interactive confidence-building communication workshops",
    ],
    deliverableTech: ["Spoken English", "Handwriting", "Communication", "Personal Development", "Mentorship"],
  },
  {
    id: "student-projects",
    num: "04",
    title: "Project Development & Mentorship",
    role: "TECHNICAL EDUCATOR & TEAM LEADER",
    category: "200+ STUDENT BUILDS & 10+ SECTOR PROJECTS",
    headline: "End-to-end guidance transforming concepts into winning science & engineering exhibits.",
    timeline: "1 — 4 Weeks per Project",
    deliverables: [
      "Guided 200+ student projects in Science, Agriculture, Mechanical, and IoT",
      "Contributed to 10+ client projects across diverse industry sectors",
      "Hardware selection, schematic design, and microcontroller coding",
      "Exhibition preparation, viva defense coaching, and project documentation",
    ],
    deliverableTech: ["Arduino", "Agriculture Tech", "Mechanical Projects", "Science Exhibits", "Circuit Design"],
  },
];

export default function ServicesCapabilities() {
  const [selectedService, setSelectedService] = useState<VentureService>(VENTURE_SERVICES[0]);
  const [estimateOptions, setEstimateOptions] = useState<{
    robotics: boolean;
    iot: boolean;
    student: boolean;
    app: boolean;
    agro: boolean;
  }>({
    robotics: true,
    iot: true,
    student: true,
    app: false,
    agro: true,
  });

  const toggleOption = (key: keyof typeof estimateOptions) => {
    setEstimateOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCount = Object.values(estimateOptions).filter(Boolean).length;
  const estimatedDays = Math.max(7, selectedCount * 5);

  return (
    <section id="services" className="relative w-full min-h-screen bg-[#090605] text-white py-24 px-6 md:px-12 lg:px-20 border-t border-white/10">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 bottom-0 left-[4%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 left-[34.7%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 left-[65.4%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 right-[4%] w-[1px] bg-white/40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/15 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#f5603a] uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#f5603a]" />
              SECTION 05 // VENTURES &amp; SERVICES
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95]">
              Entrepreneurship, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5603a] via-[#ffd23f] to-white">
                Ventures &amp; Training.
              </span>
            </h2>
          </div>
          <div className="text-right font-mono text-xs text-white/50">
            <p>FOUNDER // U FILL · ASPIRE · SALEM IOT</p>
            <p className="text-white/80">TECHNICAL EDUCATION &amp; HARDWARE</p>
          </div>
        </div>

        {/* 4 Core Ventures & Offerings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {VENTURE_SERVICES.map((srv) => (
            <div
              key={srv.id}
              onClick={() => setSelectedService(srv)}
              className={`p-6 md:p-8 rounded-2xl border transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between ${
                selectedService.id === srv.id
                  ? "bg-white/[0.05] border-[#f5603a] shadow-2xl shadow-[#f5603a]/10"
                  : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-4 text-white/40">
                  <span className="text-[#ffd23f] font-bold text-lg font-mono">{srv.num}</span>
                  <span className="uppercase tracking-widest">{srv.role}</span>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <Clock className="w-3.5 h-3.5 text-[#f5603a]" />
                    <span>{srv.timeline}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#f5603a] uppercase mb-1">
                  // {srv.category}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-3">
                  {srv.title}
                </h3>

                <p className="text-sm text-white/70 font-normal leading-relaxed mb-6">
                  {srv.headline}
                </p>

                {/* Deliverables Bullet List */}
                <div className="space-y-2 mb-6 text-xs text-white/80 font-mono">
                  {srv.deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#ffd23f] font-bold">✓</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Badges */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                {srv.deliverableTech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded text-[11px] font-mono bg-white/[0.04] border border-white/10 text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Project Scope & Consultation Estimator */}
        <div className="rounded-2xl bg-black/70 border border-white/15 p-6 md:p-10 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Toggles */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#ffd23f] mb-1 uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  INTERACTIVE PROJECT &amp; TRAINING ESTIMATOR
                </div>
                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                  Collaborate with Muthubalaji M
                </h3>
                <p className="text-sm text-white/60 font-normal mt-1">
                  Select requirements for school/college student projects, IoT hardware prototyping, or institutional robotics workshops:
                </p>
              </div>

              {/* Requirement Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: "robotics", label: "Robotics Workshop / Training" },
                  { key: "iot", label: "Salem IoT Hardware Build" },
                  { key: "student", label: "Student Project Mentorship" },
                  { key: "app", label: "App & Animation Dev" },
                  { key: "agro", label: "Agro-Tech / QGIS Solutions" },
                ].map((item) => {
                  const active = estimateOptions[item.key as keyof typeof estimateOptions];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleOption(item.key as keyof typeof estimateOptions)}
                      className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                        active
                          ? "bg-[#f5603a]/20 border-[#f5603a] text-white font-bold"
                          : "bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${active ? "bg-[#f5603a] text-black" : "border border-white/20"}`}>
                        {active ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Estimated Timeline & CTA Dispatch */}
            <div className="lg:col-span-4 p-6 rounded-xl bg-white/[0.03] border border-white/10 text-center flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                  ESTIMATED PROJECT SPRINT
                </span>
                <div className="text-4xl md:text-5xl font-black font-mono text-white tracking-tight mt-1">
                  ~{estimatedDays} Days
                </div>
                <div className="text-xs font-mono text-[#ffd23f] mt-1">
                  {selectedCount} MODULES CONFIGURED
                </div>
              </div>

              <p className="text-xs text-white/60 font-normal">
                Includes full circuit diagram, component sourcing, microcontroller coding, and hands-on guidance.
              </p>

              <a
                href="#contact"
                className="w-full py-3 rounded-lg bg-[#f5603a] hover:bg-[#ff7552] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f5603a]/20"
              >
                <span>INITIATE PROJECT PROPOSAL</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
