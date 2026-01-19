# 📊 DOCUMENTACIÓN DE SCHEMA - BASE DE DATOS CONQUISTADORES APP

## 🎯 Resumen Ejecutivo
- **Tablas**: 10 tablas principales
- **RLS**: ✅ Habilitado en todas las tablas
- **Índices**: 30+ índices para optimización
- **Estado**: ✅ LISTA PARA PRODUCCIÓN

---

## 📋 ESQUEMA DE TABLAS

### 1. **users** - Usuarios del Sistema
```
PK: id (UUID) → auth.users.id
- email (TEXT, UNIQUE)
- nombre_completo (TEXT)
- telefono (TEXT, nullable)
- estado (VARCHAR): activo | inactivo | suspendido
- rol (VARCHAR): admin | lider | usuario | visitante
- ultima_sesion (TIMESTAMP)
- created_at, updated_at, updated_by
```
**RLS**: ✅ Habilitado
- Usuarios ven solo sus datos
- Admins ven todos
- Auditoría activa

---

### 2. **grupos** - Grupos de Jóvenes
```
PK: id (UUID)
FK: lider_id → users.id
FK: created_by → users.id
FK: updated_by → users.id
- nombre (VARCHAR, UNIQUE per lider)
- descripcion (TEXT)
- estado (VARCHAR): activo | inactivo
- created_at, updated_at
```
**RLS**: ✅ Habilitado
- Líderes ven solo sus grupos
- Admins ven todos

---

### 3. **jovenes** - Registro de Jóvenes ⭐
```
PK: id (UUID)
FK: grupo_id → grupos.id (RESTRICT)
- nombre_completo (VARCHAR)
- fecha_nacimiento (DATE)
- edad (INT, GENERATED - auto-calculated)
- cedula (VARCHAR, UNIQUE) ⭐ CRITICAL
- celular (VARCHAR) → formato +57XXXXXXXXXX
- Bautizado | Sellado | Servidor | Simpatizante (BOOLEAN)
- Consentimientos x4 (BOOLEAN)
- estado (VARCHAR): activo | inactivo | suspendido
- created_at, updated_at, created_by, updated_by
```
**Índices**: 
- `idx_jovenes_cedula` (UNIQUE)
- `idx_jovenes_grupo_id` (FK performance)
- `idx_jovenes_fecha_nacimiento` (búsqueda)
- `idx_jovenes_edad` (búsqueda)
- `idx_jovenes_created_at` (auditoría)

**RLS**: ✅ Habilitado
- Líderes ven jóvenes de su grupo
- Admins ven todos

---

### 4. **mensajes_cumpleanos** - Historial de Mensajes
```
PK: id (UUID)
FK: joven_id → jovenes.id (CASCADE)
FK: enviado_por → users.id
- mensaje_enviado (TEXT)
- fecha_envio (TIMESTAMP)
- estado (VARCHAR): pendiente | enviado | fallido | cancelado
- numero_destino (VARCHAR)
- created_at, updated_at
```
**RLS**: ✅ Habilitado
- Líderes ven mensajes de su grupo
- Admins ven todos

---

### 5. **plantillas_mensajes** - Plantillas de Mensajes
```
PK: id (UUID)
FK: created_by → users.id
FK: updated_by → users.id
- nombre (VARCHAR)
- tipo (VARCHAR): cumpleanos | bienvenida | evento | otro
- rango_edad_min | rango_edad_max (INT)
- contenido (TEXT)
- es_default (BOOLEAN)
- activa (BOOLEAN)
- created_at, updated_at
```
**RLS**: ✅ Habilitado
- Todos ven plantillas activas
- Solo admins crean/modifican

---

### 6. **versiculos** - Versículos de la Biblia
```
PK: id (UUID)
FK: created_by → users.id
- texto (TEXT)
- cita (VARCHAR, UNIQUE)
- activo (BOOLEAN)
- created_at, updated_at
```
**RLS**: ✅ Habilitado
- Todos ven versículos activos
- Solo admins crean/modifican

---

### 7. **actividad_usuarios** - Auditoría de Actividades
```
PK: id (UUID)
FK: usuario_id → users.id (CASCADE)
- accion (VARCHAR): CREATE | READ | UPDATE | DELETE | LOGIN | LOGOUT | ERROR
- tabla_afectada (VARCHAR)
- registro_id (UUID)
- detalles (JSONB)
- ip_address (INET)
- user_agent (TEXT)
- created_at (TIMESTAMP, auto-indexed)
```
**RLS**: ✅ Habilitado
- Usuarios ven su propia actividad
- Solo admins ven todas

---

### 8. **configuracion_sistema** - Configuración Global
```
PK: id (UUID)
FK: updated_by → auth.users.id
- clave (VARCHAR, UNIQUE)
- valor (JSONB)
- descripcion (TEXT)
- updated_at
```
**RLS**: ✅ Habilitado
- Solo admins acceden

---

