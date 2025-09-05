'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sword, Crown, Mountain } from 'lucide-react'

interface AdventureStory {
  id: number
  title: string
  subtitle: string
  content: string
  emoji: string
  icon: any
  backgroundGradient: string
}

const adventureStories: AdventureStory[] = [
  {
    id: 1,
    title: "A Antiga Profecia",
    subtitle: "🌟 Uma Profecia Desperta",
    content: "Nos pergaminhos esquecidos de Eldoria, está escrito: 'Quando a escuridão consumir o reino e a esperança parecer perdida, um escolhido se levantará. Eles empunharão o poder dos reis antigos e restaurarão a luz à Terra Média.' 📜✨",
    emoji: "👑",
    icon: Crown,
    backgroundGradient: "from-purple-900/80 via-indigo-900/60 to-blue-900/80"
  },
  {
    id: 2,
    title: "A Sombra se Ergue",
    subtitle: "🌑 A Escuridão se Espalha",
    content: "O Senhor das Trevas Morgul despertou de seu sono de mil anos. Seus exércitos sombrios marcham pelas terras, corrompendo tudo em seu caminho. Vilas queimam, reinos caem, e a magia antiga definha. Apenas as almas mais corajosas ousam enfrentar esta onda de mal. ⚡🔥",
    emoji: "🌪️",
    icon: Mountain,
    backgroundGradient: "from-red-900/80 via-orange-900/60 to-yellow-900/80"
  },
  {
    id: 3,
    title: "Seu Destino Aguarda",
    subtitle: "⚔️ O Chamado à Aventura",
    content: "Você não é comum. Sangue antigo corre por suas veias, e o destino chama seu nome. Empunhe espada e escudo, domine as artes arcanas, ou caminhe pela trilha das sombras. A escolha é sua, mas o destino da Terra Média pende na balança! 🗡️🛡️",
    emoji: "🔥",
    icon: Sword,
    backgroundGradient: "from-emerald-900/80 via-teal-900/60 to-cyan-900/80"
  }
]

interface AdventureIntroProps {
  onStartJourney: () => void
}

export default function AdventureIntro({ onStartJourney }: AdventureIntroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adventureStories.length)
    }, 6000) // 6 seconds per slide

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % adventureStories.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + adventureStories.length) % adventureStories.length)
  }

  const currentStory = adventureStories[currentSlide]
  const IconComponent = currentStory.icon

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800 flex items-center justify-center overflow-hidden">
      {/* Adventure slides */}
      <div className="max-w-4xl mx-auto text-center z-10 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
            className="bg-stone-900/80 border border-amber-600/30 rounded-2xl p-8 backdrop-blur-sm"
          >
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
              className="mb-8"
            >
              <IconComponent className="w-24 h-24 text-amber-400 mx-auto animate-pulse" />
            </motion.div>

            {/* Story Content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-5xl font-cinzel font-bold text-amber-300 mb-2">
                  {currentStory.title}
                </h1>
                <p className="text-2xl text-amber-200 font-light">
                  {currentStory.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <p className="text-lg text-amber-100 leading-relaxed">
                  {currentStory.content}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 px-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-stone-800/80 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 hover:text-amber-100 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Slide indicators */}
          <div className="flex space-x-3">
            {adventureStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-amber-500 scale-125'
                    : 'bg-stone-600 hover:bg-amber-600/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-stone-800/80 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 hover:text-amber-100 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <motion.button
            onClick={onStartJourney}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xl font-bold rounded-lg shadow-lg transition-all duration-300 border-2 border-amber-500/50"
          >
            ⚔️ Iniciar Jornada
          </motion.button>
        </motion.div>

        {/* Epic quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-amber-300/70 italic font-cinzel">
            "Nem todos os que vagueiam estão perdidos"
          </p>
          <p className="text-amber-400/50 text-sm mt-1">- Tolkien</p>
        </motion.div>
      </div>
    </div>
  )
}
