'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, LoginFormType } from '@/utils/schemas'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(data: LoginFormType) {
    try {
      const result = await login(data.email, data.password)

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('email', data.email)
        }
        toast.success('¡Bienvenido de nuevo!')
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Credenciales incorrectas')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0f18] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F5A623]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        {/* Header / Brand */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-20 w-20 bg-gradient-to-br from-[#0066B3] to-[#00338D] rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6 relative group"
          >
            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <ShieldCheck size={42} className="text-white relative z-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold text-white tracking-tight text-center"
          >
            Conquistadores
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mt-2 font-medium tracking-wide"
          >
            SISTEMA DE GESTIÓN MISIONAL
          </motion.p>
        </div>

        {/* Login Card */}
        <div className="relative group">
          {/* Glowing Border Effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-white/10 to-[#F5A623]/30 rounded-[2rem] blur-[2px] opacity-75" />

          <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden">
            {/* Soft inner glow */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
              <p className="text-slate-400 text-sm mt-1">Ingresa tus credenciales para continuar</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">Email</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Mail size={18} />
                          </div>
                          <Input
                            placeholder="admin@conquistadores.com"
                            type="email"
                            {...field}
                            className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-blue-500/50 transition-all rounded-xl"
                            disabled={loading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs mt-1 ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-1">
                        <FormLabel className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">Contraseña</FormLabel>
                        <Link
                          href="/recuperar-contrasena"
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Lock size={18} />
                          </div>
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="h-12 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-blue-500/50 transition-all rounded-xl"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs mt-1 ml-1" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={loading}
                    className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
                  >
                    Mantener sesión iniciada
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 group transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Ingresar al Sistema</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-sm text-slate-500">
                ¿Aún no eres parte del equipo?{' '}
                <Link
                  href="/registro"
                  className="text-white font-bold hover:text-[#F5A623] transition-colors relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:origin-right hover:after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-[11px] text-slate-600 uppercase tracking-[0.3em] font-bold">
            IPUC Unánimes • Gestión Versión 3.0
          </p>
          <p className="text-[10px] text-slate-700 mt-2">
            Desarrollado con excelencia para el servicio del Reino
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
