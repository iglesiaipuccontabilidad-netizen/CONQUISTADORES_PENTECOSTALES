export interface Joven {
  id: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  edad?: number;
  cedula: string;
  celular: string;
  bautizado: boolean;
  sellado: boolean;
  servidor: boolean;
  simpatizante: boolean;
  consentimiento_datos_personales: boolean;
  estado: 'activo' | 'inactivo' | 'suspendido';
  grupo_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface Grupo {
  id: string;
  nombre: string;
  descripcion?: string;
  lider_id: string;
  lider?: User;
  estado: 'activo' | 'inactivo';
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface User {
  id: string;
  email: string;
  nombre_completo: string;
  telefono?: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  rol: 'admin' | 'lider' | 'usuario' | 'visitante';
  ultima_sesion?: string;
  created_at: string;
  updated_at: string;
}

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