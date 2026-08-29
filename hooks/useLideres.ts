'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '../utils/api-client'
import { User, ApiResponse } from '../types/index'
import { useAuth } from './useAuth'

export const useLideres = () => {
  const { session, loading } = useAuth()

  return useQuery<User[]>({
    queryKey: ['lideres'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>('/users')
      return response.data?.data || []
    },
    enabled: !!session && !loading,
  })
}