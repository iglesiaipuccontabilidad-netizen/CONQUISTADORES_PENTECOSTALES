import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyUserToken } from '@/lib/verify-token'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// GET /api/grupos - Listar todos los grupos
export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient()
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]

    // Verificar token con Supabase Auth
    const { user, error: authError } = await verifyUserToken(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Obtener información del usuario actual
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

    let query = supabase
      .from('grupos')
      .select(`
        *,
        lider:users!grupos_lider_id_fkey(id, nombre_completo, email)
      `)
      .eq('estado', 'activo')
      .order('nombre')

    // Si es líder, solo ve su grupo
    if (currentUser.rol === 'lider') {
      query = query.eq('lider_id', user.id)
    }

    const { data: grupos, error } = await query

    if (error) {
      console.error('Error al obtener grupos:', error)
      return NextResponse.json(
        { error: 'Error al obtener grupos' },
        { status: 500 }
      )
    }

    // Contar jóvenes activos por grupo
    const { data: jovenesActivos } = await supabase
      .from('jovenes')
      .select('grupo_id')
      .eq('estado', 'activo')
      .not('grupo_id', 'is', null)

    const countByGrupo = new Map<string, number>()
    for (const j of (jovenesActivos as any[]) || []) {
      if (j.grupo_id) {
        countByGrupo.set(j.grupo_id, (countByGrupo.get(j.grupo_id) || 0) + 1)
      }
    }

    const gruposConCount = (grupos || []).map((grupo: any) => ({
      ...grupo,
      integrantes_count: countByGrupo.get(grupo.id) || 0,
    }))

    return NextResponse.json({
      success: true,
      data: gruposConCount,
      count: gruposConCount.length,
    })
  } catch (error) {
    console.error('Error en GET /api/grupos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/grupos - Crear nuevo grupo
export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient()
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

    // Verificar token con Supabase Auth
    const { user, error: authError } = await verifyUserToken(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Solo admin puede crear grupos
    const { data: currentUser } = await supabase
      .from('users')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (currentUser?.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permisos para crear grupos' },
        { status: 403 }
      )
    }

    // Filtrar solo campos permitidos
    const allowedFields = ['nombre', 'descripcion', 'lider_id', 'estado']
    const insertData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        insertData[field] = body[field]
      }
    }

    if (!insertData.nombre || typeof insertData.nombre !== 'string' || insertData.nombre.trim().length < 3) {
      return NextResponse.json(
        { error: 'Nombre del grupo inválido (mínimo 3 caracteres)' },
        { status: 400 }
      )
    }

    if (!insertData.lider_id || typeof insertData.lider_id !== 'string') {
      return NextResponse.json(
        { error: 'Líder del grupo requerido' },
        { status: 400 }
      )
    }

    const { data: liderUser } = await supabase
      .from('users')
      .select('rol')
      .eq('id', insertData.lider_id)
      .single()

    if (!liderUser || !['admin', 'lider'].includes((liderUser as any).rol)) {
      return NextResponse.json(
        { error: 'El líder seleccionado debe tener rol admin o lider' },
        { status: 400 }
      )
    }

    // Crear grupo
    const { data: grupo, error } = await supabase
      .from('grupos')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error al crear grupo:', error)
      return NextResponse.json(
        { error: 'Error al crear grupo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: grupo,
    })
  } catch (error) {
    console.error('Error en POST /api/grupos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}