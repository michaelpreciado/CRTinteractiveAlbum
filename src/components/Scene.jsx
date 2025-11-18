import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import Room from './Room'
import Desk from './Desk'
import CRTMonitor from './CRTMonitor'

export default function Scene({ uploadedImages }) {
    return (
        <>
            {/* Dramatic Single Light Source from Above */}
            <ambientLight intensity={0.3} />
            <spotLight
                position={[0, 8, 2]}
                angle={0.6}
                penumbra={0.8}
                intensity={25}
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-bias={-0.0001}
                color="#fff8e7"
            />

            {/* Fill light for better visibility */}
            <pointLight position={[3, 3, 5]} intensity={5} color="#ffffff" />
            <pointLight position={[-3, 3, 5]} intensity={3} color="#4a6fa5" />

            {/* Dark Room Environment */}
            <Room />

            <group position={[0, -1.5, 0]}>
                <Desk />
                <CRTMonitor position={[0, 1.5, 0]} uploadedImages={uploadedImages} />
            </group>

            {/* Enhanced Shadows */}
            <ContactShadows
                position={[0, -1.49, 0]}
                opacity={0.8}
                scale={15}
                blur={2}
                far={10}
                resolution={1024}
                color="#000000"
            />

            {/* Environment for subtle reflections */}
            {/* <Environment preset="city" /> */}

            {/* Controls - Full Rotation Allowed */}
            <OrbitControls
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below ground
                enableZoom={true}
                enablePan={false}
                maxDistance={10}
                minDistance={2}
            />

            {/* Post Processing Effects */}
            {/* <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={0.5} 
          radius={0.4}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.05} />
      </EffectComposer> */}
        </>
    )
}
