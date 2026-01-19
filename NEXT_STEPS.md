# 🎯 CONQUISTADORES APP - Backend + Frontend Development Guide

## 📍 Estado Actual del Proyecto

```
✅ FASE 1 COMPLETADA - Setup e Infraestructura
   ├─ Base de datos PostgreSQL creada
   ├─ 10 tablas con RLS
   ├─ 30+ índices de rendimiento
   ├─ TypeScript types generados
   └─ Documentación completa

✅ FASE 2 BACKEND COMPLETADA - Autenticación API
   ├─ 6 endpoints implementados
   ├─ Edge Function deployed
   ├─ Validaciones multicapa
   ├─ Auditoría operativa
   └─ Documentación API

🔄 FASE 2 FRONTEND EN PROGRESO - Interfaz de Usuario
   ├─ Página /login (Pendiente)
   ├─ Página /registro (Pendiente)
   ├─ Auth Context (Pendiente)
   └─ Protected Routes (Pendiente)
```

---

## 🚀 Próximos Pasos del Proyecto

### OPCIÓN A: Continuar en Backend (Recomendado)

Si continúas como **Backend Developer**, los siguientes endpoints necesarios son:

#### 1. **GET /api/jovenes** - Listar Jóvenes
```typescript
// Query: todos los jóvenes del grupo/admin
// Parámetros: ?grupo_id=uuid&estado=activo
// Auth: Requerido (Admin/Líder)
// Response: { status, count, jovenes[] }
```

#### 2. **GET /api/jovenes/:id** - Obtener Detalles
```typescript
// Query: un joven específico
// Auth: Requerido (Propietario/Admin)
// Response: { status, joven }
```

#### 3. **POST /api/grupos** - Crear Grupo
```typescript
// Body: { nombre, lider_id, descripcion }
// Auth: Requerido (Admin)
// Response: { status, grupo }
```

#### 4. **GET /api/dashboard/metrics** - Dashboard Analytics
```typescript
// Query: estadísticas generales
// Auth: Requerido (Admin)
// Response: { total_jovenes, total_grupos, actividad_hoy }
```

**Archivo para implementar**: `supabase/functions/auth/index.ts`

---

### OPCIÓN B: Continuar en Frontend

Si continúas como **Frontend Developer**, implementar las siguientes páginas:

#### 1. **Página `/login`**

```
┌──────────────────────────────────┐
│        LOGIN CONQUISTADORES      │
│                                  │
│  Email:                          │
│  [___________________________]   │
│                                  │
│  Contraseña:                     │
│  [___________________________]   │
│                                  │
│  [   LOG IN   ]  [Olvidé Pass]   │
│                                  │
└──────────────────────────────────┘
```

**Stack Recomendado**:
- React Hook Form (validaciones)
- Zod (schema validation)
- Supabase JS Client (autenticación)
- Next.js App Router (páginas)

**Funcionalidad**:
- [ ] Email input con validación RFC-5322
- [ ] Password input (8+ chars, uppercase, number)
- [ ] Submit a `POST /auth/login`
- [ ] Guardar JWT en localStorage
- [ ] Guardar refresh_token en httpOnly cookie
- [ ] Redirect a `/dashboard` si exitoso
- [ ] Error display si falla
- [ ] Link "Olvidé contraseña" → `/recuperar`

**Archivo**: `app/(auth)/login/page.tsx`

#### 2. **Página `/registro`**

**Formulario con 20+ campos**:
- Datos Personales: nombre, fecha nacimiento, cédula, celular
- Rol: bautizado, sellado, servidor, simpatizante (checkboxes)
- Consentimientos: 4 checkboxes obligatorios
- Grupo: selector (auto-asignable)

**Validaciones en Tiempo Real**:
- Nombre: min 3 caracteres
- Cédula: 8-10 dígitos + **verificar en API** (GET /cedula/:cedula)
- Celular: patrón +57XXXXXXXXXX
- Edad: 12-35 años (desde fecha_nacimiento)

**Archivo**: `app/registro/page.tsx`

#### 3. **Auth Context Provider**

