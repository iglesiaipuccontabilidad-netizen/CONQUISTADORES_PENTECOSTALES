// supabase/functions/auth/index.ts - Edge Function para Autenticación
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// ============================================
// UTILIDADES
// ============================================

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message, status: 'error' }, status)
}

// Validaciones
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): boolean {
  // Al menos 8 caracteres, mayúscula, número
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

function validateCelular(celular: string): boolean {
  return /^\+57\d{10}$/.test(celular)
}

function validateCedula(cedula: string): boolean {
  return /^\d{8,10}$/.test(cedula)
}

// ============================================
// MAIN HANDLER
// ============================================

Deno.serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const url = new URL(req.url)
  const path = url.pathname

  try {
    // LOGIN
    if (path.includes('auth/login') && req.method === 'POST') {
      const { email, password } = await req.json()

      if (!email || !validateEmail(email)) {
        return errorResponse('Email inválido', 400)
      }
      if (!password) {
        return errorResponse('Contraseña requerida', 400)
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return errorResponse('Credenciales inválidas', 401)
      }

      // Actualizar última_sesión
      await supabase
        .from('users')
        .update({ ultima_sesion: new Date().toISOString() })
        .eq('id', data.user?.id)

      // Log activity
      await supabase.rpc('log_activity', {
        p_usuario_id: data.user?.id,
        p_accion: 'LOGIN',
        p_tabla_afectada: 'users',
        p_registro_id: data.user?.id,
      })

      return jsonResponse({
        status: 'success',
        user: data.user,
        session: data.session,
      })
    }

    // RECUPERAR CONTRASEÑA
    if (path.includes('auth/recuperar') && req.method === 'POST') {
      const { email } = await req.json()

      if (!email || !validateEmail(email)) {
        return errorResponse('Email inválido', 400)
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        return errorResponse('Error procesando solicitud', 500)
      }

      return jsonResponse({
        status: 'success',
        message: 'Email de recuperación enviado',
      })
    }

    // ME (usuario autenticado)
    if (path.includes('auth/me') && req.method === 'GET') {
      const token = req.headers.get('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return errorResponse('Token requerido', 401)
      }

      const { data, error } = await supabase.auth.getUser(token)

      if (error || !data.user) {
        return errorResponse('Token inválido', 401)
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      return jsonResponse({ status: 'success', user: userData })
    }

    // REGISTRAR JOVEN
    if (path.includes('joven/registro') && req.method === 'POST') {
      const body = await req.json()
      const {
        nombre_completo,
        fecha_nacimiento,
        cedula,
        celular,
        grupo_id,
        bautizado,
        sellado,
        servidor,
        simpatizante,
        consentimiento_datos_personales,
        consentimiento_whatsapp,
        consentimiento_procesamiento,
        consentimiento_terminos,
      } = body

      // Validaciones
      if (!nombre_completo?.trim() || nombre_completo.length < 3) {
        return errorResponse('Nombre inválido', 400)
      }

      if (!cedula || !validateCedula(cedula)) {
        return errorResponse('Cédula inválida', 400)
      }

      if (!celular || !validateCelular(celular)) {
        return errorResponse('Celular inválido (formato: +57XXXXXXXXXX)', 400)
      }

      // Validar edad
      const edad =
        new Date().getFullYear() - new Date(fecha_nacimiento).getFullYear()
      if (edad < 12 || edad > 35) {
        return errorResponse('Edad debe estar entre 12-35 años', 400)
      }

      // Validar consentimientos
      if (
        !consentimiento_datos_personales ||
        !consentimiento_whatsapp ||
        !consentimiento_procesamiento ||
        !consentimiento_terminos
      ) {
        return errorResponse('Todos los consentimientos son requeridos', 400)
      }

      // Verificar cédula única
      const { data: existingJoven } = await supabase
        .from('jovenes')
        .select('id')
        .eq('cedula', cedula)
        .maybeSingle()

      if (existingJoven) {
        return errorResponse('Cédula ya registrada', 409)
      }

      // Insertar joven
      const { data: newJoven, error: insertError } = await supabase
        .from('jovenes')
        .insert([
          {
            nombre_completo: nombre_completo.trim(),
            fecha_nacimiento,
            cedula,
            celular,
            grupo_id,
            bautizado: bautizado || false,
            sellado: sellado || false,
            servidor: servidor || false,
            simpatizante: simpatizante || false,
            consentimiento_datos_personales,
            consentimiento_whatsapp,
            consentimiento_procesamiento,
            consentimiento_terminos,
            estado: 'activo',
          },
        ])
        .select()
        .single()

      if (insertError) {
        return errorResponse('Error al registrar joven', 500)
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_usuario_id: '00000000-0000-0000-0000-000000000000',
        p_accion: 'CREATE',
        p_tabla_afectada: 'jovenes',
        p_registro_id: newJoven?.id,
      })

      return jsonResponse(
        {
          status: 'success',
          message: 'Joven registrado exitosamente',
          joven: newJoven,
        },
        201
      )
    }

    // VALIDAR CÉDULA
    if (path.includes('joven/cedula') && req.method === 'GET') {
      const cedula = path.split('/').pop()

      if (!cedula || !validateCedula(cedula)) {
        return errorResponse('Cédula inválida', 400)
      }

      const { data: existingJoven } = await supabase
        .from('jovenes')
        .select('id')
        .eq('cedula', cedula)
        .maybeSingle()

      return jsonResponse({
        status: 'success',
        cedula,
        existe: !!existingJoven,
      })
    }

    // GET /api/jovenes - LISTAR TODOS LOS JÓVENES
    if (path.includes('/api/jovenes') && !path.includes('/cedula') && req.method === 'GET') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]
      
      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      // Verificar token
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Obtener usuario actual
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol, id')
        .eq('id', user.id)
        .single()

      if (!currentUser) {
        return errorResponse('Usuario no encontrado', 404)
      }

      let query = supabase
        .from('jovenes')
        .select('id, nombre_completo, fecha_nacimiento, cedula, celular, grupo_id, estado, bautizado, sellado, servidor, simpatizante, created_at')
        .eq('estado', 'activo')
        .order('nombre_completo')

      // Si es líder, solo ve su grupo
      if (currentUser.rol === 'lider') {
        const { data: grupo } = await supabase
          .from('grupos')
          .select('id')
          .eq('lider_id', user.id)
          .single()

        if (grupo) {
          query = query.eq('grupo_id', grupo.id)
        }
      }

      const { data: jovenes, error } = await query

      if (error) {
        return errorResponse('Error al obtener jóvenes', 500)
      }

      return jsonResponse({
        status: 'success',
        count: jovenes?.length || 0,
        jovenes: jovenes || [],
      })
    }

    // GET /api/jovenes/:id - VER DETALLES DE UN JOVEN
    if (path.match(/\/api\/jovenes\/[a-f0-9-]+$/) && req.method === 'GET') {
      const joven_id = path.split('/').pop()
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      const { data: joven, error } = await supabase
        .from('jovenes')
        .select('*')
        .eq('id', joven_id)
        .single()

      if (error || !joven) {
        return errorResponse('Joven no encontrado', 404)
      }

      return jsonResponse({
        status: 'success',
        joven,
      })
    }

    // POST /api/grupos - CREAR NUEVO GRUPO
    if (path.includes('/api/grupos') && req.method === 'POST') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Verificar que sea admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden crear grupos', 403)
      }

      const { nombre, descripcion, lider_id } = await req.json()

      if (!nombre || nombre.trim().length < 3) {
        return errorResponse('Nombre del grupo inválido (mínimo 3 caracteres)', 400)
      }

      if (!lider_id) {
        return errorResponse('Líder del grupo requerido', 400)
      }

      // Verificar que el líder existe
      const { data: lider } = await supabase
        .from('users')
        .select('id')
        .eq('id', lider_id)
        .single()

      if (!lider) {
        return errorResponse('Líder no encontrado', 404)
      }

      const { data: newGrupo, error } = await supabase
        .from('grupos')
        .insert([
          {
            nombre: nombre.trim(),
            descripcion: descripcion || null,
            lider_id,
            estado: 'activo',
          },
        ])
        .select()
        .single()

      if (error) {
        return errorResponse('Error al crear grupo', 500)
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_usuario_id: user.id,
        p_accion: 'CREATE',
        p_tabla_afectada: 'grupos',
        p_registro_id: newGrupo?.id,
      })

      return jsonResponse(
        {
          status: 'success',
          message: 'Grupo creado exitosamente',
          grupo: newGrupo,
        },
        201
      )
    }

    // GET /api/dashboard/metrics - ESTADÍSTICAS
    if (path.includes('/api/dashboard/metrics') && req.method === 'GET') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Verificar que sea admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden ver métricas', 403)
      }

      // Total jóvenes
      const { count: total_jovenes } = await supabase
        .from('jovenes')
        .select('id', { count: 'exact' })
        .eq('estado', 'activo')

      // Total grupos
      const { count: total_grupos } = await supabase
        .from('grupos')
        .select('id', { count: 'exact' })
        .eq('estado', 'activo')

      // Actividad hoy
      const today = new Date().toISOString().split('T')[0]
      const { count: actividad_hoy } = await supabase
        .from('actividad_usuarios')
        .select('id', { count: 'exact' })
        .like('created_at', `${today}%`)

      // Últimas acciones
      const { data: ultimas_acciones } = await supabase
        .from('actividad_usuarios')
        .select('id, accion, tabla_afectada, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      return jsonResponse({
        status: 'success',
        metrics: {
          total_jovenes: total_jovenes || 0,
          total_grupos: total_grupos || 0,
          actividad_hoy: actividad_hoy || 0,
          ultimas_acciones: ultimas_acciones || [],
        },
      })
    }

    // PUT /api/jovenes/:id - ACTUALIZAR JOVEN
    if (path.match(/\/api\/jovenes\/[a-f0-9-]+$/) && req.method === 'PUT') {
      const joven_id = path.split('/').pop()
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      const updateData = await req.json()

      // Solo admin puede actualizar
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden actualizar jóvenes', 403)
      }

      const { data: updatedJoven, error } = await supabase
        .from('jovenes')
        .update(updateData)
        .eq('id', joven_id)
        .select()
        .single()

      if (error) {
        return errorResponse('Error al actualizar joven', 500)
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_usuario_id: user.id,
        p_accion: 'UPDATE',
        p_tabla_afectada: 'jovenes',
        p_registro_id: joven_id,
      })

      return jsonResponse({
        status: 'success',
        message: 'Joven actualizado exitosamente',
        joven: updatedJoven,
      })
    }

    // DELETE /api/jovenes/:id - ELIMINAR JOVEN
    if (path.match(/\/api\/jovenes\/[a-f0-9-]+$/) && req.method === 'DELETE') {
      const joven_id = path.split('/').pop()
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Solo admin puede eliminar
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden eliminar jóvenes', 403)
      }

      // Soft delete - marcar como eliminado
      const { data: deletedJoven, error } = await supabase
        .from('jovenes')
        .update({ estado: 'eliminado' })
        .eq('id', joven_id)
        .select()
        .single()

      if (error) {
        return errorResponse('Error al eliminar joven', 500)
      }

      // Log deletion
      await supabase.rpc('log_deletion', {
        p_usuario_id: user.id,
        p_tabla_afectada: 'jovenes',
        p_registro_id: joven_id,
      })

      return jsonResponse({
        status: 'success',
        message: 'Joven eliminado exitosamente',
      })
    }

    // GET /api/grupos - LISTAR GRUPOS
    if (path.includes('/api/grupos') && !path.includes('/cedula') && req.method === 'GET') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      const { data: grupos, error } = await supabase
        .from('grupos')
        .select('id, nombre, descripcion, lider_id, estado, created_at')
        .eq('estado', 'activo')
        .order('nombre')

      if (error) {
        return errorResponse('Error al obtener grupos', 500)
      }

      return jsonResponse({
        status: 'success',
        count: grupos?.length || 0,
        grupos: grupos || [],
      })
    }

    // GET /api/usuarios - LISTAR USUARIOS CON FILTROS
    if (path.includes('/api/usuarios') && !path.includes('/cedula') && req.method === 'GET') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Verificar que sea admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden ver usuarios', 403)
      }

      // Parámetros de filtro
      const urlParams = new URL(req.url).searchParams
      const rol = urlParams.get('rol')
      const estado = urlParams.get('estado')
      const search = urlParams.get('search')

      let query = supabase
        .from('users')
        .select('id, email, nombre_completo, telefono, rol, estado, ultima_sesion, created_at')
        .order('nombre_completo')

      if (rol) {
        query = query.eq('rol', rol)
      }

      if (estado) {
        query = query.eq('estado', estado)
      }

      const { data: usuarios, error } = await query

      if (error) {
        return errorResponse('Error al obtener usuarios', 500)
      }

      // Filtrar por búsqueda si se proporciona
      let filtered = usuarios || []
      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(u =>
          u.email?.toLowerCase().includes(searchLower) ||
          u.nombre_completo?.toLowerCase().includes(searchLower)
        )
      }

      return jsonResponse({
        status: 'success',
        count: filtered.length,
        usuarios: filtered,
      })
    }

    // GET /api/usuarios/:id - VER DETALLES DE UN USUARIO
    if (path.match(/\/api\/usuarios\/[a-f0-9-]+$/) && req.method === 'GET') {
      const usuario_id = path.split('/').pop()
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Solo admin o el usuario mismo puede ver detalles
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin' && user.id !== usuario_id) {
        return errorResponse('No tienes permiso', 403)
      }

      const { data: usuario, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', usuario_id)
        .single()

      if (error || !usuario) {
        return errorResponse('Usuario no encontrado', 404)
      }

      return jsonResponse({
        status: 'success',
        usuario,
      })
    }

    // POST /api/usuarios - CREAR USUARIO MANUAL
    if (path.includes('/api/usuarios') && !path.includes('/cedula') && req.method === 'POST') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Verificar que sea admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden crear usuarios', 403)
      }

      const { email, password, nombre_completo, telefono, rol } = await req.json()

      if (!email || !validateEmail(email)) {
        return errorResponse('Email inválido', 400)
      }

      if (!password || !validatePassword(password)) {
        return errorResponse('Contraseña debe tener 8+ caracteres, mayúscula y número', 400)
      }

      if (!nombre_completo || nombre_completo.trim().length < 3) {
        return errorResponse('Nombre completo inválido', 400)
      }

      const validRoles = ['admin', 'lider', 'usuario', 'visitante']
      if (!rol || !validRoles.includes(rol)) {
        return errorResponse('Rol inválido', 400)
      }

      // Crear usuario en auth.users
      const { data: authData, error: authCreateError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authCreateError) {
        return errorResponse(authCreateError.message, 400)
      }

      // Crear usuario en tabla users
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user?.id,
            email,
            nombre_completo: nombre_completo.trim(),
            telefono: telefono || null,
            rol,
            estado: 'activo',
          },
        ])
        .select()
        .single()

      if (createError) {
        return errorResponse('Error al crear usuario', 500)
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_usuario_id: user.id,
        p_accion: 'CREATE',
        p_tabla_afectada: 'users',
        p_registro_id: newUser?.id,
      })

      return jsonResponse(
        {
          status: 'success',
          message: 'Usuario creado exitosamente',
          usuario: newUser,
        },
        201
      )
    }

    // PUT /api/usuarios/:id - ACTUALIZAR USUARIO
    if (path.match(/\/api\/usuarios\/[a-f0-9-]+$/) && req.method === 'PUT') {
      const usuario_id = path.split('/').pop()
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Verificar que sea admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden actualizar usuarios', 403)
      }

      const updateData = await req.json()

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', usuario_id)
        .select()
        .single()

      if (error) {
        return errorResponse('Error al actualizar usuario', 500)
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_usuario_id: user.id,
        p_accion: 'UPDATE',
        p_tabla_afectada: 'users',
        p_registro_id: usuario_id,
      })

      return jsonResponse({
        status: 'success',
        message: 'Usuario actualizado exitosamente',
        usuario: updatedUser,
      })
    }

    // DELETE /api/usuarios/:id - ELIMINAR USUARIO
    if (path.match(/\/api\/usuarios\/[a-f0-9-]+$/) && req.method === 'DELETE') {
      const usuario_id = path.split('/').pop()
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Verificar que sea admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden eliminar usuarios', 403)
      }

      // Soft delete - marcar como eliminado
      const { data: deletedUser, error } = await supabase
        .from('users')
        .update({ estado: 'eliminado' })
        .eq('id', usuario_id)
        .select()
        .single()

      if (error) {
        return errorResponse('Error al eliminar usuario', 500)
      }

      // Log deletion
      await supabase.rpc('log_deletion', {
        p_usuario_id: user.id,
        p_tabla_afectada: 'users',
        p_registro_id: usuario_id,
      })

      return jsonResponse({
        status: 'success',
        message: 'Usuario eliminado exitosamente',
      })
    }

    // GET /api/jovenes/search - BÚSQUEDA AVANZADA
    if (path.includes('/api/jovenes/search') && req.method === 'GET') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Query parameters
      const search = url.searchParams.get('q') || ''
      const grupo_id = url.searchParams.get('grupo_id')
      const estado_bautizado = url.searchParams.get('bautizado')
      const estado_sellado = url.searchParams.get('sellado')
      const estado_servidor = url.searchParams.get('servidor')
      const mes_nacimiento = url.searchParams.get('mes')
      const limit = parseInt(url.searchParams.get('limit') || '50', 10)
      const offset = parseInt(url.searchParams.get('offset') || '0', 10)

      let query = supabase
        .from('jovenes')
        .select('id, nombre_completo, cedula, celular, fecha_nacimiento, grupo_id, bautizado, sellado, servidor, simpatizante, estado, created_at', { count: 'exact' })
        .eq('estado', 'activo')

      // Búsqueda por nombre o cédula
      if (search) {
        query = query.or(`nombre_completo.ilike.%${search}%,cedula.ilike.%${search}%,celular.ilike.%${search}%`)
      }

      // Filtro por grupo
      if (grupo_id) {
        query = query.eq('grupo_id', grupo_id)
      }

      // Filtros por estado
      if (estado_bautizado === 'true') query = query.eq('bautizado', true)
      if (estado_bautizado === 'false') query = query.eq('bautizado', false)

      if (estado_sellado === 'true') query = query.eq('sellado', true)
      if (estado_sellado === 'false') query = query.eq('sellado', false)

      if (estado_servidor === 'true') query = query.eq('servidor', true)
      if (estado_servidor === 'false') query = query.eq('servidor', false)

      // Filtro por mes de nacimiento
      if (mes_nacimiento) {
        // Se filtra al obtener (en aplicación frontend o manual aquí)
        // Por simplicidad, se retorna todo y el frontend filtra
      }

      // Paginación
      const { data: jovenes, error, count } = await query
        .order('nombre_completo')
        .range(offset, offset + limit - 1)

      if (error) {
        return errorResponse('Error en búsqueda', 500)
      }

      return jsonResponse({
        status: 'success',
        count: count || 0,
        limit,
        offset,
        jovenes: jovenes || [],
      })
    }

    // GET /api/configuracion - OBTENER CONFIGURACIÓN DEL SISTEMA
    if (path.includes('/api/configuracion') && req.method === 'GET') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Solo admin puede ver configuración
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden acceder a configuración', 403)
      }

      const { data: config, error } = await supabase
        .from('configuracion_sistema')
        .select('clave, valor, descripcion, updated_at')
        .order('clave')

      if (error) {
        return errorResponse('Error al obtener configuración', 500)
      }

      // Convertir a objeto
      const configObj = {}
      config?.forEach((item: any) => {
        try {
          configObj[item.clave] = typeof item.valor === 'string' ? JSON.parse(item.valor) : item.valor
        } catch {
          configObj[item.clave] = item.valor
        }
      })

      return jsonResponse({
        status: 'success',
        configuracion: configObj,
      })
    }

    // PUT /api/configuracion - ACTUALIZAR CONFIGURACIÓN DEL SISTEMA
    if (path.includes('/api/configuracion') && req.method === 'PUT') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Solo admin puede actualizar configuración
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden actualizar configuración', 403)
      }

      const updates = await req.json()

      // Actualizar cada clave de configuración
      for (const [clave, valor] of Object.entries(updates)) {
        const { error: updateError } = await supabase
          .from('configuracion_sistema')
          .update({
            valor: JSON.stringify(valor),
            updated_at: new Date().toISOString(),
          })
          .eq('clave', clave)

        if (updateError) {
          return errorResponse(`Error actualizando ${clave}`, 500)
        }
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_usuario_id: user.id,
        p_accion: 'UPDATE',
        p_tabla_afectada: 'configuracion_sistema',
        p_registro_id: 'sistema',
      })

      return jsonResponse({
        status: 'success',
        message: 'Configuración actualizada exitosamente',
      })
    }

    return errorResponse('Endpoint no encontrado', 404)
  } catch (error) {
    console.error('Error:', error)
    return errorResponse('Error interno del servidor', 500)
  }
})
