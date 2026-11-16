import { useEffect, useRef } from "react";
import { flowField, hashSeed, makeField, mulberry32 } from "../lib/generative";

type Particle = { x: number; y: number; age: number; maxLife: number; trail: number[] };

const TRAIL = 36;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

// Live generative artwork for the hero. Ink particles are carried along a
// seeded flow field over an engraved static rendering of the same field, each
// trailing a short tapered comet. The animation only runs
// while the artwork is on screen, the tab is visible, the page is not paused
// and the visitor has not asked for reduced motion. Otherwise the static first
// paint stays on the canvas.
export default function HeroArtwork({
  seed,
  paused,
  label,
}: {
  seed: string;
  paused: boolean;
  label: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const syncRef = useRef<(() => void) | null>(null);

  // Pause only starts or stops the loop; the drawing set-up is not rebuilt.
  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const field = makeField(seed);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let w = 0;
    let h = 0;
    let ink = "";
    let bg = "";
    let rand = mulberry32(0);
    let particles: Particle[] = [];
    let rafId = 0;
    let onScreen = false;

    const shouldRun = () =>
      !pausedRef.current &&
      onScreen &&
      document.visibilityState === "visible" &&
      !reducedMotion.matches;

    const spawn = (p: Particle) => {
      p.x = rand() * w;
      p.y = rand() * h;
      p.age = 0;
      p.maxLife = 120 + rand() * 300;
      p.trail.length = 0;
    };

    // Engraved static field, painted once per size/theme into an offscreen layer.
    const layer = document.createElement("canvas");
    const layerCtx = layer.getContext("2d");

    const frame = () => {
      rafId = 0;

      // Repaint the background and the engraved field, then the moving comets.
      ctx.globalAlpha = 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(layer, 0, 0, w, h);

      const step = Math.min(w, h) / 320;
      for (const p of particles) {
        const a = field(p.x / w, p.y / h);
        const nx = p.x + Math.cos(a) * step;
        const ny = p.y + Math.sin(a) * step;
        p.age += 1;
        if (nx < 0 || nx > w || ny < 0 || ny > h || p.age >= p.maxLife) {
          spawn(p);
          continue;
        }
        p.x = nx;
        p.y = ny;
        p.trail.push(nx, ny);
        if (p.trail.length > TRAIL * 2) p.trail.splice(0, 2);
      }

      // Each trail is drawn in three bands, oldest faintest, so comets taper.
      ctx.strokeStyle = ink;
      ctx.lineWidth = 0.9;
      const bands = [0.12, 0.3, 0.65];
      const third = TRAIL / 3;
      bands.forEach((alpha, band) => {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (const p of particles) {
          const n = p.trail.length / 2;
          const from = Math.max(0, n - TRAIL + band * third - 1);
          const to = n - TRAIL + (band + 1) * third;
          if (to - from < 2) continue;
          ctx.moveTo(p.trail[from * 2], p.trail[from * 2 + 1]);
          for (let i = from + 1; i < to; i += 1) ctx.lineTo(p.trail[i * 2], p.trail[i * 2 + 1]);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      rafId = shouldRun() ? requestAnimationFrame(frame) : 0;
    };

    const sync = () => {
      if (shouldRun()) {
        if (rafId === 0) rafId = requestAnimationFrame(frame);
      } else if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    // Size the canvas, read colours, paint the static first frame and re-seed
    // particles. Runs on mount, on resize and on theme change.
    const init = () => {
      const cssWidth = wrapper.clientWidth;
      const cssHeight = wrapper.clientHeight;
      if (cssWidth === 0 || cssHeight === 0) return;

      const dpr = window.devicePixelRatio || 1;
      w = cssWidth;
      h = cssHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Ink colour comes from CSS via the canvas's computed `color`.
      const style = getComputedStyle(canvas);
      ink = style.color;
      bg = style.getPropertyValue("--hero-bg").trim() || style.backgroundColor;

      // Paint the engraved field into the offscreen layer, then show it.
      layer.width = canvas.width;
      layer.height = canvas.height;
      if (layerCtx) {
        layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        layerCtx.clearRect(0, 0, w, h);
        layerCtx.strokeStyle = ink;
        layerCtx.lineCap = "round";
        layerCtx.lineJoin = "round";
        for (const stroke of flowField(seed, w, h)) {
          layerCtx.lineWidth = stroke.width;
          layerCtx.globalAlpha = stroke.alpha * 0.45;
          layerCtx.beginPath();
          stroke.points.forEach(([x, y], i) => {
            if (i === 0) layerCtx.moveTo(x, y);
            else layerCtx.lineTo(x, y);
          });
          layerCtx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(layer, 0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      rand = mulberry32(hashSeed(seed + ":particles"));
      const count = Math.round(clamp((w * h) / 1100, 250, 900));
      particles = Array.from({ length: count }, () => {
        const p: Particle = { x: 0, y: 0, age: 0, maxLife: 0, trail: [] };
        spawn(p);
        return p;
      });

      sync();
    };

    syncRef.current = sync;
    init();

    const resizeObserver = new ResizeObserver(() => {
      if (wrapper.clientWidth !== w || wrapper.clientHeight !== h) init();
    });
    resizeObserver.observe(wrapper);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(canvas);

    let themeObserver: MutationObserver | null = null;
    const portfolio = canvas.closest(".portfolio");
    if (portfolio) {
      themeObserver = new MutationObserver(() => init());
      themeObserver.observe(portfolio, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    }

    const onVisibilityOrMotion = () => sync();
    document.addEventListener("visibilitychange", onVisibilityOrMotion);
    reducedMotion.addEventListener("change", onVisibilityOrMotion);

    return () => {
      syncRef.current = null;
      if (rafId !== 0) cancelAnimationFrame(rafId);
      rafId = 0;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityOrMotion);
      reducedMotion.removeEventListener("change", onVisibilityOrMotion);
    };
  }, [seed]);

  return (
    <div
      ref={wrapperRef}
      className="hero-artwork"
      style={{ position: "absolute", inset: 0 }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
