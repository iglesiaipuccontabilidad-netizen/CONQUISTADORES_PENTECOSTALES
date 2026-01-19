# 📋 PLAN DE IMPLEMENTACIÓN POR FASES
## Sistema de Gestión de Jóvenes - Conquistadores Pentecostales

### 🔄 ESTRUCTURA: 2 AGENTES EN PARALELO (Frontend + Backend)

---

## 📊 RESUMEN EJECUTIVO
- **Duración total estimada**: 12-14 semanas
- **Fases**: 7 fases principales + Deployment
- **Estructura**: Frontend y Backend trabajan en PARALELO
- **Stack Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Stack Backend**: Supabase, PostgreSQL, Row Level Security, Audit Logging
- **Enfoque**: MVP → Expansión → Optimización

---

## 👥 ROLES Y RESPONSABILIDADES

### 🎨 AGENTE FRONTEND
- Interfaz de usuario (Next.js, React, Tailwind)
- Formularios y validaciones (React Hook Form, Zod)
- **Componentes UI**: shadcn/ui + **Aceternity UI** (cuando haya componentes disponibles)
- Gráficos y visualizaciones (Recharts)
- Gestión de estado (TanStack Query)
- Responsive design
- UX/UI Polish
- **📚 IMPORTANTE**: Buscar mejores prácticas en **mcpContext7** antes de cada implementación

### 🔧 AGENTE BACKEND
- Base de datos (Supabase, PostgreSQL)
- Autenticación (Supabase Auth)
- Row Level Security (RLS)
- Tablas y esquemas
- Funciones y triggers
- Auditoría y logs
- Integración WhatsApp (preparación)
- Seguridad y validación
- **📚 IMPORTANTE**: Buscar mejores prácticas en **mcpContext7** antes de cada implementación

### 📚 RECURSOS DE REFERENCIA
- **mcpContext7**: Documentación actualizada y mejores prácticas → **Ambos agentes deben usarlo**
- **mcpAceternityui**: Componentes pre-construidos de UI → **Solo Frontend**

---

## 🎯 FASE 1: SETUP Y INFRAESTRUCTURA (Semana 1-2)
### Objetivos Generales
- Configurar proyecto base y repositorio
- Preparar base de datos
- Establecer estructura de seguridad
- Validar comunicación Frontend ↔ Backend

### 📚 ANTES DE INICIAR ESTA FASE
**🎨 Frontend**: Buscar en mcpContext7 mejores prácticas para:
- Estructura de proyectos Next.js 14
- Setup de TypeScript en proyectos React
- Configuración de Tailwind CSS
- Integración de shadcn/ui

**🔧 Backend**: Buscar en mcpContext7 mejores prácticas para:
- Estructura de proyectos PostgreSQL
- Seguridad en Supabase
- Row Level Security (RLS)
- Setup de autenticación JWT

---

### 🎨 TAREAS FRONTEND

#### Frontend - Setup Base
- [x] Crear proyecto Next.js 14 con App Router ✅
- [x] Instalar dependencias: ✅
  - React Hook Form, Zod (validaciones)
  - TanStack Query (state management)
  - Recharts (gráficos)
  - date-fns (fechas)
  - Sonner (toasts)
  - axios o fetch (cliente HTTP)
- [x] Configurar Tailwind CSS ✅
- [x] Instalar y configurar shadcn/ui ✅
- [x] Crear estructura de carpetas ✅
  ```
  frontend/
  ├── app/
  ├── components/
  ├── hooks/
  ├── lib/
  ├── types/
  ├── utils/
  └── styles/
  ```

#### Frontend - Configuración
- [x] Configurar variables de entorno (.env.local) ✅
- [x] Configurar cliente Supabase (supabase.ts en lib/) ✅
- [x] Configurar TypeScript global types ✅
- [x] Crear layout base del proyecto ✅
- [x] Setup de git y repositorio ✅

#### Frontend - Validar Integración
- [x] Validar conexión a cliente Supabase (listo) ✅
- [x] Test de variables de entorno (listo) ✅

### 🔧 TAREAS BACKEND

#### Backend - Base de Datos
- [ ] Crear proyecto Supabase
- [ ] Conectar PostgreSQL
- [ ] Diseñar esquema de tablas:
  - **jovenes** (nombre, fecha_nacimiento, edad, cedula, celular, estados, grupo_id, consentimientos, created_at, updated_at, created_by, updated_by)
  - **users** (nombre_completo, telefono, email, estado, ultima_sesion)
  - **grupos** (nombre, descripcion, lider_id)
  - **mensajes_cumpleanos** (joven_id, mensaje_enviado, fecha_envio, estado, enviado_por, numero_destino)
  - **plantillas_mensajes** (nombre, tipo, rango_edad_min, rango_edad_max, contenido, es_default, activa)
  - **versiculos** (texto, cita, activo)
  - **actividad_usuarios** (usuario_id, accion, tabla_afectada, registro_id, detalles JSON, ip_address, user_agent, created_at)
  - **configuracion_sistema** (clave, valor JSON, descripcion, updated_at, updated_by)
  - **historial_eliminaciones** (tabla, registro_id, datos_eliminados JSON, eliminado_por, motivo, fecha_eliminacion)

#### Backend - Autenticación
- [ ] Configurar Supabase Auth (JWT)
- [ ] Crear tabla users con FK a auth.users
- [ ] Configurar sesión de 24 horas
- [ ] Setup de políticas de contraseña fuerte

#### Backend - Seguridad (RLS)
- [ ] Habilitar Row Level Security en todas las tablas
- [ ] Crear policies básicas:
  - usuarios pueden ver solo sus datos
  - admins ven datos públicos
  - auditoría de todas las acciones
- [ ] Crear triggers para updated_at automático

#### Backend - Estructura
- [ ] Crear migrations en Supabase
- [ ] Documentar esquema de BD
- [ ] Crear índices en columnas clave (cedula, email, created_at)
- [ ] Configurar backup automático

#### Backend - Validar Integración
- [ ] Test de conexión desde cliente Supabase
- [ ] Verificar RLS policies
- [ ] Test de auth JWT

### ✅ ENTREGABLES FASE 1 - FRONTEND COMPLETADO

✅ Repositorio Git configurado (Frontend en /frontend)
✅ Proyecto Next.js 14 funcional (corriendo en localhost:3000)
✅ TypeScript configurado con rutas alias
✅ Tailwind CSS v4 integrado
✅ Shadcn/UI instalado (Button, Input, Form, Label, Checkbox, Card)
✅ Variables de entorno configuradas (.env.local)
✅ Cliente Supabase listo (lib/supabase.ts)
✅ Validadores especializados (Colombia)
✅ Hooks personalizados (useAuth, useJovenes)
✅ Documentación de estructura (FRONTEND_SETUP.md)

⏳ BACKEND - EN PROGRESO:
⏳ Supabase con esquema completo (Backend)
⏳ RLS habilitado en todas las tablas (Backend)
⏳ Documentación de BD y estructura (Backend)

### ✅ CRITERIOS DE ACEPTACIÓN
- ✅ Frontend corre sin errores (`npm run dev`) - VERIFICADO
- ✅ Compilación TypeScript sin errores - VERIFICADO
- ✅ Build de producción exitoso - VERIFICADO
- ⏳ Conexión a Supabase validada desde Frontend (Espera Backend)
- ⏳ Todas las tablas creadas en BD (Backend - EN PROGRESO)
- ⏳ RLS activo y funcionando (Backend - EN PROGRESO)
- ⏳ Autenticación Supabase configurada (Backend - EN PROGRESO)
- ✅ Ambos agentes pueden hacer commits a git
- ⏳ Variables de entorno sincronizadas (Espera Backend)

---

## 🔐 FASE 2: AUTENTICACIÓN Y FORMULARIO PÚBLICO (Semana 3-4)
### Objetivos Generales
- Implementar sistema de login admin
- Crear formulario público de registro de jóvenes
- Validar flujo completo de datos

### 📚 ANTES DE INICIAR ESTA FASE
**🎨 Frontend**: Buscar en mcpContext7 mejores prácticas para:
- Componentes de formulario con React Hook Form
- Validación de inputs con Zod
- Autenticación con JWT en Next.js
- Componentes de Login/Formularios en **mcpAceternityui**
- Gestión de errores en formularios
- UX de confirmación y validaciones

**🔧 Backend**: Buscar en mcpContext7 mejores prácticas para:
- Autenticación con JWT
- Validación de contraseñas
- Recuperación de contraseña segura
- Envío de emails
- API REST con validaciones

---

### 🎨 TAREAS FRONTEND

#### Frontend - Autenticación UI
- [x] Página de login (`/login`): ✅
  - Email + contraseña
  - Botón "Recordarme" (localStorage)
  - Link a "Recuperar contraseña"
  - Validaciones visual (ZOD)
  - Loading state
  - Error messages
