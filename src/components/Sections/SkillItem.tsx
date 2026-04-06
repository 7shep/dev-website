import { motion } from 'motion/react'

interface SkillItemProps {
  name: string
  icon: string
  index: number
}

export default function SkillItem({ name, icon, index }: SkillItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.3 + index * 0.05,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.03, x: 4 }}
      className="group flex items-center gap-4 rounded-2xl px-5 py-3.5 cursor-default
                 transition-all duration-300 ease-out"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.07)'
        el.style.border = '1px solid rgba(255,255,255,0.10)'
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.03)'
        el.style.border = '1px solid rgba(255,255,255,0.04)'
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <img src={icon} alt={name} className="w-5 h-5" />
      </div>
      <span className="text-sm font-normal text-white/50 group-hover:text-white/80 transition-colors duration-300 tracking-wide">
        {name}
      </span>
    </motion.div>
  )
}
