-- ========================================
-- CONQUISTADORES APP - SCHEMA DE BD
-- Version: 1.0
-- Created: 2026-01-19
-- ========================================

-- ========================================
-- 1. TABLA: usuarios (vinculado a auth.users)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nombre_completo TEXT NOT NULL,
  telefono TEXT,
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('admin', 'lider', 'usuario', 'visitante')),
  ultima_sesion TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ========================================
-- 2. TABLA: grupos
-- ========================================
CREATE TABLE IF NOT EXISTS grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  lider_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT unique_grupo_name_per_lider UNIQUE (nombre, lider_id)
);

-- ========================================
-- 3. TABLA: jovenes (registro de jóvenes)
-- ========================================
CREATE TABLE IF NOT EXISTS jovenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  edad INT GENERATED ALWAYS AS (
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::INT
  ) STORED,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  celular VARCHAR(20) NOT NULL,
  grupo_id UUID NOT NULL REFERENCES grupos(id) ON DELETE RESTRICT,
  -- Estados espirituales (booleanos)
  bautizado BOOLEAN DEFAULT FALSE,
  sellado BOOLEAN DEFAULT FALSE,
  servidor BOOLEAN DEFAULT FALSE,
  simpatizante BOOLEAN DEFAULT FALSE,
  -- Consentimientos
  consentimiento_datos_personales BOOLEAN DEFAULT FALSE,
  consentimiento_whatsapp BOOLEAN DEFAULT FALSE,
  consentimiento_procesamiento BOOLEAN DEFAULT FALSE,
  consentimiento_terminos BOOLEAN DEFAULT FALSE,
  -- Estado general
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  -- Auditoría
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- 4. TABLA: mensajes_cumpleanos
-- ========================================
CREATE TABLE IF NOT EXISTS mensajes_cumpleanos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  joven_id UUID NOT NULL REFERENCES jovenes(id) ON DELETE CASCADE,
  mensaje_enviado TEXT,
  fecha_envio TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'fallido', 'cancelado')),
  enviado_por UUID REFERENCES users(id) ON DELETE SET NULL,
  numero_destino VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 5. TABLA: plantillas_mensajes
-- ========================================
CREATE TABLE IF NOT EXISTS plantillas_mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('cumpleanos', 'bienvenida', 'evento', 'otro')),
  rango_edad_min INT,
  rango_edad_max INT,
  contenido TEXT NOT NULL,
  es_default BOOLEAN DEFAULT FALSE,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- 6. TABLA: versiculos (versículos de la Biblia)
-- ========================================
CREATE TABLE IF NOT EXISTS versiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  texto TEXT NOT NULL,
  cita VARCHAR(100) NOT NULL UNIQUE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- 7. TABLA: actividad_usuarios (auditoría)
-- ========================================
CREATE TABLE IF NOT EXISTS actividad_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accion VARCHAR(50) NOT NULL CHECK (accion IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ERROR')),
  tabla_afectada VARCHAR(100),
  registro_id UUID,
  detalles JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 8. TABLA: configuracion_sistema
-- ========================================
CREATE TABLE IF NOT EXISTS configuracion_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- 9. TABLA: historial_eliminaciones (auditoría de deletes)
-- ========================================
CREATE TABLE IF NOT EXISTS historial_eliminaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla VARCHAR(100) NOT NULL,
  registro_id UUID NOT NULL,
  datos_eliminados JSONB NOT NULL,
  eliminado_por UUID REFERENCES users(id) ON DELETE SET NULL,
  motivo TEXT,
  fecha_eliminacion TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 10. TABLA: notificaciones
-- ========================================
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'info' CHECK (tipo IN ('info', 'warning', 'error', 'success')),
  leida BOOLEAN DEFAULT FALSE,
  referencia_id UUID,
  referencia_tabla VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================

-- Índices en usuarios
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);
CREATE INDEX IF NOT EXISTS idx_users_estado ON users(estado);

-- Índices en grupos
CREATE INDEX IF NOT EXISTS idx_grupos_lider_id ON grupos(lider_id);
CREATE INDEX IF NOT EXISTS idx_grupos_estado ON grupos(estado);

-- Índices en jovenes (CRÍTICOS)
CREATE UNIQUE INDEX IF NOT EXISTS idx_jovenes_cedula ON jovenes(cedula);
CREATE INDEX IF NOT EXISTS idx_jovenes_grupo_id ON jovenes(grupo_id);
CREATE INDEX IF NOT EXISTS idx_jovenes_fecha_nacimiento ON jovenes(fecha_nacimiento);
CREATE INDEX IF NOT EXISTS idx_jovenes_edad ON jovenes(edad);
CREATE INDEX IF NOT EXISTS idx_jovenes_created_at ON jovenes(created_at);
CREATE INDEX IF NOT EXISTS idx_jovenes_estado ON jovenes(estado);

-- Índices en mensajes_cumpleanos
CREATE INDEX IF NOT EXISTS idx_mensajes_cumpleanos_joven_id ON mensajes_cumpleanos(joven_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_cumpleanos_estado ON mensajes_cumpleanos(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_cumpleanos_fecha_envio ON mensajes_cumpleanos(fecha_envio);

-- Índices en plantillas_mensajes
CREATE INDEX IF NOT EXISTS idx_plantillas_mensajes_tipo ON plantillas_mensajes(tipo);
CREATE INDEX IF NOT EXISTS idx_plantillas_mensajes_activa ON plantillas_mensajes(activa);

-- Índices en actividad_usuarios
CREATE INDEX IF NOT EXISTS idx_actividad_usuarios_usuario_id ON actividad_usuarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_actividad_usuarios_accion ON actividad_usuarios(accion);
CREATE INDEX IF NOT EXISTS idx_actividad_usuarios_created_at ON actividad_usuarios(created_at);
CREATE INDEX IF NOT EXISTS idx_actividad_usuarios_tabla ON actividad_usuarios(tabla_afectada);

-- Índices en historial_eliminaciones
CREATE INDEX IF NOT EXISTS idx_historial_eliminaciones_tabla ON historial_eliminaciones(tabla);
CREATE INDEX IF NOT EXISTS idx_historial_eliminaciones_fecha ON historial_eliminaciones(fecha_eliminacion);

-- Índices en notificaciones
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX IF NOT EXISTS idx_notificaciones_created_at ON notificaciones(created_at);

-- ========================================
-- TRIGGERS PARA TIMESTAMPS AUTOMÁTICOS
-- ========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers en todas las tablas
CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_grupos_updated_at BEFORE UPDATE ON grupos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_jovenes_updated_at BEFORE UPDATE ON jovenes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_mensajes_cumpleanos_updated_at BEFORE UPDATE ON mensajes_cumpleanos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_plantillas_mensajes_updated_at BEFORE UPDATE ON plantillas_mensajes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_versiculos_updated_at BEFORE UPDATE ON versiculos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_configuracion_sistema_updated_at BEFORE UPDATE ON configuracion_sistema
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notificaciones_updated_at BEFORE UPDATE ON notificaciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
