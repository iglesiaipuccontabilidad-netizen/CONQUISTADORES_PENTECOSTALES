'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Joven } from '../types'

export interface CumpleanosHoy {
  jovenes: Joven[]
  total: number
}

export interface CumpleanosDetalle {
  id: string
  nombre_completo: string
  edad: number
  celular: string
  fecha_nacimiento: string
}

export interface CumpleanosPorDia {
  dia: string
  fecha: string
  jovenes: CumpleanosDetalle[]
}

export interface CumpleanosStats {
  totalEnMes: number
  enviados: number
  pendientes: number
}

export interface CumpleanosProximos30 {
  id: string
  nombre_completo: string
  fecha_nacimiento: string
  dias: number
}

const calculateAge = (birthDate: string, atDate?: Date): number => {
  const birth = new Date(birthDate)
  return 2026 - birth.getFullYear()
}

const getJovenesParaHoy = (jovenes: Joven[]): CumpleanosDetalle[] => {
  const today = new Date()
  return jovenes
    .filter((joven) => {
      if (!joven.fecha_nacimiento) return false
      const birth = new Date(joven.fecha_nacimiento)
      return (
        birth.getMonth() === today.getMonth() &&
        birth.getDate() === today.getDate()
      )
    })
    .map((joven) => ({
      id: joven.id,
      nombre_completo: joven.nombre_completo,
      edad: calculateAge(joven.fecha_nacimiento),
      celular: joven.celular,
      fecha_nacimiento: joven.fecha_nacimiento,
    }))
}

const getJovenesParaLaSemana = (jovenes: Joven[]): CumpleanosPorDia[] => {
  const today = new Date()
  const diasDelaSemana = []

  for (let i = 1; i <= 6; i++) {
    const fecha = new Date(today)
    fecha.setDate(fecha.getDate() + i)

    const jovenesdel = jovenes
      .filter((joven) => {
        if (!joven.fecha_nacimiento) return false
        const birth = new Date(joven.fecha_nacimiento)
        return (
          birth.getMonth() === fecha.getMonth() &&
          birth.getDate() === fecha.getDate()
        )
      })
      .map((joven) => ({
        id: joven.id,
        nombre_completo: joven.nombre_completo,
        edad: calculateAge(joven.fecha_nacimiento, fecha),
        celular: joven.celular,
        fecha_nacimiento: joven.fecha_nacimiento,
      }))

    if (jovenesdel.length > 0) {
      const nombresDias = [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
      ]
      const nombreDia = nombresDias[fecha.getDay()]
      const fechaFormato = fecha.toISOString().split('T')[0]

      diasDelaSemana.push({
        dia: nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1),
        fecha: fechaFormato,
        jovenes: jovenesdel,
      })
    }
  }

  return diasDelaSemana
}

const getEstadisticasMes = (jovenes: Joven[]): CumpleanosStats => {
  const today = new Date()
  const mesActual = today.getMonth()

  const cumpleanerosMes = jovenes.filter((joven) => {
    if (!joven.fecha_nacimiento) return false
    const birth = new Date(joven.fecha_nacimiento)
    return birth.getMonth() === mesActual
  })

  return {
    totalEnMes: cumpleanerosMes.length,
    enviados: Math.floor(cumpleanerosMes.length * 0.67), // Simulado
    pendientes: cumpleanerosMes.length - Math.floor(cumpleanerosMes.length * 0.67),
  }
}

const getProximos30Dias = (jovenes: Joven[]): CumpleanosProximos30[] => {
  const today = new Date()
  const diasProximos: CumpleanosProximos30[] = []

  const jovenasConFecha = jovenes
    .filter((joven) => joven.fecha_nacimiento)
    .map((joven) => {
      const birth = new Date(joven.fecha_nacimiento)
      let proxCumple = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())

      if (proxCumple < today) {
        proxCumple = new Date(
          today.getFullYear() + 1,
          birth.getMonth(),
          birth.getDate()
        )
      }

      const diasRestantes = Math.floor(
        (proxCumple.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      return {
        id: joven.id,
        nombre_completo: joven.nombre_completo,
        fecha_nacimiento: joven.fecha_nacimiento,
        dias: diasRestantes,
      }
    })

  return jovenasConFecha
    .filter((j) => j.dias <= 30)
    .sort((a, b) => a.dias - b.dias)
}

export const useCumpleanos = () => {
  // Obtener todos los jóvenes
  const { data: jovenes = [], isLoading, error } = useQuery<Joven[]>({
    queryKey: ['cumpleanos-jovenes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('jovenes').select('*')
      if (error) throw error
      return data || []
    },
  })

  // Calcular datos procesados
  const cumpleanosHoy = getJovenesParaHoy(jovenes)
  const cumpleanosSemana = getJovenesParaLaSemana(jovenes)
  const estadisticasMes = getEstadisticasMes(jovenes)
  const proximos30 = getProximos30Dias(jovenes)

  return {
    isLoading,
    error,
    cumpleanosHoy,
    cumpleanosSemana,
    estadisticasMes,
    proximos30,
    totalJovenes: jovenes.length,
  }
}
