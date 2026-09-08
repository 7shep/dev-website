import { useEffect, useRef, useState } from "react";
import { TbArrowUpRight, TbX } from "react-icons/tb";
import { useReveal } from "../hooks/useReveal";
import type { Project } from "./Projects";

function Photo({ project, index, onOpen }: { project: Project; index: number; onOpen: (project: Project) => void }) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className={`collage-item collage-item-${index + 1} reveal${isVisible ? " visible" : ""}`}>
      <button className="project-photo" onClick={() => onOpen(project)} aria-label={`Read about ${project.title}`} aria-haspopup="dialog">
        <span className="photo-tape" aria-hidden="true" />
        <span className="project-image">
          {project.title === "Project: ./education/" ? (
            <span className="education-cover" role="img" aria-label="QWeb education workshop cover">
              <small>QUEEN'S WEB DEVELOPMENT CLUB</small><span>./education/</span><small>Learn it. Build it. Share it.</small>
            </span>
          ) : <img src={project.image} alt={project.alt} loading="lazy" width="900" height="600" />}
        </span>
        <span className="photo-caption"><span><small>{project.category}</small><strong>{project.title.replace("Project: ", "")}</strong></span><TbArrowUpRight aria-hidden /></span>
        <span className="photo-number" aria-hidden="true">0{index + 1}</span>
      </button>
    </div>
  );
}

function Note({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return (
    <dialog ref={dialog} className="project-note" aria-labelledby="project-note-title" onClose={() => {
      if (!dialog.current?.open) onClose();
    }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close();
      }}>
      <button className="note-close" aria-label="Close project" onClick={() => dialog.current?.close()} autoFocus><TbX aria-hidden /></button>
      <span className="note-kicker">{project.category}</span>
      <h2 id="project-note-title">{project.title.replace("Project: ", "")}</h2>
      <p className="note-description">{project.description}</p>
      <div className="note-detail"><h3>The idea</h3><p>{project.problem}</p></div>
      <div className="note-detail"><h3>My role</h3><p>{project.role}</p></div>
      <p className="note-stack">{project.stack.join(" / ")}</p>
      <div className="note-links">
        {project.url && <a href={project.url} target="_blank" rel="noreferrer">Visit project <TbArrowUpRight aria-hidden /></a>}
        {project.github && <a href={project.github} target="_blank" rel="noreferrer">View source <TbArrowUpRight aria-hidden /></a>}
      </div>
    </dialog>
  );
}

export default function ProjectCollage({ projects }: { projects: Project[] }) {
  const { ref, isVisible } = useReveal();
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <section id="projects" className="projects-section wrap">
      <div ref={ref} className={`section-heading reveal reveal-top${isVisible ? " visible" : ""}`}>
        <h2>Selected work</h2><span>A few things I've built. Pick one up.</span>
      </div>
      <div className="project-collage">{projects.map((project, index) => <Photo key={project.title} project={project} index={index} onOpen={setSelected} />)}</div>
      {selected && <Note project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
