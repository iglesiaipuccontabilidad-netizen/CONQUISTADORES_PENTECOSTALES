'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus, Save, X, Info, Sparkles, User, Fingerprint, Phone, Calendar, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createJovenSchema = z.object({
  nombre_completo: z.string().min(3, 'Mínimo 3 caracteres'),
  cedula: z.string().regex(/^\d{8,11}$/, 'Cédula inválida (8-11 dígitos)'),
  celular: z.string().regex(/^(\+57|0057|57)?[0-9]{10}$/, 'Celular inválido (10 dígitos)'),
  fecha_nacimiento: z.string().min(1, 'Fecha requerida'),
  bautizado: z.boolean(),
  sellado: z.boolean(),
  servidor: z.boolean(),
  simpatizante: z.boolean(),
});

type CreateJovenFormData = z.infer<typeof createJovenSchema>;

export default function NewJovenPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateJovenFormData>({
    resolver: zodResolver(createJovenSchema),
    defaultValues: {
      bautizado: false,
      sellado: false,
      servidor: false,
      simpatizante: false,
    },
  });

  const onSubmit = async (data: CreateJovenFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/joven/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al crear registro');
      }

      toast.success('Miembro registrado con éxito');
      router.push('/dashboard/jovenes');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      {/* Header Premium Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/jovenes">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-sm border-slate-200 hover:border-[#00338D] hover:text-[#00338D] transition-all">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
              NUEVO <span className="text-[#00338D] ml-2">REGISTRO</span>
              <Sparkles className="ml-3 w-6 h-6 text-[#F5A623] animate-pulse" />
            </h1>
            <p className="text-slate-500 font-medium tracking-wide text-[10px] uppercase opacity-70 tracking-widest">
              Alta de Miembros - IPUC Unánimes
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Layout */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2">
          <Card className="p-8 md:p-12 border-slate-100 shadow-2xl rounded-[3rem] bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00338D]/5 rounded-bl-full -mr-10 -mt-10" />

            <div className="relative z-10 space-y-10">
              <SectionTitle icon={User} title="Identificación Personal" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Nombre Completo" error={errors.nombre_completo?.message}>
                  <Input
                    {...register('nombre_completo')}
                    placeholder="Ej: Caleb Aguilar"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-bold"
                  />
                </FormField>
                <FormField label="Número de Cédula" error={errors.cedula?.message}>
                  <Input
                    {...register('cedula')}
                    placeholder="1000..."
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-bold"
                  />
                </FormField>
                <FormField label="Contacto Celular" error={errors.celular?.message}>
                  <Input
                    {...register('celular')}
                    placeholder="300 000 0000"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-bold"
                  />
                </FormField>
                <FormField label="Fecha de Nacimiento" error={errors.fecha_nacimiento?.message}>
                  <Input
                    {...register('fecha_nacimiento')}
                    type="date"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-bold"
                  />
                </FormField>
              </div>

              <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex items-start gap-4">
                <Info size={18} className="text-[#00338D] mt-1" />
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">
                  La información suministrada será procesada bajo las políticas de protección de datos de la congregación local.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Status & Submit */}
        <div className="space-y-8">
          <Card className="p-8 border-slate-100 shadow-xl rounded-[2.5rem] bg-white">
            <SectionTitle icon={ShieldCheck} title="Situación Espiritual" />

            <div className="grid grid-cols-1 gap-3 mt-8">
              <StatusToggle id="bautizado" label="Bautizado" register={register} color="#00338D" />
              <StatusToggle id="sellado" label="Sellado" register={register} color="#F5A623" />
              <StatusToggle id="servidor" label="Servidor" register={register} color="#0066B3" />
              <StatusToggle id="simpatizante" label="Simpatizante" register={register} color="#1A1A1A" />
            </div>
          </Card>

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 rounded-[2rem] bg-[#00338D] hover:bg-[#00338D]/90 text-white font-black shadow-2xl shadow-[#00338D]/20 flex items-center justify-center gap-3 transition-all"
            >
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Save size={20} /></motion.div>
              ) : (
                <Save size={20} />
              )}
              <span className="tracking-[0.2em] uppercase text-xs">{isSubmitting ? 'PROCESANDO...' : 'Sincronizar Datos'}</span>
            </Button>

            <Link href="/dashboard/jovenes" className="block w-full">
              <Button variant="ghost" type="button" className="w-full h-14 rounded-2xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 text-[10px] uppercase tracking-widest">
                Descartar Registro
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title }: any) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-2">
      <div className="p-3 rounded-2xl bg-[#00338D]/5 text-[#00338D]">
        <Icon size={20} />
      </div>
      <h2 className="text-sm font-black text-slate-900 tracking-[0.1em] uppercase">{title}</h2>
    </div>
  );
}

function FormField({ label, error, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide ml-1">{error}</p>}
    </div>
  );
}

function StatusToggle({ id, label, register, color }: any) {
  return (
    <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all">
      <label htmlFor={id} className="text-xs font-bold text-slate-600 cursor-pointer uppercase tracking-tight">{label}</label>
      <Checkbox
        {...register(id)}
        id={id}
        className="h-5 w-5 rounded-lg border-slate-300 data-[state=checked]:bg-[#00338D] data-[state=checked]:border-[#00338D]"
      />
    </div>
  );
}
