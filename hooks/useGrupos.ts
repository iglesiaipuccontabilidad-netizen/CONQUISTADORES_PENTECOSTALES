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
      const { data } = await apiClient.get<unknown>('/grupos')
      return (data as any).grupos || (data as any).data || []
    },
  })

  const useGetGrupo = (id: string) => {
    return useQuery<Grupo | null>({
      queryKey: ['grupos', id],
      queryFn: async () => {
        try {
          console.log('🔍 Fetching grupo details for id:', id)
          const { data } = await apiClient.get<unknown>(`/grupos/${id}`)
          console.log('📡 API Response:', data)

          // La API devuelve { status: 'success', grupo: { ... } }
          if ((data as any)?.status === 'success' && (data as any)?.grupo) {
            console.log('✅ Found grupo:', (data as any).grupo)
            return (data as any).grupo as Grupo
          }

          // Fallback para otras estructuras
          const result = (data as any)?.grupo || (data as any)?.data || ((data as any) && !(data as any).status ? (data as any) : null)
          console.log('✅ Extracted result:', result)
          return result as Grupo | null
        } catch (error: unknown) {
          console.error('❌ Error fetching grupo details:', (error as any)?.response?.data || (error as any)?.message || error)
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