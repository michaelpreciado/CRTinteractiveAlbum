import { Text } from '@react-three/drei'
import { OS_FONT } from './constants'

export default function FolderIcon({ position, label, highlighted }) {
  const scale = highlighted ? 1.08 : 1
  return (
    <group position={position} scale={scale}>
      {/* Selection highlight */}
      {highlighted && (
        <mesh position={[0, -0.1, -0.02]}>
          <planeGeometry args={[0.85, 0.95]} />
          <meshBasicMaterial color="#316ac5" transparent opacity={0.35} />
        </mesh>
      )}

      {/* Folder back panel */}
      <mesh position={[0, 0.02, -0.01]}>
        <boxGeometry args={[0.52, 0.42, 0.02]} />
        <meshBasicMaterial color={highlighted ? '#e8a920' : '#d99b16'} />
      </mesh>

      {/* Folder tab */}
      <mesh position={[-0.13, 0.24, -0.01]}>
        <boxGeometry args={[0.22, 0.09, 0.02]} />
        <meshBasicMaterial color={highlighted ? '#e8a920' : '#d99b16'} />
      </mesh>

      {/* Folder front panel — lighter, XP style */}
      <mesh position={[0, -0.02, 0.01]}>
        <boxGeometry args={[0.52, 0.36, 0.02]} />
        <meshBasicMaterial color={highlighted ? '#ffd75e' : '#ffc83d'} />
      </mesh>

      <Text
        font={OS_FONT}
        position={[0, -0.38, 0.02]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.012}
        outlineColor="#1a3b6e"
      >
        {label}
      </Text>
    </group>
  )
}
