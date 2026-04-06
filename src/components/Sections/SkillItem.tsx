import { motion } from 'motion/react'

interface SkillItemProps {
  name: string
  icon: string
  index: number
}

export default function SkillItem({ name, icon, index }: SkillItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3 + index * 0.06,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.02 }}
      className="group flex items-center gap-5 rounded-2xl px-7 py-6 cursor-default w-full"
      style={{
        background: 'rgba(50, 58, 80, 0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 6px rgba(0,0,0,0.15)',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(60, 68, 95, 0.7)'
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.25)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(50, 58, 80, 0.6)'
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 6px rgba(0,0,0,0.15)'
      }}
    >
      <img src={icon} alt={name} className="w-8 h-8 shrink-0" />
      <span
        className="text-base text-white/80 group-hover:text-white tracking-wide"
        style={{
          fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", sans-serif',
          fontWeight: 400,
          transition: 'color 0.3s ease',
        }}
      >
        {name}
      </span>
    </motion.div>
  )
}
