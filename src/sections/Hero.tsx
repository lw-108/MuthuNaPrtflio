import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import balajiImg from "../assets/balaji.png";
import roboImg from "../assets/robo2.png";
import mbLogo from "../assets/mb.png";
import LiquidReveal from "./Liquidreveal";
import RoboStage from "./RoboStage";

const START_DELAY = 0.15;

const Plus: React.FC<{ x: number; y: number }> = ({ x, y }) => (
    <span className="hero-plus" style={{ left: `${x}%`, top: `${y}%` }} />
);

/* ---------------------------------------------------------------------------
   GRID — single source of truth.
   3 columns (VX[0]→VX[1]→VX[2]→VX[3]) and 3 rows below the nav bar.
   These values are injected into CSS as --x0..--x3 / --y0..--y3, so every
   element below is positioned from the same lines the grid is drawn with.
   --------------------------------------------------------------------------- */
const VX = [4, 34.7, 65.4, 96];
const HY = [7.8, 36.1, 66.7, 97.4];

const LINKS: [string, string?][] = [
    ["Home"], ["About"], ["Work", "12"], ["Services", "08"], ["Contact"],
];

const GHOST = "MUTHU"; // watermark text — change if it should match the BALAJI headline
const TAGLINE = "I design and build robots that sense, think and move: simple, smart and impactful";
const ABOUT = "Robotics engineer building autonomous machines, from precision arms to field rovers, where mechanics, electronics and software meet.";
const STATS: [string, string][] = [["5+", "Years\nbuilding"], ["40+", "Robots\nshipped"], ["12", "Open-source\nrepos"]];

const SOCIALS = [
    { name: "LinkedIn", href: "#", icon: <b>in</b> },
    { name: "GitHub", href: "#", icon: <b>Gh</b> },
    { name: "Email", href: "#", icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" />
        </svg>
    )},
];

