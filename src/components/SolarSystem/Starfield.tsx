import { Stars } from '@react-three/drei'

export default function Starfield() {
  return <Stars radius={200} depth={80} count={4000} factor={4} fade speed={1} />
}
