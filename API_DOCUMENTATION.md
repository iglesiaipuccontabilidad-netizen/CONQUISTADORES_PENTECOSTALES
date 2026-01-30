# 📚 DOCUMENTACIÓN DE API - FASE 2 BACKEND

## 🔐 Base URL
```
https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth
```

## ✅ Endpoints Implementados

### 1. **POST /auth/login** - Login Usuario
**Descripción**: Autenticación con email y contraseña

**Request**:
```bash
curl -X POST https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@conquistadores.com",
    "password": "Admin123"
  }'
```

**Body**:
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "user": {
    "id": "uuid",
    "email": "admin@conquistadores.com",
    "user_metadata": {}
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

**Errors**:
- `400`: Email inválido
- `400`: Contraseña requerida
- `401`: Credenciales inválidas

---

### 2. **POST /auth/recuperar** - Recuperar Contraseña
**Descripción**: Envía email de recuperación de contraseña

**Request**:
```bash
curl -X POST https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth/recuperar \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com"}'
```

**Body**:
```json
{
  "email": "string (required, valid email)"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "message": "Email de recuperación enviado"
}
```

**Errors**:
- `400`: Email inválido
- `500`: Error procesando solicitud

---

### 3. **GET /auth/me** - Datos Usuario Autenticado
**Descripción**: Obtiene datos del usuario loggeado

**Request**:
```bash
curl -X GET https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth/me \
  -H "Authorization: Bearer {access_token}"
```

**Headers**:
```
Authorization: Bearer {jwt_token} (required)
```

**Response (200)**:
```json
{
  "status": "success",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "nombre_completo": "Juan Pérez",
    "telefono": "3001234567",
    "rol": "admin",
    "estado": "activo",
    "ultima_sesion": "2026-01-19T10:30:00Z",
    "created_at": "2026-01-19T08:00:00Z"
  }
}
```

**Errors**:
- `401`: Token requerido
- `401`: Token inválido
- `404`: Usuario no encontrado

---

### 4. **POST /api/joven/registro** - Registrar Nuevo Joven 🎯
**Descripción**: Formulario público de registro de jóvenes

**Request**:
```bash
curl -X POST https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth/joven/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Maria García López",
    "fecha_nacimiento": "2010-05-15",
    "celular": "+573001234567",
    "grupo_id": "uuid-or-null",
    "bautizado": false,
    "sellado": true,
    "servidor": false,
    "simpatizante": true,
    "consentimiento_datos_personales": true
  }'
```

**Body**:
```json
{
  "nombre_completo": "string (required, min 3 chars)",
  "fecha_nacimiento": "date (required, ISO 8601)",
  "celular": "string (required, format: 10 dígitos)",
  "grupo_id": "uuid (optional, auto-assign if not provided)",
  "bautizado": "boolean (optional, default: false)",
  "sellado": "boolean (optional, default: false)",
  "servidor": "boolean (optional, default: false)",
  "simpatizante": "boolean (optional, default: false)",
  "consentimiento_datos_personales": "boolean (required)"
}
```

**Response (201)**:
```json
{
  "status": "success",
  "message": "Joven registrado exitosamente",
  "joven": {
    "id": "uuid",
    "nombre_completo": "Maria García López",
    "fecha_nacimiento": "2010-05-15",
    "edad": 15,
    "cedula": "12345678",
    "celular": "+573001234567",
    "grupo_id": "uuid",
    "bautizado": false,
    "sellado": true,
    "servidor": false,
    "simpatizante": true,
    "consentimiento_datos_personales": true,
    "estado": "activo",
    "created_at": "2026-01-19T10:30:00Z",
    "updated_at": "2026-01-19T10:30:00Z"
  }
}
```

**Errors**:
- `400`: Nombre inválido (< 3 caracteres)
- `400`: Celular inválido (debe ser 10 dígitos)
- `400`: Edad fuera de rango (debe estar entre 12-35 años)
- `400`: Consentimientos incompletos (todos requeridos)
- `500`: Error al registrar joven

---

## 🔐 Autenticación

### Headers Requeridos
```
Content-Type: application/json
Authorization: Bearer {access_token}  # Solo para endpoints protegidos
```

### Token JWT
El token de `login` tiene formato:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Duración**: 3600 segundos (1 hora)  
**Refresh**: Usar `refresh_token` para obtener nuevo `access_token`

---

## ✅ Validaciones Backend

### Email
- Formato válido: `usuario@dominio.com`
- Unique en tabla `users`

### Contraseña
- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 número

### Cédula
- 8-10 dígitos numéricos
- UNIQUE en tabla `jovenes`
- Ejemplo: `12345678`

### Celular
- Formato: `10 dígitos`
- Ejemplo: `3001234567`

### Edad
- Mínimo: 12 años
- Máximo: 35 años
- Se calcula automáticamente desde `fecha_nacimiento`

### Consentimientos
- Todos 4 deben estar marcados como `true`
  - Consentimiento datos personales
  - Consentimiento WhatsApp
  - Consentimiento procesamiento
  - Consentimiento términos

---

## 📊 Auditoría

### Acciones Registradas
Todas las acciones se registran en tabla `actividad_usuarios`:

| Acción | Tabla Afectada | Evento |
|--------|----------------|--------|
| LOGIN | users | Usuario inicia sesión |
| LOGOUT | users | Usuario cierra sesión |
| CREATE | jovenes | Nuevo joven registrado |
| UPDATE | jovenes | Joven actualizado |
| DELETE | jovenes | Joven eliminado |

### Datos Capturados
- `usuario_id`: ID del usuario que realiza acción
- `accion`: LOGIN, LOGOUT, CREATE, UPDATE, DELETE
- `tabla_afectada`: Nombre de tabla
- `registro_id`: ID del registro afectado
- `detalles`: JSON con información adicional
- `ip_address`: IP del cliente (cuando disponible)
- `user_agent`: Browser/cliente (cuando disponible)
- `created_at`: Timestamp de acción

---

## 🛡️ Seguridad

### CORS
- Habilitado para todos los orígenes (`*`)
- Métodos: GET, POST, OPTIONS

### Rate Limiting
- Implementar en frontend: máx 5 intentos de login fallidos
- Implementar en servidor: 10 intentos por IP por hora

### SQL Injection Protection
- Todas las queries usan prepared statements
- Parámetros sanitizados

### HTTPS
- Obligatorio en producción
- Supabase maneja SSL/TLS

---

## 🧪 Ejemplos de Cliente

### JavaScript/TypeScript
```javascript
// Login
const { data, error } = await fetch(
  'https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@conquistadores.com',
      password: 'Admin123'
    })
  }
).then(r => r.json())

// Registrar Joven
const registroResponse = await fetch(
  'https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth/joven/registro',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre_completo: 'Maria García',
      fecha_nacimiento: '2010-05-15',
      cedula: '12345678',
      celular: '3001234567',
      consentimiento_datos_personales: true,
      consentimiento_whatsapp: true,
      consentimiento_procesamiento: true,
      consentimiento_terminos: true
    })
  }
).then(r => r.json())
```

---

## ⚠️ Códigos de Error

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | CREATED - Recurso creado |
| 400 | BAD REQUEST - Datos inválidos |
| 401 | UNAUTHORIZED - Autenticación requerida |
| 409 | CONFLICT - Cédula ya existe |
| 500 | SERVER ERROR - Error interno |

---

## 📋 Próximos Endpoints (Fase 3)

- `GET /api/jovenes` - Listar jóvenes
- `GET /api/jovenes/:id` - Ver detalle
- `POST /api/jovenes` - Crear joven (admin)
- `PUT /api/jovenes/:id` - Editar joven
- `DELETE /api/jovenes/:id` - Eliminar joven
- `GET /api/grupos` - Listar grupos
- `POST /api/grupos` - Crear grupo
- `GET /api/dashboard/metrics` - Métricas

---

**Última actualización**: 2026-01-19  
**Versión API**: 1.0  
**Estado**: ✅ FASE 2 BACKEND COMPLETADA
