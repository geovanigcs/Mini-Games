'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Play } from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'
import { useMusic } from '@/contexts/MusicContext'

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot-password'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { state, dispatch } = useMusic()

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

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    emailOrNickname: ''
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
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/heroes')
      } else {
        setError(data.error || 'Erro no login')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (registerForm.senha !== registerForm.confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    setIsLoading(true)

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
          senha: registerForm.senha
        })
      })
      
      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/heroes')
      } else {
        setError(data.error || 'Erro no cadastro')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotPasswordForm)
      })
      
      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(data.message)
        setForgotPasswordForm({ emailOrNickname: '' })
      } else {
        setError(data.error || 'Erro ao enviar email de recuperação')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const startMusic = () => {
    if (!state.isPlaying) {
      dispatch({ type: 'PLAY' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      
      {!state.isPlaying && (
        <button
          onClick={startMusic}
          className="absolute top-4 right-4 z-20 p-3 rounded-full bg-slate-800/80 border border-amber-600/30 text-amber-200 hover:bg-amber-600/20 hover:text-amber-100 transition-all duration-300 flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          <span className="text-sm">Iniciar Música</span>
        </button>
      )}
      
      {/* Back Button */}
      <motion.button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </motion.button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Tab Navigation */}
          <div className="flex mb-8 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-center mb-6 text-amber-400">
                  🏰 Entrar na Aventura
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email ou Nickname
                    </label>
                    <input
                      type="text"
                      value={loginForm.emailOrNickname}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, emailOrNickname: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Digite seu email ou nickname"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginForm.senha}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, senha: e.target.value }))}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pr-10"
                        placeholder="Digite sua senha"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot-password')}
                    className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Esqueceu sua senha?
                  </button>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? 'Entrando...' : '🚪 Entrar'}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-center mb-6 text-amber-400">
                  ⚔️ Criar Conta
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={registerForm.nome}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nickname
                    </label>
                    <input
                      type="text"
                      value={registerForm.nickname}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, nickname: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Digite seu nickname"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Digite seu email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={registerForm.senha}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, senha: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Digite sua senha"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      value={registerForm.confirmarSenha}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Confirme sua senha"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? 'Criando...' : '🏗️ Criar Conta'}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Forgot Password Form */}
          {activeTab === 'forgot-password' && (
            <motion.form
              key="forgot-password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleForgotPassword}
              className="space-y-4"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-center mb-6 text-amber-400">
                  🔄 Recuperar Senha
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email ou Nickname
                    </label>
                    <input
                      type="text"
                      value={forgotPasswordForm.emailOrNickname}
                      onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, emailOrNickname: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Digite seu email ou nickname"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? 'Enviando...' : '📧 Enviar Link de Recuperação'}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="w-full text-center text-sm text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Voltar para o login
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
