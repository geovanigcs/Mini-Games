'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Users, LogOut } from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

interface Character {
  id: number
  name: string
  race: string
  characterClass: string
  level: number
  image?: string
}

interface User {
  id: number
  nome: string
  nickname: string
}

export default function HeroesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchCharacters(token)
    } catch (err) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }, [router])

  const fetchCharacters = async (token: string) => {
    try {
      const response = await fetch('/api/characters', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCharacters(data)
      } else if (response.status === 401) {
        // Token is invalid
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      } else {
        throw new Error('Failed to fetch characters')
      }
    } catch (err) {
      setError('Erro ao carregar personagens')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleCreateCharacter = () => {
    router.push('/heroes/create')
  }

  const handleCharacterClick = (characterId: number) => {
    // In the future, this could navigate to a character detail page
    console.log('Character clicked:', characterId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <FloatingParticles />
        <div className="text-center text-white z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-lg">Carregando seus heróis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </motion.button>

          <div className="flex items-center space-x-4">
            <div className="text-white text-right">
              <p className="font-semibold">{user?.nome}</p>
              <p className="text-sm text-slate-300">@{user?.nickname}</p>
            </div>
            <motion.button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Sair"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-400 mb-2">
              ⚔️ Seus Heróis
            </h1>
            <p className="text-slate-300">
              Gerencie seus personagens e embarque em novas aventuras
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

          {/* Create Character Button */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={handleCreateCharacter}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              <span>Criar Novo Herói</span>
            </motion.button>
          </motion.div>

          {/* Characters Grid */}
          {characters.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {characters.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 hover:border-amber-500/50 transition-all cursor-pointer"
                  onClick={() => handleCharacterClick(character.id)}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Character Image Placeholder */}
                  <div className="w-full h-32 bg-slate-700/50 rounded-lg mb-4 flex items-center justify-center">
                    {character.image ? (
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Users size={32} className="text-slate-400" />
                    )}
                  </div>

                  {/* Character Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {character.name}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-300">
                        <span className="text-amber-400">Raça:</span> {character.race}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-amber-400">Classe:</span> {character.characterClass}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-amber-400">Nível:</span> {character.level}
                      </p>
                    </div>
                  </div>

                  {/* Action Badge */}
                  <div className="mt-4 text-center">
                    <span className="inline-block px-3 py-1 bg-amber-600/20 text-amber-400 text-xs font-medium rounded-full border border-amber-600/30">
                      Clique para detalhes
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-12 border border-slate-700/50 max-w-md mx-auto">
                <Users size={64} className="text-slate-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Nenhum herói criado ainda
                </h3>
                <p className="text-slate-300 mb-6">
                  Sua jornada épica começa aqui! Crie seu primeiro personagem e embarque em aventuras inesquecíveis.
                </p>
                <motion.button
                  onClick={handleCreateCharacter}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                  <span>Criar Primeiro Herói</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
