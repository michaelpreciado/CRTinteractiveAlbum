# CRT Interactive Album 🖥️✨

A stunning 3D interactive photo album featuring a retro CRT monitor in a beautifully lit room. Experience your photos in a nostalgic Windows XP environment with persistent cloud storage.

![CRT Album](https://img.shields.io/badge/version-1.0_RC-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-0.181.1-black)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

- 🎨 **Stunning 3D Scene**: Realistic CRT monitor on a wooden desk with dramatic lighting
- 🖼️ **Photo Gallery**: Upload and view your photos in a retro Windows XP interface
- 🔍 **Cinematic Zoom**: Clicking a photo eases the camera into the screen while the room dims around the CRT frame
- 💾 **Save with CRT Effect**: Export any photo as a PNG with the full CRT treatment (scanlines, phosphor mask, curvature) baked in
- 🎭 **Authentic CRT Shader**: Aperture-grille phosphor triads, soft scanlines, barrel curvature, chromatic aberration, bloom, interference and flicker — all in a single pass
- 🖱️ **Interactive**: Drag the cursor across the screen, click the folder to browse, click a photo to zoom
- ⚡ **120 fps-minded**: Adaptive resolution, zero React re-renders on pointer move, single-draw-call wallpaper and screen, bounded render-target sizes
- 💾 **Persistent Storage**: Images are saved to a cloud database and persist across sessions
- 📱 **Mobile Optimized**: Fully responsive design that works on all devices

## 🚀 Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/michaelpreciado/CRT-Photo-Album.git
   cd CRT-Photo-Album
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Local Development with Database

To test with the full database functionality locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run the frontend and serverless API routes
npm run vercel-dev
```

## 📦 Tech Stack

- **Frontend**: React 19, Three.js, React Three Fiber
- **3D Graphics**: @react-three/fiber, @react-three/drei, postprocessing
- **Styling**: Styled Components
- **Database**: Vercel Postgres
- **Storage**: Vercel Blob
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🗄️ Database Structure

The app uses Vercel Postgres to store image metadata:

```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  filename TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Images are stored in Vercel Blob storage, with URLs saved in the database.

## 🌐 Deployment

Deploy to Vercel with database support in minutes!

**Quick Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/michaelpreciado/CRT-Photo-Album.git)

**Manual Deployment:**

Import this repository into Vercel with the Vite framework preset. The build command is `npm run build` and the output directory is `dist`.

Configure the variables listed in [`.env.example`](.env.example) for the database and image storage. API routes live in `api/`; `npm run dev` serves only the Vite frontend, while `npm run vercel-dev` also runs the serverless routes locally.

## 📁 Project Structure

```
CRT-Photo-Album/
├── api/                    # Serverless API routes
│   ├── upload.js          # Image upload endpoint
│   ├── images.js          # Fetch images endpoint
│   └── init-db.js         # Database initialization
├── src/
│   ├── components/        # React components
│   │   ├── CRTMonitor.jsx # 3D CRT monitor
│   │   ├── Scene.jsx      # Main 3D scene
│   │   └── OS/            # Windows XP UI components
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── vercel.json            # Vercel configuration
└── .env.example           # Environment variables template
```

## 🎮 Usage

1. **View Photos**: The app loads with sample images from the database
2. **Upload Images**: Click the "Upload Images" button to add your own photos
3. **Interact**: Drag the cursor on the CRT screen and click the "My Pictures" folder to open the gallery
4. **Zoom In**: Click a photo — the camera glides toward the screen and the room dims so the image takes focus
5. **Save**: Hit "Save with CRT effect" to download a PNG of the photo with the CRT overlay baked in
6. **Persist**: All uploaded images are saved to the cloud and persist across sessions

## 🔧 API Endpoints

- `GET /api/images` - Fetch all images from database
- `POST /api/upload` - Upload new image to Blob storage and database
- `POST /api/init-db` - Initialize database with default images

## 🎨 Customization

### Modify Default Images

Edit `api/init-db.js` to change the default sample images:

```javascript
const defaultImages = [
  'https://your-image-url.com/image1.jpg',
  'https://your-image-url.com/image2.jpg',
  // Add more...
];
```

### Adjust 3D Scene

Modify `src/components/Scene.jsx` to change:

- Lighting
- Camera position
- Room environment
- Monitor position

### Customize CRT Effects

Edit `src/components/shaders/CRTEffectShader.jsx` to adjust:

- Scanline intensity
- Screen curvature
- Color effects

## 🐛 Troubleshooting

### Images not loading

- Check that Vercel Postgres and Blob storage are properly configured
- Verify environment variables in Vercel dashboard
- Check browser console for API errors

### Upload failing

- Ensure file size is under 10MB
- Check that `BLOB_READ_WRITE_TOKEN` is set
- Verify API route is accessible

### 3D scene not rendering

- Clear browser cache
- Check for WebGL support in your browser
- Verify Three.js dependencies are installed

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes!

## 🙏 Acknowledgments

- Built with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Inspired by retro computing aesthetics
- Sample images from [Picsum](https://picsum.photos)

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

---

Made with ❤️ and nostalgia for the CRT era
