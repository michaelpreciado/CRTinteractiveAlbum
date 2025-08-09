import React, { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Code, Mail } from 'lucide-react'
import { useProgress } from '@react-three/drei'
import HeroScene from './HeroScene'
import InfoCard from './InfoCard'

interface LoadingScreenProps {
  progress: number
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => (
  <div className="fixed inset-0 bg-dark-ambient flex items-center justify-center z-50">
    <div className="text-center">
      <div className="animate-pulse-glow mb-4 dodger-glow">
        <Monitor size={48} className="mx-auto text-dodger-500" />
      </div>
      <p className="text-dodger-400 font-mono text-lg text-glow">
        Loading CRT workstation... {Math.round(progress)}%
      </p>
      <div className="mt-4 flex justify-center space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-dodger-500 rounded-full animate-pulse dodger-glow"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
    </div>
  </div>
)

const Navbar: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-40 p-6" role="navigation" aria-label="Main navigation">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="flex justify-between items-center"
    >
      <h1 className="text-2xl font-bold text-dodger-500 text-glow">CRT.Archive</h1>
      <div className="hidden md:flex space-x-6">
        <a href="#about" className="hover:text-dodger-400 transition-colors hover:text-glow" aria-label="About section">About</a>
        <a href="#tech" className="hover:text-dodger-400 transition-colors hover:text-glow" aria-label="Tech stack section">Tech</a>
        <a href="#contact" className="hover:text-dodger-400 transition-colors hover:text-glow" aria-label="Contact section">Contact</a>
      </div>
    </motion.div>
  </nav>
)

const App: React.FC = () => {
  const { progress } = useProgress()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => setIsLoading(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [progress])

  const cardData = [
    {
      id: 'about',
      title: 'About Me',
      icon: <Monitor className="w-6 h-6" />,
      content: 'Passionate front-end engineer with a love for retro computing aesthetics and modern web technologies. Bridging the gap between nostalgic design and cutting-edge development.',
    },
    {
      id: 'tech',
      title: 'Tech Stack',
      icon: <Code className="w-6 h-6" />,
      content: 'React 18, TypeScript, Three.js, React Three Fiber, Tailwind CSS, Framer Motion, and modern WebGL with dynamic lighting and reflections for immersive 3D experiences.',
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: <Mail className="w-6 h-6" />,
      content: 'Ready to collaborate on innovative projects that push the boundaries of web interaction. Let\'s create something extraordinary together.',
    },
  ]

  return (
    <div className="min-h-screen bg-dark-ambient">
      {isLoading && <LoadingScreen progress={progress} />}
      <Navbar />

      <main role="main">
        <section className="h-screen relative" aria-label="3D CRT Display">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </section>

        <section className="py-20 px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {cardData.map((card, index) => (
              <InfoCard
                key={card.id}
                title={card.title}
                icon={card.icon}
                content={card.content}
                delay={index * 0.2}
                id={card.id}
              />
            ))}
          </motion.div>
        </section>
      </main>

      <footer className="py-8 text-center text-gray-500" role="contentinfo">
        <p>&copy; 2024 CRT Interactive Album. Crafted with modern web technologies.</p>
      </footer>
    </div>
  )
}

export default App 