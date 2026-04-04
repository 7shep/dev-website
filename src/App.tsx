import { useState, useCallback, useEffect, Suspense } from 'react'
import { NavContext, type NavState } from './hooks/usePlanetNavigation'
import { PLANETS, type PlanetId } from './data/planets'
import SolarSystem from './components/SolarSystem/SolarSystem'
import SectionOverlay from './components/Sections/SectionOverlay'
import LoadingScreen from './components/UI/LoadingScreen'

export default function App() {
  const [state, setState] = useState<NavState>({ view: 'solar-system' })

  const navigateTo = useCallback((planetId: PlanetId) => {
    setState({ view: 'zooming', target: planetId })
  }, [])

  const navigateHome = useCallback(() => {
    setState({ view: 'solar-system' })
  }, [])

  const onZoomComplete = useCallback(() => {
    setState((prev) => {
      if (prev.view !== 'zooming') return prev
      const planet = PLANETS.find((p) => p.id === prev.target)
      if (!planet) return { view: 'solar-system' }
      return { view: 'section', active: planet.section }
    })
  }, [])

  // Escape key to go back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigateHome()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigateHome])

  return (
    <NavContext.Provider value={{ state, navigateTo, navigateHome, onZoomComplete }}>
      <Suspense fallback={<LoadingScreen />}>
        <SolarSystem />
      </Suspense>
      <SectionOverlay />

      {/* Hint text */}
      {state.view === 'solar-system' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm pointer-events-none">
          Click a planet to explore
        </div>
      )}
    </NavContext.Provider>
  )
}
