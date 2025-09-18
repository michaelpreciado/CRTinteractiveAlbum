import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import HeroScene from './HeroScene'

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#f4f0e6]">
      <Canvas
        className="w-full h-screen"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0.26, 0.62, 1.55], fov: 32 }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={{ background: '#050608', color: '#c0d8ff' }}
        barStyles={{ background: '#1E90FF' }}
        innerStyles={{ fontFamily: 'JetBrains Mono, monospace' }}
      />
    </div>
  )
}

export default App
