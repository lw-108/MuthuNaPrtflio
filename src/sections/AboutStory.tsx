import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { Cpu, Compass, Zap, BookOpen, Building2, Sprout } from "lucide-react";

interface ProbeInfo {
  id: string;
  name: string;
  label: string;
  spec: string;
  status: string;
  icon: ReactNode;
}

const PROBES: ProbeInfo[] = [
  {
    id: "embedded",
    name: "Embedded Systems & Arduino",
    label: "HARDWARE PROTOTYPING",
    spec: "Microcontroller circuits · Sensor integration & motor control",
    status: "PROTOTYPED",
    icon: <Cpu className="w-4 h-4 text-amber-400" />,
  },
  {
    id: "iot",
    name: "Salem IoT Project Center",
    label: "WIRELESS & SENSORS",
    spec: "IoT gateways · Wireless telemetry & smart automation nodes",
    status: "ACTIVE LAB",
    icon: <Zap className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: "agro",
    name: "Agriculture & Geospatial",
    label: "AGRO-TECH FOUNDATION",
    spec: "B.E. Agriculture Engineering · QGIS geospatial applications",
    status: "FIELD PROVEN",
    icon: <Sprout className="w-4 h-4 text-green-400" />,
  },
  {
    id: "academy",
    name: "U Fill & Aspire Academies",
    label: "TECHNICAL EDUCATION",
    spec: "200+ school & college student projects guided across Tamil Nadu",
    status: "ACADEMY LIVE",
    icon: <BookOpen className="w-4 h-4 text-purple-400" />,
  },
];

