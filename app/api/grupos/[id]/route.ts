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

// GET /api/grupos/[id] - Obtener detalles de un grupo
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
    const grupo_id = id

    // Verificar token con Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Obtener grupo con información del líder y jóvenes
    const { data: grupo, error } = await supabase
      .from('grupos')
      .select(`
        *,
        lider:users!grupos_lider_id_fkey(id, nombre_completo, email),
        jovenes:jovenes(id, nombre_completo, fecha_nacimiento, bautizado, sellado, servidor)
      `)
      .eq('id', id)
      .single()

    if (error || !grupo) {
      return NextResponse.json(
        { error: 'Grupo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: grupo,
    })
  } catch (error) {
    console.error('Error en GET /api/grupos/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/grupos/[id] - Actualizar grupo
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
    const grupo_id = id

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

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Solo admin puede actualizar grupos, o el líder puede actualizar su propio grupo
    let canUpdate = currentUser.rol === 'admin'
    
    if (currentUser.rol === 'lider') {
      const { data: grupo } = await supabase
        .from('grupos')
        .select('lider_id')
        .eq('id', grupo_id)
        .single()
      
      canUpdate = grupo?.lider_id === user.id
    }

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar este grupo' },
        { status: 403 }
      )
    }

    // Actualizar grupo
    const { data: grupo, error } = await supabase
      .from('grupos')
      .update(body)
      .eq('id', grupo_id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar grupo:', error)
      return NextResponse.json(
        { error: 'Error al actualizar grupo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: grupo,
    })
  } catch (error) {
    console.error('Error en PUT /api/grupos/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/grupos/[id] - Eliminar grupo
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
    const grupo_id = id

    // Verificar token con Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Solo admin puede eliminar grupos
    const { data: currentUser } = await supabase
      .from('users')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (currentUser?.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo los administradores pueden eliminar grupos' },
        { status: 403 }
      )
    }

    // Verificar que no tenga jóvenes activos
    const { data: jovenes, error: jovenesError } = await supabase
      .from('jovenes')
      .select('id')
      .eq('grupo_id', grupo_id)
      .eq('estado', 'activo')

    if (jovenesError) {
      return NextResponse.json(
        { error: 'Error al verificar jóvenes del grupo' },
        { status: 500 }
      )
    }

    if (jovenes && jovenes.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un grupo que tiene jóvenes activos' },
        { status: 400 }
      )
    }

    // En lugar de eliminar, marcar como inactivo
    const { error } = await supabase
      .from('grupos')
      .update({ estado: 'inactivo' })
      .eq('id', grupo_id)

    if (error) {
      console.error('Error al eliminar grupo:', error)
      return NextResponse.json(
        { error: 'Error al eliminar grupo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Grupo eliminado correctamente',
    })
  } catch (error) {
    console.error('Error en DELETE /api/grupos/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}