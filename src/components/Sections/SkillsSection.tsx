import { motion } from 'motion/react'
import { SKILLS } from '../../data/skills'
import SkillCard from './SkillCard'

export default function SkillsSection() {
  return (
    <div className="flex flex-col items-center w-full">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-5xl text-white text-center mb-3 font-light tracking-tight"
        style={{ fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif' }}
      >
        Skills
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center text-white/30 text-sm mb-16 tracking-widest uppercase font-light"
      >
        Technologies and tools I work with
      </motion.p>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl mx-auto">
        {SKILLS.map((category, i) => (
          <SkillCard key={category.name} category={category} index={i} />
        ))}
      </div>
    </div>
  )
}