- [x] Página de recuperación de contraseña (`/recuperar-contrasena`) ✅
  - Email input
  - Validación de email
  - Mensaje de confirmación
- [x] Componentes de autenticación: ✅
  - AuthContext (useAuth hook)
  - useAuth hook funcional
  - Supabase Auth integration

#### Frontend - Formulario Público
- [ ] Página pública de registro (`/registro`)
  - **Buscar componentes Form, Input, Checkbox en mcpAceternityui** 🎨
  - Responsiva (mobile-first)
  - Campos:
    - Nombre completo (text, required)
    - Fecha de nacimiento (date picker, required)
    - Edad (auto-calculada, read-only)
    - Cédula (text, required, unique validation)
    - Celular (format +57XXXXXXXXXX, required)
  - Checkboxes:
    - Bautizado, Sellado, Servidor, Simpatizante
  - 4 Checkboxes de consentimiento (required):
    - Consentimiento datos personales
    - Consentimiento WhatsApp
    - Consentimiento procesamiento
    - Consentimiento terminos
  - Validaciones real-time:
    - Cédula única (call API)
    - Edad 12-35 años
    - Celular formato correcto
    - Consentimientos checked
- [x] Submit button con loading state ✅
- [x] Pantalla de confirmación exitosa ✅
  - Mensaje de éxito
  - Link a home
- [x] Error handling y mensajes ✅

#### Frontend - Integración con Backend
- [x] Cliente HTTP para registro API ✅
- [x] Manejo de errores de respuesta ✅
- [x] Storage de JWT en cliente ✅
- [x] Refresh de tokens automático ✅

### 🔧 TAREAS BACKEND

#### Backend - Autenticación
- [x] Configurar Supabase Auth completamente ✅
- [x] Crear tabla users vinculada a auth.users ✅
- [x] Función/trigger para crear user al registrarse ✅
- [x] RLS policies en tabla users ✅
- [x] Implementar recuperación de contraseña ✅
- [x] Validar contraseña fuerte ✅

#### Backend - API Endpoints
- [x] POST `/auth/login` - Login con email/contraseña ✅
- [x] POST `/auth/logout` - Logout ✅
- [x] POST `/auth/recuperar-contrasena` - Enviar email reset ✅
- [x] GET `/auth/me` - Datos del usuario autenticado ✅

#### Backend - Formulario Público API
- [x] POST `/api/joven/registro` - Registrar joven ✅
  - Validar cédula única (query BD)
  - Validar edad 12-35 años
  - Validar formato celular +57XXXXXXXXXX
  - Validar consentimientos (todos true)
  - Insertar en tabla jovenes
  - Retornar confirmación
  - **Enviar email a admins** (notificación de nuevo registro)
  - Registrar en audit log

- [ ] GET `/api/joven/cedula/:cedula` - Validar cédula única
  - Retornar existe: true/false
  - Sin autenticación (público)

#### Backend - Validaciones y Seguridad
- [ ] Validar cédula única en BD (constraint)
- [ ] Sanitizar inputs (SQL injection)
- [ ] Rate limiting en endpoints públicos
- [ ] CORS configurado solo para dominio permitido
- [ ] Logging de intentos de login fallidos

#### Backend - Notificaciones
- [ ] Configurar email service:
  - Template de bienvenida
  - Template de notificación a admin (nuevo registro)
- [ ] Función para enviar email (transacional)

### ✅ ENTREGABLES FASE 2
✅ Sistema de login completamente funcional
✅ Formulario público de registro validado
✅ Sistema de recuperación de contraseña
✅ APIs de autenticación documentadas
✅ Notificaciones por email funcionando
✅ RLS policies en users y jovenes

### ✅ CRITERIOS DE ACEPTACIÓN
- ✅ Admin puede logarse con email/contraseña
- ✅ Sesión se mantiene 24 horas
- ✅ Formulario valida edad 12-35 años
- ✅ Cédula debe ser única
- ✅ Celular valida formato +57
- ✅ Todos los consentimientos son obligatorios
- ✅ Email de bienvenida se envía
- ✅ Admin recibe notificación de nuevo registro
- ✅ Datos se guardan correctamente en BD
- ✅ Pantalla de confirmación muestra dato guardado

---

## 📊 FASE 3: DASHBOARD Y GESTIÓN BÁSICA (Semana 5-7)
### Objetivos Generales
- Dashboard admin con métricas principales
- CRUD completo de jóvenes
- Gestión de grupos
- Búsqueda y filtrado avanzado

### 📚 ANTES DE INICIAR ESTA FASE
**🎨 Frontend**: Buscar en mcpContext7 mejores prácticas para:
- Componentes de Dashboard/Layout
- Gráficos con Recharts
- Tablas con filtros y búsqueda
- Componentes Card, Badge, Button en **mcpAceternityui** 🎨
- Paginación
- Modales y Drawers
- Estados de carga (Skeleton loaders)

**🔧 Backend**: Buscar en mcpContext7 mejores prácticas para:
- Queries optimizadas en PostgreSQL
- Índices en BD
- Paginación y offset
- Búsqueda full-text
- RLS policies avanzadas
- API REST RESTful

---

### 🎨 TAREAS FRONTEND

#### Frontend - Dashboard
- [ ] Página principal protegida (`/dashboard`)
  - **Buscar componentes de Dashboard, Card, Stat en mcpAceternityui** 🎨
- [ ] Tarjetas de métricas:
  - Total de jóvenes
  - % Bautizados
  - % Sellados
  - % Servidores
  - Cumpleaños del mes (contador)
- [ ] Gráficos con Recharts:
  - Distribución por edad (BarChart: 12-15, 16-18, 19-25, 26-30, 31-35)
  - Estado espiritual (PieChart: Bautizado, Sellado, Servidor, Simpatizante)
  - Crecimiento mensual (LineChart: últimos 12 meses)
- [ ] Widgets rápidos:
  - Cumpleaños de hoy (lista)
  - Actividad reciente (últimas 5 acciones)
  - Próximos cumpleaños (próximos 7 días)
- [ ] Responsive grid layout
- [ ] Loading states para gráficos
- [ ] Refresh de datos en tiempo real (TanStack Query)

#### Frontend - Tabla de Jóvenes
- [ ] Página `/dashboard/jovenes`
  - **Buscar componentes Table, Badge, Button, Dialog en mcpAceternityui** 🎨
- [ ] Tabla con columnas:
  - Nombre completo
  - Edad
  - Cédula
  - Celular
  - Estados (badges: Bautizado ✓, Sellado ✓, Servidor ✓, Simpatizante ✓)
  - Grupo
  - Acciones (ver, editar, eliminar)
- [ ] Funcionalidades:
  - Búsqueda global (por nombre, cédula, celular)
  - Filtros:
    - Por edad (rango)
    - Por estado (checkbox multiple)
    - Por grupo (select)
    - Por mes cumpleaños (select)
  - Paginación (10, 25, 50, 100 registros)
  - Ordenamiento por columnas (clic en header)
  - Responsive (tabla → cards en móvil)
- [ ] Estados visuales: loading, error, empty
- [ ] Botón "Crear Joven" (modal/página)

#### Frontend - CRUD Jóvenes
- [ ] Modal/Página de crear joven:
  - **Buscar componentes Form, Dialog en mcpAceternityui** 🎨
  - Formulario con todos los campos
  - Validaciones (igual al registro público)
  - Submit a API
  - Confirmación de éxito
- [ ] Modal/Página de ver detalle:
  - Mostrar todos los datos
  - Estado de consentimientos
  - Fecha de registro
  - Quién lo registró
  - Botones: Editar, Eliminar
- [ ] Modal/Página de editar joven:
  - Pre-cargar datos actuales
  - Permitir edición de todos los campos
  - Validaciones
  - Submit a API
  - Toast de confirmación
- [ ] Modal de eliminar (confirmación estricta):
  - Mostrar nombre
  - Advertencia
  - Botones: Cancelar, Eliminar
- [ ] Asignar a grupo:
  - Select de grupos
  - Submit inmediato
  - Toast confirmación

#### Frontend - Gestión de Grupos
- [ ] Página `/dashboard/grupos`
  - **Buscar componentes Table, Card, Button, Dialog en mcpAceternityui** 🎨
- [ ] Tabla de grupos:
  - Nombre
  - Descripción
  - Líder
  - # Integrantes
  - Acciones (ver, editar, eliminar)
- [ ] Modal crear grupo:
  - Nombre (required)
  - Descripción
  - Seleccionar líder (select de users)
  - Submit
- [ ] Modal editar grupo
- [ ] Modal eliminar grupo
- [ ] Página de detalle grupo:
  - Información del grupo
  - Lista de integrantes (tabla)
  - Estadísticas:
    - # Total integrantes
    - Edad promedio
    - % Bautizados
    - % Sellados
  - Botón "Exportar lista" (CSV)
  - Botón "Enviar mensaje grupal" (futura feature)

### 🔧 TAREAS BACKEND

