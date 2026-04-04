export interface Project {
  title: string
  description: string
  tech: string[]
  github?: string
  live?: string
}

export const PROJECTS: Project[] = [
  {
    title: 'Portfolio Website',
    description:
      'An interactive space-themed portfolio built with React Three Fiber. Features a 3D solar system with smooth camera transitions between sections.',
    tech: ['React', 'Three.js', 'TypeScript', 'Tailwind'],
    github: 'https://github.com/alex',
  },
  {
    title: 'Project Two',
    description:
      'A full-stack application with real-time data processing and a responsive dashboard interface.',
    tech: ['Node.js', 'PostgreSQL', 'React', 'WebSockets'],
    github: 'https://github.com/alex',
    live: 'https://example.com',
  },
  {
    title: 'Project Three',
    description:
      'A command-line tool that automates development workflows and integrates with popular version control systems.',
    tech: ['Python', 'CLI', 'REST API', 'Docker'],
    github: 'https://github.com/alex',
  },
]
