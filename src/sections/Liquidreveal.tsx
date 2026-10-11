import { useEffect, useRef } from "react";

/**
 * LiquidReveal – fluid "splash" mask reveal
 *
 * Technique ported (to plain WebGL1) from Cullen Webber's Skeleton Fluid Reveal
 * (Codrops, "Building a Dual-Scene Fluid X-Ray Reveal Effect in Three.js"):
 *
 *  1. TRAIL   – a 2D canvas, white background, one thick round-capped black
 *               line from the previous to the current (lerped) cursor position.
 *               Its opacity rises while the cursor moves and fades when idle.
 *  2. FLUID   – ping-pong render targets. Each frame the previous frame is
 *               sampled at 5 points (centre + 4 neighbours offset by FBM noise)
 *               and the darkest value is kept, so black bleeds outward in an
 *               uneven, splashy way. The trail is min-blended in, and a little
 *               white is added back every frame so the splash slowly heals.
 *  3. COMPOSE – white = show `topSrc`, black = show `bottomSrc`.
 *
 * `topSrc` itself is never distorted. `bottomSrc` is fitted to exactly the same
 * box as `topSrc` and (optionally) clipped to its silhouette.
 * An optional auto-play "virtual cursor" sweeps over face / chest / stomach.
 */

type Props = {
  topSrc: string;
  bottomSrc: string;
  /** trail thickness as a fraction of the canvas width (bigger = bigger splash) */
  radius?: number;
  /** how fast the splash heals back to the top image, per frame (0.015 ≈ 1s) */
  fade?: number;
  /** how far the fluid bleeds / how uneven it is (0.01 = original) */
  spread?: number;
  /** @deprecated no longer used, kept so older call sites still compile */
  jitter?: number;
  /** extra zoom of the revealed image inside the top image's box (1 = same size) */
  bottomZoom?: number;
  /** auto-play: a virtual cursor sweeps over face / chest / stomach on its own */
  auto?: boolean;
  /** only show the revealed image inside the top image's silhouette */
  clipToTop?: boolean;
  /** [x, y] anchor of the image inside the canvas, 0..1 (contain fit) */
  anchor?: [number, number];
  className?: string;
};

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;  // y = 0 at the TOP (canvas / trail space)
varying vec2 v_gl;  // y = 0 at the BOTTOM (render-target space)
void main(){
  v_gl = a_pos * 0.5 + 0.5;
  v_uv = vec2(v_gl.x, 1.0 - v_gl.y);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// ---- fluid simulation pass (ping-pong) ----
const SIM_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v_uv;
varying vec2 v_gl;
uniform sampler2D u_prev;
uniform sampler2D u_input;
uniform vec2 u_aspectVec;
uniform float u_fade;
uniform float u_spread;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
// signed value noise, roughly -1..1
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 2.0 - 1.0;
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * vnoise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 n = v_gl * 20.0;
  vec2 disp = vec2(fbm(n), fbm(n + vec2(31.7, 17.3))) * u_aspectVec * u_spread;

  // keep the darkest of 5 samples -> dark (revealed) areas bleed outward
  float c = texture2D(u_prev, v_gl).r;
  c = min(c, texture2D(u_prev, v_gl + vec2( disp.x, 0.0)).r);
  c = min(c, texture2D(u_prev, v_gl + vec2(-disp.x, 0.0)).r);
  c = min(c, texture2D(u_prev, v_gl + vec2(0.0,  disp.y)).r);
  c = min(c, texture2D(u_prev, v_gl + vec2(0.0, -disp.y)).r);

  // new mouse trail
  c = min(c, texture2D(u_input, v_uv).r);

  // heal back toward white
  c = min(1.0, c + u_fade);
  gl_FragColor = vec4(vec3(c), 1.0);
}`;

// ---- final composite ----
const DRAW_FRAG = `
precision mediump float;
varying vec2 v_uv;
varying vec2 v_gl;
uniform sampler2D u_top;
uniform sampler2D u_bot;
uniform sampler2D u_mask;
uniform vec4 u_rectT;     // top image rect in canvas uv (x, y, w, h)
uniform vec2 u_botScale;  // cover-fit scale for bottom image inside top rect
uniform vec2 u_anchor;
uniform float u_clip;

float box(vec2 q){
  return step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
}

