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
};

const projects: Project[] = [
  {
    category: "Queen's Web Development Club",
    title: "QWeb.dev",
    image: "./assets/qweb.jpg",
    alt: "QWeb.dev website interface",
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
];

export default function Projects() {
  return <ProjectCollage projects={projects} />;
}
