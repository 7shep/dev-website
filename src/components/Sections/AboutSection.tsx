import { ABOUT } from '../../data/about'

export default function AboutSection() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-2 text-yellow-400">{ABOUT.name}</h2>
      <p className="text-yellow-300/70 text-lg mb-8">{ABOUT.title}</p>

      <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-line">{ABOUT.bio}</p>

      <div className="space-y-3 mb-8">
        {ABOUT.highlights.map((h, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/20"
          >
            <span className="text-yellow-400 mt-0.5">&#9733;</span>
            <span className="text-gray-300 text-sm">{h}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        {ABOUT.contact.github && (
          <a
            href={ABOUT.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-yellow-500/10 text-yellow-300 rounded-lg border border-yellow-500/30 hover:border-yellow-500/60 transition-colors text-sm"
          >
            GitHub
          </a>
        )}
        {ABOUT.contact.email && (
          <a
            href={`mailto:${ABOUT.contact.email}`}
            className="px-6 py-2.5 bg-yellow-500/10 text-yellow-300 rounded-lg border border-yellow-500/30 hover:border-yellow-500/60 transition-colors text-sm"
          >
            Email Me
          </a>
        )}
      </div>
    </div>
  )
}
