'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const recoverySchema = z.object({
  email: z.string().email('Email inválido'),
})

type RecoveryFormType = z.infer<typeof recoverySchema>

export default function RecuperarContraseñaPage() {
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const form = useForm<RecoveryFormType>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: RecoveryFormType) {
    try {
      setLoading(true)

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })

      if (error) throw error

      toast.success('Revisa tu email para recuperar tu contraseña')
      setEnviado(true)
    } catch (error) {
      toast.error('Error al enviar correo de recuperación')
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00338D] via-[#0066B3] to-[#009FDA] flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Verifica tu Email
          </h2>
          <p className="text-white mb-6">
            Hemos enviado un enlace a tu correo para recuperar tu contraseña.
            Por favor, revisa tu bandeja de entrada.
          </p>
          <Link href="/login">
            <Button className="bg-[#F5A623] hover:bg-[#e6951a] text-[#1A1A1A] font-semibold w-full">
              Volver al Login
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00338D] via-[#0066B3] to-[#009FDA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🏴 Conquistadores</h1>
          <p className="text-slate-300">Sistema de Gestión de Jóvenes</p>
        </div>

        {/* Card */}
        <Card className="p-8 bg-slate-800 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">
            Recuperar Contraseña
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Ingresa tu email y te enviaremos un enlace para recuperar tu
            contraseña
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <Button
                type="submit"
                className="w-full bg-[#F5A623] hover:bg-[#e6951a] text-[#1A1A1A] font-semibold"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              ¿Recordaste tu contraseña?{' '}
              <Link href="/login" className="text-[#F5A623] hover:text-[#e6951a]">
                Inicia sesión
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
