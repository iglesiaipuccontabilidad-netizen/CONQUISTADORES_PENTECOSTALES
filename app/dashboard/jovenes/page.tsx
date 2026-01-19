'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useJovenes } from '@/hooks/useJovenes';
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
import { Edit2, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export default function JovenesPage() {
  const { jovenes, isLoading, deleteJoven } = useJovenes();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJoven, setSelectedJoven] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtros
  const [edadFilter, setEdadFilter] = useState<string>('todos');
  const [estadoFilter, setEstadoFilter] = useState<string>('todos');
  const [mesCumpleanosFilter, setMesCumpleanosFilter] = useState<string>('todos');

  // Ordenamiento
  const [sortField, setSortField] = useState<string>('nombre_completo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar, ordenar y paginar jóvenes
  const processedJovenes = useMemo(() => {
    if (!jovenes) return { filtered: [], totalPages: 0, paginated: [] };

    // Filtrar por búsqueda
    let filtered = jovenes.filter((joven) =>
      joven.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      joven.cedula?.includes(searchTerm) ||
      joven.celular?.includes(searchTerm)
    );

    // Filtrar por edad
    if (edadFilter !== 'todos') {
      const [min, max] = edadFilter.split('-').map(Number);
      filtered = filtered.filter((joven) => {
        const edad = joven.edad || 0;
        return edad >= min && edad <= max;
      });
    }

    // Filtrar por estado
    if (estadoFilter !== 'todos') {
      filtered = filtered.filter((joven) => {
        switch (estadoFilter) {
          case 'bautizado': return joven.bautizado;
          case 'sellado': return joven.sellado;
          case 'servidor': return joven.servidor;
          case 'simpatizante': return joven.simpatizante;
          default: return true;
        }
      });
    }

    // Filtrar por mes de cumpleaños
    if (mesCumpleanosFilter !== 'todos') {
      const mes = parseInt(mesCumpleanosFilter);
      filtered = filtered.filter((joven) => {
        if (!joven.fecha_nacimiento) return false;
        const fecha = new Date(joven.fecha_nacimiento);
        return fecha.getMonth() === mes;
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'nombre_completo':
          aValue = a.nombre_completo || '';
          bValue = b.nombre_completo || '';
          break;
        case 'edad':
          aValue = a.edad || 0;
          bValue = b.edad || 0;
          break;
        case 'cedula':
          aValue = a.cedula || '';
          bValue = b.cedula || '';
          break;
        default:
          aValue = a.nombre_completo || '';
          bValue = b.nombre_completo || '';
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginación
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { filtered, totalPages, paginated };
  }, [jovenes, searchTerm, edadFilter, estadoFilter, mesCumpleanosFilter, sortField, sortDirection, currentPage]);

  const { filtered: filteredJovenes, totalPages, paginated: displayedJovenes } = processedJovenes;

  // Reset page when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (joven: any) => {
    setSelectedJoven(joven);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJoven) return;
    
    setIsDeleting(true);
    try {
      await deleteJoven.mutateAsync(selectedJoven.id);
      toast.success('Joven eliminado correctamente');
      setDeleteDialogOpen(false);
      setSelectedJoven(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jóvenes</h1>
          <p className="text-slate-500 mt-1">Gestionar jóvenes registrados</p>
        </div>
        <Link href="/dashboard/jovenes/nuevo">
          <Button>+ Nuevo Joven</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Buscar por nombre, cédula o celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={edadFilter} onValueChange={handleFilterChange(setEdadFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por edad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las edades</SelectItem>
                <SelectItem value="12-15">12-15 años</SelectItem>
                <SelectItem value="16-18">16-18 años</SelectItem>
                <SelectItem value="19-25">19-25 años</SelectItem>
                <SelectItem value="26-30">26-30 años</SelectItem>
                <SelectItem value="31-35">31-35 años</SelectItem>
              </SelectContent>
            </Select>

            <Select value={estadoFilter} onValueChange={handleFilterChange(setEstadoFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="bautizado">Bautizados</SelectItem>
                <SelectItem value="sellado">Sellados</SelectItem>
                <SelectItem value="servidor">Servidores</SelectItem>
                <SelectItem value="simpatizante">Simpatizantes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={mesCumpleanosFilter} onValueChange={handleFilterChange(setMesCumpleanosFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Mes cumpleaños" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los meses</SelectItem>
                <SelectItem value="0">Enero</SelectItem>
                <SelectItem value="1">Febrero</SelectItem>
                <SelectItem value="2">Marzo</SelectItem>
                <SelectItem value="3">Abril</SelectItem>
                <SelectItem value="4">Mayo</SelectItem>
                <SelectItem value="5">Junio</SelectItem>
                <SelectItem value="6">Julio</SelectItem>
                <SelectItem value="7">Agosto</SelectItem>
                <SelectItem value="8">Septiembre</SelectItem>
                <SelectItem value="9">Octubre</SelectItem>
                <SelectItem value="10">Noviembre</SelectItem>
                <SelectItem value="11">Diciembre</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-slate-600 flex items-center">
              {filteredJovenes.length} resultado{filteredJovenes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
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
        ) : filteredJovenes.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <p>No hay jóvenes registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('nombre_completo')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Nombre
                      {sortField === 'nombre_completo' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('cedula')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Cédula
                      {sortField === 'cedula' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('edad')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Edad
                      {sortField === 'edad' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedJovenes.map((joven) => (
                  <TableRow key={joven.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{joven.nombre_completo}</TableCell>
                    <TableCell className="text-slate-500">{joven.cedula}</TableCell>
                    <TableCell className="text-slate-500">{joven.celular}</TableCell>
                    <TableCell>{joven.edad || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {joven.bautizado && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            Bautizado
                          </span>
                        )}
                        {joven.sellado && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            Sellado
                          </span>
                        )}
                        {joven.servidor && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                            Servidor
                          </span>
                        )}
                        {joven.simpatizante && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                            Simpatizante
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/jovenes/${joven.id}`}>
                          <Button size="sm" variant="outline" title="Ver">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/jovenes/${joven.id}/editar`}>
                          <Button size="sm" variant="outline" title="Editar">
                            <Edit2 size={16} />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          title="Eliminar"
                          onClick={() => handleDeleteClick(joven)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredJovenes.length)} de {filteredJovenes.length} resultados
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Joven</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar a{' '}
              <strong>{selectedJoven?.nombre_completo}</strong>? Esta acción no se puede deshacer.
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
