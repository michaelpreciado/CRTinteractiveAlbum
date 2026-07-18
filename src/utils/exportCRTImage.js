import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  TextureLoader,
  SRGBColorSpace,
  UniformsUtils,
} from 'three'
import { CRTEffectShader } from '../components/shaders/CRTEffectShader'

const MAX_EXPORT_SIZE = 2048

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new TextureLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(url, resolve, undefined, reject)
  })
}

/**
 * Renders `imageUrl` through the CRT shader offscreen and downloads the
 * result as a PNG. Completely independent of the live scene, so exports are
 * full-resolution regardless of viewport size.
 */
export async function exportCRTImage(imageUrl, filename = 'crt-photo.png') {
  const texture = await loadTexture(imageUrl)
  texture.colorSpace = SRGBColorSpace

  const img = texture.image
  const scale = Math.min(1, MAX_EXPORT_SIZE / Math.max(img.width, img.height))
  const width = Math.max(2, Math.round(img.width * scale))
  const height = Math.max(2, Math.round(img.height * scale))

  const renderer = new WebGLRenderer({
    antialias: false,
    preserveDrawingBuffer: true,
    alpha: false,
  })
  renderer.setSize(width, height)

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const material = new ShaderMaterial({
    ...CRTEffectShader,
    uniforms: UniformsUtils.clone(CRTEffectShader.uniforms),
  })
  material.uniforms.tDiffuse.value = texture
  // Freeze time-based effects at a pleasing phase and scale scanlines to
  // the export resolution so they stay crisp at any size.
  material.uniforms.time.value = 1.35
  material.uniforms.flickerIntensity.value = 0
  material.uniforms.scanlineCount.value = Math.min(520, height * 0.45)
  material.uniforms.noiseIntensity.value = 0.03

  const quad = new Mesh(new PlaneGeometry(2, 2), material)
  scene.add(quad)

  try {
    renderer.render(scene, camera)

    const blob = await new Promise((resolve, reject) => {
      renderer.domElement.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Could not encode image'))),
        'image/png',
      )
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } finally {
    texture.dispose()
    quad.geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
}
