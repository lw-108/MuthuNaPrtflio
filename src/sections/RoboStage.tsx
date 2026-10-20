import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer.js";

/* ════════════════════════════════════════════════════════════════
   HOVER STORIES: placeholder text, replace with your own words.
   ════════════════════════════════════════════════════════════════ */
export const STORIES: Record<string, { title: string; text: string }> = {
  kid: {
    title: "Hi, I'm the little one",
    text: "I learned to balance on two legs before I learned to stop saying hello. Come back any time and I'll wave again.",
  },
  dog: {
    title: "Still chasing",
    text: "Four legs and one very patient control loop. I have never caught the ball, and I have decided that is the best part of the game.",
  },
  rover: {
    title: "Always exploring",
    text: "Four wheels and one camera. I map new places on my own, and every time I pass the middle I stop to check who is watching.",
  },
  saw: {
    title: "Clean cuts",
    text: "Six joints and one saw. I cut every plank to the same length, every time, and I never ask for a break.",
  },
};

/* the kid's words (shown in the compact thought cloud) */
const ACT_TEXT: Record<string, string> = {
  wave: "Hi!", walk: "Stroll time", think: "Hmm…", run: "Zoom zoom!", catch: "Phew…",
  jump: "Yay!!", meditate: "Ommm…", dance: "La la la", nap: "Zzz…",
};

/* ───────────────────────── look & feel ───────────────────────── */
type V3 = [number, number, number];
const WHITE = 0xffffff;
const ACCENT = 0xffd23f; // yellow sensor colour

const mk = (c: number, o: number, w: number) =>
  new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o, linewidth: w });
const M = {
  line: mk(WHITE, 0.96, 1.3),
  dim: mk(WHITE, 0.5, 1),
  faint: mk(WHITE, 0.22, 1),
  accent: mk(ACCENT, 1, 1.6),
};

/* ───────────────────────── tiny helpers ───────────────────────── */
const ease = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const angDiff = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function add<T extends THREE.Object3D>(p: THREE.Object3D, o: T, x = 0, y = 0, z = 0): T {
  o.position.set(x, y, z);
  p.add(o);
  return o;
}
function seg(pts: number[], m: THREE.LineBasicMaterial) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(g, m);
}
function edges(g: THREE.BufferGeometry, m = M.line, angle = 20) {
  const o = new THREE.LineSegments(new THREE.EdgesGeometry(g, angle), m);
  g.dispose();
  return o;
}
const box = (w: number, h: number, d: number, m = M.line) => edges(new THREE.BoxGeometry(w, h, d), m);
function cyl(r: number, h: number, n = 16, m = M.line, axis: "x" | "y" | "z" = "y") {
  const g = new THREE.CylinderGeometry(r, r, h, n);
  if (axis === "z") g.rotateX(Math.PI / 2);
  if (axis === "x") g.rotateZ(Math.PI / 2);
  return edges(g, m, 12);
}
function circ(r: number, n = 24, m = M.line, pl: "xz" | "xy" | "yz" = "xz") {
  const p: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, b = ((i + 1) / n) * Math.PI * 2;
    const A = [Math.cos(a) * r, Math.sin(a) * r], B = [Math.cos(b) * r, Math.sin(b) * r];
    if (pl === "xz") p.push(A[0], 0, A[1], B[0], 0, B[1]);
    else if (pl === "xy") p.push(A[0], A[1], 0, B[0], B[1], 0);
    else p.push(0, A[0], A[1], 0, B[0], B[1]);
  }
  return seg(p, m);
}
/** Square lattice beam along +Y: chords + rings + zig-zag bracing. */
function truss(len: number, w: number, bays: number, m = M.line) {
  const p: number[] = [], h = w / 2;
  const c = [[-h, -h], [h, -h], [h, h], [-h, h]];
  const s = (a: number[], b: number[]) => p.push(...a, ...b);
  for (let i = 0; i < 4; i++) s([c[i][0], 0, c[i][1]], [c[i][0], len, c[i][1]]);
  for (let k = 0; k <= bays; k++) {
    const y = (len * k) / bays;
    for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4]; s([a[0], y, a[1]], [b[0], y, b[1]]); }
  }
  for (let k = 0; k < bays; k++) {
    const y0 = (len * k) / bays, y1 = (len * (k + 1)) / bays;
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4];
      if ((k + i) % 2 === 0) s([a[0], y0, a[1]], [b[0], y1, b[1]]);
      else s([a[0], y1, a[1]], [b[0], y0, b[1]]);
    }
  }
  return seg(p, m);
}
/** Wireframe rover wheel: rim, spokes, hub and tread ticks. Axle = X. */
function wheel(r: number, w: number) {
  const g = new THREE.Group();
  g.add(cyl(r, w, 20, M.line, "x"));
  g.add(cyl(r * 0.32, w * 1.2, 10, M.accent, "x"));
  const p: number[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    for (const x of [-w / 2, w / 2]) p.push(x, c * r * 0.32, s * r * 0.32, x, c * r, s * r);
  }
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2, c = Math.cos(a) * r * 1.1, s = Math.sin(a) * r * 1.1;
    p.push(-w / 2, c, s, w / 2, c, s);
  }
  g.add(seg(p, M.dim));
  return g;
}
/** Toothed circular saw blade, disc in the YZ plane (axle = X). */
function sawBlade(R: number) {
  const g = new THREE.Group();
  const n = 26, p: number[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 0.5) / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2;
    const r0 = R * 0.86;
    p.push(0, Math.cos(a0) * r0, Math.sin(a0) * r0, 0, Math.cos(a1) * R, Math.sin(a1) * R);
    p.push(0, Math.cos(a1) * R, Math.sin(a1) * R, 0, Math.cos(a2) * r0, Math.sin(a2) * r0);
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    p.push(0, Math.cos(a) * R * 0.3, Math.sin(a) * R * 0.3, 0, Math.cos(a) * R * 0.84, Math.sin(a) * R * 0.84);
  }
  g.add(seg(p, M.line));
  g.add(circ(R * 0.3, 14, M.dim, "yz"));
  g.add(cyl(0.05, 0.14, 8, M.accent, "x"));
  return g;
}

/* ───────────────────────── types ───────────────────────── */
interface Pose { x: number; z: number; hd: number }
interface Ctx { cam: THREE.Vector3; halfW: number }
interface Bot {
  id: string; group: THREE.Group;
  hb: { c: V3; s: V3 };            // hover hit-box (centre + half-size) in the robot's local space
  k: number; poke: number;         // k: 0 working → 1 telling its story · poke: click flourish
  home?: { x: number };
  act?: string; top?: number;      // kid only: current activity + head height (for the thought cloud)
  update: (t: number, dt: number, c: Ctx) => void;
}
interface SceneDef {
  root: THREE.Group; bots: Bot[]; ctx: Ctx; warm: number;
  cam: { dir: V3; look: V3; fitW: number; fitH: number; fov: number };
  onFit?: (halfW: number) => void;
  anchor?: () => THREE.Vector3;
}

