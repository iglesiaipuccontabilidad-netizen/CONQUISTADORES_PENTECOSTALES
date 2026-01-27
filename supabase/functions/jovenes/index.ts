// supabase/functions/jovenes/index.ts - Edge Function para Gestión de Jóvenes
// Updated: Fixed log_deletion call with p_detalles parameter
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message, status: 'error' }, status)
}

// Validaciones
function validateCelular(celular: string): boolean {
  return /^\+57\d{10}$/.test(celular)
}

// ============================================
// HANDLER PRINCIPAL
// ============================================

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname

  console.log(`[${req.method}] ${path}`)

  // ============================================
  // CORS PREFLIGHT
  // ============================================
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // ============================================
    // GET /jovenes - LISTAR TODOS LOS JÓVENES
    // ============================================
    if (path === '/jovenes' && req.method === 'GET') {
      console.log('✅ Matched GET /jovenes (list)')
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
        .select('id, nombre_completo, fecha_nacimiento, celular, grupo_id, estado, bautizado, sellado, servidor, simpatizante, created_at')
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

    // ============================================
    // GET /jovenes/:id - VER DETALLES DE UN JOVEN
    // ============================================
    if (path.match(/^\/jovenes\/[a-f0-9-]+$/) && req.method === 'GET') {
      const joven_id = path.split('/').pop()
      console.log('✅ Matched Detail View for ID:', joven_id)
      const authHeader = req.headers.get('Authorization')
      console.log('🔑 Auth Header:', authHeader ? 'Present' : 'Missing')
      const token = authHeader?.split('Bearer ')[1]

      if (!token) {
        console.log('❌ No token provided in request')
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        console.log('❌ Auth error or no user found for token:', authError)
        return errorResponse('Token inválido', 401)
      }
      console.log('👤 Authenticated user:', user.email)

      const { data: joven, error } = await supabase
        .from('jovenes')
        .select('*, grupo:grupos(id, nombre)')
        .eq('id', joven_id)
        .single()

      if (error || !joven) {
        console.log('❌ Joven not found:', error)
        return errorResponse('Joven no encontrado', 404)
      }

      // Calcular edad si no está en la base de datos o asegurar valor
      if (joven.fecha_nacimiento && !joven.edad) {
        const birthDate = new Date(joven.fecha_nacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        joven.edad = age;
      }

      console.log('✅ Returning joven:', joven?.nombre_completo)
      return jsonResponse({
        status: 'success',
        joven,
      })
    }

    // ============================================
    // POST /jovenes - CREAR NUEVO JOVEN
    // ============================================
    if (path === '/jovenes' && req.method === 'POST') {
      const token = req.headers.get('Authorization')?.split('Bearer ')[1]

      if (!token) {
        return errorResponse('Autenticación requerida', 401)
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return errorResponse('Token inválido', 401)
      }

      // Solo admin puede crear
      const { data: currentUser } = await supabase
        .from('users')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (currentUser?.rol !== 'admin') {
        return errorResponse('Solo admins pueden crear jóvenes', 403)
      }

      const body = await req.json()
      const {
        nombre_completo,
        fecha_nacimiento,
        celular,
        grupo_id,
        bautizado,
        sellado,
        servidor,
        simpatizante,
        consentimiento_datos_personales,
      } = body

      // Si solo se envía el consentimiento de datos personales, crear registro mínimo
      const isMinimalRegistration = Object.keys(body).length === 1 && consentimiento_datos_personales === true

      if (isMinimalRegistration) {
        // Insertar joven con datos mínimos
        const { data: newJoven, error: insertError } = await supabase
          .from('jovenes')
          .insert([
            {
              nombre_completo: 'Usuario Anónimo', // Placeholder
              fecha_nacimiento: new Date().toISOString().split('T')[0], // Fecha actual
              celular: null, // Nullable
              grupo_id: null, // Nullable
              bautizado: false,
              sellado: false,
              servidor: false,
              simpatizante: false,
              consentimiento_datos_personales: true,
              estado: 'activo',
            },
          ])
          .select()
          .single()

        if (insertError) {
          return errorResponse('Error al registrar consentimiento', 500)
        }

        return jsonResponse(
          {
            status: 'success',
            message: 'Consentimiento registrado exitosamente',
            joven: newJoven,
          },
          201
        )
      }

      // Validaciones para registro completo
      if (!nombre_completo?.trim() || nombre_completo.length < 3) {
        return errorResponse('Nombre inválido', 400)
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
      if (!consentimiento_datos_personales) {
        return errorResponse('El consentimiento de datos personales es requerido', 400)
      }

      // Insertar joven
      const { data: newJoven, error: insertError } = await supabase
        .from('jovenes')
        .insert([
          {
            nombre_completo: nombre_completo.trim(),
            fecha_nacimiento,
            celular,
            grupo_id,
            bautizado: bautizado || false,
            sellado: sellado || false,
            servidor: servidor || false,
            simpatizante: simpatizante || false,
            consentimiento_datos_personales,
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
        p_usuario_id: user.id,
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

    // ============================================
    // PUT /jovenes/:id - ACTUALIZAR JOVEN
    // ============================================
    if (path.match(/^\/jovenes\/[a-f0-9-]+$/) && req.method === 'PUT') {
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

    // ============================================
    // DELETE /jovenes/:id - ELIMINAR JOVEN
    // ============================================
    if (path.match(/^\/jovenes\/[a-f0-9-]+$/) && req.method === 'DELETE') {
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
      const { data: _deletedJoven, error } = await supabase
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
        p_detalles: { eliminado_por: user.id, timestamp: new Date().toISOString() }
      })

      return jsonResponse({
        status: 'success',
        message: 'Joven eliminado exitosamente',
      })
    }

    // ============================================
    // RUTA NO ENCONTRADA
    // ============================================
    return errorResponse('Ruta no encontrada', 404)

  } catch (error) {
    console.error('Error interno:', error)
    return errorResponse('Error interno del servidor', 500)
  }
})