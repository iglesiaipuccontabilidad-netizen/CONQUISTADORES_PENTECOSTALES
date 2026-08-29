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

// Función para validar celular colombiano
function validateCelular(celular: string): boolean {
  return /^[0-9]{10}$/.test(celular)
}

// POST /api/joven/registro - Registro público de joven (sin autenticación)
export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient()
  try {
    console.log('🟡 Iniciando POST /api/joven/registro');
    const body = await request.json()
    console.log('📝 Body recibido:', JSON.stringify(body, null, 2));

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
      consentimiento_datos_personales,
      grupo_id,
    } = body

    if (!nombre_completo || !fecha_nacimiento || !celular) {
      console.log('❌ Error: Campos obligatorios faltantes');
      return NextResponse.json(
        { status: 'error', error: 'Campos obligatorios: nombre_completo, fecha_nacimiento, celular' },
        { status: 400 }
      )
    }

    console.log('✅ Campos obligatorios validados');

    // Validar formato de celular
    if (!validateCelular(celular)) {
      console.log('❌ Error: Celular inválido:', celular);
      return NextResponse.json(
        { status: 'error', error: 'El celular debe tener 10 dígitos (ej: 3113678555)' },
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

    // Validar rango de edad (12-35 años)
    if (edad < 12 || edad > 35) {
      console.log('❌ Error: Edad fuera de rango:', edad)
      return NextResponse.json(
        { status: 'error', error: 'Debes tener entre 12 y 35 años para registrarte' },
        { status: 400 }
      )
    }

    // Verificar si ya existe un joven con el mismo nombre completo
    console.log('🔍 Verificando duplicado por nombre:', nombre_completo)
    const { data: existingJovenByName, error: nameCheckError } = await supabase
      .from('jovenes')
      .select('id, nombre_completo')
      .eq('nombre_completo', nombre_completo)
      .eq('estado', 'activo')
      .single()

    if (nameCheckError && nameCheckError.code !== 'PGRST116') {
      console.log('❌ Error al verificar nombre duplicado:', nameCheckError)
      return NextResponse.json(
        { status: 'error', error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    if (existingJovenByName) {
      console.log('❌ Nombre duplicado encontrado:', existingJovenByName)
      return NextResponse.json(
        { 
          status: 'error',
          error: `Ya existe un joven registrado con el nombre "${nombre_completo}". Por favor, verifica la información o usa un nombre diferente si es una persona distinta.` 
        },
        { status: 400 }
      )
    }

    // Verificar si ya existe un joven con el mismo celular
    console.log('📱 Verificando duplicado por celular:', celular)
    const { data: existingJovenByPhone, error: phoneCheckError } = await supabase
      .from('jovenes')
      .select('id, nombre_completo')
      .eq('celular', celular)
      .eq('estado', 'activo')
      .single()

    if (phoneCheckError && phoneCheckError.code !== 'PGRST116') {
      console.log('❌ Error al verificar celular duplicado:', phoneCheckError)
      return NextResponse.json(
        { status: 'error', error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    if (existingJovenByPhone) {
      console.log('❌ Celular duplicado encontrado:', existingJovenByPhone)
      return NextResponse.json(
        { 
          status: 'error',
          error: `Ya existe un joven registrado con el número de celular ${celular} (${existingJovenByPhone.nombre_completo}). Por favor, verifica la información.` 
        },
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
      grupo_id: grupo_id || null,
      estado: 'activo',
      bautizado: Boolean(bautizado),
      sellado: Boolean(sellado),
      servidor: Boolean(servidor),
      simpatizante: Boolean(simpatizante),
      consentimiento_datos_personales: Boolean(consentimiento_datos_personales),
      created_at: new Date().toISOString(),
    }

    // Crear joven
    console.log('💾 Insertando joven con datos:', JSON.stringify(jovenData, null, 2))
    const { data: joven, error } = await supabase
      .from('jovenes')
      .insert(jovenData)
      .select()
      .single()

    if (error) {
      console.error('❌ Error al crear joven:', error)
      console.error('❌ Código de error:', error.code)
      console.error('❌ Mensaje:', error.message)
      console.error('❌ Detalles:', error.details)
      return NextResponse.json(
        { 
          status: 'error',
          error: `Error al procesar el registro: ${error.message}` 
        },
        { status: 500 }
      )
    }

    // Registrar log de actividad
    try {
      await supabase
        .from('actividad_usuarios')
        .insert({
          accion: 'CREATE',
          tabla_afectada: 'jovenes',
          registro_id: joven.id,
          detalles: { mensaje: `Joven creado: ${nombre_completo}` },
          usuario_id: null, // TODO: Obtener usuario autenticado
          created_at: new Date().toISOString(),
        })
    } catch (logError) {
      console.warn('Error al registrar log de actividad:', logError)
      // No fallar el registro por un error en el log
    }

    return NextResponse.json({
      status: 'success',
      joven: joven,
      message: 'Joven creado exitosamente.',
    })
  } catch (error) {
    console.error('❌ Error en POST /api/joven/registro:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace available')
    return NextResponse.json(
      { status: 'error', error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}