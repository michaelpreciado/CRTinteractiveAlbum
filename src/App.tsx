import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import HeroScene, { FolderId } from './HeroScene'

const App: React.FC = () => {
  const [openFolder, setOpenFolder] = useState<FolderId | null>(null)

  return (
    <div className="relative min-h-screen bg-black">
      <Canvas
        className="w-full h-screen"
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0.12, 1.1, 2.15], fov: 32 }}
        onPointerMissed={() => setOpenFolder(null)}
      >
        <Suspense fallback={null}>
          <HeroScene openFolder={openFolder} setOpenFolder={setOpenFolder} />
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
