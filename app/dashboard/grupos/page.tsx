'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, Trash2, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';

// Mock data - reemplazar con hook real cuando esté disponible
const mockGrupos = [
  {
    id: '1',
    nombre: 'Grupo Alfa',
    descripcion: 'Grupo de jóvenes bautizados',
    lider_id: 'user1',
    lider_nombre: 'Juan Pérez',
    integrantes_count: 15,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    nombre: 'Grupo Beta',
    descripcion: 'Grupo de nuevos conversos',
    lider_id: 'user2',
    lider_nombre: 'María García',
    integrantes_count: 8,
    created_at: '2024-02-01',
  },
];

export default function GruposPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock loading state
  const isLoading = false;

  // Filtrar grupos por búsqueda
  const filteredGrupos = mockGrupos.filter((grupo) =>
    grupo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grupo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grupo.lider_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (grupo: any) => {
    setSelectedGrupo(grupo);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGrupo) return;

    setIsDeleting(true);
    try {
      // TODO: Implementar eliminación real
      toast.success('Grupo eliminado correctamente');
      setDeleteDialogOpen(false);
      setSelectedGrupo(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al eliminar grupo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grupos</h1>
          <p className="text-slate-500 mt-1">Gestionar grupos de jóvenes</p>
        </div>
        <Link href="/dashboard/grupos/nuevo">
          <Button>+ Nuevo Grupo</Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <Input
          placeholder="Buscar por nombre, descripción o líder..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        ) : filteredGrupos.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <p>No hay grupos registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead>Integrantes</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrupos.map((grupo) => (
                  <TableRow key={grupo.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{grupo.nombre}</TableCell>
                    <TableCell className="text-slate-500">{grupo.descripcion}</TableCell>
                    <TableCell className="text-slate-500">{grupo.lider_nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-slate-400" />
                        <span>{grupo.integrantes_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/grupos/${grupo.id}`}>
                          <Button size="sm" variant="outline" title="Ver">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/grupos/${grupo.id}/editar`}>
                          <Button size="sm" variant="outline" title="Editar">
                            <Edit2 size={16} />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          title="Eliminar"
                          onClick={() => handleDeleteClick(grupo)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Grupo</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar el grupo{' '}
              <strong>{selectedGrupo?.nombre}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}