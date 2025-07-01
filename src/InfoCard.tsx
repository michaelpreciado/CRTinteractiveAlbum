import React from 'react'
import { motion } from 'framer-motion'

interface InfoCardProps {
  title: string
  icon: React.ReactNode
  content: string
  delay?: number
  id?: string
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  icon, 
  content, 
  delay = 0,
  id 
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ 
        y: -5, 
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      viewport={{ once: true }}
      data-aos="fade-up"
      data-aos-delay={delay * 100}
      className="glass-morphism rounded-xl p-6 hover:bg-dodger-500/15 transition-all duration-300 
                 crt-scanlines animate-float hover:animate-pulse-glow hover:dodger-glow group"
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      role="article"
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="text-dodger-400 group-hover:scale-110 transition-transform duration-300 group-hover:text-glow">
          {icon}
        </div>
        <h3 
          id={`${id}-title`}
          className="text-xl font-bold text-dodger-400 group-hover:text-dodger-300 group-hover:text-glow transition-colors duration-300"
        >
          {title}
        </h3>
      </div>
      
      <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
        {content}
      </p>
      
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-crt-glow/10 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r 
                      from-transparent via-crt-glow/50 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

export default InfoCard 