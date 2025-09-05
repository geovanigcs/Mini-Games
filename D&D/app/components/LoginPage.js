'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function LoginPage({ onLogin, onBack }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (formData.username && formData.password) {
        const userData = {
          id: Date.now().toString(),
          username: formData.username,
          joinedAt: new Date().toISOString()
        }
        onLogin(userData)
      } else {
        setError('Por favor, preencha todos os campos')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen medieval-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/40 backdrop-blur-md border-2 border-gold/30 shadow-2xl rounded-lg">
          <div className="text-center p-6 pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gold" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-gold font-serif">Entrar no Reino</h2>
            <p className="text-gray-300 mt-2">Digite suas credenciais para acessar a aventura</p>
          </div>

          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-200 font-medium block">Nome do Aventureiro</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Digite seu nome de usuário"
                    className="w-full pl-12 pr-4 py-3 bg-black/20 border border-gold/30 rounded text-white placeholder:text-gray-400 focus:border-gold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-200 font-medium block">Palavra Secreta</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    className="w-full pl-12 pr-12 py-3 bg-black/20 border border-gold/30 rounded text-white placeholder:text-gray-400 focus:border-gold focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded border border-red-500/30"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gold hover:bg-yellow-600 text-black font-bold rounded shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mx-auto animate-spin" />
                ) : (
                  "Entrar na Aventura"
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-gold/20">
              <button
                onClick={onBack}
                className="text-gray-300 hover:text-gold flex items-center gap-2 mx-auto px-4 py-2 rounded transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à História
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