#### Backend - Queries Optimizadas
- [ ] Query para obtener métricas dashboard:
  - Total jóvenes
  - Counts por estado (bautizado, sellado, servidor)
  - Cumpleaños del mes
  - Últimos 12 meses (para gráfico)
- [ ] Índices en BD:
  - cedula (unique)
  - grupo_id
  - created_at
  - fecha_nacimiento

#### Backend - API: Jóvenes
- [ ] GET `/api/jovenes` - Listar jóvenes:
  - Query params: page, limit, search, filter_edad, filter_estado, filter_grupo, filter_mes
  - Return: array de jóvenes + total count
  - Paginación
  - Búsqueda en nombre, cédula, celular
  - Filtros múltiples
  - Requiere autenticación

- [ ] GET `/api/jovenes/:id` - Ver detalle:
  - Return: joven completo con datos de grupo
  - Requiere autenticación

- [ ] POST `/api/jovenes` - Crear joven:
  - Body: nombre, fecha_nacimiento, cedula, celular, estados, grupo_id
  - Validar cédula única
  - Validar edad 12-35
  - Insertar en BD
  - Return: joven creado
  - Registrar en audit log
  - Requiere autenticación

- [ ] PUT `/api/jovenes/:id` - Editar joven:
  - Body: campos a actualizar
  - Validaciones
  - Update en BD
  - Registrar en audit log
  - Requiere autenticación

- [ ] DELETE `/api/jovenes/:id` - Eliminar joven:
  - Requiere confirmación (header X-Confirm: true)
  - Guardar datos en historial_eliminaciones
  - Registrar en audit log
  - Requiere autenticación

#### Backend - API: Grupos
- [ ] GET `/api/grupos` - Listar grupos:
  - Return: array de grupos + integrantes count

- [ ] GET `/api/grupos/:id` - Ver detalle grupo:
  - Incluir lista de integrantes
  - Estadísticas (edad promedio, % estados)

- [ ] POST `/api/grupos` - Crear grupo:
  - Body: nombre, descripcion, lider_id
  - Insert en BD
  - Registrar en audit log

- [ ] PUT `/api/grupos/:id` - Editar grupo

- [ ] DELETE `/api/grupos/:id` - Eliminar grupo

- [ ] PUT `/api/jovenes/:id/grupo` - Asignar a grupo:
  - Body: grupo_id
  - Update joven
  - Registrar en audit log

#### Backend - API: Dashboard Metrics
- [ ] GET `/api/dashboard/metrics` - Métricas principales:
  - Total jóvenes
  - Bautizados (count + %)
  - Sellados (count + %)
  - Servidores (count + %)
  - Cumpleaños este mes (count)
  - Return: objeto con todas las métricas

- [ ] GET `/api/dashboard/chart-edad` - Distribución por edad
- [ ] GET `/api/dashboard/chart-estado` - Estado espiritual
- [ ] GET `/api/dashboard/chart-crecimiento` - Crecimiento últimos 12 meses
- [ ] GET `/api/dashboard/cumpleaños-hoy` - Cumpleañeros de hoy
- [ ] GET `/api/dashboard/actividad-reciente` - Últimas 5 acciones
- [ ] GET `/api/dashboard/proximos-cumpleaños` - Próximos 7 días

#### Backend - RLS Policies
- [ ] RLS en tabla jovenes:
  - Admins (service role) ven todos
  - SELECT para autenticados
  - INSERT/UPDATE/DELETE solo por admins
- [ ] RLS en tabla grupos:
  - Admins ven todos
  - Membros ven su grupo

#### Backend - Audit Log
- [ ] Trigger para insertar en actividad_usuarios:
  - Al crear joven
  - Al editar joven
  - Al eliminar joven
  - Al crear grupo
  - Al editar grupo
  - Al eliminar grupo

### ✅ ENTREGABLES FASE 3
✅ Dashboard con gráficos funcionales
✅ Tabla de jóvenes con filtros y búsqueda
✅ CRUD completo de jóvenes
✅ Gestión completa de grupos
✅ APIs documentadas y probadas
✅ Audit logging funcionando

### ✅ CRITERIOS DE ACEPTACIÓN
- ✅ Dashboard carga en < 2 segundos
- ✅ Gráficos muestran datos correctos
- ✅ Búsqueda funciona en tiempo real
- ✅ Filtros múltiples funcionan
- ✅ Paginación ordena correctamente
- ✅ CRUD crea, edita, elimina sin errores
- ✅ Datos se actualizan en BD
- ✅ Audit log registra todas las acciones
- ✅ RLS policies protegen datos
- ✅ Responsive en todos los dispositivos

---

## 🎂 FASE 4: CUMPLEAÑOS Y REPORTES (Semana 8-10)
### Objetivos Generales
- Sistema de gestión de cumpleaños
- Envío de felicitaciones por WhatsApp
- Sistema completo de reportes
- Gestión de plantillas

### 📚 ANTES DE INICIAR ESTA FASE
**🎨 Frontend**: Buscar en mcpContext7 mejores prácticas para:
- Componentes de Calendario
- Modales y Drawers
- Componentes Card, Button, Select en **mcpAceternityui** 🎨
- Exportación de datos (Excel, PDF, CSV)
- Tablas con datos históricos
- Editor de texto/templates

**🔧 Backend**: Buscar en mcpContext7 mejores prácticas para:
- Queries de fechas en PostgreSQL
- Generación de reportes
- Exportación de datos (xlsx, PDF)
- Seguridad en descargas
- Cron jobs para tareas automáticas

---

### 🎨 TAREAS FRONTEND

#### Frontend - Módulo Cumpleaños
- [ ] Página `/dashboard/cumpleaños`
  - **Buscar componentes Card, Button, Badge en mcpAceternityui** 🎨
- [ ] Tabs/Secciones:
  - **Hoy**: Lista de cumpleañeros del día
    - Cards con foto (avatar), nombre, edad
    - Botón "Enviar Felicitación"
  - **Esta Semana**: Vista por días
    - Desglose de cumpleaños por día
    - Contador por día
  - **Este Mes**: Contador + Calendario visual
    - Calendario del mes con números en fechas con cumpleaños
    - Contador total
  - **Próximos 30 días**: Lista ordenada
    - Tabla: Nombre, Fecha, Días para cumpleaños
    - Ordenada por proximidad

#### Frontend - Envío de Felicitaciones
- [ ] Modal de seleccionar plantilla:
  - **Buscar componentes Select, Dialog en mcpAceternityui** 🎨
  - Select de plantillas
  - Preview de plantilla
  - Botones: Usar, Cancelar
- [ ] Modal de previsualización editable:
  - Mostrar mensaje con variables reemplazadas
  - Campo de texto editable
  - Preview en tiempo real
  - Botones: Enviar WhatsApp, Cancelar
- [ ] Integración WhatsApp:
  - Botón "Enviar por WhatsApp"
  - Abrir chat de WhatsApp Web con número pre-llenado
  - Mensaje pre-escrito
  - Link: `https://wa.me/57XXXXXXXXXX?text=mensaje`
- [ ] Toast de confirmación después de envío
- [ ] Historial de envíos:
  - Tabla con: Nombre, Fecha, Hora, Plantilla usada, Estado
  - Mostrar ✓ si fue enviado

#### Frontend - Gestión de Plantillas
- [ ] Página `/dashboard/plantillas-cumpleaños`
  - **Buscar componentes Table, Button, Dialog, Input en mcpAceternityui** 🎨
- [ ] Tabla de plantillas:
  - Nombre
  - Rango de edad (12-15, etc.)
  - Estado (activa/inactiva)
  - Default (sí/no)
  - Acciones (ver, editar, eliminar)
- [ ] Modal crear plantilla:
  - Nombre (required)
  - Rango edad mín-máx
  - Contenido (textarea grande)
  - Check "Es plantilla por defecto"
  - Variables disponibles: {NOMBRE}, {EDAD}, {FECHA}
  - Botón "Insertar variable" (click insert)
  - Preview en vivo
- [ ] Modal editar plantilla
- [ ] Modal eliminar plantilla (confirmación)
- [ ] Editor de plantilla con:
  - Syntax highlighting
  - Contador de caracteres
  - Preview lado a lado
  - Insertar versículos (botón)

#### Frontend - Versículos Bíblicos
- [ ] Listado de versículos:
  - **Buscar componentes Table, Button en mcpAceternityui** 🎨
  - Tabla: Texto, Cita, Activo (toggle)
- [ ] Agregar versículo:
  - Modal con Texto, Cita
- [ ] Editar versículo
- [ ] Eliminar versículo
- [ ] Botón de insertar versículo aleatorio en plantilla

#### Frontend - Reportes
- [ ] Página `/dashboard/reportes`
  - **Buscar componentes Card, Button, Select, Dialog en mcpAceternityui** 🎨
