import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

let serverSupabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!serverSupabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    serverSupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return serverSupabaseClient
}

// Verify token with timeout
async function verifyToken(token: string, timeoutMs = 8000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const supabase = getSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    clearTimeout(timeoutId)
    return { user, error: authError }
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// GET /api/jovenes/[id] - Obtener detalles de un joven
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    const joven_id = id

    // Verificar token con timeout
    const { user, error: authError } = await verifyToken(token)
    if (authError || !user) {
      console.error('Auth verification failed:', authError?.message)
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseClient()

    // Obtener joven con información del grupo
    const { data: joven, error } = await supabase
      .from('jovenes')
      .select('*, grupo:grupos(id, nombre)')
      .eq('id', joven_id)
      .single()

    if (error || !joven) {
      return NextResponse.json(
        { error: 'Joven no encontrado' },
        { status: 404 }
      )
    }

    // Calcular edad si no está en la base de datos
    if (joven.fecha_nacimiento && !joven.edad) {
      const birthDate = new Date(joven.fecha_nacimiento)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      joven.edad = age
    }

    return NextResponse.json({
      success: true,
      data: joven,
    })
  } catch (error) {
    console.error('Error en GET /api/jovenes/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/jovenes/[id] - Actualizar joven
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    const body = await request.json()
    const joven_id = id

    // Verificar token con timeout
    const { user, error: authError } = await verifyToken(token)
    if (authError || !user) {
      console.error('Auth verification failed:', authError?.message)
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseClient()

    // Verificar que el usuario existe en la tabla users
    const { data: currentUser } = await supabase
      .from('users')
      .select('rol, id')
      .eq('id', user.id)
      .single()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar joven
    const { data: joven, error } = await supabase
      .from('jovenes')
      .update(body)
      .eq('id', joven_id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar joven:', error)
      return NextResponse.json(
        { error: 'Error al actualizar joven' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: joven,
    })
  } catch (error) {
    console.error('Error en PUT /api/jovenes/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/jovenes/[id] - Eliminar joven
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🗑️ DELETE request for joven ID:', id);

  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header found');
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    const joven_id = id
    console.log('🔑 Token presente, verificando con Supabase...');

    // Verificar token con timeout
    const { user, error: authError } = await verifyToken(token)
    if (authError || !user) {
      console.log('❌ Token inválido:', authError?.message);
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseClient()
    
    console.log('✅ Usuario autenticado:', user.email, 'ID:', user.id);

    // Verificar que el usuario existe en la tabla users
    const { data: currentUser } = await supabase
      .from('users')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (!currentUser) {
      console.log('❌ Usuario no encontrado en tabla users');
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    console.log('✅ Usuario válido, rol:', currentUser.rol);
    console.log('🗑️ Intentando eliminar joven con ID:', joven_id);

    // En lugar de eliminar, marcar como inactivo
    const { data: result, error } = await supabase
      .from('jovenes')
      .update({ estado: 'inactivo' })
      .eq('id', joven_id)
      .select()

    if (error) {
      console.error('💥 Error al eliminar joven:', error);
      return NextResponse.json(
        { error: `Error al eliminar joven: ${error.message}` },
        { status: 500 }
      )
    }
    
    console.log('✅ Joven marcado como inactivo:', result);

    return NextResponse.json({
      success: true,
      message: 'Joven eliminado correctamente',
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('💥 Error en DELETE /api/jovenes/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}