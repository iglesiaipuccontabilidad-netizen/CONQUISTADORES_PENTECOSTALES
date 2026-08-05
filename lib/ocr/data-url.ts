/**
 * Validación del data URL que envía el cliente.
 *
 * Corre antes de llamar a cualquier proveedor: rechazar aquí evita gastar cuota
 * gratuita en algo que nunca iba a servir.
 */

export interface ImagenPayload {
  mime: string
  base64: string
  bytes: number
}

export const MAX_BYTES = 4 * 1024 * 1024

const MIMES_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']
const BASE64_VALIDO = /^[A-Za-z0-9+/]+={0,2}$/

export function parseDataUrl(valor: unknown): ImagenPayload | null {
  if (typeof valor !== 'string') return null

  const match = valor.match(/^data:([a-z]+\/[a-z0-9+.-]+);base64,(.+)$/i)
  if (!match) return null

  const mime = match[1].toLowerCase()
  const base64 = match[2]

  if (!MIMES_PERMITIDOS.includes(mime)) return null
  if (!BASE64_VALIDO.test(base64)) return null
  // Base64 encoding groups characters in multiples of 4; validate length accordingly.
  if (base64.length % 4 !== 0) return null

  // Cada 4 caracteres base64 son 3 bytes; el relleno '=' resta.
  const relleno = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  const bytes = Math.floor((base64.length * 3) / 4) - relleno

  if (bytes <= 0 || bytes > MAX_BYTES) return null

  return { mime, base64, bytes }
}