- [ ] Selector de tipo de reporte:
  - Radio buttons o select:
    - General (todas las estadísticas)
    - Por edad (rangos)
    - Estado espiritual (por categoría)
    - Cumpleaños (por mes)
    - Por grupos (composición)
    - Crecimiento (últimos 12 meses)
    - Personalizado (filtros custom)
- [ ] Panel de filtros (según tipo seleccionado):
  - Rango de fechas
  - Grupo
  - Estado
  - Edad
- [ ] Botón "Generar Reporte"
- [ ] Vista de previsualización:
  - Gráficos
  - Tablas
  - Estadísticas
- [ ] Botones de exportación:
  - "Descargar Excel"
  - "Descargar PDF"
  - "Descargar CSV"
  - "Imprimir"
- [ ] Loading state mientras genera
- [ ] Manejo de errores

### 🔧 TAREAS BACKEND

#### Backend - API Cumpleaños
- [ ] GET `/api/cumpleaños/hoy` - Cumpleañeros de hoy:
  - Return: array de jóvenes con cumpleaños hoy

- [ ] GET `/api/cumpleaños/semana` - Próximos 7 días:
  - Return: array agrupado por día

- [ ] GET `/api/cumpleaños/mes` - Este mes:
  - Return: array con contador y datos

- [ ] GET `/api/cumpleaños/30-dias` - Próximos 30 días:
  - Return: array ordenado por fecha

- [ ] POST `/api/cumpleaños/enviar` - Registrar envío de felicitación:
  - Body: joven_id, plantilla_id, mensaje_enviado, numero_destino
  - Insert en mensajes_cumpleaños
  - Return: confirmación
  - Registrar en audit log

- [ ] GET `/api/cumpleaños/historial` - Historial de envíos:
  - Query params: limit, offset, joven_id, mes
  - Return: array de mensajes_cumpleaños

#### Backend - API Plantillas
- [ ] GET `/api/plantillas-cumpleaños` - Listar plantillas:
  - Return: todas las plantillas activas

- [ ] GET `/api/plantillas-cumpleaños/:id` - Ver detalle

- [ ] POST `/api/plantillas-cumpleaños` - Crear plantilla:
  - Body: nombre, rango_edad_min, rango_edad_max, contenido, es_default, activa
  - Si es_default=true, desactivar otras del mismo rango
  - Insert en BD
  - Registrar en audit log

- [ ] PUT `/api/plantillas-cumpleaños/:id` - Editar plantilla

- [ ] DELETE `/api/plantillas-cumpleaños/:id` - Eliminar plantilla:
  - Validar que no sea la única plantilla
  - Registrar en audit log

- [ ] GET `/api/plantillas-cumpleaños/rango/:edad` - Plantilla por edad:
  - Return: plantilla aplicable para esa edad

#### Backend - API Versículos
- [ ] GET `/api/versiculos` - Listar versículos activos
- [ ] GET `/api/versiculos/random` - Versículo aleatorio
- [ ] POST `/api/versiculos` - Crear versículo
- [ ] PUT `/api/versiculos/:id` - Editar versículo
- [ ] DELETE `/api/versiculos/:id` - Eliminar versículo

#### Backend - API Reportes
- [ ] GET `/api/reportes/general` - Reporte general:
  - Total jóvenes
  - Estadísticas por estado
  - Crecimiento últimos 12 meses
  - Distribución por edad
  - Estadísticas por grupo

- [ ] GET `/api/reportes/por-edad` - Por rangos de edad:
  - 12-15, 16-18, 19-25, 26-30, 31-35
  - Counts y porcentajes

- [ ] GET `/api/reportes/estado-espiritual` - Por categoría:
  - Bautizados, Sellados, Servidores, Simpatizantes
  - Counts y porcentajes

- [ ] GET `/api/reportes/cumpleaños` - Cumpleaños:
  - Por mes (12 meses)
  - Calendario anual

- [ ] GET `/api/reportes/por-grupos` - Por grupo:
  - Composición de cada grupo
  - Estadísticas por grupo

- [ ] GET `/api/reportes/crecimiento` - Crecimiento:
  - Últimos 12 meses
  - Registros por mes

- [ ] GET `/api/reportes/personalizado` - Personalizado:
  - Query params: filters (JSON)
  - Retornar datos filtrados

#### Backend - Exportación de Datos
- [ ] Función para generar Excel (.xlsx):
  - Librería: xlsx
  - Headers y formato
  - Múltiples sheets según tipo reporte
  - Validar datos antes de exportar

- [ ] Función para generar PDF:
  - Librería: jsPDF + jspdf-autotable
  - Headers, títulos, gráficos
  - Tablas formateadas
  - Footers con fecha

- [ ] Función para generar CSV:
  - Formato estándar
  - Validación de caracteres especiales
  - BOM para Excel

#### Backend - Función de Exportación
- [ ] POST `/api/reportes/exportar` - Exportar reporte:
  - Body: tipo_reporte, formato (excel/pdf/csv), filtros
  - Generar archivo
  - Return: URL descarga o stream

### ✅ ENTREGABLES FASE 4
✅ Sistema de cumpleaños funcional
✅ Envío de WhatsApp integrado
✅ Plantillas editables
✅ Sistema de reportes completo
✅ Exportación a múltiples formatos
✅ Historial de mensajes

### ✅ CRITERIOS DE ACEPTACIÓN
- ✅ Cumpleañeros se muestran correctamente
- ✅ Plantillas se pueden crear/editar/eliminar
- ✅ Variables se reemplazan correctamente
- ✅ WhatsApp abre con mensaje pre-llenado
- ✅ Registra cada envío en BD
- ✅ Reportes generan datos correctos
- ✅ Excel se descarga correctamente
- ✅ PDF tiene formato profesional
- ✅ CSV compatible con Excel
- ✅ Historial muestra todos los envíos

---

## ⚙️ FASE 5: CONFIGURACIÓN, SEGURIDAD Y AUDITORÍA (Semana 11-12)
### Objetivos Generales
- Panel de configuración completo
- Sistema de auditoría robusto
- Seguridad avanzada
- Backup automático

### 📚 ANTES DE INICIAR ESTA FASE
**🎨 Frontend**: Buscar en mcpContext7 mejores prácticas para:
- Componentes de Configuración/Settings
- Componentes Tabs, Toggle, Input en **mcpAceternityui** 🎨
- Tablas de auditoría
- Modales de confirmación
- File upload
- Form validation

**🔧 Backend**: Buscar en mcpContext7 mejores prácticas para:
- Almacenamiento de configuración
- Auditoría y logging
- Backup de BD
- Rate limiting
- Seguridad de endpoints
- Validación de inputs

---

### 🎨 TAREAS FRONTEND

#### Frontend - Panel de Configuración
- [ ] Página `/dashboard/configuracion`
  - **Buscar componentes Tabs, Toggle, Input, Button en mcpAceternityui** 🎨
- [ ] Tabs/Secciones:

  **A. General**
  - [ ] Info del comité:
    - Nombre comité
    - Descripción
    - Email contacto
    - Teléfono
  - [ ] Logo:
    - Upload de archivo
    - Preview
    - Botón eliminar
  - [ ] Configuración registro público:
    - Toggle: Registro habilitado sí/no
    - Toggle: Requiere aprobación
  - [ ] Edades permitidas:
    - Edad mínima (input)
    - Edad máxima (input)

  **B. Notificaciones**
  - [ ] Emails de notificación:
    - Lista de emails de admins a notificar
    - Agregar/eliminar emails
  - [ ] Toggle: Activar/desactivar notificaciones
  - [ ] Horarios de envío:
    - Hora de inicio (time input)
    - Hora de fin (time input)
  - [ ] Tipos de notificación:
    - Toggle: Nuevo registro
    - Toggle: Cumpleaños del día
    - Toggle: Reportes automáticos

  **C. WhatsApp**
  - [ ] Código de país (input, default +57)
  - [ ] Formato de número (informativo, regex display)
  - [ ] Test de número:
    - Input para test
    - Botón "Validar formato"
    - Resultado: Válido/Inválido

  **D. Email**
  - [ ] Editor de plantillas de email:
    - Bienvenida (textarea)
    - Recuperación de contraseña (textarea)
    - Notificación nuevo registro (textarea)
    - Variables disponibles: {NOMBRE}, {EMAIL}, {LINK}
    - Preview
    - Test (enviar email a dirección)

  **E. Backup**
  - [ ] Estado backup automático (toggle)
  - [ ] Frecuencia de backup (select: diario, semanal)
  - [ ] Botón "Descargar backup manual"
  - [ ] Historial de backups:
    - Tabla: Fecha, Tamaño, Estado, Descarga
    - Ordenado por fecha desc

  **F. Seguridad**
  - [ ] Tiempo de sesión (input: minutos, default 1440 = 24h)
  - [ ] Intentos de login permitidos (input)
  - [ ] Bloqueo después de intentos fallidos (minutos)
  - [ ] Requiere contraseña fuerte:
    - Mín caracteres (input)
    - Requiere mayúsculas (toggle)
    - Requiere números (toggle)
    - Requiere caracteres especiales (toggle)

