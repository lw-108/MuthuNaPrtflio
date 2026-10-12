import { useState, useEffect, type ReactNode } from "react";
import { Cpu, Terminal, Activity, Sprout, Zap } from "lucide-react";

interface SkillCategory {
  id: string;
  title: string;
  badge: string;
  color: string;
  icon: ReactNode;
  summary: string;
  skills: { name: string; level: number; highlight: string }[];
  codeSample: { lang: string; title: string; code: string };
}

const CATEGORIES: SkillCategory[] = [
  {
    id: "robotics-embedded",
    title: "Robotics & Embedded Systems",
    badge: "HARDWARE & ARDUINO",
    color: "#f5603a",
    icon: <Cpu className="w-5 h-5 text-[#f5603a]" />,
    summary:
      "Design, electronic circuit integration, and microcontroller-based robotics development using Arduino and embedded architectures.",
    skills: [
      { name: "Arduino-Based Development", level: 98, highlight: "C/C++ firmware, timer interrupts, motor drivers" },
      { name: "Microcontroller Systems", level: 95, highlight: "Microcontroller-based automation and logic control" },
      { name: "Robotics Design & Assembly", level: 96, highlight: "Kinematic articulation, chassis and link structures" },
      { name: "Electronic Circuit Integration", level: 92, highlight: "Power distribution, relays, sensor shielding, wiring" },
      { name: "Embedded Systems Development", level: 90, highlight: "Real-time sensor monitoring & actuator feedback" },
    ],
    codeSample: {
      lang: "cpp",
      title: "Arduino Robotics Motor & Sensor Control Loop",
      code: `// Multi-Sensor Obstacle Avoidance & Motor Actuation
#include <Servo.h>

const int TRIG_PIN = 9, ECHO_PIN = 10;
const int ENA = 5, IN1 = 6, IN2 = 7; // Motor Driver Pins
Servo sensorServo;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  sensorServo.attach(11);
}

long readDistance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  return pulseIn(ECHO_PIN, HIGH) * 0.034 / 2;
}`,
    },
  },
  {
    id: "iot-hardware",
    title: "IoT & Hardware Prototyping",
    badge: "SALEM IOT & SENSORS",
    color: "#ffd23f",
    icon: <Zap className="w-5 h-5 text-[#ffd23f]" />,
    summary:
      "Salem IoT project development centre: practical implementation of sensor-based systems, wireless communication, and IoT devices.",
    skills: [
      { name: "Internet of Things (IoT)", level: 96, highlight: "ESP32/ESP8266 Wi-Fi, MQTT, HTTP cloud endpoints" },
      { name: "Hardware Prototyping", level: 95, highlight: "Rapid breadboard to custom PCB and enclosure builds" },
      { name: "Sensor-Based Systems", level: 94, highlight: "Temperature, humidity, gas, ultrasonic, soil probes" },
      { name: "Wireless Control & RF", level: 92, highlight: "Bluetooth, LoRa, RF transceivers, wireless telemetry" },
      { name: "Smart Automation Systems", level: 90, highlight: "Relay control boards & automated event triggers" },
    ],
    codeSample: {
      lang: "cpp",
      title: "Salem IoT Wireless Sensor Telemetry Node",
      code: `// ESP32 Wi-Fi & MQTT Environmental Telemetry Node
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient client(espClient);

void transmitTelemetry(float temp, float humidity, int soilMoisture) {
  char payload[128];
  snprintf(payload, sizeof(payload), 
    "{\"temp\":%.1f,\"hum\":%.1f,\"soil\":%d,\"lab\":\"SalemIoT\"}",
    temp, humidity, soilMoisture);
  
  client.publish("salem_iot/telemetry/station1", payload);
}`,
    },
  },
  {
    id: "ai-software",
    title: "Artificial Intelligence & Apps",
    badge: "AI & EDTECH SOFTWARE",
    color: "#10b981",
    icon: <Terminal className="w-5 h-5 text-emerald-400" />,
    summary:
      "Smart automation concepts, educational technology, web & mobile application development, and technical problem-solving.",
    skills: [
      { name: "Artificial Intelligence Concepts", level: 90, highlight: "Smart automation models & practical decision systems" },
      { name: "Educational Technology", level: 96, highlight: "Curriculum engineering, interactive training tools" },
      { name: "Mobile & Web Applications", level: 88, highlight: "Client dashboard interfaces and control apps" },
      { name: "Animation & Visual Media", level: 86, highlight: "2D/3D concept animations for student understanding" },
      { name: "Technology Problem Solving", level: 94, highlight: "Translating customer pain points into working systems" },
    ],
    codeSample: {
      lang: "javascript",
      title: "Smart Automation Decision Logic",
      code: `// Smart Threshold Automation & Telemetry Processor
export function evaluateAutomationAction(sensorPacket) {
  const { temperature, soilMoisture, tankLevel } = sensorPacket;
  
  if (soilMoisture < 25 && tankLevel > 15) {
    return { pumpState: 'ON', durationMs: 12000, trigger: 'LOW_SOIL_MOISTURE' };
  } else if (temperature > 40) {
    return { mistState: 'ACTIVE', trigger: 'HEAT_STRESS_PROTECTION' };
  }
  return { status: 'OPTIMAL_CONDITIONS' };
}`,
    },
  },
  {
    id: "agro-geospatial",
    title: "Agriculture & Geospatial Tech",
    badge: "ACADEMIC FOUNDATION",
    color: "#a855f7",
    icon: <Sprout className="w-5 h-5 text-purple-400" />,
    summary:
      "Bachelor of Engineering in Agriculture Engineering from The Kavery College of Engineering, with expertise in agro-technology and QGIS.",
    skills: [
      { name: "Agriculture Engineering Principles", level: 96, highlight: "Soil-water dynamics, farm machinery, irrigation" },
      { name: "Agro-Technology Solutions", level: 95, highlight: "Automated farm sensing, smart drip irrigation, solar" },
      { name: "QGIS & Geospatial Analysis", level: 92, highlight: "Spatial field mapping, contouring, crop zoning" },
      { name: "Sensor-Based Precision Farming", level: 94, highlight: "NPK sensor arrays, automated soil logging" },
      { name: "Engineering Design & Modeling", level: 90, highlight: "Translating agricultural challenges into tech builds" },
    ],
    codeSample: {
      lang: "python",
      title: "QGIS Geospatial Farm Boundary & Soil Map Script",
      code: `# QGIS Python Script for Farm Spatial Field Contouring
import processing
from qgis.core import QgsVectorLayer, QgsProject

def process_field_coordinates(geojson_path):
    layer = QgsVectorLayer(geojson_path, "Farm_Zone_A", "ogr")
    if not layer.isValid():
        print("Layer loading failed")
        return
    QgsProject.instance().addMapLayer(layer)
    print(f"Layer '{layer.name()}' loaded with {layer.featureCount()} parcels.")`,
    },
  },
];

