import { useState } from "react";
import { Award, Trophy, CheckCircle2, Star, GraduationCap } from "lucide-react";

interface Milestone {
  year: string;
  badge: string;
  title: string;
  location: string;
  narrative: string;
  deliverables: string[];
  impactMetric: { label: string; value: string };
}

const MILESTONES: Milestone[] = [
  {
    year: "2024–Now",
    badge: "ENTREPRENEURSHIP & STARTUPS",
    title: "Founder: U Fill Academy, Aspire Academy & Salem IoT",
    location: "Salem, Tamil Nadu",
    narrative:
      "Established three entrepreneurial ventures to transform technical education, communication skills, and hardware innovation. Salem IoT operates as an active project development centre, while U Fill Academy and Aspire Academy deliver practical skill-based training in AI, Robotics, App Development, Animation, and spoken English.",
    deliverables: [
      "Founded U Fill Academy: Training in AI, Robotics, App & Animation Development",
      "Founded Salem IoT: Practical project development center and tech prototyping",
      "Founded Aspire Academy: Communication, Spoken English, and personal skill development",
    ],
    impactMetric: { label: "ACTIVE VENTURES", value: "3 Founded" },
  },
  {
    year: "2024",
    badge: "WORLD RECORD RECOGNITION",
    title: "Young Startup Entrepreneur Award (Jackie Book of World Records)",
    location: "Jackie Book of World Records",
    narrative:
      "Honored with the prestigious Young Startup Entrepreneur Award by Jackie Book of World Records in recognition of entrepreneurial initiatives, startup ventures, and tireless contributions to student technology education and project development.",
    deliverables: [
      "Awarded by Jackie Book of World Records for startup contributions",
      "Celebrated for mentoring 200+ student innovations across disciplines",
      "Recognized for promoting practical, hands-on learning across Tamil Nadu",
    ],
    impactMetric: { label: "AWARD RECOGNITION", value: "Young Startup" },
  },
  {
    year: "2023",
    badge: "FOUNDER'S EXCELLENCE",
    title: "Founder's Excellence Award – Gold Coin (Robotica Event)",
    location: "Otomatiks Robotics Academy",
    narrative:
      "Awarded the Founder's Excellence Award – Gold Coin by Otomatiks Robotics Academy during the signature Robotica event in recognition of outstanding excellence, leadership, and contributions associated with robotics and technical initiatives.",
    deliverables: [
      "Gold Coin Honor awarded during the annual Robotica event",
      "Excellence in leading and coordinating technical project teams",
      "Successful delivery of robotics workshops and student exhibits",
    ],
    impactMetric: { label: "HONORARY RECOGNITION", value: "Gold Coin" },
  },
  {
    year: "2021–2024",
    badge: "PROJECT TEAM LEADER",
    title: "Project Team Leader — Otomatiks Robotics Academy",
    location: "Salem & Regional Centers",
    narrative:
      "Served over 3 years in the robotics and technical education field, leading project development activities, exploring innovative solutions with IoT and embedded systems, coordinating technical teams, and directly guiding over 200+ school and college student projects.",
    deliverables: [
      "Guided 200+ student projects in Science, Agriculture, Mechanical, and Robotics",
      "Conducted interactive hands-on robotics workshops and exhibitions",
      "Coordinated cross-disciplinary engineering teams and project execution",
    ],
    impactMetric: { label: "PROJECTS GUIDED", value: "200+ Builds" },
  },
  {
    year: "2018–2022",
    badge: "ACADEMIC FOUNDATION",
    title: "B.E. in Agriculture Engineering — The Kavery College of Engineering",
    location: "Mecheri, Salem, Tamil Nadu",
    narrative:
      "Graduated with a Bachelor of Engineering in Agriculture Engineering from The Kavery College of Engineering. Gained strong foundational principles in engineering systems, irrigation, soil mechanics, and farm technology, which inspired me to pivot into Artificial Intelligence, Robotics, IoT, and Embedded Systems.",
    deliverables: [
      "Comprehensive B.E. Agriculture Engineering degree completion",
      "Applied engineering fundamentals to smart farming and QGIS geospatial tech",
      "Transitioned into multidisciplinary AI, Robotics, and hardware prototyping",
    ],
    impactMetric: { label: "DEGREE", value: "B.E. Agri Eng" },
  },
];