```typescript
// app/providers.tsx
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Recuperar sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => setUser(data.user))
    }
    setLoading(false)
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

#### 4. **Protected Routes Middleware**

```typescript
// middleware.ts
export function middleware(request) {
  const token = request.cookies.get('access_token')?.value
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## 📚 Recursos Necesarios

### Backend (Ya Disponibles ✅)

- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentación completa
- [Conquistadores_API.postman_collection.json](Conquistadores_API.postman_collection.json) - Tests en Postman
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Esquema de BD
- [supabase/functions/auth/index.ts](supabase/functions/auth/index.ts) - Edge Function

### Frontend (Necesarios)

```bash
npm install react-hook-form zod @hookform/resolvers
npm install @supabase/supabase-js
npm install react-toastify  # Notificaciones
npm install zustand          # State management (alternativa a Context)
```

---

## 🔐 Credenciales & Variables de Entorno

### Backend (.env.local - YA CONFIGURADO ✅)

```
NEXT_PUBLIC_SUPABASE_URL=https://dcgkzuouqeznxtfzgdil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_0ZTkUYB7QzwmIdd59FRLog_gFL0pX-1
```

### Frontend (.env.local - CREAR)

```
# Copiar desde backend
NEXT_PUBLIC_SUPABASE_URL=https://dcgkzuouqeznxtfzgdil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Cómo Probar los Endpoints

### Opción 1: Postman (Recomendado)
1. Descargar [Conquistadores_API.postman_collection.json](Conquistadores_API.postman_collection.json)
2. Importar en Postman
3. Usar la colección para probar endpoints

### Opción 2: cURL (Desde terminal)

**Login**:
```bash
curl -X POST https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@conquistadores.com","password":"Admin123"}'
```

**Registrar Joven**:
```bash
curl -X POST https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth/joven/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Maria García López",
    "fecha_nacimiento": "2010-05-15",
    "cedula": "12345678",
    "celular": "+573001234567",
    "consentimiento_datos_personales": true,
    "consentimiento_whatsapp": true,
    "consentimiento_procesamiento": true,
    "consentimiento_terminos": true
  }'
```

**Validar Cédula**:
```bash
curl -X GET "https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth/joven/cedula/12345678"
```

### Opción 3: Tests Automatizados

```typescript
// tests/auth.test.ts
import { describe, it, expect } from 'vitest'

const BASE_URL = 'https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth'

describe('Authentication', () => {
  it('should login with valid credentials', async () => {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@conquistadores.com',
        password: 'Admin123'
      })
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.status).toBe('success')
    expect(data.session.access_token).toBeDefined()
  })
})
```

---

## 📋 Checklist para Completar Fase 2

### Backend ✅ COMPLETADO
- [x] Crear PostgreSQL functions
- [x] Desplegar Edge Function
- [x] Implementar 6 endpoints
- [x] Validaciones multicapa
- [x] Auditoría operativa
- [x] Documentación API

### Frontend 🔄 EN PROGRESO
- [ ] Crear página /login
- [ ] Crear página /registro
- [ ] Implementar Auth Context
- [ ] Crear Protected Routes
- [ ] Validaciones con React Hook Form + Zod
- [ ] Llamadas a API
- [ ] Manejo de errores
- [ ] Token storage + refresh
- [ ] Notificaciones (toast)
- [ ] Responsive design

---

## 🎨 Componentes UI Recomendados

### Opciones para Acelerar Desarrollo

#### 1. **Aceternity UI** (Recomendado para Conquistadores)
```bash
npm install @aceternity/ui
```

Componentes útiles:
- Button
- Input
- Checkbox
- Card
- Modal
- Spinner

#### 2. **Shadcn UI** (Alternativa)
```bash
npm install shadcn-ui
```

#### 3. **Tailwind CSS** (Base)
```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 🌍 URLs de Referencia

### Supabase Dashboard
- URL: https://app.supabase.com
- Proyecto: `dcgkzuouqeznxtfzgdil`

### Edge Functions
- Deployed: `https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/auth`
- Status: ✅ ACTIVE (Version 1)

### Base de Datos
- Host: Supabase PostgreSQL (sa-east-1)
- Database: `postgres`
- Tablas: 10 con RLS habilitado

---

## 📞 Debugging

### Ver Logs del Edge Function
```bash
# En Supabase Dashboard:
# Functions → auth → Logs
```

### Ver Logs de BD
```bash
# En Supabase Dashboard:
# Logs → PostgreSQL
```

### Ver Actividades Registradas
```sql
SELECT * FROM actividad_usuarios 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `401 Unauthorized` | Token inválido/expirado | Usar refresh_token |
| `400 Invalid email` | Email no válido | Verificar formato |
| `409 Cedula already exists` | Cédula duplicada | Validar con GET /cedula/:cedula |
| `CORS error` | Origen no permitido | Verificar headers CORS |
| `Edad fuera de rango` | Fecha no en 12-35 años | Validar fecha_nacimiento |

---

## 📅 Timeline Sugerido

```
AHORA ✅
├─ Fase 1: Setup & BD (COMPLETADO)
├─ Fase 2 Backend: Auth API (COMPLETADO)
│
PRÓXIMA SEMANA
├─ Fase 2 Frontend: Login + Registro
├─ Pruebas integración
│
SEGUNDA SEMANA
├─ Fase 3: Dashboard Admin
├─ Gestión de grupos
├─ Reportes
│
TERCERA SEMANA
├─ Fase 4: Funcionalidades avanzadas
├─ Notificaciones
├─ Exportación de datos
│
PRODUCCIÓN
└─ Deploy en servidor
```

---

**Última actualización**: 2026-01-19  
**Versión**: 1.0  
**Siguientes pasos**: Elegir OPCIÓN A (Backend) u OPCIÓN B (Frontend) para continuar
