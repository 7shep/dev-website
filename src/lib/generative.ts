// Pure, framework-free generative helpers. No browser API access.
// Erasable TypeScript only (no enums, namespaces or parameter properties)
// so this file can also run directly under Node's type stripping.

export type Stroke = { points: [number, number][]; width: number; alpha: number };

const TAU = Math.PI * 2;

// FNV-1a 32-bit hash of a string. Returns an unsigned 32-bit integer.
export function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32 PRNG. Returns floats in [0, 1).
export function mulberry32(a: number): () => number {
  let state = a | 0;
  return function () {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type AngleField = (nx: number, ny: number) => number;

// Draws the three seeded terms (12 PRNG calls, same order as before) and
// returns the angle field they define. Shared by makeField and flowField so
// both consume the PRNG identically.
function fieldFromRand(rand: () => number): AngleField {
  const terms: { amp: number; fx: number; fy: number; phase: number }[] = [];
  for (let i = 0; i < 3; i++) {
    terms.push({
      amp: 0.8 + rand() * 1.2,
      fx: 0.5 + rand() * 2.5,
      fy: 0.5 + rand() * 2.5,
      phase: rand() * TAU,
    });
  }
  return (nx: number, ny: number): number => {
    let sum = 0;
    for (const t of terms) {
      sum += t.amp * Math.sin(TAU * (t.fx * nx + t.fy * ny) + t.phase);
    }
    return sum;
  };
}

// Seeded angle field. Returns the angle in radians at normalised coords
// (nx, ny, roughly [0, 1]). Same seed always yields the same field.
export function makeField(seed: string): AngleField {
  return fieldFromRand(mulberry32(hashSeed(seed)));
}

// Deterministic flow field: seeded lines that follow a smooth angle field
// built from a few seeded sine terms. Every returned point lies inside
// [0, width] x [0, height].
export function flowField(
  seed: string,
  width: number,
  height: number,
  options?: { lines?: number; steps?: number },
): Stroke[] {
  const lineCount = options?.lines ?? 220;
  const steps = options?.steps ?? 90;
  if (!(width > 0 && height > 0)) return [];

  const rand = mulberry32(hashSeed(seed));

  // Seeded terms; see fieldFromRand. Frequencies are in cycles across the canvas.
  const field = fieldFromRand(rand);

  const angleAt = (x: number, y: number): number => field(x / width, y / height);

  const step = Math.min(width, height) / 180;
  const inBounds = (x: number, y: number) =>
    x >= 0 && x <= width && y >= 0 && y <= height;

  // Trace from a start point in one direction (sign = 1 or -1).
  const trace = (sx: number, sy: number, sign: number): [number, number][] => {
    const out: [number, number][] = [];
    let x = sx;
    let y = sy;
    for (let s = 0; s < steps; s++) {
      const a = angleAt(x, y);
      const nxp = x + Math.cos(a) * step * sign;
      const nyp = y + Math.sin(a) * step * sign;
      if (!inBounds(nxp, nyp)) break;
      out.push([nxp, nyp]);
      x = nxp;
      y = nyp;
    }
    return out;
  };

  const strokes: Stroke[] = [];
  for (let i = 0; i < lineCount; i++) {
    const sx = rand() * width;
    const sy = rand() * height;
    const lineWidth = 0.4 + rand() * 0.8;
    const alpha = 0.25 + rand() * 0.65;

    const backward = trace(sx, sy, -1).reverse();
    const forward = trace(sx, sy, 1);
    const points: [number, number][] = [
      ...backward,
      [sx, sy],
      ...forward,
    ];
    if (points.length < 2) continue;
    strokes.push({ points, width: lineWidth, alpha });
  }
  return strokes;
}
