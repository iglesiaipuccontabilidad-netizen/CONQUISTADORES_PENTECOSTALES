'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGrupos } from '../../../../hooks/useGrupos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  Users,
  User,
  Calendar,
  MoreVertical,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function GrupoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const grupo_id = params.id as string;
  const { useGetGrupo, updateGrupo, deleteGrupo } = useGrupos();
  const { data: grupo, isLoading, error } = useGetGrupo(grupo_id);
  const [formData, setFormData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (grupo) {
      setFormData({
        nombre: grupo.nombre,
        descripcion: grupo.descripcion || '',
        lider_id: grupo.lider_id,
        estado: grupo.estado,
      });
    }
  }, [grupo]);

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);
    try {
      await updateGrupo.mutateAsync({ id: grupo_id, data: formData });
      toast.success('Grupo actualizado exitosamente');
      setIsEditing(false);
    } catch (error: any) {
      toast.error('Error al actualizar el grupo: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteGrupo.mutateAsync(grupo_id);
      toast.success('Grupo eliminado exitosamente');
      router.push('/dashboard/grupos');
    } catch (error: any) {
      toast.error('Error al eliminar el grupo: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (grupo) {
      setFormData({
        nombre: grupo.nombre,
        descripcion: grupo.descripcion || '',
        lider_id: grupo.lider_id,
        estado: grupo.estado,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !grupo) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">
            {error ? 'Error al cargar el grupo' : 'Grupo no encontrado'}
          </p>
          <Link href="/dashboard/grupos">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Grupos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/grupos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{grupo.nombre}</h1>
            <p className="text-gray-600">Detalle del Grupo</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button onClick={handleDelete} variant="destructive" disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Grupo Details */}
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Información del Grupo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <p className="text-lg">{grupo.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <p className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      grupo.estado === 'activo'
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {grupo.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <p className="text-gray-600">{grupo.descripcion || 'Sin descripción'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Líder</label>
                    <p className="text-lg">{grupo.lider?.nombre_completo || 'No asignado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha de Creación</label>
                    <p className="text-gray-600">
                      {format(new Date(grupo.created_at), 'PPP', { locale: es })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Editar Grupo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nombre *</label>
                    <Input
                      value={formData?.nombre || ''}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Nombre del grupo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
                    <Select
                      value={formData?.estado || ''}
                      onValueChange={(value) => setFormData({ ...formData, estado: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Descripción</label>
                    <Textarea
                      value={formData?.descripcion || ''}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Descripción del grupo"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Líder</label>
                    <Input
                      value={formData?.lider_id || ''}
                      onChange={(e) => setFormData({ ...formData, lider_id: e.target.value })}
                      placeholder="ID del líder"
                    />
                    {/* TODO: Add leader selection dropdown */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}