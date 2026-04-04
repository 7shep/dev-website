export interface SkillCategory {
  name: string
  skills: string[]
}

export const SKILLS: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Three.js'],
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL'],
  },
  {
    name: 'Tools & DevOps',
    skills: ['Git', 'Docker', 'CI/CD', 'AWS', 'Linux'],
  },
  {
    name: 'Practices',
    skills: ['Agile', 'TDD', 'Code Review', 'System Design', 'Performance'],
  },
]