/* ═════════════════════════ ROBOT KID (left, lives a little life) ═════════════════════════ */
type KidAct = "wave" | "walk" | "think" | "run" | "catch" | "jump" | "meditate" | "dance" | "nap";
/** The kid's day. `d` = seconds the act lasts; `mv` = travels across the stage (and out of it) while doing it. */
const KID_SEQ: { n: KidAct; d: number; mv?: "walk" | "run" }[] = [
  { n: "wave", d: 6 },
  { n: "walk", d: 20, mv: "walk" },
  { n: "think", d: 25 },
  { n: "run", d: 10, mv: "run" },       // 24 s of running in total,
  { n: "catch", d: 4 },                 // with a 4 s breather after every 10 s
  { n: "run", d: 10, mv: "run" },
  { n: "catch", d: 4 },
  { n: "run", d: 4, mv: "run" },
  { n: "jump", d: 15 },
  { n: "meditate", d: 28 },
  { n: "dance", d: 20 },
  { n: "nap", d: 22 },
];

/** Joint targets. Arrays are [left, right]. asz = arm outward angle, aez = elbow inward bend. */
interface KPose {
  asz: number[]; asx: number[]; aez: number[]; aex: number[];
  hip: number[]; knee: number[]; splay: number[];
  bodyY: number; lean: number; hx: number; hy: number; hz: number; ry: number;
}
const kBase = (): KPose => ({
  asz: [0.12, 0.12], asx: [0, 0], aez: [0, 0], aex: [-0.1, -0.1],
  hip: [0, 0], knee: [0, 0], splay: [0, 0],
  bodyY: 0.69, lean: 0, hx: 0, hy: 0, hz: 0, ry: 0.3,
});
const kMix = (a: KPose, b: KPose, k: number): KPose => {
  const o: any = kBase();
  (Object.keys(o) as (keyof KPose)[]).forEach((key) => {
    const x: any = a[key], y: any = b[key];
    o[key] = Array.isArray(x) ? x.map((v: number, i: number) => lerp(v, y[i], k)) : lerp(x, y, k);
  });
  return o as KPose;
};
const kSmooth = (c: KPose, t: KPose, k: number) => {
  const cc: any = c, tt: any = t;
  (Object.keys(cc) as string[]).forEach((key) => {
    if (Array.isArray(cc[key])) cc[key].forEach((_: number, i: number) => (cc[key][i] += (tt[key][i] - cc[key][i]) * k));
    else cc[key] += (tt[key] - cc[key]) * k;
  });
};

/** Target pose for one activity. `at` = seconds into the act, `d` = its length, `g` = gait phase. */
function kidPose(act: KidAct, t: number, at: number, d: number, g: number, dir: number) {
  const p = kBase();
  const w = Math.sin(t * 7);
  let hop = 0, spin = 0, lev = 0, stool = false, closed = false;
  switch (act) {
    case "wave":
      p.asz[1] = 2.35 + 0.22 * w; p.aez[1] = -0.55 * w; p.hz = Math.sin(t * 1.5) * 0.08;
      break;
    case "walk": {
      const sw = Math.sin(g);
      p.hip = [sw * 0.6, -sw * 0.6];
      p.knee = [Math.max(0, -Math.cos(g)) * 0.7, Math.max(0, Math.cos(g)) * 0.7];
      p.asx = [-sw * 0.5, sw * 0.5]; p.aex = [-0.3, -0.3];
      p.bodyY = 0.69 + Math.abs(sw) * 0.03; p.ry = dir * 1.35; p.hz = Math.sin(g) * 0.03;
      break;
    }
    case "run": {
      const sw = Math.sin(g);
      p.hip = [sw * 1.1, -sw * 1.1];
      p.knee = [Math.max(0, -Math.cos(g)) * 1.5, Math.max(0, Math.cos(g)) * 1.5];
      p.asx = [-sw * 1.0, sw * 1.0]; p.aex = [-1.2, -1.2];
      p.bodyY = 0.69 + Math.abs(sw) * 0.1; p.lean = 0.22; p.hx = -0.12; p.ry = dir * 1.35;
      break;
    }
    case "catch": {                                  // hands on knees, panting
      const br = Math.sin(t * 5);
      p.hip = [0.1, 0.1]; p.knee = [0.25, 0.25];
      p.asx = [-0.15, -0.15]; p.aex = [-0.1, -0.1]; p.asz = [0.25, 0.25];
      p.lean = 0.5 + br * 0.05; p.hx = -0.25; p.bodyY = 0.66 + br * 0.015; p.ry = 0.3;
      break;
    }
    case "jump": {                                   // jumping for joy, with a twirl
      const env = Math.min(1, at * 3, (d - at) * 3);
      hop = Math.abs(Math.sin(at * 5.2)) * 0.75 * env;
      const air = Math.min(1, hop / 0.35);
      p.asz = [2.7 + Math.sin(t * 9) * 0.25, 2.7 - Math.sin(t * 9) * 0.25];
      p.aez = [-0.3 * w, 0.3 * w];
      p.hip = [-air * 1.1, -air * 1.1]; p.knee = [air * 1.7, air * 1.7];
      p.hz = Math.sin(t * 5) * 0.12; p.ry = 0.1;
      const ph = at % 2.4;
      spin = env > 0.5 && ph > 1.2 ? ease(clamp((ph - 1.2) / 1.0, 0, 1)) * Math.PI * 2 : 0;
      break;
    }
    case "meditate": {                               // lotus pose, then levitates
      const up = ease(clamp((at - 0.9) / 1.2, 0, 1)) * ease(clamp((d - at) / 1.0, 0, 1));
      lev = up;
      p.hip = [-1.45, -1.45]; p.knee = [2.5, 2.5]; p.splay = [0.5, 0.5];
      p.asx = [-0.7, -0.7]; p.aex = [-0.35, -0.35]; p.asz = [0.3, 0.3];
      p.bodyY = 0.34 + up * (0.5 + 0.07 * Math.sin(t * 2));
      p.ry = 0.1; closed = true;
      break;
    }
    case "think": {                                  // like The Thinker
      stool = true;
      p.hip = [-1.5, -1.5]; p.knee = [1.5, 1.5]; p.splay = [0.1, 0.1];
      p.bodyY = 0.36; p.lean = 0.14; p.hx = 0.35 + Math.sin(t * 0.8) * 0.04; p.hz = -0.06; p.ry = 0.7;
      p.asx = [-0.5, -0.9]; p.aex = [-0.4, -2.3]; p.asz = [0.1, -0.3]; p.aez = [0, 0.3];
      break;
    }
    case "dance": {
      const s = Math.sin(t * 6);
      hop = Math.abs(s) * 0.12;
      p.asz = [1.6 + s * 0.9, 1.6 - s * 0.9]; p.aez = [0.4 * s, -0.4 * s];
      p.hip = [s * 0.3, -s * 0.3]; p.knee = [Math.max(0, s) * 0.5, Math.max(0, -s) * 0.5];
      p.hz = s * 0.15; p.ry = 0.3 + Math.sin(t * 3) * 0.6;
      break;
    }
    case "nap":                                      // sits on the ground and dozes off
      p.hip = [-1.5, -1.5]; p.knee = [0.1, 0.1]; p.splay = [0.12, 0.12];
      p.bodyY = 0.17; p.hx = 0.5 + Math.sin(t * 1.2) * 0.05; p.hz = Math.sin(t * 0.7) * 0.1;
      p.asx = [-0.3, -0.3]; p.asz = [0.25, 0.25]; p.ry = 0.2; closed = true;
      break;
  }
  return { p, hop, spin, lev, stool, closed };
}

