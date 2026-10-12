import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowUpRight, Sliders, X } from "lucide-react";

interface Project {
  id: string;
  name: string;
  code: string;
  category: "agriculture" | "robotics" | "iot" | "education";
  categoryLabel: string;
  headline: string;
  description: string;
  specs: Record<string, string>;
  stack: string[];
  metrics: { label: string; value: string }[];
  highlight: string;
  renderType: "arm" | "rover" | "dog" | "amr";
}

const PROJECTS: Project[] = [
  {
    id: "agro-rover",
    name: "Agro-Tech Field Monitoring Rover",
    code: "AGRO.BOT-01",
    category: "agriculture",
    categoryLabel: "AGRICULTURE ENGINEERING & IOT",
    headline: "Autonomous Agricultural Field Rover with Multi-Sensor Soil Telemetry & QGIS Mapping",
    description:
      "A flagship project combining my Agriculture Engineering academic foundation from The Kavery College of Engineering with IoT and robotics. Features soil moisture, temperature, and crop health sensors with GPS coordinates mapped directly into QGIS for precision agricultural management.",
    specs: {
      "Domain": "Agriculture Engineering & IoT",
      "Microcontroller": "Arduino Mega / ESP32 Core",
      "Sensor Payload": "Soil NPK, Moisture, Temp & Humidity",
      "Geospatial Tool": "QGIS Geospatial Mapping Integration",
      "Locomotion": "4WD High-Torque All-Terrain Drive",
      "Wireless Control": "Long-Range RF & Wi-Fi Telemetry",
    },
    stack: ["Agriculture Engineering", "Arduino", "QGIS", "IoT Sensors", "C++", "Hardware Prototyping"],
    metrics: [
      { label: "SOIL SENSORS", value: "Multi-Probe" },
      { label: "MAPPING", value: "QGIS Geospatial" },
      { label: "POWER", value: "12V Solar BMS" },
    ],
    highlight: "Bridges mechanical agriculture with modern IoT wireless telemetry for smart farm automation.",
    renderType: "amr",
  },
  {
    id: "otomatiks-platform",
    name: "Otomatiks Robotics Learning Platform",
    code: "ROBO.EDU-02",
    category: "robotics",
    categoryLabel: "ROBOTICS & EMBEDDED SYSTEMS",
    headline: "Modular Educational Robotics Arm & Sensor Integration Platform for Practical Learning",
    description:
      "Developed during my 3+ years as Project Team Leader at Otomatiks Robotics Academy. Engineered to provide school and college students with hands-on experience in electronic circuits, microcontroller programming, and multi-axis servo kinematics.",
    specs: {
      "Academy": "Otomatiks Robotics Academy",
      "Degrees of Freedom": "4-Axis Articulated Arm",
      "Control Board": "Custom Arduino Microcontroller Shield",
      "Kinematic Actuators": "Precision Servo Motors",
      "Student Reach": "Hundreds of Workshop Participants",
      "Integration": "Bluetooth & Ultrasonic Collision Detection",
    },
    stack: ["Robotics Design", "Arduino C++", "Electronic Circuits", "Microcontrollers", "Workshops"],
    metrics: [
      { label: "DEGREES OF FREEDOM", value: "4-Axis" },
      { label: "STUDENTS TRAINED", value: "1000+" },
      { label: "EVENT AWARD", value: "Gold Coin Winner" },
    ],
    highlight: "Recipient of the Founder's Excellence Award – Gold Coin at the Robotica event.",
    renderType: "arm",
  },
  {
    id: "salem-iot",
    name: "Salem IoT Multi-Sensor Gateway",
    code: "IOT.PRO-03",
    category: "iot",
    categoryLabel: "SALEM IOT VENTURE",
    headline: "Industrial & Domestic IoT Telemetry Gateway for Real-Time Automation",
    description:
      "Engineered at Salem IoT, my technology venture and project development centre. Designed to capture, process, and transmit sensor parameters from industrial and domestic equipment to cloud dashboards and mobile applications with automated trigger alerts.",
    specs: {
      "Venture": "Salem IoT Project Development Centre",
      "Connectivity": "Wi-Fi, Bluetooth & LoRa",
      "Input Channels": "Digital & Analog Multi-Sensor Bus",
      "Alert System": "Automated Cloud & Mobile App Push Alerts",
      "Firmware": "ESP32 Embedded C / Arduino Framework",
      "Application": "Industrial Monitoring & Smart Home",
    },
    stack: ["Internet of Things", "Hardware Prototyping", "Wireless Control", "Mobile App Dev", "ESP32"],
    metrics: [
      { label: "CONNECTIVITY", value: "Tri-Band" },
      { label: "LATENCY", value: "< 250 ms" },
      { label: "DEPLOYMENTS", value: "Salem Lab" },
    ],
    highlight: "Powers practical technology solutions and client project developments across Salem region.",
    renderType: "rover",
  },
  {
    id: "student-projects",
    name: "200+ Guided Student Innovations",
    code: "EDU.PROJ-200",
    category: "education",
    categoryLabel: "STUDENT PROJECT MENTORSHIP",
    headline: "Multi-Disciplinary Project Mentorship Across Science, Agriculture, Mechanical & IoT",
    description:
      "A landmark achievement involving the hands-on guidance of over 200 projects for school and college students across Tamil Nadu. Covered science fair exhibits, final-year engineering projects, IoT smart systems, and mechanical automation models.",
    specs: {
      "Total Projects Guided": "200+ Completed Student Inventions",
      "Disciplines": "Science, Mechanical, Agriculture, Robotics, IoT",
      "Institutions": "Schools, Polytechnic & Engineering Colleges",
      "Ventures": "U Fill Academy, Aspire Academy, Otomatiks",
      "Key Outcomes": "Science Fair Prizes, Symposium Awards",
      "Mentorship Style": "Hands-On Practical Creative Thinking",
    },
    stack: ["Technical Education", "Student Mentoring", "Project Development", "Problem Solving", "Leadership"],
    metrics: [
      { label: "PROJECT COUNT", value: "200+" },
      { label: "SECTOR DOMAINS", value: "6 Fields" },
      { label: "ENTREPRENEUR", value: "3 Ventures" },
    ],
    highlight: "Recognized with the Young Startup Entrepreneur Award by Jackie Book of World Records.",
    renderType: "dog",
  },
];

