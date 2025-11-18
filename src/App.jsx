import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import Scene from './components/Scene'
import { Loader } from '@react-three/drei'
import styled, { createGlobalStyle } from 'styled-components'
import * as THREE from 'three'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    background: #050505;
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
    
    /* Compact mode for mobile */
    & > h1, & > p, & > div:first-child {
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

function App() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Fetch images from database on mount
  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images')
      const data = await response.json()

      if (data.needsInit) {
        // Initialize database with default images
        await fetch('/api/init-db', { method: 'POST' })
        // Fetch again after initialization
        const retryResponse = await fetch('/api/images')
        const retryData = await retryResponse.json()
        setImages(retryData.images.map(img => img.url))
      } else {
        setImages(data.images.map(img => img.url))
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
      // Fallback to default images if API fails
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
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)

    try {
      for (const file of files) {
        // Convert file to base64
        const reader = new FileReader()
        const base64Promise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })

        const base64 = await base64Promise

        // Upload to API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64,
            filename: file.name,
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Add new image to state
          setImages(prev => [...prev, data.url])
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <GlobalStyle />
      <UIContainer>
        <Card>
          <Badge>v1.0 RC</Badge>
          <Title>CRT Album</Title>
          <Description>
            Experience your photos in a retro Windows XP environment. Upload your own images to view them on the virtual display.
          </Description>
          <UploadButton style={{ opacity: uploading ? 0.6 : 1, cursor: uploading ? 'wait' : 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {uploading ? 'Uploading...' : loading ? 'Loading...' : 'Upload Images'}
            <HiddenInput type="file" multiple accept="image/*" onChange={handleUpload} disabled={uploading} />
          </UploadButton>
        </Card>
      </UIContainer>

      <Canvas
        shadows
        camera={{ position: [0, 0.5, 4], fov: 50 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5
        }}
        onCreated={() => console.log('Canvas created!')}
      >
        <Suspense fallback={<mesh><boxGeometry /><meshBasicMaterial color="red" /></mesh>}>
          <Scene uploadedImages={images} />
        </Suspense>
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