function buildKid(): Bot {
  const group = new THREE.Group();
  const home = { x: -2 };
  const body = add(group, new THREE.Group(), 0, 0.69, 0);
  const legs: { hip: THREE.Group; knee: THREE.Group }[] = [];
  [-1, 1].forEach((s) => {
    const hip = add(body, new THREE.Group(), s * 0.15, 0, 0);
    add(hip, cyl(0.07, 0.17, 10, M.line, "x"));
    add(hip, box(0.13, 0.32, 0.13), 0, -0.16, 0);
    const knee = add(hip, new THREE.Group(), 0, -0.32, 0);
    add(knee, cyl(0.06, 0.15, 10, M.dim, "x"));
    add(knee, box(0.11, 0.28, 0.11), 0, -0.15, 0);
    add(knee, box(0.17, 0.07, 0.3), 0, -0.33, 0.06);
    legs.push({ hip, knee });
  });
  add(body, box(0.46, 0.14, 0.28), 0, 0.07, 0);
  add(body, box(0.5, 0.56, 0.32), 0, 0.42, 0);
  add(body, box(0.34, 0.3, 0.02, M.dim), 0, 0.45, 0.17);
  add(body, cyl(0.05, 0.04, 8, M.accent, "z"), 0, 0.45, 0.19);
  body.add(seg([-0.25, 0.14, 0.165, 0.25, 0.7, 0.165, 0.25, 0.14, 0.165, -0.25, 0.7, 0.165], M.faint));
  add(body, cyl(0.07, 0.08, 8, M.dim), 0, 0.74, 0);

  const head = add(body, new THREE.Group(), 0, 0.78, 0);
  add(head, box(0.52, 0.4, 0.42), 0, 0.2, 0);
  const eyes: THREE.Object3D[] = [];
  [-1, 1].forEach((s) => {
    eyes.push(add(head, circ(0.065, 12, M.line, "xy"), s * 0.13, 0.23, 0.215));
    eyes.push(add(head, circ(0.025, 8, M.accent, "xy"), s * 0.13, 0.23, 0.216));
    add(head, cyl(0.08, 0.06, 8, M.dim, "x"), s * 0.29, 0.2, 0);
  });
  head.add(seg([-0.07, 0.1, 0.215, 0.07, 0.1, 0.215], M.dim));
  head.add(seg([0, 0.4, 0, 0, 0.55, 0], M.line));
  const ant = add(head, edges(new THREE.IcosahedronGeometry(0.045, 0), M.accent, 1), 0, 0.58, 0);

  const arms: { sh: THREE.Group; el: THREE.Group; s: number }[] = [];
  [-1, 1].forEach((s) => {
    const shd = add(body, new THREE.Group(), s * 0.35, 0.62, 0);
    add(shd, cyl(0.06, 0.12, 10, M.dim, "x"));
    add(shd, box(0.11, 0.28, 0.11), 0, -0.15, 0);
    const el = add(shd, new THREE.Group(), 0, -0.3, 0);
    add(el, box(0.1, 0.24, 0.1), 0, -0.13, 0);
    add(el, edges(new THREE.IcosahedronGeometry(0.06, 0), M.line, 1), 0, -0.29, 0);
    arms.push({ sh: shd, el, s });
  });

  // props: a stool for thinking, a glow ring + orbiting sparks for levitating
  const stoolMesh = add(group, box(0.7, 0.36, 0.55), 0, 0.18, 0.15);
  stoolMesh.visible = false;
  const ringMat = M.accent.clone();
  const ring = add(group, circ(1, 40, ringMat), 0, 0.02, 0);
  ring.visible = false;
  const orbs = add(group, new THREE.Group(), 0, 1, 0);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    add(orbs, edges(new THREE.IcosahedronGeometry(0.05, 0), M.accent, 1), Math.cos(a) * 0.6, (i - 1) * 0.22, Math.sin(a) * 0.6);
  }
  orbs.visible = false;

  let seq = 0, actT = 0, x = NaN, dir = 1, gait = 0, rp = 0;
  let pose: KPose | null = null;

  const bot: Bot = {
    id: "kid", group, home, k: 0, poke: 0, act: KID_SEQ[0].n, top: 2.15,
    hb: { c: [0.15, 1.0, 0], s: [0.7, 1.15, 0.5] },
    update(t, dt, c) {
      const ke = ease(bot.k), live = dt * (1 - ke);
      const edge = c.halfW + 1.3;                    // fully outside the visible stage
      if (Number.isNaN(x)) x = home.x;

      // ── what is the kid doing right now? ──
      const next = () => {
        seq = (seq + 1) % KID_SEQ.length; actT = 0; bot.act = KID_SEQ[seq].n;
        if (KID_SEQ[seq].mv) dir = -1;               // start by walking off the left edge
        else x = home.x;                             // standing acts happen at his spot
      };
      actT += live;
      const cur = KID_SEQ[seq];

      if (cur.mv) {
        const px = x;
        x += dir * (cur.mv === "run" ? 3 : 1.3) * live;
        gait += live * (cur.mv === "run" ? 13 : 7);
        // leave the stage completely, turn around off-screen, then come back in
        if (dir > 0 && x >= edge) dir = -1;
        else if (dir < 0 && x <= -edge) dir = 1;
        // when the time is up, finish the lap and stop once he is back at his spot
        if (actT >= cur.d && (px - home.x) * (x - home.x) <= 0) next();
      } else if (actT >= cur.d) next();

      const a = KID_SEQ[seq];
      const r = kidPose(a.n, t, actT, a.d, gait, dir);

      // hovering: stop, face the viewer and wave both arms
      const w = Math.sin(t * 7);
      const hov = kBase();
      hov.asz = [2.5 + w * 0.25, 2.7 + w * 0.25]; hov.aez = [-w * 0.5, -w * 0.55];
      hov.hz = 0.15; hov.hy = Math.sin(t * 3) * 0.2;
      hov.ry = Math.atan2(c.cam.x - x, c.cam.z);
      const tg = ke > 0.001 ? kMix(r.p, hov, ke) : r.p;
      if (!pose) pose = kMix(tg, tg, 0);
      else kSmooth(pose, tg, 1 - Math.exp(-dt * 12));
      const P = pose;

      arms.forEach((m) => {
        const i = m.s > 0 ? 1 : 0;
        m.sh.rotation.z = m.s * P.asz[i]; m.sh.rotation.x = P.asx[i];
        m.el.rotation.z = -m.s * P.aez[i]; m.el.rotation.x = P.aex[i];
      });
      legs.forEach((l, i) => {
        l.hip.rotation.x = P.hip[i]; l.knee.rotation.x = P.knee[i];
        l.hip.rotation.z = (i ? 1 : -1) * P.splay[i];
      });
      head.rotation.set(P.hx, P.hy, P.hz);
      body.rotation.x = P.lean;
      body.position.y = P.bodyY + Math.sin(t * 2) * 0.012;
      ant.scale.setScalar(1 + 0.3 * Math.sin(t * (3 + ke * 10)));
      const closed = r.closed && ke < 0.5;
      const bl = closed ? 0.12 : t % 3.4 > 3.25 ? 0.12 : 1;
      eyes.forEach((e) => (e.scale.y = bl));

      stoolMesh.visible = r.stool && ke < 0.3;
      const lev = r.lev * (1 - ke);
      ring.visible = lev > 0.05;
      orbs.visible = lev > 0.05;
      if (ring.visible) { rp += dt * 0.7; const s = rp % 1; ring.scale.setScalar(0.3 + s * 1.3); ringMat.opacity = (1 - s) * lev; }
      orbs.position.y = P.bodyY + 0.55;
      orbs.rotation.y += dt * 2.2;
      orbs.scale.setScalar(Math.max(0.01, lev));

      const poke = bot.poke > 0 ? Math.sin((1 - bot.poke) * Math.PI) * 0.45 : 0;
      group.position.set(x, r.hop * (1 - ke) + poke, 0);
      group.rotation.y = P.ry + r.spin * (1 - ke);
      bot.top = P.bodyY + 1.46;
    },
  };
  return bot;
}

