import { PROJECTS } from '../../data/projects'

export default function ProjectsSection() {
  return (
    <div>
      <h2 className="text-4xl font-bold mb-2 text-orange-400">Projects</h2>
      <p className="text-gray-400 mb-8">Things I've built</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project) => (
          <div
            key={project.title}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-orange-300 mb-3">{project.title}</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 bg-orange-500/10 text-orange-200 rounded text-xs border border-orange-500/20"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  GitHub
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
