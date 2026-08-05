import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtDecode } from 'jwt-decode'

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

// Verify token locally without network call to Supabase Auth
function verifyTokenLocally(token: string) {
  try {
    const decoded = jwtDecode(token) as { sub: string; email: string; exp: number; [key: string]: any }

    // Check if token is expired
    if (decoded.exp) {
      const now = Math.floor(Date.now() / 1000)
      if (decoded.exp < now) {
        return { user: null, error: new Error('Token expired') }
      }
    }

    // Return decoded user info
    return {
      user: {
        id: decoded.sub,
        ...decoded,
      },
      error: null,
    }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error('Invalid token') }
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

    // Verificar token localmente sin llamada a red
    const { user, error: authError } = verifyTokenLocally(token)
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
    const jovenData = joven as any
    if (jovenData.fecha_nacimiento && !jovenData.edad) {
      const birthDate = new Date(jovenData.fecha_nacimiento)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      jovenData.edad = age
    }

    return NextResponse.json({
      success: true,
      data: jovenData,
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

    // Verificar token localmente sin llamada a red
    const { user, error: authError } = verifyTokenLocally(token)
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

    // Filtrar solo campos permitidos para actualización
    const allowedFields = ['nombre_completo', 'fecha_nacimiento', 'celular', 'direccion', 'grupo_id', 'bautizado', 'sellado', 'servidor', 'simpatizante']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    console.log('📝 Updating joven with data:', updateData)

    // Actualizar joven
    const queryResult: any = await (supabase as any)
      .from('jovenes')
      .update(updateData)
      .eq('id', joven_id)
      .select()
      .single()

    const { data: joven, error } = queryResult

    if (error) {
      console.error('Error al actualizar joven:', error)
      console.error('Error details:', { message: error.message, code: error.code, details: error.details })
      return NextResponse.json(
        { error: 'Error al actualizar joven: ' + error.message },
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
    console.log('🔑 Token presente, verificando localmente...');

    // Verificar token localmente sin llamada a red
    const { user, error: authError } = verifyTokenLocally(token)
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
    const userQueryResult: any = await (supabase as any)
      .from('users')
      .select('rol')
      .eq('id', user.id)
      .single()

    const { data: currentUser } = userQueryResult

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
    const deleteQueryResult: any = await (supabase as any)
      .from('jovenes')
      .update({ estado: 'inactivo' })
      .eq('id', joven_id)
      .select()

    const { data: result, error } = deleteQueryResult

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