/* 3D Wireframe Model Canvas for Inspect Modal */
function CADModelViewer({ renderType }: { renderType: "arm" | "rover" | "dog" | "amr" }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(2.5, 2.5, 3.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    const accentMat = new THREE.LineBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.9 });
    const orangeMat = new THREE.LineBasicMaterial({ color: 0xf5603a, transparent: true, opacity: 0.95 });

    const grid = new THREE.GridHelper(4, 20, 0xff6b35, 0x444444);
    grid.position.y = -0.7;
    scene.add(grid);

    if (renderType === "arm") {
      const baseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.3, 16);
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo), lineMat));

      const l1Geo = new THREE.BoxGeometry(0.3, 0.9, 0.3);
      const l1 = new THREE.LineSegments(new THREE.EdgesGeometry(l1Geo), accentMat);
      l1.position.set(0, 0.45, 0);
      group.add(l1);

      const elbowGeo = new THREE.SphereGeometry(0.25, 12, 12);
      const elbow = new THREE.LineSegments(new THREE.EdgesGeometry(elbowGeo), orangeMat);
      elbow.position.set(0, 0.95, 0);
      group.add(elbow);

      const l2Geo = new THREE.BoxGeometry(0.22, 0.8, 0.22);
      const l2 = new THREE.LineSegments(new THREE.EdgesGeometry(l2Geo), lineMat);
      l2.position.set(0.3, 1.4, 0);
      l2.rotation.z = -0.5;
      group.add(l2);

      const gripGeo = new THREE.ConeGeometry(0.18, 0.35, 8);
      const grip = new THREE.LineSegments(new THREE.EdgesGeometry(gripGeo), orangeMat);
      grip.position.set(0.5, 1.8, 0);
      grip.rotation.z = -0.5;
      group.add(grip);
    } else if (renderType === "rover") {
      const chGeo = new THREE.BoxGeometry(1.4, 0.35, 0.8);
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(chGeo), orangeMat));

      const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8);
      const mast = new THREE.LineSegments(new THREE.EdgesGeometry(mastGeo), lineMat);
      mast.position.set(0.4, 0.45, 0);
      group.add(mast);

      const lidarGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 12);
      const lidar = new THREE.LineSegments(new THREE.EdgesGeometry(lidarGeo), accentMat);
      lidar.position.set(0.4, 0.85, 0);
      group.add(lidar);

      const wGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 12);
      wGeo.rotateZ(Math.PI / 2);
      [
        [-0.6, -0.2, 0.55],
        [0, -0.2, 0.55],
        [0.6, -0.2, 0.55],
        [-0.6, -0.2, -0.55],
        [0, -0.2, -0.55],
        [0.6, -0.2, -0.55],
      ].forEach(([x, y, z]) => {
        const wheel = new THREE.LineSegments(new THREE.EdgesGeometry(wGeo), lineMat);
        wheel.position.set(x, y, z);
        group.add(wheel);
      });
    } else if (renderType === "dog") {
      const torsoGeo = new THREE.BoxGeometry(1.2, 0.3, 0.45);
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(torsoGeo), orangeMat));

      const headGeo = new THREE.BoxGeometry(0.35, 0.3, 0.35);
      const head = new THREE.LineSegments(new THREE.EdgesGeometry(headGeo), accentMat);
      head.position.set(0.7, 0.2, 0);
      group.add(head);

      const legPositions = [
        [0.45, -0.4, 0.3],
        [-0.45, -0.4, 0.3],
        [0.45, -0.4, -0.3],
        [-0.45, -0.4, -0.3],
      ];
      legPositions.forEach(([x, _y, z]) => {
        const hipGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const hip = new THREE.LineSegments(new THREE.EdgesGeometry(hipGeo), accentMat);
        hip.position.set(x, 0, z);
        group.add(hip);

        const legUpper = new THREE.BoxGeometry(0.08, 0.45, 0.08);
        const lu = new THREE.LineSegments(new THREE.EdgesGeometry(legUpper), lineMat);
        lu.position.set(x, -0.22, z);
        group.add(lu);

        const legLower = new THREE.BoxGeometry(0.06, 0.45, 0.06);
        const ll = new THREE.LineSegments(new THREE.EdgesGeometry(legLower), lineMat);
        ll.position.set(x + 0.05, -0.55, z);
        group.add(ll);
      });
    } else {
      const amrGeo = new THREE.BoxGeometry(1.3, 0.4, 0.9);
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(amrGeo), lineMat));

      const solarGeo = new THREE.BoxGeometry(1.4, 0.05, 1.0);
      const solar = new THREE.LineSegments(new THREE.EdgesGeometry(solarGeo), accentMat);
      solar.position.set(0, 0.45, 0);
      group.add(solar);

      const wGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 12);
      wGeo.rotateZ(Math.PI / 2);
      [
        [-0.45, -0.2, 0.55],
        [0.45, -0.2, 0.55],
        [-0.45, -0.2, -0.55],
        [0.45, -0.2, -0.55],
      ].forEach(([x, y, z]) => {
        const wheel = new THREE.LineSegments(new THREE.EdgesGeometry(wGeo), orangeMat);
        wheel.position.set(x, y, z);
        group.add(wheel);
      });
    }

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.remove();
      }
      renderer.dispose();
      lineMat.dispose();
      accentMat.dispose();
      orangeMat.dispose();
    };
  }, [renderType]);

  return <div ref={mountRef} className="w-full h-full cursor-grab" />;
}

