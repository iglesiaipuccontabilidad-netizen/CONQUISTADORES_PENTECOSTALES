import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createCorsResponse, createCorsErrorResponse, createCorsOptionsResponse } from '@/utils/cors'
import { parseDataUrl } from '@/lib/ocr/data-url'
import { extraerDatosVolante, ErrorOcr } from '@/lib/ocr/extract-volante'
import { normalizarResultado } from '@/lib/ocr/normalize'

export async function OPTIONS() {
  return createCorsOptionsResponse()
}

export async function POST(request: NextRequest) {
  try {
    // 1. Sesión verificada (no basta con decodificar el JWT: gastaríamos cuota
    //    con tokens falsificados).
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsErrorResponse('Token de autorización requerido', 401)
    }

    const token = authHeader.split('Bearer ')[1]
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: auth, error: errorAuth } = await supabase.auth.getUser(token)
    if (errorAuth || !auth?.user) {
      return createCorsErrorResponse('Token inválido', 401)
    }

    // 2. El escaneo es opcional: sin clave, la app sigue funcionando manual.
    if (!process.env.GEMINI_API_KEY) {
      return createCorsErrorResponse('El escaneo no está configurado en el servidor', 503)
    }

    // 3. Validar la imagen antes de gastar cuota.
    const body = await request.json().catch(() => null)
    const imagen = parseDataUrl(body?.imagen)
    if (!imagen) {
      return createCorsErrorResponse(
        'Usa una foto JPG, PNG o WEBP de menos de 4 MB',
        400
      )
    }

    // 4. Extraer. La imagen solo vive en memoria y nunca se registra en logs.
    let crudo: unknown
    try {
      crudo = await extraerDatosVolante(imagen.base64, imagen.mime)
    } catch (err) {
      const esTimeout = err instanceof ErrorOcr && err.esTimeout
      console.error('OCR: extracción fallida:', err instanceof Error ? err.message : err)

      return createCorsErrorResponse(
        esTimeout
          ? 'La foto tardó demasiado en procesarse, intenta de nuevo'
          : 'Servicio de escaneo no disponible, llena el formulario manual',
        esTimeout ? 504 : 503
      )
    }

    // 5. Normalizar: nunca se confía en el formato del modelo.
    const { data, campos_no_leidos } = normalizarResultado(crudo)

    return createCorsResponse({ success: true, data, campos_no_leidos })
  } catch (err) {
    console.error('OCR: error inesperado:', err instanceof Error ? err.message : err)
    return createCorsErrorResponse('Error procesando la imagen', 500)
  }
}