- [ ] Botón "Guardar Configuración" (form submit)
- [ ] Toast de confirmación
- [ ] Validaciones en formularios
- [ ] Estado de guardado (loading)

#### Frontend - Historial y Logs
- [ ] Página `/dashboard/logs`
  - **Buscar componentes Tabs, Table, Button, Dialog en mcpAceternityui** 🎨
- [ ] Tabs:
  - **Actividad de Usuarios** (audit log)
    - Tabla: Usuario, Acción, Tabla afectada, Fecha, Hora, IP
    - Búsqueda por usuario
    - Filtro por acción (CREATE, UPDATE, DELETE)
    - Filtro por tabla
    - Filtro por rango de fechas
    - Paginación
    - Botón "Ver detalles" → modal con JSON de cambios
  - **Historial de Eliminaciones**
    - Tabla: Tabla, Registro, Eliminado por, Motivo, Fecha
    - Datos eliminados (expandible, JSON viewer)
    - Filtro por tabla
    - Filtro por usuario
    - Búsqueda
  - **Accesos y Sesiones** (opcional)
    - Tabla: Usuario, Fecha, Hora, IP, Status (éxito/fallo)

#### Frontend - Gestión de Usuarios Admin
- [ ] Página `/dashboard/usuarios` (administradores)
  - **Buscar componentes Table, Button, Dialog en mcpAceternityui** 🎨
- [ ] Tabla de usuarios:
  - Nombre
  - Email
  - Rol
  - Estado (activo/inactivo)
  - Última sesión
  - Acciones
- [ ] Crear usuario admin:
  - Modal con email, nombre, rol
  - Submit envía invite
- [ ] Editar usuario:
  - Cambiar nombre
  - Cambiar rol
  - Activar/desactivar
- [ ] Eliminar usuario (con confirmación)

### 🔧 TAREAS BACKEND

#### Backend - API Configuración
- [ ] GET `/api/configuracion` - Obtener todas las configuraciones:
  - Return: objeto con todas las settings
  - Cachear en cliente (TanStack Query)

- [ ] PUT `/api/configuracion/general` - Actualizar general:
  - Body: nombre, descripcion, email, telefono, logo_url, registro_habilitado, edades_min, edades_max
  - Update en tabla configuracion_sistema
  - Registrar en audit log

- [ ] PUT `/api/configuracion/notificaciones` - Actualizar notificaciones:
  - Body: emails, activa, hora_inicio, hora_fin, tipos
  - Update en configuracion_sistema
  - Registrar en audit log

- [ ] PUT `/api/configuracion/whatsapp` - Actualizar WhatsApp:
  - Body: codigo_pais, formato
  - Update en configuracion_sistema

- [ ] POST `/api/configuracion/whatsapp/validar` - Validar formato:
  - Body: numero
  - Return: válido true/false

- [ ] PUT `/api/configuracion/email-plantillas` - Actualizar plantillas:
  - Body: tipo, contenido
  - Update en configuracion_sistema
  - Validar variables

- [ ] POST `/api/configuracion/email-plantillas/test` - Test de email:
  - Body: tipo, email_destino
  - Enviar email con plantilla
  - Return: enviado true/false

- [ ] PUT `/api/configuracion/backup` - Actualizar backup:
  - Body: activo, frecuencia
  - Update en configuracion_sistema

- [ ] POST `/api/configuracion/backup/manual` - Descargar backup:
  - Generar dump de BD
  - Return: archivo descargable

- [ ] GET `/api/configuracion/backup/historial` - Historial backups:
  - Return: lista de backups

- [ ] PUT `/api/configuracion/seguridad` - Actualizar seguridad:
  - Body: tiempo_sesion, intentos_login, tiempo_bloqueo, requisitos_contraseña
  - Update en configuracion_sistema

#### Backend - Sistema de Auditoría
- [ ] Tabla `actividad_usuarios` (si no existe):
  - id (PK)
  - usuario_id (FK users)
  - accion (CREATE, READ, UPDATE, DELETE)
  - tabla_afectada (string)
  - registro_id (id del registro afectado)
  - detalles (JSONB - valores old/new)
  - ip_address
  - user_agent
  - created_at

- [ ] Tabla `historial_eliminaciones` (si no existe):
  - id (PK)
  - tabla (string)
  - registro_id
  - datos_eliminados (JSONB)
  - eliminado_por (FK users)
  - motivo (texto)
  - fecha_eliminacion

- [ ] Trigger para INSERT en actividad_usuarios:
  - Ejecutarse en: INSERT, UPDATE, DELETE en jovenes, grupos, usuarios
  - Registrar automáticamente
  - Capturar old_row y new_row (JSONB)
  - Capturar IP (desde header X-Forwarded-For)

- [ ] Trigger para historial_eliminaciones:
  - En DELETE de jovenes
  - Guardar datos completos
  - Asignar usuario_id actual

#### Backend - API Logs
- [ ] GET `/api/logs/actividad` - Listar actividad:
  - Query params: usuario_id, accion, tabla, fecha_desde, fecha_hasta, page, limit
  - Return: array de actividades + total

- [ ] GET `/api/logs/actividad/:id` - Ver detalle:
  - Return: actividad con detalles completos (JSON prettified)

- [ ] GET `/api/logs/eliminaciones` - Listar eliminaciones:
  - Query params: tabla, usuario_id, fecha_desde, fecha_hasta, page, limit
  - Return: array

- [ ] GET `/api/logs/eliminaciones/:id` - Ver detalle con datos eliminados

- [ ] GET `/api/logs/accesos` - Historial de accesos (opcional):
  - Registrar login/logout en tabla actividad_usuarios
  - Query params: usuario_id, fecha_desde, fecha_hasta

#### Backend - Backups
- [ ] Función de backup automático:
  - pg_dump de la BD
  - Comprimir (.sql.gz)
  - Guardar en Storage de Supabase o filesystem
  - Ejecutarse según frecuencia configurada (cron job)

- [ ] Función de descarga manual:
  - Generar dump
  - Return como descarga (attachment header)

- [ ] Almacenamiento de metadata:
  - Tabla: fecha, tamaño, status, ruta
  - Retención: últimos 30 backups

#### Backend - Rate Limiting
- [ ] Implementar rate limiting:
  - Endpoint login: 5 intentos por 15 minutos por IP
  - Endpoints públicos: 20 requests por minuto por IP
  - Endpoints autenticados: 100 requests por minuto por usuario
  - Return 429 (Too Many Requests) cuando se exceda

#### Backend - RLS Policies Avanzadas
- [ ] RLS en tabla actividad_usuarios:
  - Admins ven todos los logs
  - Usuarios normales no acceden
- [ ] RLS en tabla historial_eliminaciones:
  - Solo admins ven
  - Select con restrict

#### Backend - Validaciones Avanzadas
- [ ] Validar contraseña fuerte (según config):
  - Mín caracteres
  - Mayúsculas
  - Números
  - Caracteres especiales
- [ ] Sanitizar inputs en todas las APIs
- [ ] Validar CORS por origen

#### Backend - Seguridad Headers
- [ ] Implementar headers de seguridad:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security (HSTS)
  - Content-Security-Policy

### ✅ ENTREGABLES FASE 5
✅ Panel de configuración funcional
✅ Sistema de auditoría completo
✅ Historial de eliminaciones
✅ Backup automático y manual
✅ Logs de actividad
✅ Rate limiting
✅ RLS policies avanzadas
✅ Headers de seguridad

### ✅ CRITERIOS DE ACEPTACIÓN
- ✅ Todas las configuraciones se guardan y persisten
- ✅ Logs registran todas las acciones
- ✅ Datos deletreados están en historial_eliminaciones
- ✅ Backup se descarga correctamente
- ✅ Rate limiting bloquea requests excesivos
- ✅ RLS policies protegen datos sensibles
- ✅ Headers de seguridad están presentes
- ✅ Pantalla logs es responsive
- ✅ Búsqueda y filtros funcionan
- ✅ Pruebas de email se envían

---

## 🚀 FASE 6: OPTIMIZACIÓN Y PULIDO (Semana 13-14)
### Objetivos Generales
- Optimización de performance
- Mejora de UX/UI
- Testing
- Preparación para deployment

### 📚 ANTES DE INICIAR ESTA FASE
**🎨 Frontend**: Buscar en mcpContext7 mejores prácticas para:
- Optimización de performance en React
- Core Web Vitals
- Lazy loading y code splitting
- Componentes accesibles en **mcpAceternityui** 🎨
- Testing de componentes
- SEO en Next.js

**🔧 Backend**: Buscar en mcpContext7 mejores prácticas para:
- Optimización de queries PostgreSQL
- Índices efectivos
- Caching estratégico
- Testing de APIs
- Load testing
- Seguridad avanzada

#### Frontend - Performance
- [ ] Code splitting:
  - Lazy load rutas con React.lazy()
  - Suspense para componentes dinámicos