/* ═════════════════════════ ROBOT DOG (top right, chases the ball) ═════════════════════════ */
function buildDog(ball: THREE.Group): Bot {
  const group = new THREE.Group();
  const body = add(group, new THREE.Group(), 0, 0.68, 0);
  const tr = truss(0.9, 0.22, 5);
  tr.rotation.x = Math.PI / 2;
  add(body, tr, 0, 0, -0.45);
  add(body, box(0.32, 0.28, 0.3), 0, 0, 0.38);
  add(body, box(0.28, 0.24, 0.26), 0, 0, -0.4);
  add(body, box(0.2, 0.05, 0.5, M.dim), 0, 0.14, -0.02);
  add(body, cyl(0.06, 0.05, 10, M.accent), 0, 0.19, 0.12);
  body.add(seg([-0.11, 0.11, -0.45, 0.11, 0.11, 0.45, 0.11, 0.11, -0.45, -0.11, 0.11, 0.45], M.faint));

  const neck = add(body, new THREE.Group(), 0, 0.1, 0.5);
  neck.rotation.x = 0.9;
  add(neck, box(0.14, 0.28, 0.14), 0, 0.14, 0);
  const head = add(neck, new THREE.Group(), 0, 0.28, 0.02);
  head.rotation.x = -0.9;
  add(head, box(0.26, 0.22, 0.28), 0, 0.02, 0.06);
  add(head, box(0.15, 0.12, 0.2), 0, -0.04, 0.3);
  add(head, cyl(0.035, 0.05, 8, M.accent, "z"), 0, -0.01, 0.42);
  head.add(seg([0, 0.13, 0, 0, 0.26, -0.02], M.line));
  add(head, edges(new THREE.IcosahedronGeometry(0.03, 0), M.accent, 1), 0, 0.28, -0.02);
  const ears: { g: THREE.Group; s: number }[] = [];
  [-1, 1].forEach((s) => {
    add(head, circ(0.04, 10, M.accent, "xy"), s * 0.08, 0.07, 0.205);
    const ear = add(head, new THREE.Group(), s * 0.14, 0.12, -0.02);
    add(ear, box(0.04, 0.16, 0.09), s * 0.03, 0.08, 0);
    ears.push({ g: ear, s });
  });

  const legs: { hip: THREE.Group; knee: THREE.Group; front: boolean; s: number }[] = [];
  ([[-1, 0.36, true], [1, 0.36, true], [-1, -0.36, false], [1, -0.36, false]] as [number, number, boolean][]).forEach(([s, z, front]) => {
    const hip = add(body, new THREE.Group(), s * 0.15, -0.1, z);
    add(hip, cyl(0.055, 0.1, 8, M.dim, "x"));
    add(hip, box(0.07, 0.29, 0.07), 0, -0.145, 0);
    const knee = add(hip, new THREE.Group(), 0, -0.29, 0);
    add(knee, cyl(0.045, 0.09, 8, M.dim, "x"));
    add(knee, box(0.06, 0.27, 0.06), 0, -0.135, 0);
    add(knee, box(0.09, 0.05, 0.15), 0, -0.275, 0.03);
    legs.push({ hip, knee, front, s });
  });

  const tailYaw = add(body, new THREE.Group(), 0, 0.06, -0.52);
  const tailTilt = add(tailYaw, new THREE.Group());
  tailTilt.rotation.x = -1.0;
  add(tailTilt, box(0.04, 0.3, 0.04), 0, 0.15, 0);
  add(tailTilt, edges(new THREE.IcosahedronGeometry(0.04, 0), M.accent, 1), 0, 0.32, 0);

  ball.add(edges(new THREE.IcosahedronGeometry(0.18, 1), M.accent, 1));

  let phase: "run" | "wait" = "run";
  let dir = 1, tau = 0, wait = 0, gait = 0, ballRot = 0, dogX = -50;

  const bot: Bot = {
    id: "dog", group, k: 0, poke: 0,
    hb: { c: [0, 0.55, 0.15], s: [0.5, 0.65, 0.95] },
    update(t, dt, c) {
      const ke = ease(bot.k), mv = 1 - ke, live = dt * mv;
      const VB = Math.max(2.2, c.halfW * 0.6);   // ball speed scales with the stage width
      const E = c.halfW + 1.3;
      if (phase === "run") tau += live;
      else { wait -= dt; if (wait <= 0) { phase = "run"; dir = -dir; tau = 0; } }

      // the ball always leads; the dog trails it but never quite catches it
      const bx = dir > 0 ? -E + VB * tau : E - VB * tau;
      const gap = 1.75 + 0.35 * Math.sin(tau * 2.3);
      dogX = bx - dir * gap;
      if (phase === "run" && dir * dogX > c.halfW + 1.9) { phase = "wait"; wait = 0.8; }

      gait += live * 11;
      ballRot -= (dir * VB * live) / 0.18;
      ball.position.set(bx, 0.18 + 0.34 * Math.abs(Math.sin(tau * 4.6)) * mv, 0);
      ball.rotation.z = ballRot;

      legs.forEach((l) => {
        const p = gait + (l.front ? 0 : 1.1) + (l.s > 0 ? 0.35 : 0);
        let hip = Math.sin(p) * 0.8 * mv, knee = Math.max(0, -Math.cos(p)) * 1.1 * mv;
        if (l.front && l.s > 0) { hip = lerp(hip, -1.7, ke); knee = lerp(knee, 0.6 + Math.sin(t * 9) * 0.4, ke); } // paw wave
        l.hip.rotation.x = hip; l.knee.rotation.x = knee;
      });
      body.position.y = 0.68 + Math.abs(Math.sin(gait)) * 0.05 * mv;
      body.rotation.x = Math.sin(gait + 0.6) * 0.07 * mv;
      neck.rotation.x = 0.9 + Math.sin(gait) * 0.08 * mv - ke * Math.abs(Math.sin(t * 6)) * 0.12;
      head.rotation.z = ke * 0.25 + Math.sin(t * 4) * 0.03;
      ears.forEach((e) => (e.g.rotation.z = e.s * (0.3 + Math.sin(gait + 1) * 0.25 * mv + ke * 0.1)));
      tailYaw.rotation.y = Math.sin(t * (7 + ke * 14)) * 0.55;

      const hd = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const face = Math.atan2(c.cam.x - dogX, c.cam.z);
      group.position.set(dogX, bot.poke > 0 ? Math.sin((1 - bot.poke) * Math.PI) * 0.4 : 0, 0);
      group.rotation.y = hd + angDiff(hd, face) * ke;
    },
  };
  return bot;
}

