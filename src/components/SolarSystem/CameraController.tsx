import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useNavigation } from '../../hooks/usePlanetNavigation'
import { PLANETS } from '../../data/planets'

const OVERVIEW_POS = new THREE.Vector3(0, 12, 28)
const OVERVIEW_LOOK = new THREE.Vector3(0, 0, 0)
const LERP_SPEED = 2.5
const ZOOM_THRESHOLD = 3

export default function CameraController() {
  const { camera, scene } = useThree()
  const { state, onZoomComplete } = useNavigation()
  const targetPos = useRef(new THREE.Vector3().copy(OVERVIEW_POS))
  const targetLook = useRef(new THREE.Vector3().copy(OVERVIEW_LOOK))
  const currentLook = useRef(new THREE.Vector3().copy(OVERVIEW_LOOK))
  const hasTriggeredComplete = useRef(false)

  useFrame((_, delta) => {
    if (state.view === 'zooming') {
      const planet = PLANETS.find((p) => p.id === state.target)
      if (!planet) return

      // Find the planet group in the scene to get its world position
      const planetPos = new THREE.Vector3()

      // Search through scene children for the planet group
      scene.traverse((child) => {
        if (child.userData.planetId === planet.id) {
          child.getWorldPosition(planetPos)
        }
      })

      // Camera target: slightly in front of and above the planet
      const offset = new THREE.Vector3(0, 1, 3).normalize().multiplyScalar(planet.size * 4)
      targetPos.current.copy(planetPos).add(offset)
      targetLook.current.copy(planetPos)

      // Check if close enough to trigger section view
      const dist = camera.position.distanceTo(targetPos.current)
      if (dist < ZOOM_THRESHOLD && !hasTriggeredComplete.current) {
        hasTriggeredComplete.current = true
        onZoomComplete()
      }
    } else if (state.view === 'solar-system') {
      targetPos.current.copy(OVERVIEW_POS)
      targetLook.current.copy(OVERVIEW_LOOK)
      hasTriggeredComplete.current = false
    }

    // Smoothly interpolate camera
    const lerpFactor = 1 - Math.exp(-LERP_SPEED * delta)
    camera.position.lerp(targetPos.current, lerpFactor)
    currentLook.current.lerp(targetLook.current, lerpFactor)
    camera.lookAt(currentLook.current)
  })

  return null
}