export default function SkillsMatrix() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>(CATEGORIES[0]);
  const [telemetryTick, setTelemetryTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTelemetryTick((prev) => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="skills" className="relative w-full min-h-screen bg-[#0a0605] text-white py-24 px-6 md:px-12 lg:px-20 border-t border-white/10">
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
              SECTION 03 // TECHNICAL EXPERTISE & DOMAINS
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95]">
              Multidisciplinary <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5603a] via-[#ffd23f] to-white">
                Technical Mastery.
              </span>
            </h2>
          </div>

          {/* Diagnostic Badge */}
          <div className="flex items-center gap-4 font-mono text-xs text-white/60 bg-white/[0.03] border border-white/10 p-3 rounded-xl backdrop-blur-md">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-white font-bold">SALEM IOT LAB: </span>
              <span className="text-emerald-400">ACTIVE PROTOTYPING</span>
            </div>
            <div className="hidden sm:block border-l border-white/15 pl-4">
              <span className="text-white/40">STUDENT BUILDS: </span>
              <span className="text-[#ffd23f] font-bold">200+ GUIDED</span>
            </div>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                activeCategory.id === cat.id
                  ? "bg-white/[0.08] border-[#f5603a] shadow-xl shadow-[#f5603a]/10"
                  : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded bg-black/40 border border-white/10">{cat.icon}</div>
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                  {cat.badge}
                </span>
              </div>
              <h3 className="font-extrabold text-sm md:text-base text-white uppercase tracking-tight">
                {cat.title}
              </h3>
            </button>
          ))}
        </div>

        {/* Active Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Detailed Skills with Proficiency */}
          <div className="lg:col-span-7 rounded-2xl bg-white/[0.02] border border-white/10 p-6 md:p-8 backdrop-blur-md space-y-6">
            <div>
              <div className="text-xs font-mono text-[#ffd23f] uppercase mb-1">
                // {activeCategory.badge}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
                {activeCategory.title}
              </h3>
              <p className="text-sm text-white/70 font-normal leading-relaxed">
                {activeCategory.summary}
              </p>
            </div>

            {/* Skill Level Gauges */}
            <div className="space-y-4 pt-2">
              {activeCategory.skills.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-mono">
                    <span className="font-bold text-white text-sm tracking-tight">{skill.name}</span>
                    <span className="text-[#ffd23f] font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: activeCategory.color,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-white/40 font-mono flex items-center gap-1.5">
                    <span className="text-[#f5603a]">↳</span> {skill.highlight}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Code Sample & Technical Implementation */}
          <div className="lg:col-span-5 rounded-2xl bg-black/80 border border-white/15 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2 text-white/70">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f5603a]" />
                  <span className="font-bold">{activeCategory.codeSample.title}</span>
                </div>
                <span className="text-white/40 uppercase">{activeCategory.codeSample.lang}</span>
              </div>

              <pre className="font-mono text-xs text-white/90 overflow-x-auto p-4 rounded-xl bg-white/[0.03] border border-white/10 leading-relaxed">
                <code>{activeCategory.codeSample.code}</code>
              </pre>
            </div>

            {/* Lab Telemetry Stream */}
            <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-2">
              <div className="flex justify-between text-white/50 text-[10px]">
                <span>SALEM IOT PROJECT CENTRE TELEMETRY</span>
                <span className="text-emerald-400">STATUS: ONLINE (TX: #{telemetryTick.toString().padStart(2, "0")})</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-white/[0.04] border border-white/10">
                  <div className="text-white/40 text-[9px]">ACTIVE PROJECTS</div>
                  <div className="font-bold text-white">10+ Sector Builds</div>
                </div>
                <div className="p-2.5 rounded bg-white/[0.04] border border-white/10">
                  <div className="text-white/40 text-[9px]">STUDENT MENTORSHIP</div>
                  <div className="font-bold text-emerald-400">200+ Projects</div>
                </div>
                <div className="p-2.5 rounded bg-white/[0.04] border border-white/10">
                  <div className="text-white/40 text-[9px]">ACADEMIES FOUNDED</div>
                  <div className="font-bold text-[#ffd23f]">3 Ventures</div>
                </div>
                <div className="p-2.5 rounded bg-white/[0.04] border border-white/10">
                  <div className="text-white/40 text-[9px]">OVERALL EXPERIENCE</div>
                  <div className="font-bold text-white">5+ Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
