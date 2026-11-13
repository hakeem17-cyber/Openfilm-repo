// Props shared by the cutaway shots.
import { S, set, INK, OUT, W, H, text } from './toon.js';

/** A bride and groom as simple shapes, about 300 tall, standing on y = 0. */
export function couple(parent, fill) {
  const g = S('g', {}, parent), o = fill ? { fill } : null;
  const st = fill ? {} : { ...OUT, 'stroke-width': 7 };
  S('path', { d: 'M-150 0 L-110 -170 Q-80 -200 -50 -170 L-10 0 Z', fill: fill ?? '#fff7ee', ...st }, g);
  S('circle', { cx: -80, cy: -225, r: 42, fill: fill ?? '#e2b48c', ...st }, g);
  S('path', { d: 'M-124 -230 Q-130 -290 -80 -280 Q-30 -290 -36 -230 Q-80 -262 -124 -230 Z', fill: fill ?? '#f4f0ff', ...st }, g);
  S('path', { d: 'M20 0 L26 -190 Q70 -215 114 -190 L120 0 Z', fill: fill ?? '#30303a', ...st }, g);
  S('circle', { cx: 70, cy: -238, r: 42, fill: fill ?? '#c99a6b', ...st }, g);
  S('path', { d: 'M28 -250 Q30 -292 70 -288 Q112 -292 112 -250 Q70 -272 28 -250 Z', fill: fill ?? '#1d1a1c', ...st }, g);
  return g;
}

/** A camera seen from the side, lens to the right, about 260 wide; the body's middle is the origin. */
export function camera(parent, lens = 160) {
  const g = S('g', {}, parent);
  S('rect', { x: -120, y: -80, width: 200, height: 150, rx: 22, fill: '#2b2b33', ...OUT }, g);
  S('rect', { x: -70, y: -118, width: 90, height: 46, rx: 12, fill: '#2b2b33', ...OUT }, g);
  S('rect', { x: 78, y: -58, width: lens, height: 108, rx: 16, fill: '#3d3d48', ...OUT }, g);
  S('rect', { x: 78 + lens - 26, y: -72, width: 40, height: 136, rx: 14, fill: '#1c1c22', ...OUT }, g);
  S('circle', { cx: -84, cy: -50, r: 12, fill: '#e23b3b' }, g);
  return g;
}

/** A viewfinder over the picture: corner marks and a blinking REC. Returns a function of t. */
export function viewfinder(parent) {
  const g = S('g', {}, parent);
  const m = 70, l = 130, a = { fill: 'none', stroke: '#fff', 'stroke-width': 12, 'stroke-linecap': 'round' };
  for (const [x, y, sx, sy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]])
    S('path', { d: `M${x} ${y + sy * l} L${x} ${y} L${x + sx * l} ${y}`, ...a }, g);
  const dot = S('circle', { cx: 150, cy: 190, r: 26, fill: '#ff3b30' }, g);
  text(g, 'REC', 260, 216, 76, '#fff');
  S('rect', { x: 800, y: 150, width: 140, height: 70, rx: 12, fill: 'none', stroke: '#fff', 'stroke-width': 10 }, g);
  S('rect', { x: 814, y: 164, width: 70, height: 42, fill: '#fff' }, g);
  return (t) => { dot.style.opacity = (t * 2) % 1 < 0.5 ? 1 : 0.15; };
}

/** A burst behind a word: a spiky shape around the origin. */
export function burst(parent, r, fill = '#ffd23f') {
  let d = '';
  for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2, k = i % 2 ? r : r * 0.74; d += `${i ? 'L' : 'M'}${Math.cos(a) * k * 1.5} ${Math.sin(a) * k}`; }
  return S('path', { d: d + 'Z', fill, ...OUT }, parent);
}
