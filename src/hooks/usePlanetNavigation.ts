import { createContext, useContext } from 'react'
import type { PlanetId, SectionId } from '../data/planets'

export type NavState =
  | { view: 'solar-system' }
  | { view: 'zooming'; target: PlanetId }
  | { view: 'section'; active: SectionId }

export interface NavContextValue {
  state: NavState
  navigateTo: (planetId: PlanetId) => void
  navigateHome: () => void
  onZoomComplete: () => void
}

export const NavContext = createContext<NavContextValue>(null!)

export function useNavigation() {
  return useContext(NavContext)
}
