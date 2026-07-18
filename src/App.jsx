import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect, useCallback } from 'react'
import { ACESFilmicToneMapping } from 'three'
import { Loader, PerformanceMonitor } from '@react-three/drei'
import styled, { createGlobalStyle } from 'styled-components'
import Scene from './components/Scene'
import { useAppStore } from './store/useAppStore'
import { exportCRTImage } from './utils/exportCRTImage'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    background: #050505;
    overscroll-behavior: none;
  }
`

const UIContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 10;
  color: white;
  pointer-events: none;

  @media (max-width: 768px) {
    top: auto;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: center;
  }
`

const Card = styled.div`
  background: rgba(20, 20, 20, 0.6);
  padding: 24px;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  max-width: 320px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;

    & > h1,
    & > p,
    & > div:first-child {
      display: none;
    }
  }
`

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(to right, #fff, #ccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Description = styled.p`
  margin: 0 0 20px 0;
  font-size: 13px;
  line-height: 1.5;
  color: #888;
`

const UploadButton = styled.label`
  background: white;
  color: black;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s ease;
  width: 100%;
  gap: 8px;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`

const HiddenInput = styled.input`
  display: none;
`

const Badge = styled.div`
  display: inline-block;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 10px;
  font-weight: 600;
  color: #888;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`

const ErrorMessage = styled.div`
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(220, 50, 50, 0.15);
  border: 1px solid rgba(220, 50, 50, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: #ff8080;
  line-height: 1.4;
`

const SaveBar = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 14px;
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  backdrop-filter: blur(20px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  animation: rise 0.35s ease;

  @keyframes rise {
    from {
      opacity: 0;
      transform: translate(-50%, 12px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`

const SaveButton = styled.button`
  background: linear-gradient(180deg, #4ade80, #22c55e);
  color: #052e12;
  border: none;
  padding: 10px 20px;
  border-radius: 9px;
  font-family: inherit;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;

  &:hover:not(:disabled) {
    transform: scale(1.03);
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  color: #ddd;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 10px 16px;
  border-radius: 9px;
  font-family: inherit;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
`

const SaveHint = styled.span`
  font-size: 12px;
  color: #9a9a9a;
  padding-left: 4px;
`

const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png',
  'image/gif', 'image/webp', 'image/avif',
])
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function uploadFile(file) {
  const base64 = await fileToBase64(file)
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, filename: file.name }),
  })
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`)
  }
  const data = await response.json()
  return data.url
}

function App() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [dpr, setDpr] = useState(1.5)

  const images = useAppStore((s) => s.images)
  const setImages = useAppStore((s) => s.setImages)
  const addImages = useAppStore((s) => s.addImages)
  const selectedImage = useAppStore((s) => s.selectedImage)
  const closePhoto = useAppStore((s) => s.closePhoto)
  const saving = useAppStore((s) => s.saving)
  const setSaving = useAppStore((s) => s.setSaving)

  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 5000)
    return () => clearTimeout(timer)
  }, [error])

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch('/api/images')
      const data = await response.json()

      if (data.needsInit) {
        await fetch('/api/init-db', { method: 'POST' })
        const retryResponse = await fetch('/api/images')
        const retryData = await retryResponse.json()
        setImages(retryData.images.map(img => img.url))
      } else {
        setImages(data.images.map(img => img.url))
      }
    } catch {
      setImages([
        'https://picsum.photos/id/10/400/300',
        'https://picsum.photos/id/11/400/300',
        'https://picsum.photos/id/12/400/300',
        'https://picsum.photos/id/13/400/300',
        'https://picsum.photos/id/14/400/300',
      ])
    } finally {
      setLoading(false)
    }
  }, [setImages])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const invalid = files.filter(f => !ALLOWED_TYPES.has(f.type))
    if (invalid.length > 0) {
      setError(`${invalid.length} file(s) have unsupported formats.`)
      return
    }

    const oversized = files.filter(f => f.size > MAX_FILE_SIZE)
    if (oversized.length > 0) {
      setError(`${oversized.length} file(s) exceed the 10 MB limit.`)
      return
    }

    setUploading(true)
    setError(null)

    try {
      const results = await Promise.allSettled(files.map(uploadFile))
      const urls = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value)
      const failures = results.filter(r => r.status === 'rejected')

      if (urls.length > 0) {
        addImages(urls)
      } else if (failures.length > 0) {
        // Fall back to local object URLs so the experience still works
        // without the upload API (e.g. running the static site alone).
        addImages(files.map(f => URL.createObjectURL(f)))
        setError('Upload API unavailable — showing images locally.')
        setUploading(false)
        e.target.value = ''
        return
      }
      if (failures.length > 0) {
        setError(`${failures.length} file(s) failed to upload.`)
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    if (!selectedImage || saving) return
    setSaving(true)
    try {
      await exportCRTImage(selectedImage, `crt-photo-${Date.now()}.png`)
    } catch {
      setError('Could not export this image (it may block cross-origin access).')
    } finally {
      setSaving(false)
    }
  }

  const isDisabled = uploading || loading

  return (
    <>
      <GlobalStyle />
      <UIContainer>
        <Card>
          <Badge>v1.0</Badge>
          <Title>CRT Album</Title>
          <Description>
            Upload your photos and view them on a retro CRT. Drag the cursor on
            the screen, click the folder to browse, click a photo to zoom in —
            then save it with the CRT effect baked in.
          </Description>
          <UploadButton
            style={{
              opacity: isDisabled ? 0.6 : 1,
              cursor: isDisabled ? 'wait' : 'pointer',
            }}
            aria-label="Upload images"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {uploading ? 'Uploading…' : loading ? 'Loading…' : 'Upload Images'}
            <HiddenInput
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
              onChange={handleUpload}
              disabled={isDisabled}
            />
          </UploadButton>
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        </Card>
      </UIContainer>

      {selectedImage && (
        <SaveBar>
          <BackButton onClick={closePhoto}>← Back</BackButton>
          <SaveButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : '💾 Save with CRT effect'}
          </SaveButton>
          <SaveHint>Exports a PNG with the CRT look applied</SaveHint>
        </SaveBar>
      )}

      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 0.5, 4], fov: 50 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
          stencil: false,
        }}
      >
        {/* Adaptive resolution: back off DPR under load, restore when smooth */}
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
          onDecline={() => setDpr(1)}
        >
          <Suspense fallback={null}>
            <Scene uploadedImages={images} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
      <Loader
        containerStyles={{ background: '#050505' }}
        innerStyles={{ background: '#333', width: 200, height: 2 }}
        barStyles={{ background: 'white', height: 2 }}
        dataStyles={{ display: 'none' }}
      />
    </>
  )
}

export default App
