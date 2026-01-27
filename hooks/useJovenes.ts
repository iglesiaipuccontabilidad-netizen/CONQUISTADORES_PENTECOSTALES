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
      const { data } = await apiClient.get<unknown>('/jovenes')
      return (data as any).jovenes || (data as any).data || []
    },
  })

  const useGetJoven = (id: string) => {
    return useQuery<Joven | null>({
      queryKey: ['jovenes', id],
      queryFn: async () => {
        try {
          console.log('🔍 Fetching details for joven_id:', id)
          const { data } = await apiClient.get<unknown>(`/jovenes/${id}`)
          console.log('📡 API Response Body:', data)

          // El backend devuelve { status: 'success', joven: { ... } }
          const result = (data as any)?.joven || (data as any)?.data || ((data as any) && !(data as any).status ? (data as any) : null)

          console.log('✅ Extracted Joven:', result)

          if (!result) {
            console.warn('⚠️ No youth data found in the response object')
          }

          return result as Joven | null
        } catch (error: unknown) {
          console.error('❌ Error fetching joven details:', (error as any).response?.data || (error as any).message || error)
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
