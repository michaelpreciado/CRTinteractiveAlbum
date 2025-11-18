export default function Desk() {
    return (
        <group>
            {/* Main Desk Surface */}
            <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[12, 8]} />
                <meshStandardMaterial
                    color="#4a3520"
                    roughness={0.9}
                    metalness={0.0}
                />
            </mesh>

            {/* Desk Thickness/Edge */}
            <mesh receiveShadow position={[0, -0.05, 0]}>
                <boxGeometry args={[12, 0.1, 8]} />
                <meshStandardMaterial
                    color="#3a2510"
                    roughness={0.9}
                />
            </mesh>
        </group>
    )
}
