import { describe, it, expect } from 'vitest'
import { parseDataUrl, MAX_BYTES } from './data-url'

// 1x1 JPEG mínimo en base64, suficiente para las pruebas de formato.
const B64 = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q=='

describe('parseDataUrl', () => {
  it('acepta un JPEG y separa mime y base64', () => {
    const r = parseDataUrl(`data:image/jpeg;base64,${B64}`)
    expect(r).not.toBeNull()
    expect(r!.mime).toBe('image/jpeg')
    expect(r!.base64).toBe(B64)
    expect(r!.bytes).toBeGreaterThan(0)
  })

  it('acepta PNG y WEBP', () => {
    expect(parseDataUrl(`data:image/png;base64,${B64}`)?.mime).toBe('image/png')
    expect(parseDataUrl(`data:image/webp;base64,${B64}`)?.mime).toBe('image/webp')
  })

  it('rechaza tipos que no son imagen permitida', () => {
    expect(parseDataUrl(`data:application/pdf;base64,${B64}`)).toBeNull()
    expect(parseDataUrl(`data:image/gif;base64,${B64}`)).toBeNull()
    expect(parseDataUrl(`data:text/html;base64,${B64}`)).toBeNull()
  })

  it('rechaza cadenas que no son data URL', () => {
    expect(parseDataUrl('https://ejemplo.com/foto.jpg')).toBeNull()
    expect(parseDataUrl('')).toBeNull()
    expect(parseDataUrl(null)).toBeNull()
    expect(parseDataUrl(123)).toBeNull()
  })

  it('rechaza base64 inválido', () => {
    expect(parseDataUrl('data:image/jpeg;base64,no-es-base64-válido!!')).toBeNull()
  })

  it('rechaza imágenes que superan el límite', () => {
    const grande = 'A'.repeat(Math.ceil((MAX_BYTES + 1024) / 3) * 4)
    expect(parseDataUrl(`data:image/jpeg;base64,${grande}`)).toBeNull()
  })
})
