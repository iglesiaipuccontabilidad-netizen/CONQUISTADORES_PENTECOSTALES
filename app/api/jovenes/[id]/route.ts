import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

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

    // Verificar token con Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

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

    // Verificar token con Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Verificar permisos
    const { data: currentUser } = await supabase
      .from('users')
      .select('rol, id')
      .eq('id', user.id)
      .single()

    if (!currentUser || (currentUser.rol !== 'admin' && currentUser.rol !== 'lider')) {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar jóvenes' },
        { status: 403 }
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

    // Verificar token con Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Solo admin puede eliminar
    const { data: currentUser } = await supabase
      .from('users')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (currentUser?.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo los administradores pueden eliminar jóvenes' },
        { status: 403 }
      )
    }

    // En lugar de eliminar, marcar como inactivo
    const { error } = await supabase
      .from('jovenes')
      .update({ estado: 'inactivo' })
      .eq('id', joven_id)

    if (error) {
      console.error('Error al eliminar joven:', error)
      return NextResponse.json(
        { error: 'Error al eliminar joven' },
        { status: 500 }
      )
    }

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
    console.error('Error en DELETE /api/jovenes/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}