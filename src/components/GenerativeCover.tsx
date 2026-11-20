import { useEffect, useRef } from "react";
import { contourLines, flowField, gridLines } from "../lib/generative";

export default function GenerativeCover({
  seed,
  label,
  className,
  variant = "flow",
}: {
  seed: string;
  label: string;
  className?: string;
  variant?: "flow" | "grid" | "contour";
}) {
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

      const strokes =
        variant === "grid"
          ? gridLines(seed, cssWidth, cssHeight)
          : variant === "contour"
            ? contourLines(seed, cssWidth, cssHeight)
            : flowField(seed, cssWidth, cssHeight);
      for (const stroke of strokes) {
        ctx.lineWidth = stroke.width;
        ctx.globalAlpha = stroke.alpha;
        ctx.beginPath();
        stroke.points.forEach(([x, y], i) => {
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
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
  }, [seed, variant]);

  return (
    <div
      ref={wrapperRef}
      className={`generative-cover${className ? " " + className : ""}`}
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
