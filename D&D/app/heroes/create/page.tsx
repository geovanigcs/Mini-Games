'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Dice6, Upload, User } from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

interface Race {
  id: number
  name: string
  description: string
  bonuses: string
}

interface CharacterClass {
  id: number
  name: string
  description: string
  hitDie: string
  primaryAbility: string
}

interface Stats {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export default function CreateCharacterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Form data
  const [name, setName] = useState('')
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null)
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [stats, setStats] = useState<Stats>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Game data
  const [races, setRaces] = useState<Race[]>([])
  const [classes, setClasses] = useState<CharacterClass[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchGameData()

    // Background music setup
    const audio = new Audio('/audio/The First Town.mp3')
    audio.loop = true
    audio.volume = 0.25 // Volume baixo para não atrapalhar a criação
    
    // Tentar reproduzir automaticamente
    const playAudio = async () => {
      try {
        await audio.play()
      } catch (error) {
        // Se não conseguir reproduzir automaticamente, aguardar interação do usuário
        const handleUserInteraction = async () => {
          try {
            await audio.play()
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('keydown', handleUserInteraction)
          } catch (err) {
            console.log('Não foi possível reproduzir o áudio')
          }
        }
        
        document.addEventListener('click', handleUserInteraction)
        document.addEventListener('keydown', handleUserInteraction)
      }
    }

    playAudio()

    // Cleanup: parar o áudio quando sair da página
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [router])

  const fetchGameData = async () => {
    try {
      const [racesResponse, classesResponse] = await Promise.all([
        fetch('/api/races'),
        fetch('/api/classes')
      ])

      if (racesResponse.ok && classesResponse.ok) {
        const racesData = await racesResponse.json()
        const classesData = await classesResponse.json()
        
        setRaces(racesData)
        setClasses(classesData)
      } else {
        throw new Error('Failed to fetch game data')
      }
    } catch (err) {
      setError('Erro ao carregar dados do jogo')
    } finally {
      setDataLoading(false)
    }
  }

  const rollStats = () => {
    const rollStat = () => {
      // Roll 4d6, drop lowest
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
      rolls.sort((a, b) => b - a)
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
    }

    setStats({
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat()
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !selectedRaceId || !selectedClassId) {
      setError('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      
      // Create character
      const characterData = {
        name: name.trim(),
        raceId: selectedRaceId,
        classId: selectedClassId,
        level: 1,
        stats
      }

      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData)
      })

      if (response.ok) {
        const character = await response.json()
        
        // Upload image if provided
        if (image) {
          const formData = new FormData()
          formData.append('image', image)
          
          await fetch(`/api/characters/update-image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData
          })
        }

        setSuccessMessage('Personagem criado com sucesso!')
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/heroes')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao criar personagem')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedRace = races.find(race => race.id === selectedRaceId)
  const selectedClass = classes.find(cls => cls.id === selectedClassId)

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <FloatingParticles />
        <div className="text-center text-white z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-lg">Carregando dados do jogo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <motion.button
          onClick={() => router.push('/heroes')}
          className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Voltar aos Heróis</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-400 mb-2">
              🏗️ Criar Novo Herói
            </h1>
            <p className="text-slate-300">
              Dê vida ao seu personagem e prepare-se para a aventura
            </p>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center"
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-center"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Character Name */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">
                    📝 Nome do Personagem
                  </h3>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Digite o nome do seu herói..."
                    required
                  />
                </div>

                {/* Race Selection */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">
                    🧬 Raça
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {races.map((race) => (
                      <motion.button
                        key={race.id}
                        type="button"
                        onClick={() => setSelectedRaceId(race.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedRaceId === race.id
                            ? 'bg-amber-600/20 border-amber-500 text-white'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-amber-500/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-semibold">{race.name}</div>
                        <div className="text-xs opacity-75">{race.bonuses}</div>
                      </motion.button>
                    ))}
                  </div>
                  {selectedRace && (
                    <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm text-slate-300">{selectedRace.description}</p>
                    </div>
                  )}
                </div>

                {/* Class Selection */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">
                    ⚔️ Classe
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {classes.map((cls) => (
                      <motion.button
                        key={cls.id}
                        type="button"
                        onClick={() => setSelectedClassId(cls.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedClassId === cls.id
                            ? 'bg-amber-600/20 border-amber-500 text-white'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-amber-500/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-semibold">{cls.name}</div>
                        <div className="text-xs opacity-75">{cls.hitDie} • {cls.primaryAbility}</div>
                      </motion.button>
                    ))}
                  </div>
                  {selectedClass && (
                    <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm text-slate-300">{selectedClass.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Character Image */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">
                    🖼️ Imagem do Personagem
                  </h3>
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-slate-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={48} className="text-slate-400" />
                      )}
                    </div>
                    <label className="inline-block px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg cursor-pointer hover:bg-slate-600/50 transition-colors">
                      <Upload size={16} className="inline mr-2" />
                      Enviar Imagem
                      <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-amber-400">
                      🎲 Atributos
                    </h3>
                    <motion.button
                      type="button"
                      onClick={rollStats}
                      className="flex items-center space-x-2 px-3 py-1 bg-amber-600/20 text-amber-400 rounded-lg hover:bg-amber-600/30 transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Dice6 size={16} />
                      <span>Rolar</span>
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(stats).map(([stat, value]) => (
                      <div key={stat} className="flex items-center space-x-3">
                        <label className="text-sm text-slate-300 capitalize w-20">
                          {stat === 'strength' ? 'Força' :
                           stat === 'dexterity' ? 'Destreza' :
                           stat === 'constitution' ? 'Constituição' :
                           stat === 'intelligence' ? 'Inteligência' :
                           stat === 'wisdom' ? 'Sabedoria' :
                           'Carisma'}:
                        </label>
                        <input
                          type="number"
                          min="3"
                          max="18"
                          value={value}
                          onChange={(e) => setStats(prev => ({
                            ...prev,
                            [stat]: parseInt(e.target.value) || 10
                          }))}
                          className="w-16 px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-white text-center focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                        <span className="text-xs text-slate-400">
                          ({Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={20} />
              <span>{isLoading ? 'Criando Herói...' : '✨ Criar Herói'}</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
