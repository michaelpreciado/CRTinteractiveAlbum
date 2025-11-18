import * as THREE from 'three'

const CRTEffectShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    distortion: { value: 0.15 },
    distortion2: { value: 0.15 },
    speed: { value: 0.2 },
    rollSpeed: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float distortion;
    uniform float distortion2;
    varying vec2 vUv;

    // Barrel distortion for CRT curvature
    vec2 barrelDistortion(vec2 coord, float amt) {
      vec2 cc = coord - 0.5;
      float dist = dot(cc, cc);
      return coord + cc * dist * amt;
    }

    void main() {
      vec2 uv = barrelDistortion(vUv, 0.2);
      
      // Vignette edges
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      vec4 color = texture2D(tDiffuse, uv);

      // Scanlines
      float scanline = sin(uv.y * 600.0) * 0.04;
      color.rgb -= scanline;

      // RGB shift for chromatic aberration
      float shift = 0.002;
      float r = texture2D(tDiffuse, uv + vec2(shift, 0.0)).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - vec2(shift, 0.0)).b;
      color.rgb = vec3(r, g, b);

      // Vignette
      vec2 vignetteUv = vUv - 0.5;
      float vignette = 1.0 - dot(vignetteUv, vignetteUv) * 1.2;
      color.rgb *= vignette;

      // Screen glow
      color.rgb += vec3(0.02, 0.03, 0.02) * (1.0 - vignette);

      // Flicker
      color.rgb *= 0.97 + 0.03 * sin(time * 10.0);

      gl_FragColor = color;
    }
  `
}

export { CRTEffectShader }
