import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls, Text, useCursor } from '@react-three/drei'
import * as THREE from 'three'

export type FolderId = 'media' | 'videos'

interface HeroSceneProps {
  openFolder: FolderId | null
  setOpenFolder: React.Dispatch<React.SetStateAction<FolderId | null>>
}

interface ScreenSurfaceProps {
  openFolder: FolderId | null
  setOpenFolder: React.Dispatch<React.SetStateAction<FolderId | null>>
}

interface FolderIconProps {
  id: FolderId
  label: string
  position: [number, number, number]
  onOpen: (folder: FolderId) => void
  isActive: boolean
}

interface FolderWindowProps {
  folder: FolderId
  onClose: () => void
}

const SCREEN_WIDTH = 0.68
const SCREEN_HEIGHT = 0.46
const FOLDER_DETAILS: Record<FolderId, { title: string; description: string; items: string[] }> = {
  media: {
    title: 'Media Assets',
    description: 'Retouched stills, logo lockups, and layered compositions ready for export.',
    items: ['Photoshoot_1997.zip', 'CRT_branding.ai', 'Ambient_loop.wav'],
  },
  videos: {
    title: 'Video Library',
    description: 'Retro cuts, VHS rips, and timeline exports for the interactive album.',
    items: ['Intro_sequence.mov', 'Behind_the_scenes.mp4', 'CRT_glitches.webm'],
  },
}

const createWallpaperTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')!

  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  skyGradient.addColorStop(0, '#88c8ff')
  skyGradient.addColorStop(0.55, '#76b2ff')
  skyGradient.addColorStop(0.65, '#60a5ff')
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const sunX = canvas.width * 0.78
  const sunY = canvas.height * 0.25
  const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, canvas.height * 0.22)
  sunGradient.addColorStop(0, 'rgba(255, 255, 230, 0.8)')
  sunGradient.addColorStop(0.4, 'rgba(255, 255, 200, 0.4)')
  sunGradient.addColorStop(1, 'rgba(255, 255, 200, 0)')
  ctx.fillStyle = sunGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const distantHill = new Path2D()
  distantHill.moveTo(0, canvas.height * 0.62)
  distantHill.bezierCurveTo(
    canvas.width * 0.2,
    canvas.height * 0.45,
    canvas.width * 0.48,
    canvas.height * 0.68,
    canvas.width * 0.72,
    canvas.height * 0.55,
  )
  distantHill.bezierCurveTo(
    canvas.width * 0.88,
    canvas.height * 0.48,
    canvas.width * 0.95,
    canvas.height * 0.58,
    canvas.width,
    canvas.height * 0.56,
  )
  distantHill.lineTo(canvas.width, canvas.height)
  distantHill.lineTo(0, canvas.height)
  distantHill.closePath()
  ctx.fillStyle = '#3aa63f'
  ctx.fill(distantHill)

  const foregroundHill = new Path2D()
  foregroundHill.moveTo(0, canvas.height * 0.68)
  foregroundHill.bezierCurveTo(
    canvas.width * 0.18,
    canvas.height * 0.58,
    canvas.width * 0.38,
    canvas.height * 0.76,
    canvas.width * 0.62,
    canvas.height * 0.66,
  )
  foregroundHill.bezierCurveTo(
    canvas.width * 0.82,
    canvas.height * 0.6,
    canvas.width * 0.92,
    canvas.height * 0.7,
    canvas.width,
    canvas.height * 0.66,
  )
  foregroundHill.lineTo(canvas.width, canvas.height)
  foregroundHill.lineTo(0, canvas.height)
  foregroundHill.closePath()
  ctx.fillStyle = '#2c8b35'
  ctx.fill(foregroundHill)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
  ctx.beginPath()
  ctx.ellipse(canvas.width * 0.25, canvas.height * 0.58, canvas.width * 0.18, canvas.height * 0.08, -0.4, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

const createScanlineTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 4
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgba(134, 184, 255, 0.22)'
  ctx.fillRect(0, 0, canvas.width, 1)
  ctx.fillStyle = 'rgba(6, 20, 36, 0.8)'
  ctx.fillRect(0, 1, canvas.width, 3)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(320, 180)
  texture.magFilter = THREE.LinearFilter
  return texture
}

const createWoodTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  const baseGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  baseGradient.addColorStop(0, '#3b2416')
  baseGradient.addColorStop(1, '#24140b')
  ctx.fillStyle = baseGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 260; i++) {
    const y = Math.random() * canvas.height
    const alpha = 0.1 + Math.random() * 0.15
    const width = 1 + Math.random() * 6
    ctx.strokeStyle = `rgba(94, 58, 33, ${alpha})`
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(
      canvas.width * 0.25,
      y + Math.sin(y * 0.01) * 15,
      canvas.width * 0.5,
      y + Math.cos(y * 0.005) * 20,
      canvas.width,
      y + Math.sin(y * 0.008) * 18,
    )
    ctx.stroke()
  }

  for (let i = 0; i < 28; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = 30 + Math.random() * 60
    const knotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    knotGradient.addColorStop(0, 'rgba(60, 34, 16, 0.6)')
    knotGradient.addColorStop(1, 'rgba(60, 34, 16, 0)')
    ctx.fillStyle = knotGradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1.5, 1.5)
  texture.anisotropy = 4
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

const FolderIcon: React.FC<FolderIconProps> = ({ id, label, position, onOpen, isActive }) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered, 'pointer')
  const topColor = isActive || hovered ? '#fbe08a' : '#f2d278'
  const bodyColor = isActive || hovered ? '#f7cc66' : '#e6be5b'

  return (
    <group
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation()
        onOpen(id)
      }}
    >
      <mesh position={[0, 0.03, -0.005]} scale={[1, 1, 0.6]}>
        <boxGeometry args={[0.07, 0.018, 0.03]} />
        <meshStandardMaterial color={topColor} metalness={0.1} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.06, 0.03]} />
        <meshStandardMaterial color={bodyColor} metalness={0.1} roughness={0.4} />
      </mesh>
      <Text
        position={[0, -0.055, 0]}
        fontSize={0.034}
        anchorX="center"
        anchorY="middle"
        color={isActive || hovered ? '#d6ecff' : '#ffffff'}
        outlineWidth={0.002}
        outlineColor="rgba(0,0,0,0.7)"
      >
        {label}
      </Text>
    </group>
  )
}

const FolderWindow: React.FC<FolderWindowProps> = ({ folder, onClose }) => {
  const { title, description, items } = FOLDER_DETAILS[folder]
  const [hoveredClose, setHoveredClose] = useState(false)
  useCursor(hoveredClose, 'pointer')

  return (
    <group
      position={[0.1, -0.02, 0.02]}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerOver={(event) => event.stopPropagation()}
    >
      <mesh position={[0.01, -0.01, -0.002]}>
        <planeGeometry args={[0.5, 0.34]} />
        <meshBasicMaterial color="#0c1928" transparent opacity={0.55} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.48, 0.32]} />
        <meshStandardMaterial color="#f3f3f3" roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.13, 0.001]}> 
        <planeGeometry args={[0.48, 0.06]} />
        <meshStandardMaterial color="#2b63d7" emissive="#224aa6" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>
      <Text position={[-0.21, 0.13, 0.01]} fontSize={0.035} anchorX="left" anchorY="middle" color="#ffffff">
        {title}
      </Text>
      <group position={[0.205, 0.13, 0.015]}>
        <mesh
          onPointerOver={(event) => {
            event.stopPropagation()
            setHoveredClose(true)
          }}
          onPointerOut={() => setHoveredClose(false)}
          onClick={(event) => {
            event.stopPropagation()
            onClose()
          }}
        >
          <boxGeometry args={[0.05, 0.05, 0.008]} />
          <meshStandardMaterial
            color={hoveredClose ? '#f07b6f' : '#d95f54'}
            emissive="#822320"
            emissiveIntensity={hoveredClose ? 0.7 : 0.5}
            roughness={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.03}
          anchorX="center"
          anchorY="middle"
          color="#ffffff"
        >
          ✕
        </Text>
      </group>
      <Text
        position={[-0.21, 0.05, 0.01]}
        fontSize={0.028}
        anchorX="left"
        anchorY="top"
        color="#1a2e42"
        maxWidth={0.4}
        lineHeight={1.3}
      >
        {description}
      </Text>
      {items.map((item, index) => (
        <Text
          key={item}
          position={[-0.21, -0.02 - index * 0.055, 0.01]}
          fontSize={0.03}
          anchorX="left"
          anchorY="middle"
          color="#1a2e42"
        >
          • {item}
        </Text>
      ))}
    </group>
  )
}