- [ ] Image optimization:
  - Usar next/image
  - Optimizar formatos (WebP)
  - Lazy loading de imágenes
- [ ] Bundle analysis:
  - Analizar bundle size
  - Eliminar dependencias no usadas
- [ ] Caching:
  - Configurar cache headers
  - Usar TanStack Query staleTime
- [ ] Lighthouse audit:
  - Score > 90 en todas las categorías
  - Detectar y fijar issues

#### Frontend - UX/UI Polish
- [ ] Loading states:
  - Skeletons en lugar de spinners
  - Smooth transitions
  - Progressive loading
- [ ] Error handling:
  - Mensajes claros
  - Sugerencias de solución
  - Retry buttons
- [ ] Animaciones:
  - Transiciones suaves
  - Fade-in al cargar
  - Hover states
- [ ] Tooltips:
  - Información adicional
  - Accesibles con keyboard
- [ ] Validaciones refinadas:
  - Real-time feedback
  - Mensajes claros de error
  - Estilos visuales
- [ ] Accessibility:
  - ARIA labels
  - Keyboard navigation (Tab, Enter)
  - Color contrast (WCAG AA)
  - Screen reader test

#### Frontend - Responsive Design
- [ ] Verificar breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- [ ] Mobile optimizations:
  - Tabla → Cards en móvil
  - Sidebar colapsable/hamburger
  - Touch-friendly buttons (48px min)
  - Scroll smooth
- [ ] Tablet optimization:
  - Layout adaptable
  - Spacing correcto
- [ ] Desktop optimization:
  - Aprovechar espacio
  - Multi-column layouts

#### Frontend - Testing
- [ ] Setup testing framework (Jest + React Testing Library)
- [ ] Tests unitarios:
  - Componentes de formulario
  - Validaciones
  - Hooks personalizados
- [ ] Tests de integración:
  - Flujo de login
  - Flujo de registro
  - CRUD de jóvenes
  - Generación de reportes
- [ ] Tests de componentes:
  - Dashboard
  - Tablas con filtros
  - Modales
- [ ] Coverage > 70%

#### Frontend - Documentación
- [ ] README.md:
  - Descripción del proyecto
  - Instalación
  - Desarrollo
  - Build
  - Deploy
- [ ] CONTRIBUTING.md:
  - Guía de contribución
  - Estándares de código
- [ ] Documentación de componentes:
  - Storybook (opcional)
  - JSDoc en componentes
- [ ] Guía de uso para admins:
  - Screenshots
  - Steps por feature
  - FAQs

### 🔧 TAREAS BACKEND

#### Backend - Performance
- [ ] Índices en BD:
  - Verificar índices en columnas frecuentes
  - EXPLAIN ANALYZE en queries lentas
  - Crear índices faltantes
- [ ] Query optimization:
  - Evitar N+1 queries
  - Usar joins eficientes
  - Paginar resultados grandes
- [ ] Caching:
  - Redis (opcional, si es necesario)
  - Invalidación de cache
- [ ] Rate limiting:
  - Verificar límites adecuados
  - Ajustar si es necesario

#### Backend - Validaciones Robustas
- [ ] Validación en todas las APIs:
  - Input validation (type, range, format)
  - Output validation antes de return
  - Error messages útiles
- [ ] Business logic validation:
  - Cédula única (constraint + app logic)
  - Edad 12-35 años
  - Formatos de teléfono
  - Estados válidos

#### Backend - Error Handling
- [ ] Error responses estándar:
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 500 Internal Server Error
  - 429 Too Many Requests
- [ ] Error messages:
  - Mensaje claro
  - Código de error
  - Details (en desarrollo)
- [ ] Logging de errores:
  - Stack trace en logs
  - No exponer details en producción

#### Backend - Testing
- [ ] Tests de API:
  - Login/logout
  - Registro público
  - CRUD jóvenes
  - Reportes
  - Configuración
- [ ] Tests de validaciones:
  - Inputs inválidos
  - Boundary cases
  - SQL injection attempts
- [ ] Tests de RLS:
  - Usuario no puede ver datos de otros
  - Admin puede ver todo
- [ ] Integration tests:
  - Full flow de registro
  - Full flow de reporte
- [ ] Coverage > 70%

#### Backend - Documentación
- [ ] API Documentation:
  - Postman collection
  - OpenAPI/Swagger (opcional)
  - Endpoints documentados
  - Request/response examples
- [ ] BD Documentation:
  - Esquema visualizado
  - Relaciones explicadas
  - Índices documentados
- [ ] README del backend:
  - Setup
  - Migrations
  - Environment variables
  - Testing
  - Deployment

#### Backend - Seguridad Final
- [ ] OWASP Top 10 review:
  - SQL Injection: ✅ (prepared statements)
  - Authentication: ✅ (JWT + RLS)
  - Authorization: ✅ (RLS policies)
  - XSS: ✅ (input sanitization)
  - CSRF: ✅ (SameSite cookies)
  - Sensitive Data: ✅ (encryption + HTTPS)
  - XXE: ✅ (disabled by default)
  - Broken Access: ✅ (RLS)
  - SSRF: ✅ (validar URLs)
  - Deserialization: ✅ (validar JSON)
- [ ] Penetration test (básico):
  - Test SQL injection attempts
  - Test auth bypass
  - Test CORS issues

### 🔗 TAREAS CONJUNTAS (Frontend + Backend)

#### Integración Final
- [ ] Test completo de flujos:
  - Login → Dashboard → CRUD → Reportes
  - Registro público → Confirmación
  - Cumpleaños → WhatsApp
- [ ] Performance testing:
  - Timing de endpoints
  - Time to interactive (TTI)
  - Core Web Vitals
- [ ] Load testing (opcional):
  - Simular 100+ usuarios
  - Verificar comportamiento
- [ ] Browser compatibility:
  - Chrome, Firefox, Safari, Edge
  - Mobile browsers

### ✅ ENTREGABLES FASE 6
✅ Lighthouse score > 90
✅ Tests con coverage > 70%
✅ UI/UX pulida
✅ Responsive en todos los dispositivos
✅ Documentación completa
✅ Seguridad validada
✅ Performance optimizada
✅ Ready para producción

### ✅ CRITERIOS DE ACEPTACIÓN
- ✅ Lighthouse: Performance > 90, Accessibility > 90
- ✅ Mobile responsive (testeado en múltiples dispositivos)
- ✅ Carga inicial < 3 segundos
- ✅ First Contentful Paint < 1.8 segundos
- ✅ Tests passing 100%
- ✅ No console errors o warnings
- ✅ Documentación completa y actualizada
- ✅ Todos los features funcionando
- ✅ Sin bugs críticos conocidos
- ✅ Listo para ir a producción

---

## 📤 FASE 7: DEPLOYMENT (Semana 14 final)
### Objetivos Generales
- Publicar aplicación en producción
- Validar funcionamiento en producción
- Monitoreo y alertas

### 📚 ANTES DE INICIAR ESTA FASE
**🎨 Frontend**: Buscar en mcpContext7 mejores prácticas para:
- Deployment en Vercel
- Environment variables
- Monitoreo de errores (Sentry)
- Performance monitoring
- SEO para producción

**🔧 Backend**: Buscar en mcpContext7 mejores prácticas para:
- Deployment de Supabase
- Backup automático
- Monitoring y alertas
- Database migration strategies
- Production debugging

---

### 🎨 TAREAS FRONTEND

#### Frontend - Build y Deployment a Vercel
- [ ] Configurar repositorio GitHub
- [ ] Conectar GitHub a Vercel:
  - Importar proyecto
  - Configurar branch (main)
- [ ] Variables de entorno en Vercel:
  - NEXT_PUBLIC_SUPABASE_URL (prod)
  - NEXT_PUBLIC_SUPABASE_ANON_KEY (prod)
  - NEXT_PUBLIC_APP_URL (prod domain)
- [ ] Dominio personalizado (opcional):
  - Agregar dominio
  - Configurar DNS
  - Generar certificado SSL
- [ ] Build settings:
  - Node version
  - Build command: `npm run build`
  - Output directory: `.next`
- [ ] Preview deployment:
  - Test deployment previo a main
- [ ] Production deployment:
  - Deploy a main
  - Verificar build exit code = 0
- [ ] Post-deployment tests:
  - Verificar que carga la aplicación
  - Test login
  - Test formulario público
  - Test dashboard

#### Frontend - Monitoreo
- [ ] Sentry (error tracking):
  - Crear proyecto Sentry
  - Integrar SDK en Next.js
  - Configurar DSN en env vars
  - Capturar errores frontend
- [ ] Analytics (opcional):
  - Google Analytics o similar
  - Rastrear eventos principales
- [ ] Performance monitoring:
  - Configurar Web Vitals
  - Alertas si Core Web Vitals se degradan

### 🔧 TAREAS BACKEND