### 9. **historial_eliminaciones** - Auditoría de Deletes
```
PK: id (UUID)
FK: eliminado_por → users.id
- tabla (VARCHAR)
- registro_id (UUID)
- datos_eliminados (JSONB)
- motivo (TEXT)
- fecha_eliminacion (TIMESTAMP)
```
**RLS**: ✅ Habilitado
- Solo admins ven

---

### 10. **notificaciones** - Notificaciones de Usuarios
```
PK: id (UUID)
FK: usuario_id → users.id (CASCADE)
- titulo (VARCHAR)
- contenido (TEXT)
- tipo (VARCHAR): info | warning | error | success
- leida (BOOLEAN)
- referencia_id (UUID)
- referencia_tabla (VARCHAR)
- created_at, updated_at
```
**RLS**: ✅ Habilitado
- Usuarios ven solo sus notificaciones

---

## 🔐 ROW LEVEL SECURITY (RLS)

### Estado General
✅ **RLS HABILITADO EN TODAS LAS TABLAS**

### Políticas por Rol
| Tabla | Admin | Lider | Usuario | Visitante |
|-------|-------|-------|---------|-----------|
| users | All | Own | Own | - |
| grupos | All | Own grupo | View | - |
| jovenes | All | Own grupo | Own grupo | - |
| mensajes_cumpleanos | All | Own grupo | Own grupo | - |
| plantillas_mensajes | CRUD | Read | Read | - |
| versiculos | CRUD | Read | Read | Read |
| actividad_usuarios | All | Own | Own | - |
| configuracion_sistema | All | - | - | - |
| historial_eliminaciones | Read | - | - | - |
| notificaciones | - | All own | Own | - |

---

## 📈 ÍNDICES (30+ total)

### Críticos
- `idx_jovenes_cedula` (UNIQUE) - Búsqueda rápida por cédula
- `idx_jovenes_grupo_id` (FK) - Listar jóvenes por grupo
- `idx_users_email` (UNIQUE) - Búsqueda por email
- `idx_grupos_lider_id` (FK) - Listar grupos por líder

### Auditoría
- `idx_actividad_usuarios_usuario_id` - Auditoría por usuario
- `idx_actividad_usuarios_created_at` - Timeline de actividades
- `idx_historial_eliminaciones_fecha` - Timeline de deletes

### Notificaciones
- `idx_notificaciones_usuario_id` - Notificaciones por usuario
- `idx_notificaciones_leida` - Filtro leídas/no leídas

---

## 🔗 RELACIONES Y CONSTRAINTS

### Foreign Keys
```
users.id ← auth.users.id (CASCADE)
grupos.lider_id → users.id
grupos.created_by → users.id
jovenes.grupo_id → grupos.id (RESTRICT)
mensajes_cumpleanos.joven_id → jovenes.id (CASCADE)
```

### Unique Constraints
- `users.email` - Emails únicos
- `jovenes.cedula` - Cédulas únicas
- `grupos.nombre + lider_id` - Nombres únicos por líder
- `plantillas_mensajes.cita` - Citas únicas
- `configuracion_sistema.clave` - Claves únicas

---

## ⏰ TRIGGERS Y AUTO-UPDATE

### Timestamp Automático
```sql
- Función: update_updated_at_column()
- Aplicado a: users, grupos, jovenes, mensajes_cumpleanos,
  plantillas_mensajes, versiculos, configuracion_sistema, notificaciones
- Actualiza: updated_at al hacer UPDATE
```

### Edad Auto-Calculada
```sql
- Tabla: jovenes
- Campo: edad (INT, GENERATED ALWAYS)
- Fórmula: EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))
```

---

## 🔑 CONFIGURACIÓN SUPABASE

### Proyecto
- **Project ID**: `dcgkzuouqeznxtfzgdil`
- **URL**: `https://dcgkzuouqeznxtfzgdil.supabase.co`
- **Región**: South America - São Paulo
- **Status**: ✅ Production Ready

### Credenciales
```env
NEXT_PUBLIC_SUPABASE_URL=https://dcgkzuouqeznxtfzgdil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_0ZTkUYB7QzwmIdd59FRLog_gFL0pX-1
```

---

## ✅ VERIFICACIÓN

### Checklist Completado
- [x] 10 tablas creadas
- [x] Columnas y tipos correctos
- [x] Foreign keys configuradas
- [x] Unique constraints aplicados
- [x] RLS habilitado en todas
- [x] Políticas de seguridad definidas
- [x] 30+ índices creados
- [x] Triggers de timestamp funcionando
- [x] Edad auto-calculada
- [x] Auditoría lista

### Próximos Pasos (Fase 2)
1. Crear API endpoints en Supabase
2. Configurar Email Authentication
3. Crear formularios frontend
4. Implementar lógica de negocio

---

**Generado**: 2026-01-19
**Version**: 1.0
**Status**: ✅ FASE 1 COMPLETADA
