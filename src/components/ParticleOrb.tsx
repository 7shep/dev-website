import { useEffect, useRef } from "react";

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
  opacity: number;
  opacityDelta: number;
}

const COLORS = [
  "rgba(204,151,255,", // primary purple
  "rgba(0,251,251,",   // secondary cyan
  "rgba(255,81,250,",  // tertiary pink
];

export default function ParticleOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 128;
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 8 + Math.random() * 48,
      speed: (0.004 + Math.random() * 0.012) * (Math.random() < 0.5 ? 1 : -1),
      size: 0.5 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.2 + Math.random() * 0.7,
      opacityDelta: (0.003 + Math.random() * 0.007) * (Math.random() < 0.5 ? 1 : -1),
    }));

    let raf: number;

    function draw() {
      ctx!.clearRect(0, 0, SIZE, SIZE);

      // Soft core glow
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 45);
      glow.addColorStop(0, "rgba(204,151,255,0.12)");
      glow.addColorStop(0.5, "rgba(0,251,251,0.05)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, SIZE, SIZE);

      for (const p of particles) {
        p.angle += p.speed;
        p.opacity += p.opacityDelta;
        if (p.opacity >= 0.9 || p.opacity <= 0.1) p.opacityDelta *= -1;

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        ctx!.beginPath();
        ctx!.arc(x, y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `${p.color}${p.opacity.toFixed(2)})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} width={128} height={128} className="w-full h-full" />;
}
