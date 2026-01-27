'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJovenes } from '@/hooks/useJovenes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createJovenSchema = z.object({
  nombre_completo: z.string().min(3, 'Mínimo 3 caracteres'),
  celular: z.string().regex(/^(\+57|0057|57)?[0-9]{10}$/, 'Celular inválido'),
  fecha_nacimiento: z.string(),
  bautizado: z.boolean(),
  sellado: z.boolean(),
  servidor: z.boolean(),
  simpatizante: z.boolean(),
});

type CreateJovenFormData = z.infer<typeof createJovenSchema>;

export default function NewJovenPage() {
  const router = useRouter();
  const { updateJoven } = useJovenes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
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
      // Crear joven usando POST a /api/joven/registro
      const response = await fetch('/api/joven/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al crear joven');
      }

      toast.success('Joven creado correctamente');
      router.push('/dashboard/jovenes');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear joven');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/jovenes">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nuevo Joven</h1>
          <p className="text-slate-500 mt-1">Crear un nuevo registro</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Nombre Completo *
            </label>
            <Input
              {...register('nombre_completo')}
              placeholder="Ej: Juan Pérez"
              className={errors.nombre_completo ? 'border-red-500' : ''}
            />
            {errors.nombre_completo && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre_completo.message}</p>
            )}
          </div>

          {/* Celular */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Celular *
            </label>
            <Input
              {...register('celular')}
              placeholder="Ej: 3001234567"
              className={errors.celular ? 'border-red-500' : ''}
            />
            {errors.celular && (
              <p className="text-red-500 text-sm mt-1">{errors.celular.message}</p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Fecha de Nacimiento *
            </label>
            <Input
              {...register('fecha_nacimiento')}
              type="date"
              className={errors.fecha_nacimiento ? 'border-red-500' : ''}
            />
            {errors.fecha_nacimiento && (
              <p className="text-red-500 text-sm mt-1">{errors.fecha_nacimiento.message}</p>
            )}
          </div>

          {/* Estados */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Estados</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  {...register('bautizado')}
                  id="bautizado"
                />
                <label htmlFor="bautizado" className="text-sm font-medium cursor-pointer">
                  Bautizado
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  {...register('sellado')}
                  id="sellado"
                />
                <label htmlFor="sellado" className="text-sm font-medium cursor-pointer">
                  Sellado
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  {...register('servidor')}
                  id="servidor"
                />
                <label htmlFor="servidor" className="text-sm font-medium cursor-pointer">
                  Servidor
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  {...register('simpatizante')}
                  id="simpatizante"
                />
                <label htmlFor="simpatizante" className="text-sm font-medium cursor-pointer">
                  Simpatizante
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Link href="/dashboard/jovenes">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Joven'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
