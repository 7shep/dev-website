import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

export default function Sun() {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa44" distance={100} />
      <ambientLight intensity={0.15} />

      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#ffcc44"
          emissive="#ff8800"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.05} />
      </mesh>
    </group>
  )
}
