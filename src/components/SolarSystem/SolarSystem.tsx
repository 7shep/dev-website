import { Canvas } from '@react-three/fiber'
import Sun from './Sun'
import Planet from './Planet'
import OrbitRing from './OrbitRing'
import Starfield from './Starfield'
import CameraController from './CameraController'
import { PLANETS } from '../../data/planets'

export default function SolarSystem() {
  return (
    <Canvas
      camera={{ position: [0, 12, 28], fov: 50 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <CameraController />
      <Starfield />
      <Sun />
      {PLANETS.map((planet) => (
        <Planet key={planet.id} config={planet} />
      ))}
      {PLANETS.map((planet) => (
        <OrbitRing key={`ring-${planet.id}`} radius={planet.orbitRadius} />
      ))}
    </Canvas>
  )
}