/* ═════════════════════════ ROVER (bottom, roams the full width) ═════════════════════════ */
function buildRover(): Bot {
  const group = new THREE.Group();
  const ch = add(group, new THREE.Group());
  const wheels: THREE.Group[] = [];
  ([[-1, 0.42], [1, 0.42], [-1, -0.42], [1, -0.42]] as [number, number][]).forEach(([sx, z]) => {
    wheels.push(add(ch, wheel(0.25, 0.16), sx * 0.38, 0.25, z));
    ch.add(seg([sx * 0.2, 0.46, z * 0.55, sx * 0.31, 0.25, z], M.dim));
  });
  const tr = truss(1.0, 0.38, 6);
  tr.rotation.x = Math.PI / 2;
  add(ch, tr, 0, 0.45, -0.5);
  add(ch, box(0.58, 0.05, 1.08), 0, 0.66, 0);
  add(ch, box(0.34, 0.14, 0.5, M.dim), 0, 0.75, -0.15);
  add(ch, box(0.5, 0.08, 0.06), 0, 0.3, 0.56);
  add(ch, truss(0.42, 0.07, 3), 0, 0.68, 0.32);
  const head = add(ch, new THREE.Group(), 0, 1.1, 0.32);
  add(head, box(0.28, 0.3, 0.22, M.accent), 0, 0.15, 0);
  add(head, cyl(0.07, 0.1, 12, M.accent, "z"), 0, 0.16, 0.15);
  head.add(seg([0.12, 0.3, -0.05, 0.12, 0.55, -0.05], M.line));
  const ringMat = M.accent.clone();
  const ring = add(group, circ(1, 40, ringMat), 0, 0.02, 0);
  ring.visible = false;

  const SP = 2.4;
  const st: Pose = { x: -30, z: 0, hd: Math.PI / 2 };
  let phase: "drive" | "brake" | "turn" | "tilt" | "back" | "wait" = "drive";
  let dir = 1, spd = 0, timer = 0, passStopped = false, init = false, tiltV = 0, scanK = 1, rp = 0;

  const bot: Bot = {
    id: "rover", group, k: 0, poke: 0,
    hb: { c: [0, 0.78, 0], s: [0.5, 0.85, 0.7] },
    update(t, dt, c) {
      const ke = ease(bot.k), live = dt * (1 - ke);
      const edge = c.halfW + 1.5;
      if (!init) { st.x = -edge; init = true; }
      const want = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      let tiltTarget = 0;

      switch (phase) {
        case "drive":
          spd = Math.min(SP, spd + 3 * live);
          st.hd += angDiff(st.hd, want) * Math.min(1, live * 6);
          st.x += dir * spd * live;
          if (!passStopped && dir * st.x >= 0) phase = "brake";          // reached the middle
          else if (dir * st.x > edge) { phase = "wait"; timer = 0.9; }   // left the section
          break;
        case "brake":
          spd = Math.max(0, spd - 4.5 * live);
          st.x += dir * spd * live;
          if (spd <= 0.001) phase = "turn";
          break;
        case "turn":                                                      // turn to the camera
          st.hd += angDiff(st.hd, 0) * Math.min(1, live * 3.5);
          if (Math.abs(angDiff(st.hd, 0)) < 0.04) { phase = "tilt"; timer = 2.4; }
          break;
        case "tilt": {                                                    // tilt head, then look normally
          timer -= live;
          const u = clamp(1 - timer / 2.4, 0, 1);
          tiltTarget = u < 0.25 ? ease(u / 0.25) : u < 0.7 ? 1 : 1 - ease((u - 0.7) / 0.3);
          if (timer <= 0) phase = "back";
          break;
        }
        case "back":
          st.hd += angDiff(st.hd, want) * Math.min(1, live * 3.5);
          if (Math.abs(angDiff(st.hd, want)) < 0.04) { phase = "drive"; passStopped = true; }
          break;
        case "wait":                                                      // off-screen: turn around, come back
          timer -= dt;
          if (timer <= 0) {
            dir = -dir; passStopped = false; spd = 0;
            st.hd = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
            phase = "drive";
          }
          break;
      }

      wheels.forEach((w) => (w.rotation.x += (spd * live) / 0.25));
      scanK += ((phase === "drive" || phase === "brake" ? 1 : 0) - scanK) * Math.min(1, dt * 4);
      tiltV += (tiltTarget * 0.5 + ke * 0.3 * Math.sin(t * 3) - tiltV) * Math.min(1, dt * 10);
      head.rotation.y = Math.sin(t * 1.3) * 0.9 * scanK * (1 - ke);
      head.rotation.z = tiltV;
      head.rotation.x = ke * Math.sin(t * 4) * 0.08;
      ring.visible = ke > 0.1;
      if (ring.visible) { rp += dt * 0.9; const s = rp % 1; ring.scale.setScalar(0.3 + s * 1.8); ringMat.opacity = (1 - s) * ke; }

      group.position.set(st.x, 0, st.z);
      group.rotation.y = st.hd + angDiff(st.hd, 0) * ke + (bot.poke > 0 ? ease(1 - bot.poke) * Math.PI * 2 : 0);
    },
  };
  return bot;
}

