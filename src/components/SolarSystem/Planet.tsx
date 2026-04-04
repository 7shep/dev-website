import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Mesh, Group } from 'three'
import type { PlanetConfig } from '../../data/planets'
import { useNavigation } from '../../hooks/usePlanetNavigation'

interface PlanetProps {
  config: PlanetConfig
}

export default function Planet({ config }: PlanetProps) {
  const groupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const [hovered, setHovered] = useState(false)
  const { state, navigateTo } = useNavigation()

  const isZoomTarget =
    (state.view === 'zooming' && state.target === config.id) ||
    (state.view === 'section' && state.active === config.section)

  const frozenPos = useRef<THREE.Vector3 | null>(null)

  const ringColor = useMemo(() => new THREE.Color(config.color).multiplyScalar(0.6), [config.color])

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return

    // Rotate on axis
    meshRef.current.rotation.y += delta * config.rotationSpeed

    if (isZoomTarget) {
      // Freeze position when zooming
      if (!frozenPos.current) {
        frozenPos.current = groupRef.current.position.clone()
      }
      return
    }

    // Resume orbiting
    frozenPos.current = null
    angleRef.current += delta * config.speed
    const x = Math.cos(angleRef.current) * config.orbitRadius
    const z = Math.sin(angleRef.current) * config.orbitRadius
    groupRef.current.position.set(x, 0, z)
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (state.view === 'solar-system') {
      navigateTo(config.id)
    }
  }

  const scale = hovered && state.view === 'solar-system' ? 1.15 : 1

  return (
    <group ref={groupRef} userData={{ planetId: config.id }}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        scale={scale}
      >
        <sphereGeometry args={[config.size, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={hovered ? 1.5 : 0.5}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Saturn rings */}
      {config.hasRings && (
        <mesh rotation={[-Math.PI / 3, 0, 0]} scale={scale}>
          <ringGeometry args={[config.size * 1.3, config.size * 2, 64]} />
          <meshStandardMaterial
            color={ringColor}
            emissive={config.emissive}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Planet label */}
      {state.view === 'solar-system' && (
        <Html
          position={[0, config.size + 0.6, 0]}
          center
          distanceFactor={15}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
              opacity: hovered ? 1 : 0.7,
              transition: 'opacity 0.2s',
            }}
          >
            {config.name}
          </div>
        </Html>
      )}
    </group>
  )
}
