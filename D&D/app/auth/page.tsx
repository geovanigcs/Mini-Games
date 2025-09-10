'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

interface AuthFormData {
  emailOrNickname: string
  senha: string
  nome?: string
  nickname?: string
  email?: string
  confirmarSenha?: string
}

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState<AuthFormData>({
    emailOrNickname: '',
    senha: ''
  })

  const resetForm = () => {
    setFormData({
      emailOrNickname: '',
      senha: '',
      nome: '',
      nickname: '',
      email: '',
      confirmarSenha: ''
    })
    setError(null)
    setSuccess(null)
  }

  const handleModeChange = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode)
    resetForm()
  }

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log('🔐 Tentando fazer login com:', formData.emailOrNickname)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrNickname: formData.emailOrNickname.trim(),
          senha: formData.senha
        })
      })
      
      const data = await response.json()
      console.log('📊 Resposta do servidor:', { status: response.status, data })

      if (response.ok) {
        console.log('✅ Login bem-sucedido! Salvando dados...')
        console.log('Token:', data.token)
        console.log('User data:', data.user)
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        console.log('📱 Dados salvos no localStorage')
        console.log('Token salvo:', localStorage.getItem('token'))
        console.log('User salvo:', localStorage.getItem('user'))
        
        setSuccess(`${data.message || '🎉 Login realizado com sucesso!'} Redirecionando...`)
        
        console.log('🔄 Iniciando redirecionamento para /dashboard...')
        setTimeout(() => {
          console.log('🚀 Executando router.push("/dashboard")')
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(data.error || 'Email/nickname ou senha incorretos')
      }
    } catch (err) {
      console.error('❌ Erro no login:', err)
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          nickname: formData.nickname,
          email: formData.email,
          senha: formData.senha
        })
      })
      
      const data = await response.json()

      if (response.ok) {
        setSuccess('🎉 Conta criada com sucesso! Agora faça login para continuar.')
        setMode('login')
        resetForm()
      } else {
        setError(data.error || 'Erro no cadastro')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrNickname: formData.emailOrNickname })
      })
      
      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setFormData({ emailOrNickname: '', senha: '' })
      } else {
        setError(data.error || 'Erro ao enviar email de recuperação')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      
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
          {mode !== 'forgot' && (
            <div className="flex mb-8 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => handleModeChange('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Cadastrar
              </button>
            </div>
          )}

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <motion.form
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
                      value={formData.emailOrNickname}
                      onChange={(e) => handleInputChange('emailOrNickname', e.target.value)}
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
                        value={formData.senha}
                        onChange={(e) => handleInputChange('senha', e.target.value)}
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
                    onClick={() => handleModeChange('forgot')}
                    className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Esqueceu sua senha?
                  </button>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? '⏳ Entrando...' : '🚪 Entrar na Aventura'}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <motion.form
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
                      value={formData.nome || ''}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
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
                      value={formData.nickname || ''}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
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
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                      value={formData.senha}
                      onChange={(e) => handleInputChange('senha', e.target.value)}
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
                      value={formData.confirmarSenha || ''}
                      onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Confirme sua senha"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? '⏳ Criando...' : '⚔️ Criar Conta de Herói'}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <motion.form
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
                      value={formData.emailOrNickname}
                      onChange={(e) => handleInputChange('emailOrNickname', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Digite seu email ou nickname"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? '⏳ Enviando...' : '� Recuperar Senha Mágica'}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
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
