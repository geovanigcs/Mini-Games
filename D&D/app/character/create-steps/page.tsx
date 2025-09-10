'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, User, Shield, Zap, Sparkles } from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'
import AvatarEditor from '@/components/AvatarEditor'
import { useAuthRedirect } from '@/hooks/useAuth'

// Interfaces
interface Race {
  id: string
  nome: string
  descricao: string
  emoji: string
}

interface CharacterClass {
  id: string
  nome: string
  descricao: string
  emoji: string
  atributo_principal: string
}

interface Skill {
  id: string
  nome: string
  descricao: string
  emoji: string
  categoria: string
}

interface CharacterData {
  // Etapa 1 - Biografia
  nome: string
  titulo: string
  pseudonimo: string
  familia: string
  avatar_url: string
  idade: number
  
  // Etapa 2 - Raça
  raceId: string
  
  // Etapa 3 - Classes (até 2)
  primaryClassId: string
  secondaryClassId: string
  
  // Etapa 4 - Atributos
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  
  // Etapa 5 - Habilidades
  selectedSkills: { skillId: string; maestria: number }[]
  
  // Etapa 6 - Poderes Especiais
  powers: string[]
}

const STEPS = [
  { id: 1, title: 'Biografia', icon: User, description: 'Defina a identidade do seu herói' },
  { id: 2, title: 'Raça', icon: Shield, description: 'Escolha sua origem ancestral' },
  { id: 3, title: 'Classes', icon: Zap, description: 'Selecione até 2 classes' },
  { id: 4, title: 'Atributos', icon: Sparkles, description: 'Distribua pontos de habilidade' },
  { id: 5, title: 'Habilidades', icon: Sparkles, description: 'Aprenda habilidades especiais' },
  { id: 6, title: 'Poderes', icon: Sparkles, description: 'Defina poderes únicos' }
]