const AWARDS_EDUCATION = [
  {
    title: "Young Startup Entrepreneur Award",
    org: "Jackie Book of World Records",
    year: "2024",
    desc: "Recognized for entrepreneurial initiatives, startup ventures (U Fill, Aspire, Salem IoT), and contributions to startup development.",
    type: "award",
  },
  {
    title: "Founder's Excellence Award – Gold Coin",
    org: "Otomatiks Robotics Academy",
    year: "2023",
    desc: "Received during the Robotica event in recognition of excellence and contributions associated with robotics and technical initiatives.",
    type: "award",
  },
  {
    title: "B.E. – Agriculture Engineering",
    org: "The Kavery College of Engineering, Mecheri, Salem",
    year: "2018–2022",
    desc: "Graduated with Bachelor of Engineering in Agriculture Engineering, establishing the engineering foundation for tech innovation.",
    type: "education",
  },
  {
    title: "Higher Secondary (Classes XI–XII)",
    org: "Sri Jyothi Vidyalaya Hi-Tech Matriculation School, Salem",
    year: "Completed",
    desc: "Completed higher secondary education in science and mathematics, laying the academic groundwork for engineering.",
    type: "education",
  },
];

export default function TimelineAchievements() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone>(MILESTONES[0]);

  return (
    <section id="timeline" className="relative w-full min-h-screen bg-[#070403] text-white py-24 px-6 md:px-12 lg:px-20 border-t border-white/10">
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
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#ffd23f] uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ffd23f]" />
              SECTION 04 // PROFESSIONAL EXPERIENCE & EDUCATION
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95]">
              Experience, Awards <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd23f] via-[#f5603a] to-white">
                &amp; Academic Journey.
              </span>
            </h2>
          </div>
          <div className="text-right font-mono text-xs text-white/50">
            <p>CHRONICLE // 2018 — 2026</p>
            <p className="text-white/80">LEADERSHIP · ENTREPRENEURSHIP · EDUCATION</p>
          </div>
        </div>

        {/* Milestone Timeline Navigation Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {MILESTONES.map((m) => (
            <button
              key={m.year}
              onClick={() => setSelectedMilestone(m)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                selectedMilestone.year === m.year
                  ? "bg-white/[0.08] border-[#f5603a] shadow-xl shadow-[#f5603a]/10"
                  : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-black font-mono text-white">{m.year}</span>
                <span className="text-[10px] font-mono text-[#ffd23f] uppercase">{m.impactMetric.value}</span>
              </div>
              <p className="text-xs text-white/60 font-mono uppercase tracking-wider truncate">
                {m.badge}
              </p>
            </button>
          ))}
        </div>

        {/* Active Milestone Highlight Card */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/15 p-6 md:p-10 backdrop-blur-md mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Narrative Details */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-[#f5603a]/20 border border-[#f5603a] text-[#f5603a] font-bold">
                  {selectedMilestone.year}
                </span>
                <span className="text-white/40">//</span>
                <span className="text-[#ffd23f] uppercase">{selectedMilestone.badge}</span>
                <span className="text-white/40">//</span>
                <span className="text-white/60">{selectedMilestone.location}</span>
              </div>

              <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
                {selectedMilestone.title}
              </h3>

              <p className="text-sm md:text-base text-white/80 font-normal leading-relaxed">
                {selectedMilestone.narrative}
              </p>

              {/* Key Deliverables */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">
                  AREAS OF CONTRIBUTION &amp; ACHIEVEMENTS:
                </div>
                {selectedMilestone.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs md:text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd23f] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Impact Metric Stat Callout */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-xl bg-black/60 border border-white/10 text-center space-y-2">
              <Trophy className="w-10 h-10 text-[#ffd23f] mb-2" />
              <div className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">
                {selectedMilestone.impactMetric.value}
              </div>
              <div className="text-xs uppercase font-mono tracking-widest text-white/40">
                {selectedMilestone.impactMetric.label}
              </div>
            </div>
          </div>
        </div>

        {/* Awards & Academic Qualifications Grid */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-widest mb-6">
            <Award className="w-4 h-4 text-[#f5603a]" />
            AWARDS, RECOGNITION &amp; EDUCATION
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AWARDS_EDUCATION.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#ffd23f]/50 transition-colors flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-[#ffd23f] mb-2">
                    {item.type === "award" ? (
                      <Star className="w-3.5 h-3.5 fill-[#ffd23f]" />
                    ) : (
                      <GraduationCap className="w-4 h-4 text-[#ffd23f]" />
                    )}
                    <span>{item.year}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white uppercase tracking-tight mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/60 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-white/40 pt-3 border-t border-white/10 truncate">
                  {item.org}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
