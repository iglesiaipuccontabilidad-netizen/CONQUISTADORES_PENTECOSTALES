'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJovenes } from '@/hooks/useJovenes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JovenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const joven_id = params.id as string;
  const { useGetJoven, updateJoven } = useJovenes();
  const { data: joven, isLoading, error } = useGetJoven(joven_id);
  const [formData, setFormData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (joven) {
      setFormData(joven);
    }
  }, [joven]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateJoven.mutateAsync({
        id: joven_id,
        data: {
          nombre_completo: formData.nombre_completo,
          celular: formData.celular,
          bautizado: formData.bautizado,
          sellado: formData.sellado,
          servidor: formData.servidor,
          simpatizante: formData.simpatizante,
        },
      });
      toast.success('Joven actualizado correctamente');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/jovenes">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Volver
          </Button>
        </Link>
        <Card className="p-6 text-center text-red-600">
          Error al cargar el joven
        </Card>
      </div>
    );
  }

  if (isLoading || !formData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Card className="p-6 space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/jovenes">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{formData.nombre_completo}</h1>
            <p className="text-slate-500 mt-1">Cédula: {formData.cedula}</p>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Editar</Button>
        )}
      </div>

      {/* Form */}
      <Card className="p-6 space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Nombre Completo
          </label>
          <Input
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        {/* Información Personal */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Cédula
            </label>
            <Input
              value={formData.cedula}
              disabled
              className="bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Celular
            </label>
            <Input
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Edad y Fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Edad
            </label>
            <Input
              value={formData.edad || '—'}
              disabled
              className="bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Fecha de Nacimiento
            </label>
            <Input
              type="date"
              value={formData.fecha_nacimiento?.split('T')[0] || ''}
              disabled
              className="bg-slate-100"
            />
          </div>
        </div>

        {/* Estados */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-slate-900 mb-3">Estados</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="bautizado"
                checked={formData.bautizado}
                onCheckedChange={(checked) => handleCheckboxChange('bautizado', checked as boolean)}
                disabled={!isEditing}
              />
              <label htmlFor="bautizado" className="text-sm font-medium cursor-pointer">
                Bautizado
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="sellado"
                checked={formData.sellado}
                onCheckedChange={(checked) => handleCheckboxChange('sellado', checked as boolean)}
                disabled={!isEditing}
              />
              <label htmlFor="sellado" className="text-sm font-medium cursor-pointer">
                Sellado
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="servidor"
                checked={formData.servidor}
                onCheckedChange={(checked) => handleCheckboxChange('servidor', checked as boolean)}
                disabled={!isEditing}
              />
              <label htmlFor="servidor" className="text-sm font-medium cursor-pointer">
                Servidor
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="simpatizante"
                checked={formData.simpatizante}
                onCheckedChange={(checked) => handleCheckboxChange('simpatizante', checked as boolean)}
                disabled={!isEditing}
              />
              <label htmlFor="simpatizante" className="text-sm font-medium cursor-pointer">
                Simpatizante
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setFormData(joven);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
