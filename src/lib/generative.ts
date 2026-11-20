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

// Seeded architectural lattice: near-regular horizontal and vertical rules
// with small seeded wobble, plus a few offset accent rules. Points stay inside
// [0, width] x [0, height].
export function gridLines(seed: string, width: number, height: number): Stroke[] {
  if (!(width > 0 && height > 0)) return [];
  const rand = mulberry32(hashSeed(seed + ":grid"));
  const cols = 8 + Math.floor(rand() * 5);
  const rows = 5 + Math.floor(rand() * 4);
  const wobble = Math.min(width, height) * 0.012;
  const clamp = (v: number, max: number) => Math.min(max, Math.max(0, v));
  const segs = 24;
  const strokes: Stroke[] = [];

  const colX: number[] = [];
  for (let c = 0; c <= cols; c++) colX.push(clamp((c / cols) * width + (rand() - 0.5) * (width / cols) * 0.5, width));
  const rowY: number[] = [];
  for (let r = 0; r <= rows; r++) rowY.push(clamp((r / rows) * height + (rand() - 0.5) * (height / rows) * 0.5, height));

  for (const x0 of colX) {
    const phase = rand() * TAU;
    const points: [number, number][] = [];
    for (let i = 0; i <= segs; i++) {
      points.push([clamp(x0 + Math.sin(phase + i * 0.5) * wobble, width), (i / segs) * height]);
    }
    strokes.push({ points, width: 0.5 + rand() * 0.6, alpha: 0.3 + rand() * 0.5 });
  }
  for (const y0 of rowY) {
    const phase = rand() * TAU;
    const points: [number, number][] = [];
    for (let i = 0; i <= segs; i++) {
      points.push([(i / segs) * width, clamp(y0 + Math.sin(phase + i * 0.5) * wobble, height)]);
    }
    strokes.push({ points, width: 0.5 + rand() * 0.6, alpha: 0.3 + rand() * 0.5 });
  }
  // Offset accent rules: short heavier segments along random rules.
  for (let k = 0; k < 14; k++) {
    const horizontal = rand() < 0.5;
    const len = 0.1 + rand() * 0.3;
    const start = rand() * (1 - len);
    if (horizontal) {
      const y = clamp(rowY[Math.floor(rand() * rowY.length)] + (rand() - 0.5) * 6, height);
      strokes.push({ points: [[start * width, y], [(start + len) * width, y]], width: 1.4, alpha: 0.8 });
    } else {
      const x = clamp(colX[Math.floor(rand() * colX.length)] + (rand() - 0.5) * 6, width);
      strokes.push({ points: [[x, start * height], [x, (start + len) * height]], width: 1.4, alpha: 0.8 });
    }
  }
  return strokes;
}

// Seeded topographic contours: marching squares over a smooth seeded noise
// field, one stroke per iso-level segment. Points stay inside the canvas.
export function contourLines(
  seed: string,
  width: number,
  height: number,
  options?: { levels?: number; cell?: number },
): Stroke[] {
  if (!(width > 0 && height > 0)) return [];
  const rand = mulberry32(hashSeed(seed + ":contour"));
  const terms: { amp: number; fx: number; fy: number; phase: number }[] = [];
  for (let i = 0; i < 5; i++) {
    terms.push({ amp: 0.4 + rand() * 0.8, fx: 0.4 + rand() * 2, fy: 0.4 + rand() * 2, phase: rand() * TAU });
  }
  const value = (nx: number, ny: number) => {
    let s = 0;
    for (const t of terms) s += t.amp * Math.sin(TAU * (t.fx * nx + t.fy * ny) + t.phase);
    return s;
  };
  const levels = options?.levels ?? 14;
  const cell = options?.cell ?? Math.max(4, Math.min(width, height) / 40);
  const nx = Math.max(2, Math.ceil(width / cell));
  const ny = Math.max(2, Math.ceil(height / cell));
  const grid: number[][] = [];
  let lo = Infinity;
  let hi = -Infinity;
  for (let j = 0; j <= ny; j++) {
    const row: number[] = [];
    for (let i = 0; i <= nx; i++) {
      const v = value(i / nx, j / ny);
      row.push(v);
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    grid.push(row);
  }
  const strokes: Stroke[] = [];
  const sx = width / nx;
  const sy = height / ny;
  for (let l = 1; l <= levels; l++) {
    const iso = lo + ((hi - lo) * l) / (levels + 1);
    const major = l % 4 === 0;
    const w = major ? 1.1 : 0.55;
    const a = major ? 0.85 : 0.45;
    const lerp = (p: number, q: number) => (iso - p) / (q - p);
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const tl = grid[j][i];
        const tr = grid[j][i + 1];
        const br = grid[j + 1][i + 1];
        const bl = grid[j + 1][i];
        const x0 = i * sx;
        const y0 = j * sy;
        const pts: [number, number][] = [];
        if (tl < iso !== tr < iso) pts.push([x0 + lerp(tl, tr) * sx, y0]);
        if (tr < iso !== br < iso) pts.push([x0 + sx, y0 + lerp(tr, br) * sy]);
        if (bl < iso !== br < iso) pts.push([x0 + lerp(bl, br) * sx, y0 + sy]);
        if (tl < iso !== bl < iso) pts.push([x0, y0 + lerp(tl, bl) * sy]);
        if (pts.length === 2) strokes.push({ points: pts, width: w, alpha: a });
        else if (pts.length === 4) {
          strokes.push({ points: [pts[0], pts[1]], width: w, alpha: a });
          strokes.push({ points: [pts[2], pts[3]], width: w, alpha: a });
        }
      }
    }
  }
  return strokes;
}
