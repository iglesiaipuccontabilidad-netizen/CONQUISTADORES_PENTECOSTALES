/**
 * Global Types for Conquistadores App
 */

// User Types
export interface User {
  id: string
  nombre_completo: string
  email: string
  telefono: string
  estado: 'activo' | 'inactivo'
  ultima_sesion: string | null
  created_at: string
  updated_at: string
}

// Joven Types
export interface Joven {
  id: string
  nombre_completo: string
  fecha_nacimiento: string
  edad?: number
  cedula: string
  celular: string
  bautizado: boolean
  sellado: boolean
  servidor: boolean
  simpatizante: boolean
  grupo_id?: string | null
  estado?: string
  consentimientos?: {
    datos_personales?: boolean
    whatsapp?: boolean
    procesamiento?: boolean
    terminos?: boolean
  }
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

// Grupo Types
export interface Grupo {
  id: string
  nombre: string
  descripcion: string
  lider_id: string
  lider?: {
    nombre_completo: string
  }
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form Types
export interface RegistroJovenFormData {
  nombre: string
  fecha_nacimiento: string
  edad: number
  cedula: string
  celular: string
  estados: string[]
  consentimientos: {
    datos_personales: boolean
    whatsapp: boolean
    procesamiento: boolean
    terminos: boolean
  }
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}
