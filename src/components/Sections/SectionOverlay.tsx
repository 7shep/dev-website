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
          className="fixed inset-0 z-10 bg-black/70 backdrop-blur-md overflow-y-auto"
        >
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            onClick={navigateHome}
            className="fixed top-6 left-6 z-20 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg
                       border border-white/20 text-white/80 hover:text-white hover:bg-white/20
                       transition-all text-sm cursor-pointer flex items-center gap-2"
          >
            <span>&#8592;</span> Back to Solar System
          </motion.button>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="max-w-4xl mx-auto px-6 py-24"
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
