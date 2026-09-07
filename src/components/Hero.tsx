import { lazy, Suspense, useState } from "react";
import { TbArrowDownRight, TbPlayerPause, TbPlayerPlay } from "react-icons/tb";
const PersonalObjects = lazy(() => import("./PersonalObjects"));
export default function Hero() {
  const [paused, setPaused] = useState(false);
  return (
    <section id="home" className="hero wrap">
      <p className="hero-intro">Developer. Student. Always building.</p>
      <div className="hero-composition">
        <h1 aria-label="Alex Shepherd">
          <span className="name-first">Alex</span>
          <span className="name-last">
            Shepherd<span className="name-period">.</span>
          </span>
        </h1>
        <div className="hero-objects">
          <Suspense fallback={<div className="object-fallback" aria-hidden />}>
            <PersonalObjects paused={paused} />
          </Suspense>
        </div>
        {/* <span className="hero-aside">
          A little of what
          <br />
          makes me, me.
        </span> */}
      </div>
      <div className="hero-bottom">
        <div className="hero-copy">
          <p>
            Turning curiosity into code.
            <br />
            Building tools I wish already existed.
          </p>
          <a className="text-link" href="#projects">
            Explore my work <TbArrowDownRight aria-hidden />
          </a>
        </div>
        <button
          className="pause-control"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Resume 3D motion" : "Pause 3D motion"}
          aria-pressed={paused}
        >
          {paused ? (
            <TbPlayerPlay aria-hidden />
          ) : (
            <TbPlayerPause aria-hidden />
          )}
        </button>
      </div>
    </section>
  );
}
