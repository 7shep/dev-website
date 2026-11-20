import ProjectCollage from "./ProjectCollage";

export type Project = {
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
  cover: "flow" | "grid" | "contour" | "code";
  /** "contain" shows a logo whole instead of cropping it to fill the frame. */
  imageFit?: "cover" | "contain";
};

const projects: Project[] = [
  {
    category: "Queen's Web Development Club",
    cover: "grid",
    title: "QWeb.dev",
    image: "./assets/qweb-logo.webp",
    imageFit: "contain",
    alt: "QWeb logo: a blue-to-green Q beside <web>",
    url: "https://qweb.dev",
    github: "https://github.com/queens-web-development-club/qweb-main-2026",
    description:
      "Official website for Queen's Web Development Club, a student-run organization that teaches web development and hosts hackathons.",
    problem:
      "The club needed a full overhaul of its website to make it modern, responsive, and better at showcasing its events, projects, and resources for students interested in web development.",
    role: "Revamped the entire site alongside one other club member. I owned the backend architecture and database design, and built the front end with React and Tailwind CSS.",
    stack: ["TypeScript", "React 19", "Tailwind CSS", "Vite", "Supabase"],
  },
  {
    category: "Agent Tooling · Open Source",
    cover: "code",
    title: "MCP-Linter",
    image: "./assets/mcp-lint-success.png",
    imageFit: "contain",
    alt: "Bar chart: fixing what mcp-lint flags took agent task success from 53% to 98% across 15 held-out tasks",
    url: "https://pypi.org/project/mcp-linter/",
    github: "https://github.com/7shep/mcp-linter",
    description:
      "Open-source Python CLI that lints MCP servers against Anthropic's tool-design principles: vague descriptions, oversized responses, opaque IDs, unhelpful errors and overlapping tools. Each server gets a token-weighted score, and a fixing proxy repairs problems without forking the server.",
    problem:
      "Tools built like developer APIs can flood an agent's context or fail without saying how to fix the call. Across 18 official and third-party servers, it found Microsoft's markitdown-mcp returning ~87,000 tokens for a single file, over three times Claude Code's cap. Behind the fixing proxy, agent success on 15 held-out tasks rose from 53% to 98%.",
    role: "Sole developer. Built the static and probe rules, scoring, fixing proxy and eval harness, then extended it toward MCP security: hidden-text detection, a tool lockfile against rug pulls, and install-pinning checks.",
    stack: ["Python", "MCP SDK", "Anthropic API", "GitHub Actions", "PyPI"],
  },
  {
    category: "AI Design Tool",
    cover: "flow",
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
    category: "MLB Machine Learning",
    cover: "contour",
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
];

export default function Projects() {
  return <ProjectCollage projects={projects} />;
}
