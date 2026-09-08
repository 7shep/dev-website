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
    description:
      "A VS Code Extension or a CLI tool that turns a screenshot of a GUI into a production-ready React component, using a Gemini/Groq API agent to analyze the image and generate code.",
    problem:
      "If I found a GUI I liked online, there was not a reliable way to turn a screenshot of it into code that I could build on.",
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
  return <ProjectCollage projects={[projects[0], projects[3], projects[1], projects[2], projects[4], projects[5]]} />;
}