export default function Hero() {
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(false);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) { setLoading(false); return; }
        document.body.style.overflow = "hidden";

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => { setLoading(false); document.body.style.overflow = ""; }
            });
            tl.to({}, { duration: START_DELAY });
            tl.to('.pillar', { yPercent: -100, duration: 0.75, stagger: { each: 0.07, from: "edges" }, ease: "power3.inOut" });
            tl.from('.hero-v', { scaleY: 0, transformOrigin: 'top', duration: 0.8, stagger: 0.06, ease: 'power2.out' }, "-=0.55")
                .from('.hero-h', { scaleX: 0, transformOrigin: 'left', duration: 0.8, stagger: 0.06, ease: 'power2.out' }, "<")
                .from('.hero-plus', { scale: 0, rotation: 180, duration: 0.4, stagger: 0.03 }, "-=0.4");
            tl.from('.hero-nav a', { y: -20, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, "-=0.4")
                .from('.hero-burger', { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' }, "<");
            tl.from('.hero-portrait', { yPercent: 15, scale: 1.04, opacity: 0, duration: 1.1, ease: 'power3.out' }, "-=0.7");
            tl.from('.hero-ghost', { xPercent: -8, opacity: 0, duration: 1.1, ease: 'power3.out', filter: 'blur(8px)' }, "-=0.9");
            tl.from('.hero-name', { yPercent: 25, opacity: 0, duration: 0.8, ease: 'back.out(1.4)', scale: 0.95 }, "-=0.8");
            tl.from(['.hero-tag', '.hero-year'], { x: -25, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' }, "-=0.6");
            tl.from('.hero-proj', { rotation: 8, xPercent: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, "-=0.6")
                .from('.hero-talk', { yPercent: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.7");

            // robots + stats arrive last (fade only, so the stages never shift position)
            tl.from('.rb-stage', { opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out' }, "-=0.6")
                .from('.hero-stats > div', { y: 14, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, "<0.2");
        }, container);

        return () => { ctx.revert(); document.body.style.overflow = ""; };
    }, []);

    return (
        <div ref={container} className="hero-wrapper">
            <style>{css}</style>

            {loading && (
                <div className="pillars" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="pillar" style={{ background: "#ffffff" }} />
                    ))}
                </div>
            )}

            {menu && (
                <div className="hero-menu" role="dialog" aria-label="Menu">
                    <button className="hero-close" onClick={() => setMenu(false)} aria-label="Close menu">✕</button>
                    {LINKS.map(([l, n]) => (
                        <a key={l} href="#" onClick={() => setMenu(false)}>{l} {n && <small>({n})</small>}</a>
                    ))}
                </div>
            )}

            <header className="hero">
                {VX.map((x) => <span key={x} className="hero-v" style={{ left: `${x}%` }} />)}
                {HY.map((y) => <span key={y} className="hero-h" style={{ top: `${y}%` }} />)}
                {VX.map((x) => <Plus key={`t${x}`} x={x} y={HY[0]} />)}
                {[HY[1], HY[2], HY[3]].map((y) => (
                    <React.Fragment key={y}>
                        <Plus x={VX[0]} y={y} />
                        <Plus x={VX[3]} y={y} />
                    </React.Fragment>
                ))}

                <div className="hero-ghost" aria-hidden="true">{GHOST}</div>

                <div className="hero-portrait">
                    <LiquidReveal topSrc={balajiImg} bottomSrc={roboImg} radius={0.25} fade={0.015} spread={0.01}
                        bottomZoom={1} auto anchor={[0.5, 1]} />
                </div>

                {/* robots — each stage is locked to a grid cell (see CSS) */}
                <RoboStage scene="kid" className="rb-kid" tip="right" />
                <RoboStage scene="dog" className="rb-dog" tip="below" />
                <RoboStage scene="saw" className="rb-saw" tip="left" />
                <RoboStage scene="rover" className="rb-rover" tip="above" />

                <nav className="hero-nav" aria-label="Main">
                    <a className="hero-logo" href="#"><img src={mbLogo} alt="MB Logo" /><sup>®</sup></a>
                    <div className="hero-links">
                        {LINKS.map(([l, n]) => (
                            <a key={l} className="hero-link" href="#">{l} {n && <small>({n})</small>}</a>
                        ))}
                    </div>
                </nav>
                <button className="hero-burger" aria-label="Open menu" onClick={() => setMenu(true)} />

                <p className="hero-tag">{TAGLINE}</p>
                <div className="hero-stats">
                    {STATS.map(([n, l]) => (<div key={l}><b>{n}</b><span>{l}</span></div>))}
                </div>
                <div className="hero-year">©2026</div>
                <h1 className="hero-name">BALAJI</h1>

                <div className="hero-proj" aria-label="About and social links">
                    <div className="proj-inner">
                        <p>{ABOUT}</p>
                        <div className="proj-socials">
                            {SOCIALS.map((s) => (
                                <a key={s.name} className="soc" href={s.href} aria-label={s.name}>{s.icon}</a>
                            ))}
                        </div>
                    </div>
                </div>

                <a className="hero-talk" href="#contact">
                    <div className="av">
                        <img src="src/assets/mb.png" alt="MB" className="px-3 py-4" />
                    </div>
                    <div className="tx">
                        <span>Let`s Talk</span>
                        <span className="star">✳</span>
                        <strong>MUTHU BALAJI</strong>
                        <em>Robotics Engineer</em>
                        <span className="go">↗</span>
                    </div>
                </a>
            </header>
        </div>
    );
}

const css = `
@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;800&display=swap");
html,body{margin:0;padding:0;background:#c04a0f}
.hero-wrapper,.hero,.hero *,.hero *::before,.hero *::after{box-sizing:border-box}
.hero-wrapper{position:relative;width:100%;height:100%;overflow:hidden;}

.hero{container-type:size;position:relative;width:100%;height:100vh;height:100svh;min-height:320px;overflow:hidden;
  --u:min(1cqw,1.372cqh);

  /* ---- grid lines (generated from VX / HY in the component) ---- */
  --x0:${VX[0]}cqw; --x1:${VX[1]}cqw; --x2:${VX[2]}cqw; --x3:${VX[3]}cqw;
  --y0:${HY[0]}cqh; --y1:${HY[1]}cqh; --y2:${HY[2]}cqh; --y3:${HY[3]}cqh;

  /* ---- shared spacing + derived anchors ---- */
  --pad:calc(var(--u)*1.6);                                  /* inner gutter of every cell      */
  --lx:calc(var(--x0) + var(--pad));                         /* left text edge  (column 1)      */
  --cx:calc(var(--x2) + var(--pad));                         /* left text edge  (column 3)      */
  --rx:calc(100cqw - var(--x3) + var(--pad));                /* right text edge (column 3)      */
  --col1:calc(var(--x1) - var(--x0) - var(--pad)*2);         /* usable width of column 1        */
  --col3:calc(var(--x3) - var(--x2) - var(--pad)*2);         /* usable width of column 3        */
  --rv:7cqh;                                                 /* rover strip height              */
  --name:calc(var(--u)*16);                                  /* BALAJI size                     */
  --base:calc(100cqh - var(--y3) + var(--rv) + var(--u)*1.2);/* shared baseline: name + card    */
  --sb:calc(100cqh - var(--y2) + var(--u)*1.2);              /* shared baseline: tag + (row 2)  */

  font-family:"Inter Tight","Helvetica Neue",Arial,sans-serif;color:#fff;
  background:linear-gradient(135deg,#c04a0f 0%,#dc4f22 45%,#f5603a 100%)}
.hero>*{position:absolute}
.hero a{color:inherit}

.pillars{position:fixed;inset:0;z-index:999;display:flex;background:transparent;pointer-events:none;overflow:hidden}
.pillar{flex:1;height:100%;background:#ffffff;border:none;outline:none;margin:0;will-change:transform}

.hero-v,.hero-h{background:rgba(255,255,255,.22);pointer-events:none}
.hero-v{top:0;bottom:0;width:1px}
.hero-h{left:0;right:0;height:1px}
.hero-plus{width:max(10px,calc(var(--u)*1.1));height:max(10px,calc(var(--u)*1.1));transform:translate(-50%,-50%);z-index:1;pointer-events:none}
.hero-plus::before,.hero-plus::after{content:"";position:absolute;background:rgba(255,255,255,.85)}
.hero-plus::before{left:0;right:0;top:50%;height:1px}
.hero-plus::after{top:0;bottom:0;left:50%;width:1px}

/* ============ NAV — occupies the top grid band (0 → y0), everything centred in it ============ */
.hero-nav{left:0;right:0;top:0;height:var(--y0);z-index:5;font-size:max(12px,calc(var(--u)*1.1));font-weight:500}
.hero-nav a{text-decoration:underline;text-underline-offset:.25em;text-decoration-thickness:1px;white-space:nowrap}
.hero-nav a small{font-size:.75em;opacity:.6;margin-left:.2em;display:inline-block;text-decoration:none}
.hero-nav .hero-logo{position:absolute;left:var(--lx);top:0;bottom:0;display:inline-flex;align-items:center;text-decoration:none;line-height:1}
.hero-logo img{height:max(20px,calc(var(--u)*2.2));width:auto;object-fit:contain;display:block}
.hero-logo sup{font-size:.55em;font-weight:600;margin-left:2px;align-self:flex-start;opacity:.85;line-height:1}
/* links span column 2 edge-to-edge (inside the gutter) with equal spacing */
.hero-links{position:absolute;left:calc(var(--x1) + var(--pad));width:calc(var(--x2) - var(--x1) - var(--pad)*2);top:0;bottom:0;
  display:flex;align-items:center;justify-content:space-between}
.hero-burger{--bh:max(9px,calc(var(--u)*.9));right:var(--rx);top:calc(var(--y0)/2 - var(--bh)/2);z-index:6;
  width:max(30px,calc(var(--u)*3.4));height:var(--bh);border:0;border-top:2px solid #fff;border-bottom:2px solid #fff;background:none;padding:0;cursor:pointer}

.hero-menu{position:fixed;inset:0;z-index:500;background:#1c0000;display:flex;flex-direction:column;justify-content:center;gap:1rem;padding:8vw;font-family:"Inter Tight",Arial,sans-serif}
.hero-menu a{color:#fff;font-size:clamp(32px,8vw,72px);font-weight:800;letter-spacing:-.03em;text-decoration:none;line-height:1.05}
.hero-menu a small{font-size:.4em;opacity:.6;font-weight:500}
.hero-close{position:absolute;top:max(5vw,env(safe-area-inset-top,0px));right:5vw;background:none;border:0;color:#fff;font-size:28px;cursor:pointer}

/* ============ COLUMN 1 — everything shares the same left edge (--lx) ============ */
.hero-ghost{left:calc(var(--lx) - .04em);top:calc(var(--y0) + var(--u)*.4);font-size:calc(var(--u)*27);line-height:1;font-weight:800;letter-spacing:-.04em;color:rgba(255,255,255,.1);white-space:nowrap;user-select:none;pointer-events:none}
.hero-tag{left:var(--lx);bottom:var(--sb);width:min(var(--col1),calc(var(--u)*26));margin:0;font-size:max(12px,calc(var(--u)*1.2));line-height:1.55;font-weight:500;text-transform:uppercase;text-wrap:pretty}
.hero-year{left:var(--lx);bottom:calc(var(--base) + var(--name)*.78 + var(--u)*1.4);font-size:max(14px,calc(var(--u)*1.6));font-weight:500;line-height:1}
.hero-name{left:calc(var(--lx) - .05em);bottom:var(--base);margin:0;font-size:var(--name);line-height:.78;font-weight:800;letter-spacing:-.045em;z-index:3;pointer-events:none}

/* portrait — centred on column 2 */
.hero-portrait{--pw:calc(var(--u)*40);left:calc((var(--x1) + var(--x2))/2 - var(--pw)/2);bottom:0;width:var(--pw);height:min(86cqh,calc(var(--u)*60));z-index:2;pointer-events:auto;filter:drop-shadow(0 4px 14px rgba(0,0,0,0.22))}
.hero-portrait canvas{display:block;width:100%;height:100%}

/* ============ COLUMN 3 — everything shares the same left edge (--cx) and right edge (--rx) ============ */
.hero-proj{--cu:var(--u);left:var(--cx);top:calc(var(--y0) + 14cqh);width:min(var(--col3),calc(var(--cu)*24));z-index:4;pointer-events:none}
.hero-proj .soc{pointer-events:auto}
.proj-inner{display:flex;flex-direction:column;gap:calc(var(--cu)*1.6)}
.proj-inner p{margin:0;font-size:max(13px,calc(var(--cu)*1.4));line-height:1.55;font-weight:500;color:rgba(255,255,255,.9);text-wrap:pretty}
.proj-socials{display:flex;flex-wrap:wrap;gap:calc(var(--cu)*.7)}
.proj-inner .soc{width:max(32px,calc(var(--cu)*3.1));height:max(32px,calc(var(--cu)*3.1));border-radius:50%;
  display:grid;place-items:center;color:#fff;text-decoration:none;line-height:1;
  font-size:max(11px,calc(var(--cu)*1.15));font-weight:600;letter-spacing:-.02em;
  border:1px solid rgba(255,255,255,.7);
  transition:background .25s,color .25s,transform .25s}
.proj-inner .soc b{font-weight:600;display:block}
.proj-inner .soc svg{width:48%;height:48%;display:block}
.proj-inner .soc:hover,.proj-inner .soc:focus-visible{background:#fff;color:#c04a0f;transform:translateY(-2px)}
.proj-inner .soc:focus-visible{outline:2px solid #fff;outline-offset:3px}

/* stats — top of row 3, column 3, same left edge as the about text */
.hero-stats{left:var(--cx);top:calc(var(--y2) + var(--u)*1.2);display:flex;gap:calc(var(--u)*2.4);z-index:4;pointer-events:none}
.hero-stats b{display:block;font-size:max(18px,calc(var(--u)*2.6));font-weight:800;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
.hero-stats span{display:block;margin-top:.55em;font-size:max(9px,calc(var(--u)*.85));font-weight:500;letter-spacing:.1em;text-transform:uppercase;opacity:.75;line-height:1.35;white-space:pre-line}
@media (max-aspect-ratio:3/2){.hero-stats{display:none}}

/* CTA card — right edge = column 3 right edge, bottom = same baseline as BALAJI */
.hero-talk{--cu:var(--u);right:var(--rx);bottom:var(--base);width:calc(var(--cu)*24.4);height:calc(var(--cu)*8.3);background:#0b0b0b;padding:calc(var(--cu)*.8);display:flex;gap:calc(var(--cu)*1);z-index:4;text-decoration:none}
.hero-talk .av{width:calc(var(--cu)*6.2);height:100%;flex:none;overflow:hidden;background:linear-gradient(160deg,#d8561f,#f06a3a);position:relative}
.hero-talk .av canvas{display:block;width:100%;height:100%}
.hero-talk .tx{flex:1;position:relative;font-size:max(10px,calc(var(--cu)*1.05));color:#ddd}
.hero-talk .tx strong{position:absolute;left:0;bottom:calc(var(--cu)*2.1);font-size:max(12px,calc(var(--cu)*1.25));color:#fff;font-weight:600}
.hero-talk .tx em{position:absolute;left:0;bottom:0;font-style:normal}
.hero-talk .star{position:absolute;right:0;top:0;font-size:max(10px,calc(var(--cu)*1.1))}
.hero-talk .go{position:absolute;right:0;bottom:0;width:calc(var(--cu)*3.1);height:calc(var(--cu)*3.1);background:#fff;color:#000;display:grid;place-items:center;font-size:max(12px,calc(var(--cu)*1.4))}
.hero-talk:focus-visible,.hero-nav a:focus-visible,.hero-burger:focus-visible{outline:2px solid #fff;outline-offset:3px}

/* ============ ROBOT STAGES — each one is locked to a grid cell ============ */
.rb-stage{z-index:4;pointer-events:none;background:transparent}
/* column 1, rows 1-2: kid + thought cloud (stops above the tagline) */
.rb-kid  {left:var(--lx);width:var(--col1);top:calc(var(--y0) + 1.5cqh);height:calc(var(--y2) - var(--y0) - 18.5cqh)}
/* column 3, row 1: dog chases ball */
.rb-dog  {left:var(--cx);width:var(--col3);top:calc(var(--y0) + 1.2cqh);height:10.5cqh}
/* column 3, row 2: arm + plank (sits between the about block and the grid line y2) */
.rb-saw  {left:var(--cx);width:var(--col3);top:calc(var(--y1) + 9cqh);height:calc(var(--y2) - var(--y1) - 9.8cqh)}
/* bottom strip: rover rides directly on the bottom grid line, inside the frame */
.rb-rover{left:var(--x0);right:calc(100cqw - var(--x3));top:auto;bottom:calc(100cqh - var(--y3));height:var(--rv)}
.rb-mount{position:absolute;inset:0;overflow:hidden;background:transparent;pointer-events:none}
.rb-mount svg{display:block;width:100%;height:100%;overflow:hidden;background:transparent !important;pointer-events:none}
.rb-hit{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer}

/* kid's comic thought cloud */
.rb-cloud{position:absolute;z-index:5;width:calc(var(--u)*17);transform:translate(-6%,0);pointer-events:none}
.rb-cloud>svg{display:block;width:100%;height:auto;filter:drop-shadow(0 6px 10px rgba(0,0,0,.18))}
.rb-cloud-in{position:absolute;left:10%;right:10%;top:8%;height:60%;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:.2em;color:#222;text-align:center}
.rb-cloud-in b{font-size:max(13px,calc(var(--u)*1.5));font-weight:800;letter-spacing:-.02em;white-space:nowrap;animation:rbPop .4s cubic-bezier(.3,1.6,.5,1) both}
.rb-emo{display:flex;gap:.15em;font-size:max(15px,calc(var(--u)*1.6));line-height:1}
.rb-emo i{font-style:normal;display:inline-block;animation:rbPop .5s cubic-bezier(.3,1.6,.5,1) both}
@keyframes rbPop{0%{transform:scale(0) rotate(-30deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}
.rb-float{position:absolute;font-size:max(12px,calc(var(--u)*1.5));animation:rbFloat 2.4s ease-in-out infinite}
@keyframes rbFloat{50%{transform:translateY(-6px) rotate(8deg)}}

/* hover dialogue: plain white card, plain dark text */
.rb-tip{position:fixed;left:0;top:0;z-index:600;width:240px;background:#fff;color:#1a1a1a;padding:12px 14px;
  border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.22);pointer-events:none;opacity:0;
  font-family:"Inter Tight",Arial,sans-serif}
.rb-tip h4{margin:0 0 6px;font-size:15px;font-weight:600;color:#111}
.rb-tip p{margin:0;font-size:13px;line-height:1.5;font-weight:400;color:#444;text-transform:none;letter-spacing:0}

/* ============ MOBILE / PORTRAIT — single centred column ============ */
@media (max-width:760px),(max-aspect-ratio:5/6){
  .hero{--m:min(1cqw,.9cqh)}
  .hero-links,.hero-tag,.hero-year,.hero-talk,.hero-stats,.rb-stage{display:none}
  .hero-nav .hero-logo{font-size:max(17px,5cqw);left:6cqw}
  .hero-burger{right:6cqw;width:max(30px,8cqw)}

  .hero-ghost{left:0;right:0;text-align:center;top:13cqh;font-size:calc(var(--m)*28);color:rgba(255,255,255,.16)}
  .hero-portrait{--pw:calc(var(--m)*100);left:calc(50% - var(--pw)/2);width:var(--pw);height:70cqh;bottom:0}
  .hero-name{left:0;right:0;text-align:center;bottom:18cqh;font-size:calc(var(--m)*29)}

  .hero-proj{--cu:calc(var(--m)*1.9);left:0;right:0;margin:0 auto;top:auto;bottom:3.5cqh;width:calc(var(--m)*84);max-width:none;text-shadow:0 1px 10px rgba(0,0,0,.35)}
  .proj-inner{align-items:center;text-align:center}
  .proj-inner p{max-width:100%;font-size:max(12px,calc(var(--m)*3.5))}
  .proj-socials{justify-content:center}
}
`;