/**
 * Normalización de los datos que devuelve el modelo multimodal.
 *
 * Funciones puras: sin red, sin IA, sin React. Es la capa que impide que un dato
 * mal leído entre sucio a la base de datos. Nunca se confía en el formato que
 * devuelva el modelo.
 */

/** Campos que la IA puede extraer del volante. */
export interface DatosVolante {
  nombre_completo: string
  celular: string
  fecha_nacimiento: string
  direccion: string
  bautizado: boolean
  sellado: boolean
  servidor: boolean
  simpatizante: boolean
}

export interface ResultadoNormalizado {
  data: DatosVolante
  campos_no_leidos: string[]
}

const EDAD_MINIMA_PLAUSIBLE = 5
const EDAD_MAXIMA_PLAUSIBLE = 100
const MS_POR_ANIO = 365.25 * 24 * 60 * 60 * 1000

/** Devuelve 10 dígitos o null. Tolera '+57', espacios, guiones y paréntesis. */
export function normalizarCelular(raw: unknown): string | null {
  if (typeof raw !== 'string') return null

  let digitos = raw.replace(/\D/g, '')
  // '+57 300 123 4567' -> '573001234567' -> '3001234567'
  if (digitos.length === 12 && digitos.startsWith('57')) {
    digitos = digitos.slice(2)
  }

  return /^\d{10}$/.test(digitos) ? digitos : null
}

/** Devuelve 'YYYY-MM-DD' o null. Rechaza fechas imposibles y edades absurdas. */
export function normalizarFecha(raw: unknown): string | null {
  if (typeof raw !== 'string') return null

  const match = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const [, anio, mes, dia] = match
  const fecha = new Date(`${anio}-${mes}-${dia}T00:00:00Z`)
  if (Number.isNaN(fecha.getTime())) return null

  // Date corre los desbordes ('2008-02-31' -> 2 de marzo). Eso no es una fecha válida.
  if (
    fecha.getUTCFullYear() !== Number(anio) ||
    fecha.getUTCMonth() + 1 !== Number(mes) ||
    fecha.getUTCDate() !== Number(dia)
  ) {
    return null
  }

  const edad = (Date.now() - fecha.getTime()) / MS_POR_ANIO
  if (edad < EDAD_MINIMA_PLAUSIBLE || edad > EDAD_MAXIMA_PLAUSIBLE) return null

  return `${anio}-${mes}-${dia}`
}

function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : ''
}

export function normalizarResultado(crudo: unknown): ResultadoNormalizado {
  const c: Record<string, unknown> =
    crudo !== null && typeof crudo === 'object' ? (crudo as Record<string, unknown>) : {}

  const campos_no_leidos: string[] = []

  const nombre = texto(c.nombre_completo)
  if (nombre.length < 3) campos_no_leidos.push('nombre_completo')

  const celular = normalizarCelular(c.celular)
  if (!celular) campos_no_leidos.push('celular')

  const fecha = normalizarFecha(c.fecha_nacimiento)
  if (!fecha) campos_no_leidos.push('fecha_nacimiento')

  // La dirección es opcional: si no se lee, no se reporta como faltante.
  const data: DatosVolante = {
    nombre_completo: nombre.length >= 3 ? nombre : '',
    celular: celular ?? '',
    fecha_nacimiento: fecha ?? '',
    direccion: texto(c.direccion),
    bautizado: c.bautizado === true,
    sellado: c.sellado === true,
    servidor: c.servidor === true,
    simpatizante: c.simpatizante === true,
  }

  return { data, campos_no_leidos }
}
