# CRT Interactive Album 🖥️✨

A stunning 3D interactive photo album featuring a retro CRT monitor in a beautifully lit room. Experience your photos in a nostalgic Windows XP environment with persistent cloud storage.

![CRT Album](https://img.shields.io/badge/version-1.0_RC-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-0.181.1-black)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

- 🎨 **Stunning 3D Scene**: Realistic CRT monitor on a wooden desk with dramatic lighting
- 🖼️ **Photo Gallery**: Upload and view your photos in a retro Windows XP interface
- 💾 **Persistent Storage**: Images are saved to a cloud database and persist across sessions
- 📱 **Mobile Optimized**: Fully responsive design that works on all devices
- 🎭 **CRT Effects**: Authentic scanlines and screen curvature for that retro feel
- 🖱️ **Interactive**: Click folders, scroll through images, and navigate the virtual OS
- ⚡ **Fast & Modern**: Built with React, Three.js, and Vite for optimal performance

## 🚀 Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd CRTinteractiveAlbum
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

# Run dev server
npm run dev
```

## 📦 Tech Stack

- **Frontend**: React 19, Three.js, React Three Fiber
- **3D Graphics**: @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **Styling**: Styled Components
- **Animation**: Framer Motion
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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

**Manual Deployment:**

See the comprehensive [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions on:

- Setting up Vercel Postgres
- Configuring Vercel Blob storage
- Environment variables
- Custom domains
- Troubleshooting

## 📁 Project Structure

```
CRTinteractiveAlbum/
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
├── .env.example           # Environment variables template
└── DEPLOYMENT.md          # Deployment guide
```

## 🎮 Usage

1. **View Photos**: The app loads with sample images from the database
2. **Upload Images**: Click the "Upload Images" button to add your own photos
3. **Interact**: Click on the folder icon on the CRT screen to open the gallery
4. **Navigate**: Click images to view them full-screen, scroll to browse
5. **Persist**: All uploaded images are saved to the cloud and persist across sessions

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