/* ═════════════════════════ ROBOTIC ARM (bottom right, cuts a plank) ═════════════════════════ */
const SAW_KEYS: { d: number; p: V3 }[] = [
  { d: 1.4, p: [1.4, 0.92, -0.52] },  // move over the plank
  { d: 0.5, p: [1.4, 0.56, -0.52] },  // plunge beside it
  { d: 2.4, p: [1.4, 0.56, 0.52] },   // cut across
  { d: 0.5, p: [1.4, 0.92, 0.52] },   // lift out
];
const SAW_T = 4.8;
function sawPath(u: number): V3 {
  let acc = 0;
  for (let i = 0; i < SAW_KEYS.length; i++) {
    const k = SAW_KEYS[i];
    if (u <= acc + k.d || i === SAW_KEYS.length - 1) {
      const from = SAW_KEYS[(i + SAW_KEYS.length - 1) % SAW_KEYS.length].p;
      const s = ease(clamp((u - acc) / k.d, 0, 1));
      return [lerp(from[0], k.p[0], s), lerp(from[1], k.p[1], s), lerp(from[2], k.p[2], s)];
    }
    acc += k.d;
  }
  return SAW_KEYS[0].p;
}

function buildSaw(): Bot {
  const L1 = 1.1, L2 = 1.05, TOOL = 0.42, SH = 0.85, R = 0.22;
  const group = new THREE.Group();

  add(group, cyl(0.64, 0.2, 24), 0, 0.1, 0);
  add(group, cyl(0.46, 0.1, 20, M.dim), 0, 0.25, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    add(group, cyl(0.045, 0.06, 6, M.dim), Math.cos(a) * 0.55, 0.22, Math.sin(a) * 0.55);
  }
  const yaw = add(group, new THREE.Group(), 0, 0.3, 0);
  add(yaw, cyl(0.34, 0.5, 18), 0, 0.25, 0);
  add(yaw, box(0.46, 0.46, 0.66), 0, 0.55, 0);
  const sh = add(yaw, new THREE.Group(), 0, SH - 0.3, 0);
  add(sh, cyl(0.25, 0.82, 16, M.line, "z"));
  add(sh, cyl(0.1, 0.9, 10, M.accent, "z"));
  add(sh, truss(L1, 0.26, 5));
  const el = add(sh, new THREE.Group(), 0, L1, 0);
  add(el, cyl(0.2, 0.54, 16, M.line, "z"));
  add(el, cyl(0.08, 0.6, 10, M.accent, "z"));
  add(el, truss(L2, 0.2, 5));
  const wr = add(el, new THREE.Group(), 0, L2, 0);
  add(wr, cyl(0.12, 0.34, 12, M.line, "z"));
  add(wr, box(0.26, 0.16, 0.22), 0, 0.12, 0);
  add(wr, cyl(0.035, 0.22, 6, M.dim), 0, 0.31, 0);

  // saw blade + guard follow the tool point but keep a fixed orientation
  const blade = sawBlade(R);
  group.add(blade);
  const guard = new THREE.Group();
  group.add(guard);
  {
    const p: number[] = [], n = 14, r = R * 1.1;
    for (const x of [-0.05, 0.05]) {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI, b = ((i + 1) / n) * Math.PI;
        p.push(x, Math.sin(a) * r, Math.cos(a) * r, x, Math.sin(b) * r, Math.cos(b) * r);
      }
    }
    p.push(-0.05, 0, r, 0.05, 0, r, -0.05, 0, -r, 0.05, 0, -r);
    guard.add(seg(p, M.dim));
  }

  // workbench + plank
  group.add(seg([0.35, 0.36, -0.4, 1.25, 0.36, -0.4, 1.25, 0.36, 0.4, 0.35, 0.36, 0.4, 0.35, 0.36, -0.4], M.dim));
  add(group, box(0.9, 0.05, 0.8), 0.8, 0.335, 0);
  for (const x of [0.42, 1.18]) for (const z of [-0.33, 0.33]) add(group, box(0.06, 0.31, 0.06), x, 0.155, z);
  group.add(seg([0.42, 0.1, -0.33, 0.42, 0.1, 0.33, 1.18, 0.1, -0.33, 1.18, 0.1, 0.33], M.faint));
  add(group, box(0.9, 0.1, 0.5), 0.95, 0.41, 0);
  group.add(seg([0.5, 0.462, -0.12, 1.4, 0.462, -0.12, 0.5, 0.462, 0.12, 1.4, 0.462, 0.12, 1.4, 0.463, -0.25, 1.4, 0.463, 0.25], M.dim));
  const piece = add(group, new THREE.Group(), 1.4, 0, 0);
  add(piece, box(0.4, 0.1, 0.5), 0.2, 0.41, 0);
  piece.add(seg([0, 0.462, -0.12, 0.4, 0.462, -0.12, 0, 0.462, 0.12, 0.4, 0.462, 0.12], M.dim));

  // sawdust sparks
  const sp = new Float32Array(8 * 6);
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const spark = new THREE.LineSegments(sg, M.line);
  spark.frustumCulled = false;
  spark.visible = false;
  group.add(spark);

  const STORY: V3 = [1.1, 1.6, 0.6];
  let clock = 0;
  const SPEED = 0.75;

  const solve = (x: number, y: number, z: number) => {
    yaw.rotation.y = Math.atan2(-z, x);
    const r = Math.hypot(x, z), yy = y + TOOL - SH;
    const d = clamp(Math.hypot(r, yy), Math.abs(L1 - L2) + 0.05, L1 + L2 - 0.02);
    const a = Math.atan2(yy, r) + Math.acos((d * d + L1 * L1 - L2 * L2) / (2 * d * L1));
    sh.rotation.z = a - Math.PI / 2;
    const b = Math.atan2(yy - L1 * Math.sin(a), r - L1 * Math.cos(a));
    el.rotation.z = b - a;
    wr.rotation.z = -Math.PI / 2 - b;
  };

  const bot: Bot = {
    id: "saw", group, k: 0, poke: 0,
    hb: { c: [0.65, 0.9, 0], s: [1.35, 1.0, 0.8] },
    update(_t, dt) {
      const ke = ease(bot.k);
      clock += dt * (1 - ke) * SPEED;                     // work pauses while it tells its story
      const u = clock % SAW_T;
      const p = sawPath(u);
      const bounce = bot.poke > 0 ? Math.sin((1 - bot.poke) * Math.PI) * 0.3 : 0;
      const px = lerp(p[0], STORY[0], ke), py = lerp(p[1], STORY[1], ke) + bounce, pz = lerp(p[2], STORY[2], ke);
      solve(px, py, pz);

      const cutting = u > 1.9 && u < 3.6;
      blade.rotation.x -= dt * lerp(cutting ? 34 : 9, 26, ke);
      blade.position.set(px, py, pz);
      guard.position.set(px, py, pz);

      // the off-cut: falls after the cut, shrinks away, a new plank end grows back
      let sc = 1, fall = 0;
      if (u < 0.5) { sc = 1 - ease(u / 0.5); fall = 1; }
      else if (u < 1.2) sc = ease((u - 0.5) / 0.7);
      else if (u >= 3.5) fall = clamp((u - 3.5) / 0.4, 0, 1);
      piece.visible = sc > 0.01;
      if (u < 0.5) piece.scale.set(sc, sc, sc); else piece.scale.set(sc, 1, 1);
      piece.position.set(1.4 + 0.15 * fall, -0.36 * fall * fall, 0);
      piece.rotation.z = -0.5 * fall;

      spark.visible = cutting && ke < 0.3 && Math.abs(pz) < 0.27;
      if (spark.visible) {
        for (let i = 0; i < 8; i++) {
          sp[i * 6] = px; sp[i * 6 + 1] = 0.47; sp[i * 6 + 2] = pz;
          sp[i * 6 + 3] = px + rand(-0.25, 0.1); sp[i * 6 + 4] = 0.47 + rand(0.03, 0.3); sp[i * 6 + 5] = pz + rand(-0.3, 0.02);
        }
        (spark.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }
    },
  };
  return bot;
}

