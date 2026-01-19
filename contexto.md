📋 REQUISITOS DEL SISTEMA - VERSIÓN RESUMIDA
Comité de CONQUISTADORES PENTECOSTALES

1️⃣ INFORMACIÓN GENERAL
Descripción: Sistema web responsive para gestión de jóvenes con formulario público y panel administrativo.
Objetivos:

Centralizar información de jóvenes
Facilitar registro público
Gestionar datos
Generar reportes
Automatizar felicitaciones por WhatsApp


2️⃣ MÓDULOS PRINCIPALES
A. FORMULARIO PÚBLICO
Campos:

Nombre completo*
Fecha de nacimiento*
Edad (auto-calculada)
Cédula* (única)
Celular* (+57XXXXXXXXXX)
Checkboxes: Bautizado, Sellado, Servidor, Simpatizante
Consentimientos* (4 checkboxes obligatorios)

Validaciones:

Cédula única
Edad: 12-35 años
Formato celular válido
Todos los consentimientos requeridos

Flujo:

Usuario completa formulario
Acepta consentimientos
Submit → Validación
Pantalla de confirmación exitosa
Notificación a admins


B. AUTENTICACIÓN
Login:

Email + contraseña
Recordarme
Recuperar contraseña

Seguridad:

Supabase Auth (JWT)
Sesión: 24 horas
Contraseña fuerte requerida


C. DASHBOARD
Métricas principales:

Total jóvenes
Bautizados/Sellados/Servidores (%)
Cumpleaños del mes

Gráficos:

Distribución por edad (barras)
Estado espiritual (dona)
Crecimiento mensual (línea)

Widgets:

Cumpleaños de hoy (lista rápida)
Actividad reciente
Próximos cumpleaños


D. GESTIÓN DE JÓVENES
Lista:

Tabla con: Nombre, Edad, Cédula, Celular, Estados, Grupo
Búsqueda global
Filtros: edad, estados, grupo, mes cumpleaños
Paginación (10/25/50/100)
Ordenamiento por columnas

CRUD:

✅ Crear joven (manual)
✅ Ver detalle completo
✅ Editar información
✅ Eliminar (confirmación estricta)
✅ Asignar a grupo

Acciones:

Ver, Editar, Eliminar
Exportar seleccionados
Enviar a WhatsApp


E. MÓDULO DE CUMPLEAÑOS 🎂
Secciones:

Hoy: Lista de cumpleañeros del día
Esta semana: Vista por días
Este mes: Contador y calendario
Próximos 30 días: Lista ordenada

Envío de mensajes:

Botón "Enviar Felicitación" individual
Envío masivo diario
Modal de previsualización editable
Integración WhatsApp Web
Registro de envíos en BD

Plantilla predeterminada:
🎉 ¡FELIZ CUMPLEAÑOS {NOMBRE}! 🎂

Que Dios bendiga grandemente tu vida en este nuevo año. 
El Comité de CONQUISTADORES PENTECOSTALES te desea un 
día lleno de alegría y muchas bendiciones.

[Versículo bíblico]

¡Celebramos contigo! 🎈🙏

- Comité de Conquistadores Pentecostales
Variables: {NOMBRE}, {EDAD}, {FECHA}
Gestión:

Editor de plantillas
Múltiples plantillas por rango edad
Historial de mensajes enviados
Calendario visual mensual


F. GRUPOS/CÉLULAS
Gestión:

Crear/editar/eliminar grupos
Asignar líder
Agregar/quitar integrantes
Ver estadísticas por grupo

Vista de grupo:

Lista de integrantes
Estadísticas (edad promedio, estados)
Exportar lista
Enviar mensaje grupal


G. REPORTES
Tipos disponibles:

General: Todas las estadísticas y gráficos
Por edad: Distribución en rangos (12-15, 16-18, 19-25, 26-30, 31-35)
Estado espiritual: Por categoría (bautizados, sellados, etc.)
Cumpleaños: Por mes, calendario anual
Por grupos: Composición y comparativas
Crecimiento: Tendencias últimos 12 meses
Personalizado: Con filtros específicos

Exportación:

