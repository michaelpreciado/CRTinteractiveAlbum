import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const SCREEN_WIDTH = 0.36
const SCREEN_HEIGHT = 0.27

const createBootScreenTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#050608'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const glow = ctx.createRadialGradient(520, 320, 40, 520, 320, 420)
  glow.addColorStop(0, 'rgba(32, 78, 150, 0.72)')
  glow.addColorStop(0.45, 'rgba(32, 78, 150, 0.36)')
  glow.addColorStop(1, 'rgba(32, 78, 150, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.save()
  ctx.translate(352, 296)
  const flagSize = 60
  const flagGap = 6
  const flagColors = ['#f24f1f', '#7cbc00', '#0078d7', '#ffb900']
  flagColors.forEach((color, index) => {
    const x = index % 2
    const y = Math.floor(index / 2)
    ctx.fillStyle = color
    ctx.fillRect(x * (flagSize + flagGap), y * (flagSize + flagGap), flagSize, flagSize)
  })
  ctx.restore()

  ctx.fillStyle = '#f5f7ff'
  ctx.font = 'bold 82px "Segoe UI", "Helvetica Neue", Arial'
  ctx.fillText('Windows', 430, 340)

  ctx.fillStyle = '#f7a93b'
  ctx.font = 'bold 62px "Segoe UI", Arial'
  ctx.fillText('xp', 782, 340)

  ctx.fillStyle = '#92b6ff'
  ctx.font = '28px "Segoe UI", Arial'
  ctx.fillText('Professional', 434, 382)

  ctx.fillStyle = '#4f7fba'
  ctx.font = '26px "Segoe UI", Arial'
  ctx.fillText('Please wait...', 440, 528)

  const barX = 368
  const barY = 560
  const barWidth = 312
  const barHeight = 18
  ctx.fillStyle = '#0d1b2e'
  ctx.fillRect(barX, barY, barWidth, barHeight)
  ctx.strokeStyle = '#1f3d66'
  ctx.lineWidth = 3
  ctx.strokeRect(barX - 1.5, barY - 1.5, barWidth + 3, barHeight + 3)

  ctx.fillStyle = '#2056a4'
  const segmentWidth = 46
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(barX + 8 + i * (segmentWidth + 12), barY + 3, segmentWidth, barHeight - 6)
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10
    data[i] = Math.max(0, Math.min(255, data[i] + noise))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
  }
  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

const createScanlineTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 4
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgba(144, 196, 255, 0.2)'
  ctx.fillRect(0, 0, canvas.width, 1)
  ctx.fillStyle = 'rgba(6, 18, 32, 0.8)'
  ctx.fillRect(0, 1, canvas.width, 3)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(320, 180)
  texture.magFilter = THREE.LinearFilter
  return texture
}

const ScreenSurface: React.FC = () => {
  const bootTexture = useMemo(createBootScreenTexture, [])
  const scanlineTexture = useMemo(createScanlineTexture, [])
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null)
  const overlayMaterial = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    if (screenMaterial.current) {
      screenMaterial.current.emissiveIntensity = 0.75 + Math.sin(time * 2.3) * 0.06
    }
    if (overlayMaterial.current) {
      overlayMaterial.current.opacity = 0.18 + Math.sin(time * 8.4) * 0.025
    }
  })

  return (
    <group>
      <mesh castShadow receiveShadow>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshStandardMaterial
          ref={screenMaterial}
          map={bootTexture}
          emissive="#0b1930"
          emissiveIntensity={0.82}
          emissiveMap={bootTexture}
          roughness={0.28}
          metalness={0.08}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshBasicMaterial
          ref={overlayMaterial}
          map={scanlineTexture}
          transparent
          opacity={0.2}
          color="#90c1ff"
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

const CRTMonitor: React.FC = () => {
  return (
    <group position={[0, 0, 0]} rotation={[-0.035, -0.32, 0]}>
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.05, 0.34]} />
        <meshStandardMaterial color="#d7c6a5" roughness={0.9} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.09, 0.04]} castShadow>
        <boxGeometry args={[0.24, 0.08, 0.22]} />
        <meshStandardMaterial color="#d9c9a7" roughness={0.88} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.18, 0.07]} castShadow>
        <boxGeometry args={[0.32, 0.12, 0.26]} />
        <meshStandardMaterial color="#ddccaa" roughness={0.86} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.46, -0.04]} castShadow>
        <boxGeometry args={[0.46, 0.36, 0.32]} />
        <meshStandardMaterial color="#e6d8ba" roughness={0.84} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.54, 0.12]} castShadow>
        <boxGeometry args={[0.52, 0.4, 0.14]} />
        <meshStandardMaterial color="#f1e3c7" roughness={0.8} metalness={0.06} />
      </mesh>
      <mesh position={[0, 0.5, 0.08]} castShadow>
        <boxGeometry args={[0.44, 0.34, 0.08]} />
        <meshStandardMaterial color="#dbcaaa" roughness={0.82} metalness={0.06} />
      </mesh>
      <mesh position={[0, 0.47, 0.04]} castShadow>
        <boxGeometry args={[0.42, 0.3, 0.04]} />
        <meshStandardMaterial color="#cbb995" roughness={0.78} metalness={0.05} />
      </mesh>
      <group position={[0, 0.47, 0.08]} rotation={[-0.02, 0, 0]}>
        <ScreenSurface />
      </group>
      <mesh position={[0.18, 0.32, 0.22]} castShadow>
        <boxGeometry args={[0.06, 0.008, 0.02]} />
        <meshStandardMaterial color="#c4b38f" roughness={0.6} metalness={0.08} />
      </mesh>
      <mesh position={[0.23, 0.32, 0.2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.012, 24]} />
        <meshStandardMaterial color="#63e686" emissive="#3faa5e" emissiveIntensity={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.66, -0.18]} castShadow>
        <boxGeometry args={[0.32, 0.14, 0.16]} />
        <meshStandardMaterial color="#d0bf9b" roughness={0.88} metalness={0.08} />
      </mesh>
    </group>
  )
}

const HeroScene: React.FC = () => {
  const keyLightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(({ clock }) => {
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 0.85 + Math.sin(clock.elapsedTime * 0.6) * 0.05
    }
  })

  return (
    <>
      <color attach="background" args={['#f6f2ea']} />
      <fog attach="fog" args={['#f6f2ea', 6, 14]} />
      <ambientLight intensity={0.58} color="#fff6e7" />
      <directionalLight
        ref={keyLightRef}
        position={[1.6, 2.2, 1.2]}
        intensity={0.9}
        color="#fff1d5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0003}
      />
      <spotLight position={[-1.4, 1.6, 1.4]} angle={0.6} penumbra={0.8} intensity={0.45} color="#dfe7ff" />

      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#f0e9dc" roughness={0.95} metalness={0.02} />
        </mesh>
        <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={3.6} blur={2.8} far={2} />
        <CRTMonitor />
      </group>

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={0.65}
        maxDistance={2}
        target={[0, 0.5, 0.08]}
      />
    </>
  )
}

export default HeroScene
