import { lazy, Suspense, useState } from "react";
import {
  TbArrowDownRight,
  TbPlayerPause,
  TbPlayerPlay,
  TbBallBaseball,
  TbBarbell,
  TbVinyl,
  TbBallAmericanFootball,
} from "react-icons/tb";
const PersonalObjects = lazy(() => import("./PersonalObjects"));
const interests = [
  { label: "Baseball", icon: TbBallBaseball },
  { label: "The gym", icon: TbBarbell },
  { label: "Music", icon: TbVinyl },
  { label: "Football", icon: TbBallAmericanFootball },
];
export default function Hero() {
  const [selected, setSelected] = useState(0);
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
            <PersonalObjects selected={selected} paused={paused} />
          </Suspense>
        </div>
        <span className="hero-aside">
          A little of what
          <br />
          makes me, me.
        </span>
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
        <div className="object-controls">
          <p>Outside the editor</p>
          <div className="interest-controls" aria-label="Choose a 3D object">
            {interests.map(({ label, icon: Icon }, index) => (
              <button
                key={label}
                aria-label={label}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <Icon aria-hidden />
                <span>{label}</span>
              </button>
            ))}
            <button
              className="pause-control"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Resume 3D motion" : "Pause 3D motion"}
              aria-pressed={paused}
            >
              {paused ? <TbPlayerPlay /> : <TbPlayerPause />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