📊 Excel (.xlsx)
📄 PDF (diseño profesional)
📋 CSV (datos crudos)
🖨️ Imprimir


H. CONFIGURACIÓN
Secciones:

General:

Info del comité
Logo
Configuración de registro público
Edades permitidas


Notificaciones:

Emails de admins
Activar/desactivar notificaciones
Horarios de envío


WhatsApp:

Código de país
Formato de número
Validaciones


Plantillas de Email:

Bienvenida
Recuperación contraseña
Notificaciones


Backup:

Backup automático diario
Descarga manual
Historial de backups


Seguridad:

Tiempo de sesión
Intentos de login
Contraseña fuerte




3️⃣ BASE DE DATOS
Tablas principales:

jovenes

id, nombre_completo, fecha_nacimiento, edad (calculada)
cedula (única), celular
bautizado, sellado, servidor, simpatizante (boolean)
grupo_id
consentimiento_datos, consentimiento_whatsapp, fecha_consentimiento
created_at, updated_at, created_by, updated_by


users

id (FK a auth.users)
nombre_completo, telefono, email
estado, ultima_sesion


grupos

id, nombre, descripcion
lider_id


mensajes_cumpleanos

id, joven_id, mensaje_enviado
fecha_envio, estado, enviado_por
numero_destino


plantillas_mensajes

id, nombre, tipo
rango_edad_min, rango_edad_max
contenido, es_default, activa


versiculos

id, texto, cita, activo


actividad_usuarios (audit log)

id, usuario_id, accion, tabla_afectada
registro_id, detalles (JSONB)
ip_address, user_agent, created_at


configuracion_sistema

id, clave, valor (JSONB)
descripcion, updated_at, updated_by


historial_eliminaciones

id, tabla, registro_id
datos_eliminados (JSONB)
eliminado_por, motivo, fecha_eliminacion



Seguridad:

Row Level Security (RLS) en todas las tablas
Policies por usuario
Triggers para audit log
Auto-update de updated_at


4️⃣ STACK TECNOLÓGICO
Frontend:

Next.js 14+ (App Router)
React 18+
TypeScript
Tailwind CSS
shadcn/ui (componentes)
React Hook Form + Zod
Tanstack Query
Recharts (gráficos)
date-fns

Backend:

Supabase (Auth + DB + Storage)
PostgreSQL
Row Level Security

Exportación:

xlsx (Excel)
jspdf + jspdf-autotable (PDF)

Notificaciones:

Sonner (toasts)


5️⃣ PALETA DE COLORES
Principales:
- Azul Marino: #1B3B6F
- Azul Celeste: #4A90E2
- Dorado/Amarillo: #F5B041
- Blanco: #FFFFFF
- Gris Claro: #F8F9FA
- Gris Texto: #6C757D

Estados:
- Éxito: #28A745
- Error: #DC3545
- Advertencia: #FFC107
- Info: #17A2B8
- WhatsApp: #25D366

6️⃣ CARACTERÍSTICAS CLAVE
Responsive:

Mobile-first
Breakpoints: sm(640), md(768), lg(1024), xl(1280)
Tablas → Cards en móvil
Sidebar colapsable

Seguridad:

JWT tokens
RLS policies
Audit logging
Validación frontend + backend
Sanitización de datos
CORS configurado
Rate limiting

UX:

Loading states
Error handling
Confirmaciones para acciones críticas
Toasts para feedback
Tooltips informativos
Teclado accesible

Performance:

Server Components
Code splitting
Lazy loading
Paginación
Índices en BD
Caching con React Query


7️⃣ FLUJOS PRINCIPALES
Registro público:
Usuario → Formulario → Validación → BD → Confirmación → Notificación admins
Felicitación cumpleaños:
Admin → Lista cumpleaños → Click enviar → Modal preview → WhatsApp Web → Registro BD → Toast confirmación
Generar reporte:
Admin → Seleccionar tipo → Filtros → Generar → Visualizar → Exportar (Excel/PDF/CSV)

8️⃣ DEPLOYMENT
Hosting:

Frontend: Vercel
Backend: Supabase

Variables de entorno:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL