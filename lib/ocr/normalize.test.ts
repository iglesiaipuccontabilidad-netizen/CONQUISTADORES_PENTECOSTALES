import { describe, it, expect } from 'vitest'
import { normalizarCelular, normalizarFecha, normalizarResultado } from './normalize'

describe('normalizarCelular', () => {
  it('acepta 10 dígitos limpios', () => {
    expect(normalizarCelular('3001234567')).toBe('3001234567')
  })

  it('quita el indicativo +57 y los espacios', () => {
    expect(normalizarCelular('+57 300 123 4567')).toBe('3001234567')
  })

  it('quita guiones y paréntesis', () => {
    expect(normalizarCelular('(300) 123-4567')).toBe('3001234567')
  })

  it('rechaza números cortos', () => {
    expect(normalizarCelular('300123456')).toBeNull()
  })

  it('rechaza números largos', () => {
    expect(normalizarCelular('30012345678')).toBeNull()
  })

  it('rechaza null y valores que no son texto', () => {
    expect(normalizarCelular(null)).toBeNull()
    expect(normalizarCelular(3001234567)).toBeNull()
  })
})

describe('normalizarFecha', () => {
  it('acepta una fecha válida en YYYY-MM-DD', () => {
    expect(normalizarFecha('2008-03-15')).toBe('2008-03-15')
  })

  it('rechaza fechas imposibles', () => {
    expect(normalizarFecha('2008-13-45')).toBeNull()
  })

  it('rechaza el 31 de febrero en vez de correrlo a marzo', () => {
    expect(normalizarFecha('2008-02-31')).toBeNull()
  })

  it('rechaza años fuera de un rango de edad razonable', () => {
    expect(normalizarFecha('1850-01-01')).toBeNull()
  })

  it('rechaza otros formatos', () => {
    expect(normalizarFecha('15/03/2008')).toBeNull()
    expect(normalizarFecha(null)).toBeNull()
  })
})

describe('normalizarResultado', () => {
  it('normaliza una respuesta completa y no reporta faltantes', () => {
    const r = normalizarResultado({
      nombre_completo: '  Juan Pérez  ',
      celular: '+57 300 123 4567',
      fecha_nacimiento: '2008-03-15',
      direccion: 'Calle 123 #45-67',
      bautizado: true,
      sellado: false,
      servidor: false,
      simpatizante: true,
    })

    expect(r.data.nombre_completo).toBe('Juan Pérez')
    expect(r.data.celular).toBe('3001234567')
    expect(r.data.fecha_nacimiento).toBe('2008-03-15')
    expect(r.data.bautizado).toBe(true)
    expect(r.data.simpatizante).toBe(true)
    expect(r.campos_no_leidos).toEqual([])
  })

  it('reporta los campos ilegibles y los deja vacíos en vez de sucios', () => {
    const r = normalizarResultado({
      nombre_completo: 'Ana Gómez',
      celular: 'ilegible',
      fecha_nacimiento: null,
      direccion: null,
    })

    expect(r.data.nombre_completo).toBe('Ana Gómez')
    expect(r.data.celular).toBe('')
    expect(r.data.fecha_nacimiento).toBe('')
    expect(r.data.direccion).toBe('')
    expect(r.campos_no_leidos).toContain('celular')
    expect(r.campos_no_leidos).toContain('fecha_nacimiento')
  })

  it('no reporta la dirección porque es opcional', () => {
    const r = normalizarResultado({
      nombre_completo: 'Ana Gómez',
      celular: '3001234567',
      fecha_nacimiento: '2008-03-15',
      direccion: null,
    })
    expect(r.campos_no_leidos).toEqual([])
  })

  it('trata como false cualquier casilla que no sea exactamente true', () => {
    const r = normalizarResultado({ bautizado: 'sí', sellado: 1, servidor: null })
    expect(r.data.bautizado).toBe(false)
    expect(r.data.sellado).toBe(false)
    expect(r.data.servidor).toBe(false)
  })

  it('nunca devuelve consentimiento, aunque el modelo lo mande', () => {
    const r = normalizarResultado({ consentimiento_datos_personales: true })
    expect('consentimiento_datos_personales' in r.data).toBe(false)
  })

  it('sobrevive a basura total sin lanzar excepción', () => {
    expect(() => normalizarResultado(null)).not.toThrow()
    expect(() => normalizarResultado('texto')).not.toThrow()
  })
})