const ScreenSurface: React.FC<ScreenSurfaceProps> = ({ openFolder, setOpenFolder }) => {
  const wallpaperTexture = useMemo(createWallpaperTexture, [])
  const scanlineTexture = useMemo(createScanlineTexture, [])
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null)
  const overlayMaterial = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    if (screenMaterial.current) {
      const flicker = 0.82 + Math.sin(clock.elapsedTime * 2.4) * 0.05
      screenMaterial.current.emissiveIntensity = flicker
    }
    if (overlayMaterial.current) {
      overlayMaterial.current.opacity = 0.18 + Math.sin(clock.elapsedTime * 9) * 0.03
    }
  })

  const iconX = -SCREEN_WIDTH / 2 + 0.12
  const iconY = SCREEN_HEIGHT / 2 - 0.12

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        onPointerDown={(event) => {
          if (event.button === 0) {
            setOpenFolder(null)
          }
        }}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshStandardMaterial
          ref={screenMaterial}
          map={wallpaperTexture}
          emissive="#0c2f51"
          emissiveIntensity={0.85}
          emissiveMap={wallpaperTexture}
          roughness={0.25}
          metalness={0.12}
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
      <group position={[iconX, iconY, 0.02]}>
        <FolderIcon
          id="media"
          label="Media"
          position={[0, 0, 0]}
          onOpen={setOpenFolder}
          isActive={openFolder === 'media'}
        />
        <FolderIcon
          id="videos"
          label="Videos"
          position={[0, -0.14, 0]}
          onOpen={setOpenFolder}
          isActive={openFolder === 'videos'}
        />
      </group>
      {openFolder && <FolderWindow folder={openFolder} onClose={() => setOpenFolder(null)} />}
    </group>
  )
}

const CRTMonitor: React.FC<ScreenSurfaceProps> = ({ openFolder, setOpenFolder }) => {
  return (
    <group position={[0, 0, 0]} rotation={[-0.04, -0.18, 0]}>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.74, 0.08, 0.54]} />
        <meshStandardMaterial color="#c9bda0" roughness={0.85} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.18, 0.02]} castShadow>
        <boxGeometry args={[0.32, 0.18, 0.32]} />
        <meshStandardMaterial color="#d8ccb0" roughness={0.78} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.62, 0.1]} castShadow>
        <boxGeometry args={[1.08, 0.72, 0.7]} />
        <meshStandardMaterial color="#e5dcc2" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.63, 0.36]} castShadow>
        <boxGeometry args={[0.88, 0.6, 0.18]} />
        <meshStandardMaterial color="#f1e9d0" roughness={0.65} metalness={0.06} />
      </mesh>
      <mesh position={[0.34, 0.45, 0.42]}>
        <boxGeometry args={[0.09, 0.02, 0.02]} />
        <meshStandardMaterial color="#b6ab8f" roughness={0.5} />
      </mesh>
      <mesh position={[0.38, 0.51, 0.43]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial color="#48ff80" emissive="#3bd26a" emissiveIntensity={0.7} />
      </mesh>
      <group position={[0, 0.63, 0.43]} rotation={[0.1, 0.18, 0]}>
        <ScreenSurface openFolder={openFolder} setOpenFolder={setOpenFolder} />
      </group>
      <pointLight position={[0, 0.7, 0.45]} intensity={0.45} color="#8cc9ff" distance={1.2} />
    </group>
  )
}

const HeroScene: React.FC<HeroSceneProps> = ({ openFolder, setOpenFolder }) => {
  const woodTexture = useMemo(createWoodTexture, [])
  const topLightRef = useRef<THREE.SpotLight>(null)

  useFrame(({ clock }) => {
    if (topLightRef.current) {
      topLightRef.current.intensity = 1.25 + Math.sin(clock.elapsedTime * 0.7) * 0.08
    }
  })

  return (
    <>
      <color attach="background" args={['#020307']} />
      <fog attach="fog" args={['#020307', 4.5, 12]} />
      <ambientLight intensity={0.12} />
      <spotLight
        ref={topLightRef}
        position={[0, 3.1, 0.3]}
        angle={0.85}
        penumbra={0.8}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      />
      <pointLight position={[0.2, 0.6, 1.4]} intensity={0.35} color="#4f82ff" />

      <mesh position={[0, 1.4, 0]} scale={[8, 4.5, 8]}>
        <boxGeometry args={[8, 4.5, 8]} />
        <meshStandardMaterial color="#04060a" side={THREE.BackSide} roughness={1} metalness={0} />
      </mesh>

      <group position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[6, 4]} />
          <meshStandardMaterial map={woodTexture} roughness={0.92} metalness={0.05} />
        </mesh>
        <ContactShadows position={[0, 0.01, 0.2]} opacity={0.55} scale={5.4} blur={2.4} far={2.2} />
        <CRTMonitor openFolder={openFolder} setOpenFolder={setOpenFolder} />
      </group>

      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2.15}
        minPolarAngle={Math.PI / 3.6}
        minDistance={1.5}
        maxDistance={2.6}
        target={[0, 0.58, 0.28]}
      />
    </>
  )
}

export default HeroScene
