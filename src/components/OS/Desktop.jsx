import { Text } from '@react-three/drei'
import { useState, useEffect, useCallback, useRef } from 'react'
import FolderIcon from './FolderIcon'
import Window from './Window'

function getFormattedTime() {
    return new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

const FOLDER_POS = { x: -2.5, y: 1.8 }
const FOLDER_HIT_RADIUS = 0.5
const SCREEN_WIDTH = 6.5
const SCREEN_HEIGHT = 5

export default function Desktop({ cursorPos, clickTrigger, uploadedImages }) {
    const [isWindowOpen, setWindowOpen] = useState(false)
    const [time, setTime] = useState(getFormattedTime)

    const cursorX = cursorPos.x * (SCREEN_WIDTH / 2)
    const cursorY = cursorPos.y * (SCREEN_HEIGHT / 2)

    // Refs keep current values readable inside the click effect without re-triggering it.
    const cursorXRef = useRef(cursorX)
    const cursorYRef = useRef(cursorY)
    const isWindowOpenRef = useRef(isWindowOpen)

    useEffect(() => { cursorXRef.current = cursorX }, [cursorX])
    useEffect(() => { cursorYRef.current = cursorY }, [cursorY])
    useEffect(() => { isWindowOpenRef.current = isWindowOpen }, [isWindowOpen])

    // Live clock — updates once per minute.
    useEffect(() => {
        const interval = setInterval(() => setTime(getFormattedTime()), 60_000)
        return () => clearInterval(interval)
    }, [])

    // Fires only on click events (clickTrigger changes).
    useEffect(() => {
        if (clickTrigger === 0) return
        if (isWindowOpenRef.current) return

        const dx = cursorXRef.current - FOLDER_POS.x
        const dy = cursorYRef.current - FOLDER_POS.y
        if (Math.sqrt(dx * dx + dy * dy) < FOLDER_HIT_RADIUS) {
            setWindowOpen(true)
        }
    }, [clickTrigger])

    const handleClose = useCallback(() => setWindowOpen(false), [])

    const folderHighlighted =
        Math.abs(cursorX - FOLDER_POS.x) < 0.4 && Math.abs(cursorY - FOLDER_POS.y) < 0.4

    return (
        <group>
            {/* Sky */}
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

            {/* Sky gradient */}
            <mesh position={[0, 2, -0.93]}>
                <planeGeometry args={[10, 4]} />
                <meshBasicMaterial color="#87ceeb" transparent opacity={0.4} />
            </mesh>

            {/* Green hills */}
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

            <FolderIcon
                position={[FOLDER_POS.x, FOLDER_POS.y, 0]}
                label="My Pictures"
                highlighted={folderHighlighted}
            />

            {isWindowOpen && (
                <Window
                    onClose={handleClose}
                    cursorX={cursorX}
                    cursorY={cursorY}
                    clickTrigger={clickTrigger}
                    images={uploadedImages}
                />
            )}

            {/* Cursor */}
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

            {/* Start button */}
            <mesh position={[-4.5, -2.3, 0.11]}>
                <planeGeometry args={[0.8, 0.3]} />
                <meshBasicMaterial color="#3d8c3d" />
            </mesh>
            <Text position={[-4.5, -2.3, 0.12]} fontSize={0.15} color="white" anchorX="center">
                Start
            </Text>

            {/* Clock */}
            <mesh position={[4.5, -2.3, 0.11]}>
                <planeGeometry args={[0.8, 0.3]} />
                <meshBasicMaterial color="#184ba5" />
            </mesh>
            <Text position={[4.5, -2.3, 0.12]} fontSize={0.12} color="white" anchorX="center">
                {time}
            </Text>
        </group>
    )
}
