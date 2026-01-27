import axios, { AxiosInstance, AxiosError } from 'axios'
import { supabase } from '../lib/supabase'

interface ApiErrorResponse {
  success: false
  error: string
  message?: string
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests (use anon key for public endpoints)
apiClient.interceptors.request.use(async (config) => {
  console.log('API Client: Adding token to request', config.url)

  // For public registration endpoint, use anon key instead of user JWT
  if (config.url?.includes('/auth/joven/registro')) {
    console.log('API Client: Using anon key for public registration endpoint')
    config.headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    return config
  }

  const { data } = await supabase.auth.getSession()
  console.log('API Client: Session data', { hasSession: !!data.session, hasToken: !!data.session?.access_token })
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`
    console.log('API Client: Token added to Authorization header')
  } else {
    console.log('API Client: No token available')
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
