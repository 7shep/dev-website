import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const INITIAL_COUNT = 400;
const PARTICLE_LIMIT = 15000;
const CONNECTION_DIST = 140;
const REPULSION_RADIUS = 80;   // within this: gently push away
const ATTRACTION_RADIUS = 260; // between repulsion and this: pull toward cursor
const REPULSION_STRENGTH = 0.06;
const ATTRACTION_STRENGTH = 0.018;
const BASE_SPEED = 0.3;
const MAX_SPEED = 2.0;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let animId: number;

    function resize() {
      const c = canvasRef.current;
      if (!c) return;
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Seed initial particles spread across canvas
    for (let i = 0; i < INITIAL_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * BASE_SPEED * 2,
        vy: (Math.random() - 0.5) * BASE_SPEED * 2,
      });
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only track while inside canvas bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseX = x;
        mouseY = y;
      } else {
        mouseX = -9999;
        mouseY = -9999;
      }
    }

    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      const spawns = Math.min(5, PARTICLE_LIMIT - particles.length);
      for (let i = 0; i < spawns; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    function tick() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      // Update particles
      for (const p of particles) {
        // toward = vector pointing from particle to cursor
        const tx = mouseX - p.x;
        const ty = mouseY - p.y;
        const distSq = tx * tx + ty * ty;

        if (distSq > 0) {
          const dist = Math.sqrt(distSq);

          if (dist < REPULSION_RADIUS) {
            // Inside repulsion zone: push away (small nudge only)
            const t = 1 - dist / REPULSION_RADIUS;
            p.vx -= (tx / dist) * t * REPULSION_STRENGTH;
            p.vy -= (ty / dist) * t * REPULSION_STRENGTH;
          } else if (dist < ATTRACTION_RADIUS) {
            // Outside repulsion but within follow zone: attract toward cursor
            const t = (dist - REPULSION_RADIUS) / (ATTRACTION_RADIUS - REPULSION_RADIUS);
            // Force peaks near the repulsion boundary and fades at ATTRACTION_RADIUS
            const force = Math.sin(t * Math.PI) * ATTRACTION_STRENGTH;
            p.vx += (tx / dist) * force;
            p.vy += (ty / dist) * force;
          }
        }

        // Friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap (soft bounce off edges)
        if (p.x < 0)  { p.x = 0;  p.vx = Math.abs(p.vx); }
        if (p.x > w)  { p.x = w;  p.vx = -Math.abs(p.vx); }
        if (p.y < 0)  { p.y = 0;  p.vy = Math.abs(p.vy); }
        if (p.y > h)  { p.y = h;  p.vy = -Math.abs(p.vy); }
      }

      // Draw connections (O(n²) but n is bounded)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
            const t = 1 - Math.sqrt(distSq) / CONNECTION_DIST;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(204,151,255,${t * 0.28})`;
            ctx!.lineWidth = t * 1.2;
            ctx!.stroke();
          }
        }
      }

      // Draw dots on top of lines
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(204,151,255,0.65)";
        ctx!.fill();
      }

      animId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
