import { AnimatePresence, motion } from 'motion/react'
import { useNavigation } from '../../hooks/usePlanetNavigation'
import SkillsSection from './SkillsSection'
import ProjectsSection from './ProjectsSection'
import AboutSection from './AboutSection'

export default function SectionOverlay() {
  const { state, navigateHome } = useNavigation()

  const isVisible = state.view === 'section'
  const activeSection = isVisible ? state.active : null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-10 backdrop-blur-xl overflow-y-auto"
          style={{ background: 'rgba(30, 40, 60, 0.65)' }}
        >
          {/* Home button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            onClick={navigateHome}
            className="fixed top-6 left-6 z-20 p-3.5 rounded-2xl
                       text-white/70 hover:text-white hover:scale-105
                       transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(160deg, rgba(25,30,50,0.8) 0%, rgba(15,18,35,0.9) 100%)',
              backdropFilter: 'blur(60px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(60px) saturate(1.5)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </motion.button>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="w-full mx-auto px-10 py-24 flex flex-col items-center"
          >
            {activeSection === 'skills' && <SkillsSection />}
            {activeSection === 'projects' && <ProjectsSection />}
            {activeSection === 'about' && <AboutSection />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
