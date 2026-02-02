'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '../utils/api-client'
import type { Joven } from '../types'
import type { ApiResponse } from '../types/index'

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

export interface UseCumpleanosReturn {
  isLoading: boolean
  error: Error | null
  cumpleanosHoy: CumpleanosDetalle[]
  cumpleanosSemana: CumpleanosPorDia[]
  estadisticasMes: CumpleanosStats
  jovenesPorMes: CumpleanosDetalle[]
  proximos30: CumpleanosProximos30[]
  totalJovenes: number
}

const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const birth = new Date(birthDate + 'T00:00:00Z')
  let age = todayUTC.getUTCFullYear() - birth.getUTCFullYear()
  const monthDiff = todayUTC.getUTCMonth() - birth.getUTCMonth()
  if (monthDiff < 0 || (monthDiff === 0 && todayUTC.getUTCDate() < birth.getUTCDate())) {
    age--
  }
  return age
}

const getJovenesParaHoy = (jovenes: Joven[]): CumpleanosDetalle[] => {
  const today = new Date()
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  return jovenes
    .filter((joven) => {
      if (!joven.fecha_nacimiento) return false
      const birth = new Date(joven.fecha_nacimiento + 'T00:00:00Z')
      return (
        birth.getUTCMonth() === todayUTC.getUTCMonth() &&
        birth.getUTCDate() === todayUTC.getUTCDate()
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
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const diasDelaSemana = []

  for (let i = 1; i <= 7; i++) {
    const fechaUTC = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() + i))

    const jovenesdel = jovenes
      .filter((joven) => {
        if (!joven.fecha_nacimiento) return false
        const birth = new Date(joven.fecha_nacimiento + 'T00:00:00Z')
        return (
          birth.getUTCMonth() === fechaUTC.getUTCMonth() &&
          birth.getUTCDate() === fechaUTC.getUTCDate()
        )
      })
      .map((joven) => ({
        id: joven.id,
        nombre_completo: joven.nombre_completo,
        edad: calculateAge(joven.fecha_nacimiento),
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
      const nombreDia = nombresDias[fechaUTC.getUTCDay()]
      
      // Formato UTC YYYY-MM-DD
      const year = fechaUTC.getUTCFullYear()
      const month = String(fechaUTC.getUTCMonth() + 1).padStart(2, '0')
      const day = String(fechaUTC.getUTCDate()).padStart(2, '0')
      const fechaFormato = `${year}-${month}-${day}`

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
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const mesActual = todayUTC.getUTCMonth()

  const cumpleanerosMes = jovenes.filter((joven) => {
    if (!joven.fecha_nacimiento) return false
    const birth = new Date(joven.fecha_nacimiento + 'T00:00:00Z')
    return birth.getUTCMonth() === mesActual
  })

  return {
    totalEnMes: cumpleanerosMes.length,
    enviados: Math.floor(cumpleanerosMes.length * 0.67), // Simulado
    pendientes: cumpleanerosMes.length - Math.floor(cumpleanerosMes.length * 0.67),
  }
}

const getJovenesPorMes = (jovenes: Joven[]): CumpleanosDetalle[] => {
  const today = new Date()
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const mesActual = todayUTC.getUTCMonth()

  return jovenes
    .filter((joven) => {
      if (!joven.fecha_nacimiento) return false
      const birth = new Date(joven.fecha_nacimiento + 'T00:00:00Z')
      return birth.getUTCMonth() === mesActual
    })
    .map((joven) => ({
      id: joven.id,
      nombre_completo: joven.nombre_completo,
      edad: calculateAge(joven.fecha_nacimiento),
      celular: joven.celular,
      fecha_nacimiento: joven.fecha_nacimiento,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.fecha_nacimiento + 'T00:00:00Z')
      const dateB = new Date(b.fecha_nacimiento + 'T00:00:00Z')
      return dateA.getUTCDate() - dateB.getUTCDate()
    })
}

const getProximos30Dias = (jovenes: Joven[]): CumpleanosProximos30[] => {
  const today = new Date()
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const diasProximos: CumpleanosProximos30[] = []

  const jovenasConFecha = jovenes
    .filter((joven) => joven.fecha_nacimiento)
    .map((joven) => {
      const birth = new Date(joven.fecha_nacimiento + 'T00:00:00Z')
      let proxCumple = new Date(Date.UTC(todayUTC.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate()))

      if (proxCumple < todayUTC) {
        proxCumple = new Date(Date.UTC(
          todayUTC.getUTCFullYear() + 1,
          birth.getUTCMonth(),
          birth.getUTCDate()
        ))
      }

      const diasRestantes = Math.floor(
        (proxCumple.getTime() - todayUTC.getTime()) / (1000 * 60 * 60 * 24)
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
      const response = await apiClient.get<ApiResponse<Joven[]>>('/jovenes')
      return response.data?.data || []
    },
  })

  // Calcular datos procesados
  const cumpleanosHoy = getJovenesParaHoy(jovenes)
  const cumpleanosSemana = getJovenesParaLaSemana(jovenes)
  const estadisticasMes = getEstadisticasMes(jovenes)
  const jovenesPorMes = getJovenesPorMes(jovenes)
  const proximos30 = getProximos30Dias(jovenes)

  return {
    isLoading,
    error,
    cumpleanosHoy,
    cumpleanosSemana,
    estadisticasMes,
    jovenesPorMes,
    proximos30,
    totalJovenes: jovenes.length,
  }
}