export default function WorksGallery() {
  const [filter, setFilter] = useState<string>("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="work" className="relative w-full min-h-screen bg-[#080504] text-white py-24 px-6 md:px-12 lg:px-20 border-t border-white/10">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 bottom-0 left-[4%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 left-[34.7%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 left-[65.4%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 right-[4%] w-[1px] bg-white/40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/15 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#ffd23f] uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ffd23f]" />
              SECTION 02 // PROJECT DEVELOPMENT EXPERIENCE
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95]">
              Innovation in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd23f] via-[#f5603a] to-white">
                Action &amp; Mentorship.
              </span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "ALL PROJECTS" },
              { id: "agriculture", label: "AGRO-TECH & QGIS" },
              { id: "robotics", label: "ROBOTICS ACADEMY" },
              { id: "iot", label: "SALEM IOT GATEWAY" },
              { id: "education", label: "200+ STUDENT PROJECTS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all uppercase tracking-wider ${
                  filter === tab.id
                    ? "bg-[#f5603a] text-white font-bold shadow-lg shadow-[#f5603a]/20"
                    : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects 2x2 Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group relative rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#f5603a]/60 p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-[#f5603a]/10 cursor-pointer flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-4 text-white/40">
                  <span className="text-[#ffd23f] font-bold">{project.code}</span>
                  <span className="uppercase tracking-widest">{project.categoryLabel}</span>
                </div>

                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight group-hover:text-[#f5603a] transition-colors">
                    {project.name}
                  </h3>
                  <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-[#f5603a] group-hover:text-black transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-sm text-white/70 line-clamp-2 mb-6 font-normal">
                  {project.headline}
                </p>

                {/* Key Metrics Chips */}
                <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-black/40 border border-white/10 mb-6 font-mono text-center">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="text-xs md:text-sm font-bold text-white">{m.value}</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/40">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Tech Stack Pills + Action */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] border border-white/10 text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 4 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] text-white/40">
                      +{project.stack.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-3 border-t border-white/10">
                  <span className="text-[11px] text-white/70 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#f5603a]" />
                    INSPECT CAD SPECS &amp; TELEMETRY
                  </span>
                  <span className="text-[#ffd23f] group-hover:translate-x-1 transition-transform">
                    EXPAND →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE BLUEPRINT MODAL / TELEMETRY DRAWER
          ========================================================================= */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0e0a08] border border-white/20 p-6 md:p-10 shadow-2xl space-y-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/15">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#ffd23f] mb-1">
                  <span>{activeProject.code}</span>
                  <span>//</span>
                  <span>{activeProject.categoryLabel}</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                  {activeProject.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body: 3D CAD Wireframe View + Detailed Technical Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive 3D Model */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="w-full h-[320px] md:h-[380px] rounded-xl bg-black/70 border border-white/10 relative overflow-hidden flex items-center justify-center">
                  <CADModelViewer renderType={activeProject.renderType} />
                  <div className="absolute top-3 left-3 text-[10px] font-mono text-white/50 bg-black/50 px-2 py-1 rounded border border-white/10">
                    INTERACTIVE 3D CAD // ROTATE TO INSPECT
                  </div>
                </div>
                <p className="mt-3 text-xs font-mono text-[#ffd23f] text-center">
                  KEY HIGHLIGHT: {activeProject.highlight}
                </p>
              </div>

              {/* Right Column: Engineering Datasheet */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase text-white/40 tracking-wider mb-2">
                    PROJECT SUMMARY &amp; IMPACT
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed font-normal">
                    {activeProject.description}
                  </p>
                </div>

                {/* Specs Table */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-white/40 tracking-wider mb-3">
                    TECHNICAL SPECIFICATIONS
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                    {Object.entries(activeProject.specs).map(([specKey, specVal]) => (
                      <div
                        key={specKey}
                        className="flex justify-between items-center py-2 px-3 rounded bg-white/[0.03] border border-white/10"
                      >
                        <span className="text-white/50">{specKey}</span>
                        <span className="font-semibold text-white">{specVal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Tech Stack */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-white/40 tracking-wider mb-2">
                    SKILL &amp; TOOL INTEGRATION
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.stack.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-white/[0.06] border border-white/15 text-white/90"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Close Action */}
            <div className="pt-6 border-t border-white/15 flex justify-end">
              <button
                onClick={() => setActiveProject(null)}
                className="px-6 py-2.5 rounded bg-[#f5603a] hover:bg-[#ff7552] text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#f5603a]/20"
              >
                CLOSE BLUEPRINT INSPECTOR
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
