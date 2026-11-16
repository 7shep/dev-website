import { TbArrowDownRight } from "react-icons/tb";
import { useReveal } from "../hooks/useReveal";
import { useSports } from "../lib/liveData";
import SongOfTheWeek from "./SongOfTheWeek";
import TeamExhibit from "./TeamExhibit";

export default function About() {
  const { ref, isVisible } = useReveal();
  const sports = useSports();
  return (
    <section id="about" className="about-section wrap section-space">
      <div
        ref={ref}
        className={`about-grid reveal-group${isVisible ? " visible" : ""}`}
      >
        <div className="about-heading">
          <span className="eyebrow">The person behind the projects</span>
          <h2>
            I follow
            <br />
            the question<span className="about-mark">.</span>
          </h2>
          <a
            className="text-link"
            href="/assets/Alex_Shepherd_Resume_2026.pdf"
            download
          >
            Download Resume <TbArrowDownRight aria-hidden />
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
            getting a workout in, or finding a reason to talk baseball and
            football. My best projects start with something I’m already curious
            about.
          </p>
        </div>
        <div className="about-exhibits" role="group" aria-label="Outside the browser">
          <p className="interests-label">Outside the browser</p>
          <div className="about-exhibit-grid">
            <SongOfTheWeek />
            <TeamExhibit
              number={2}
              team="Blue Jays"
              kind="baseball"
              motto="Go Jays."
              summary={sports.data?.jays ?? null}
              status={sports.status}
            />
            <TeamExhibit
              number={3}
              team="Steelers"
              kind="football"
              motto="Here we go."
              summary={sports.data?.steelers ?? null}
              status={sports.status}
            />
          </div>
          <p className="about-footnote">Also: the gym. One more rep.</p>
        </div>
      </div>
    </section>
  );
}
