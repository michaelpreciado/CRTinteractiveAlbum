import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html, MeshReflectorMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

interface CRTComputerProps {
  position?: [number, number, number]
}

const FilmStrip: React.FC = () => {
  const filmRef = useRef<THREE.Group>(null)
  const perforationsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (filmRef.current) {
      filmRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (perforationsRef.current) {
      perforationsRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })
  
  return (
    <group position={[0, 1.8, 0]}>
      {/* Film reel container */}
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
        <meshStandardMaterial 
          color="#1a3344" 
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Film strip with frames - simplified */}
      <group ref={filmRef}>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const x = Math.cos(angle) * 0.75
          const z = Math.sin(angle) * 0.75
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle + Math.PI/2, 0]}>
              <planeGeometry args={[0.1, 0.07]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? "#003366" : "#002244"}
                emissive={new THREE.Color(0x001133)}
                emissiveIntensity={0.1}
                transparent
                opacity={0.3}
              />
            </mesh>
          )
        })}
      </group>
      
      {/* Film perforations - simplified */}
      <group ref={perforationsRef}>
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * Math.PI * 2
          const x = Math.cos(angle) * 0.82
          const z = Math.sin(angle) * 0.82
          return (
            <mesh key={i} position={[x, 0, z]}>
              <boxGeometry args={[0.015, 0.015, 0.015]} />
              <meshStandardMaterial 
                color="#001122"
                emissive={new THREE.Color(0x003366)}
                emissiveIntensity={0.1}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

const CRTComputer: React.FC<CRTComputerProps> = ({ position = [0, 0, 0] }) => {
  const meshRef = useRef<THREE.Group>(null)
  const screenRef = useRef<THREE.Mesh>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Film images data with actual image files
  const filmSlides = [
    {
      title: "FILM FRAME 001",
      description: "Scene: Opening sequence",
      timestamp: "00:01:23",
      type: "WIDE SHOT",
      imageFile: "Frame001.jpg"
    },
    {
      title: "FILM FRAME 002", 
      description: "Scene: Character introduction",
      timestamp: "00:03:45",
      type: "CLOSE-UP",
      imageFile: "Frame002.jpg"
    },
    {
      title: "FILM FRAME 003",
      description: "Scene: Action sequence",
      timestamp: "00:07:12",
      type: "MEDIUM SHOT",
      imageFile: "Frame003.jpg"
    },
    {
      title: "FILM FRAME 004",
      description: "Scene: Dialogue exchange",
      timestamp: "00:12:08",
      type: "TWO SHOT",
      imageFile: "Frame004.jpg"
    },
    {
      title: "FILM FRAME 005",
      description: "Scene: Climactic moment",
      timestamp: "00:18:34",
      type: "EXTREME CLOSE-UP",
      imageFile: "Frame005.jpg"
    },
    {
      title: "FILM FRAME 006",
      description: "Scene: Establishing shot",
      timestamp: "00:22:15",
      type: "WIDE SHOT",
      imageFile: "Frame006.jpg"
    },
    {
      title: "FILM FRAME 007",
      description: "Scene: Dramatic reveal",
      timestamp: "00:26:42",
      type: "MEDIUM SHOT",
      imageFile: "Frame007.jpg"
    },
    {
      title: "FILM FRAME 008",
      description: "Scene: Emotional exchange",
      timestamp: "00:31:08",
      type: "CLOSE-UP",
      imageFile: "Frame008.jpg"
    },
    {
      title: "FILM FRAME 009",
      description: "Scene: Chase sequence",
      timestamp: "00:35:29",
      type: "TRACKING SHOT",
      imageFile: "Frame009.jpg"
    },
    {
      title: "FILM FRAME 010",
      description: "Scene: Quiet reflection",
      timestamp: "00:40:17",
      type: "MEDIUM SHOT",
      imageFile: "Frame010.jpg"
    },
    {
      title: "FILM FRAME 011",
      description: "Scene: Group conversation",
      timestamp: "00:44:33",
      type: "GROUP SHOT",
      imageFile: "Frame011.jpg"
    },
    {
      title: "FILM FRAME 012",
      description: "Scene: Plot twist",
      timestamp: "00:48:55",
      type: "EXTREME CLOSE-UP",
      imageFile: "Frame012.jpg"
    },
    {
      title: "FILM FRAME 013",
      description: "Scene: Outdoor setting",
      timestamp: "00:52:41",
      type: "WIDE SHOT",
      imageFile: "Frame013.jpg"
    },
    {
      title: "FILM FRAME 014",
      description: "Scene: Intimate moment",
      timestamp: "00:57:18",
      type: "TWO SHOT",
      imageFile: "Frame014.jpg"
    },
    {
      title: "FILM FRAME 015",
      description: "Scene: Confrontation",
      timestamp: "01:02:44",
      type: "MEDIUM SHOT",
      imageFile: "Frame015.jpg"
    },
    {
      title: "FILM FRAME 016",
      description: "Scene: Resolution begins",
      timestamp: "01:08:12",
      type: "CLOSE-UP",
      imageFile: "Frame016.jpg"
    },
    {
      title: "FILM FRAME 017",
      description: "Scene: Final battle",
      timestamp: "01:13:37",
      type: "WIDE SHOT",
      imageFile: "Frame017.jpg"
    },
    {
      title: "FILM FRAME 018",
      description: "Scene: Victory moment",
      timestamp: "01:18:24",
      type: "MEDIUM SHOT",
      imageFile: "Frame018.jpg"
    },
    {
      title: "FILM FRAME 019",
      description: "Scene: Closing credits",
      timestamp: "01:22:58",
      type: "FADE OUT",
      imageFile: "Frame019.jpg"
    }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filmSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [filmSlides.length])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.005
    }
  })

  // Enhanced CRT screen texture with realistic phosphor effect
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext('2d')!
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    
    // Image cache for loaded images
    const imageCache = new Map<string, HTMLImageElement>()
    
    const updateCanvas = () => {
      // Deep black background with slight blue tint
      const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/2
      )
      gradient.addColorStop(0, '#001122')
      gradient.addColorStop(1, '#000000')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add CRT curvature darkening at edges
      const vignetteGradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, canvas.width * 0.3,
        canvas.width/2, canvas.height/2, canvas.width * 0.6
      )
      vignetteGradient.addColorStop(0, 'rgba(0,0,0,0)')
      vignetteGradient.addColorStop(1, 'rgba(0,0,0,0.4)')
      ctx.fillStyle = vignetteGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const currentFilm = filmSlides[currentSlide]
      
      // Create film frame with border
      const frameX = 60
      const frameY = 80
      const frameWidth = canvas.width - 120
      const frameHeight = canvas.height - 160
      
      // Film frame border (simulating photo paper)
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(frameX - 10, frameY - 10, frameWidth + 20, frameHeight + 20)
      
      // Load and display actual image if available
      if (currentFilm.imageFile) {
        const imageKey = currentFilm.imageFile
        let img = imageCache.get(imageKey)
        
        if (!img) {
          // Create and cache new image
          img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = `/slides/${currentFilm.imageFile}`
          imageCache.set(imageKey, img)
          
          // Set up onload to trigger redraw when image loads
          img.onload = () => {
            texture.needsUpdate = true
          }
        }
        
        // Draw image if loaded, otherwise show loading state
        if (img.complete && img.naturalWidth > 0) {
          // Calculate aspect ratio to fit image in frame
          const imgAspect = img.naturalWidth / img.naturalHeight
          const frameAspect = frameWidth / frameHeight
          
          let drawWidth = frameWidth
          let drawHeight = frameHeight
          let drawX = frameX
          let drawY = frameY
          
          if (imgAspect > frameAspect) {
            // Image is wider - fit to frame width
            drawHeight = frameWidth / imgAspect
            drawY = frameY + (frameHeight - drawHeight) / 2
          } else {
            // Image is taller - fit to frame height
            drawWidth = frameHeight * imgAspect
            drawX = frameX + (frameWidth - drawWidth) / 2
          }
          
          // Draw the actual image
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        } else {
          // Loading state
          ctx.fillStyle = '#2a2a2a'
          ctx.fillRect(frameX, frameY, frameWidth, frameHeight)
          ctx.fillStyle = '#888888'
          ctx.font = 'bold 20px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('LOADING IMAGE...', canvas.width/2, canvas.height/2)
        }
      } else {
        // Placeholder for when no image is available
        const imageGradient = ctx.createLinearGradient(frameX, frameY, frameX + frameWidth, frameY + frameHeight)
        imageGradient.addColorStop(0, '#2a2a2a')
        imageGradient.addColorStop(0.5, '#404040')
        imageGradient.addColorStop(1, '#1a1a1a')
        ctx.fillStyle = imageGradient
        ctx.fillRect(frameX, frameY, frameWidth, frameHeight)
        
        // Add placeholder pattern
        ctx.strokeStyle = '#666666'
        ctx.lineWidth = 1
        for (let i = 0; i < 10; i++) {
          const x = frameX + (i * frameWidth / 10)
          ctx.beginPath()
          ctx.moveTo(x, frameY)
          ctx.lineTo(x, frameY + frameHeight)
          ctx.stroke()
        }
        for (let i = 0; i < 8; i++) {
          const y = frameY + (i * frameHeight / 8)
          ctx.beginPath()
          ctx.moveTo(frameX, y)
          ctx.lineTo(frameX + frameWidth, y)
          ctx.stroke()
        }
        
        // Placeholder text
        ctx.fillStyle = '#888888'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('NO IMAGE AVAILABLE', canvas.width/2, canvas.height/2 - 10)
        ctx.font = '14px Arial'
        ctx.fillText('Add image to /public/slides/', canvas.width/2, canvas.height/2 + 10)
      }
      
      // Film information overlay with dodger blue glow
      ctx.shadowColor = '#1E90FF'
      ctx.shadowBlur = 4
      ctx.fillStyle = '#1E90FF'
      ctx.font = 'bold 16px "Courier New", monospace'
      ctx.textAlign = 'left'
      
      // Film frame info
      ctx.fillText(currentFilm.title, 20, 30)
      ctx.font = '12px "Courier New", monospace'
      ctx.fillText(`Type: ${currentFilm.type}`, 20, 50)
      ctx.fillText(`Time: ${currentFilm.timestamp}`, 20, 65)
      ctx.fillText(`Desc: ${currentFilm.description}`, 20, 80)
      
      // Enhanced scan line effect with dodger blue
      ctx.shadowBlur = 0
      for (let i = 0; i < canvas.height; i += 2) {
        ctx.fillStyle = i % 4 === 0 ? 'rgba(30, 144, 255, 0.08)' : 'rgba(30, 144, 255, 0.04)'
        ctx.fillRect(0, i, canvas.width, 1)
      }
      
      // Phosphor persistence effect with dodger blue
      const time = Date.now()
      ctx.fillStyle = `rgba(30, 144, 255, ${0.1 + Math.sin(time * 0.01) * 0.05})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      texture.needsUpdate = true
    }
    
    updateCanvas()
    return { texture, updateCanvas }
  }, [currentSlide, filmSlides])



  // Create metal texture for computer case
  const metalTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Base metal color
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add brushed metal effect
    for (let i = 0; i < canvas.height; i += 2) {
      const alpha = 0.1 + Math.random() * 0.2
      ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`
      ctx.fillRect(0, i, canvas.width, 1)
    }
    
    // Add scratches and wear
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const length = 10 + Math.random() * 50
      
      ctx.strokeStyle = `rgba(80, 80, 80, ${0.3 + Math.random() * 0.4})`
      ctx.lineWidth = 0.5 + Math.random()
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + length, y + (Math.random() - 0.5) * 10)
      ctx.stroke()
    }
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  useEffect(() => {
    const updateInterval = setInterval(() => {
      canvasTexture.updateCanvas()
    }, 500) // Update every 500ms for cursor blink
    
    return () => clearInterval(updateInterval)
  }, [canvasTexture])

  return (
    <group ref={meshRef} position={position}>
      {/* Computer Tower/Case - More compact and realistic proportions */}
      <mesh position={[-1.5, -0.15, 0.1]} castShadow>
        <boxGeometry args={[0.35, 1.0, 0.6]} />
        <meshStandardMaterial 
          map={metalTexture}
          color="#f5f5dc" 
          metalness={0.02}
          roughness={0.85}
        />
      </mesh>
      
      {/* Tower vents - repositioned for new case */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-1.33, 0.2 - i * 0.08, 0.41]}>
          <boxGeometry args={[0.1, 0.015, 0.01]} />
          <meshStandardMaterial color="#222222" metalness={0.1} roughness={0.9} />
        </mesh>
      ))}
      
      {/* Tower details - floppy drive with realistic bezel */}
      <mesh position={[-1.38, 0.05, 0.41]}>
        <boxGeometry args={[0.12, 0.06, 0.015]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Floppy drive slot */}
      <mesh position={[-1.37, 0.05, 0.41]}>
        <boxGeometry args={[0.09, 0.03, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Power LED with realistic glow */}
      <mesh position={[-1.35, 0.1, 0.41]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial 
          color="#ff4422"
          emissive={new THREE.Color(0xff2200)}
          emissiveIntensity={0.9}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* CRT Monitor - More realistic proportions and positioning */}
      <mesh position={[0, 0.05, -0.3]} castShadow>
        <boxGeometry args={[1.2, 0.95, 1.0]} />
        <meshStandardMaterial 
          color="#f8f8f0" 
          metalness={0.02}
          roughness={0.88}
        />
      </mesh>
      
      {/* Monitor ventilation grilles - repositioned */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[0.55, 0.25 - i * 0.035, 0.2]}>
          <boxGeometry args={[0.06, 0.015, 0.008]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.05} roughness={0.8} />
        </mesh>
      ))}
      
      {/* Monitor brand label - repositioned */}
      <mesh position={[0, -0.25, 0.16]}>
        <planeGeometry args={[0.25, 0.06]} />
        <meshStandardMaterial 
          color="#aaaaaa"
          roughness={0.5}
          metalness={0.08}
        />
      </mesh>
      
      {/* Monitor screen bezel - proper CRT depth and proportions */}
      <mesh position={[0, 0.1, 0.15]}>
        <boxGeometry args={[1.0, 0.75, 0.12]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.08}
          roughness={0.92}
        />
      </mesh>
      
      {/* Screen with curved glass effect - better positioned */}
      <mesh ref={screenRef} position={[0, 0.1, 0.22]} scale={[1, 1, 0.98]}>
        <planeGeometry args={[0.9, 0.68]} />
        <meshStandardMaterial 
          map={canvasTexture.texture}
          emissive={new THREE.Color(0x0033AA)}
          emissiveIntensity={1.8}
          transparent
          opacity={1.0}
        />
      </mesh>
      
      {/* Screen glass reflection - very subtle in darkness */}
      <mesh position={[0, 0.1, 0.23]}>
        <planeGeometry args={[0.9, 0.68]} />
        <meshPhysicalMaterial
          color="#1E90FF"
          transparent
          opacity={0.05}
          roughness={0.05}
          metalness={0}
          transmission={0.9}
          reflectivity={0.8}
          clearcoat={1}
          clearcoatRoughness={0.2}
          envMapIntensity={0.4}
        />
      </mesh>
      
      {/* CRT glow effect - enhanced for dark atmosphere */}
      <mesh position={[0, 0.1, 0.225]}>
        <planeGeometry args={[0.92, 0.7]} />
        <meshStandardMaterial 
          color="#001155"
          transparent
          opacity={0.08}
          emissive={new THREE.Color(0x0044BB)}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Classic CRT Keyboard - more compact and realistic */}
      <mesh position={[0.1, -0.65, 0.6]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.06, 0.4]} />
        <meshStandardMaterial 
          color="#f5f5dc" 
          metalness={0.02}
          roughness={0.88}
        />
      </mesh>

      {/* Keyboard slope/wedge */}
      <mesh position={[0.1, -0.63, 0.42]} rotation={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.03, 0.08]} />
        <meshStandardMaterial 
          color="#eeeedc" 
          metalness={0.02}
          roughness={0.9}
        />
      </mesh>

      {/* Individual keyboard keys - more realistic layout */}
      {Array.from({ length: 48 }, (_, i) => {
        const row = Math.floor(i / 12)
        const col = i % 12
        const x = -0.35 + col * 0.06
        const z = 0.5 + row * 0.06
        return (
          <mesh key={i} position={[x, -0.62, z]} castShadow>
            <boxGeometry args={[0.045, 0.015, 0.045]} />
            <meshStandardMaterial 
              color="#e8e8dc" 
              metalness={0.03}
              roughness={0.75}
            />
          </mesh>
        )
      })}

      {/* Classic CRT Mouse - repositioned and resized */}
      <mesh position={[0.9, -0.65, 0.4]} castShadow>
        <boxGeometry args={[0.08, 0.03, 0.12]} />
        <meshStandardMaterial 
          color="#f5f5dc" 
          metalness={0.02}
          roughness={0.88}
        />
      </mesh>

      {/* Mouse buttons */}
      <mesh position={[0.88, -0.64, 0.37]}>
        <boxGeometry args={[0.025, 0.008, 0.04]} />
        <meshStandardMaterial 
          color="#eeeedc" 
          metalness={0.03}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0.92, -0.64, 0.37]}>
        <boxGeometry args={[0.025, 0.008, 0.04]} />
        <meshStandardMaterial 
          color="#eeeedc" 
          metalness={0.03}
          roughness={0.8}
        />
      </mesh>
      
      {/* Monitor stand - simplified and repositioned */}
      <mesh position={[0, -0.48, -0.1]}>
        <cylinderGeometry args={[0.2, 0.25, 0.12, 8]} />
        <meshStandardMaterial 
          color="#f5f5dc"
          metalness={0.02}
          roughness={0.88}
        />
      </mesh>
      
      {/* Monitor stand base */}
      <mesh position={[0, -0.54, -0.1]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 8]} />
        <meshStandardMaterial 
          color="#eeeedc"
          metalness={0.03}
          roughness={0.85}
        />
      </mesh>
      

      
      

      
    </group>
  )
}

const DustParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 200
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = Math.random() * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0008
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3
        // Floating motion
        positions[index + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.001
        // Slight horizontal drift
        positions[index] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.05) * 0.0005
        positions[index + 2] += Math.sin(state.clock.elapsedTime * 0.4 + i * 0.08) * 0.0003
        
        // Reset particles that float too high
        if (positions[index + 1] > 6) {
          positions[index + 1] = -1
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.008} 
        color="#1E90FF" 
        opacity={0.15} 
        transparent 
        sizeAttenuation={true}
        alphaTest={0.1}
      />
    </points>
  )
}

const Scene: React.FC = () => {
  // Create procedural wood texture for desk
  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Base wood color
    ctx.fillStyle = '#2a1810'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Wood grain pattern
    for (let i = 0; i < 50; i++) {
      const y = Math.random() * canvas.height
      const alpha = 0.1 + Math.random() * 0.3
      const width = 2 + Math.random() * 8
      
      ctx.strokeStyle = `rgba(50, 30, 20, ${alpha})`
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(0, y + Math.sin(0) * 10)
      for (let x = 0; x < canvas.width; x += 5) {
        ctx.lineTo(x, y + Math.sin(x * 0.02) * 15)
      }
      ctx.stroke()
    }
    
    // Add darker knots
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = 10 + Math.random() * 20
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, 'rgba(20, 10, 5, 0.6)')
      gradient.addColorStop(1, 'rgba(20, 10, 5, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 1)
    return texture
  }, [])

  return (
    <>
      {/* Ultra-minimal ambient - almost complete darkness */}
      <ambientLight color="#000308" intensity={0.01} />
      
      {/* Primary CRT Screen Glow - Dominant light source */}
      <pointLight
        position={[0, 0.1, 0.5]}
        intensity={4.5}
        color="#1E90FF"
        distance={3.5}
        decay={1.2}
      />
      
      {/* Subtle screen reflection on film strip */}
      <pointLight
        position={[0, 1.8, 0]}
        intensity={0.3}
        color="#1E90FF"
        distance={1.5}
        decay={3}
      />
      
      {/* Very dim LED power indicator */}
      <pointLight
        position={[-1.35, 0.1, 0.41]}
        intensity={0.1}
        color="#ff2200"
        distance={0.2}
        decay={4}
      />
      
      <FilmStrip />
      <CRTComputer position={[0, 0, 0]} />
      <DustParticles />
      
      {/* Barely visible desk surface - only lit by screen glow */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
        <planeGeometry args={[6, 4]} />
        <MeshReflectorMaterial
          map={woodTexture}
          color="#0a0a0a"
          metalness={0.2}
          roughness={0.7}
          mirror={0.3}
          mixStrength={5}
          blur={[200, 100]}
          mixBlur={1}
          depthScale={0.01}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
        />
      </mesh>
      
      {/* Pitch black floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.71, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
      
      <Environment preset="night" environmentIntensity={0.02} />
    </>
  )
}

const LoadingProgress: React.FC = () => {
  const { progress } = useProgress()
  
  if (progress >= 100) return null
  
  return (
    <Html center>
      <div className="text-crt-glow font-mono">
        Loading: {Math.round(progress)}%
      </div>
    </Html>
  )
}

const HeroScene: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{
          position: [1.5, 0.8, 2.2],
          fov: 45,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.NoToneMapping,
        }}
        dpr={Math.min(2, window.devicePixelRatio)}
      >
        <Scene />
        <LoadingProgress />
        
        <OrbitControls
          target={[0, 0, 0]}
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={4}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          enableDamping
          dampingFactor={0.05}
          autoRotate={false}
        />
        
        <EffectComposer>
          <Bloom
            intensity={2.0}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            radius={0.7}
            levels={8}
          />
          <ToneMapping
            mode={ToneMappingMode.ACES_FILMIC}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default HeroScene 