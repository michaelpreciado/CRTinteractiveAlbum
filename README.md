# CRT Interactive Album

A visually stunning single-page website showcasing a 90s era CRT computer on a wooden desk in a dark, moody room, built with modern web technologies.

## Features

- **3D CRT Computer Scene**: Interactive 3D model using React Three Fiber
- **Dynamic Slideshow**: CRT screen displays cycling images every 3.5 seconds
- **Atmospheric Effects**: Dust particles, soft shadows, and bloom post-processing
- **Glass-morphism Cards**: Modern info cards with backdrop blur effects
- **Accessibility**: Semantic HTML, ARIA labels, and reduced motion support
- **Performance Optimized**: Lazy loading, batching, and progressive enhancement

## Tech Stack

- **React 18** + **TypeScript** for component architecture
- **React Three Fiber** + **Drei** for 3D scene rendering
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **@react-three/postprocessing** for visual effects
- **Vite** for fast development and building

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your assets:**
   - Place `crt_computer_draco.glb` in `/public/models/`
   - Add `slide1.jpg`, `slide2.jpg`, `slide3.jpg`, `slide4.jpg` in `/public/slides/`

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
├── public/
│   ├── models/          # 3D model files
│   └── slides/          # Slideshow images
├── src/
│   ├── App.tsx          # Main app component
│   ├── HeroScene.tsx    # 3D scene with CRT computer
│   ├── InfoCard.tsx     # Reusable glass-morphism cards
│   ├── main.tsx         # React entry point
│   └── tailwind.css     # Custom styles and utilities
├── index.html
├── vite.config.ts
└── tailwind.config.js
```

## Asset Requirements

- **3D Model**: `crt_computer_draco.glb` with a "Screen" mesh for the monitor
- **Images**: Four JPEG files (slide1-4.jpg) for the slideshow
- **Fonts**: JetBrains Mono (loaded from Google Fonts)

## Browser Support

- Modern browsers with WebGL 2.0 support
- Chrome 57+, Firefox 51+, Safari 12+, Edge 79+

## Performance Notes

- Optimized for devices with pixel ratio ≤ 2
- Lazy loading with React Suspense
- Efficient 3D rendering with automatic batching
- Reduced motion detection for accessibility

## License

MIT License - feel free to use this project as a starting point for your own creations.