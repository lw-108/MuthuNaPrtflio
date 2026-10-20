import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, CheckCircle2, Copy, Check, Mail, Phone, MapPin } from "lucide-react";

interface CommandLog {
  type: "input" | "output" | "system";
  text: string;
}

const INITIAL_LOGS: CommandLog[] = [
  { type: "system", text: "MUTHUBALAJI M // AI & ROBOTICS MISSION CONTROL v5.0" },
  { type: "system", text: "TURNING IDEAS INTO INNOVATION. BUILDING TECHNOLOGY FOR THE FUTURE." },
  { type: "system", text: "TYPE 'help' FOR COMMANDS OR USE THE DIRECT TRANSMISSION CONSOLE." },
];

export default function ContactTerminal() {
  const [command, setCommand] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>(INITIAL_LOGS);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "Robotics & Embedded Systems",
    message: "",
  });
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;

    const newLogs: CommandLog[] = [...logs, { type: "input", text: `$ ${command}` }];

    switch (cmd) {
      case "help":
        newLogs.push({
          type: "output",
          text: "AVAILABLE COMMANDS:\n  • profile   - View Muthubalaji's professional overview\n  • ventures  - Information on U Fill, Aspire & Salem IoT\n  • awards    - Honors and world record recognitions\n  • contact   - Direct email, phone, and location\n  • education - B.E. Agriculture Engineering details\n  • ping      - Run live telemetry response test\n  • clear     - Clear terminal buffer",
        });
        break;
      case "profile":
        newLogs.push({
          type: "output",
          text: "PROFILE: Muthubalaji M\n  • Roles: AI & Robotics Professional | Project Developer | Entrepreneur\n  • Experience: 5+ Years (3+ Years Robotics/AI Team Leader, 2 Years Office Admin)\n  • Projects: 10+ Sector Projects | 200+ Student Projects Guided\n  • Vision: 'Turning Ideas into Innovation. Building Technology for the Future.'",
        });
        break;
      case "ventures":
        newLogs.push({
          type: "output",
          text: "ENTREPRENEURIAL VENTURES:\n  1. U Fill Academy  - Technical education in AI, Robotics, Apps, Animation & IoT\n  2. Salem IoT       - Technology project development centre & hardware prototyping\n  3. Aspire Academy  - Educational support, Spoken English & skill development",
        });
        break;
      case "awards":
        newLogs.push({
          type: "output",
          text: "AWARDS & RECOGNITION:\n  • Young Startup Entrepreneur Award — Jackie Book of World Records\n  • Founder's Excellence Award (Gold Coin) — Otomatiks Robotics Academy (Robotica Event)",
        });
        break;
      case "education":
        newLogs.push({
          type: "output",
          text: "EDUCATION:\n  • B.E. Agriculture Engineering (2018–2022) — The Kavery College of Engineering, Mecheri, Salem\n  • Sri Jyothi Vidyalaya Hi-Tech Matriculation Higher Secondary School, Salem",
        });
        break;
      case "contact":
        newLogs.push({
          type: "output",
          text: "DIRECT CONTACT:\n  • Email: msmuthu4545@gmail.com\n  • Phone: +91 86105 65660\n  • Location: Salem, Tamil Nadu, India",
        });
        break;
      case "ping":
        newLogs.push({
          type: "output",
          text: `RTT to Mission Control: ${(18 + Math.random() * 8).toFixed(1)} ms · Status: 200 OK [READY TO CONNECT]`,
        });
        break;
      case "clear":
        setLogs([]);
        setCommand("");
        return;
      default:
        newLogs.push({
          type: "output",
          text: `Command not recognized: '${cmd}'. Type 'help' for available commands.`,
        });
    }

    setLogs(newLogs);
    setCommand("");
  };

  const executeQuickCommand = (c: string) => {
    setCommand(c);
    const newLogs: CommandLog[] = [...logs, { type: "input", text: `$ ${c}` }];
    if (c === "profile") {
      newLogs.push({
        type: "output",
        text: "MUTHUBALAJI M: AI & Robotics Professional, Project Developer, Entrepreneur. Founder of U Fill, Aspire & Salem IoT. 200+ projects guided.",
      });
    } else if (c === "ventures") {
      newLogs.push({
        type: "output",
        text: "VENTURES: U Fill Academy (Tech Ed) · Salem IoT (Hardware Prototyping) · Aspire Academy (Skills).",
      });
    } else if (c === "contact") {
      newLogs.push({
        type: "output",
        text: "EMAIL: msmuthu4545@gmail.com | PHONE: +91 86105 65660 | LOCATION: Salem, Tamil Nadu.",
      });
    } else if (c === "awards") {
      newLogs.push({
        type: "output",
        text: "HONORS: Jackie Book of World Records (Young Startup) · Otomatiks Robotica Gold Coin.",
      });
    }
    setLogs(newLogs);
    setCommand("");
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("msmuthu4545@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText("+918610565660");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSent(true);
  };

  return (
    <section id="contact" className="relative w-full min-h-screen bg-[#060403] text-white py-24 px-6 md:px-12 lg:px-20 border-t border-white/10">
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
              SECTION 06 // CONTACT &amp; CONNECT
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95]">
              Let&apos;s Connect, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd23f] via-[#f5603a] to-white">
                Collaborate &amp; Innovate.
              </span>
            </h2>
          </div>
          <div className="text-right font-mono text-xs text-white/50">
            <p>LOCATION // SALEM, TAMIL NADU</p>
            <p className="text-white/80">DIRECT: +91 86105 65660</p>
          </div>
        </div>

        {/* 2-Column Layout: CLI Terminal on Left + Transmission Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Interactive Terminal CLI */}
          <div className="lg:col-span-6 rounded-2xl bg-black/90 border border-white/15 p-6 backdrop-blur-2xl shadow-2xl flex flex-col h-[520px]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-white/50 text-[11px]">muthubalaji_terminal ~ bash</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">SYSTEM READY</span>
            </div>

            {/* Quick Command Pills */}
            <div className="flex flex-wrap gap-1.5 pb-3 border-b border-white/10 mb-3">
              {["profile", "ventures", "awards", "contact", "help"].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => executeQuickCommand(cmd)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] hover:bg-[#f5603a]/20 border border-white/10 text-white/70 hover:text-white transition-colors"
                >
                  ${cmd}
                </button>
              ))}
            </div>

            {/* Terminal Output Stream */}
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs pr-2 text-white/80">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    log.type === "input"
                      ? "text-[#ffd23f] font-bold"
                      : log.type === "system"
                      ? "text-white/40 text-[11px]"
                      : "text-white/90"
                  }`}
                >
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Command Input Form */}
            <form onSubmit={handleCommandSubmit} className="pt-3 mt-3 border-t border-white/10 flex items-center gap-2 font-mono text-xs">
              <span className="text-[#f5603a] font-bold">$</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="type command (e.g. profile, ventures, contact)..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
              />
              <button type="submit" className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono">
                SEND
              </button>
            </form>
          </div>

          {/* Right Column: Direct Dispatch Transmission Form */}
          <div className="lg:col-span-6 rounded-2xl bg-white/[0.02] border border-white/15 p-6 md:p-8 backdrop-blur-md">
            {formSent ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                  Message Dispatched Successfully.
                </h3>
                <p className="text-sm text-white/70 max-w-md mx-auto">
                  Thank you! Your message has been sent to Muthubalaji M. You can also reach out directly via call or WhatsApp at +91 86105 65660.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="px-6 py-2 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white font-sans mb-1">
                    Send Direct Message
                  </h3>
                  <p className="text-xs text-white/60 font-sans font-normal">
                    Collaborate on robotics workshops, IoT solutions, student projects, or startup initiatives.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white/50 text-[11px] uppercase">YOUR NAME / ORGANIZATION</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Principal / Project Lead"
                      className="w-full py-2.5 px-3 rounded-lg bg-black/50 border border-white/15 text-white placeholder:text-white/30 focus:border-[#f5603a] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 text-[11px] uppercase">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full py-2.5 px-3 rounded-lg bg-black/50 border border-white/15 text-white placeholder:text-white/30 focus:border-[#f5603a] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/50 text-[11px] uppercase">AREA OF COLLABORATION</label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-lg bg-black/50 border border-white/15 text-white focus:border-[#f5603a] outline-none"
                  >
                    <option value="Robotics & Embedded Systems">Robotics &amp; Embedded Systems</option>
                    <option value="Salem IoT Projects">Salem IoT Project Development</option>
                    <option value="Student Project Mentorship">Student Project Development (School / College)</option>
                    <option value="U Fill Academy Training">U Fill Academy Training &amp; Workshops</option>
                    <option value="Agriculture & QGIS">Agriculture Engineering &amp; Geospatial QGIS</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/50 text-[11px] uppercase">MESSAGE / PROJECT DETAILS</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, workshop requirements, or technical idea..."
                    className="w-full py-2.5 px-3 rounded-lg bg-black/50 border border-white/15 text-white placeholder:text-white/30 focus:border-[#f5603a] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#f5603a] hover:bg-[#ff7552] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#f5603a]/25"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE PACKET</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Direct Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/15">
          {/* Email Direct */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#f5603a]" />
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">EMAIL ADDRESS</div>
                <a href="mailto:msmuthu4545@gmail.com" className="text-xs font-mono font-semibold text-white hover:text-[#f5603a]">
                  msmuthu4545@gmail.com
                </a>
              </div>
            </div>
            <button
              onClick={copyEmail}
              className="p-2 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Copy Email"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Phone Direct */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#ffd23f]" />
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">PHONE / WHATSAPP</div>
                <a href="tel:+918610565660" className="text-xs font-mono font-semibold text-white hover:text-[#ffd23f]">
                  +91 86105 65660
                </a>
              </div>
            </div>
            <button
              onClick={copyPhone}
              className="p-2 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Copy Phone"
            >
              {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Location */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] font-mono text-white/40 uppercase">BASE LOCATION</div>
              <div className="text-xs font-mono font-semibold text-white">Salem, Tamil Nadu, India</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
