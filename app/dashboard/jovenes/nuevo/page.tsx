'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJovenes } from '@/hooks/useJovenes';
import { useGrupos } from '@/hooks/useGrupos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createJovenSchema = z.object({
  nombre_completo: z.string().min(3, 'Mínimo 3 caracteres'),
  celular: z.string().regex(/^[0-9]{10}$/, 'El celular debe tener 10 dígitos (ej: 3113678555)'),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  direccion: z.string().optional(),
  grupo_id: z.string().optional(),
  bautizado: z.boolean(),
  sellado: z.boolean(),
  servidor: z.boolean(),
  simpatizante: z.boolean(),
  consentimiento_datos_personales: z.boolean(),
});

type CreateJovenFormData = z.infer<typeof createJovenSchema>;

export default function NewJovenPage() {
  const router = useRouter();
  const { createJovenPublic, checkNombreDuplicado } = useJovenes();
  const { grupos, isLoading: isLoadingGrupos } = useGrupos();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nombreDuplicado, setNombreDuplicado] = useState(false);
  const [verificandoNombre, setVerificandoNombre] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateJovenFormData>({
    resolver: zodResolver(createJovenSchema),
    defaultValues: {
      nombre_completo: '',
      celular: '',
      fecha_nacimiento: '',
      direccion: '',
      grupo_id: '',
      bautizado: false,
      sellado: false,
      servidor: false,
      simpatizante: false,
      consentimiento_datos_personales: false,
    },
  });

  const nombreCompleto = watch('nombre_completo');
  const selectedGrupoId = watch('grupo_id');

  // Verificar nombres duplicados en tiempo real
  useEffect(() => {
    const verificarNombre = async () => {
      if (nombreCompleto && nombreCompleto.length >= 3) {
        setVerificandoNombre(true);
        try {
          const isDuplicate = await checkNombreDuplicado(nombreCompleto);
          setNombreDuplicado(isDuplicate);
        } catch (error) {
          console.error('Error checking name:', error);
        } finally {
          setVerificandoNombre(false);
        }
      } else {
        setNombreDuplicado(false);
        setVerificandoNombre(false);
      }
    };

    const timeoutId = setTimeout(verificarNombre, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [nombreCompleto, checkNombreDuplicado]);

  const onSubmit = async (data: CreateJovenFormData) => {
    setIsSubmitting(true);
    try {
      await createJovenPublic.mutateAsync(data);
      toast.success('Joven creado correctamente');
      router.push('/dashboard/jovenes');
    } catch (error: unknown) {
      console.error('Error creating joven:', error);
      
      // Extraer el mensaje de error del response
      let errorMessage = 'Error al crear joven';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response;
        if (response?.data?.error) {
          errorMessage = response.data.error;
        } else if (response?.statusText) {
          errorMessage = response.statusText;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as Error).message;
      }
      
      toast.error(errorMessage);
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
            <div className="relative">
              <Input
                {...register('nombre_completo')}
                placeholder="Ej: Juan Pérez"
                className={`${
                  errors.nombre_completo ? 'border-red-500' : 
                  nombreDuplicado ? 'border-amber-500' : ''
                }`}
              />
              {verificandoNombre && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                </div>
              )}
            </div>
            {errors.nombre_completo && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre_completo.message}</p>
            )}
            {nombreDuplicado && !errors.nombre_completo && (
              <div className="flex items-center gap-2 mt-1 text-amber-600">
                <AlertTriangle size={16} />
                <p className="text-sm">
                  Ya existe un joven con este nombre. ¿Estás seguro de que es una persona diferente?
                </p>
              </div>
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

          {/* Grupo */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Grupo
            </label>
            <Select
              value={selectedGrupoId}
              onValueChange={(value) => setValue('grupo_id', value)}
              disabled={isLoadingGrupos}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingGrupos ? "Cargando grupos..." : "Sin grupo asignado"} />
              </SelectTrigger>
              <SelectContent>
                {grupos?.map((grupo) => (
                  <SelectItem key={grupo.id} value={grupo.id}>
                    {grupo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={nombreDuplicado ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              {isSubmitting ? 'Creando...' : nombreDuplicado ? 'Crear de Todos Modos' : 'Crear Joven'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
