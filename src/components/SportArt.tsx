import { useEffect, useRef } from "react";
import { hashSeed, mulberry32 } from "../lib/generative";

const TAU = Math.PI * 2;

type Rand = () => number;

// "Seam study": a baseball in the centre of the frame, its two stitched seams
// drawn as the classic facing curves, with faint orbit arcs suggesting spin.
function drawBaseball(ctx: CanvasRenderingContext2D, w: number, h: number, rand: Rand) {
  const R = 0.34 * Math.min(w, h);
  const cx = w * 0.5;
  const cy = h * 0.5;

  // Faint spin arcs behind the ball.
  const arcCount = 40 + Math.floor(rand() * 31);
  ctx.lineWidth = 0.75;
  for (let i = 0; i < arcCount; i++) {
    const radius = R * (1.08 + rand() * 0.9);
    const ry = radius * (0.6 + rand() * 0.4);
    const rotation = rand() * Math.PI;
    const start = rand() * TAU;
    const end = start + TAU * (0.4 + rand() * 0.5);
    ctx.globalAlpha = 0.08 + rand() * 0.12;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, ry, rotation, start, end);
    ctx.stroke();
  }

  // Ball outline.
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, TAU);
  ctx.stroke();

  // Two mirrored S-shaped seams, rotated by a seeded angle.
  const turn = -Math.PI / 4 + rand() * 0.4;
  const cos = Math.cos(turn);
  const sin = Math.sin(turn);
  const seamSamples = 240;

  // Each seam is an arc of a circle centred just outside the ball, so the two
  // seams bow toward each other like the real stitching. s runs 0..1.
  const seamPoint = (s: number, mirror: number): [number, number] => {
    const theta = Math.PI + (2 * s - 1) * 0.86;
    const x = mirror * (1.3 * R + R * Math.cos(theta));
    const y = R * Math.sin(theta);
    return [cx + x * cos - y * sin, cy + x * sin + y * cos];
  };

  for (const mirror of [1, -1]) {
    // Build a polyline and walk it to place stitches at fixed arc length.
    const pts: [number, number][] = [];
    for (let i = 0; i <= seamSamples; i++) pts.push(seamPoint(i / seamSamples, mirror));

    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();

    // Stitches: small V ticks every ~14px, angle alternating along the seam.
    const spacing = 14;
    const arm = 5;
    let nextStitch = spacing / 2;
    let travelled = 0;
    let stitch = 0;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 0.8;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const segLen = Math.hypot(x1 - x0, y1 - y0);
      if (segLen === 0) continue;
      const tx = (x1 - x0) / segLen;
      const ty = (y1 - y0) / segLen;
      const nx = -ty;
      const ny = tx;
      const segEnd = travelled + segLen;
      while (nextStitch <= segEnd) {
        const t = (nextStitch - travelled) / segLen;
        const px = x0 + (x1 - x0) * t;
        const py = y0 + (y1 - y0) * t;
        const angle = stitch % 2 === 0 ? 0.55 : 0.85;
        // Two V's per stitch, one on each side of the seam, arms tilted
        // along the seam direction. The angle alternates.
        for (const side of [1, -1]) {
          for (const along of [1, -1]) {
            const dx = side * nx * Math.cos(angle) + along * tx * Math.sin(angle);
            const dy = side * ny * Math.cos(angle) + along * ty * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + dx * arm, py + dy * arm);
            ctx.stroke();
          }
        }
        stitch++;
        nextStitch += spacing;
      }
      travelled = segEnd;
    }
  }
}

