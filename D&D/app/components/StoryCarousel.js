'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sword, Shield, Crown } from 'lucide-react'

const storySlides = [
  {
    id: 1,
    title: "O Reino Perdido",
    content: "Há muito tempo, em terras distantes, um reino próspero foi consumido pelas trevas. Lendas falam de heróis corajosos que podem restaurar a luz...",
    icon: Crown,
    background: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
  },
  {
    id: 2,
    title: "A Jornada Começa",
    content: "Você é um dos escolhidos, destinado a enfrentar perigos inimagináveis. Com coragem e sabedoria, você deve forjar seu próprio caminho...",
    icon: Sword,
    background: "bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900"
  },
  {
    id: 3,
    title: "O Destino te Aguarda",
    content: "Criaturas místicas, tesouros ocultos e desafios épicos esperam por você. Prepare-se para uma aventura que mudará sua vida para sempre...",
    icon: Shield,
    background: "bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900"
  }
]

export default function StoryCarousel({ onEnterGame }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % storySlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const nextSlide = () => {
    setIsAutoPlay(false)
    setCurrentSlide((prev) => (prev + 1) % storySlides.length)
  }

  const prevSlide = () => {
    setIsAutoPlay(false)
    setCurrentSlide((prev) => (prev - 1 + storySlides.length) % storySlides.length)
  }

  const currentStory = storySlides[currentSlide]
  const IconComponent = currentStory.icon

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${currentStory.background} transition-all duration-1000`}>
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-black/40 backdrop-blur-md border-2 border-gold/30 shadow-2xl rounded-lg">
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-8"
                >
                  <IconComponent className="w-20 h-20 text-gold mx-auto" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl font-bold text-gold mb-8 font-serif"
                >
                  {currentStory.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg md:text-xl text-gray-200 leading-relaxed mb-12 max-w-2xl mx-auto"
                >
                  {currentStory.content}
                </motion.p>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 bg-black/20 border border-gold/30 hover:bg-gold/20 text-gold rounded flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2">
                    {storySlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setIsAutoPlay(false)
                          setCurrentSlide(index)
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-gold scale-125' 
                            : 'bg-gray-400 hover:bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 bg-black/20 border border-gold/30 hover:bg-gold/20 text-gold rounded flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Enter Game Button */}
                {currentSlide === storySlides.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <button
                      onClick={onEnterGame}
                      className="bg-gold hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                    >
                      Entrar no Jogo
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
