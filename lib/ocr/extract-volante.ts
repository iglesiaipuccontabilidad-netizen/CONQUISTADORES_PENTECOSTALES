/**
 * Extracción de datos del volante con un modelo multimodal.
 *
 * Motor principal: Gemini (capa gratuita de AI Studio).
 * Respaldo: Groq, si Gemini agota cuota o falla.
 *
 * Devuelve el JSON crudo del modelo. La validación vive en normalize.ts.
 */

const TIMEOUT_MS = 20_000

const MODELO_GEMINI = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const MODELO_GROQ = process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct'

export class ErrorOcr extends Error {
  esTimeout: boolean
  constructor(mensaje: string, esTimeout = false) {
    super(mensaje)
    this.name = 'ErrorOcr'
    this.esTimeout = esTimeout
  }
}

const PROMPT = `Digitalizas volantes de inscripción de una iglesia en Colombia.

La imagen es un volante de papel: las ETIQUETAS ("Nombre:", "Celular:", "Dirección:") están IMPRESAS y las RESPUESTAS están escritas A MANO. Extrae únicamente las respuestas manuscritas, nunca el texto de las etiquetas.

Reglas estrictas:
- Si un campo está vacío, ilegible o no aparece en el volante, devuelve null. NUNCA inventes ni adivines un valor.
- "fecha_nacimiento" va en formato YYYY-MM-DD. Si el año está escrito con dos dígitos, interprétalo sabiendo que son jóvenes nacidos entre 1990 y hoy.
- "celular" son solo los dígitos, sin espacios, guiones ni indicativo de país.
- "bautizado", "sellado", "servidor" y "simpatizante" son casillas: true solo si la casilla está marcada de forma inequívoca; false si está vacía o si la marca es dudosa.
- No devuelvas ningún campo relacionado con consentimiento.`

const ESQUEMA_GEMINI = {
  type: 'object',
  properties: {
    nombre_completo: { type: 'string', nullable: true },
    celular: { type: 'string', nullable: true },
    fecha_nacimiento: { type: 'string', nullable: true },
    direccion: { type: 'string', nullable: true },
    bautizado: { type: 'boolean' },
    sellado: { type: 'boolean' },
    servidor: { type: 'boolean' },
    simpatizante: { type: 'boolean' },
  },
  required: ['bautizado', 'sellado', 'servidor', 'simpatizante'],
}

// El controlador debe permanecer armado durante toda la lectura del cuerpo,
// no solo hasta que lleguen los encabezados: un proveedor que responde rápido
// pero envía el cuerpo a cuentagotas, si no, cuelga sin límite de tiempo.
// Por eso este helper hace fetch + lectura/parseo del cuerpo, y solo libera
// el temporizador en el finally que envuelve todo el ciclo.
async function fetchJsonConTimeout(
  url: string,
  init: RequestInit
): Promise<{ ok: boolean; status: number; json: any }> {
  const controlador = new AbortController()
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { ...init, signal: controlador.signal })
    // El estado ya está disponible con los encabezados; si no es OK, no hace
    // falta leer el cuerpo (que podría no ser JSON, p. ej. una página de error
    // de un proxy) para reportar el fallo.
    if (!res.ok) return { ok: false, status: res.status, json: null }
    const json = await res.json()
    return { ok: true, status: res.status, json }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ErrorOcr('El proveedor tardó demasiado', true)
    }
    throw err
  } finally {
    clearTimeout(temporizador)
  }
}

async function llamarGemini(base64: string, mime: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new ErrorOcr('GEMINI_API_KEY no configurada')

  const { ok, status, json } = await fetchJsonConTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELO_GEMINI}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: PROMPT }, { inline_data: { mime_type: mime, data: base64 } }] },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: ESQUEMA_GEMINI,
          temperature: 0,
        },
      }),
    }
  )

  if (!ok) throw new ErrorOcr(`Gemini respondió ${status}`)

  const texto = json?.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof texto !== 'string') throw new ErrorOcr('Gemini devolvió una respuesta vacía')

  try {
    return JSON.parse(texto)
  } catch {
    throw new ErrorOcr('Gemini devolvió una respuesta que no es JSON válido')
  }
}

async function llamarGroq(base64: string, mime: string): Promise<unknown> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new ErrorOcr('GROQ_API_KEY no configurada')

  const { ok, status, json } = await fetchJsonConTimeout(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODELO_GROQ,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `${PROMPT}\n\nDevuelve un objeto JSON con exactamente estas claves: nombre_completo, celular, fecha_nacimiento, direccion, bautizado, sellado, servidor, simpatizante.`,
              },
              { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } },
            ],
          },
        ],
      }),
    }
  )

  if (!ok) throw new ErrorOcr(`Groq respondió ${status}`)

  const texto = json?.choices?.[0]?.message?.content
  if (typeof texto !== 'string') throw new ErrorOcr('Groq devolvió una respuesta vacía')

  try {
    return JSON.parse(texto)
  } catch {
    throw new ErrorOcr('Groq devolvió una respuesta que no es JSON válido')
  }
}

export async function extraerDatosVolante(base64: string, mime: string): Promise<unknown> {
  try {
    return await llamarGemini(base64, mime)
  } catch (err) {
    // Nunca registrar la imagen, solo el motivo del fallo.
    console.error('OCR: Gemini falló:', err instanceof Error ? err.message : err)

    if (!process.env.GROQ_API_KEY) throw err

    console.log('OCR: reintentando con Groq')
    return await llamarGroq(base64, mime)
  }
}
