import { Text, Image } from '@react-three/drei'
import { useState, useEffect } from 'react'

export default function Window({ onClose, cursorX, cursorY, clickTrigger, images }) {
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
        if (clickTrigger === 0) return

        if (selectedImage) {
            setSelectedImage(null)
            return
        }

        // Close button - adjusted for new position
        const closeBtnPos = { x: 2.2, y: 1.5 }
        const closeDist = Math.sqrt(Math.pow(cursorX - closeBtnPos.x, 2) + Math.pow(cursorY - closeBtnPos.y, 2))
        if (closeDist < 0.2) {
            onClose()
            return
        }

        // Image Grid Clicks
        if (images) {
            images.forEach((img, i) => {
                const row = Math.floor(i / 3)
                const col = i % 3
                const x = -1.5 + (col * 1.5)
                const y = 0.6 - (row * 1.2)

                if (Math.abs(cursorX - x) < 0.6 && Math.abs(cursorY - y) < 0.5) {
                    setSelectedImage(img)
                }
            })
        }
    }, [clickTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <group position={[0, 0, 0.5]}>
            {/* Window Shadow */}
            <mesh position={[0.05, -0.05, -0.05]}>
                <planeGeometry args={[5.1, 3.6]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.3} />
            </mesh>

            {/* Window Frame */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[5, 3.5]} />
                <meshBasicMaterial color="#ece9d8" />
            </mesh>

            {/* Window Border */}
            <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[5.05, 3.55]} />
                <meshBasicMaterial color="#0054e3" />
            </mesh>

            {/* Title Bar */}
            <mesh position={[0, 1.6, 0.04]}>
                <planeGeometry args={[4.9, 0.3]} />
                <meshBasicMaterial color="#0054e3" />
            </mesh>

            {/* Title Bar Gradient */}
            <mesh position={[0, 1.6, 0.041]}>
                <planeGeometry args={[4.9, 0.3]} />
                <meshBasicMaterial
                    color="#4e98f7"
                    transparent
                    opacity={0.5}
                />
            </mesh>

            <Text position={[-2.2, 1.6, 0.06]} fontSize={0.18} color="white" anchorX="left" anchorY="middle">
                My Pictures
            </Text>

            {/* Window Control Buttons */}
            {/* Minimize */}
            <mesh position={[1.8, 1.6, 0.06]}>
                <planeGeometry args={[0.2, 0.2]} />
                <meshBasicMaterial color="#3d8edb" />
            </mesh>

            {/* Maximize */}
            <mesh position={[2.0, 1.6, 0.06]}>
                <planeGeometry args={[0.2, 0.2]} />
                <meshBasicMaterial color="#3d8edb" />
            </mesh>

            {/* Close Button */}
            <mesh position={[2.2, 1.6, 0.06]}>
                <planeGeometry args={[0.2, 0.2]} />
                <meshBasicMaterial color="#e81123" />
            </mesh>

            <Text position={[2.2, 1.6, 0.07]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
                ×
            </Text>

            {/* Content Area */}
            <mesh position={[0, -0.15, 0.04]}>
                <planeGeometry args={[4.8, 3]} />
                <meshBasicMaterial color="white" />
            </mesh>

            {/* Gallery Grid */}
            <group position={[0, 0, 0.1]}>
                {images && images.map((img, i) => {
                    const row = Math.floor(i / 3)
                    const col = i % 3
                    const x = -1.5 + (col * 1.5)
                    const y = 0.6 - (row * 1.2)

                    return (
                        <group key={i} position={[x, y, 0]}>
                            <Image url={img} scale={[1.2, 0.9]} />
                            <Text position={[0, -0.6, 0]} fontSize={0.12} color="black" anchorX="center">
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

            {/* Fullscreen View */}
            {selectedImage && (
                <group position={[0, -0.15, 0.3]}>
                    <mesh>
                        <planeGeometry args={[4.8, 3]} />
                        <meshBasicMaterial color="black" />
                    </mesh>
                    <Image url={selectedImage} scale={[4, 2.5]} position={[0, 0, 0.05]} />
                    <Text position={[0, -1.3, 0.1]} fontSize={0.15} color="white" anchorX="center">
                        Click to close
                    </Text>
                </group>
            )}
        </group>
    )
}
