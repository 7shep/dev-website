import { useReveal } from "../hooks/useReveal";

type Project = {
  category: string;
  title: string;
  image: string;
  alt: string;
  url?: string;
  github?: string;
  description: string;
  problem: string;
  role: string;
  stack: string[];
};

const projects: Project[] = [
  {
    category: "AI Design Tool",
    title: "Universal: AI Art Director",
    image: "./assets/universal.png",
    alt: "Universal AI art director interface",
    url: "https://style.alexshepherd.dev",
    github: "https://github.com/7shep/universal",
    description:
      "Open-source AI art director for React interfaces built with coding agents. Universal turns project discovery into an approved creative brief, a concrete art direction, and a versioned design plan before reviewing the finished implementation.",
    problem:
      "Coding agents can produce functional interfaces while repeatedly falling back to generic layouts, arbitrary gradients, and weak visual hierarchy. Universal adds design direction and critique to the workflow so creative intent survives implementation.",
    role: "Main developer, this project is open-source and actively maintained.",
    stack: ["TypeScript", "React 19", "Node.js", "MCP SDK", "Vite", "pnpm"],
  },
  {
    category: "CLI Agent/VS Code Extension",
    title: "Screenshot-To-Code (S2C)",
    image: "./assets/image.png",
    alt: "constellation AI agent framework architecture diagram",
    github: "https://github.com/7shep/screenshot-to-code",
    description:"A VS Code Extension or a CLI tool that turns a screenshot of a GUI into a production-ready React component, using a Gemini/Groq API agent to analyze the image and generate code.",
    problem: "If I found a GUI I liked online, there was not a reliable way to turn a screenshot of it into code that I could build on.",
    role: "Sole developer.",
    stack: ["Gemini + Groq API", "TypeScript", "React", "JavaScript"],


  },
  {
    category: "AI Developer Tools",
    title: "git-assistant",
    image: "./assets/npm.png",
    alt: "git assistant application interface",
    github: "https://github.com/7shep/git-assistant",
    description:
      "AI agent that answers natural language questions about git repositories with zero cloud dependencies. Works as both a standalone CLI (ran locally) and MCP server integration for AI coding assistants.",
    problem:
      "Developers juggle complex git workflows and context switching between terminals and AI tools. git-assistant bridges this gap by making git fully queryable through natural language, running entirely on your machine.",
    role: "Sole developer. ",
    stack: ["TypeScript", "Node.js", "Ollama", "MCP SDK", "Ink", "git"],
  },
  {
    category: "MLB Machine Learning",
    title: "Prospect Predictor",
    image: "./assets/baseball.jpg",
    alt: "baseball prospect analytics dashboard",
    url: "https://prospectpredictor.alexshepherd.dev",
    description:
      "XGBoost regression model that predicts future MLB WAR for minor league prospects by aggregating Statcast pitch-level data and age-adjusted minor league stats into an interactive comparison dashboard.",
    problem:
      "Prospect evaluation relies on subjective scouting grades and siloed statistics that ignore age-adjusted performance curves. This tool replaces gut feel with an objective, data-driven model trained on historical player trajectories.",
    role: "Sole developer.",
    stack: [
      "Python",
      "XGBoost",
      "scikit-learn",
      "pandas",
      "FastAPI",
      "React 19",
      "Tailwind CSS",
      "Vite",
      "Render",
    ],
  },
  {
    category: "Discord Analytics Bot",
    title: "Project: Andromeda",
    image: "./assets/andromeda-galaxy-infrared-1024x880.jpg",
    alt: "andromeda galaxy",
    url: "https://discord-analytics-eight.vercel.app",
    github: "https://github.com/7shep/discord-analytics",
    description:
      "Full-stack analytics platform that tracks Discord server activity in real time and visualizes it through an interactive dashboard.",
    problem:
      "Discord admins have no native way to monitor engagement trends. Andromeda replaces manual scrolling with live metrics on member activity, message volume, and user contributions.",
    role: "Sole developer.",
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Recharts",
      "discord.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Supabase",
    ],
  },
  {
    category: "Queen's Web Development Club",
    title: "Project: ./education/",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBIOFAIfiA0TyrCZWLw55VFcBY4PKr3535bJYAb4m0EelNx8LZ4FDvCfByg13SadPv-YL3n-XMIr-x2CNNodvAnkNnQvHh2qeTo-jwmBWQmw9g7me5lMskTdr3GyWIzbedS0Fa60we9FBCoaxhoCwAeI9VfQu4rRE9_7M61gpiG7ghS0uO74BykpLH24nEkZhqPldztZVzYXiHDz988ewUMumbDz78waNrSmAXFT8tUxUgxZPmxoBXwjzFguB8PGrvPNmhqm9Zp8fJ",
    alt: "visualization of complex mathematical geometry with glowing golden lines",
    url: "https://qweb.dev/education",
    github: "https://github.com/queens-web-development-club/qweb-main-2024",
    description:
      "Education landing page for Queen's Web Development Club — a hub surfacing workshop content and learning paths for club members.",
    problem:
      "QWeb ran hands-on web dev tutorials but had no persistent home for the material. Members who missed a session had nowhere to catch up.",
    role: "Built the education page in React as part of the club's Next.js site.",
    stack: ["Next.js", "React"],
  },
];

export default function Projects() {
  const { ref, isVisible } = useReveal();

  return (
    <section id="projects" className="min-h-screen px-4 sm:px-8 md:px-32 py-32 bg-surface-container-low/30">
      <div className="text-right mb-24" ref={ref}>
        <h2 className={`text-3xl sm:text-4xl md:text-7xl font-headline font-bold mt-6 reveal${isVisible ? " visible" : ""}`}>
          Digital <span className="text-primary">Constellations</span>.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.map((project, i) => (
          <article
            key={project.title}
            className={`group relative flex flex-col overflow-hidden rounded-2xl bg-surface-container-highest reveal${i > 0 ? " reveal-delay-1" : ""}${isVisible ? " visible" : ""}`}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                src={project.image}
                alt={project.alt}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest via-surface-container-highest/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
                <span className="text-[10px] font-label text-primary tracking-widest uppercase">
                  {project.category}
                </span>
                <h4 className="text-2xl font-headline font-bold text-on-surface mt-2">
                  {project.title}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-4 sm:p-6 md:p-8">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {project.description}
              </p>

              <div className="border-l-2 border-primary/30 pl-4 space-y-3">
                <div>
                  <span className="block text-[9px] font-label text-primary tracking-[0.25em] uppercase mb-1">
                    Problem
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <span className="block text-[9px] font-label text-primary tracking-[0.25em] uppercase mb-1">
                    Role
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {project.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[10px] font-label uppercase tracking-wider text-on-surface-variant bg-surface-container-high/60 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 pt-2 border-t border-white/5 mt-1">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-label uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">link</span>
                    Live
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-label uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">code</span>
                    Source
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
