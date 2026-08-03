import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtDecode } from 'jwt-decode'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// GET /api/users/me - Obtener información del usuario actual
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

    // Decode JWT to get user ID
    let userId: string
    try {
      const decoded: any = jwtDecode(token)
      userId = decoded.sub
      console.log('✅ Token decoded, user ID:', userId)
    } catch (err) {
      console.log('❌ Invalid token:', err)
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Create userClient for queries (respects RLS)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    })

    // Obtener información del usuario desde la tabla users
    const { data: currentUser, error } = await userClient
      .from('users')
      .select('id, email, nombre_completo, telefono, rol, estado, ultima_sesion, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error || !currentUser) {
      console.log('❌ User not found:', error?.message)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ User found:', currentUser.id)

    return NextResponse.json({
      success: true,
      data: currentUser,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error en GET /api/users/me:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}