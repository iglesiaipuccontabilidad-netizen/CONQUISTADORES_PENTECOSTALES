'use client'

import { useState, useEffect } from 'react'
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
import { registroJovenSchema, RegistroJovenFormType } from '@/utils/schemas'
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
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RegistroResponse {
  success: boolean
  data?: { id: string }
  error?: string
}

export default function RegistroPage() {
  const [loading, setLoading] = useState(false)
  const [completado, setCompletado] = useState(false)
  const router = useRouter()

  const form = useForm<RegistroJovenFormType>({
    resolver: zodResolver(registroJovenSchema),
    defaultValues: {
      nombre_completo: '',
      fecha_nacimiento: '',
      edad: 0,
      celular: '',
      estados: [],
      consentimientos: {
        datos_personales: false,
      },
    },
    mode: 'onChange',
  })

  const { watch } = form

  async function onSubmit(data: RegistroJovenFormType) {
    try {
      setLoading(true)

      const response = await apiClient.post<RegistroResponse>(
        '/api/joven/registro',
        data
      )

      if (response.data.success) {
        setCompletado(true)
        toast.success('¡Registro completado exitosamente!')
        setTimeout(() => router.push('/'), 3000)
      } else {
        toast.error(response.data.error || 'Error al procesar el registro')
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate form completion percentage
  const watchedFields = form.watch()
  const totalFields = 1
  let completedFields = 0
  if (watchedFields.consentimientos.datos_personales) completedFields++

  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white selection:bg-[#F5A623]/30 selection:text-white font-sans relative overflow-x-hidden">
      {/* Premium Background Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#00338D_0%,transparent_40%),radial-gradient(circle_at_bottom_left,#0066B3_0%,transparent_40%)] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />

        {/* Animated Glows */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F5A623]/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#009FDA]/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20">
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

              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-center">
                ¡BIENVENIDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-[#FFC857]">CONQUISTADOR</span>!
              </h2>

              <p className="text-xl text-slate-400 text-center max-w-xl mb-12 leading-relaxed">
                Tu registro ha sido procesado con éxito. Ahora formas parte de este gran ejército que conquista para Cristo.
              </p>

              <Link href="/">
                <Button className="h-16 px-12 bg-white text-black hover:bg-slate-200 transition-all rounded-2xl font-black text-lg gap-2 group">
                  EXPLORAR DASHBOARD
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
              {/* Left Column: Branding & Progress */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12 sticky top-20"
              >
                <div className="space-y-6">
                  <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold tracking-wide uppercase text-xs">Volver al inicio</span>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00338D] to-[#0066B3] rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                        <Flag className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[#F5A623] font-black tracking-widest text-sm uppercase">Edición 2025-2027</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter leading-tight">
                      REGISTRO DE <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009FDA] via-[#0066B3] to-[#00338D]">NUEVO JOVEN</span>
                    </h1>
                  </div>

                  <p className="text-lg text-slate-400 leading-relaxed max-w-md italic">
                    "Ninguno tenga en poco tu juventud, sino sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza."
                    <span className="block mt-2 font-bold not-italic text-sm text-[#009FDA]">1 Timoteo 4:12</span>
                  </p>
                </div>

                {/* Vertical Progress Steps */}
                <div className="space-y-8 pl-4">
                  {[
                    { label: 'Información Básica', done: completedFields >= 2 },
                    { label: 'Contacto y Edad', done: completedFields >= 4 },
                    { label: 'Situación Espiritual', done: completedFields >= 5 },
                    { label: 'Validación Legal', done: completedFields >= 6 },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 relative">
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
                          : "border-white/20 bg-transparent"
                      )}>
                        {step.done ? <CheckCircle className="w-4 h-4 text-black" /> : <Circle className="w-4 h-4 text-white/20" />}
                      </div>
                      <span className={cn(
                        "font-bold transition-colors duration-500",
                        step.done ? "text-white" : "text-slate-500"
                      )}>{step.label}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Wheel Info */}
                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Info className="w-12 h-12" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Completado</span>
                    <span className="text-2xl font-black text-[#F5A623]">{completionPercentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
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
                <Card className="bg-white/[0.04] border-white/10 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">



                      {/* Section: Legal */}
                      <section className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-[#00338D]/20 flex items-center justify-center border border-[#00338D]/20">
                            <ShieldCheck className="w-5 h-5 text-[#0066B3]" />
                          </div>
                          <h3 className="text-xl font-black tracking-tight text-white uppercase">Validación y Consentimiento</h3>
                        </div>

                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                          <FormField
                            control={form.control}
                            name="consentimientos.datos_personales"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-4 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="w-6 h-6 border-white/20 data-[state=checked]:bg-[#F5A623] data-[state=checked]:border-[#F5A623]"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-bold text-slate-300 cursor-pointer hover:text-white transition-colors">
                                    Autorizo el tratamiento de mis datos personales
                                  </FormLabel>
                                  <p className="text-[10px] text-slate-600 uppercase font-bold">Ley 1581 de 2012</p>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </section>

                      {/* Final Action */}
                      <div className="pt-6 relative">
                        <div className="absolute inset-x-0 -top-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-20 bg-[#F5A623] hover:bg-[#FFC857] text-[#1A1A1A] font-black text-xl rounded-2xl transition-all shadow-[0_15px_40px_rgba(245,166,35,0.3)] hover:shadow-[0_20px_50px_rgba(245,166,35,0.4)] disabled:opacity-30 flex items-center justify-center gap-4 group"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-6 h-6 animate-spin" />
                              PROCESANDO...
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-6 h-6" />
                              COMPLETAR INSCRIPCIÓN
                              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>

                        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                          ¿Ya estás registrado?{' '}
                          <Link href="/login" className="text-[#009FDA] hover:text-white transition-colors font-black uppercase tracking-tighter underline underline-offset-4 decoration-2">
                            Inicia Sesión aquí
                          </Link>
                        </p>
                      </div>

                    </form>
                  </Form>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 py-12 text-center border-t border-white/5">
        <div className="flex flex-col items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">
            Conquistadores Pentecostales © 2025
          </p>
          <div className="flex gap-8 items-center">
            <span className="w-12 h-px bg-white/20" />
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10" />
            <span className="w-12 h-px bg-white/20" />
          </div>
        </div>
      </footer>
    </div>
  )
}
