-- ========================================
-- CONQUISTADORES APP - FUNCIONES DE LOGGING
-- Ejecutar en Supabase SQL Editor
-- ========================================

-- Crear tabla de logs si no existe
CREATE TABLE IF NOT EXISTS logs_actividad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accion VARCHAR(50) NOT NULL,
  tabla_afectada VARCHAR(100) NOT NULL,
  registro_id UUID,
  detalles JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Función para log de actividad general
CREATE OR REPLACE FUNCTION log_activity(
  p_usuario_id UUID,
  p_accion VARCHAR(50),
  p_tabla_afectada VARCHAR(100),
  p_registro_id UUID DEFAULT NULL,
  p_detalles JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO logs_actividad (
    usuario_id,
    accion,
    tabla_afectada,
    registro_id,
    detalles
  ) VALUES (
    p_usuario_id,
    p_accion,
    p_tabla_afectada,
    p_registro_id,
    p_detalles
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para log de eliminaciones
CREATE OR REPLACE FUNCTION log_deletion(
  p_usuario_id UUID,
  p_tabla_afectada VARCHAR(100),
  p_registro_id UUID,
  p_detalles JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO logs_actividad (
    usuario_id,
    accion,
    tabla_afectada,
    registro_id,
    detalles
  ) VALUES (
    p_usuario_id,
    'DELETE',
    p_tabla_afectada,
    p_registro_id,
    p_detalles
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS en la tabla de logs
ALTER TABLE logs_actividad ENABLE ROW LEVEL SECURITY;

-- Política para que solo admins puedan ver logs
CREATE POLICY "Only admins can view activity logs" ON logs_actividad
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_logs_actividad_usuario ON logs_actividad(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_actividad_tabla ON logs_actividad(tabla_afectada);
CREATE INDEX IF NOT EXISTS idx_logs_actividad_created_at ON logs_actividad(created_at);