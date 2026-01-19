'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
    <div className="min-h-screen bg-gradient-to-br from-[#00338D] via-[#0066B3] to-[#009FDA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🏴 Conquistadores</h1>
          <p className="text-slate-300">Sistema de Gestión de Jóvenes</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 bg-slate-800 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tu@email.com"
                        type="email"
                        {...field}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                  className="border-slate-600"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-slate-300 cursor-pointer"
                >
                  Recuérdame
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-[#F5A623] hover:bg-[#e6951a] text-[#1A1A1A] font-semibold"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </Form>

          {/* Footer Links */}
          <div className="mt-6 space-y-3 text-center">
            <Link
              href="/recuperar-contrasena"
              className="block text-sm text-[#F5A623] hover:text-[#e6951a]"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-sm text-slate-400">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-[#F5A623] hover:text-[#e6951a]">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>Plataforma oficial de Conquistadores Pentecostales</p>
        </div>
      </div>
    </div>
  )
}
