'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Music, Eye, Play } from 'lucide-react'
import Image from 'next/image'
import { useMusic } from '@/contexts/MusicContext'

interface MiddleEarthStory {
  id: number
  title: string
  subtitle: string
  content: string
  image: string
  icon: any
  backgroundGradient: string
}

const middleEarthStories: MiddleEarthStory[] = [
  {
    id: 1,
    title: "O Salão de Eru Ilúvatar",
    subtitle: "✨ O Princípio de Tudo",
    content: "No princípio, antes mesmo do tempo e da matéria, existia Eru Ilúvatar, o Criador supremo que deu origem a tudo. Em sua eterna sabedoria, Ilúvatar concebeu os Ainur, espíritos poderosos que se tornaram seus primeiros filhos. Ele os ensinou a música, e juntos, eles criaram uma sinfonia magnífica, que moldou o universo e trouxe à existência o mundo de Arda.",
    image: "/images/salaodeiru.png",
    icon: Star,
    backgroundGradient: "from-blue-900/80 via-purple-900/60 to-indigo-900/80"
  },
  {
    id: 2,
    title: "A Música dos Ainur",
    subtitle: "🎵 A Grande Sinfonia",
    content: "Entretanto, entre os Ainur, havia um que se destacava por sua ambição e poder: Melkor, o mais grandioso dos Ainur. Seu desejo de dominar e corromper o que Ilúvatar havia criado o levou a se rebelar. Melkor começou a distorcer a música, introduzindo discordâncias que geraram caos e escuridão. Essa deturpação trouxe sofrimento ao mundo e criou as primeiras sombras sobre a Terra Média.",
    image: "/images/ainur.png",
    icon: Music,
    backgroundGradient: "from-red-900/80 via-orange-900/60 to-yellow-900/80"
  },
  {
    id: 3,
    title: "O Despertar dos Elfos",
    subtitle: "🌟 Os Primeiros Filhos",
    content: "Com o tempo, Ilúvatar permitiu que os Ainur descessem a Arda para moldá-la e habitá-la. Assim, os Elfos, os primeiros filhos de Ilúvatar, despertaram nas florestas de Cuiviénen. Eles eram belos e imortais, dotados de grande sabedoria e habilidades. Mas a influência de Melkor ainda pairava sobre o mundo, e sua presença sombria despertava tanto medo quanto desejo entre os povos que surgiriam. Assim, a história da Terra Média se desenrola, marcada pela luta entre a luz e a escuridão, onde os destinos dos Elfos, Homens e outras raças estão entrelaçados em uma tapeçaria de heroísmo e traição.",
    image: "/images/despertar.png",
    icon: Eye,
    backgroundGradient: "from-emerald-900/80 via-teal-900/60 to-cyan-900/80"
  }
]

interface AdventureIntroProps {
  onStartJourney: () => void
}

export default function AdventureIntro({ onStartJourney }: AdventureIntroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { state, dispatch } = useMusic()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % middleEarthStories.length)
    }, 15000) 
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % middleEarthStories.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + middleEarthStories.length) % middleEarthStories.length)
  }

  const startMusic = () => {
    if (!state.isPlaying) {
      dispatch({ type: 'PLAY' })
    }
  }

  const currentStory = middleEarthStories[currentSlide]
  const IconComponent = currentStory.icon

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800 flex items-center justify-center overflow-hidden">
      {!state.isPlaying && (
        <button
          onClick={startMusic}
          className="absolute top-4 right-4 z-20 p-3 rounded-full bg-stone-800/80 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 hover:text-amber-100 transition-all duration-300 flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          <span className="text-sm">Iniciar Música</span>
        </button>
      )}

      <div className="max-w-6xl mx-auto text-center z-10 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
            className="bg-stone-900/90 border border-amber-600/30 rounded-2xl p-8 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 relative w-full h-64 md:h-80 rounded-xl overflow-hidden"
            >
              <Image
                src={currentStory.image}
                alt={currentStory.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", delay: 0.4 }}
              className="mb-6"
            >
              <IconComponent className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-300 mb-2">
                  {currentStory.title}
                </h1>
                <p className="text-xl md:text-2xl text-amber-200 font-light">
                  {currentStory.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                <p className="text-base md:text-lg text-amber-100 leading-relaxed text-justify">
                  {currentStory.content}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 px-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-stone-800/80 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 hover:text-amber-100 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex space-x-3">
            {middleEarthStories.map((_, index) => (
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
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
            ⚔️ Entrar na Terra Média
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-amber-300/70 italic font-cinzel">
            "Nem todos os que vagueiam estão perdidos"
          </p>
          <p className="text-amber-400/50 text-sm mt-1">- J.R.R. Tolkien</p>
        </motion.div>
      </div>
    </div>
  )
}
