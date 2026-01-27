'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import apiClient from '../utils/api-client'

interface CurrentUser {
  id: string
  email: string
  nombre_completo: string
  telefono: string
  rol: 'admin' | 'lider' | 'usuario' | 'visitante'
  estado: 'activo' | 'inactivo'
  ultima_sesion: string | null
  created_at: string
  updated_at: string
}

export const useCurrentUser = () => {
  const { session, isAuthenticated } = useAuth()

  return useQuery<CurrentUser | null>({
    queryKey: ['current-user', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id || !isAuthenticated) return null
      
      try {
        // Hacer una llamada directa a Supabase para obtener los datos del usuario
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`)
        }
        
        const result = await response.json()
        return result.data || null
      } catch (error) {
        console.error('Error fetching current user:', error)
        return null
      }
    },
    enabled: !!session?.user?.id && isAuthenticated,
    retry: 1,
  })
}