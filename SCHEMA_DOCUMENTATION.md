# 📊 ESQUEMA DE BASE DE DATOS - CONQUISTADORES APP

## Información General
- **URL**: https://dcgkzuouqeznxtfzgdil.supabase.co
- **Región**: São Paulo (sa-east-1)
- **Base de Datos**: PostgreSQL
- **Estado**: ✅ Activo y Funcionando

---

## 🔑 Credenciales Frontend

### Variables de Entorno (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://dcgkzuouqeznxtfzgdil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ2t6dW91cWV6bnh0ZnpnZGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDg3ODcsImV4cCI6MjA4NDQyNDc4N30.ZFKcXa54jCIv5OTMdwBbsVQSqy6KwWlWbaIEHPt041M
```

### Clave Publishable Alternativa (Recomendada)
```
sb_publishable_f3nCvMumw7ZPVX_U3Xri0g_5lnmv666
```

---

## 📋 TABLAS CREADAS (10 total)

### 1. **users** - Usuarios del Sistema
- **PK**: `id` (UUID, vinculado a auth.users)
- **Columnas**: email, nombre_completo, telefono, estado, rol, ultima_sesion, created_at, updated_at
- **Índices**: idx_users_email (UNIQUE), idx_users_rol, idx_users_estado
- **RLS**: ✅ Habilitado
- **Roles**: admin, lider, usuario, visitante

### 2. **grupos** - Grupos de Jóvenes
- **PK**: `id` (UUID)
- **Columnas**: nombre, descripcion, lider_id (FK users), estado, created_at, updated_at, created_by, updated_by
- **Índices**: idx_grupos_lider_id, idx_grupos_estado
- **Constraint**: UNIQUE (nombre, lider_id)
- **RLS**: ✅ Habilitado

### 3. **jovenes** - Registro de Jóvenes
- **PK**: `id` (UUID)
- **Columnas**:
  - Personales: nombre_completo, fecha_nacimiento, edad, cedula, celular
  - Espirituales: bautizado, sellado, servidor, simpatizante
  - Consentimientos: consentimiento_datos_personales, consentimiento_whatsapp, consentimiento_procesamiento, consentimiento_terminos
  - Auditoría: estado, created_at, updated_at, created_by, updated_by
  - FK: grupo_id
- **Índices**: 
  - `idx_jovenes_cedula` (UNIQUE)
  - `idx_jovenes_grupo_id`
  - `idx_jovenes_fecha_nacimiento`
  - `idx_jovenes_edad`
  - `idx_jovenes_created_at`
  - `idx_jovenes_estado`
- **Constraints**: UNIQUE (cedula)
- **RLS**: ✅ Habilitado

### 4. **mensajes_cumpleanos** - Mensajes de Cumpleaños
- **PK**: `id` (UUID)
- **Columnas**: joven_id (FK), mensaje_enviado, fecha_envio, estado, enviado_por (FK users), numero_destino, created_at, updated_at
- **Estados**: pendiente, enviado, fallido, cancelado
- **Índices**: idx_mensajes_cumpleanos_joven_id, idx_mensajes_cumpleanos_estado, idx_mensajes_cumpleanos_fecha_envio
- **RLS**: ✅ Habilitado

### 5. **plantillas_mensajes** - Plantillas de Mensajes
- **PK**: `id` (UUID)
- **Columnas**: nombre, tipo, rango_edad_min, rango_edad_max, contenido, es_default, activa, created_at, updated_at, created_by, updated_by
- **Tipos**: cumpleanos, bienvenida, evento, otro
- **Índices**: idx_plantillas_mensajes_tipo, idx_plantillas_mensajes_activa
- **RLS**: ✅ Habilitado

### 6. **versiculos** - Versículos Bíblicos
- **PK**: `id` (UUID)
- **Columnas**: texto, cita, activo, created_at, updated_at, created_by (FK users)
- **Índices**: idx_versiculos_cita (via cita UNIQUE)
- **Constraints**: UNIQUE (cita)
- **RLS**: ✅ Habilitado

### 7. **actividad_usuarios** - Auditoría de Acciones
- **PK**: `id` (UUID)
- **Columnas**: usuario_id (FK), accion, tabla_afectada, registro_id, detalles (JSONB), ip_address, user_agent, created_at
- **Acciones**: CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, ERROR
- **Índices**: idx_actividad_usuarios_usuario_id, idx_actividad_usuarios_accion, idx_actividad_usuarios_created_at, idx_actividad_usuarios_tabla
- **RLS**: ✅ Habilitado

### 8. **configuracion_sistema** - Configuración Global
- **PK**: `id` (UUID)
- **Columnas**: clave, valor (JSONB), descripcion, updated_at, updated_by (FK auth.users)
- **Constraints**: UNIQUE (clave)
- **RLS**: ✅ Habilitado

### 9. **historial_eliminaciones** - Auditoría de Deletes
- **PK**: `id` (UUID)
- **Columnas**: tabla, registro_id, datos_eliminados (JSONB), eliminado_por (FK users), motivo, fecha_eliminacion
- **Índices**: idx_historial_eliminaciones_tabla, idx_historial_eliminaciones_fecha
- **RLS**: ✅ Habilitado

### 10. **notificaciones** - Notificaciones del Sistema
- **PK**: `id` (UUID)
- **Columnas**: usuario_id (FK), titulo, contenido, tipo, leida, referencia_id, referencia_tabla, created_at, updated_at
- **Tipos**: info, warning, error, success
- **Índices**: idx_notificaciones_usuario_id, idx_notificaciones_leida, idx_notificaciones_created_at
- **RLS**: ✅ Habilitado

---

## ⚙️ CARACTERÍSTICAS IMPLEMENTADAS

### ✅ Row Level Security (RLS)
- Todas las 10 tablas con RLS habilitado
- Políticas por rol: admin, lider, usuario, visitante
- Validación mediante `auth.uid()` y `auth.role()`
- Acceso granular a datos

### ✅ Índices (24 índices creados)
- UNIQUE: cedula, email, cita
- FK: grupo_id, lider_id, created_by, updated_by
- Búsqueda: estado, tipo, accion, leida, activa, rol

### ✅ Triggers Automáticos
- Función: `update_updated_at_column()`
- 8 triggers para actualizar automáticamente `updated_at`
- Aplicado en: users, grupos, jovenes, mensajes_cumpleanos, plantillas_mensajes, versiculos, configuracion_sistema, notificaciones

### ✅ Constraints
- PRIMARY KEY (UUID)
- FOREIGN KEY con CASCADE/RESTRICT
- UNIQUE constraints
- CHECK constraints para valores válidos

### ✅ Tipos de Datos
- UUID para IDs (gen_random_uuid)
- JSONB para datos complejos (detalles, datos_eliminados, valor)
- INET para IP addresses
- DATE para fechas
- BOOLEAN para estados binarios
- VARCHAR con límites según contexto

---

## 🔐 SEGURIDAD

### Row Level Security (RLS) Policies
Por tabla:

**users**:
- Admins ven todos
- Usuarios ven solo sus datos
- Service role puede insertar

**grupos**:
- Autenticados ven grupos activos
- Lider ve su grupo
- Admins gerent todo

**jovenes**:
- Admins y lideres ven todos
- Usuarios ven jóvenes de su grupo
- Lideres pueden crear en sus grupos

**mensajes_cumpleanos**:
- Admins ven todos
- Lideres ven mensajes de su grupo
- Service role registra actividad

**plantillas_mensajes**:
- Autenticados ven plantillas activas
- Solo admins pueden crear/editar

**versiculos**:
- Autenticados ven activos
- Solo admins pueden crear/editar

**actividad_usuarios**:
- Usuarios ven su actividad
- Admins ven todo
- Service role registra

**configuracion_sistema**:
- Solo admins

**historial_eliminaciones**:
- Solo admins

**notificaciones**:
- Usuarios ven sus notificaciones
- Admins ven todas
- Service role crea

---

## 📊 MIGRACIONES APLICADAS (14 total)

1. `001_crear_esquema_completo` - 10 tablas + estructuras
2. `002_crear_indices` - 24 índices
3. `003_crear_triggers_timestamps` - Triggers para updated_at
4. `004_habilitar_rls` - Habilitar RLS en todas las tablas
5. `005_rls_policies_users` - Políticas para users
6. `006_rls_policies_grupos` - Políticas para grupos
7. `007_rls_policies_jovenes` - Políticas para jovenes
8. `008_rls_policies_mensajes_cumpleanos` - Políticas para mensajes
9. `009_rls_policies_plantillas_mensajes` - Políticas para plantillas
10. `010_rls_policies_versiculos` - Políticas para versículos
11. `011_rls_policies_actividad_usuarios` - Políticas para auditoría
12. `012_rls_policies_configuracion_sistema` - Políticas para config
13. `013_rls_policies_historial_eliminaciones` - Políticas para historial
14. `014_rls_policies_notificaciones` - Políticas para notificaciones

---

## ⚠️ NOTAS Y RECOMENDACIONES

### Advisors/Lints (Informativos)
1. **Performance Warning**: Multiple permissive policies por tabla (esperado por diseño)
2. **Performance Info**: Unindexed foreign keys en `created_by`, `updated_by` (opcional para optimización futura)
3. **Performance Info**: Unused indexes (normales en fase inicial, se usarán en producción)
4. **Security Warning**: Function search_path mutable en `update_updated_at_column()`
5. **Duplicate indexes**: `idx_jovenes_cedula` vs `jovenes_cedula_key` (mantener ambas para compatibilidad)

### Próximos Pasos
1. Configurar Email/Password Auth en Supabase Console
2. Crear usuario admin de prueba
3. Implementar Edge Functions para lógica backend
4. Configurar triggers para auditoría automática
5. Setup de storage para archivos
6. Configuración de webhooks

### Autenticación JWT
- Tokens con expiración (configurar según necesidad)
- Claims personalizados: `rol`, `user_id`
- Refresh tokens automáticos

### Backup
- Supabase realiza backups automáticos
- Retención según plan (Free: 7 días)
- Opción de backup manual en dashboard

---

## 📞 CONEXIÓN DESDE FRONTEND

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://dcgkzuouqeznxtfzgdil.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ2t6dW91cWV6bnh0ZnpnZGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDg3ODcsImV4cCI6MjA4NDQyNDc4N30.ZFKcXa54jCIv5OTMdwBbsVQSqy6KwWlWbaIEHPt041M'
)
```

---

## ✅ CHECKLIST FASE 1

- ✅ Base de datos creada en Supabase
- ✅ 10 tablas diseñadas e implementadas
- ✅ 24 índices estratégicos creados
- ✅ RLS habilitado en TODAS las tablas
- ✅ 35+ políticas de seguridad implementadas
- ✅ Triggers para timestamps automáticos
- ✅ Auditoría de acciones implementada
- ✅ Tipos TypeScript generados
- ✅ Variables de entorno configuradas
- ✅ Documentación completa

---

**Fecha de Creación**: 2026-01-19
**Estado**: ✅ COMPLETADO
**Siguiente Fase**: FASE 2 - Autenticación y Formulario Público
