import { Text, Image } from '@react-three/drei'
import { useState, useEffect } from 'react'
import FolderIcon from './FolderIcon'
import Window from './Window'

export default function Desktop({ cursorPos, clickTrigger, uploadedImages, scrollData }) {
    const [isWindowOpen, setWindowOpen] = useState(false)

    const screenWidth = 6.5
    const screenHeight = 5

    const cursorX = cursorPos.x * (screenWidth / 2)
    const cursorY = cursorPos.y * (screenHeight / 2)

    useEffect(() => {
        if (clickTrigger === 0) return
        if (isWindowOpen) return // Prevent re-opening

        const folderPos = { x: -2.5, y: 1.8 }
        const dist = Math.sqrt(Math.pow(cursorX - folderPos.x, 2) + Math.pow(cursorY - folderPos.y, 2))

        if (dist < 0.5) {
            setWindowOpen(true)
        }
    }, [clickTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <group>
            {/* Bliss Wallpaper Background */}
            <mesh position={[0, 0, -1]}>
                <planeGeometry args={[10, 8]} />
                <meshBasicMaterial color="#5c9ee8" />
            </mesh>

            {/* Sun */}
            <mesh position={[3, 3, -0.95]}>
                <circleGeometry args={[0.8, 32]} />
                <meshBasicMaterial color="#fffeb0" transparent opacity={0.8} />
            </mesh>

            {/* Clouds */}
            <group position={[0, 0, -0.94]}>
                <mesh position={[-2, 2.5, 0]}>
                    <circleGeometry args={[0.6, 16]} />
                    <meshBasicMaterial color="white" transparent opacity={0.7} />
                </mesh>
                <mesh position={[-1.2, 2.3, 0]}>
                    <circleGeometry args={[0.5, 16]} />
                    <meshBasicMaterial color="white" transparent opacity={0.7} />
                </mesh>
                <mesh position={[2, 1.5, 0]}>
                    <circleGeometry args={[0.4, 16]} />
                    <meshBasicMaterial color="white" transparent opacity={0.6} />
                </mesh>
            </group>

            {/* Gradient Sky Effect */}
            <mesh position={[0, 2, -0.93]}>
                <planeGeometry args={[10, 4]} />
                <meshBasicMaterial
                    color="#87ceeb"
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Green Hills Bottom - Layered for depth */}
            <mesh position={[0, -2.5, -0.92]}>
                <planeGeometry args={[12, 5]} />
                <meshBasicMaterial color="#7ec850" />
            </mesh>

            <mesh position={[-3, -2, -0.91]} rotation={[0, 0, 0.2]}>
                <planeGeometry args={[8, 4]} />
                <meshBasicMaterial color="#76bc4b" />
            </mesh>

            <mesh position={[3, -2.2, -0.91]} rotation={[0, 0, -0.1]}>
                <planeGeometry args={[8, 4]} />
                <meshBasicMaterial color="#85d155" />
            </mesh>

            {/* Desktop Icons */}
            <FolderIcon
                position={[-2.5, 1.8, 0]}
                label="My Pictures"
                highlighted={Math.abs(cursorX - (-2.5)) < 0.4 && Math.abs(cursorY - 1.8) < 0.4}
            />

            {/* Windows */}
            {isWindowOpen && (
                <Window
                    onClose={() => setWindowOpen(false)}
                    cursorX={cursorX}
                    cursorY={cursorY}
                    clickTrigger={clickTrigger}
                    images={uploadedImages}
                    scrollData={scrollData}
                />
            )}

            {/* Cursor - Windows XP Arrow */}
            <group position={[cursorX, cursorY, 2]}>
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
            <mesh position={[0, -2.3, 0.1]}>
                <planeGeometry args={[10, 0.4]} />
                <meshBasicMaterial color="#245edb" />
            </mesh>

            {/* Start Button */}
            <mesh position={[-4.5, -2.3, 0.11]}>
                <planeGeometry args={[0.8, 0.3]} />
                <meshBasicMaterial color="#3d8c3d" />
            </mesh>

            <Text
                position={[-4.5, -2.3, 0.12]}
                fontSize={0.15}
                color="white"
                anchorX="center"
            >
                Start
            </Text>

            {/* Clock */}
            <mesh position={[4.5, -2.3, 0.11]}>
                <planeGeometry args={[0.8, 0.3]} />
                <meshBasicMaterial color="#184ba5" />
            </mesh>
            <Text
                position={[4.5, -2.3, 0.12]}
                fontSize={0.12}
                color="white"
                anchorX="center"
            >
                12:00 PM
            </Text>
        </group>
    )
}
