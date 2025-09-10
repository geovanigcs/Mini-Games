'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Dice6, Upload, User } from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

interface Race {
  id: number
  nome: string
  descricao: string
  emoji: string
  attribute_bonuses: {
    forca: number
    destreza: number
    constituicao: number
    inteligencia: number
    sabedoria: number
    carisma: number
  }
}

interface CharacterClass {
  id: number
  nome: string
  descricao: string
  hit_die: string
  primary_attribute: string
  emoji: string
}

interface Stats {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

interface Skill {
  id: string
  nome: string
  descricao: string
  emoji: string
  categoria: string
  atributo_base: string
  tipo: string
}

interface SelectedSkill {
  skillId: string
  maestria: number
}

export default function CreateCharacterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
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
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
      return
    }

    fetchGameData()
  }, [router])

  const fetchGameData = async () => {
    try {
      const [racesResponse, classesResponse, skillsResponse] = await Promise.all([
        fetch('/api/races'),
        fetch('/api/classes'),
        fetch('/api/skills?type=complementary') // Buscar apenas habilidades complementares
      ])

      if (racesResponse.ok && classesResponse.ok && skillsResponse.ok) {
        const racesData = await racesResponse.json()
        const classesData = await classesResponse.json()
        const skillsData = await skillsResponse.json()
        
        setRaces(racesData)
        setClasses(classesData)
        setSkills(skillsData)
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

  const handleSkillToggle = (skillId: string) => {
    const isSelected = selectedSkills.find(s => s.skillId === skillId)
    
    if (isSelected) {
      // Remove skill
      setSelectedSkills(prev => prev.filter(s => s.skillId !== skillId))
    } else {
      // Add skill with default maestria of 10
      setSelectedSkills(prev => [...prev, { skillId, maestria: 10 }])
    }
  }

  const handleMaestriaChange = (skillId: string, maestria: number) => {
    setSelectedSkills(prev => 
      prev.map(s => 
        s.skillId === skillId 
          ? { ...s, maestria: Math.max(1, Math.min(100, maestria)) }
          : s
      )
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      
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

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      
      const characterData = {
        name: name.trim(),
        raceId: selectedRaceId,
        classId: selectedClassId,
        level: 1,
        stats
      }

      const response = await fetch('/api/characters/simple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData)
      })

      if (response.ok) {
        const character = await response.json()
        
        // Add selected skills to character
        for (const selectedSkill of selectedSkills) {
          await fetch('/api/character-skills', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              characterId: character.id,
              skillId: selectedSkill.skillId,
              maestria: selectedSkill.maestria
            })
          })
        }
        
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

        setSuccess('Personagem criado com sucesso!')
        
        // Redirect after a short delay
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

  const selectedRace = races.find(race => race.id === selectedRaceId)
  const selectedClass = classes.find(cls => cls.id === selectedClassId)

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

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-center"
            >
              {success}
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
                    🏛️ Escolha sua Raça
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
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{race.emoji}</span>
                          <div>
                            <div className="font-semibold">{race.nome}</div>
                            <div className="text-xs opacity-75">Bônus de atributos</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {selectedRace && (
                    <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm text-slate-300">{selectedRace.descricao}</p>
                    </div>
                  )}
                </div>

                {/* Class Selection */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">
                    🎯 Escolha sua Classe
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
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{cls.emoji}</span>
                          <div>
                            <div className="font-semibold">{cls.nome}</div>
                            <div className="text-xs opacity-75">{cls.hit_die} • {cls.primary_attribute}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {selectedClass && (
                    <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm text-slate-300">{selectedClass.descricao}</p>
                    </div>
                  )}
                </div>

                {/* Complementary Skills */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">
                    🎯 Habilidades Complementares
                  </h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Escolha habilidades adicionais e defina o nível de maestria (1-100)
                  </p>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {skills.map((skill) => {
                      const selectedSkill = selectedSkills.find(s => s.skillId === skill.id)
                      const isSelected = !!selectedSkill
                      
                      return (
                        <div
                          key={skill.id}
                          className={`p-3 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-amber-600/20 border-amber-500'
                              : 'bg-slate-700/30 border-slate-600/50 hover:border-amber-500/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <motion.button
                              type="button"
                              onClick={() => handleSkillToggle(skill.id)}
                              className="flex items-center space-x-2 flex-1 text-left"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="text-xl">{skill.emoji}</span>
                              <div>
                                <div className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                  {skill.nome}
                                </div>
                                <div className="text-xs opacity-75 capitalize">
                                  {skill.categoria} • {skill.atributo_base}
                                </div>
                              </div>
                            </motion.button>
                            
                            {isSelected && (
                              <div className="flex items-center space-x-2 ml-4">
                                <span className="text-xs text-slate-300">Maestria:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={selectedSkill?.maestria || 10}
                                  onChange={(e) => handleMaestriaChange(skill.id, parseInt(e.target.value))}
                                  className="w-16 px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-white text-center text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                />
                              </div>
                            )}
                          </div>
                          
                          {isSelected && (
                            <div className="mt-2 text-xs text-slate-400">
                              {skill.descricao}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  {selectedSkills.length > 0 && (
                    <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-sm text-slate-300">
                        <span className="font-semibold">Habilidades selecionadas:</span> {selectedSkills.length}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Maestria média: {Math.round(selectedSkills.reduce((acc, s) => acc + s.maestria, 0) / selectedSkills.length)}
                      </div>
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
                      <span>Rolar Dados</span>
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(stats).map(([stat, value]) => (
                      <div key={stat} className="flex items-center space-x-3">
                        <label className="text-sm text-slate-300 capitalize w-24 flex items-center space-x-1">
                          <span>
                            {stat === 'strength' ? '💪' :
                             stat === 'dexterity' ? '🤸' :
                             stat === 'constitution' ? '🛡️' :
                             stat === 'intelligence' ? '🧠' :
                             stat === 'wisdom' ? '🦉' :
                             '✨'}
                          </span>
                          <span className="text-xs">
                            {stat === 'strength' ? 'FOR' :
                             stat === 'dexterity' ? 'DES' :
                             stat === 'constitution' ? 'CON' :
                             stat === 'intelligence' ? 'INT' :
                             stat === 'wisdom' ? 'SAB' :
                             'CAR'}:
                          </span>
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
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={20} />
              <span>{loading ? '⏳ Criando Herói...' : '🎉 Criar Herói'}</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
