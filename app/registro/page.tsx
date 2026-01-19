'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { registroJovenSchema, RegistroJovenFormType } from '@/utils/schemas'
import { validatorsColombia } from '@/utils/validators'
import apiClient from '@/utils/api-client'
import { toast } from 'sonner'

interface RegistroResponse {
  success: boolean
  data?: { id: string }
  error?: string
}

export default function RegistroPage() {
  const [loading, setLoading] = useState(false)
  const [completado, setCompletado] = useState(false)
  const [cedulaDisponible, setCedulaDisponible] = useState(true)

  const form = useForm<RegistroJovenFormType>({
    resolver: zodResolver(registroJovenSchema),
    defaultValues: {
      nombre: '',
      fecha_nacimiento: '',
      edad: 0,
      cedula: '',
      celular: '',
      estados: [],
      consentimientos: {
        datos_personales: false,
        whatsapp: false,
        procesamiento: false,
        terminos: false,
      },
    },
    mode: 'onChange',
  })

  // Watch for birth date changes to calculate age
  const fechaNacimiento = form.watch('fecha_nacimiento')
  const cedula = form.watch('cedula')

  // Auto-update age
  useState(() => {
    if (fechaNacimiento) {
      const edad = validatorsColombia.calculateAge(fechaNacimiento)
      form.setValue('edad', edad)
    }
  })

  // Validate cedula availability
  useState(() => {
    const validateCedula = async () => {
      if (cedula && validatorsColombia.validateCedula(cedula)) {
        try {
          const response = await apiClient.get(
            `/api/joven/cedula/${cedula}`
          )
          setCedulaDisponible(!response.data.existe)
        } catch {
          setCedulaDisponible(true)
        }
      }
    }

    const timer = setTimeout(validateCedula, 500)
    return () => clearTimeout(timer)
  })

  async function onSubmit(data: RegistroJovenFormType) {
    try {
      setLoading(true)

      // Format celular
      const celularFormateado = validatorsColombia.formatCelular(data.celular)

      const response = await apiClient.post<RegistroResponse>(
        '/api/joven/registro',
        {
          ...data,
          celular: celularFormateado,
        }
      )

      if (response.data.success) {
        toast.success('¡Registro completado exitosamente!')
        setCompletado(true)
      } else {
        toast.error(response.data.error || 'Error al registrar')
      }
    } catch (error) {
      toast.error('Error inesperado al registrar')
    } finally {
      setLoading(false)
    }
  }

  if (completado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00338D] via-[#0066B3] to-[#009FDA] flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            ¡Registro Exitoso!
          </h2>
          <p className="text-white mb-6">
            Tu registro ha sido completado. En breve te contactaremos con más
            información.
          </p>
          <Link href="/">
            <Button className="bg-[#F5A623] hover:bg-[#e6951a] text-[#1A1A1A] font-semibold">
              Volver al Inicio
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00338D] via-[#0066B3] to-[#009FDA] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🏴 Conquistadores
          </h1>
          <p className="text-slate-300">Formulario de Registro</p>
        </div>

        {/* Registration Card */}
        <Card className="p-8 bg-slate-800 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            Regístrate como Joven
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Row 1: Nombre y Cédula */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">
                        Nombre Completo *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan Pérez"
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">
                        Cédula *{!cedulaDisponible && '(Ya existe)'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12345678"
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Fecha Nacimiento y Edad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fecha_nacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">
                        Fecha de Nacimiento *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="edad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Edad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Celular */}
              <FormField
                control={form.control}
                name="celular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">
                      Celular (+57) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="300 1234567"
                        {...field}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        disabled={loading}
                      />
                    </FormControl>
                    <p className="text-xs text-slate-400">
                      Formato: +57 con 10 dígitos
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estados */}
              <FormField
                control={form.control}
                name="estados"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-slate-200">
                      Tu estado espiritual *
                    </FormLabel>
                    <div className="space-y-3 mt-3">
                      {['Bautizado', 'Sellado', 'Servidor', 'Simpatizante'].map(
                        (estado) => (
                          <div key={estado} className="flex items-center space-x-2">
                            <Checkbox
                              id={estado}
                              checked={form.watch('estados').includes(estado)}
                              onCheckedChange={(checked) => {
                                const currentEstados = form.watch('estados')
                                if (checked) {
                                  form.setValue('estados', [
                                    ...currentEstados,
                                    estado,
                                  ])
                                } else {
                                  form.setValue(
                                    'estados',
                                    currentEstados.filter((e) => e !== estado)
                                  )
                                }
                              }}
                              disabled={loading}
                              className="border-slate-600"
                            />
                            <label
                              htmlFor={estado}
                              className="text-sm text-slate-300 cursor-pointer"
                            >
                              {estado}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Consentimientos */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="font-semibold text-white">Consentimientos *</h3>

                {[
                  {
                    id: 'datos_personales' as const,
                    label: 'Autorizo el tratamiento de mis datos personales',
                  },
                  {
                    id: 'whatsapp' as const,
                    label: 'Autorizo recibir mensajes por WhatsApp',
                  },
                  {
                    id: 'procesamiento' as const,
                    label: 'Autorizo el procesamiento de información',
                  },
                  {
                    id: 'terminos' as const,
                    label: 'Acepto los términos y condiciones',
                  },
                ].map((consent) => (
                  <FormField
                    key={consent.id}
                    control={form.control}
                    name={`consentimientos.${consent.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={loading}
                              className="border-slate-600 mt-1"
                            />
                          </FormControl>
                          <label className="text-sm text-slate-300 cursor-pointer leading-relaxed">
                            {consent.label}
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-[#F5A623] hover:bg-[#e6951a] text-[#1A1A1A] font-semibold mt-6"
                disabled={loading || !cedulaDisponible}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-[#F5A623] hover:text-[#e6951a]">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
