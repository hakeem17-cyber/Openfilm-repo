// Shared helpers for the StudioHakim intro pages. Every picture is a pure function of t.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const lerp = (a, b, k) => a + (b - a) * k;
export const easeOut = (x) => 1 - Math.pow(1 - x, 3);
export const easeIn = (x) => x * x * x;
export const easeInOut = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const expoOut = (x) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
export const backOut = (x) => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// Film grain on a canvas: one fixed noise tile, offset per frame.
export function makeGrain(canvas) {
  const g = canvas.getContext('2d');
  const tile = document.createElement('canvas'); tile.width = tile.height = 256;
  const tc = tile.getContext('2d'), img = tc.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) { const v = hash(i * 1.37) * 255; img.data.set([v, v, v, 255], i * 4); }
  tc.putImageData(img, 0, 0);
  const pattern = g.createPattern(tile, 'repeat');
  return (t) => {
    const f = Math.floor(t * 24);
    g.save(); g.fillStyle = pattern;
    g.translate(-Math.floor(hash(f) * 256), -Math.floor(hash(f + 77) * 256));
    g.fillRect(0, 0, canvas.width + 256, canvas.height + 256); g.restore();
  };
}

export const fontsReady = () => document.fonts.ready.then(() => Promise.all([...document.fonts].map((f) => f.load())));
