# 🚀 INSTRUCCIONES PARA FASE 3 - DASHBOARD ADMINISTRATIVO

## Estado Actual
- ✅ FASE 1 Frontend & Backend: COMPLETADA
- ✅ FASE 2 Frontend & Backend: COMPLETADA
- 🔄 FASE 3 Frontend: PENDIENTE
- ⏳ FASE 3 Backend: Probablemente en progreso

---

## Antes de Comenzar FASE 3

### 1. VERIFICAR BACKEND FASE 3
Confirma que los siguientes endpoints existen en Supabase:
- `GET /api/jovenes` - Listar todos los jóvenes
- `GET /api/jovenes/:id` - Obtener un joven
- `PUT /api/jovenes/:id` - Actualizar joven
- `DELETE /api/jovenes/:id` - Eliminar joven

### 2. REVISAR ESTRUCTURA ACTUAL
```
frontend/
├── app/
│   ├── layout.tsx           ✅ Root layout con Providers
│   ├── page.tsx             ✅ Home
│   ├── login/
│   │   └── page.tsx         ✅ Login
│   ├── registro/
│   │   └── page.tsx         ✅ Registro público
│   ├── recuperar-contrasena/
│   │   └── page.tsx         ✅ Password recovery
│   └── dashboard/           🔄 NUEVA CARPETA
│       ├── layout.tsx       🔄 Protected layout
│       ├── page.tsx         🔄 Listado de jóvenes
│       ├── jovenes/
│       │   ├── [id]/
│       │   │   └── page.tsx 🔄 Detalle y edición
│       │   └── nuevo/
│       │       └── page.tsx 🔄 Crear nuevo joven
│       └── estadisticas/
│           └── page.tsx     🔄 Gráficos
├── hooks/
│   ├── useAuth.ts           ✅ Auth management
│   ├── useJovenes.ts        ✅ CRUD básico
│   └── useProtectedRoute.ts 🔄 NUEVO
├── utils/
│   ├── api-client.ts        ✅ HTTP client
│   ├── validators.ts        ✅ Validaciones
│   └── schemas.ts           ✅ Zod schemas
└── components/
    ├── ui/                  ✅ Shadcn components
    └── dashboard/           🔄 NUEVOS
        ├── Sidebar.tsx      🔄 Navigation
        ├── JovenesList.tsx  🔄 Table
        └── JovenCard.tsx    🔄 Card view
```

---

## FASE 3 TAREAS

### Tarea 1: Crear Protected Routes
**Archivo**: `app/dashboard/layout.tsx`

```typescript
// Proteger rutas del dashboard
// Verificar sesión con useAuth
// Redirect a /login si no autenticado
// Wrapper con Sidebar + Main content
```

### Tarea 2: Crear Sidebar Navigation
**Archivo**: `components/dashboard/Sidebar.tsx`

```typescript
// Navigation items:
// - Dashboard (home)
// - Jóvenes
// - Estadísticas
// - Configuración
// - Logout
```

### Tarea 3: Listar Jóvenes
**Archivo**: `app/dashboard/page.tsx`

```typescript
// Usar useQuery para GET /api/jovenes
// Mostrar tabla con:
// - Nombre
// - Email
// - Estado
// - Edad
// - Acciones (Ver, Editar, Eliminar)
// Filtros por estado
// Búsqueda por nombre/email
```

### Tarea 4: Detalle y Edición
**Archivo**: `app/dashboard/jovenes/[id]/page.tsx`

```typescript
// GET /api/jovenes/:id
// Mostrar todos los campos
// Permitir editar
// Validar con Zod
// PUT /api/jovenes/:id
// Confirmación de cambios
```

### Tarea 5: Eliminar Jóvenes
**Archivos**: `app/dashboard/page.tsx` + componentes

```typescript
// Modal de confirmación
// DELETE /api/jovenes/:id
// Revalidar listado
// Toast de confirmación
```

### Tarea 6: Estadísticas
**Archivo**: `app/dashboard/estadisticas/page.tsx`

```typescript
// Gráficos con Recharts:
// - Total de jóvenes
// - Por estado (Bautizado, Sellado, etc)
// - Por edad (distribución)
// - Por grupo
// Widgets con KPIs
```

---

## COMANDOS ÚTILES

### Iniciar servidor
```bash
cd frontend
npm run dev
# http://localhost:3000
```

### Build
```bash
cd frontend
npm run build
```

### Agregar componente shadcn
```bash
cd frontend
npx shadcn@latest add <component>
# Ej: npx shadcn@latest add table
# Ej: npx shadcn@latest add dialog
```

---

## COMPONENTES SHADCN/UI RECOMENDADOS PARA FASE 3

```bash
npx shadcn@latest add table     # Para listados
npx shadcn@latest add dialog    # Para modales
npx shadcn@latest add select    # Para filtros
npx shadcn@latest add search    # Para búsquedas
npx shadcn@latest add alert     # Para confirmaciones
```

---

## ESQUEMA DE HOOKS PARA FASE 3

### `hooks/useProtectedRoute.ts` - NUEVO
```typescript
// Verificar autenticación
// Redirect si no autenticado
// Exportar: isLoading, isAuthenticated, user
```

### Mejorar `hooks/useJovenes.ts`
```typescript
// useQuery(['jovenes'], ...)
// useQuery(['jovenes', id], ...)
// useMutation para POST /api/joven/registro
// useMutation para PUT /api/jovenes/:id
// useMutation para DELETE /api/jovenes/:id
// Invalidation después de mutaciones
```

---

## ESTRUCTURA DE COMPONENTES NUEVOS

### `components/dashboard/Sidebar.tsx`
- Links de navegación
- Usuario actual
- Botón logout
- Logo

### `components/dashboard/JovenesList.tsx`
- Tabla con DataTable (shadcn)
- Búsqueda
- Filtros
- Paginación
- Acciones

### `components/dashboard/JovenCard.tsx`
- Mostrar joven en vista tarjeta
- Acciones rápidas

### `components/dashboard/JovenForm.tsx`
- Reutilizable para crear/editar
- Validación con Zod
- Loading states

---

## NOTAS IMPORTANTES

1. **Protección de rutas**: Verificar sesión antes de renderizar
2. **Errores de API**: Manejar casos 401, 403, 404, 500
3. **Loading states**: Mostrar esqueletos de carga
4. **Confirmaciones**: Pedir confirmación antes de eliminar
5. **Toast notifications**: Éxito/error en cada acción
6. **Responsive**: Mobile-first design
7. **Accesibilidad**: ARIA labels en tablas y botones

---

## ORDEN RECOMENDADO

1. ✅ Crear `/dashboard` layout protegido
2. ✅ Crear Sidebar
3. ✅ Listar jóvenes (GET)
4. ✅ Ver detalle (GET :id)
5. ✅ Editar jóven (PUT)
6. ✅ Eliminar jóven (DELETE)
7. ✅ Estadísticas
8. ✅ Búsqueda y filtros
9. ✅ Exportación de datos

---

## DOCUMENTACIÓN

Cuando termines FASE 3:
1. Actualizar `FASE_3_COMPLETADA.md`
2. Actualizar `plan_implementacion.md`
3. Documentar nuevos hooks
4. Documentar nuevos componentes

---

**Estado**: 🔄 Listo para comenzar FASE 3

Cuando empieces, actualiza este archivo con el comando:

```bash
# COMENZAR FASE 3
```
