import { Text } from '@react-three/drei'

export default function FolderIcon({ position, label, highlighted, onClick }) {
    return (
        <group position={position} onClick={onClick}>
            {/* Folder Icon - Windows XP Style */}
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.5, 0.4, 0.02]} />
                <meshBasicMaterial color={highlighted ? "#ffd700" : "#ffc83d"} />
            </mesh>

            {/* Folder Tab */}
            <mesh position={[-0.1, 0.2, 0.01]}>
                <boxGeometry args={[0.2, 0.08, 0.02]} />
                <meshBasicMaterial color={highlighted ? "#ffd700" : "#ffc83d"} />
            </mesh>

            {/* Folder Highlight */}
            {highlighted && (
                <mesh position={[0, 0, -0.01]}>
                    <planeGeometry args={[0.7, 0.8]} />
                    <meshBasicMaterial
                        color="#3d8edb"
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            )}

            <Text
                position={[0, -0.4, 0]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="top"
                outlineWidth={0.01}
                outlineColor="black"
            >
                {label}
            </Text>
        </group>
    )
}
