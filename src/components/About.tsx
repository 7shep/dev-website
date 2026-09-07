import { TbArrowDownRight } from "react-icons/tb";
import { useReveal } from "../hooks/useReveal";

const interests = [
  ["01", "Baseball", "Go Jays."],
  ["02", "The gym", "One more rep."],
  ["03", "Music", "Always in rotation."],
  ["04", "Football", "Go Steelers."],
];

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
            I follow
            <br />
            the question<span className="about-mark">.</span>
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
          <div
            className="personal-interests"
            aria-label="A few of Alex's interests"
          >
            <p className="interests-label">Outside the browser</p>
            <div className="interest-list">
              {interests.map(([number, title, note]) => (
                <div className="interest-row" key={title}>
                  <span className="interest-number">{number}</span>
                  <span className="interest-title">{title}</span>
                  <small>{note}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
