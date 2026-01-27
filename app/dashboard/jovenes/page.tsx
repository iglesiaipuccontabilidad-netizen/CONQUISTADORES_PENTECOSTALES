'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useJovenes } from '@/hooks/useJovenes';

// Función utilitaria para calcular edad precisa
const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Si aún no ha llegado el cumpleaños este año, restar 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
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
import {
  Edit2,
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown,
  Search,
  UserPlus,
  Filter,
  Phone,
  ShieldCheck,
  Target,
  Zap,
  Heart,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  Download,
  FilterX
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence, LayoutGroup, easeOut } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Joven } from '@/types/index';

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number | string;
  color: 'blue' | 'emerald' | 'violet' | 'amber';
  subLabel?: string;
  isLoading?: boolean;
}

interface BadgeProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  variant: 'emerald' | 'violet' | 'amber' | 'rose' | 'blue';
  label: string;
}

export default function JovenesPage() {
  const { jovenes, isLoading, deleteJoven } = useJovenes();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJoven, setSelectedJoven] = useState<Joven | null>(null);
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

  // Estadísticas
  const stats = useMemo(() => {
    if (!jovenes) return { total: 0, bautizados: 0, sellados: 0, servidores: 0 };
    return {
      total: jovenes.length,
      bautizados: jovenes.filter(j => j.bautizado).length,
      sellados: jovenes.filter(j => j.sellado).length,
      servidores: jovenes.filter(j => j.servidor).length,
    };
  }, [jovenes]);

  // Filtrar, ordenar y paginar jóvenes
  const processedJovenes = useMemo(() => {
    if (!jovenes) return { filtered: [], totalPages: 0, paginated: [] };

    let filtered = jovenes.filter((joven) =>
      joven.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      joven.id?.includes(searchTerm) ||
      joven.celular?.includes(searchTerm)
    );

    if (edadFilter !== 'todos') {
      const [min, max] = edadFilter.split('-').map(Number);
      filtered = filtered.filter((joven) => {
        const edad = calculateAge(joven.fecha_nacimiento);
        return edad >= min && (max ? edad <= max : true);
      });
    }

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

    if (mesCumpleanosFilter !== 'todos') {
      const mes = parseInt(mesCumpleanosFilter);
      filtered = filtered.filter((joven) => {
        if (!joven.fecha_nacimiento) return false;
        const fecha = new Date(joven.fecha_nacimiento);
        return fecha.getUTCMonth() === mes;
      });
    }

    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      switch (sortField) {
        case 'nombre_completo': aValue = a.nombre_completo || ''; bValue = b.nombre_completo || ''; break;
        case 'edad': aValue = calculateAge(a.fecha_nacimiento); bValue = calculateAge(b.fecha_nacimiento); break;
        default: aValue = a.nombre_completo || ''; bValue = b.nombre_completo || '';
      }
      if (typeof aValue === 'string') { 
        aValue = aValue.toLowerCase(); 
        bValue = (bValue as string).toLowerCase(); 
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { filtered, totalPages, paginated };
  }, [jovenes, searchTerm, edadFilter, estadoFilter, mesCumpleanosFilter, sortField, sortDirection, currentPage]);

  const { filtered: filteredJovenes, totalPages, paginated: displayedJovenes } = processedJovenes;

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setEdadFilter('todos');
    setEstadoFilter('todos');
    setMesCumpleanosFilter('todos');
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

  const handleDeleteClick = (joven: Joven) => {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } }
  };

  return (
    <motion.div
      className="space-y-8 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Directorio <span className="text-blue-600">Jóvenes</span>
            <Sparkles className="text-amber-400 h-8 w-8 animate-pulse" />
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Gestiona la comunidad de Conquistadores con herramientas avanzadas.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <Button variant="outline" className="h-12 border-slate-200 hover:bg-slate-50 rounded-2xl px-6 font-bold transition-all flex items-center gap-2">
            <Download size={18} />
            Exportar
          </Button>
          <Link href="/dashboard/jovenes/nuevo">
            <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none">
              <UserPlus className="mr-2 h-5 w-5" />
              Registrar Nuevo
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats Cards Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Jóvenes"
          value={stats.total}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          icon={ShieldCheck}
          label="Bautizados"
          value={stats.bautizados}
          color="emerald"
          subLabel={`${Math.round((stats.bautizados / (stats.total || 1)) * 100)}% del total`}
          isLoading={isLoading}
        />
        <StatCard
          icon={Target}
          label="Sellados"
          value={stats.sellados}
          color="violet"
          subLabel={`${Math.round((stats.sellados / (stats.total || 1)) * 100)}% del total`}
          isLoading={isLoading}
        />
        <StatCard
          icon={Zap}
          label="Servidores"
          value={stats.servidores}
          color="amber"
          subLabel="Liderazgo activo"
          isLoading={isLoading}
        />
      </motion.div>

      {/* Advanced Search & Filters */}
      <motion.div variants={itemVariants}>
        <Card className="p-1 border-none shadow-2xl shadow-slate-200/50 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
          <div className="bg-white rounded-[2.2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
                  <Input
                    placeholder="Busca por nombre, cédula o cualquier dato..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-16 pl-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all text-lg font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="flex items-center gap-2 px-6 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/50">
                  <Filter size={20} className="animate-pulse" />
                  <span className="text-sm font-black uppercase tracking-widest">{filteredJovenes.length} Encontrados</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Edad</label>
                  <Select value={edadFilter} onValueChange={handleFilterChange(setEdadFilter)}>
                    <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/10">
                      <SelectValue placeholder="Cualquier edad" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                      <SelectItem value="todos">Todas las edades</SelectItem>
                      <SelectItem value="12-15">12 a 15 años</SelectItem>
                      <SelectItem value="16-18">16 a 18 años</SelectItem>
                      <SelectItem value="19-25">19 a 25 años</SelectItem>
                      <SelectItem value="26-30">26 a 30 años</SelectItem>
                      <SelectItem value="31-100">31 años o más</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Estatus</label>
                  <Select value={estadoFilter} onValueChange={handleFilterChange(setEstadoFilter)}>
                    <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/10">
                      <SelectValue placeholder="Cualquier estado" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="bautizado">Bautizados</SelectItem>
                      <SelectItem value="sellado">Sellados</SelectItem>
                      <SelectItem value="servidor">Servidores</SelectItem>
                      <SelectItem value="simpatizante">Simpatizantes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cumpleaños</label>
                  <Select value={mesCumpleanosFilter} onValueChange={handleFilterChange(setMesCumpleanosFilter)}>
                    <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/10">
                      <SelectValue placeholder="Mes de nacimiento" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl max-h-60">
                      <SelectItem value="todos">Cualquier mes</SelectItem>
                      {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((mes, i) => (
                        <SelectItem key={i} value={i.toString()}>{mes}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="h-12 w-full rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 transition-all"
                  >
                    <FilterX size={18} />
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Table Content */}
      <motion.div variants={itemVariants} className="relative">
        <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white rounded-[2.5rem] overflow-hidden">
          {isLoading ? (
            <div className="p-10 space-y-6">
              <div className="flex gap-4">
                {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-12 flex-1 bg-slate-100 rounded-xl" />)}
              </div>
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full bg-slate-50/50 rounded-2xl" />)}
            </div>
          ) : filteredJovenes.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-32 w-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200 relative"
              >
                <Search size={60} />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-full"
                />
              </motion.div>
              <h3 className="text-2xl font-black text-slate-900">No se encontraron resultados</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto text-lg">
                Intenta ajustar los filtros o ampliar los términos de tu búsqueda para obtener resultados.
              </p>
              <Button
                variant="outline"
                className="mt-8 rounded-2xl h-12 px-8 border-slate-200 font-bold hover:bg-slate-50 transition-all"
                onClick={clearFilters}
              >
                Restablecer vista por defecto
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="py-6 px-8 font-black text-slate-900 uppercase tracking-[0.15em] text-[10px]">
                      <button onClick={() => handleSort('nombre_completo')} className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                        Nombre Completo
                        <div className={cn("transition-all", sortField === 'nombre_completo' ? "text-blue-600" : "text-slate-300 opacity-0 group-hover:opacity-100")}>
                          {sortField === 'nombre_completo' && sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>
                    </TableHead>
                    <TableHead className="font-black text-slate-900 uppercase tracking-[0.15em] text-[10px]">Contacto</TableHead>
                    <TableHead className="font-black text-slate-900 uppercase tracking-[0.15em] text-[10px]">
                      <button onClick={() => handleSort('edad')} className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                        Edad
                        <div className={cn("transition-all", sortField === 'edad' ? "text-blue-600" : "text-slate-300 opacity-0 group-hover:opacity-100")}>
                          {sortField === 'edad' && sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>
                    </TableHead>
                    <TableHead className="font-black text-slate-900 uppercase tracking-[0.15em] text-[10px]">Ecosistema</TableHead>
                    <TableHead className="text-right px-8 font-black text-slate-900 uppercase tracking-[0.15em] text-[10px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    <LayoutGroup>
                      {displayedJovenes.map((joven) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          key={joven.id}
                          className="group hover:bg-blue-50/40 transition-all border-b border-slate-50 relative"
                        >
                          <TableCell className="py-5 px-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                                  {joven.nombre_completo?.[0].toUpperCase()}
                                </div>
                                {joven.servidor && (
                                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center text-white shadow-sm">
                                    <Star size={10} fill="currentColor" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <Link href={`/dashboard/jovenes/${joven.id}`} className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                  {joven.nombre_completo}
                                </Link>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1.5">
                              <a
                                href={`tel:${joven.celular}`}
                                className="flex items-center gap-2 text-sm text-slate-600 font-bold hover:text-blue-600 transition-colors w-fit"
                              >
                                <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <Phone size={14} />
                                </div>
                                {joven.celular || 'Sin celular'}
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xl font-black text-slate-900 tracking-tight leading-none">{calculateAge(joven.fecha_nacimiento)}</span>
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Años</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 flex-wrap max-w-[240px]">
                              {joven.bautizado && <Badge icon={ShieldCheck} variant="emerald" label="Bautizado" />}
                              {joven.sellado && <Badge icon={Target} variant="violet" label="Sellado" />}
                              {joven.servidor && <Badge icon={Zap} variant="amber" label="Servidor" />}
                              {joven.simpatizante && <Badge icon={Heart} variant="rose" label="Simpatizante" />}
                              {!joven.bautizado && !joven.sellado && !joven.servidor && !joven.simpatizante && (
                                <span className="text-xs text-slate-300 font-medium italic">Sin etiquetas</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
                              <Link href={`/dashboard/jovenes/${joven.id}`}>
                                <button className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-lg hover:shadow-blue-200">
                                  <Eye size={20} />
                                </button>
                              </Link>
                              <Link href={`/dashboard/jovenes/${joven.id}/editar`}>
                                <button className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-slate-200">
                                  <Edit2 size={20} />
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(joven)}
                                className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm hover:shadow-lg hover:shadow-rose-200"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </LayoutGroup>
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Modern Pagination */}
      {!isLoading && totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-6 bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100/50"
        >
          <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
            Página <span className="text-slate-900">{currentPage}</span> de <span className="text-slate-900">{totalPages}</span> — <span className="text-blue-600">{filteredJovenes.length} registros</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-12 w-12 rounded-2xl border-slate-100 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronUp className="-rotate-90 h-5 w-5" />
            </Button>

            <div className="hidden sm:flex items-center gap-2 px-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Lógica de truncado de páginas
                if (totalPages > 5 && Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                  if (Math.abs(pageNum - currentPage) === 2) return <span key={i} className="text-slate-300">...</span>;
                  return null;
                }
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "h-12 w-12 rounded-2xl text-sm font-black transition-all duration-300",
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110 z-10"
                        : "hover:bg-slate-50 text-slate-400 hover:text-slate-900"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-12 w-12 rounded-2xl border-slate-100 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronDown className="-rotate-90 h-5 w-5" />
            </Button>
          </div>

          <div className="hidden lg:block">
            <Button variant="ghost" className="rounded-xl px-4 text-xs font-bold text-blue-600 hover:bg-blue-50">
              Ir al final <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Enhanced Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
          <div className="bg-rose-600 h-2.5 w-full" />
          <div className="p-10">
            <DialogHeader>
              <div className="h-20 w-20 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center mb-8 mx-auto ring-8 ring-rose-50/50">
                <Trash2 size={40} className="animate-bounce" />
              </div>
              <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight text-center">¿Eliminar registro?</DialogTitle>
              <DialogDescription className="text-slate-500 text-lg font-medium pt-3 text-center leading-relaxed">
                Estás a punto de borrar definitivamente a <br />
                <span className="text-slate-900 font-black uppercase tracking-tight">{selectedJoven?.nombre_completo}</span>.<br />
                Esta acción no se puede revertir.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-12 flex flex-col gap-3">
              <Button
                variant="outline"
                className="h-14 w-full rounded-2xl border-slate-200 font-black text-slate-600 hover:bg-slate-50 transition-all text-base"
                onClick={() => setDeleteDialogOpen(false)}
              >
                No, mantener registro
              </Button>
              <Button
                variant="destructive"
                className="h-14 w-full rounded-2xl bg-rose-600 hover:bg-rose-700 font-black shadow-2xl shadow-rose-600/30 transition-all scale-100 hover:scale-[1.02] active:scale-95 text-base"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </div>
                ) : 'Sí, eliminar permanentemente'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color, subLabel, isLoading }: StatCardProps) {
  const colors: Record<StatCardProps['color'], string> = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-200 text-blue-600 bg-blue-50/50",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-200 text-emerald-600 bg-emerald-50/50",
    violet: "from-violet-500 to-purple-600 shadow-violet-200 text-violet-600 bg-violet-50/50",
    amber: "from-amber-400 to-orange-500 shadow-amber-200 text-amber-600 bg-amber-50/50",
  };

  return (
    <Card className="p-0 border-none shadow-xl shadow-slate-200/40 bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden group">
      <div className="p-6 flex items-center gap-5">
        <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", colors[color])}>
          <Icon size={32} />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">{label}</p>
          {isLoading ? (
            <Skeleton className="h-10 w-20 bg-slate-100 rounded-lg mt-1" />
          ) : (
            <>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
              {subLabel && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{subLabel}</p>}
            </>
          )}
        </div>
      </div>
      <div className={cn("h-1.5 w-full bg-slate-100", `bg-gradient-to-r ${colors[color].split(' ').slice(0, 2).join(' ')} opacity-20`)} />
    </Card>
  );
}

function Badge({ icon: Icon, variant, label }: BadgeProps) {
  const families: Record<BadgeProps['variant'], string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100/50 shadow-emerald-100/20",
    violet: "bg-purple-50 text-purple-700 border-purple-100/50 shadow-purple-100/20",
    amber: "bg-amber-50 text-amber-700 border-amber-100/50 shadow-amber-100/20",
    rose: "bg-rose-50 text-rose-700 border-rose-100/50 shadow-rose-100/20",
    blue: "bg-blue-50 text-blue-700 border-blue-100/50 shadow-blue-100/20",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm",
      families[variant]
    )}>
      <Icon size={12} className="opacity-70 stroke-[3px]" />
      {label}
    </div>
  );
}
