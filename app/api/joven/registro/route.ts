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
  return /^[0-9]{10}$/.test(celular)
}

// POST /api/joven/registro - Registro público de joven (sin autenticación)
export async function POST(request: NextRequest) {
  try {
    console.log('🟡 Iniciando POST /api/joven/registro');
    const body = await request.json()
    console.log('📝 Body recibido:', body);

    // Validaciones básicas
    const { 
      nombre_completo, 
      fecha_nacimiento, 
      celular, 
      direccion,
      bautizado,
      sellado,
      servidor,
      simpatizante,
      consentimiento_datos_personales
    } = body

    if (!nombre_completo || !fecha_nacimiento || !celular) {
      console.log('❌ Error: Campos obligatorios faltantes');
      return NextResponse.json(
        { error: 'Campos obligatorios: nombre_completo, fecha_nacimiento, celular' },
        { status: 400 }
      )
    }

    console.log('✅ Campos obligatorios validados');

    // Validar formato de celular
    if (!validateCelular(celular)) {
      console.log('❌ Error: Celular inválido:', celular);
      return NextResponse.json(
        { error: 'El celular debe tener 10 dígitos (ej: 3113678555)' },
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
      direccion: direccion || null,
      estado: 'activo', // Los registros desde el dashboard quedan activos directamente
      bautizado: Boolean(bautizado),
      sellado: Boolean(sellado),
      servidor: Boolean(servidor),
      simpatizante: Boolean(simpatizante),
      consentimiento_datos_personales: Boolean(consentimiento_datos_personales),
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
          accion: 'creacion_joven',
          tabla: 'jovenes',
          registro_id: joven.id,
          detalles: `Joven creado: ${nombre_completo}`,
          usuario_id: null, // TODO: Obtener usuario autenticado
          timestamp: new Date().toISOString(),
        })
    } catch (logError) {
      console.warn('Error al registrar log de actividad:', logError)
      // No fallar el registro por un error en el log
    }

    return NextResponse.json({
      success: true,
      data: joven,
      message: 'Joven creado exitosamente.',
    })
  } catch (error) {
    console.error('❌ Error en POST /api/joven/registro:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace available')
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}