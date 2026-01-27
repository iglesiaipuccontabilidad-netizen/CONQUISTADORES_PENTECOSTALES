'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../utils/api-client'
import { Joven, ApiResponse, RegistroJovenFormData } from '../types/index'

export const useJovenes = () => {
  const queryClient = useQueryClient()

  // GET /jovenes - Listar todos los jóvenes
  const { data: jovenes, isLoading, error } = useQuery<Joven[]>({
    queryKey: ['jovenes'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Joven[]>>('/jovenes')
      return response.data?.data || []
    },
  })

  const useGetJoven = (id: string) => {
    return useQuery<Joven | null>({
      queryKey: ['jovenes', id],
      queryFn: async () => {
        try {
          console.log('🔍 Fetching details for joven_id:', id)
          const response = await apiClient.get<ApiResponse<Joven>>(`/jovenes/${id}`)
          console.log('📡 API Response Body:', response.data)

          // El backend devuelve { success: true, data: { ... } }
          if (response.data?.success && response.data?.data) {
            console.log('✅ Found joven:', response.data.data)
            return response.data.data
          }

          return null
        } catch (error: unknown) {
          console.error('❌ Error fetching joven details:', error)
          return null
        }
      },
      enabled: !!id,
    })
  }

  // POST /api/joven/registro - Crear nuevo joven (registro público)
  const createJovenPublic = useMutation({
    mutationFn: (data: RegistroJovenFormData) =>
      apiClient.post<ApiResponse<Joven>>('/joven/registro', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jovenes'] })
    },
  })

  // PUT /jovenes/:id - Actualizar joven
  const updateJoven = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Joven> }) =>
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
