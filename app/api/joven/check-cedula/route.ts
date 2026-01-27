import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cedula = searchParams.get('cedula')

    if (!cedula) {
      return NextResponse.json(
        { success: false, error: 'Cédula requerida' },
        { status: 400 }
      )
    }

    // Check if cedula exists
    const { data, error } = await supabase
      .from('jovenes')
      .select('id')
      .eq('cedula', cedula)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned
      console.error('Error checking cedula:', error)
      return NextResponse.json(
        { success: false, error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    const available = !data // If no data, available

    return NextResponse.json({
      success: true,
      available,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}