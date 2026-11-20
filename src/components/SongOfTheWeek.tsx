import { TbArrowUpRight } from "react-icons/tb";
import GenerativeCover from "./GenerativeCover";
import { useSongOfTheWeek } from "../lib/liveData";
import type { Song } from "../lib/liveData";

function mediumLine(song: Song): string {
  if (song.plays) return `Played ${song.plays}× this week`;
  if (song.source === "top-4-weeks") return "Most played this month";
  return "";
}

export default function SongOfTheWeek() {
  const { status, data } = useSongOfTheWeek();
  const song = status === "ready" ? (data?.song ?? null) : null;

  let meta: string;
  if (status === "loading") meta = "Tuning in…";
  else if (!song) meta = "Something's always playing.";
  else meta = `${song.title} — ${song.artists.join(", ")}`;

  return (
    <article className="about-exhibit">
      <div className="exhibit-frame">
        <div className="exhibit-art about-art">
          {song?.imageUrl ? (
            <img
              className="about-cover"
              src={song.imageUrl}
              alt={`${song.album} album cover`}
              loading="lazy"
            />
          ) : (
            <GenerativeCover
              seed={song?.title ?? "song of the week"}
              label="Generative artwork standing in for the album cover"
            />
          )}
        </div>
      </div>
      <div className="exhibit-placard">
        <span className="placard-number">No. 05</span>
        <strong className="placard-title">Song of the week</strong>
        <span className="placard-meta">{meta}</span>
        {song && <span className="placard-medium">{mediumLine(song)}</span>}
        {song?.spotifyUrl && (
          <a
            className="text-link placard-listen"
            href={song.spotifyUrl}
            target="_blank"
            rel="noreferrer"
          >
            Listen on Spotify <TbArrowUpRight aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}
