import { Text } from '@react-three/drei'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import FolderIcon from './FolderIcon'
import Window from './Window'
import { useAppStore } from '../../store/useAppStore'
import { SCREEN_WIDTH, SCREEN_HEIGHT, OS_FONT } from './constants'

function getFormattedTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

const FOLDER_POS = { x: -2.15, y: 1.55 }
const FOLDER_HIT_RADIUS = 0.5

/** Bliss-style wallpaper drawn in a single fragment shader — one draw call
 *  instead of the previous nine layered planes. */
const WallpaperShader = {
  uniforms: { time: { value: 0 } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float time;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    void main() {
      vec2 uv = vUv;

      // Sky gradient
      vec3 skyTop = vec3(0.13, 0.38, 0.82);
      vec3 skyHorizon = vec3(0.62, 0.82, 0.96);
      vec3 col = mix(skyHorizon, skyTop, smoothstep(0.35, 1.0, uv.y));

      // Sun with soft glow
      float sun = length(uv - vec2(0.78, 0.82));
      col += vec3(1.0, 0.95, 0.72) * smoothstep(0.35, 0.0, sun) * 0.55;
      col = mix(col, vec3(1.0, 0.99, 0.88), smoothstep(0.07, 0.05, sun));

      // Drifting clouds
      float c = noise(uv * vec2(4.0, 8.0) + vec2(time * 0.01, 0.0));
      c += 0.5 * noise(uv * vec2(9.0, 18.0) + vec2(time * 0.02, 3.0));
      float clouds = smoothstep(0.78, 1.05, c) * smoothstep(0.38, 0.6, uv.y);
      col = mix(col, vec3(1.0), clouds * 0.85);

      // Rolling green hills
      float hill1 = 0.34 + 0.06 * sin(uv.x * 4.5 + 0.8);
      float hill2 = 0.24 + 0.05 * sin(uv.x * 3.2 + 2.9);
      vec3 grassLight = vec3(0.45, 0.76, 0.22);
      vec3 grassDark = vec3(0.25, 0.55, 0.13);
      float h1 = smoothstep(hill1 + 0.004, hill1, uv.y);
      float h2 = smoothstep(hill2 + 0.004, hill2, uv.y);
      col = mix(col, grassLight * (0.85 + 0.3 * uv.y), h1);
      col = mix(col, grassDark * (0.9 + 0.4 * uv.y), h2);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default function Desktop({ clickTrigger, uploadedImages }) {
  const [time, setTime] = useState(getFormattedTime)
  const [folderHighlighted, setFolderHighlighted] = useState(false)

  const viewMode = useAppStore((s) => s.viewMode)
  const isWindowOpen = viewMode !== 'desktop'

  const cursorRef = useRef()
  const wallpaperRef = useRef()
  const highlightedRef = useRef(false)

  const wallpaperShader = useMemo(
    () => ({ ...WallpaperShader, uniforms: { time: { value: 0 } } }),
    [],
  )

  // Live clock — updates once per minute.
  useEffect(() => {
    const interval = setInterval(() => setTime(getFormattedTime()), 60_000)
    return () => clearInterval(interval)
  }, [])

  // Cursor + hover run imperatively every frame; React state only changes
  // when the hover boolean actually flips.
  useFrame((state) => {
    const { cursor } = useAppStore.getState()
    const cx = cursor.x * (SCREEN_WIDTH / 2)
    const cy = cursor.y * (SCREEN_HEIGHT / 2)

    if (cursorRef.current) {
      cursorRef.current.position.x = cx
      cursorRef.current.position.y = cy
    }

    if (wallpaperRef.current) {
      wallpaperRef.current.uniforms.time.value = state.clock.elapsedTime
    }

    const over =
      !isWindowOpen &&
      Math.abs(cx - FOLDER_POS.x) < FOLDER_HIT_RADIUS &&
      Math.abs(cy - FOLDER_POS.y) < FOLDER_HIT_RADIUS
    if (over !== highlightedRef.current) {
      highlightedRef.current = over
      setFolderHighlighted(over)
    }
  })

  // Fires only on click events (clickTrigger changes).
  useEffect(() => {
    if (clickTrigger === 0) return
    const { viewMode: mode, cursor, openGallery } = useAppStore.getState()
    if (mode !== 'desktop') return

    const cx = cursor.x * (SCREEN_WIDTH / 2)
    const cy = cursor.y * (SCREEN_HEIGHT / 2)
    const dx = cx - FOLDER_POS.x
    const dy = cy - FOLDER_POS.y
    if (Math.sqrt(dx * dx + dy * dy) < FOLDER_HIT_RADIUS) {
      openGallery()
    }
  }, [clickTrigger])

  return (
    <group>
      {/* Wallpaper */}
      <mesh position={[0, 0.3, -1]}>
        <planeGeometry args={[10, 8]} />
        <shaderMaterial ref={wallpaperRef} args={[wallpaperShader]} />
      </mesh>

      <FolderIcon
        position={[FOLDER_POS.x, FOLDER_POS.y, 0]}
        label="My Pictures"
        highlighted={folderHighlighted}
      />

      {isWindowOpen && (
        <Window clickTrigger={clickTrigger} images={uploadedImages} />
      )}

      {/* Cursor */}
      <group ref={cursorRef} position={[0, 0, 2]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.08, 0.25, 3]} />
          <meshBasicMaterial color="white" depthTest={false} />
        </mesh>
        <mesh position={[0.02, -0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.06, 0.2, 3]} />
          <meshBasicMaterial color="black" depthTest={false} />
        </mesh>
      </group>

      {/* Taskbar */}
      <mesh position={[0, -2.14, 0.1]}>
        <planeGeometry args={[10, 0.38]} />
        <meshBasicMaterial color="#245edb" />
      </mesh>
      <mesh position={[0, -1.96, 0.11]}>
        <planeGeometry args={[10, 0.04]} />
        <meshBasicMaterial color="#5c8ef0" />
      </mesh>

      {/* Start button */}
      <mesh position={[-2.25, -2.14, 0.11]}>
        <planeGeometry args={[0.95, 0.32]} />
        <meshBasicMaterial color="#3d8c3d" />
      </mesh>
      <Text font={OS_FONT} position={[-2.25, -2.14, 0.12]} fontSize={0.17} color="white" anchorX="center">
        Start
      </Text>

      {/* Clock tray */}
      <mesh position={[2.2, -2.14, 0.11]}>
        <planeGeometry args={[1.05, 0.32]} />
        <meshBasicMaterial color="#184ba5" />
      </mesh>
      <Text font={OS_FONT} position={[2.2, -2.14, 0.12]} fontSize={0.14} color="white" anchorX="center">
        {time}
      </Text>
    </group>
  )
}
