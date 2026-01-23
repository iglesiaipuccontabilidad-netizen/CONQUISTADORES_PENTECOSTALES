'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useJovenes } from '@/hooks/useJovenes';
import { Joven } from '@/types';
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
import { Edit2, Trash2, Eye, ChevronUp, ChevronDown, Users, Filter, X, Search, UserPlus, Sparkles, MapPin, Phone, Calendar } from 'lucide-react';
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
  const itemsPerPage = 8;

  // Filtrar, ordenar y paginar jóvenes
  const processedJovenes = useMemo(() => {
    if (!jovenes) return { filtered: [], totalPages: 0, paginated: [] };

    // Filtrar por búsqueda
    let filtered = (jovenes as Joven[]).filter((joven) =>
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

  // Función para limpiar filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setEdadFilter('todos');
    setEstadoFilter('todos');
    setMesCumpleanosFilter('todos');
    setCurrentPage(1);
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm !== '' || edadFilter !== 'todos' || estadoFilter !== 'todos' || mesCumpleanosFilter !== 'todos';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
            DIRECTORIO <span className="text-[#00338D] ml-2">JÓVENES</span>
            <Users className="ml-3 w-6 h-6 text-[#F5A623]" />
          </h1>
          <p className="text-slate-500 font-medium font-prose uppercase tracking-widest text-xs opacity-70">
            Administración de Miembros - IPUC Unánimes
          </p>
        </div>
        <Link href="/dashboard/jovenes/nuevo">
          <Button className="h-12 px-6 rounded-2xl bg-[#00338D] hover:bg-[#00338D]/90 text-white font-bold shadow-lg shadow-[#00338D]/20 transition-all">
            <UserPlus size={18} className="mr-2" />
            AGREGAR JOVEN
          </Button>
        </Link>
      </motion.div>

      {/* Grid Summary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryItem label="Total Miembros" value={filteredJovenes.length} color="#00338D" />
        <SummaryItem label="Bautizados" value={filteredJovenes.filter(j => j.bautizado).length} color="#0066B3" />
        <SummaryItem label="Sellados" value={filteredJovenes.filter(j => j.sellado).length} color="#F5A623" />
        <SummaryItem label="En el Mes" value={filteredJovenes.filter(j => {
          if (!j.fecha_nacimiento) return false;
          return new Date(j.fecha_nacimiento).getMonth() === new Date().getMonth();
        }).length} color="#009FDA" />
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 md:p-8 border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white">
          <div className="flex flex-col space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#00338D] transition-colors" size={20} />
              <Input
                placeholder="Buscar por nombre, cédula o celular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#00338D]/20 focus:border-[#00338D] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <FilterSelect value={edadFilter} onValueChange={handleFilterChange(setEdadFilter)} placeholder="Edad">
                <SelectItem value="todos">Todas las edades</SelectItem>
                <SelectItem value="12-15">12-15 años</SelectItem>
                <SelectItem value="16-18">16-18 años</SelectItem>
                <SelectItem value="19-25">19-25 años</SelectItem>
                <SelectItem value="26-30">26-30 años</SelectItem>
                <SelectItem value="31-35">31-35 años</SelectItem>
              </FilterSelect>

              <FilterSelect value={estadoFilter} onValueChange={handleFilterChange(setEstadoFilter)} placeholder="Estado">
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="bautizado">Bautizados</SelectItem>
                <SelectItem value="sellado">Sellados</SelectItem>
                <SelectItem value="servidor">Servidores</SelectItem>
                <SelectItem value="simpatizante">Simpatizantes</SelectItem>
              </FilterSelect>

              <FilterSelect value={mesCumpleanosFilter} onValueChange={handleFilterChange(setMesCumpleanosFilter)} placeholder="Mes Nacimiento">
                <SelectItem value="todos">Todos los meses</SelectItem>
                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((mes, i) => (
                  <SelectItem key={i} value={i.toString()}>{mes}</SelectItem>
                ))}
              </FilterSelect>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="h-11 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 px-4 font-bold"
                >
                  <X size={16} className="mr-2" /> LIMPIAR
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Table Section */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white ring-1 ring-slate-100/50">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl bg-slate-100/50" />
              ))}
            </div>
          ) : filteredJovenes.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Users size={40} />
              </div>
              <p className="text-slate-500 font-bold text-lg">No se encontraron resultados</p>
              <Button onClick={clearAllFilters} variant="outline" className="rounded-xl">Limpiar búsqueda</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50/50">
                    <TableHead className="px-8 py-5 h-16">
                      <button onClick={() => handleSort('nombre_completo')} className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-widest text-[10px] hover:text-[#00338D] transition-colors">
                        NOMBRE COMPLETO
                        {sortField === 'nombre_completo' ? (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : null}
                      </button>
                    </TableHead>
                    <TableHead className="px-6 py-5 h-16 font-black text-slate-400 uppercase tracking-widest text-[10px]">IDENTIFICACIÓN</TableHead>
                    <TableHead className="px-6 py-5 h-16 font-black text-slate-400 uppercase tracking-widest text-[10px]">CONTACTO</TableHead>
                    <TableHead className="px-6 py-5 h-16">
                      <button onClick={() => handleSort('edad')} className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-widest text-[10px] hover:text-[#00338D] transition-colors">
                        EDAD
                        {sortField === 'edad' ? (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : null}
                      </button>
                    </TableHead>
                    <TableHead className="px-6 py-5 h-16 font-black text-slate-400 uppercase tracking-widest text-[10px]">ESTADO MINISTERIAL</TableHead>
                    <TableHead className="px-8 py-5 h-16 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode='popLayout'>
                    {displayedJovenes.map((joven, idx) => (
                      <motion.tr
                        key={joven.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="group border-b border-slate-50 hover:bg-[#00338D]/[0.02] transition-colors duration-150"
                      >
                        <TableCell className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-[#00338D] text-xs">
                              {joven.nombre_completo.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">{joven.nombre_completo}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <span className="text-sm font-bold text-slate-500 font-mono tracking-tight">{joven.cedula}</span>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{joven.celular}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="px-3 py-1 bg-slate-100 rounded-lg inline-flex items-center gap-1.5 text-xs font-black text-slate-500">
                            <Calendar size={12} />
                            {joven.edad || '—'} AÑOS
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex gap-2 flex-wrap max-w-[200px]">
                            {joven.bautizado && <StatusBadge label="B" full="Bautizado" color="#00338D" />}
                            {joven.sellado && <StatusBadge label="S" full="Sellado" color="#F5A623" />}
                            {joven.servidor && <StatusBadge label="V" full="Servidor" color="#0066B3" />}
                            {joven.simpatizante && <StatusBadge label="P" full="Simpatizante" color="#009FDA" />}
                            {!joven.bautizado && !joven.sellado && !joven.servidor && !joven.simpatizante && (
                              <span className="text-[10px] font-bold text-slate-300 uppercase italic">Sin estado</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButton icon={Eye} color="#00338D" href={`/dashboard/jovenes/${joven.id}`} />
                            <ActionButton icon={Edit2} color="#0066B3" href={`/dashboard/jovenes/${joven.id}/editar`} />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteClick(joven)}
                              className="w-10 h-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Footer in Card */}
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                PÁGINA {currentPage} DE {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-4 rounded-xl font-bold py-0"
                >
                  ANTERIOR
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 px-4 rounded-xl font-bold py-0"
                >
                  SIGUIENTE
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-red-600 h-2 w-full" />
          <div className="p-8 md:p-10 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Eliminar Registro</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium pt-2">
                ¿Está completamente seguro de eliminar a <span className="font-bold text-slate-900">{selectedJoven?.nombre_completo}</span>? Esta acción es definitiva y no podrá recuperarse el historial ministerial de este miembro.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
                className="h-12 rounded-xl font-bold px-6"
              >
                No, cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-lg shadow-red-200"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, eliminar permanentemente'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function SummaryItem({ label, value, color }: any) {
  return (
    <Card className="p-5 border-slate-100 shadow-lg shadow-slate-200/30 rounded-3xl bg-white border-l-4" style={{ borderLeftColor: color }}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
    </Card>
  );
}

function FilterSelect({ value, onValueChange, placeholder, children }: any) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-11 min-w-[140px] rounded-xl border-slate-200 bg-slate-50 font-bold text-xs text-slate-600">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
        {children}
      </SelectContent>
    </Select>
  );
}

function StatusBadge({ label, full, color }: any) {
  return (
    <div
      className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm cursor-help"
      style={{ backgroundColor: color }}
      title={full}
    >
      {label}
    </div>
  );
}

function ActionButton({ icon: Icon, color, href }: any) {
  return (
    <Link href={href}>
      <Button
        size="icon"
        variant="ghost"
        className="w-10 h-10 rounded-xl text-slate-400 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group/btn"
      >
        <Icon size={18} className="group-hover/btn:scale-110 transition-transform" style={{ color: color }} />
      </Button>
    </Link>
  );
}
