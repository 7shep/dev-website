import { TbArrowUpRight } from "react-icons/tb";
import { useReveal } from "../hooks/useReveal";

type Club = {
  number: string;
  name: string;
  role: string;
  url?: string;
  summary: string;
  highlights: string[];
  tags: string[];
};

const clubs: Club[] = [
  {
    number: "01",
    name: "Queen's Web Development Club (QWeb)",
    role: "Development Executive",
    url: "https://qweb.dev",
    summary:
      "Leading the club's web team and mentoring students who build real sites for real clients.",
    highlights: [
      "Co-led a full rebuild of qweb.dev with one other member.",
      "Lead the directors who keep improving the site.",
      "Mentor teams during the Winter Sprint, where the club builds websites for other Queen's clubs and local Kingston clients.",
    ],
    tags: ["React", "TypeScript", "Supabase", "Mentorship"],
  },
  {
    number: "02",
    name: "QMIND",
    role: "Development Director",
    summary:
      "Maintaining QMIND's website and the systems behind its hiring.",
    highlights: [
      "Keep the QMIND site's content and information up to date.",
      "Ran club hiring through the website: 250+ students applied.",
      "Stored applications in Supabase and synced them to Google Sheets with a webhook.",
      "Set up a Discord webhook that alerts me whenever the pipeline errors.",
    ],
    tags: ["Supabase", "Webhooks", "Google Sheets", "Discord"],
  },
];

function ClubCard({ club }: { club: Club }) {
  return (
    <article className="club-card">
      <span className="club-number" aria-hidden="true">
        {club.number}
      </span>
      <h3>{club.name}</h3>
      <p className="club-role">{club.role}</p>
      <p className="club-summary">{club.summary}</p>
      <ul className="club-highlights">
        {club.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <p className="club-tags">{club.tags.join(" / ")}</p>
      {club.url && (
        <a
          className="text-link"
          href={club.url}
          target="_blank"
          rel="noreferrer"
        >
          Visit site <TbArrowUpRight aria-hidden />
        </a>
      )}
    </article>
  );
}

export default function Clubs() {
  const { ref, isVisible } = useReveal();
  return (
    <section id="clubs" className="clubs-section wrap section-space">
      <div
        ref={ref}
        className={`section-heading reveal reveal-top${isVisible ? " visible" : ""}`}
      >
        <h2>Clubs & leadership</h2>
        <span>Where I build with other people.</span>
      </div>
      <div className="club-grid">
        {clubs.map((club) => (
          <ClubCard key={club.name} club={club} />
        ))}
      </div>
    </section>
  );
}
