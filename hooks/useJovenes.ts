'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/api-client'
import { Joven, ApiResponse } from '@/types'

export const useJovenes = () => {
  const queryClient = useQueryClient()

  // GET /api/jovenes - Listar todos los jóvenes
  const { data: jovenes, isLoading, error } = useQuery<Joven[]>({
    queryKey: ['jovenes'],
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/api/jovenes')
      return data.jovenes || data.data || []
    },
  })

  // GET /api/jovenes/:id - Obtener un joven específico
  const useGetJoven = (id: string) => {
    return useQuery<Joven | null>({
      queryKey: ['jovenes', id],
      queryFn: async () => {
        try {
          const { data } = await apiClient.get<any>(`/api/jovenes/${id}`)
          return data.data || null
        } catch {
          return null
        }
      },
      enabled: !!id,
    })
  }

  // POST /api/joven/registro - Crear nuevo joven (registro público)
  const createJovenPublic = useMutation({
    mutationFn: (data: any) =>
      apiClient.post<ApiResponse<Joven>>('/joven/registro', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jovenes'] })
    },
  })

  // PUT /api/jovenes/:id - Actualizar joven
  const updateJoven = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.put<ApiResponse<Joven>>(`/api/jovenes/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['jovenes'] })
      queryClient.invalidateQueries({ queryKey: ['jovenes', id] })
    },
  })

  // DELETE /api/jovenes/:id - Eliminar joven
  const deleteJoven = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/jovenes/${id}`),
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
