'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
import { registroJovenSchema, RegistroJovenFormType } from '../../../utils/schemas'
import { validatorsColombia } from '@/utils/validators'
import apiClient from '@/utils/api-client'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CheckCircle2,
  UserPlus,
  User,
  CreditCard,
  Calendar,
  Phone,
  Shield,
  Award,
  Sparkles,
  Clock,
  CheckCircle,
  Circle,
  Loader2,
  Flag,
  ChevronRight,
  Info,
  ShieldCheck,
  MessageSquare,
  FileCheck,
  Scale
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RegistroResponse {
  status: 'success' | 'error'
  message?: string
  joven?: any
  error?: string
}

export default function RegistroPage() {
  const [loading, setLoading] = useState(false)
  const [completado, setCompletado] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const hasSubmittedRef = useRef(false)
  const componentKey = useRef(Date.now()).current
  const [isSubmitting, setIsSubmitting] = useState(false)

  // console.log('Component render, submitted:', submitted, 'loading:', loading, 'completado:', completado)
  console.log('Component render - completado:', completado, 'isSubmitting:', isSubmitting)

  useEffect(() => {
    console.log('Component mounted')
    return () => console.log('Component unmounted')
  }, [])

  const form = useForm<RegistroJovenFormType>({
    resolver: zodResolver(registroJovenSchema),
    defaultValues: {
      nombre_completo: '',
      fecha_nacimiento: '',
      celular: '',
      estados: [],
      consentimientos: {
        datos_personales: false,
      },
      edad: 0,
    },
    mode: 'onChange',
  })

  const { watch, setValue } = form
  const fechaNacimiento = watch('fecha_nacimiento')

  // Redirect when registration is completed
  useEffect(() => {
    if (completado) {
      console.log('Registration completed, redirecting in 3 seconds')
      const timer = setTimeout(() => {
        console.log('Redirecting to home')
        window.location.href = '/' // Use window.location instead of router.push
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [completado])

  // Auto-update age when birth date changes
  useEffect(() => {
    console.log('useEffect triggered, fechaNacimiento:', fechaNacimiento)
    if (fechaNacimiento && validatorsColombia.validateAgeRange(fechaNacimiento)) {
      const edad = validatorsColombia.calculateAge(fechaNacimiento)
      console.log('Setting edad to:', edad)
      setValue('edad', edad, { shouldValidate: true })
    }
  }, [fechaNacimiento, setValue])

  async function onSubmit(data: RegistroJovenFormType) {
    console.log('onSubmit called, isSubmitting:', isSubmitting, 'hasSubmittedRef:', hasSubmittedRef.current)
    if (isSubmitting || hasSubmittedRef.current) {
      console.log('onSubmit blocked: already submitting')
      return
    }

    try {
      console.log('onSubmit: setting isSubmitting to true')
      setIsSubmitting(true)
      hasSubmittedRef.current = true
      const celularFormateado = validatorsColombia.formatCelular(data.celular)

      const response = await apiClient.post<RegistroResponse>(
        '/auth/joven/registro',
        {
          ...data,
          celular: celularFormateado,
        }
      )

      console.log('API response received:', response.data)
      console.log('Response status:', response.status)
      console.log('Response data type:', typeof response.data)
      console.log('Response data keys:', Object.keys(response.data))

      if (response.data.status === 'success') {
        console.log('Registration successful, setting completado to true')
        setCompletado(true)
        toast.success('¡Registro completado exitosamente!')
        console.log('Toast shown and completado set to true')
      } else {
        console.log('Registration failed:', (response.data as any).message || (response.data as any).error)
        toast.error((response.data as any).message || (response.data as any).error || 'Error al procesar el registro')
        setIsSubmitting(false) // Allow retry on error
        hasSubmittedRef.current = false // Allow retry on error
      }
    } catch (error) {
      console.log('API call failed:', error)
      console.log('Error details:', {
        message: (error as any)?.message,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
        statusText: (error as any)?.response?.statusText
      })
      toast.error('Ocurrió un error inesperado. Inténtalo de nuevo.')
      setIsSubmitting(false) // Allow retry on error
      hasSubmittedRef.current = false // Allow retry on error
    }
  }

  // Calculate form completion percentage
  const completionPercentage = useMemo(() => {
    const fields = form.watch()
    const totalFields = 5 // nombre, fecha, celular, estados, 1 consentimiento
    let completedFields = 0
    if (fields.nombre_completo?.length >= 3) completedFields++
    if (fields.fecha_nacimiento && validatorsColombia.validateAgeRange(fields.fecha_nacimiento)) completedFields++
    if (fields.celular && validatorsColombia.validateCelular(fields.celular)) completedFields++
    if (fields.estados.length > 0) completedFields++
    if (fields.consentimientos.datos_personales) completedFields++

    return Math.round((completedFields / totalFields) * 100)
  }, [form])

  // Watch form fields for UI updates
  const watchedFields = form.watch()

  // Calculate completed fields for progress indicators
  const completedFields = useMemo(() => {
    let count = 0
    if (watchedFields.nombre_completo?.length >= 3) count++
    if (watchedFields.fecha_nacimiento && validatorsColombia.validateAgeRange(watchedFields.fecha_nacimiento)) count++
    if (watchedFields.celular && validatorsColombia.validateCelular(watchedFields.celular)) count++
    if (watchedFields.estados.length > 0) count++
    if (watchedFields.consentimientos.datos_personales) count++
    return count
  }, [watchedFields])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#F5A623]/20 selection:text-[#00338D] font-sans relative overflow-x-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#00338D_0.05,transparent_40%),radial-gradient(circle_at_bottom_left,#0066B3_0.05,transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />

        {/* Subtle Animated Glows for Light Mode */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F5A623]/5 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.15, 0.1],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#009FDA]/5 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-1 sm:px-4 py-6 md:py-20">
        <AnimatePresence mode="wait">
          {completado ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <div className="relative mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#F5A623] to-[#FFC857] flex items-center justify-center shadow-[0_0_50px_rgba(245,166,35,0.4)]"
                >
                  <CheckCircle2 className="w-16 h-16 text-[#1A1A1A]" strokeWidth={2.5} />
                </motion.div>

                {/* Decorative particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: Math.cos(i * 45) * 100,
                      y: Math.sin(i * 45) * 100
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#F5A623]"
                  />
                ))}
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-7xl font-black mb-6 tracking-tighter text-center text-slate-900 leading-tight px-4">
                ¡BIENVENIDO <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00338D] to-[#009FDA]">CONQUISTADOR</span>!
              </h2>

              <p className="text-lg md:text-xl text-slate-600 text-center max-w-xl mb-12 leading-relaxed font-medium px-4">
                Tu registro ha sido procesado con éxito. Ahora formas parte de este gran ejército que conquista para Cristo.
              </p>

              <Link href="/">
                <Button className="h-16 px-12 bg-[#00338D] text-white hover:bg-[#002266] transition-all rounded-2xl font-black text-lg gap-2 group shadow-xl shadow-blue-900/10">
                  EXPLORAR DASHBOARD
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_1.8fr] gap-6 lg:gap-12 items-start w-full overflow-x-hidden">
              {/* Left Column: Branding & Progress */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 md:space-y-12 lg:sticky top-20"
              >
                <div className="space-y-6">
                  <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#00338D] transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold tracking-wide uppercase text-xs">Volver al inicio</span>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00338D] to-[#0066B3] rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                        <Flag className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[#F5A623] font-black tracking-widest text-sm uppercase">Edición 2026</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-tight break-words px-2 lowercase first-letter:uppercase">
                      REGISTRO DE <br className="hidden sm:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009FDA] via-[#0066B3] to-[#00338D] uppercase">NUEVO JOVEN</span>
                    </h1>
                  </div>

                  <p className="text-sm md:text-lg text-slate-700 leading-relaxed max-w-md italic font-semibold px-2">
                    "Ninguno tenga en poco tu juventud, sino sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza."
                    <span className="block mt-2 font-black not-italic text-xs md:text-sm text-[#00338D]">1 Timoteo 4:12</span>
                  </p>
                </div>

                {/* Vertical Progress Steps */}
                <div className="space-y-6 md:space-y-8 pl-4">
                  {[
                    { label: 'Identidad Básica', done: completedFields >= 2 },
                    { label: 'Información de Contacto', done: completedFields >= 4 },
                    { label: 'Situación Espiritual', done: completedFields >= 5 },
                    { label: 'Consentimientos Legales', done: completedFields >= 6 },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 relative" id={`step-indicator-${idx}`}>
                      {idx < 3 && (
                        <div className={cn(
                          "absolute left-4 top-10 w-0.5 h-6 transition-colors duration-500",
                          step.done ? "bg-[#F5A623]" : "bg-white/10"
                        )} />
                      )}
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                        step.done
                          ? "bg-[#F5A623] border-[#F5A623] shadow-[0_0_15px_rgba(245,166,35,0.4)]"
                          : "border-slate-300 bg-white"
                      )}>
                        {step.done ? <CheckCircle className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-slate-300" />}
                      </div>
                      <span className={cn(
                        "font-bold transition-colors duration-500",
                        step.done ? "text-[#00338D]" : "text-slate-600"
                      )}>{step.label}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Wheel Info */}
                <div className="p-4 sm:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden group mx-2">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Info className="w-12 h-12" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-700">Completado</span>
                    <span className="text-2xl font-black text-[#F5A623]">{completionPercentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <motion.div
                      id="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      className="h-full bg-gradient-to-r from-[#F5A623] to-[#FFC857] rounded-full shadow-[0_0_10px_rgba(245,166,35,0.5)]"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Interactive Form */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white border-white/40 backdrop-blur-3xl rounded-[1.5rem] sm:rounded-[3rem] p-3 sm:p-8 md:p-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden w-full max-w-full">
                  <Form {...form}>
                    <form className="space-y-8 md:space-y-12">

                      {/* Section: Personal Info */}
                      <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-[#009FDA]/10 flex items-center justify-center border border-[#009FDA]/20 shadow-sm">
                            <User className="w-6 h-6 text-[#009FDA]" />
                          </div>
                          <div>
                            <h2 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 uppercase">Identidad Personal</h2>
                            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Información Básica del Conquistador</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                          <FormField
                            control={form.control}
                            name="nombre_completo"
                            render={({ field }: any) => (
                              <FormItem className="space-y-4 md:col-span-2">
                                <FormLabel className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Nombre Completo *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      id="nombre-field"
                                      placeholder="P. ej. Juan Aguilar"
                                      {...field}
                                      className="h-14 md:h-16 w-full px-4 md:px-6 bg-slate-50 border-slate-200 focus:border-[#00338D] focus:bg-white text-slate-900 rounded-xl md:rounded-2xl transition-all font-semibold placeholder:text-slate-400 focus:ring-4 focus:ring-[#00338D]/5 shadow-sm text-sm md:text-base"
                                      disabled={loading}
                                    />
                                    <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#00338D] transition-colors" />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500 text-[10px] font-bold uppercase tracking-wider" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="fecha_nacimiento"
                            render={({ field }: any) => (
                              <FormItem className="space-y-4">
                                <FormLabel className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Fecha de Nacimiento *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      id="fecha-nacimiento-field"
                                      type="date"
                                      {...field}
                                      className="h-14 md:h-16 w-full px-4 md:px-6 bg-slate-50 border-slate-200 focus:border-[#00338D] focus:bg-white text-slate-900 rounded-xl md:rounded-2xl transition-all [color-scheme:light] focus:ring-4 focus:ring-[#00338D]/5 shadow-sm font-semibold text-sm md:text-base"
                                      disabled={loading}
                                    />
                                    <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#00338D] transition-colors pointer-events-none" />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500 text-[10px] font-bold uppercase tracking-wider" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="celular"
                            render={({ field }: any) => (
                              <FormItem className="space-y-4 md:col-span-2">
                                <FormLabel className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Celular de Contacto *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      id="celular-field"
                                      placeholder="300 000 0000"
                                      {...field}
                                      className="h-14 md:h-16 w-full px-4 md:px-6 bg-slate-50 border-slate-200 focus:border-[#00338D] focus:bg-white text-slate-900 rounded-2xl transition-all font-semibold placeholder:text-slate-400 focus:ring-4 focus:ring-[#00338D]/5 shadow-sm text-sm sm:text-base"
                                      disabled={loading}
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                      <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter transition-colors group-focus-within:text-[#00338D]">+57</span>
                                      <Phone className="w-5 h-5 text-slate-300 group-focus-within:text-[#00338D] transition-colors" />
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500 text-[10px] font-bold uppercase tracking-wider" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </section>

                      {/* Section: Ministerial Status */}
                      <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 flex items-center justify-center border border-[#F5A623]/20">
                            <Award className="w-5 h-5 text-[#F5A623]" />
                          </div>
                          <h2 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 uppercase">Situación Espiritual</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                          {[
                            { name: 'Bautizado', icon: Sparkles, color: '#0066B3' },
                            { name: 'Sellado', icon: CheckCircle, color: '#009FDA' },
                            { name: 'Servidor', icon: Award, color: '#F5A623' },
                            { name: 'Simpatizante', icon: Circle, color: '#00338D' }
                          ].map((estado) => {
                            const isSelected = watchedFields.estados.includes(estado.name)
                            const Icon = estado.icon

                            return (
                              <div
                                key={estado.name}
                                onClick={() => {
                                  const current = form.getValues('estados')
                                  const exists = current.includes(estado.name)
                                  if (exists) {
                                    setValue('estados', current.filter(e => e !== estado.name), { shouldValidate: true })
                                  } else {
                                    setValue('estados', [...current, estado.name], { shouldValidate: true })
                                  }
                                }}
                                className={cn(
                                  "relative p-2.5 sm:p-5 rounded-[1.2rem] sm:rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 sm:gap-4 transition-all cursor-pointer group hover:scale-105 active:scale-95",
                                  isSelected
                                    ? "bg-blue-50/50 border-[#00338D] shadow-xl shadow-blue-900/5 scale-[1.02]"
                                    : "bg-slate-50 border-slate-100 hover:border-slate-200"
                                )}
                              >
                                <div className={cn(
                                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all shadow-inner",
                                  isSelected ? "bg-[#00338D] text-white" : "bg-white text-slate-300 group-hover:bg-slate-100"
                                )}>
                                  <Icon className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                  "text-[9px] sm:text-[10px] font-black uppercase tracking-tighter text-center leading-tight sm:leading-none break-all",
                                  isSelected ? "text-[#00338D]" : "text-slate-400"
                                )}>
                                  {estado.name}
                                </span>
                                {isSelected && (
                                  <div
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#00338D] rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </section>

                      {/* Section: Legal */}
                      <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-[#00338D]/20 flex items-center justify-center border border-[#00338D]/20">
                            <ShieldCheck className="w-5 h-5 text-[#0066B3]" />
                          </div>
                          <h2 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 uppercase">Validación Legal</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {[
                            { id: 'datos_personales', label: 'Tratamiento de Datos', desc: 'Ley 1581 de 2012', icon: ShieldCheck },
                          ].map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name={`consentimientos.${item.id}` as any}
                              render={({ field }: any) => (
                                <FormItem
                                  onClick={() => field.onChange(!field.value)}
                                  className={cn(
                                    "flex items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all cursor-pointer group",
                                    field.value
                                      ? "bg-blue-50/50 border-[#00338D] shadow-lg shadow-blue-900/5 rotate-[0.5deg]"
                                      : "bg-slate-50 border-slate-100 hover:border-slate-200"
                                  )}
                                >
                                  <FormControl>
                                    <div className={cn(
                                      "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm",
                                      field.value ? "bg-[#00338D] border-[#00338D] scale-110" : "bg-white border-slate-200"
                                    )}>
                                      {field.value && <CheckCircle2 className="w-5 h-5 text-white" />}
                                    </div>
                                  </FormControl>
                                  <div className="flex-1 space-y-0.5 pointer-events-none">
                                    <p className={cn(
                                      "text-sm font-black uppercase tracking-tight",
                                      field.value ? "text-[#00338D]" : "text-slate-500"
                                    )}>{item.label}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{item.desc}</p>
                                  </div>
                                  <item.icon className={cn(
                                    "w-6 h-6 transition-colors",
                                    field.value ? "text-[#00338D]" : "text-slate-200"
                                  )} />
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </section>

                      {/* Final Action */}
                      <div className="pt-8 relative">
                        <div className="absolute inset-x-0 -top-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <Button
                          id="submit-registration"
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={loading || isSubmitting}
                          className="w-full h-16 md:h-20 bg-[#F5A623] hover:bg-[#FFC857] text-[#1A1A1A] font-black text-xl md:text-2xl rounded-[1.2rem] md:rounded-[1.5rem] transition-all shadow-[0_15px_50px_rgba(245,166,35,0.4)] hover:shadow-[0_20px_70px_rgba(245,166,35,0.5)] disabled:opacity-30 disabled:scale-100 scale-100 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-4 group"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-8 h-8 animate-spin" />
                              PROCESANDO...
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-8 h-8 mr-2" />
                              UNIRSE A CONQUISTADORES
                              <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                            </>
                          )}
                        </Button>

                        <div className="mt-10 flex flex-col items-center gap-2">
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">IPUC UNÁNIMES 2026</p>
                        </div>
                      </div>

                    </form>
                  </Form>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Corporate Footer */}
      <footer className="relative z-10 py-16 border-t border-slate-200 mt-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 opacity-70 hover:opacity-100 transition-opacity duration-1000">
          <div className="flex flex-col gap-2 items-center md:items-start text-slate-900">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-[#F5A623]" />
              <span className="font-black tracking-[0.2em] text-[#00338D]">CONQUISTADORES</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Sistema de Gestión de Talento Espiritual</p>
          </div>

          <div className="flex gap-12 items-center">
            <div className="flex flex-col items-end gap-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Unánimes en la Fe</p>
              <p className="text-[9px] font-black text-[#0066B3] uppercase tracking-widest">Efesios 4:3-6</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shadow-sm" />
          </div>
        </div>
      </footer>
    </div>
  )
}
