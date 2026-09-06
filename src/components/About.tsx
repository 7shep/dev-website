import {
  TbArrowDownRight,
  TbBallBaseball,
  TbBarbell,
  TbHeadphones,
  TbBallAmericanFootball,
} from "react-icons/tb";
import { useReveal } from "../hooks/useReveal";
export default function About() {
  const { ref, isVisible } = useReveal();
  return (
    <section id="about" className="about-section wrap section-space">
      <div
        ref={ref}
        className={`about-grid reveal${isVisible ? " visible" : ""}`}
      >
        <div className="about-heading">
          <span className="eyebrow">The person behind the projects</span>
          <h2>
            Curiosity
            <br />
            doesn’t clock out.
          </h2>
          <a
            className="text-link"
            href="/assets/Alex_Shepherd_Resume.pdf"
            download
          >
            Download résumé <TbArrowDownRight aria-hidden />
          </a>
        </div>
        <div className="about-body">
          <p className="large-copy">
            I’m Alex, a Computing & AI student at Queen’s University. I like
            figuring things out, making things work, and seeing how far an idea
            can go.
          </p>
          <p>
            Originally from Elora, Ontario. Usually building a side project,
            getting a workout in, or finding a reason to talk baseball. My best
            projects start with something I’m already curious about.
          </p>
          <div className="personal-interests">
            <div>
              <TbBallBaseball aria-hidden />
              <span>
                Baseball<small>Go Jays.</small>
              </span>
            </div>
            <div>
              <TbBarbell aria-hidden />
              <span>
                The gym<small>One more rep.</small>
              </span>
            </div>
            <div>
              <TbHeadphones aria-hidden />
              <span>
                Music<small>Always in rotation.</small>
              </span>
            </div>
            <div>
              <TbBallAmericanFootball aria-hidden />
              <span>
                Football<small>Go Steelers.</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