/* ───────────────────────── scenes ─────────────────────────
   cam.fitH = how many world units tall the stage shows (smaller = bigger robot).
   cam.look = point the camera aims at (its y keeps the robot's feet at the bottom edge). */
type SceneKey = "kid" | "dog" | "saw" | "rover";
const SCENES: Record<SceneKey, () => SceneDef> = {
  kid: () => {
    const root = new THREE.Group();
    const kid = buildKid();
    root.add(kid.group);
    return {
      root, bots: [kid], warm: 0,
      ctx: { cam: new THREE.Vector3(), halfW: 3 },
      cam: { dir: [0.12, 0.1, 1], look: [0, 1.78, 0], fitW: 0, fitH: 3.7, fov: 30 },
      onFit: (hw) => { kid.home!.x = -hw + 0.95; kid.group.position.x = kid.home!.x; },
      anchor: () => kid.group.localToWorld(new THREE.Vector3(0.2, kid.top ?? 2.15, 0)),
    };
  },
  dog: () => {
    const root = new THREE.Group();
    const ball = new THREE.Group();
    const dog = buildDog(ball);
    root.add(dog.group, ball);
    return {
      root, bots: [dog], warm: 1.4,
      ctx: { cam: new THREE.Vector3(), halfW: 4 },
      cam: { dir: [0, 0.12, 1], look: [0, 0.68, 0], fitW: 0, fitH: 1.45, fov: 14 },
    };
  },
  saw: () => {
    const root = new THREE.Group();
    const saw = buildSaw();
    root.add(saw.group);
    return {
      root, bots: [saw], warm: 2.6,
      ctx: { cam: new THREE.Vector3(), halfW: 2 },
      cam: { dir: [0.5, 0.35, 1], look: [0.45, 1.05, 0], fitW: 3.0, fitH: 3.0, fov: 28 },
    };
  },
  rover: () => {
    const root = new THREE.Group();
    const rover = buildRover();
    root.add(rover.group);
    return {
      root, bots: [rover], warm: 8.6,
      ctx: { cam: new THREE.Vector3(), halfW: 10 },
      cam: { dir: [0, 0.1, 1], look: [0, 0.92, 0], fitW: 0, fitH: 1.95, fov: 14 },
    };
  },
};

/* ═════════════════════════ React stage ═════════════════════════ */
interface StageProps { scene: SceneKey; className: string; tip: "above" | "below" | "left" | "right"; caption?: string }