void main(){
  vec2 q = (v_uv - u_rectT.xy) / u_rectT.zw;
  float inside = box(q);
  vec4 a = texture2D(u_top, clamp(q, 0.0, 1.0)) * inside;

  vec2 qb = (q - u_anchor) * u_botScale + u_anchor;
  vec4 b = texture2D(u_bot, clamp(qb, 0.0, 1.0)) * box(qb) * inside;
  b *= mix(1.0, a.a, u_clip);

  // fluid: white = top image, black = revealed image
  float m = 1.0 - texture2D(u_mask, v_gl).r;
  gl_FragColor = mix(a, b, m);
}`;

export default function LiquidReveal({
  topSrc,
  bottomSrc,
  radius = 0.25,
  fade = 0.015,
  spread = 0.01,
  bottomZoom = 1,
  auto = true,
  clipToTop = true,
  anchor = [0.5, 1],
  className,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const host = wrap.current!;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return;

    // ---------- programs ----------
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const makeProg = (frag: string) => {
      const pr = gl.createProgram()!;
      gl.attachShader(pr, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(pr, 0, "a_pos");
      gl.linkProgram(pr);
      return pr;
    };
    const simProg = makeProg(SIM_FRAG);
    const drawProg = makeProg(DRAW_FRAG);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // uniforms – sim
    gl.useProgram(simProg);
    const sU = (n: string) => gl.getUniformLocation(simProg, n);
    gl.uniform1i(sU("u_prev"), 2);
    gl.uniform1i(sU("u_input"), 3);
    gl.uniform1f(sU("u_fade"), fade);
    gl.uniform1f(sU("u_spread"), spread);
    const sAspect = sU("u_aspectVec");

    // uniforms – draw
    gl.useProgram(drawProg);
    const dU = (n: string) => gl.getUniformLocation(drawProg, n);
    gl.uniform1i(dU("u_top"), 0);
    gl.uniform1i(dU("u_bot"), 1);
    gl.uniform1i(dU("u_mask"), 2);
    gl.uniform2f(dU("u_anchor"), anchor[0], anchor[1]);
    gl.uniform1f(dU("u_clip"), clipToTop ? 1 : 0);
    const dRectT = dU("u_rectT"), dBotScale = dU("u_botScale");

    // ---------- textures ----------
    const makeTex = (unit: number) => {
      const t = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      return t;
    };
    const texTop = makeTex(0);
    const texBot = makeTex(1);
    const simTex = [makeTex(2), makeTex(2)]; // ping-pong pair
    const texTrail = makeTex(3);
    const fbo = gl.createFramebuffer()!;
    let rd = 0; // index of the texture holding the latest fluid state

    // ---------- images ----------
    const imgSize = { top: [1, 1], bot: [1, 1] };
    let rectT = [0, 0, 1, 1];
    let botScale = [1, 1];
    let alive = true;

    // top: "contain" fit with anchor. bottom: same box, cover-fit.
    const layout = () => {
      const ca = canvas.width / Math.max(1, canvas.height);
      const iaT = imgSize.top[0] / imgSize.top[1];
      let w = 1, h = 1;
      if (iaT > ca) h = ca / iaT; else w = iaT / ca;
      rectT = [(1 - w) * anchor[0], (1 - h) * anchor[1], w, h];

      const iaB = imgSize.bot[0] / imgSize.bot[1];
      botScale = (iaB > iaT ? [iaT / iaB, 1] : [1, iaB / iaT]).map((v) => v / bottomZoom);
    };

    const loadImage = (src: string, tex: WebGLTexture, unit: number, key: "top" | "bot") => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (!alive) return;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        imgSize[key] = [img.naturalWidth, img.naturalHeight];
        layout();
      };
      img.src = src;
    };
    loadImage(topSrc, texTop, 0, "top");
    loadImage(bottomSrc, texBot, 1, "bot");

    // ---------- trail canvas + fluid targets ----------
    const trail = document.createElement("canvas");
    const tctx = trail.getContext("2d", { alpha: false })!;
    let sw = 64, sh = 64;

    const initSim = () => {
      const clamp = (v: number) => Math.min(512, Math.max(64, Math.round(v)));
      sw = clamp(host.clientWidth / 2);
      sh = clamp(host.clientHeight / 2);
      trail.width = sw;
      trail.height = sh;
      tctx.fillStyle = "#fff";
      tctx.fillRect(0, 0, sw, sh);

      gl.useProgram(simProg);
      const aspect = sh / sw;
      if (sw < sh) gl.uniform2f(sAspect, 1, 1 / aspect);
      else gl.uniform2f(sAspect, aspect, 1);

      // allocate both targets and clear them to white (= nothing revealed)
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.clearColor(1, 1, 1, 1);
      for (const t of simTex) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sw, sh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(host.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(host.clientHeight * dpr));
      initSim();
      layout();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ---------- cursor target (normalised 0..1 in the canvas) ----------
    const tgt = { x: 0.5, y: 0.5 };
    const T = { cx: 0, cy: 0, lx: 0, ly: 0, op: 0 };
    let pointerActive = false;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tgt.x = (e.clientX - r.left) / r.width;
      tgt.y = (e.clientY - r.top) / r.height;
      pointerActive = true;
    };
    const onLeave = () => { pointerActive = false; };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);

    // mouse trail: smooth follow, one thick round line, opacity follows motion
    const updateTrail = () => {
      const tx = tgt.x * sw, ty = tgt.y * sh;
      const d = Math.hypot(tx - T.cx, ty - T.cy);

      if (T.op < 0.02 && d > 1) {
        // coming back from idle: jump, so no long streak is drawn
        T.cx = T.lx = tx; T.cy = T.ly = ty;
        T.op = 0.2;
      } else {
        T.lx = T.cx; T.ly = T.cy;
        T.cx += (tx - T.cx) * 0.25;
        T.cy += (ty - T.cy) * 0.25;
        T.op = d > 0.5 ? Math.min(1, T.op + 0.15) : Math.max(0, T.op - 0.03);
      }

      tctx.fillStyle = "#fff";
      tctx.fillRect(0, 0, sw, sh);
      if (T.op > 0.01) {
        tctx.beginPath();
        tctx.moveTo(T.lx, T.ly);
        tctx.lineTo(T.cx, T.cy);
        tctx.lineCap = "round";
        tctx.lineWidth = Math.max(8, sw * radius);
        tctx.strokeStyle = `rgba(0,0,0,${T.op})`;
        tctx.stroke();
      }
    };

    // ---------- auto "virtual cursor" ----------
    // Every few seconds it crosses part of the image (face, chest, stomach...)
    // in a random direction, sometimes as a quick 2-3 stroke zig-zag.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoOn = auto && !reduce;
    const ZONES: [number, number][] = [
      [0.5, 0.2],   // face
      [0.5, 0.42],  // chest
      [0.5, 0.66],  // stomach
      [0.4, 0.3],   // neck / shoulder left
      [0.6, 0.52],  // chest right
      [0.45, 0.78], // lower stomach
    ];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    type Stroke = { ax: number; ay: number; bx: number; by: number; amp: number; t0: number; dur: number };
    const A = {
      stroke: null as Stroke | null,
      pauseUntil: performance.now() + 700,
      zone: -1, burst: 0, dir: 1,
    };
    const newStroke = (now: number) => {
      if (A.burst <= 0) {
        let z = A.zone;
        while (z === A.zone) z = Math.floor(Math.random() * ZONES.length);
        A.zone = z;
        A.burst = Math.random() < 0.4 ? 2 + Math.floor(Math.random() * 2) : 1;
        A.dir = Math.random() < 0.5 ? 1 : -1;
      }
      const [cx, cy] = ZONES[A.zone];
      const ang = rnd(-0.6, 0.6) + (Math.random() < 0.25 ? Math.PI / 2 : 0);
      const L = rnd(0.2, 0.36);
      const ux = Math.cos(ang) * A.dir, uy = Math.sin(ang) * A.dir * 0.7;
      A.stroke = {
        ax: cx - ux * L, ay: cy - uy * L,
        bx: cx + ux * L, by: cy + uy * L,
        amp: rnd(0.02, 0.07) * (Math.random() < 0.5 ? 1 : -1),
        t0: now,
        dur: rnd(650, 1200),
      };
      A.dir *= -1;
      A.burst--;
    };
    const runAuto = (now: number) => {
      if (!A.stroke) {
        if (now < A.pauseUntil) return;
        newStroke(now);
      }
      const s = A.stroke!;
      const u = Math.min(1, (now - s.t0) / s.dur);
      const e = u * u * (3 - 2 * u);
      const vx = s.bx - s.ax, vy = s.by - s.ay;
      const len = Math.hypot(vx, vy) || 1;
      const wob = Math.sin(e * Math.PI * 2) * s.amp;
      const nx = s.ax + vx * e + (-vy / len) * wob;
      const ny = s.ay + vy * e + (vx / len) * wob;
      // zone coords are fractions of the top image's box -> canvas fractions
      tgt.x = rectT[0] + nx * rectT[2];
      tgt.y = rectT[1] + ny * rectT[3];
      if (u >= 1) {
        A.stroke = null;
        A.pauseUntil = now + (A.burst > 0 ? rnd(80, 200) : rnd(900, 2600));
      }
    };

    // ---------- loop ----------
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();

      if (pointerActive) {
        // a real cursor takes over; auto resumes shortly after it leaves
        A.stroke = null;
        A.burst = 0;
        A.pauseUntil = now + 1500;
      } else if (autoOn) {
        runAuto(now);
      }

      updateTrail();
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, texTrail);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trail);

      // --- fluid pass: read simTex[rd], write simTex[wr] ---
      const wr = 1 - rd;
      gl.useProgram(simProg);
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, simTex[wr], 0);
      gl.viewport(0, 0, sw, sh);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, simTex[rd]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      rd = wr; // latest result

      // --- composite ---
      gl.useProgram(drawProg);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, simTex[rd]);
      gl.uniform4fv(dRectT, rectT);
      gl.uniform2fv(dBotScale, botScale);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    frame();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      [texTop, texBot, texTrail, ...simTex].forEach((t) => gl.deleteTexture(t));
      gl.deleteFramebuffer(fbo);
      gl.deleteBuffer(buf);
      gl.deleteProgram(simProg);
      gl.deleteProgram(drawProg);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topSrc, bottomSrc, radius, fade, spread, bottomZoom, clipToTop, auto]);

  return (
    <div
      ref={wrap}
      className={className}
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}