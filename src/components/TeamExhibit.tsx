import SportArt from "./SportArt";
import { formatLast, formatNext } from "../lib/liveData";
import type { LiveState, TeamSummary } from "../lib/liveData";

export default function TeamExhibit({
  number,
  team,
  kind,
  motto,
  summary,
  status,
}: {
  number: number;
  team: string;
  kind: "baseball" | "football";
  motto: string;
  summary: TeamSummary | null;
  status: LiveState<unknown>["status"];
}) {
  const lines: string[] = [];
  if (status === "ready" && summary) {
    if (kind === "football" && summary.record) lines.push(`Record ${summary.record}`);
    if (summary.last) lines.push(formatLast(summary.last));
    if (summary.next) lines.push(formatNext(summary.next));
  }

  return (
    <article className="about-exhibit">
      <div className="exhibit-frame">
        <div className="exhibit-art about-art">
          <SportArt kind={kind} label={`Generative ${kind === "baseball" ? "seam" : "gridiron"} study for the ${team}`} />
        </div>
      </div>
      <div className="exhibit-placard">
        <span className="placard-number">No. 0{number}</span>
        <strong className="placard-title">{team}</strong>
        <span className="placard-meta">{motto}</span>
        {status === "loading" && <p className="team-live">Checking the scores…</p>}
        {lines.length > 0 && (
          <p className="team-live">
            {lines.map((line) => (
              <span className="team-line" key={line}>{line}</span>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}
