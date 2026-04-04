import { SKILLS } from '../../data/skills'

export default function SkillsSection() {
  return (
    <div>
      <h2 className="text-4xl font-bold mb-2 text-blue-400">Skills</h2>
      <p className="text-gray-400 mb-8">Technologies and tools I work with</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILLS.map((category) => (
          <div
            key={category.name}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
          >
            <h3 className="text-lg font-semibold text-blue-300 mb-4">{category.name}</h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-blue-500/10 text-blue-200 rounded-lg text-sm border border-blue-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
