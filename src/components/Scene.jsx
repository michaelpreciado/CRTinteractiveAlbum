import { useRef } from 'react'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { easing } from 'maath'
import Room from './Room'
import Desk from './Desk'
import CRTMonitor from './CRTMonitor'
import { useAppStore } from '../store/useAppStore'

// Camera framing per view mode. The screen face sits at ~[0, 0.08, 0.35].
const CAMERA_POSES = {
  desktop: { position: new Vector3(0, 0.5, 4), target: new Vector3(0, 0, 0) },
  gallery: { position: new Vector3(0, 0.1, 2.9), target: new Vector3(0, 0.08, 0.35) },
  photo: { position: new Vector3(0, 0.08, 2.45), target: new Vector3(0, 0.08, 0.35) },
}

// Light intensities: [normal, photo mode] — the room darkens around the
// screen when a photo is open.
const LIGHT_LEVELS = {
  ambient: [0.3, 0.1],
  spot: [25, 8],
  key: [5, 1.2],
  fill: [3, 0.8],
}

function CameraRig() {
  const controlsRef = useRef()
  const settledRef = useRef(true)
  const lastModeRef = useRef('desktop')

  useFrame((state, delta) => {
    const mode = useAppStore.getState().viewMode
    const controls = controlsRef.current
    if (!controls) return

    if (mode !== lastModeRef.current) {
      lastModeRef.current = mode
      settledRef.current = false
    }

    const zoomed = mode !== 'desktop'
    // Hand control back to the user only after the return flight settles,
    // so OrbitControls never fights the animation.
    controls.enabled = !zoomed && settledRef.current

    if (!settledRef.current) {
      const pose = CAMERA_POSES[mode]
      easing.damp3(state.camera.position, pose.position, 0.4, delta)
      easing.damp3(controls.target, pose.target, 0.4, delta)
      controls.update()
      if (
        state.camera.position.distanceTo(pose.position) < 0.01 &&
        controls.target.distanceTo(pose.target) < 0.01
      ) {
        settledRef.current = true
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2 - 0.1}
      enableZoom={true}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      maxDistance={10}
      minDistance={1.2}
    />
  )
}

function LightingRig() {
  const ambientRef = useRef()
  const spotRef = useRef()
  const keyRef = useRef()
  const fillRef = useRef()

  useFrame((_, delta) => {
    const photo = useAppStore.getState().viewMode === 'photo' ? 1 : 0
    const damp = (light, [hi, lo]) => {
      if (!light) return
      easing.damp(light, 'intensity', photo ? lo : hi, 0.35, delta)
    }
    damp(ambientRef.current, LIGHT_LEVELS.ambient)
    damp(spotRef.current, LIGHT_LEVELS.spot)
    damp(keyRef.current, LIGHT_LEVELS.key)
    damp(fillRef.current, LIGHT_LEVELS.fill)
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.3} />
      <spotLight
        ref={spotRef}
        position={[0, 8, 2]}
        angle={0.6}
        penumbra={0.8}
        intensity={25}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        color="#fff8e7"
      />
      <pointLight ref={keyRef} position={[3, 3, 5]} intensity={5} color="#ffffff" />
      <pointLight ref={fillRef} position={[-3, 3, 5]} intensity={3} color="#4a6fa5" />
    </>
  )
}

export default function Scene({ uploadedImages }) {
  return (
    <>
      <LightingRig />
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
        resolution={512}
        frames={1}
        color="#000000"
      />

      <CameraRig />
    </>
  )
}
