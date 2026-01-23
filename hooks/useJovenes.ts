'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../utils/api-client'
import { Joven, ApiResponse } from '../types'

export const useJovenes = () => {
  const queryClient = useQueryClient()

  // GET /jovenes - Listar todos los jóvenes
  const { data: jovenes, isLoading, error } = useQuery<Joven[]>({
    queryKey: ['jovenes'],
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/jovenes')
      return data.jovenes || data.data || []
    },
  })

  // GET /jovenes/:id - Obtener un joven específico
  const useGetJoven = (id: string) => {
    return useQuery<Joven | null>({
      queryKey: ['jovenes', id],
      queryFn: async () => {
        try {
          console.log('🔍 Fetching joven with id:', id)
          const { data } = await apiClient.get<any>(`/jovenes/${id}`)
          console.log('📡 Full Response:', data)
          
          let result = null
          if (typeof data === 'object') {
            result = data.joven || data.data || (Array.isArray(data) ? null : data)
          }
          
          console.log('✅ Extracted joven:', result)
          
          if (!result) {
            console.warn('⚠️ No data found in response')
          }
          
          return result as Joven | null
        } catch (error: any) {
          console.error('❌ Error fetching joven:', error.response?.data || error.message || error)
          return null
        }
      },
      enabled: !!id,
    })
  }

  // POST /joven/registro - Crear nuevo joven (registro público)
  const createJovenPublic = useMutation({
    mutationFn: (data: any) =>
      apiClient.post<ApiResponse<Joven>>('/joven/registro', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jovenes'] })
    },
  })

  // PUT /jovenes/:id - Actualizar joven
  const updateJoven = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.put<ApiResponse<Joven>>(`/jovenes/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['jovenes'] })
      queryClient.invalidateQueries({ queryKey: ['jovenes', id] })
    },
  })

  // DELETE /jovenes/:id - Eliminar joven
  const deleteJoven = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/jovenes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jovenes'] })
    },
  })

  return {
    // Queries
    jovenes,
    isLoading,
    error,
    useGetJoven,

    // Mutations
    createJovenPublic,
    updateJoven,
    deleteJoven,
  }
}
