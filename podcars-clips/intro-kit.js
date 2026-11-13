// What the intro variations share: the little car seen from the side.
import { S, set, OUT, INK, makeChar, blinkAt, fontReady } from './toon.js';

/** The car around the middle of its floor, facing right. Returns { g, frame(x, t, bounce) }. */
export function sideCar(svg, parent, color = '#2f9fd6', id = 'win') {
  const car = S('g', {}, parent), bodyG = S('g', {}, car);
  S('path', { d: 'M-430 -40 Q-440 -170 -330 -190 L-230 -200 Q-150 -380 0 -390 L150 -390 Q260 -380 330 -210 L400 -190 Q450 -170 440 -40 Z', fill: color, ...OUT, 'stroke-width': 12 }, bodyG);
  const glass = 'M-190 -205 Q-130 -340 0 -345 L-6 -205 Z M30 -345 L140 -345 Q220 -335 280 -205 L30 -205 Z';
  S('path', { d: glass, fill: '#cfeefa', ...OUT }, bodyG);
  S('path', { d: glass }, S('clipPath', { id }, svg));
  const riders = S('g', { 'clip-path': `url(#${id})` }, bodyG);
  const P = makeChar('P', riders), D = makeChar('D', riders);
  S('rect', { x: 380, y: -150, width: 60, height: 50, rx: 14, fill: '#fff7d6', ...OUT, 'stroke-width': 7 }, bodyG);
  S('rect', { x: -440, y: -150, width: 40, height: 50, rx: 12, fill: '#e2483d', ...OUT, 'stroke-width': 7 }, bodyG);
  S('path', { d: 'M-430 -80 H440', ...OUT, 'stroke-width': 7 }, bodyG);
  const wheels = [-250, 250].map((x) => {
    const w = S('g', {}, car);
    S('circle', { r: 86, fill: '#26252b', ...OUT, 'stroke-width': 12 }, w);
    S('circle', { r: 40, fill: '#c9c9d2', ...OUT, 'stroke-width': 7 }, w);
    S('path', { d: 'M-40 0 H40 M0 -40 V40', ...OUT, 'stroke-width': 8 }, w);
    return [w, x];
  });
  return { g: car, frame(x, t, bounce = 0) {
    set(bodyG, { transform: `translate(0 ${-66 - bounce * 16})` });
    wheels.forEach(([w, wx]) => set(w, { transform: `translate(${wx} -60) rotate(${x * 0.7})` }));
    P.pose({ x: -95, y: -265, s: 0.3, look: [1, 0], smile: 1, blink: blinkAt(t, 1) });
    D.pose({ x: 150, y: -270, s: 0.3, look: [1, 0], smile: 1, mouth: bounce * 0.6, blink: blinkAt(t, 0.2) });
  } };
}

/** Both fonts the intros use. */
export const logoReady = () => Promise.all([fontReady(), new FontFace('Lilita', 'url(lilita.woff2)').load().then((f) => { document.fonts.add(f); }).catch(() => {})]);

/** The show's name as one word, "Pod" in c1 and "Cars" in c2, centred on the origin. */
export function podcars(parent, size, c1, c2, sw = 30, extra = {}, strokes = [INK, INK]) {
  const t = S('text', { x: 0, y: 0, 'font-size': size, 'text-anchor': 'middle', 'stroke-width': sw, 'paint-order': 'stroke', 'stroke-linejoin': 'round', style: 'font-family:Lilita,sans-serif;letter-spacing:0', ...extra }, parent);
  S('tspan', { fill: c1, stroke: strokes[0] }, t).textContent = 'Pod';
  S('tspan', { fill: c2, stroke: strokes[1] }, t).textContent = 'Cars';
  return t;
}