export default function RoboStage({ scene, className, tip }: StageProps) {
  const mount = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const hoverId = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [act, setAct] = useState<string>("wave");

  /* typewriter for the story */
  useEffect(() => {
    if (!active) { setTyped(""); return; }
    const full = STORIES[active].text;
    let i = 0;
    setTyped("");
    const id = setInterval(() => { i += 2; setTyped(full.slice(0, i)); if (i >= full.length) clearInterval(id); }, 22);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    const el = mount.current!;
    const def = SCENES[scene]();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new SVGRenderer();
    renderer.setClearColor(new THREE.Color(0xffffff), 0);
    renderer.sortObjects = false;          // keeps same-style lines merged into few <path>s
    renderer.sortElements = false;
    const svgEl = renderer.domElement;
    svgEl.style.background = "transparent";
    el.appendChild(svgEl);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const scn = new THREE.Scene();
    scn.add(def.root);

    let W = 1, H = 1, dirty = true;
    const rects = def.bots.map(() => ({ l: 0, r: 0, t: 0, b: 0 }));

    /* invisible hit-boxes that follow each robot (so hover works through z-order) */
    const hits = def.bots.map((b) => {
      const d = document.createElement("div");
      d.className = "rb-hit";
      d.dataset.id = b.id;
      d.addEventListener("pointerdown", () => { b.poke = 1; dirty = true; });
      el.appendChild(d);
      return d;
    });
    const hitSet = new Set<HTMLElement>(hits);

    const setHover = (id: string | null) => {
      if (id !== hoverId.current) { hoverId.current = id; setActive(id); dirty = true; }
    };

    /* the compact cloud follows the kid's head, stays fully inside the stage,
       hides while he is off-screen and while his hover story is open */
    const placeCloud = () => {
      const cl = cloudRef.current;
      if (!def.anchor || !cl) return;
      const p = def.anchor().project(camera);
      const sx = (p.x * 0.5 + 0.5) * W, sy = (-p.y * 0.5 + 0.5) * H;
      const cw = cl.offsetWidth, ch = cl.offsetHeight;
      const inView = sx > W * 0.04 && sx < W * 0.96;
      cl.style.left = `${clamp(sx - 10, 4, Math.max(4, W - cw - 4))}px`;
      cl.style.top = `${clamp(sy - ch - 4, 2, Math.max(2, H - ch - 2))}px`;
      cl.style.opacity = inView && hoverId.current !== "kid" ? "1" : "0";
    };

    const fit = () => {
      W = el.clientWidth || 1; H = el.clientHeight || 1;
      renderer.setSize(W, H);
      camera.fov = def.cam.fov;
      camera.aspect = W / H;
      const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const dist = Math.max(def.cam.fitW / 2 / (tanH * camera.aspect), def.cam.fitH / 2 / tanH);
      const look = new THREE.Vector3(...def.cam.look);
      camera.position.copy(look).addScaledVector(new THREE.Vector3(...def.cam.dir).normalize(), dist);
      camera.lookAt(look);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      def.ctx.cam.copy(camera.position);
      def.ctx.halfW = tanH * dist * camera.aspect;   // half the visible width at the robots' plane
      def.onFit?.(def.ctx.halfW);
      scn.updateMatrixWorld(true);
      placeCloud();
      dirty = true;
    };

    const corners: V3[] = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) corners.push([sx, sy, sz]);
    const v = new THREE.Vector3();
    const measure = () => {
      def.bots.forEach((b, i) => {
        let l = 1e9, r = -1e9, t = 1e9, bt = -1e9;
        for (const [sx, sy, sz] of corners) {
          v.set(b.hb.c[0] + sx * b.hb.s[0], b.hb.c[1] + sy * b.hb.s[1], b.hb.c[2] + sz * b.hb.s[2]);
          b.group.localToWorld(v);
          v.project(camera);
          const px = (v.x * 0.5 + 0.5) * W, py = (-v.y * 0.5 + 0.5) * H;
          l = Math.min(l, px); r = Math.max(r, px); t = Math.min(t, py); bt = Math.max(bt, py);
        }
        rects[i] = { l, r, t, b: bt };
        const h = hits[i];
        h.style.transform = `translate(${l}px,${t}px)`;
        h.style.width = `${Math.max(0, r - l)}px`;
        h.style.height = `${Math.max(0, bt - t)}px`;
      });
    };

    const placeTip = () => {
      const tipEl = tipRef.current, id = hoverId.current;
      if (!tipEl || !id) return;
      const i = def.bots.findIndex((b) => b.id === id);
      if (i < 0) return;
      const q = rects[i], sr = el.getBoundingClientRect();
      const tw = tipEl.offsetWidth, th = tipEl.offsetHeight, gap = 12;
      const L = sr.left + q.l, R = sr.left + q.r, T = sr.top + q.t, B = sr.top + q.b;
      let x = (L + R) / 2 - tw / 2, y = T - th - gap;
      if (tip === "below") y = B + gap;
      else if (tip === "left") { x = L - tw - gap; y = (T + B) / 2 - th / 2; }
      else if (tip === "right") { x = R + gap; y = (T + B) / 2 - th / 2; }
      x = clamp(x, 8, window.innerWidth - tw - 8);
      y = clamp(y, 8, window.innerHeight - th - 8);
      tipEl.style.transform = `translate(${x}px,${y}px)`;
      tipEl.style.opacity = "1";
    };

    /* pointer: hover is resolved with elementFromPoint every frame, so it also works
       while a robot moves under a still cursor, and respects what is on top of it */
    const ptr = { x: 0, y: 0, on: false };
    let touchTimer = 0;
    const evalHover = () => {
      if (!ptr.on) return;
      const sr = el.getBoundingClientRect();
      let id: string | null = null;
      if (ptr.x >= sr.left && ptr.x <= sr.right && ptr.y >= sr.top && ptr.y <= sr.bottom) {
        const n = document.elementFromPoint(ptr.x, ptr.y) as HTMLElement | null;
        if (n && hitSet.has(n)) id = n.dataset.id || null;
      }
      setHover(id);
    };
    const onMove = (e: PointerEvent) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; };
    const onDown = (e: PointerEvent) => {
      onMove(e);
      if (e.pointerType === "touch") {
        clearTimeout(touchTimer);
        touchTimer = window.setTimeout(() => { ptr.on = false; setHover(null); }, 6000);
      }
    };
    const onLeave = (e: PointerEvent) => { if (e.pointerType !== "touch") { ptr.on = false; setHover(null); } };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("pointerleave", onLeave);

    /* loop (pauses when off-screen / tab hidden) */
    let raf = 0, last = performance.now(), t = 0, visible = true, lastAct = "";
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      evalHover();
      if (reduce && !dirty) { placeTip(); return; }
      dirty = false;
      const dt = reduce ? 0 : Math.min(0.05, (now - last) / 1000);
      last = now; t += dt;
      def.bots.forEach((b) => {
        const target = hoverId.current === b.id ? 1 : 0;
        b.k = reduce ? target : b.k + (target - b.k) * (1 - Math.exp(-dt * 5));
        b.poke = Math.max(0, b.poke - dt * 1.6);
      });
      def.bots.forEach((b) => b.update(t, dt, def.ctx));
      renderer.render(scn, camera);
      // SVGRenderer repaints its clear colour on every render and ignores the alpha,
      // so force the background back to transparent right after.
      svgEl.style.backgroundColor = "transparent";
      measure();
      if (scene === "kid") {
        const kb = def.bots[0];
        if (kb.act && kb.act !== lastAct) { lastAct = kb.act; setAct(kb.act); }
        placeCloud();
      }
      placeTip();
    };

    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    fit();
    if (reduce && def.warm > 0) {          // reduced motion: start from a pose where the robot is on screen
      const step = 1 / 30;
      for (let s = 0; s < def.warm; s += step) { t += step; def.bots.forEach((b) => b.update(t, step, def.ctx)); }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); clearTimeout(touchTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      scn.traverse((o) => { if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose(); });
      hits.forEach((h) => h.remove());
      renderer.domElement.remove();
      hoverId.current = null;
    };
  }, [scene, tip]);

  const story = active ? STORIES[active] : null;
  return (
    <div className={`rb-stage ${className}`}>
      <div className="rb-mount" ref={mount} />

      {scene === "kid" && (
        <div
          ref={cloudRef}
          aria-hidden="true"
          style={{
            position: "absolute", left: 0, top: 0, width: 112, height: 76,
            pointerEvents: "none", zIndex: 2, opacity: 0, transition: "opacity .25s ease",
          }}
        >
          <svg viewBox="0 0 300 200" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <g fill="#fff">
              <circle cx="70" cy="95" r="42" /><circle cx="112" cy="58" r="46" /><circle cx="170" cy="48" r="48" />
              <circle cx="228" cy="68" r="42" /><circle cx="250" cy="108" r="34" /><circle cx="205" cy="125" r="38" />
              <circle cx="140" cy="128" r="36" /><circle cx="88" cy="128" r="30" />
              <ellipse cx="160" cy="90" rx="100" ry="46" />
              <circle cx="52" cy="168" r="13" /><circle cx="28" cy="186" r="8" /><circle cx="12" cy="195" r="4.5" />
            </g>
          </svg>
          <span
            style={{
              position: "absolute", left: "12%", right: "12%", top: "8%", height: "70%",
              display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
              fontSize: 13, fontWeight: 500, lineHeight: 1.15, color: "#111", whiteSpace: "nowrap",
            }}
          >
            {ACT_TEXT[act]}
          </span>
        </div>
      )}

      {story &&
        createPortal(
          <div className="rb-tip" ref={tipRef}>
            <h4>{story.title}</h4>
            <p>
              {typed}
              <span style={{ visibility: "hidden" }}>{story.text.slice(typed.length)}</span>
            </p>
          </div>,
          document.body
        )}
    </div>
  );
}