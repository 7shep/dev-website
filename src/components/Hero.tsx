import { useState } from "react";
import { TbArrowDownRight, TbPlayerPause, TbPlayerPlay } from "react-icons/tb";
import HeroArtwork from "./HeroArtwork";

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
        <figure className="hero-exhibit">
          <div className="hero-frame">
            <div className="hero-canvas">
              <HeroArtwork
                seed="Alex Shepherd"
                paused={paused}
                label="Live generative artwork: ink lines flowing through a field seeded by Alex's name"
              />
            </div>
          </div>
          <figcaption className="hero-placard">
            <span className="placard-number">No. 00</span>
            <span className="hero-placard-title">Field study, live</span>
            <span className="hero-placard-meta">
              Generated in your browser from my name. Never the same twice.
            </span>
          </figcaption>
        </figure>
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
          aria-label={paused ? "Resume artwork" : "Pause artwork"}
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
