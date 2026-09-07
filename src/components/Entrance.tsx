import { useEffect, useRef, useState } from "react";

export default function Entrance() {
  const [active, setActive] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const overlay = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const start = performance.now();
    const dismiss = () => setActive(false);
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / 2000, 1);
      if (number.current) {
        number.current.textContent = String(
          6 + Math.floor(20 * progress ** 3),
        ).padStart(2, "0");
      }
      if (overlay.current) {
        overlay.current.style.setProperty("--intro-progress", String(progress));
        overlay.current.dataset.phase =
          elapsed >= 3050 ? "fade" : elapsed >= 2000 ? "welcome" : "count";
      }
      if (elapsed >= 3750) dismiss();
      else frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    window.addEventListener("wheel", dismiss, { passive: true });
    preference.addEventListener("change", dismiss);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("wheel", dismiss);
      preference.removeEventListener("change", dismiss);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="entrance-overlay" ref={overlay} data-phase="count" aria-hidden="true">
      <div className="entrance-content">
        <span className="entrance-year"><span>20</span><span ref={number}>06</span></span>
        <div className="entrance-welcome-mask">
          <p className="entrance-welcome">
            <span>Welcome</span>{" "}<span>to my</span>{" "}<span>Portfolio</span>
          </p>
        </div>
        <span className="entrance-rule" />
      </div>
    </div>
  );
}
