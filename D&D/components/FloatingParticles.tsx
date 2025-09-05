'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Create floating particles (embers, dust, magical sparkles)
    const newParticles: Particle[] = []
    
    for (let i = 0; i < 25; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#8b4513' : '#ffffff',
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
      })
    }
    
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Embers */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-30 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            y: [-20, -100, -20],
            x: [-10, 10, -10],
            opacity: [0.1, 0.6, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Mystical Fog Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-dark-gold-500/5 via-transparent to-transparent"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Runes/Symbols */}
      <div className="absolute inset-0">
        {['⚔️', '🛡️', '🏺', '📜', '💍', '🗡️', '🏹', '🔮'].map((symbol, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${20 + (index * 8)}%`,
            }}
            animate={{
              y: [-30, -60, -30],
              rotate: [-5, 5, -5],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 15 + index * 2,
              delay: index * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
