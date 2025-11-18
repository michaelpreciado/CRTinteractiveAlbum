import { useRef, useState, useMemo } from 'react'
import { RenderTexture, PerspectiveCamera, MeshReflectorMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Desktop from './OS/Desktop'
import { CRTEffectShader } from './shaders/CRTEffectShader'

export default function CRTMonitor({ position, uploadedImages }) {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const [clickTrigger, setClickTrigger] = useState(0)
    const [scrollData, setScrollData] = useState({ deltaY: 0, timestamp: 0 })
    const materialRef = useRef()
    const groupRef = useRef()

    const shaderMaterial = useMemo(() => {
        const mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(CRTEffectShader.uniforms),
            vertexShader: CRTEffectShader.vertexShader,
            fragmentShader: CRTEffectShader.fragmentShader,
        })
        return mat
    }, [])

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime
        }
    })

    const handlePointerMove = (e) => {
        if (e.uv) {
            setCursorPos({
                x: (e.uv.x - 0.5) * 2,
                y: (e.uv.y - 0.5) * 2
            })
        }
    }

    const handlePointerDown = (e) => {
        e.stopPropagation()
        setClickTrigger(Date.now())
    }

    const handleWheel = (e) => {
        // e.stopPropagation()
        setScrollData({ deltaY: e.deltaY, timestamp: Date.now() })
    }

    return (
        <group position={position} ref={groupRef}>
            {/* Monitor Base/Stand */}
            <mesh position={[0, -0.9, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.4, 0.5, 0.15, 32]} />
                <meshStandardMaterial color="#c8c4b0" roughness={0.7} metalness={0.1} />
            </mesh>

            {/* Monitor Body - Main Casing */}
            <group position={[0, 0, 0]}>
                {/* Back/Body of Monitor - Bulky CRT shape */}
                <mesh castShadow receiveShadow position={[0, 0, -0.8]}>
                    <boxGeometry args={[2.4, 2.2, 1.8]} />
                    <meshStandardMaterial
                        color="#c8c4b0"
                        roughness={0.6}
                        metalness={0.05}
                    />
                </mesh>

                {/* Front Face Bezel */}
                <mesh position={[0, 0, 0.15]} castShadow>
                    <boxGeometry args={[2.5, 2.3, 0.3]} />
                    <meshStandardMaterial
                        color="#d4d0bc"
                        roughness={0.5}
                        metalness={0.05}
                    />
                </mesh>

                {/* Inner Screen Bezel - Darker */}
                <mesh position={[0, 0.1, 0.28]}>
                    <boxGeometry args={[2.1, 1.8, 0.08]} />
                    <meshStandardMaterial
                        color="#3a3a3a"
                        roughness={0.8}
                    />
                </mesh>

                {/* Glass Screen Surface with slight curve */}
                <mesh
                    position={[0, 0.1, 0.32]}
                    onPointerMove={handlePointerMove}
                    onPointerDown={handlePointerDown}
                >
                    <boxGeometry args={[1.9, 1.6, 0.05]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.1}
                        metalness={0.3}
                        emissive="#000000"
                        emissiveIntensity={0.2}
                    >
                        <RenderTexture attach="emissiveMap">
                            <PerspectiveCamera makeDefault manual aspect={1.9 / 1.6} position={[0, 0, 5]} />
                            <color attach="background" args={['#000']} />
                            <Desktop
                                cursorPos={cursorPos}
                                clickTrigger={clickTrigger}
                                uploadedImages={uploadedImages}
                                scrollData={scrollData}
                            />
                        </RenderTexture>
                    </meshStandardMaterial>
                </mesh>

                {/* Screen Shader Effect Overlay */}
                <mesh
                    position={[0, 0.1, 0.35]}
                    onPointerMove={handlePointerMove}
                    onPointerDown={handlePointerDown}
                    onWheel={handleWheel}
                >
                    <planeGeometry args={[1.9, 1.6]} />
                    <shaderMaterial
                        ref={materialRef}
                        args={[CRTEffectShader]}
                        uniforms-tDiffuse-value={null}
                        transparent
                        opacity={0.3}
                    >
                        <RenderTexture attach="uniforms-tDiffuse-value" anisotropy={16}>
                            <PerspectiveCamera makeDefault manual aspect={1.9 / 1.6} position={[0, 0, 5]} />
                            <color attach="background" args={['#000']} />
                            <Desktop
                                cursorPos={cursorPos}
                                clickTrigger={clickTrigger}
                                uploadedImages={uploadedImages}
                                scrollData={scrollData}
                            />
                        </RenderTexture>
                    </shaderMaterial>
                </mesh>

                {/* Bottom Control Panel */}
                <mesh position={[0, -1.05, 0.25]}>
                    <boxGeometry args={[2.3, 0.25, 0.15]} />
                    <meshStandardMaterial color="#b8b4a0" roughness={0.7} />
                </mesh>

                {/* Logo/Brand Area */}
                <mesh position={[0, -1.15, 0.32]}>
                    <planeGeometry args={[0.4, 0.08]} />
                    <meshStandardMaterial color="#2a2a2a" />
                </mesh>

                {/* Power Button */}
                <mesh position={[-0.9, -1.05, 0.32]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
                    <meshStandardMaterial color="#1a1a1a" emissive="#00ff00" emissiveIntensity={0.5} />
                </mesh>

                {/* Vents on side */}
                {[...Array(8)].map((_, i) => (
                    <mesh key={i} position={[1.2, 0.5 - i * 0.2, -0.2]} rotation={[0, Math.PI / 2, 0]}>
                        <planeGeometry args={[0.6, 0.05]} />
                        <meshStandardMaterial color="#2a2a2a" />
                    </mesh>
                ))}
            </group>
        </group>
    )
}