#### Backend - Supabase Producción
- [ ] Crear nuevo proyecto Supabase (producción):
  - Seleccionar región cercana
  - Crear base de datos vacía
- [ ] Migrar esquema a producción:
  - Correr migrations en prod
  - Verificar tablas creadas
  - Verificar RLS policies activas
- [ ] Variables de entorno:
  - NEXT_PUBLIC_SUPABASE_URL (prod)
  - NEXT_PUBLIC_SUPABASE_ANON_KEY (prod)
  - SUPABASE_SERVICE_ROLE_KEY (backend only, en Vercel)
- [ ] Configurar Supabase Auth (producción):
  - Confirmar provider (email)
  - URL de redirecto post-login
  - URL de confirmación de email
  - URL de reset de contraseña
- [ ] SSL/TLS:
  - Verificar que esté habilitado (siempre en Supabase)
  - Certificado válido

#### Backend - Datos Iniciales
- [ ] Seed de datos (opcional):
  - Crear usuarios admin iniciales
  - Crear plantillas de mensajes
  - Crear versículos bíblicos
- [ ] Configuración del sistema inicial:
  - Info del comité
  - Email notifications
  - Seguridad defaults

#### Backend - Backup y Seguridad
- [ ] Backup automático en Supabase:
  - Verificar que está habilitado
  - Configurar retención (30+ días)
- [ ] Credenciales seguras:
  - Service Role Key seguro (no en frontend)
  - JWT Secret configurado
  - API keys rotadas
- [ ] CORS en producción:
  - Configurar solo para dominio prod
  - Verificar headers

#### Backend - Monitoreo
- [ ] Logs en Supabase:
  - Acceso a PostgreSQL logs
  - Configurar alertas
- [ ] Database monitoring:
  - CPU usage
  - Memory usage
  - Connection count
  - Query performance
- [ ] Email service:
  - Verificar dominio (si usa SMTP custom)
  - SPF/DKIM/DMARC configurados

### 🔗 TAREAS CONJUNTAS

#### Pre-Launch Checklist
- [ ] Security audit final:
  - ✅ HTTPS en todo
  - ✅ Headers de seguridad
  - ✅ RLS activo
  - ✅ JWT validado
  - ✅ Rate limiting activo
  - ✅ Input validation
  - ✅ SQL injection protected
  - ✅ CORS correcto
- [ ] Funcionalidad audit:
  - ✅ Login funciona
  - ✅ Formulario público funciona
  - ✅ Dashboard funciona
  - ✅ CRUD funciona
  - ✅ Reportes funcionan
  - ✅ Cumpleaños funciona
  - ✅ WhatsApp funciona
  - ✅ Configuración funciona
  - ✅ Logs funcionan
- [ ] Performance audit:
  - ✅ Lighthouse > 90
  - ✅ FCP < 1.8s
  - ✅ LCP < 2.5s
  - ✅ CLS < 0.1
- [ ] Compatibility audit:
  - ✅ Chrome ✓
  - ✅ Firefox ✓
  - ✅ Safari ✓
  - ✅ Edge ✓
  - ✅ Mobile Chrome ✓
  - ✅ Mobile Safari ✓

#### Launch Day
- [ ] Final deployment:
  - Push a main branch
  - Vercel deploy automático
  - Esperar build success
  - Verificar status checks
- [ ] Post-launch tests:
  - Test login en producción
  - Test formulario público
  - Test CRUD
  - Test exportación
  - Verificar logs se capturan
  - Verificar emails se envían
- [ ] Monitoreo en vivo:
  - Ver Sentry errors (debe estar vacío)
  - Ver Vercel analytics
  - Ver database logs
  - Ver performance metrics
- [ ] Notificación al cliente:
  - Aplicación en vivo
  - URL de acceso
  - Credenciales admin
  - Documentación

#### Post-Launch (Primera Semana)
- [ ] Monitoreo intensivo:
  - Revisar Sentry 2x al día
  - Revisar logs de BD
  - Revisar Web Vitals
  - Revisar uptime
- [ ] Bug fixes rápidos:
  - Si hay errores críticos, hotfix en main
  - Rollback si es necesario
- [ ] Performance tuning:
  - Si hay issues, optimizar
- [ ] Backups:
  - Verificar que se ejecutan
  - Hacer backup manual
  - Guardar copia de seguridad

### ✅ ENTREGABLES FASE 7
✅ Aplicación en vivo en URL prod
✅ Dominio personalizado (si aplica)
✅ SSL/TLS habilitado
✅ Backup automático configurado
✅ Monitoreo activo
✅ Alertas configuradas
✅ Admin puede acceder y usar
✅ Documentación de acceso

### ✅ CRITERIOS DE ACEPTACIÓN
- ✅ Aplicación accesible en URL producción
- ✅ Login funciona en producción
- ✅ Todos los features funcionan
- ✅ Sin errores en Sentry
- ✅ Lighthouse score > 90
- ✅ Core Web Vitals pasan
- ✅ Uptime 99%+
- ✅ Backup automático activo
- ✅ Admin tiene credenciales
- ✅ Documentación entregada

---

## 📈 DEPENDENCIAS Y SECUENCIA PARALELA

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    AGENTE FRONTEND Y BACKEND EN PARALELO                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

FASE 1: SETUP (Semana 1-2)
├─ Frontend: Proyecto Next.js, dependencias, estructura
├─ Backend: Supabase, BD, RLS básico
└─ Sincronización: Variables de env, git, documentación

FASE 2: AUTH + REGISTRO (Semana 3-4)
├─ Frontend: Páginas login, formulario público, validaciones
├─ Backend: APIs auth, registro, email, RLS policies
└─ Sincronización: Endpoints testados, tipos TS compartidos

FASE 3: DASHBOARD + CRUD (Semana 5-7)
├─ Frontend: Dashboard, tabla, gráficos, CRUD UI, filtros
├─ Backend: APIs CRUD, queries optimizadas, audit log
└─ Sincronización: Integración, paginación, ordenamiento

FASE 4: CUMPLEAÑOS + REPORTES (Semana 8-10)
├─ Frontend: Módulo cumpleaños, plantillas, reportes, exportación
├─ Backend: APIs cumpleaños, reportes, export functions
└─ Sincronización: Formatos archivo, variables reemplazadas

FASE 5: CONFIG + AUDITORÍA (Semana 11-12)
├─ Frontend: Panel configuración, logs UI, gestión usuarios
├─ Backend: APIs config, audit log, backups, rate limiting
└─ Sincronización: Rutas protegidas, RLS policies

FASE 6: OPTIMIZACIÓN (Semana 13-14)
├─ Frontend: Performance, testing, responsive, docs
├─ Backend: Performance, testing, seguridad, docs
└─ Sincronización: Integration testing, load testing

