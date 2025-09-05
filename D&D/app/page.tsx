'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdventureIntro from '@/components/AdventureIntro'
import FloatingParticles from '@/components/FloatingParticles'
import CharacterCreationDynamic from '@/components/CharacterCreationDynamic'
import CharacterSelect from '@/components/CharacterSelect'

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'intro' | 'login' | 'register' | 'character' | 'select'>('intro')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [loginForm, setLoginForm] = useState({
    emailOrNickname: '',
    senha: ''
  })

  const [registerForm, setRegisterForm] = useState({
    nome: '',
    nickname: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
      })
      
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem('token', data.token)
        
        if (data.user.characters && data.user.characters.length > 0) {
          setCurrentView('select')
        } else {
          setCurrentView('character')
        }
      } else {
        setError(data.error || 'Erro no login')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (registerForm.senha !== registerForm.confirmarSenha) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: registerForm.nome,
          nickname: registerForm.nickname,
          email: registerForm.email,
          senha: registerForm.senha,
        })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem('token', data.token)
        setCurrentView('character')
      } else {
        setError(data.error || 'Erro no cadastro')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    }

    setIsLoading(false)
  }

  const handleCharacterCreated = (character: any) => {
    if (user) {
      setUser((prev: any) => ({
        ...prev,
        characters: [...(prev.characters || []), character]
      }));
    }
    setCurrentView('select');
  };

  return (
    <>
      <div className="fixed inset-0 middle-earth-bg">
        <FloatingParticles />
      </div>

      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <AdventureIntro onStartJourney={() => setCurrentView('login')} />
            </motion.div>
          )}

          {currentView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="min-h-screen flex items-center justify-center p-6"
            >
              <div className="bg-stone-900/80 border border-amber-600/30 rounded-2xl p-8 backdrop-blur-sm max-w-md w-full mx-4">
                <div className="text-center mb-8">
                  <motion.h1 
                    className="text-4xl font-cinzel text-amber-300 mb-2"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    🏔️ Terra Média RPG
                  </motion.h1>
                  <p className="text-amber-200">Bem-vindo de volta, aventureiro!</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">Email ou Usuário</label>
                    <input
                      type="text"
                      value={loginForm.emailOrNickname}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, emailOrNickname: e.target.value }))}
                      className="w-full px-4 py-3 bg-stone-800/90 border border-amber-600/40 rounded-xl text-white placeholder-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="seu@email.com ou username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">Senha</label>
                    <input
                      type="password"
                      value={loginForm.senha}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, senha: e.target.value }))}
                      className="w-full p-3 bg-stone-800 border border-stone-600 rounded-lg text-amber-100 focus:border-amber-500 focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Entrando...' : 'Entrar no Reino'}
                  </motion.button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentView('register')}
                      className="text-amber-400 hover:text-amber-300 underline transition-colors"
                    >
                      Criar Nova Conta
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 p-4 bg-stone-800/40 border border-amber-600/30 rounded-xl text-amber-200">
                  <h4 className="font-bold text-amber-300 mb-2">🧪 Dados de Teste</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>Email:</strong> teste@rpg.com</div>
                    <div><strong>Senha:</strong> 123456</div>
                    <div className="text-xs text-stone-400 mt-2">Use essas credenciais para testar o login</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="min-h-screen flex items-center justify-center p-6"
            >
              <div className="bg-stone-900/80 border border-amber-600/30 rounded-2xl p-8 backdrop-blur-sm max-w-md w-full mx-4">
                <div className="text-center mb-8">
                  <motion.h1 
                    className="text-4xl font-cinzel text-amber-300 mb-2"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    ⚔️ Nova Conta
                  </motion.h1>
                  <p className="text-amber-200">Junte-se à aventura na Terra Média!</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">Nome Completo</label>
                    <input
                      type="text"
                      value={registerForm.nome}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full p-3 bg-stone-800 border border-stone-600 rounded-lg text-amber-100 focus:border-amber-500 focus:outline-none"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">Nickname de Aventureiro</label>
                    <input
                      type="text"
                      value={registerForm.nickname}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, nickname: e.target.value }))}
                      className="w-full p-3 bg-stone-800 border border-stone-600 rounded-lg text-amber-100 focus:border-amber-500 focus:outline-none"
                      placeholder="SeuNickname123"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">Email</label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 bg-stone-800 border border-stone-600 rounded-lg text-amber-100 focus:border-amber-500 focus:outline-none"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">Senha</label>
                    <input
                      type="password"
                      value={registerForm.senha}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, senha: e.target.value }))}
                      className="w-full p-3 bg-stone-800 border border-stone-600 rounded-lg text-amber-100 focus:border-amber-500 focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-200 mb-2 font-semibold">Confirmar Senha</label>
                    <input
                      type="password"
                      value={registerForm.confirmarSenha}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                      className="w-full p-3 bg-stone-800 border border-stone-600 rounded-lg text-amber-100 focus:border-amber-500 focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Criando...' : '✨ Criar Conta e Aventurar'}
                  </motion.button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentView('login')}
                      className="text-amber-400 hover:text-amber-300 underline transition-colors"
                    >
                      Já tenho conta
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {currentView === 'select' && user && (
            <motion.div
              key="select"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              <CharacterSelect
                onBack={() => setCurrentView('login')}
                onCreateNew={() => setCurrentView('character')}
                onSelectCharacter={(character) => {
                  // TODO: Implementar seleção de personagem
                }}
                user={user}
              />
            </motion.div>
          )}

          {currentView === 'character' && user && (
            <motion.div
              key="character"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CharacterCreationDynamic 
                onBack={() => {
                  if (user.characters && user.characters.length > 0) {
                    setCurrentView('select');
                  } else {
                    setCurrentView('login');
                  }
                }}
                onComplete={handleCharacterCreated}
                user={user}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
