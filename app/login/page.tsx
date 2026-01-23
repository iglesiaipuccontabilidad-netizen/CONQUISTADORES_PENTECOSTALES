'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
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
import { ArrowLeft, LockKeyhole, Mail, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const [rememberMe, setRememberMe] = useState(false)

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
        toast.success('¡Iniciaste sesión correctamente!')
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Error al iniciar sesión')
      }
    } catch (error) {
      toast.error('Error inesperado al iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] relative overflow-hidden font-sans flex flex-col items-center justify-center p-4 selection:bg-[#F5A623]/30">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00338D] blur-[140px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
          <h1 className="text-5xl font-black text-white tracking-tight">
            CONQUISTA<span className="text-[#F5A623]">DORES</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide prose-sm uppercase opacity-60">Portal de Gestión Ministerial</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 md:p-10 bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <LogIn className="w-20 h-20 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-8 tracking-tight flex items-center">
              Acceso <span className="text-[#F5A623] ml-2">Personal</span>
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-slate-200 font-semibold ml-1 flex items-center">
                        <Mail className="w-4 h-4 mr-2 opacity-50" />
                        Correo Electrónico
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tu@email.com"
                          type="email"
                          {...field}
                          className="h-14 bg-white/5 border-white/10 focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 text-white rounded-2xl transition-all"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-slate-200 font-semibold ml-1 flex items-center">
                        <LockKeyhole className="w-4 h-4 mr-2 opacity-50" />
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                          className="h-14 bg-white/5 border-white/10 focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 text-white rounded-2xl transition-all"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between px-1">
                  {/* Remember Me */}
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={loading}
                      className="border-white/20 data-[state=checked]:bg-[#F5A623] data-[state=checked]:border-[#F5A623]"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors cursor-pointer font-medium"
                    >
                      Mantener sesión
                    </label>
                  </div>

                  <Link
                    href="/recuperar-contrasena"
                    className="text-sm font-bold text-[#009FDA] hover:text-[#009FDA]/80 transition-colors"
                  >
                    ¿Olvidaste la clave?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-16 bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#1A1A1A] font-black text-lg rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(245,166,35,0.2)]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-5 h-5 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full"
                      />
                      <span>IDENTIFICANDO...</span>
                    </span>
                  ) : (
                    'ENTRAR AL PORTAL'
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer Links */}
            <div className="mt-10 text-center pt-8 border-t border-white/5">
              <p className="text-slate-500 font-medium">
                ¿Aún no tienes cuenta?{' '}
                <Link href="/registro" className="text-white hover:text-[#F5A623] transition-colors font-bold border-b border-white/20 hover:border-[#F5A623]">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-slate-500 font-medium uppercase tracking-[0.2em]">
            © 2025 IPUC Unánimes - Santidad al Señor
          </p>
        </motion.div>
      </div>
    </div>
  )
}
