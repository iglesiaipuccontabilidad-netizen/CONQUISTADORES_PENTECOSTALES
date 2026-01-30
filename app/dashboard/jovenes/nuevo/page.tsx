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
  celular: z.string().regex(/^[0-9]{10}$/, 'El celular debe tener 10 dígitos (ej: 3113678555)'),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  direccion: z.string().optional(),
  bautizado: z.boolean(),
  sellado: z.boolean(),
  servidor: z.boolean(),
  simpatizante: z.boolean(),
  consentimiento_datos_personales: z.boolean(),
});

type CreateJovenFormData = z.infer<typeof createJovenSchema>;

export default function NewJovenPage() {
  const router = useRouter();
  const { createJovenPublic } = useJovenes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateJovenFormData>({
    resolver: zodResolver(createJovenSchema),
    defaultValues: {
      nombre_completo: '',
      celular: '',
      fecha_nacimiento: '',
      direccion: '',
      bautizado: false,
      sellado: false,
      servidor: false,
      simpatizante: false,
      consentimiento_datos_personales: false,
    },
  });

  const onSubmit = async (data: CreateJovenFormData) => {
    setIsSubmitting(true);
    try {
      await createJovenPublic.mutateAsync(data);
      toast.success('Joven creado correctamente');
      router.push('/dashboard/jovenes');
    } catch (error: unknown) {
      console.error('Error creating joven:', error);
      toast.error((error as Error).message || 'Error al crear joven');
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
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
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
              placeholder="Ej: 3113678555"
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

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Dirección
            </label>
            <Input
              {...register('direccion')}
              placeholder="Ej: Calle 123 #45-67"
              className={errors.direccion ? 'border-red-500' : ''}
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
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
              <div className="flex items-center gap-2">
                <Checkbox
                  {...register('consentimiento_datos_personales')}
                  id="consentimiento_datos_personales"
                />
                <label htmlFor="consentimiento_datos_personales" className="text-sm font-medium cursor-pointer">
                  Consentimiento para el tratamiento de datos personales
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
