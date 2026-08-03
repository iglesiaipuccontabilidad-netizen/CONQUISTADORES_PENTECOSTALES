import axios, { AxiosInstance, AxiosError } from 'axios'

interface ApiErrorResponse {
  success: false
  error: string
  message?: string
}

// Store for the current token (will be set by useAuthInterceptor)
let currentToken: string | null = null

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  console.log('API Client: Adding token to request', config.url)

  // For public registration endpoint, use anon key instead of user JWT
  if (config.url?.includes('/joven/registro')) {
    console.log('API Client: Using anon key for public registration endpoint')
    config.headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    return config
  }

  // Use the token that was set by useAuthInterceptor hook
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`
    console.log('API Client: Token added to Authorization header')
  } else {
    console.log('API Client: No token available')
  }
  return config
})

// Export function to set the token from useAuth hook
export const setApiToken = (token: string | null) => {
  currentToken = token
}

// Handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response [${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;

    console.error(`❌ API Error [${status}] ${method} ${url}:`, {
      status,
      data: error.response?.data,
      message: error.message,
      token: currentToken ? '✓ Token present' : '✗ No token'
    });

    if (status === 401) {
      // Clear the token on 401
      setApiToken(null)
      localStorage.removeItem('auth_token')
      console.log('🔑 Unauthorized - token cleared');

      // Redirect to login if we're not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?redirected=true'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
