// Shared drawing kit for every page of the film: characters, the car, helpers.
import { ENV } from './env.js';

export const W = 1080, H = 1920;
export const INK = '#2a1f1a';
export const OUT = { stroke: INK, 'stroke-width': 9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
const NS = 'http://www.w3.org/2000/svg';

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const ease = (k) => { k = clamp(k); return k * k * (3 - 2 * k); };
export const outBack = (k) => { k = clamp(k); const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
/** 0→1 over [a,b] */
export const ramp = (t, a, b) => clamp((t - a) / (b - a));
/** a repeatable pseudo-random number for n */
export const rnd = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export function S(tag, attrs = {}, parent) {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(el);
  return el;
}
export const set = (el, attrs) => { for (const k in attrs) el.setAttribute(k, attrs[k]); };

/** The stage: an SVG the size of the film, with the comic font loaded. */
export function stage(bg = '#000') {
  document.documentElement.style.cssText = 'margin:0;height:100%';
  document.body.style.cssText = 'margin:0;height:100%;overflow:hidden';
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid slice' }, document.body);
  svg.style.display = 'block';
  const style = S('style', {}, svg);
  style.textContent = `@font-face{font-family:Bangers;src:url(bangers.woff2) format('woff2')}
    text{font-family:Bangers,'Inter Black',Impact,sans-serif;letter-spacing:2px}`;
  if (bg) S('rect', { width: W, height: H, fill: bg }, svg);
  return svg;
}
export const fontReady = () => {
  const f = new FontFace('Bangers', 'url(bangers.woff2)');
  return f.load().then((x) => { document.fonts.add(x); }).catch(() => {});
};

/** How loud the reel is at second r of it, 0…1. */
export function amp(r) {
  const i = r * 30, a = Math.floor(i);
  if (a < 0 || a >= ENV.length - 1) return 0;
  return lerp(+ENV[a], +ENV[a + 1], i - a) / 9;
}
/** Mouth opening for a voice at reel second r. */
export const talk = (r) => clamp((amp(r) * 0.6 + amp(r - 0.04) * 0.4 - 0.1) * 1.5);

export function text(parent, str, x, y, size, fill = '#fff', extra = {}) {
  const t = S('text', { x, y, 'font-size': size, fill, 'text-anchor': 'middle', stroke: INK, 'stroke-width': size * 0.16, 'paint-order': 'stroke', 'stroke-linejoin': 'round', ...extra }, parent);
  t.textContent = str;
  return t;
}

/* ───────────── characters ─────────────
   D: the driver (olive shirt, short hair). P: the passenger (flat cap, glasses, beard, black tee).
   C: a client. Each is drawn around its own origin: the middle of the face. */
const LOOKS = {
  D: { skin: '#cf9f70', shade: '#b98558', shirt: '#cdbb4e', hair: '#1d1a1c' },
  P: { skin: '#bf8c5e', shade: '#a87549', shirt: '#2c2c33', hair: '#1d1a1c' },
  C: { skin: '#e2b48c', shade: '#c9966e', shirt: '#e8789a', hair: '#5b3420' },
};

export function makeChar(kind, parent, opts = {}) {
  const L = LOOKS[kind];
  const g = S('g', {}, parent);
  const body = S('g', {}, g);
  const armG = S('g', {}, g);
  const head = S('g', {}, g);

  // body
  S('path', { d: 'M-250 760 C-270 420 -220 250 -90 205 L90 205 C220 250 270 420 250 760 Z', fill: L.shirt, ...OUT }, body);
  S('path', { d: 'M-48 120 L-48 215 Q0 262 48 215 L48 120 Z', fill: L.shade, ...OUT }, body);
  if (kind === 'D') {
    S('path', { d: 'M-70 212 Q0 280 70 212', fill: 'none', ...OUT }, body);
    S('path', { d: 'M0 262 L0 400', fill: 'none', ...OUT, 'stroke-width': 6 }, body);
    for (const y of [300, 345, 390]) S('circle', { cx: 0, cy: y, r: 7, fill: '#8a7d2e' }, body);
  } else if (kind === 'P') {
    S('path', { d: 'M-72 212 Q0 268 72 212', fill: 'none', ...OUT }, body);
    S('rect', { x: -70, y: 330, width: 140, height: 70, rx: 10, fill: 'none', stroke: '#d9d9de', 'stroke-width': 7 }, body);
    S('path', { d: 'M-45 350 L45 350 M-45 366 L25 366 M-45 382 L38 382', stroke: '#d9d9de', 'stroke-width': 5, 'stroke-linecap': 'round' }, body);
  } else {
    S('path', { d: 'M-70 212 L0 290 L70 212', fill: '#fff', ...OUT }, body);
    S('path', { d: 'M-16 268 L16 268 L24 420 L0 450 L-24 420 Z', fill: '#3d5a80', ...OUT, 'stroke-width': 7 }, body);
  }
  // seat belts (the car scene shows as many as it needs)
  const belts = [];
  if (opts.belt) {
    const dir = opts.belt; // 1: from the left shoulder down to the right; -1: the mirror
    for (let i = 0; i < 3; i++) {
      const b = S('g', {}, body);
      const o = i * 70 * dir;
      S('path', { d: `M${-175 * dir + o} 215 L${-100 * dir + o} 200 L${150 * dir + o} 760 L${60 * dir + o} 760 Z`, fill: '#8f9299', ...OUT, 'stroke-width': 7 }, b);
      if (i === 0) S('rect', { x: -80 * dir - 22, y: 330, width: 44, height: 76, rx: 10, fill: '#2f7fd6', ...OUT, 'stroke-width': 6 }, b);
      belts.push(b);
    }
  }

  // an arm that can gesture: shoulder to hand
  const armO = S('path', { fill: 'none', stroke: INK, 'stroke-width': 88, 'stroke-linecap': 'round' }, armG);
  const armI = S('path', { fill: 'none', stroke: L.skin, 'stroke-width': 70, 'stroke-linecap': 'round' }, armG);
  const sleeve = S('path', { fill: 'none', stroke: L.shirt, 'stroke-width': 96, 'stroke-linecap': 'round' }, armG);
  const hand = S('g', {}, armG);
  S('circle', { r: 56, fill: L.skin, ...OUT }, hand);
  S('path', { d: 'M-30 -42 Q-36 -84 -14 -80 Q0 -78 -6 -46 M0 -52 Q0 -98 22 -92 Q36 -88 24 -48 M30 -40 Q44 -78 60 -66 Q70 -56 48 -26', fill: L.skin, ...OUT, 'stroke-width': 8 }, hand);
  armG.style.display = 'none';

  // head
  S('circle', { cx: -152, cy: 8, r: 30, fill: L.skin, ...OUT }, head);
  S('circle', { cx: 152, cy: 8, r: 30, fill: L.skin, ...OUT }, head);
  S('ellipse', { rx: 152, ry: 172, fill: L.skin, ...OUT }, head);
  if (kind === 'P') {
    S('path', { d: 'M-146 30 C-146 150 -72 190 0 190 C72 190 146 150 146 30 C128 96 70 112 0 112 C-70 112 -128 96 -146 30 Z', fill: '#3b2b24', ...OUT, 'stroke-width': 7 }, head);
  }
  if (kind === 'D') {
    S('path', { d: 'M-158 -24 C-178 -170 -70 -226 20 -208 C60 -236 120 -214 118 -186 C170 -150 172 -80 158 -24 C136 -92 70 -126 0 -118 C-74 -124 -128 -92 -158 -24 Z', fill: L.hair, ...OUT }, head);
  } else if (kind === 'P') {
    S('path', { d: 'M-160 -30 Q-170 -70 -150 -90 L-140 -30 Z M160 -30 Q170 -70 150 -90 L140 -30 Z', fill: L.hair, ...OUT, 'stroke-width': 6 }, head);
    S('path', { d: 'M-166 -66 C-176 -206 176 -214 166 -66 Z', fill: '#25252b', ...OUT }, head);
    S('path', { d: 'M-214 -72 Q-150 -112 40 -78 Q-30 -40 -196 -46 Q-226 -54 -214 -72 Z', fill: '#17171b', ...OUT }, head);
  } else {
    S('path', { d: 'M-160 -10 C-190 -190 -40 -230 40 -206 C140 -210 184 -110 160 -10 C140 -80 110 -120 60 -132 C0 -100 -90 -96 -160 -10 Z', fill: L.hair, ...OUT }, head);
  }
  const eyes = [], pupils = [], brows = [];
  for (const sx of [-1, 1]) {
    eyes.push(S('ellipse', { cx: sx * 60, cy: -22, rx: 42, ry: 46, fill: '#fff', ...OUT, 'stroke-width': 7 }, head));
    pupils.push(S('circle', { cx: sx * 60, cy: -22, r: 13, fill: INK }, head));
    brows.push(S('path', { fill: 'none', ...OUT, 'stroke-width': 13 }, head));
  }
  if (kind === 'P') {
    for (const sx of [-1, 1]) S('circle', { cx: sx * 60, cy: -22, r: 56, fill: 'rgba(255,255,255,.12)', stroke: '#111', 'stroke-width': 12 }, head);
    S('path', { d: 'M-6 -26 Q0 -34 6 -26 M-116 -30 L-150 -40 M116 -30 L150 -40', fill: 'none', stroke: '#111', 'stroke-width': 10, 'stroke-linecap': 'round' }, head);
  }
  S('path', { d: 'M-12 30 Q8 52 22 30', fill: 'none', ...OUT, 'stroke-width': 8 }, head);
  if (kind === 'P') S('path', { d: 'M-62 78 Q-30 52 0 66 Q30 52 62 78 Q30 72 0 80 Q-30 72 -62 78 Z', fill: '#3b2b24', ...OUT, 'stroke-width': 6 }, head);
  const my = kind === 'P' ? 116 : 104;
  const mouthO = S('ellipse', { cx: 0, cy: my, fill: '#5a1a1f', ...OUT, 'stroke-width': 7 }, head);
  const tongue = S('ellipse', { cx: 0, fill: '#e2707a' }, head);
  const teeth = S('rect', { fill: '#fff', rx: 6 }, head);
  const smile = S('path', { fill: 'none', ...OUT, 'stroke-width': 9 }, head);

  const me = {
    g, head, body, belts, kind,
    /** pose({ x, y, s, mouth, look:[dx,dy], brow, blink, tilt, bob, smile, flip }) */
    pose(p) {
      const s = p.s ?? 1;
      set(g, { transform: `translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * s} ${s})` });
      set(head, { transform: `translate(${p.hx ?? 0} ${-(p.bob ?? 0)}) rotate(${p.tilt ?? 0})` });
      const o = clamp(p.mouth ?? 0), look = p.look ?? [0, 0], blink = p.blink ?? 0, brow = p.brow ?? 0, sm = p.smile ?? 0.4;
      const open = o > 0.07;
      mouthO.style.display = tongue.style.display = open ? '' : 'none';
      teeth.style.display = open && o > 0.3 ? '' : 'none';
      smile.style.display = open ? 'none' : '';
      const rx = 44 - 8 * o, ry = 6 + 44 * o;
      set(mouthO, { rx, ry, cy: my + ry * 0.5 });
      set(tongue, { rx: rx * 0.62, ry: ry * 0.36, cy: my + ry * 1.05 });
      set(teeth, { x: -rx * 0.62, y: my + ry * 0.5 - ry * 0.92, width: rx * 1.24, height: Math.max(0, ry * 0.36) });
      set(smile, { d: `M-40 ${my} Q0 ${my + 44 * sm} 40 ${my}` });
      eyes.forEach((e, i) => set(e, { ry: lerp(46, 4, blink) }));
      pupils.forEach((pu, i) => { set(pu, { cx: (i ? 60 : -60) + look[0] * 20, cy: -22 + look[1] * 20 }); pu.style.display = blink > 0.6 ? 'none' : ''; });
      // brow: -1 worried, 0 neutral, 1 raised, 2 angry
      brows.forEach((b, i) => {
        const sx = i ? 1 : -1, up = brow === 2 ? 0 : brow * 14;
        const inner = brow === 2 ? 14 : brow < 0 ? -18 * -brow : 0, outer = brow === 2 ? -10 : brow < 0 ? 12 * -brow : 0;
        set(b, { d: `M${sx * 22} ${-90 - up + inner} Q${sx * 60} ${-104 - up} ${sx * 102} ${-88 - up + outer}` });
      });
      if (p.hand) {
        armG.style.display = '';
        const [hx, hy] = p.hand, shx = p.shoulder ?? 170, d = `M${shx} 330 Q${shx + (hx - shx) * 0.2 + 60} ${hy + 220} ${hx} ${hy}`;
        set(armO, { d }); set(armI, { d });
        set(sleeve, { d: `M${shx} 330 L${shx + 1} 331` });
        set(hand, { transform: `translate(${hx} ${hy}) rotate(${p.handRot ?? 0})` });
      } else armG.style.display = 'none';
    },
  };
  me.pose({ x: 0, y: 0 });
  return me;
}

/** A blink at t for a character with its own phase. */
export const blinkAt = (t, phase = 0) => { const k = (t + phase) % 3.3; return k < 0.14 ? Math.sin((k / 0.14) * Math.PI) : 0; };

/* ───────────── the car ─────────────
   The two of them seen from the dashboard. cfg: { r0, spk:[[reelSecond,'D'|'P'|'-'],…], cams:[[reelSecond,'two'|'D'|'P'],…], extra(t, r, api) } */
export function carScene(cfg) {
  const svg = stage('#9fd8ee');
  const cam = S('g', {}, svg);

  // outside, moving past
  const out = S('g', {}, cam);
  S('rect', { y: 480, width: W, height: 520, fill: '#a9def2' }, out);
  const far = S('g', {}, out), near = S('g', {}, out);
  const blocks = ['#f3d9b1', '#f0b9a0', '#c8d8e8', '#f4e6a6', '#d7c4e2'];
  for (let i = 0; i < 9; i++) {
    const x = i * 330, h = 190 + rnd(i) * 150, b = S('g', {}, far);
    S('rect', { x, y: 900 - h, width: 230, height: h, fill: blocks[i % 5], ...OUT, 'stroke-width': 6 }, b);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) S('rect', { x: x + 22 + c * 50, y: 900 - h + 24 + r * 44, width: 30, height: 22, fill: '#6c8aa0' }, b);
  }
  for (let i = 0; i < 12; i++) {
    const x = i * 250, b = S('g', {}, near);
    S('rect', { x: x + 52, y: 800, width: 22, height: 120, fill: '#6b4a2f', ...OUT, 'stroke-width': 6 }, b);
    S('path', { d: `M${x} 810 q-30 -80 40 -110 q30 -70 90 -20 q70 10 40 90 q10 60 -80 50 q-70 20 -90 -10z`, fill: i % 2 ? '#5fae5a' : '#78c26a', ...OUT, 'stroke-width': 7 }, b);
  }
  S('rect', { y: 900, width: W, height: 120, fill: '#8d939c' }, out);

  // the cabin: everything but the windows
  S('path', {
    'fill-rule': 'evenodd', fill: '#4a4744', ...OUT,
    d: `M-20 -20 H${W + 20} V${H + 20} H-20 Z
        M-20 590 Q150 560 300 600 L330 900 Q150 930 -20 920 Z
        M392 640 Q540 610 688 640 Q700 740 690 830 Q540 850 390 830 Q380 740 392 640 Z
        M${W + 20} 590 Q930 560 780 600 L750 900 Q930 930 ${W + 20} 920 Z`,
  }, cam);
  S('path', { d: `M-20 -20 H${W + 20} V500 Q820 610 540 600 Q260 610 -20 500 Z`, fill: '#d8d0c0', ...OUT }, cam);
  S('rect', { x: 110, y: 250, width: 290, height: 140, rx: 36, fill: '#c9c0ae', ...OUT, 'stroke-width': 7, transform: 'rotate(-6 255 320)' }, cam);
  S('rect', { x: 680, y: 250, width: 290, height: 140, rx: 36, fill: '#c9c0ae', ...OUT, 'stroke-width': 7, transform: 'rotate(6 825 320)' }, cam);
  S('rect', { x: 440, y: 300, width: 200, height: 70, rx: 20, fill: '#bdb4a2', ...OUT, 'stroke-width': 7 }, cam);
  S('circle', { cx: 500, cy: 335, r: 14, fill: '#fff7d6', ...OUT, 'stroke-width': 5 }, cam);
  S('circle', { cx: 580, cy: 335, r: 14, fill: '#fff7d6', ...OUT, 'stroke-width': 5 }, cam);

  // seats
  for (const x of [270, 810]) {
    S('rect', { x: x - 120, y: 640, width: 240, height: 190, rx: 60, fill: '#2f2e35', ...OUT }, cam);
    S('rect', { x: x - 250, y: 800, width: 500, height: 1100, rx: 110, fill: '#35343c', ...OUT }, cam);
    S('path', { d: `M${x - 150} 900 Q${x} 860 ${x + 150} 900`, fill: 'none', stroke: '#24232a', 'stroke-width': 8 }, cam);
  }

  const D = makeChar('D', cam, { belt: 1 });
  const P = makeChar('P', cam, { belt: -1 });

  // what is in front of them: console, wheel, dashboard
  const front = S('g', {}, cam);
  S('rect', { x: 430, y: 1500, width: 220, height: 500, rx: 50, fill: '#26252b', ...OUT }, front);
  S('rect', { x: 512, y: 1420, width: 56, height: 130, rx: 24, fill: '#3c3b44', ...OUT }, front);
  S('circle', { cx: 540, cy: 1410, r: 44, fill: '#17171b', ...OUT }, front);
  S('path', { d: `M-20 1800 Q540 1700 ${W + 20} 1800 V${H + 20} H-20 Z`, fill: '#1f1e23', ...OUT }, front);
  const wheel = S('g', {}, front);
  S('ellipse', { cx: 230, cy: 1790, rx: 330, ry: 190, fill: 'none', stroke: INK, 'stroke-width': 78 }, wheel);
  S('ellipse', { cx: 230, cy: 1790, rx: 330, ry: 190, fill: 'none', stroke: '#33323a', 'stroke-width': 60 }, wheel);
  S('path', { d: 'M230 1790 L-60 1700 M230 1790 L520 1700 M230 1790 L230 1990', stroke: '#33323a', 'stroke-width': 60, 'stroke-linecap': 'round' }, wheel);
  S('circle', { cx: 230, cy: 1790, r: 70, fill: '#26252b', ...OUT }, wheel);

  const over = S('g', {}, svg); // above the camera: whatever a shot adds
  const DX = 270, PX = 810, HY = 1010;
  const at = (list, r) => { let v = list[0][1]; for (const [s, x] of list) if (r >= s) v = x; return v; };
  const since = (list, r) => { let v = list[0][0]; for (const [s] of list) if (r >= s) v = s; return r - v; };

  const api = { svg, cam, over, D, P, front };
  api.frame = (t) => {
    const r = cfg.r0 + t;
    const who = at(cfg.spk, r), shot = at(cfg.cams, r), k = since(cfg.cams, r);
    set(far, { transform: `translate(${-((r * 60) % 1650)} 0)` });
    set(near, { transform: `translate(${-((r * 260) % 1500)} 0)` });
    const jig = Math.sin(r * 31) * 1.5;
    const z = 1 + Math.min(k, 6) * 0.006;
    if (shot === 'D') set(cam, { transform: `translate(${540 - DX * 1.75 * z} ${930 - HY * 1.75 * z + jig}) scale(${1.75 * z})` });
    else if (shot === 'P') set(cam, { transform: `translate(${540 - PX * 1.75 * z} ${930 - HY * 1.75 * z + jig}) scale(${1.75 * z})` });
    else { const s2 = 1.22 * z; set(cam, { transform: `translate(${540 - 540 * s2} ${900 - 1010 * s2 + jig}) scale(${s2})` }); }
    set(wheel, { transform: `rotate(${Math.sin(r * 0.9) * 3} 230 1790)` });

    const m = talk(r), beat = Math.sin(r * 9);
    const dTalk = who === 'D', pTalk = who === 'P';
    const dp = {
      x: DX, y: HY, mouth: dTalk ? m : 0, bob: dTalk ? m * 16 : 0, tilt: dTalk ? beat * 3 * m - 2 : 4,
      look: dTalk ? [0.5 + Math.sin(r * 1.3) * 0.4, -0.1] : pTalk ? [1, 0] : [0.2, 0],
      blink: blinkAt(r, 0.4), brow: dTalk ? 0.4 + m : 0, smile: pTalk ? 0.6 : 0.3,
      hand: dTalk && shot !== 'P' ? [-150 + beat * 26, 470 - m * 120] : null, shoulder: -170, handRot: -20 + beat * 10,
    };
    const pp = {
      x: PX, y: HY, mouth: pTalk ? m : 0, bob: pTalk ? m * 16 : 0, tilt: pTalk ? beat * 3 * m + 2 : -4,
      look: pTalk ? [-0.5 + Math.sin(r * 1.1) * 0.4, -0.1] : dTalk ? [-1, 0] : [-0.2, 0],
      blink: blinkAt(r, 1.9), brow: pTalk ? 0.4 + m : 0, smile: dTalk ? 0.6 : 0.3,
      hand: pTalk && shot !== 'D' ? [150 - beat * 26, 470 - m * 120] : null, shoulder: 170, handRot: 20 - beat * 10,
    };
    D.belts[1].style.display = D.belts[2].style.display = 'none';
    P.belts[1].style.display = P.belts[2].style.display = 'none';
    cfg.extra?.(t, r, { ...api, dp, pp, who, shot });
    D.pose(dp); P.pose(pp);
  };
  return api;
}
