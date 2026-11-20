import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "intro-seen";
const START_YEAR = 2006;
// Total intro is 1.5 s. Phase thresholds are the earlier timeline (count, fade,
// dismiss) scaled proportionally to fit that budget.
const COUNT_MS = 800;
const FADE_MS = 1220;
const DISMISS_MS = 1500;

function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable: the intro may replay on the next load. Not fatal.
  }
}

export default function Entrance() {
  const [active, setActive] = useState(
    () =>
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !hasSeenIntro(),
  );
  const overlay = useRef<HTMLDivElement>(null);
  const century = useRef<HTMLSpanElement>(null);
  const number = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active) return;

    markIntroSeen();
    const endYear = new Date().getFullYear();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const start = performance.now();
    const dismiss = () => setActive(false);
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / COUNT_MS, 1);
      const year = START_YEAR + Math.floor((endYear - START_YEAR) * progress ** 3);
      if (century.current) {
        century.current.textContent = String(Math.floor(year / 100));
      }
      if (number.current) {
        number.current.textContent = String(year % 100).padStart(2, "0");
      }
      if (overlay.current) {
        overlay.current.style.setProperty("--intro-progress", String(progress));
        overlay.current.dataset.phase =
          elapsed >= FADE_MS ? "fade" : elapsed >= COUNT_MS ? "welcome" : "count";
      }
      if (elapsed >= DISMISS_MS) dismiss();
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
        <span className="entrance-year"><span ref={century}>20</span><span ref={number}>06</span></span>
        <div className="entrance-welcome-mask">
          <p className="entrance-welcome">
            <span>Alex Shepherd,</span>{" "}<span>building since</span>{" "}<span>2006</span>
          </p>
        </div>
        <span className="entrance-rule" />
      </div>
    </div>
  );
}
