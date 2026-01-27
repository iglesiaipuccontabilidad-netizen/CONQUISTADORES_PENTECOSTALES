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
  cedula: string
  fecha_nacimiento: string
  edad?: number
  celular: string
  bautizado: boolean
  sellado: boolean
  servidor: boolean
  simpatizante: boolean
  grupo_id?: string | null
  grupo?: {
    id: string
    nombre: string
    descripcion?: string
  } | null
  estado?: string
  consentimientos?: {
    datos_personales?: boolean
    whatsapp?: boolean
    procesamiento?: boolean
    terminos?: boolean
  }
  consentimiento_datos_personales?: boolean
  consentimiento_whatsapp?: boolean
  consentimiento_procesamiento?: boolean
  consentimiento_terminos?: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

// Grupo Types
export interface Grupo {
  id: string
  nombre: string
  descripcion?: string
  lider_id: string
  lider?: User
  estado: 'activo' | 'inactivo'
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
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
