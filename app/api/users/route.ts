import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

// GET /api/users - Listar usuarios que pueden ser líderes (admin y lider)
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
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Verificar que el usuario actual sea admin
    const { data: currentUser } = await supabase
      .from('users')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (currentUser?.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permisos para ver la lista de usuarios' },
        { status: 403 }
      )
    }

    // Obtener usuarios con rol 'lider' o 'admin' y estado 'activo'
    const { data: usuarios, error } = await supabase
      .from('users')
      .select('id, nombre_completo, email, rol')
      .in('rol', ['admin', 'lider'])
      .eq('estado', 'activo')
      .order('nombre_completo')

    if (error) {
      console.error('Error al obtener usuarios:', error)
      return NextResponse.json(
        { error: 'Error al obtener usuarios' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: usuarios || [],
      count: usuarios?.length || 0,
    })
  } catch (error) {
    console.error('Error en GET /api/users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}