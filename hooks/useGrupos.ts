'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../utils/api-client'
import { Grupo, ApiResponse } from '../types/index'

export const useGrupos = () => {
  const queryClient = useQueryClient()

  // GET /grupos - Listar todos los grupos
  const { data: grupos, isLoading, error } = useQuery<Grupo[]>({
    queryKey: ['grupos'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Grupo[]>>('/grupos')
      return response.data?.data || []
    },
  })

  const useGetGrupo = (id: string) => {
    return useQuery<Grupo | null>({
      queryKey: ['grupos', id],
      queryFn: async () => {
        try {
          console.log('🔍 Fetching grupo details for id:', id)
          const response = await apiClient.get<ApiResponse<Grupo>>(`/grupos/${id}`)
          console.log('📡 API Response:', response.data)

          // La API devuelve { success: true, data: { ... } }
          if (response.data?.success && response.data?.data) {
            console.log('✅ Found grupo:', response.data.data)
            return response.data.data
          }

          return null
        } catch (error: unknown) {
          console.error('❌ Error fetching grupo details:', error)
          return null
        }
      },
      enabled: !!id,
    })
  }

  // POST /grupos - Crear nuevo grupo
  const createGrupo = useMutation({
    mutationFn: (data: Omit<Grupo, 'id' | 'created_at' | 'updated_at'>) =>
      apiClient.post<ApiResponse<Grupo>>('/grupos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
    },
  })

  // PUT /grupos/:id - Actualizar grupo
  const updateGrupo = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Grupo> }) =>
      apiClient.put<ApiResponse<Grupo>>(`/grupos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
    },
  })

  // DELETE /grupos/:id - Eliminar grupo
  const deleteGrupo = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/grupos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
    },
  })

  return {
    grupos,
    isLoading,
    error,
    useGetGrupo,
    createGrupo,
    updateGrupo,
    deleteGrupo,
  }
}