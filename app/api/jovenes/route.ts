import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtDecode } from 'jwt-decode'
import { createCorsResponse, createCorsErrorResponse, createCorsOptionsResponse } from '@/utils/cors'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
      console.log('❌ No authorization header')
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    console.log('🔑 Token received, length:', token.length)

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

    console.log('✅ Auth user validated')

    // Verificar si es una búsqueda por nombre (para verificar duplicados)
    const { searchParams } = new URL(request.url)
    const nombreBusqueda = searchParams.get('nombre')

    if (nombreBusqueda) {
      // Búsqueda específica por nombre (case insensitive)
      const { data: jovenEncontrado, error: searchError } = await userClient
        .from('jovenes')
        .select('id, nombre_completo')
        .ilike('nombre_completo', nombreBusqueda)
        .eq('estado', 'activo')
        .limit(1)

      if (searchError) {
        console.error('Error al buscar joven por nombre:', searchError)
        return NextResponse.json({
          success: true,
          data: [],
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        })
      }

      return NextResponse.json({
        success: true,
        data: jovenEncontrado || [],
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      })
    }

    const { data: jovenes, error } = await userClient
      .from('jovenes')
      .select('id, nombre_completo, fecha_nacimiento, celular, grupo_id, estado, bautizado, sellado, servidor, simpatizante, created_at')
      .eq('estado', 'activo')
      .order('nombre_completo')

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

    // Decode JWT to get user ID
    let userId: string
    try {
      const decoded: any = jwtDecode(token)
      userId = decoded.sub
      console.log('✅ Token decoded for POST, user ID:', userId)
    } catch (err) {
      console.log('❌ Invalid token:', err)
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Create userClient for mutations (respects RLS)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    })

    console.log('✅ Auth user validated for POST')

    // Crear joven
    const { data: joven, error } = await userClient
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