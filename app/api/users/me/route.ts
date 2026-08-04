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

    // Si el usuario no existe, crearlo automáticamente
    if (error || !currentUser) {
      console.log('⚠️  User not found, creating user record')

      const { data: newUser, error: createError } = await userClient
        .from('users')
        .insert({
          id: userId,
          email: (jwtDecode(token) as any).email || '',
          nombre_completo: (jwtDecode(token) as any).email?.split('@')[0] || 'Usuario',
          rol: 'usuario',
          estado: 'activo',
        })
        .select('id, email, nombre_completo, telefono, rol, estado, ultima_sesion, created_at, updated_at')
        .single()

      if (createError || !newUser) {
        console.log('❌ Error creating user:', createError?.message)
        return NextResponse.json(
          { error: 'No se pudo crear registro de usuario' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: newUser,
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
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