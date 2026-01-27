'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createGrupoSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  descripcion: z.string().optional(),
  lider_id: z.string().min(1, 'Seleccione un líder'),
});

type CreateGrupoFormData = z.infer<typeof createGrupoSchema>;

// Mock users - reemplazar con hook real
const mockUsers = [
  { id: 'user1', nombre_completo: 'Juan Pérez' },
  { id: 'user2', nombre_completo: 'María García' },
  { id: 'user3', nombre_completo: 'Carlos Rodríguez' },
];

export default function NewGrupoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateGrupoFormData>({
    resolver: zodResolver(createGrupoSchema),
  });

  const selectedLiderId = watch('lider_id');

  const onSubmit = async (data: CreateGrupoFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implementar creación real
      console.log('Crear grupo:', data);
      toast.success('Grupo creado correctamente');
      router.push('/dashboard/grupos');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear grupo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/grupos">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nuevo Grupo</h1>
          <p className="text-slate-500 mt-1">Crear un nuevo grupo</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Nombre del Grupo *
            </label>
            <Input
              {...register('nombre')}
              placeholder="Ej: Grupo Alfa"
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              placeholder="Descripción del grupo..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Líder */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Líder del Grupo *
            </label>
            <Select
              value={selectedLiderId}
              onValueChange={(value) => setValue('lider_id', value)}
            >
              <SelectTrigger className={errors.lider_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccione un líder" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.nombre_completo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lider_id && (
              <p className="text-red-500 text-sm mt-1">{errors.lider_id.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Link href="/dashboard/grupos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Grupo'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}