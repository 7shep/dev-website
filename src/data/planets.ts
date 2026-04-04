export type PlanetId = 'earth' | 'mars' | 'saturn'
export type SectionId = 'skills' | 'projects' | 'about'

export interface PlanetConfig {
  id: PlanetId
  name: string
  section: SectionId
  orbitRadius: number
  size: number
  speed: number
  rotationSpeed: number
  color: string
  emissive: string
  hasRings?: boolean
}

export const PLANETS: PlanetConfig[] = [
  {
    id: 'earth',
    name: 'Skills',
    section: 'skills',
    orbitRadius: 8,
    size: 0.7,
    speed: 0.3,
    rotationSpeed: 1,
    color: '#4488ff',
    emissive: '#112244',
  },
  {
    id: 'mars',
    name: 'Projects',
    section: 'projects',
    orbitRadius: 13,
    size: 0.55,
    speed: 0.2,
    rotationSpeed: 0.9,
    color: '#cc5533',
    emissive: '#331108',
  },
  {
    id: 'saturn',
    name: 'About Me',
    section: 'about',
    orbitRadius: 19,
    size: 0.9,
    speed: 0.1,
    rotationSpeed: 0.7,
    color: '#ddbb66',
    emissive: '#332200',
    hasRings: true,
  },
]