export default function CreateCharacterStepsPage() {
  const router = useRouter()
  useAuthRedirect() // Verificar autenticação
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)

  // Game data
  const [races, setRaces] = useState<Race[]>([])
  const [classes, setClasses] = useState<CharacterClass[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  // Character data
  const [characterData, setCharacterData] = useState<CharacterData>({
    nome: '',
    titulo: '',
    pseudonimo: '',
    familia: '',
    avatar_url: '',
    idade: 25,
    raceId: '',
    primaryClassId: '',
    secondaryClassId: '',
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    selectedSkills: [],
    powers: []
  })

  useEffect(() => {
    fetchGameData()
  }, [])

  const fetchGameData = async () => {
    try {
      const [racesResponse, classesResponse, skillsResponse] = await Promise.all([
        fetch('/api/races'),
        fetch('/api/classes'),
        fetch('/api/skills?type=complementary')
      ])

      if (racesResponse.ok && classesResponse.ok && skillsResponse.ok) {
        setRaces(await racesResponse.json())
        setClasses(await classesResponse.json())
        setSkills(await skillsResponse.json())
      } else {
        throw new Error('Failed to fetch game data')
      }
    } catch (err) {
      setError('Erro ao carregar dados do jogo')
    } finally {
      setDataLoading(false)
    }
  }

  const updateCharacterData = (field: keyof CharacterData, value: any) => {
    setCharacterData(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarSave = async (avatarUrl: string) => {
    updateCharacterData('avatar_url', avatarUrl)
    setShowAvatarEditor(false)
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const rollStats = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
      rolls.sort((a, b) => b - a)
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
    }

    updateCharacterData('stats', {
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat()
    })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return characterData.nome.trim() !== '' && characterData.familia.trim() !== ''
      case 2:
        return characterData.raceId !== ''
      case 3:
        return characterData.primaryClassId !== ''
      case 4:
        return true // Atributos sempre válidos
      case 5:
        return true // Habilidades opcionais
      case 6:
        return true // Poderes opcionais
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/characters/simple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: characterData.nome,
          raceId: characterData.raceId,
          classId: characterData.primaryClassId,
          level: 1,
          stats: characterData.stats
        })
      })

      if (response.ok) {
        const character = await response.json()
        
        // Add skills if selected
        for (const skill of characterData.selectedSkills) {
          await fetch('/api/character-skills', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              characterId: character.id,
              skillId: skill.skillId,
              maestria: skill.maestria
            })
          })
        }

        setSuccess('Personagem criado com sucesso!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao criar personagem')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <FloatingParticles />
        <div className="text-center text-white z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-lg">⚡ Carregando dados do jogo...</p>
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
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Voltar aos Heróis</span>
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600 text-white'
                      : isActive 
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'border-slate-600 text-slate-400'
                  }`}>
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-semibold ${
                      isActive ? 'text-amber-400' : isCompleted ? 'text-green-400' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {step.description}
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 h-px mx-4 ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-slate-600'
                    }`} />
                  )}
                </div>
              )
            })}
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

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-center"
            >
              {success}
            </motion.div>
          )}

          {/* Step Content */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 mb-6">
            <AnimatePresence mode="wait">
              {/* Step 1 - Biografia */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">📜 Biografia do Herói</h2>
                    <p className="text-slate-300">Defina a identidade e origem do seu personagem</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={characterData.nome}
                        onChange={(e) => updateCharacterData('nome', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="Nome do seu herói"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={characterData.titulo}
                        onChange={(e) => updateCharacterData('titulo', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="Ex: Cavaleiro, Lorde, Mestre..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Pseudônimo
                      </label>
                      <input
                        type="text"
                        value={characterData.pseudonimo}
                        onChange={(e) => updateCharacterData('pseudonimo', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="Como é conhecido nas ruas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Família *
                      </label>
                      <input
                        type="text"
                        value={characterData.familia}
                        onChange={(e) => updateCharacterData('familia', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="Sobrenome ou linhagem"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Avatar do Personagem
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {characterData.avatar_url ? (
                              <img
                                src={characterData.avatar_url}
                                alt="Avatar preview"
                                className="w-20 h-20 rounded-full object-cover border-2 border-amber-500/50"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyUzYuNDggMjIgMTIgMjJTMjIgMTcuNTIgMjIgMTJTMTcuNTIgMiAxMiAyWk0xMiA1QzEzLjY2IDUgMTUgNi4zNCAxNSA4UzEzLjY2IDExIDEyIDExUzkgOS42NiA5IDhTMTAuMzQgNSAxMiA1Wk0xMiAxOS4yQzEwLjIgMTkuMiA4LjYgMTguMyA3LjMgMTYuOUM3IDEwLjYgMTcgMTcgMTcgMTdTMTcgMTAuNiAxNi43IDE2LjlDMTUuNCAxOC4zIDEzLjggMTkuMiAxMiAxOS4yWiIgZmlsbD0iIzk0YTNiOCIvPgo8L3N2Zz4K'
                                }}
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl border-2 border-amber-500/50">
                                {characterData.nome.charAt(0).toUpperCase() || '👤'}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <button
                              type="button"
                              onClick={() => setShowAvatarEditor(true)}
                              className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              🖼️ {characterData.avatar_url ? 'Alterar Avatar' : 'Adicionar Avatar'}
                            </button>
                            
                            {characterData.avatar_url && (
                              <button
                                type="button"
                                onClick={() => updateCharacterData('avatar_url', '')}
                                className="w-full mt-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg text-sm transition-colors"
                              >
                                🗑️ Remover Avatar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Idade
                      </label>
                      <input
                        type="number"
                        min="16"
                        max="200"
                        value={characterData.idade}
                        onChange={(e) => updateCharacterData('idade', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2 - Raça */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">🏛️ Escolha sua Raça</h2>
                    <p className="text-slate-300">Sua origem ancestral define características únicas</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {races.map((race) => (
                      <motion.button
                        key={race.id}
                        type="button"
                        onClick={() => updateCharacterData('raceId', race.id)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          characterData.raceId === race.id
                            ? 'bg-amber-600/20 border-amber-500 text-white'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-amber-500/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-3xl">{race.emoji}</span>
                          <div>
                            <div className="font-semibold text-lg">{race.nome}</div>
                          </div>
                        </div>
                        <p className="text-sm opacity-75">{race.descricao}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3 - Classes */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">⚔️ Escolha suas Classes</h2>
                    <p className="text-slate-300">Selecione uma classe principal e opcionalmente uma secundária</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Classe Principal *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {classes.map((cls) => (
                        <motion.button
                          key={cls.id}
                          type="button"
                          onClick={() => updateCharacterData('primaryClassId', cls.id)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            characterData.primaryClassId === cls.id
                              ? 'bg-amber-600/20 border-amber-500 text-white'
                              : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-amber-500/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{cls.emoji}</span>
                            <div>
                              <div className="font-semibold">{cls.nome}</div>
                              <div className="text-xs opacity-75">{cls.atributo_principal}</div>
                            </div>
                          </div>
                          <p className="text-sm opacity-75">{cls.descricao}</p>
                        </motion.button>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">Classe Secundária (Opcional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <motion.button
                        type="button"
                        onClick={() => updateCharacterData('secondaryClassId', '')}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          characterData.secondaryClassId === ''
                            ? 'bg-amber-600/20 border-amber-500 text-white'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-amber-500/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl mb-2">❌</div>
                        <div className="font-semibold">Nenhuma</div>
                      </motion.button>
                      
                      {classes
                        .filter(cls => cls.id !== characterData.primaryClassId)
                        .map((cls) => (
                        <motion.button
                          key={cls.id}
                          type="button"
                          onClick={() => updateCharacterData('secondaryClassId', cls.id)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            characterData.secondaryClassId === cls.id
                              ? 'bg-amber-600/20 border-amber-500 text-white'
                              : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-amber-500/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{cls.emoji}</span>
                            <div>
                              <div className="font-semibold">{cls.nome}</div>
                              <div className="text-xs opacity-75">{cls.atributo_principal}</div>
                            </div>
                          </div>
                          <p className="text-sm opacity-75">{cls.descricao}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4 - Atributos */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">🎲 Atributos</h2>
                    <p className="text-slate-300">Distribua os pontos entre suas características</p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <motion.button
                      onClick={rollStats}
                      className="flex items-center space-x-2 px-4 py-2 bg-amber-600/20 text-amber-400 rounded-lg hover:bg-amber-600/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Sparkles size={20} />
                      <span>🎲 Rolar Dados</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.entries(characterData.stats).map(([stat, value]) => (
                      <div key={stat} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl mb-2">
                            {stat === 'strength' ? '💪' :
                             stat === 'dexterity' ? '🤸' :
                             stat === 'constitution' ? '🛡️' :
                             stat === 'intelligence' ? '🧠' :
                             stat === 'wisdom' ? '🦉' :
                             '✨'}
                          </div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            {stat === 'strength' ? 'Força' :
                             stat === 'dexterity' ? 'Destreza' :
                             stat === 'constitution' ? 'Constituição' :
                             stat === 'intelligence' ? 'Inteligência' :
                             stat === 'wisdom' ? 'Sabedoria' :
                             'Carisma'}
                          </label>
                          <input
                            type="number"
                            min="3"
                            max="18"
                            value={value}
                            onChange={(e) => {
                              const newStats = { ...characterData.stats, [stat]: parseInt(e.target.value) || 3 }
                              updateCharacterData('stats', newStats)
                            }}
                            className="w-20 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-center focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          />
                          <div className="text-xs text-slate-400 mt-1">
                            Mod: {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 5 - Habilidades */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">🎯 Habilidades Especiais</h2>
                    <p className="text-slate-300">Escolha habilidades complementares (opcional)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {skills.map((skill) => {
                      const isSelected = characterData.selectedSkills.find(s => s.skillId === skill.id)
                      
                      return (
                        <motion.div
                          key={skill.id}
                          className={`p-4 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-amber-600/20 border-amber-500'
                              : 'bg-slate-700/30 border-slate-600/50 hover:border-amber-500/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div 
                              className="flex items-center space-x-3 flex-1 cursor-pointer"
                              onClick={() => {
                                if (isSelected) {
                                  updateCharacterData('selectedSkills', 
                                    characterData.selectedSkills.filter(s => s.skillId !== skill.id)
                                  )
                                } else {
                                  updateCharacterData('selectedSkills', [
                                    ...characterData.selectedSkills,
                                    { skillId: skill.id, maestria: 20 }
                                  ])
                                }
                              }}
                            >
                              <span className="text-2xl">{skill.emoji}</span>
                              <div>
                                <div className="font-semibold text-white">{skill.nome}</div>
                                <div className="text-xs text-slate-400">{skill.categoria}</div>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-slate-300">Maestria:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="50"
                                  value={isSelected.maestria}
                                  onChange={(e) => {
                                    const newSkills = characterData.selectedSkills.map(s =>
                                      s.skillId === skill.id 
                                        ? { ...s, maestria: parseInt(e.target.value) || 1 }
                                        : s
                                    )
                                    updateCharacterData('selectedSkills', newSkills)
                                  }}
                                  className="w-16 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-center text-sm"
                                />
                              </div>
                            )}
                          </div>
                          
                          {isSelected && (
                            <div className="mt-2 text-xs text-slate-400">
                              {skill.descricao}
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                  {characterData.selectedSkills.length > 0 && (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <div className="text-sm text-slate-300">
                        <span className="font-semibold">Habilidades selecionadas:</span> {characterData.selectedSkills.length}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Maestria média: {Math.round(characterData.selectedSkills.reduce((acc, s) => acc + s.maestria, 0) / characterData.selectedSkills.length)}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 6 - Poderes */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">✨ Poderes Únicos</h2>
                    <p className="text-slate-300">Defina habilidades especiais do seu herói (opcional)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { id: 'fire', name: 'Soltar Fogo', emoji: '🔥', desc: 'Controlar e conjurar chamas' },
                      { id: 'ice', name: 'Gelo', emoji: '❄️', desc: 'Manipular gelo e frio' },
                      { id: 'lightning', name: 'Raio', emoji: '⚡', desc: 'Controlar eletricidade' },
                      { id: 'healing', name: 'Cura', emoji: '💚', desc: 'Regenerar ferimentos' },
                      { id: 'telekinesis', name: 'Telecinese', emoji: '🌀', desc: 'Mover objetos com a mente' },
                      { id: 'invisibility', name: 'Invisibilidade', emoji: '👻', desc: 'Tornar-se invisível' },
                      { id: 'flight', name: 'Voo', emoji: '🕊️', desc: 'Capacidade de voar' },
                      { id: 'super_strength', name: 'Super Força', emoji: '💥', desc: 'Força sobre-humana' },
                      { id: 'telepathy', name: 'Telepatia', emoji: '🧠', desc: 'Ler mentes' },
                    ].map((power) => (
                      <motion.button
                        key={power.id}
                        type="button"
                        onClick={() => {
                          if (characterData.powers.includes(power.id)) {
                            updateCharacterData('powers', characterData.powers.filter(p => p !== power.id))
                          } else {
                            updateCharacterData('powers', [...characterData.powers, power.id])
                          }
                        }}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          characterData.powers.includes(power.id)
                            ? 'bg-amber-600/20 border-amber-500 text-white'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-amber-500/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{power.emoji}</span>
                          <div>
                            <div className="font-semibold">{power.name}</div>
                          </div>
                        </div>
                        <p className="text-sm opacity-75">{power.desc}</p>
                      </motion.button>
                    ))}
                  </div>

                  {characterData.powers.length > 0 && (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <div className="text-sm text-slate-300">
                        <span className="font-semibold">Poderes selecionados:</span> {characterData.powers.length}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Seu herói terá habilidades especiais únicas!
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: currentStep > 1 ? 1.05 : 1 }}
              whileTap={{ scale: currentStep > 1 ? 0.95 : 1 }}
            >
              <ArrowLeft size={20} />
              <span>Anterior</span>
            </motion.button>

            {currentStep < STEPS.length ? (
              <motion.button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: canProceed() ? 1.05 : 1 }}
                whileTap={{ scale: canProceed() ? 0.95 : 1 }}
              >
                <span>Próximo</span>
                <ArrowRight size={20} />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: canProceed() && !loading ? 1.05 : 1 }}
                whileTap={{ scale: canProceed() && !loading ? 0.95 : 1 }}
              >
                <Check size={20} />
                <span>{loading ? 'Criando...' : 'Criar Herói'}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Editor Modal */}
      {showAvatarEditor && (
        <AvatarEditor
          currentAvatarUrl={characterData.avatar_url}
          characterName={characterData.nome || 'Novo Personagem'}
          onSave={handleAvatarSave}
          onCancel={() => setShowAvatarEditor(false)}
          isCreation={true}
        />
      )}
    </div>
  )
}
