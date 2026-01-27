import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createCorsResponse, createCorsErrorResponse, createCorsOptionsResponse } from '@/utils/cors'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// OPTIONS /api/jovenes - CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  })
}

// GET /api/jovenes - Listar todos los jóvenes
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
      console.error('Error al obtener jóvenes:', error)
      return NextResponse.json(
        { error: 'Error al obtener jóvenes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: jovenes || [],
      count: jovenes?.length || 0,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('Error en GET /api/jovenes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/jovenes - Crear nuevo joven
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

    // Solo admin puede crear jóvenes desde el dashboard
    const { data: currentUser } = await supabase
      .from('users')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (currentUser?.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permisos para crear jóvenes' },
        { status: 403 }
      )
    }

    // Crear joven
    const { data: joven, error } = await supabase
      .from('jovenes')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error al crear joven:', error)
      return NextResponse.json(
        { error: 'Error al crear joven' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: joven,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('Error en POST /api/jovenes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}