interface OrbitRingProps {
  radius: number
}

export default function OrbitRing({ radius }: OrbitRingProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
    </mesh>
  )
}
