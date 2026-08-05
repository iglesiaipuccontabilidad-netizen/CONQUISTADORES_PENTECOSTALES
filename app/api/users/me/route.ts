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

    // Decode JWT to get user ID and email
    let userId: string
    let userEmail: string
    try {
      const decoded: any = jwtDecode(token)
      userId = decoded.sub
      userEmail = decoded.email
      console.log('✅ Token decoded, user ID:', userId, 'email:', userEmail)

      if (!userEmail) {
        console.log('❌ Missing email in JWT')
        return NextResponse.json(
          { error: 'Email no disponible en el token' },
          { status: 400 }
        )
      }
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

    // Si el usuario no existe (error 406 = no rows), crearlo automáticamente con service role
    // Para otros errores, retornar el error
    if (error) {
      console.log('⚠️  Error fetching user:', error.code, error.message)
      // 406 = no rows returned (user doesn't exist)
      // 401 = permission denied (RLS)
      if (error.code !== 'PGRST116') {
        console.log('❌ Error fetching user (not a "not found" error):', error.code)
        return NextResponse.json(
          { error: `Error al obtener usuario: ${error.message}` },
          { status: 500 }
        )
      }
      console.log('⚠️  User not found, creating user record')
    }

    if (!error && currentUser) {
      // Usuario existe, retornarlo
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
    }

    // Si llegamos aquí, el usuario no existe y debemos crearlo
    if (error && error.code === 'PGRST116') {

      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.log('❌ SUPABASE_SERVICE_ROLE_KEY not configured')
        return NextResponse.json(
          { error: 'Error de configuración del servidor' },
          { status: 500 }
        )
      }

      const serviceClient = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      const { data: newUser, error: createError } = await serviceClient
        .from('users')
        .insert({
          id: userId,
          email: userEmail,
          nombre_completo: userEmail.split('@')[0] || 'Usuario',
          rol: 'usuario',
          estado: 'activo',
        })
        .select('id, email, nombre_completo, telefono, rol, estado, ultima_sesion, created_at, updated_at')
        .single()

      if (createError || !newUser) {
        console.log('❌ Error creating user:', createError?.message)
        console.log('❌ Create error details:', { code: createError?.code, details: createError?.details })
        console.log('❌ Response status:', createError?.status)
        return NextResponse.json(
          { error: `No se pudo crear registro de usuario: ${createError?.message}` },
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

    // Should not reach here
    return NextResponse.json(
      { error: 'Unexpected state' },
      { status: 500 }
    )

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