'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJovenes } from '@/hooks/useJovenes';
import { useGrupos } from '@/hooks/useGrupos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  X,
  User,
  Phone,
  IdCard,
  Calendar,
  ShieldCheck,
  Target,
  Zap,
  Heart,
  Users,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Joven } from '@/types/index';

export default function EditJovenPage() {
  const params = useParams();
  const router = useRouter();
  const joven_id = params.id as string;
  const { useGetJoven, updateJoven } = useJovenes();
  const { grupos } = useGrupos();
  const { data: joven, isLoading, error } = useGetJoven(joven_id);
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    fecha_nacimiento: '',
    cedula: '',
    celular: '',
    grupo_id: '',
    bautizado: false,
    sellado: false,
    servidor: false,
    simpatizante: false,
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (joven) {
      setFormData({
        nombre_completo: joven.nombre_completo || '',
        fecha_nacimiento: joven.fecha_nacimiento || '',
        cedula: joven.cedula || '',
        celular: joven.celular || '',
        grupo_id: joven.grupo_id || '',
        bautizado: joven.bautizado || false,
        sellado: joven.sellado || false,
        servidor: joven.servidor || false,
        simpatizante: joven.simpatizante || false,
      });
    }
  }, [joven]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSave = async () => {
    if (!formData.nombre_completo || !formData.celular || !formData.cedula) {
      toast.error('Por favor, completa los campos obligatorios');
      return;
    }

    setIsSaving(true);
    try {
      await updateJoven.mutateAsync({
        id: joven_id,
        data: {
          nombre_completo: formData.nombre_completo,
          fecha_nacimiento: formData.fecha_nacimiento,
          cedula: formData.cedula,
          celular: formData.celular,
          grupo_id: formData.grupo_id || null,
          bautizado: formData.bautizado,
          sellado: formData.sellado,
          servidor: formData.servidor,
          simpatizante: formData.simpatizante,
        },
      });
      
      toast.success('Joven actualizado correctamente');
      router.push(`/dashboard/jovenes/${joven_id}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/jovenes/${joven_id}`);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">Error al cargar el joven</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!joven) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Joven no encontrado</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-6 max-w-4xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Joven
            </h1>
            <p className="text-gray-600 text-sm">
              {joven.nombre_completo}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información Personal */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Información Personal
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre_completo" className="text-sm font-medium text-gray-700">
                Nombre Completo *
              </Label>
              <Input
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Nombre completo del joven"
              />
            </div>

            <div>
              <Label htmlFor="cedula" className="text-sm font-medium text-gray-700">
                Cédula *
              </Label>
              <Input
                id="cedula"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="1234567890"
              />
            </div>

            <div>
              <Label htmlFor="fecha_nacimiento" className="text-sm font-medium text-gray-700">
                Fecha de Nacimiento
              </Label>
              <Input
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="celular" className="text-sm font-medium text-gray-700">
                Celular *
              </Label>
              <Input
                id="celular"
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="+573001234567"
              />
            </div>
          </div>
        </Card>

        {/* Información del Grupo */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Información del Grupo
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="grupo_id" className="text-sm font-medium text-gray-700">
                Grupo
              </Label>
              <Select 
                value={formData.grupo_id} 
                onValueChange={(value) => handleSelectChange('grupo_id', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccionar grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin grupo</SelectItem>
                  {grupos?.map((grupo) => (
                    <SelectItem key={grupo.id} value={grupo.id}>
                      {grupo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Estado Espiritual */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Estado Espiritual
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bautizado"
                checked={formData.bautizado}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('bautizado', checked as boolean)
                }
              />
              <Label htmlFor="bautizado" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Bautizado
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sellado"
                checked={formData.sellado}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('sellado', checked as boolean)
                }
              />
              <Label htmlFor="sellado" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Sellado
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="servidor"
                checked={formData.servidor}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('servidor', checked as boolean)
                }
              />
              <Label htmlFor="servidor" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  Servidor
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="simpatizante"
                checked={formData.simpatizante}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('simpatizante', checked as boolean)
                }
              />
              <Label htmlFor="simpatizante" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  Simpatizante
                </div>
              </Label>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}