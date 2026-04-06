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
      className="rounded-3xl p-8 flex flex-col gap-6 w-full lg:flex-1 min-w-[280px]"
      style={{
        background: 'linear-gradient(165deg, rgba(30,35,60,0.6) 0%, rgba(12,14,28,0.8) 100%)',
        backdropFilter: 'blur(80px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(80px) saturate(1.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow:
          '0 0 0 0.5px rgba(255,255,255,0.04), 0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/25 px-1">
        {category.name}
      </h3>

      <div className="flex flex-col gap-3">
        {category.skills.map((skill, i) => (
          <SkillItem key={skill.name} name={skill.name} icon={skill.icon} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
