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

// Función para validar celular colombiano
function validateCelular(celular: string): boolean {
  return /^\+57\d{10}$/.test(celular)
}

// POST /api/joven/registro - Registro público de joven (sin autenticación)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validaciones básicas
    const { 
      nombre_completo, 
      fecha_nacimiento, 
      celular, 
      ciudad, 
      direccion,
      email 
    } = body

    if (!nombre_completo || !fecha_nacimiento || !celular || !ciudad) {
      return NextResponse.json(
        { error: 'Campos obligatorios: nombre_completo, fecha_nacimiento, celular, ciudad' },
        { status: 400 }
      )
    }

    // Validar formato de celular
    if (!validateCelular(celular)) {
      return NextResponse.json(
        { error: 'El celular debe tener el formato +57XXXXXXXXXX' },
        { status: 400 }
      )
    }

    // Calcular edad
    const birthDate = new Date(fecha_nacimiento)
    const today = new Date()
    let edad = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      edad--
    }

    // Verificar si ya existe un joven con el mismo celular
    const { data: existingJoven } = await supabase
      .from('jovenes')
      .select('id')
      .eq('celular', celular)
      .eq('estado', 'activo')
      .single()

    if (existingJoven) {
      return NextResponse.json(
        { error: 'Ya existe un joven registrado con este número de celular' },
        { status: 400 }
      )
    }

    // Preparar datos del joven
    const jovenData = {
      nombre_completo,
      fecha_nacimiento,
      edad,
      celular,
      ciudad,
      direccion,
      email: email || null,
      estado: 'pendiente', // Los registros públicos quedan pendientes de aprobación
      bautizado: false,
      sellado: false,
      servidor: false,
      simpatizante: true, // Por defecto son simpatizantes hasta que se confirme lo contrario
      created_at: new Date().toISOString(),
    }

    // Crear joven
    const { data: joven, error } = await supabase
      .from('jovenes')
      .insert(jovenData)
      .select()
      .single()

    if (error) {
      console.error('Error al crear joven:', error)
      return NextResponse.json(
        { error: 'Error al procesar el registro' },
        { status: 500 }
      )
    }

    // Registrar log de actividad
    try {
      await supabase
        .from('activity_logs')
        .insert({
          accion: 'registro_publico',
          tabla: 'jovenes',
          registro_id: joven.id,
          detalles: `Registro público de ${nombre_completo}`,
          usuario_id: null, // Es un registro público
          timestamp: new Date().toISOString(),
        })
    } catch (logError) {
      console.warn('Error al registrar log de actividad:', logError)
      // No fallar el registro por un error en el log
    }

    return NextResponse.json({
      success: true,
      data: joven,
      message: 'Registro exitoso. Tu información será revisada por un administrador.',
    })
  } catch (error) {
    console.error('Error en POST /api/joven/registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}