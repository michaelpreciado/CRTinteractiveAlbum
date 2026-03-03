import { OrbitControls, ContactShadows } from '@react-three/drei'
import Room from './Room'
import Desk from './Desk'
import CRTMonitor from './CRTMonitor'

export default function Scene({ uploadedImages }) {
    return (
        <>
            <ambientLight intensity={0.3} />
            <spotLight
                position={[0, 8, 2]}
                angle={0.6}
                penumbra={0.8}
                intensity={25}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
                color="#fff8e7"
            />
            <pointLight position={[3, 3, 5]} intensity={5} color="#ffffff" />
            <pointLight position={[-3, 3, 5]} intensity={3} color="#4a6fa5" />

            <Room />

            <group position={[0, -1.5, 0]}>
                <Desk />
                <CRTMonitor position={[0, 1.5, 0]} uploadedImages={uploadedImages} />
            </group>

            <ContactShadows
                position={[0, -1.49, 0]}
                opacity={0.8}
                scale={15}
                blur={2}
                far={10}
                resolution={1024}
                color="#000000"
            />

            <OrbitControls
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2 - 0.1}
                enableZoom={true}
                enablePan={false}
                maxDistance={10}
                minDistance={2}
            />
        </>
    )
}
