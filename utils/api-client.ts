import axios, { AxiosInstance, AxiosError } from 'axios'
import { supabase } from '@/lib/supabase'

interface ApiErrorResponse {
  success: false
  error: string
  message?: string
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`
  }
  return config
})

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
    }
    return Promise.reject(error)
  }
)

export default apiClient
