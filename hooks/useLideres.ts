'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '../utils/api-client'
import { User, ApiResponse } from '../types/index'

export const useLideres = () => {
  return useQuery<User[]>({
    queryKey: ['lideres'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>('/users')
      return response.data?.data || []
    },
  })
}