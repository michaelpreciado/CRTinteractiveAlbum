export default function Room() {
    return (
        <>
            {/* Floor */}
            <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
            </mesh>

            {/* Back Wall */}
            <mesh position={[0, 10, -15]} receiveShadow>
                <planeGeometry args={[50, 30]} />
                <meshStandardMaterial color="#0f0f0f" roughness={0.95} side={2} />
            </mesh>

            {/* Ceiling */}
            <mesh position={[0, 20, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#050505" roughness={1} />
            </mesh>
        </>
    )
}
