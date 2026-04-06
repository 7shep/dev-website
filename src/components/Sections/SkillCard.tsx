import { motion } from 'motion/react'
import type { SkillCategory } from '../../data/skills'
import SkillItem from './SkillItem'

interface SkillCardProps {
  category: SkillCategory
  index: number
}

export default function SkillCard({ category, index }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.15 + index * 0.12,
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="relative rounded-2xl p-10 pt-12 flex flex-col items-center gap-6 w-full lg:flex-1 min-h-[550px]"
      style={{
        background: 'linear-gradient(165deg, rgba(55,65,90,0.55) 0%, rgba(40,48,72,0.45) 100%)',
        backdropFilter: 'blur(40px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Category icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
        style={{
          background: category.accent,
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
        }}
      >
        {category.categoryIcon}
      </div>

      {/* Category name + underline */}
      <div className="flex flex-col items-center gap-2.5 mb-2">
        <h3
          className="text-sm uppercase tracking-[0.18em] text-white/90"
          style={{
            fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif',
            fontWeight: 700,
          }}
        >
          {category.name}
        </h3>
        <div
          className="w-10 h-[2px] rounded-full opacity-80"
          style={{ background: category.accent }}
        />
      </div>

      {/* Skills list */}
      <div className="flex flex-col gap-3 w-full">
        {category.skills.map((skill, i) => (
          <SkillItem key={skill.name} name={skill.name} icon={skill.icon} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
