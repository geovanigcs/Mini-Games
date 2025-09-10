'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token de redefinição não encontrado. Solicite uma nova redefinição de senha.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setSuccess(true);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Erro na redefinição:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-stone-900/90 to-amber-900/90 border-2 border-amber-600/30 rounded-2xl p-8 max-w-md w-full text-center backdrop-blur-md"
        >
          <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          
          <h2 className="text-2xl font-cinzel text-amber-300 mb-4">
            ✨ Senha Redefinida!
          </h2>
          
          <p className="text-stone-300 mb-6">
            Sua senha foi redefinida com sucesso! Agora você pode fazer login com sua nova senha.
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao D&D dos Pirangueiros
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-stone-900/90 to-amber-900/90 border-2 border-amber-600/30 rounded-2xl p-8 max-w-md w-full backdrop-blur-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-cinzel text-amber-300 mb-2">
            🔮 Nova Senha
          </h1>
          <p className="text-stone-300 text-sm">
            Defina uma nova senha para sua conta no D&D dos Pirangueiros
          </p>
        </div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-600/20 border border-green-600/30 rounded-lg text-green-300 text-sm"
          >
            {message}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-300 text-sm flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {/* Form */}
        {!error.includes('Token') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-200 mb-2">
                Nova Senha 🗝️
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Sua nova senha"
                  className="w-full pl-10 pr-10 py-3 bg-stone-800/60 border border-amber-600/30 rounded-lg text-amber-100 placeholder-amber-300/60 focus:border-amber-500 focus:outline-none transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-amber-300/70 mt-1">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-200 mb-2">
                Confirmar Nova Senha 🔒
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirme sua nova senha"
                  className="w-full pl-10 pr-10 py-3 bg-stone-800/60 border border-amber-600/30 rounded-lg text-amber-100 placeholder-amber-300/60 focus:border-amber-500 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Redefinindo...
                </div>
              ) : (
                '✨ Redefinir Senha'
              )}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Voltar ao início
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Carregando...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
