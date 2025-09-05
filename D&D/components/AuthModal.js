'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    nome: '',
    nickname: '',
    email: '',
    emailOrNickname: '',
    password: '',
    confirmPassword: '',
  })
  
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const resetForm = () => {
    setFormData({
      nome: '',
      nickname: '',
      email: '',
      emailOrNickname: '',
      password: '',
      confirmPassword: '',
    })
    setErrors({})
    setMessage('')
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setMessage('')

    try {
      if (mode === 'login') {
        await handleLogin()
      } else if (mode === 'register') {
        await handleRegister()
      } else if (mode === 'forgot') {
        await handleForgotPassword()
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      setMessage('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    const { emailOrNickname, password } = formData
    
    console.log('🔍 AuthModal - Dados do formulário:', { emailOrNickname, password: password ? '***' : 'vazio' })

    if (!emailOrNickname || !password) {
      setErrors({ form: 'Preencha todos os campos' })
      return
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrNickname, senha: password }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.location.reload()
    } else {
      setErrors({ form: data.message || 'Erro no login' })
    }
  }

  const handleRegister = async () => {
    const { nome, nickname, email, password, confirmPassword } = formData

    if (!nome || !nickname || !email || !password) {
      setErrors({ form: 'Preencha todos os campos' })
      return
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Senhas não coincidem' })
      return
    }

    if (password.length < 6) {
      setErrors({ password: 'Senha deve ter pelo menos 6 caracteres' })
      return
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, nickname, email, senha: password }),
    })

    const data = await response.json()

    if (response.ok) {
      setMessage('Conta criada com sucesso! Faça login.')
      setMode('login')
      resetForm()
    } else {
      setErrors({ form: data.message || 'Erro no cadastro' })
    }
  }

  const handleForgotPassword = async () => {
    const { email } = formData

    if (!email) {
      setErrors({ email: 'Digite seu email' })
      return
    }

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrNickname: email }),
    })

    const data = await response.json()

    if (response.ok) {
      setMessage(data.message || 'Link de recuperação enviado para seu email!')
    } else {
      setErrors({ form: data.error || 'Erro ao enviar email' })
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    resetForm()
    setMessage('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-stone-900 rounded-xl border border-amber-600/40 p-6 w-full max-w-md shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amber-300">
              {mode === 'login' && 'Entrar'}
              {mode === 'register' && 'Criar Conta'}
              {mode === 'forgot' && 'Recuperar Senha'}
            </h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mensagens */}
          {message && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
              {message}
            </div>
          )}

          {errors.form && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              {errors.form}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-stone-300 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-2">Nome de Usuário</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Seu username"
                  />
                </div>
              </>
            )}

            {mode === 'login' && (
              <div>
                <label className="block text-stone-300 mb-2">Email ou Usuário</label>
                <input
                  type="text"
                  value={formData.emailOrNickname}
                  onChange={(e) => handleChange('emailOrNickname', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  placeholder="Seu email ou username"
                />
              </div>
            )}

            {(mode === 'register' || mode === 'forgot') && (
              <div>
                <label className="block text-stone-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <label className="block text-stone-300 mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-white focus:border-amber-500 focus:outline-none pr-12"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-stone-300 mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  placeholder="Confirme sua senha"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-stone-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Aguarde...' : (
                mode === 'login' ? 'Entrar' :
                mode === 'register' ? 'Criar Conta' :
                'Enviar Link'
              )}
            </button>
          </form>

          {/* Links de navegação */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  onClick={() => switchMode('forgot')}
                  className="text-amber-400 hover:text-amber-300 text-sm"
                >
                  Esqueci minha senha
                </button>
                <div>
                  <span className="text-stone-400 text-sm">Não tem conta? </span>
                  <button
                    onClick={() => switchMode('register')}
                    className="text-amber-400 hover:text-amber-300 text-sm"
                  >
                    Criar conta
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div>
                <span className="text-stone-400 text-sm">Já tem conta? </span>
                <button
                  onClick={() => switchMode('login')}
                  className="text-amber-400 hover:text-amber-300 text-sm"
                >
                  Fazer login
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <button
                onClick={() => switchMode('login')}
                className="text-amber-400 hover:text-amber-300 text-sm"
              >
                Voltar ao login
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