export default function AboutStory() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeProbe, setActiveProbe] = useState<ProbeInfo>(PROBES[0]);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // --- THREE.JS MECHATRONIC CORE CANVAS ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Concentric Gimbal Rings
    const ring1Geo = new THREE.TorusGeometry(2.0, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, wireframe: true });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.6, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.85, wireframe: true });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    coreGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(1.2, 0.02, 16, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0.8, wireframe: true });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    coreGroup.add(ring3);

    // Central Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(0.65, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.9 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xff8c42, transparent: true, opacity: 0.6 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Orbiting particles
    const particleCount = 48;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffd23f, size: 0.045, transparent: true, opacity: 0.9 });
    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // Coordinate lines
    const lineX = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.4, 0, 0), new THREE.Vector3(2.4, 0, 0)]), new THREE.LineBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0.8 }));
    const lineY = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -2.4, 0), new THREE.Vector3(0, 2.4, 0)]), new THREE.LineBasicMaterial({ color: 0x4dff88, transparent: true, opacity: 0.8 }));
    const lineZ = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -2.4), new THREE.Vector3(0, 0, 2.4)]), new THREE.LineBasicMaterial({ color: 0x4da6ff, transparent: true, opacity: 0.8 }));
    coreGroup.add(lineX, lineY, lineZ);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.7;
      mouseY = y * 0.7;
    };

    el.addEventListener("pointermove", onPointerMove);

    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    let raf = 0;
    let clock = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      clock += 0.015;

      if (isRotating) {
        ring1.rotation.x = clock * 0.45;
        ring1.rotation.y = clock * 0.25;
        ring2.rotation.y = -clock * 0.55;
        ring2.rotation.z = clock * 0.35;
        ring3.rotation.x = clock * 0.65;
        ring3.rotation.z = -clock * 0.45;
        coreMesh.rotation.y = clock * 0.8;
        coreMesh.rotation.x = clock * 0.4;
        innerMesh.rotation.y = -clock * 0.9;
        particles.rotation.y = clock * 0.2;
      }

      targetRotX += (mouseY - targetRotX) * 0.05;
      targetRotY += (mouseX - targetRotY) * 0.05;
      coreGroup.rotation.x = targetRotX;
      coreGroup.rotation.y = targetRotY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      if (renderer.domElement.parentElement) {
        renderer.domElement.remove();
      }
      renderer.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      coreGeo.dispose();
      innerGeo.dispose();
      particleGeo.dispose();
    };
  }, [isRotating]);

  return (
    <section id="about" className="relative w-full min-h-screen bg-[#0d0907] text-white py-24 px-6 md:px-12 lg:px-20 overflow-hidden border-t border-white/10">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <div className="absolute top-0 bottom-0 left-[4%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 left-[34.7%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 left-[65.4%] w-[1px] bg-white/40" />
        <div className="absolute top-0 bottom-0 right-[4%] w-[1px] bg-white/40" />
        <div className="absolute left-0 right-0 top-12 h-[1px] bg-white/40" />
        <div className="absolute left-0 right-0 bottom-12 h-[1px] bg-white/40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/15 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#f5603a] uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#f5603a] animate-ping" />
              SECTION 01 // WHO I AM
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95]">
              Turning Ideas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5603a] via-[#ffd23f] to-white">
                Into Innovation.
              </span>
            </h2>
          </div>
          <div className="text-right font-mono text-xs text-white/50 space-y-1">
            <p>LOCATION // SALEM, TAMIL NADU (11.66°N, 78.14°E)</p>
            <p className="text-white/80">AI · ROBOTICS · EMBEDDED SYSTEMS · IOT</p>
          </div>
        </div>

        {/* Main Content Grid: Story + 3D Interactive Telemetry Gyroscope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative Story & Engineering Core */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-base md:text-lg text-white/80 font-normal leading-relaxed">
              <p className="text-xl md:text-2xl text-white font-medium leading-snug">
                &ldquo;My goal is to bridge the gap between ideas and real-world applications by developing innovative solutions and empowering the next generation of technology creators.&rdquo;
              </p>
              <p>
                I am <span className="text-white font-semibold">Muthubalaji M</span>, an Agriculture Engineering graduate from <em>The Kavery College of Engineering</em> with a multidisciplinary career in <strong>Artificial Intelligence, Robotics, IoT, and Embedded Systems</strong>.
              </p>
              <p>
                With over <span className="text-[#ffd23f] font-semibold">5+ years of overall professional experience</span>—including more than 3 years as <strong>Project Team Leader</strong> at <em>Otomatiks Robotics Academy</em> and 2 years in Office Administration—I blend technical circuit integration, software development, team leadership, and entrepreneurial management.
              </p>
              <p>
                I have contributed to <span className="text-white font-semibold">10+ projects across various industry sectors</span> and have mentored students through more than <span className="text-[#f5603a] font-semibold">200+ projects</span> in Science, Agriculture, Mechanical Engineering, and Robotics. As the founder of <span className="text-[#ffd23f] font-semibold">U Fill Academy</span>, <span className="text-[#ffd23f] font-semibold">Aspire Academy</span>, and <span className="text-[#ffd23f] font-semibold">Salem IoT</span>, I champion practical learning and real-world technology creation.
              </p>
            </div>

            {/* 4 Pillars of Multidisciplinary Expertise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 hover:border-[#f5603a]/50 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-[#f5603a]/10 text-[#f5603a] group-hover:bg-[#f5603a] group-hover:text-black transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm tracking-wide uppercase">Robotics &amp; Embedded</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Arduino-based hardware, microcontroller firmware, robotics design, and electronic circuit integration.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 hover:border-[#ffd23f]/50 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-[#ffd23f]/10 text-[#ffd23f] group-hover:bg-[#ffd23f] group-hover:text-black transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm tracking-wide uppercase">IoT &amp; Hardware (Salem IoT)</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Internet of Things prototyping, sensor systems, and wireless communication for practical automation.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 hover:border-emerald-400/50 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-emerald-400/10 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-colors">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm tracking-wide uppercase">Agro-Tech &amp; Geospatial</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  B.E. Agriculture Engineering foundation, smart farming solutions, and QGIS geospatial applications.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 hover:border-purple-400/50 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-purple-400/10 text-purple-400 group-hover:bg-purple-400 group-hover:text-black transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm tracking-wide uppercase">Entrepreneur &amp; Educator</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Founder of U Fill Academy, Aspire Academy, and Salem IoT; guiding 200+ student innovations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Three.js Interactive Mechatronic & IoT Core */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full relative rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl shadow-2xl">
              {/* Top HUD Status */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono text-white/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SALEM IOT &amp; ROBOTICS // ONLINE</span>
                </div>
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className="px-2.5 py-1 rounded border border-white/20 text-[10px] hover:bg-white/10 transition-colors"
                >
                  {isRotating ? "FREEZE ROTATION" : "RESUME SPIN"}
                </button>
              </div>

              {/* Three.js Canvas Container */}
              <div
                ref={mountRef}
                className="w-full h-[320px] sm:h-[380px] cursor-grab active:cursor-grabbing relative overflow-hidden"
              />

              {/* Interactive Telemetry Subsystems */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-2">
                  INSPECT VENTURE &amp; TECHNICAL TELEMETRY:
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {PROBES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveProbe(p)}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono text-left transition-all ${
                        activeProbe.id === p.id
                          ? "bg-[#f5603a]/20 border border-[#f5603a] text-white shadow-lg shadow-[#f5603a]/10"
                          : "bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {p.icon}
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>

                {/* Active Probe Telemetry Readout Card */}
                <div className="p-3 rounded bg-white/[0.04] border border-white/10 text-xs font-mono space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-white/40">
                    <span>{activeProbe.label}</span>
                    <span className="text-emerald-400 font-bold">{activeProbe.status}</span>
                  </div>
                  <p className="text-white font-medium">{activeProbe.name}</p>
                  <p className="text-[#ffd23f] text-[11px]">{activeProbe.spec}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-16 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-5xl font-extrabold text-[#f5603a] font-mono">200+</div>
            <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Student Projects Guided</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-extrabold text-white font-mono">10+</div>
            <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Industry Sector Projects</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-extrabold text-[#ffd23f] font-mono">3</div>
            <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Ventures Founded</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-extrabold text-white font-mono">5+<span className="text-xl">Yrs</span></div>
            <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Tech &amp; Admin Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}
