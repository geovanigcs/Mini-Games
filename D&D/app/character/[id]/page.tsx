'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

interface Character {
  id: string
  nome: string
  raca: string
  classe: string
  nivel: number
  forca: number
  destreza: number
  constituicao: number
  inteligencia: number
  sabedoria: number
  carisma: number
  imagem_url?: string
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

interface CharacterSkill {
  id: string
  maestria: number
  experiencia: number
  skill: Skill
}

export default function CharacterProfilePage() {
  const router = useRouter()
  const params = useParams()
  const characterId = params.id as string

  const [loading, setLoading] = useState(true)
  const [character, setCharacter] = useState<Character | null>(null)
  const [characterSkills, setCharacterSkills] = useState<CharacterSkill[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Add skill modal
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [newMaestria, setNewMaestria] = useState(10)
  
  // Edit skill
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editMaestria, setEditMaestria] = useState(0)

  useEffect(() => {
    fetchCharacterData()
    fetchAvailableSkills()
  }, [characterId])

  const fetchCharacterData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth')
        return
      }

      // Fetch character details
      const characterResponse = await fetch('/api/characters', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (characterResponse.ok) {
        const characters = await characterResponse.json()
        const currentCharacter = characters.find((c: Character) => c.id === characterId)
        
        if (currentCharacter) {
          setCharacter(currentCharacter)
        } else {
          setError('Personagem não encontrado')
          return
        }
      }

      // Fetch character skills
      const skillsResponse = await fetch(`/api/character-skills?characterId=${characterId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (skillsResponse.ok) {
        const skills = await skillsResponse.json()
        setCharacterSkills(skills)
      }

    } catch (err) {
      setError('Erro ao carregar dados do personagem')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      if (response.ok) {
        const skills = await response.json()
        setAvailableSkills(skills)
      }
    } catch (err) {
      console.error('Erro ao carregar habilidades:', err)
    }
  }

  const handleAddSkill = async () => {
    if (!selectedSkill || !character) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/character-skills', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: character.id,
          skillId: selectedSkill,
          maestria: newMaestria
        })
      })

      if (response.ok) {
        await fetchCharacterData()
        setShowAddSkill(false)
        setSelectedSkill('')
        setNewMaestria(10)
      } else {
        const errorData = await response.json()
        setError(errorData.error)
      }
    } catch (err) {
      setError('Erro ao adicionar habilidade')
    }
  }

  const handleUpdateSkill = async (characterSkillId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/character-skills', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterSkillId,
          maestria: editMaestria
        })
      })

      if (response.ok) {
        await fetchCharacterData()
        setEditingSkill(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error)
      }
    } catch (err) {
      setError('Erro ao atualizar habilidade')
    }
  }

  const handleDeleteSkill = async (characterSkillId: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta habilidade?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/character-skills?characterSkillId=${characterSkillId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        await fetchCharacterData()
      } else {
        const errorData = await response.json()
        setError(errorData.error)
      }
    } catch (err) {
      setError('Erro ao remover habilidade')
    }
  }

  const getMaestriaColor = (maestria: number) => {
    if (maestria >= 80) return 'text-green-400'
    if (maestria >= 60) return 'text-blue-400'
    if (maestria >= 40) return 'text-yellow-400'
    if (maestria >= 20) return 'text-orange-400'
    return 'text-red-400'
  }

  const getMaestriaLabel = (maestria: number) => {
    if (maestria >= 90) return 'Lendário'
    if (maestria >= 80) return 'Mestre'
    if (maestria >= 70) return 'Especialista'
    if (maestria >= 60) return 'Proficiente'
    if (maestria >= 40) return 'Competente'
    if (maestria >= 20) return 'Novato'
    return 'Iniciante'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <FloatingParticles />
        <div className="text-center text-white z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-lg">⚡ Carregando perfil do personagem...</p>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <FloatingParticles />
        <div className="text-center text-white z-10">
          <p className="text-lg text-red-400">❌ Personagem não encontrado</p>
        </div>
      </div>
    )
  }

  // Group skills by category
  const skillsByCategory = characterSkills.reduce((acc, characterSkill) => {
    const category = characterSkill.skill.categoria
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(characterSkill)
    return acc
  }, {} as Record<string, CharacterSkill[]>)

  // Filter available skills (not already learned)
  const learnedSkillIds = characterSkills.map(cs => cs.skill.id)
  const unlearnedSkills = availableSkills.filter(skill => !learnedSkillIds.includes(skill.id))

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
          className="max-w-6xl mx-auto"
        >
          {/* Character Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-400 mb-2">
              ⚔️ {character.nome}
            </h1>
            <p className="text-slate-300">
              {character.raca} • {character.classe} • Nível {character.nivel}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Character Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-amber-400 mb-4">📊 Atributos</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <span>💪</span>
                  <span className="text-sm">FOR: {character.forca}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🤸</span>
                  <span className="text-sm">DES: {character.destreza}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🛡️</span>
                  <span className="text-sm">CON: {character.constituicao}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🧠</span>
                  <span className="text-sm">INT: {character.inteligencia}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🦉</span>
                  <span className="text-sm">SAB: {character.sabedoria}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✨</span>
                  <span className="text-sm">CAR: {character.carisma}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-amber-400 mb-4">🎯 Habilidades</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{characterSkills.length}</div>
                <div className="text-sm text-slate-300">Habilidades Aprendidas</div>
                <div className="text-xs text-slate-400 mt-1">
                  Maestria Média: {characterSkills.length > 0 
                    ? Math.round(characterSkills.reduce((acc, cs) => acc + cs.maestria, 0) / characterSkills.length)
                    : 0}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-amber-400 mb-4">⭐ Progressão</h3>
              <motion.button
                onClick={() => setShowAddSkill(true)}
                className="w-full py-2 bg-amber-600/20 text-amber-400 rounded-lg hover:bg-amber-600/30 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
                <span>Nova Habilidade</span>
              </motion.button>
            </div>
          </div>

          {/* Skills by Category */}
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <h3 className="text-xl font-semibold text-amber-400 mb-4 capitalize">
                  🏷️ {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((characterSkill) => (
                    <div key={characterSkill.id} className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{characterSkill.skill.emoji}</span>
                          <div>
                            <div className="font-semibold text-white">{characterSkill.skill.nome}</div>
                            <div className="text-xs text-slate-400 capitalize">
                              {characterSkill.skill.atributo_base}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingSkill(characterSkill.id)
                              setEditMaestria(characterSkill.maestria)
                            }}
                            className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(characterSkill.id)}
                            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {editingSkill === characterSkill.id ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-300">Maestria:</span>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={editMaestria}
                              onChange={(e) => setEditMaestria(parseInt(e.target.value))}
                              className="w-16 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-center text-sm"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateSkill(characterSkill.id)}
                              className="flex-1 py-1 bg-green-600 text-white rounded text-xs flex items-center justify-center space-x-1"
                            >
                              <Save size={12} />
                              <span>Salvar</span>
                            </button>
                            <button
                              onClick={() => setEditingSkill(null)}
                              className="flex-1 py-1 bg-slate-600 text-white rounded text-xs flex items-center justify-center space-x-1"
                            >
                              <X size={12} />
                              <span>Cancelar</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-bold ${getMaestriaColor(characterSkill.maestria)}`}>
                              {characterSkill.maestria}/100
                            </span>
                            <span className={`text-xs ${getMaestriaColor(characterSkill.maestria)}`}>
                              {getMaestriaLabel(characterSkill.maestria)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                characterSkill.maestria >= 80 ? 'bg-green-500' :
                                characterSkill.maestria >= 60 ? 'bg-blue-500' :
                                characterSkill.maestria >= 40 ? 'bg-yellow-500' :
                                characterSkill.maestria >= 20 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${characterSkill.maestria}%` }}
                            />
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {characterSkill.skill.descricao}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {characterSkills.length === 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-12 border border-slate-700/50 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-amber-400 mb-2">Nenhuma Habilidade Aprendida</h3>
                <p className="text-slate-300 mb-4">
                  Seu personagem ainda não possui habilidades especiais. Comece adicionando algumas!
                </p>
                <motion.button
                  onClick={() => setShowAddSkill(true)}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Adicionar Primeira Habilidade
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-md w-full max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-amber-400">Adicionar Habilidade</h3>
              <button
                onClick={() => setShowAddSkill(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Habilidade
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="">Selecione uma habilidade</option>
                  {unlearnedSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.emoji} {skill.nome} ({skill.categoria})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Maestria Inicial (1-100)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newMaestria}
                  onChange={(e) => setNewMaestria(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div className="flex space-x-3">
                <motion.button
                  onClick={handleAddSkill}
                  disabled={!selectedSkill}
                  className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Adicionar
                </motion.button>
                <button
                  onClick={() => setShowAddSkill(false)}
                  className="flex-1 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
