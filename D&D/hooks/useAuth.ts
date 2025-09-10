'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        // Token existe, usuário está autenticado
        setIsAuthenticated(true)
      } else {
        // Não há token, redirecionar para auth
        setIsAuthenticated(false)
        router.push('/auth')
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    router.push('/auth')
  }

  return { isAuthenticated, isLoading, logout }
}

export function useAuthRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/auth')
    }
  }, [router])
}