FASE 7: DEPLOYMENT (Semana 14)
├─ Frontend: Vercel, dominio, monitoring
├─ Backend: Supabase prod, backups, alertas
└─ Sincronización: Testing post-launch, go-live
```

---

## 🔄 COMUNICACIÓN ENTRE AGENTES

### API Contract (Antes de Implementar)
- Ambos agentes deben acordar endpoints antes de implementar
- Estructura de requests/responses
- Códigos de error
- Authentication headers
- Rate limits

### Tipos TypeScript Compartidos
- Backend genera types desde esquema Supabase
- Frontend usa tipos en cliente HTTP
- Validaciones Zod en Frontend
- Validaciones en Backend

### Puntos de Integración Críticos
1. **Variables de Entorno**: Coordinar nombres y valores
2. **Esquema BD**: Backend comunica cambios a Frontend
3. **APIs**: Frontend espera endpoints específicos
4. **Errores**: Formato de error responses estándar
5. **Auth**: JWT y tokens deben ser compatibles
6. **RLS**: Frontend debe entender qué puede ver cada usuario

### Commits y Branches
- `main`: Código en producción
- `develop`: Rama de desarrollo conjunta
- `feature/*`: Ramas de feature
- `bugfix/*`: Ramas de bugfix
- Commits descriptivos: `feat(api): add joven endpoint`

### Daily Sync (Recomendado)
- 15 min diarios
- Blockers
- Cambios en APIs
- Issues encontrados
- Próximos pasos

---

## 🎯 FUNCIONALIDADES POR PRIORIDAD

### MVP (Semanas 1-7) - CRÍTICO
**Frontend:**
- ✅ Login
- ✅ Formulario público
- ✅ Dashboard
- ✅ Tabla de jóvenes
- ✅ CRUD básico

**Backend:**
- ✅ Autenticación
- ✅ BD con tablas
- ✅ APIs CRUD
- ✅ RLS policies
- ✅ Email notificaciones

### Versión 1.0 (Semanas 8-12) - ALTO
**Frontend:**
- ✅ Módulo cumpleaños
- ✅ Reportes
- ✅ Exportación
- ✅ Configuración
- ✅ Logs

**Backend:**
- ✅ APIs cumpleaños
- ✅ Reportes
- ✅ Funciones export
- ✅ Config APIs
- ✅ Audit log completo

### Optimización (Semanas 13-14) - ESPERADO
**Frontend:**
- ✅ Performance
- ✅ Testing
- ✅ Responsive
- ✅ Documentación

**Backend:**
- ✅ Performance
- ✅ Testing
- ✅ Seguridad
- ✅ Documentación

---

## 📋 COMANDOS Y HERRAMIENTAS POR AGENTE

### 🎨 Frontend Commands
```bash
# Setup
npm create next-app@latest --typescript

# Desarrollo
npm run dev              # Servidor dev (localhost:3000)
npm run build           # Build producción
npm run start           # Prod server
npm run lint            # ESLint check
npm run type-check      # TypeScript check

# Testing
npm run test            # Tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Deployment
# (Vercel automático en push a main)
```

### 🔧 Backend Commands
```bash
# Supabase CLI (instalar: npm install -g supabase)
supabase init               # Inicializar
supabase link               # Conectar a proyecto
supabase db pull            # Sacar schema local
supabase db push            # Empujar schema a prod
supabase migrations new     # Crear migration

# Desarrollo
supabase start              # Emulador local
supabase stop

# Backup
supabase db dump > backup.sql

# Testing (en Vercel o local)
curl http://localhost:3000/api/...
```

---

## 📞 PROTOCOLO DE ESCALATION

Si hay bloqueo entre Frontend y Backend:

1. **Problema**: Agente se siente bloqueado
2. **Investigación**: Qué se necesita exactamente
3. **Alternativa**: Crear mock/stub temporal
4. **Plan**: Cuándo se resuelve
5. **Acción**: Continuar con otro feature

Ejemplo:
- Frontend espera API de cumpleaños
- Backend aún no la implementó
- Frontend crea un mock que retorna datos hardcodeados
- Backend implementa API
- Frontend integra API real

---

## 📝 DOCUMENTACIÓN A MANTENER ACTUALIZADA

### Conjunta
- `README.md` - Descripción general
- `SETUP.md` - Instrucciones de setup
- `API.md` - Documentación de APIs (si no usa Swagger)
- `GIT.md` - Guía de branches y commits

### Frontend
- `FRONTEND.md` - Setup, desarrollo, build
- `COMPONENTES.md` - Componentes principales
- `HOOKS.md` - Hooks personalizados

### Backend
- `BACKEND.md` - Setup, desarrollo, testing
- `SCHEMA.md` - Esquema de BD
- `RLS_POLICIES.md` - RLS policies documentadas

---

## ⚠️ RIESGOS COMUNES Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|-----------|
| Desincronización BD | Media | Alto | Daily sync, schema versionado |
| API endpoints incompatibles | Media | Alto | API contract antes de código |
| Conflictos en git | Baja | Medio | Ramas por feature, commits frecuentes |
| Performance degradada | Media | Alto | Testing de carga en Fase 6 |
| Security vulnerabilities | Baja | Muy Alto | Security review, OWASP checks |
| Variables de env incorrectas | Baja | Medio | Documentación, .env.example |
| Deployment fallido | Baja | Alto | Pre-launch checklist |

---

## 💰 ESTIMACIÓN DE ESFUERZO

| Fase | Frontend (horas) | Backend (horas) | Total |
|------|------------------|-----------------|-------|
| 1: Setup | 16 | 24 | 40 |
| 2: Auth | 32 | 40 | 72 |
| 3: Dashboard | 48 | 56 | 104 |
| 4: Reportes | 40 | 48 | 88 |
| 5: Config | 32 | 40 | 72 |
| 6: Optimización | 32 | 24 | 56 |
| 7: Deploy | 16 | 16 | 32 |
| **TOTAL** | **216 horas** | **248 horas** | **464 horas** |

**Total de semanas con 1 dev Frontend + 1 dev Backend:** ~14 semanas (5.5h/día c/u)

---

## 📊 CHECKLIST FINAL

### Antes de Fase 1
- [ ] Repositorio Git creado
- [ ] Acceso a Vercel (Frontend)
- [ ] Acceso a Supabase (Backend)
- [ ] Ambos agentes tienen credenciales
- [ ] Comunicación establecida (Slack, Discord, etc.)

### Entre Fases
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Code review
- [ ] Merge a develop
- [ ] Deploy a staging (si aplica)

### Antes de Producción
- [ ] Security review completado
- [ ] Performance audit completado
- [ ] Tests con coverage > 70%
- [ ] Documentación completa
- [ ] Backup de BD creado
- [ ] Rollback plan preparado

---

## ✅ CHECKLIST DE ESTADO DE FASES

### Estado de Implementación

- [ ] **FASE 1**: SETUP Y INFRAESTRUCTURA
  - [ ] Frontend: Proyecto Next.js + dependencias ✅
  - [ ] Backend: Supabase + BD + RLS ✅
  - [ ] **Estado**: 🔴 No iniciada | 🟡 En progreso | 🟢 Completada

- [ ] **FASE 2**: AUTENTICACIÓN Y FORMULARIO PÚBLICO
  - [ ] Frontend: Login + Formulario público ✅
  - [ ] Backend: APIs Auth + Registro ✅
  - [ ] **Estado**: 🔴 No iniciada | 🟡 En progreso | 🟢 Completada

- [ ] **FASE 3**: DASHBOARD Y GESTIÓN BÁSICA
  - [ ] Frontend: Dashboard + CRUD + Tablas ✅
  - [ ] Backend: APIs CRUD + Queries optimizadas ✅
  - [ ] **Estado**: 🔴 No iniciada | 🟡 En progreso | 🟢 Completada

- [ ] **FASE 4**: CUMPLEAÑOS Y REPORTES
  - [ ] Frontend: Cumpleaños + Plantillas + Reportes ✅
  - [ ] Backend: APIs cumpleaños + Reportes + Export ✅
  - [ ] **Estado**: 🔴 No iniciada | 🟡 En progreso | 🟢 Completada

- [ ] **FASE 5**: CONFIGURACIÓN Y AUDITORÍA
  - [ ] Frontend: Panel config + Logs UI ✅
  - [ ] Backend: APIs config + Audit log + Backups ✅
  - [ ] **Estado**: 🔴 No iniciada | 🟡 En progreso | 🟢 Completada

- [ ] **FASE 6**: OPTIMIZACIÓN Y PULIDO
  - [ ] Frontend: Performance + Testing + Responsive ✅
  - [ ] Backend: Performance + Testing + Docs ✅
  - [ ] **Estado**: 🔴 No iniciada | 🟡 En progreso | 🟢 Completada

- [ ] **FASE 7**: DEPLOYMENT
  - [ ] Frontend: Vercel + Monitoreo ✅
  - [ ] Backend: Supabase prod + Alertas ✅
  - [ ] **Estado**: 🔴 No iniciada | 🟡 En progreso | 🟢 Completada

---

## 📍 COMO MARCAR UNA FASE COMO COMPLETADA

### 📋 Checklist de Finalización por Fase

#### ✅ Antes de marcar como COMPLETADA:

1. **Todos los checkboxes de tareas están marcados** ✓
2. **Entregables están listos** ✓
3. **Criterios de aceptación se cumplen** ✓
4. **Testing está OK** ✓
5. **Code review pasó** ✓
6. **Documentación actualizada** ✓
7. **Merge a develop/main completado** ✓

#### 🎨 Frontend
- [ ] Todas las tareas completadas
- [ ] Componentes de mcpAceternityui usados cuando aplica
- [ ] Responsivo en todos los dispositivos
- [ ] Sin console errors o warnings
- [ ] Tests unitarios pasan (si aplica)
- [ ] Lighthouse score > 90 (si aplica)
- [ ] Documentación interna actualizada

#### 🔧 Backend
- [ ] Todas las APIs implementadas
- [ ] Mejores prácticas de mcpContext7 aplicadas
- [ ] Tests de API pasan
- [ ] RLS policies validadas
- [ ] Performance OK (queries < 200ms)
- [ ] Seguridad validada
- [ ] Documentación de API actualizada

#### 🤝 Integración
- [ ] Frontend ↔ Backend integrados
- [ ] API contract cumplido
- [ ] Types TypeScript sincronizados
- [ ] Testing end-to-end OK

### 📝 Template para marcar Fase Completada

```
🎉 FASE X COMPLETADA ✅

**Fecha**: [Fecha]
**Agente Frontend**: [Nombre]
**Agente Backend**: [Nombre]

**Resumen de cambios**:
- Tarea 1 ✅
- Tarea 2 ✅
- Tarea 3 ✅

**Métricas**:
- Performance: ✓
- Testing: ✓
- Security: ✓
- Documentación: ✓

**Próxima Fase**: FASE X+1
**Iniciar**: [Fecha]
```

---

**Última actualización**: 19 de Enero, 2026
**Versión**: 2.1 (Con mcpContext7 + mcpAceternityui)
**Próxima revisión**: Semana 1 Post-Launch
