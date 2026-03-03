import { Text, Image } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'

const CLOSE_BTN = { x: 2.2, y: 1.5 }
const CLOSE_HIT_RADIUS = 0.2
const GRID_COLS = 3
const CELL_W = 1.5
const CELL_H = 1.2

export default function Window({ onClose, cursorX, cursorY, clickTrigger, images }) {
    const [selectedImage, setSelectedImage] = useState(null)

    // Refs keep current values readable in the click effect without re-triggering it.
    const cursorXRef = useRef(cursorX)
    const cursorYRef = useRef(cursorY)
    const selectedImageRef = useRef(selectedImage)
    const imagesRef = useRef(images)
    const onCloseRef = useRef(onClose)

    useEffect(() => { cursorXRef.current = cursorX }, [cursorX])
    useEffect(() => { cursorYRef.current = cursorY }, [cursorY])
    useEffect(() => { selectedImageRef.current = selectedImage }, [selectedImage])
    useEffect(() => { imagesRef.current = images }, [images])
    useEffect(() => { onCloseRef.current = onClose }, [onClose])

    // Fires only on click events (clickTrigger changes).
    useEffect(() => {
        if (clickTrigger === 0) return

        if (selectedImageRef.current) {
            setSelectedImage(null)
            return
        }

        const cx = cursorXRef.current
        const cy = cursorYRef.current

        // Close button hit test
        const dx = cx - CLOSE_BTN.x
        const dy = cy - CLOSE_BTN.y
        if (Math.sqrt(dx * dx + dy * dy) < CLOSE_HIT_RADIUS) {
            onCloseRef.current()
            return
        }

        // Image grid hit test
        const imgs = imagesRef.current
        if (!imgs) return
        for (let i = 0; i < imgs.length; i++) {
            const row = Math.floor(i / GRID_COLS)
            const col = i % GRID_COLS
            const x = -1.5 + col * CELL_W
            const y = 0.6 - row * CELL_H

            if (Math.abs(cx - x) < 0.6 && Math.abs(cy - y) < 0.5) {
                setSelectedImage(imgs[i])
                break
            }
        }
    }, [clickTrigger])

    return (
        <group position={[0, 0, 0.5]}>
            {/* Drop shadow */}
            <mesh position={[0.05, -0.05, -0.05]}>
                <planeGeometry args={[5.1, 3.6]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.3} />
            </mesh>

            {/* Border */}
            <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[5.05, 3.55]} />
                <meshBasicMaterial color="#0054e3" />
            </mesh>

            {/* Body */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[5, 3.5]} />
                <meshBasicMaterial color="#ece9d8" />
            </mesh>

            {/* Title bar */}
            <mesh position={[0, 1.6, 0.04]}>
                <planeGeometry args={[4.9, 0.3]} />
                <meshBasicMaterial color="#0054e3" />
            </mesh>
            <mesh position={[0, 1.6, 0.041]}>
                <planeGeometry args={[4.9, 0.3]} />
                <meshBasicMaterial color="#4e98f7" transparent opacity={0.5} />
            </mesh>
            <Text
                position={[-2.2, 1.6, 0.06]}
                fontSize={0.18}
                color="white"
                anchorX="left"
                anchorY="middle"
            >
                My Pictures
            </Text>

            {/* Window controls */}
            <mesh position={[1.8, 1.6, 0.06]}>
                <planeGeometry args={[0.2, 0.2]} />
                <meshBasicMaterial color="#3d8edb" />
            </mesh>
            <mesh position={[2.0, 1.6, 0.06]}>
                <planeGeometry args={[0.2, 0.2]} />
                <meshBasicMaterial color="#3d8edb" />
            </mesh>
            <mesh position={[CLOSE_BTN.x, 1.6, 0.06]}>
                <planeGeometry args={[0.2, 0.2]} />
                <meshBasicMaterial color="#e81123" />
            </mesh>
            <Text
                position={[CLOSE_BTN.x, 1.6, 0.07]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                ×
            </Text>

            {/* Content area */}
            <mesh position={[0, -0.15, 0.04]}>
                <planeGeometry args={[4.8, 3]} />
                <meshBasicMaterial color="white" />
            </mesh>

            {/* Gallery grid */}
            <group position={[0, 0, 0.1]}>
                {images && images.map((img, i) => {
                    const row = Math.floor(i / GRID_COLS)
                    const col = i % GRID_COLS
                    const x = -1.5 + col * CELL_W
                    const y = 0.6 - row * CELL_H

                    return (
                        <group key={img} position={[x, y, 0]}>
                            <Image url={img} scale={[1.2, 0.9]} />
                            <Text
                                position={[0, -0.6, 0]}
                                fontSize={0.12}
                                color="black"
                                anchorX="center"
                            >
                                Image {i + 1}
                            </Text>
                        </group>
                    )
                })}

                {(!images || images.length === 0) && (
                    <Text position={[0, 0, 0]} color="#666" fontSize={0.2} anchorX="center">
                        No images uploaded
                    </Text>
                )}
            </group>

            {/* Fullscreen view */}
            {selectedImage && (
                <group position={[0, -0.15, 0.3]}>
                    <mesh>
                        <planeGeometry args={[4.8, 3]} />
                        <meshBasicMaterial color="black" />
                    </mesh>
                    <Image url={selectedImage} scale={[4, 2.5]} position={[0, 0, 0.05]} />
                    <Text
                        position={[0, -1.3, 0.1]}
                        fontSize={0.15}
                        color="white"
                        anchorX="center"
                    >
                        Click to close
                    </Text>
                </group>
            )}
        </group>
    )
}
