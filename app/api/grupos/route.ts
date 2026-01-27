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

// GET /api/grupos - Listar todos los grupos
export async function GET(request: NextRequest) {
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
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
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
      .select('*, lider:users!grupos_lider_id_fkey(id, nombre_completo, email)')
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

    return NextResponse.json({
      success: true,
      data: grupos || [],
      count: grupos?.length || 0,
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
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
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

    // Crear grupo
    const { data: grupo, error } = await supabase
      .from('grupos')
      .insert(body)
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