// "Gridiron study": yard lines, hash marks and yard numbers, with a seeded
// chalkboard play drawn on top.
function drawFootball(ctx: CanvasRenderingContext2D, w: number, h: number, rand: Rand) {
  // Yard lines every 1/10 of the width.
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = (i * w) / 10;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Hash marks on two rows, every 1/50 of the width.
  const rows = [0.38, 0.62];
  for (let k = 0; k <= 50; k++) {
    const x = (k * w) / 50;
    for (const row of rows) {
      const y = row * h;
      ctx.beginPath();
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
      ctx.stroke();
    }
  }

  // Yard numbers near the bottom.
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = ctx.strokeStyle;
  ctx.font = `11px "IBM Plex Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const yards = ["10", "20", "30", "40", "50", "40", "30", "20", "10"];
  yards.forEach((label, i) => ctx.fillText(label, ((i + 1) * w) / 10, h * 0.9));

  // Seeded play diagram.
  const line = 0.45 * w;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 1.2;

  const offense: [number, number][] = [];
  const offenseCount = 5;
  for (let i = 0; i < offenseCount; i++) {
    const y = h * (0.3 + (0.4 * (i + 0.5)) / offenseCount + (rand() - 0.5) * 0.05);
    const x = line + (rand() - 0.5) * 3;
    offense.push([x, y]);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, TAU);
    ctx.stroke();
  }

  const defenseCount = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < defenseCount; i++) {
    const x = line + w * (0.06 + rand() * 0.14);
    const y = h * (0.3 + (0.4 * (i + 0.5)) / defenseCount + (rand() - 0.5) * 0.06);
    const s = 5;
    ctx.beginPath();
    ctx.moveTo(x - s, y - s);
    ctx.lineTo(x + s, y + s);
    ctx.moveTo(x + s, y - s);
    ctx.lineTo(x - s, y + s);
    ctx.stroke();
  }

  // Routes: quadratic curves with a small arrowhead at the end.
  const routeCount = 3 + Math.floor(rand() * 2);
  for (let i = 0; i < routeCount; i++) {
    const [sx, sy] = offense[i % offense.length];
    const ex = sx + w * (0.14 + rand() * 0.14);
    const ey = sy + (rand() - 0.5) * h * 0.3;
    const cxp = (sx + ex) / 2 + (rand() - 0.5) * w * 0.08;
    const cyp = (sy + ey) / 2 + (rand() - 0.5) * h * 0.18;
    ctx.beginPath();
    ctx.moveTo(sx + 6, sy);
    ctx.quadraticCurveTo(cxp, cyp, ex, ey);
    ctx.stroke();

    // Arrowhead aligned to the curve's end tangent.
    const angle = Math.atan2(ey - cyp, ex - cxp);
    const head = 7;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - head * Math.cos(angle - 0.45), ey - head * Math.sin(angle - 0.45));
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - head * Math.cos(angle + 0.45), ey - head * Math.sin(angle + 0.45));
    ctx.stroke();
  }
}

export default function SportArt({ kind, label }: { kind: "baseball" | "football"; label: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const draw = () => {
      const cssWidth = wrapper.clientWidth;
      const cssHeight = wrapper.clientHeight;
      if (cssWidth === 0 || cssHeight === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Ink colour comes from CSS via the canvas's computed `color`.
      ctx.strokeStyle = getComputedStyle(canvas).color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Seeded from the label, so the same exhibit always draws the same way.
      const rand = mulberry32(hashSeed(`${kind}:${label}`));
      if (kind === "baseball") drawBaseball(ctx, cssWidth, cssHeight, rand);
      else drawFootball(ctx, cssWidth, cssHeight, rand);

      ctx.globalAlpha = 1;
    };

    draw();

    const resizeObserver = new ResizeObserver(() => draw());
    resizeObserver.observe(wrapper);

    let themeObserver: MutationObserver | null = null;
    const portfolio = canvas.closest(".portfolio");
    if (portfolio) {
      themeObserver = new MutationObserver(() => draw());
      themeObserver.observe(portfolio, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    }

    return () => {
      resizeObserver.disconnect();
      themeObserver?.disconnect();
    };
  }, [kind, label]);

  return (
    <div ref={wrapperRef} className="sport-art" style={{ position: "absolute", inset: 0 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
