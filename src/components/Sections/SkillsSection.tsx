import { motion } from 'motion/react'
import { SKILLS } from '../../data/skills'
import SkillCard from './SkillCard'

export default function SkillsSection() {
  return (
    <div className="relative flex flex-col items-center w-full min-h-screen justify-center py-16">
      {/* Floating bokeh orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[8%] w-24 h-24 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(140,160,200,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }} />
        <div className="absolute top-[30%] right-[10%] w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(180,190,220,0.12) 0%, transparent 70%)', filter: 'blur(25px)' }} />
        <div className="absolute bottom-[15%] left-[12%] w-28 h-28 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(150,170,210,0.14) 0%, transparent 70%)', filter: 'blur(22px)' }} />
        <div className="absolute bottom-[25%] right-[6%] w-20 h-20 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(160,175,210,0.13) 0%, transparent 70%)', filter: 'blur(18px)' }} />
        <div className="absolute top-[60%] left-[50%] w-16 h-16 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(130,150,190,0.10) 0%, transparent 70%)', filter: 'blur(15px)' }} />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="text-5xl text-white text-center mb-3 tracking-tight relative z-10"
        style={{
          fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif',
          fontWeight: 500,
          letterSpacing: '-0.02em',
        }}
      >
        Skills
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="text-center text-white/30 text-sm mb-14 tracking-[0.2em] uppercase relative z-10"
        style={{
          fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", sans-serif',
          fontWeight: 300,
        }}
      >
        Technologies and tools I work with
      </motion.p>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center w-[85%] max-w-[1200px] mx-auto relative z-10">
        {SKILLS.map((category, i) => (
          <SkillCard key={category.name} category={category} index={i} />
        ))}
      </div>
    </div>
  )
}
