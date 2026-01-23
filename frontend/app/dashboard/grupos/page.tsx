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
import {
  Edit2,
  Trash2,
  Eye,
  Users,
  Search,
  Plus,
  Shield,
  Calendar,
  Layers,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock data
const mockGrupos = [
  {
    id: '1',
    nombre: 'Grupo Alfa',
    descripcion: 'Grupo enfocado en la formación de líderes y jóvenes comprometidos con el servicio ministerial.',
    lider_id: 'user1',
    lider_nombre: 'Juan Pérez',
    integrantes_count: 15,
    created_at: '2024-01-15',
    color: 'blue'
  },
  {
    id: '2',
    nombre: 'Grupo Beta',
    descripcion: 'Espacio dedicado a la integración de nuevos conversos y acompañamiento en su crecimiento espiritual.',
    lider_id: 'user2',
    lider_nombre: 'María García',
    integrantes_count: 8,
    created_at: '2024-02-01',
    color: 'emerald'
  },
];

export default function GruposPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock loading state
  const isLoading = false;

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Grupo eliminado correctamente');
      setDeleteDialogOpen(false);
      setSelectedGrupo(null);
    } catch (error: any) {
      toast.error('Error al intentar eliminar el grupo');
    } finally {
      setIsDeleting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.05 } }
  };

  return (
    <motion.div
      className="space-y-8 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Layers size={22} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Sociedad v3.0</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Grupos</h1>
          <p className="text-slate-500 font-medium mt-1">Organiza y supervisa los grupos de trabajo y discipulado.</p>
        </div>
        <Link href="/dashboard/grupos/nuevo">
          <Button className="h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-6 font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Grupo
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="p-6 border-slate-200/60 shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl rounded-[2rem]">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <Input
            placeholder="Buscar por nombre, descripción o líder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all text-base"
          />
        </div>
      </Card>

      {/* Main Grid/Table Content */}
      <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
        {isLoading ? (
          <div className="p-10 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10 bg-slate-50 rounded-xl" />)}
            </div>
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full bg-slate-50 rounded-2xl" />)}
          </div>
        ) : filteredGrupos.length === 0 ? (
          <div className="p-24 text-center flex flex-col items-center">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <Layers size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sin grupos registrados</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Comienza creando un nuevo grupo para organizar a los integrantes de la sociedad.</p>
            <Link href="/dashboard/grupos/nuevo" className="mt-8">
              <Button variant="outline" className="h-12 px-8 rounded-2xl border-2 font-bold hover:bg-slate-50 transition-all">
                Crear primer grupo
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-6 px-8 font-black text-slate-900 uppercase tracking-wider text-[11px]">Identificación del Grupo</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Liderazgo</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Estadísticas</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Fecha Creación</TableHead>
                  <TableHead className="text-right px-8 font-black text-slate-900 uppercase tracking-wider text-[11px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredGrupos.map((grupo) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={grupo.id}
                      className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50"
                    >
                      <TableCell className="py-6 px-8 max-w-md">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform",
                            grupo.color === 'blue' ? "bg-blue-600 text-white shadow-blue-600/20" : "bg-emerald-600 text-white shadow-emerald-600/20"
                          )}>
                            <Users size={24} />
                          </div>
                          <div>
                            <Link href={`/dashboard/grupos/${grupo.id}`} className="font-black text-slate-900 leading-tight text-lg hover:text-blue-600 transition-colors">
                              {grupo.nombre}
                            </Link>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-1 font-medium">{grupo.descripcion}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-700">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <Shield size={14} className="text-slate-500" />
                          </div>
                          <span className="font-bold text-sm">{grupo.lider_nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl w-fit">
                          <Users size={14} className="text-slate-500" />
                          <span className="font-black text-slate-900 text-sm">{grupo.integrantes_count}</span>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Miembros</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Calendar size={14} />
                          {new Date(grupo.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                          <Link href={`/dashboard/grupos/${grupo.id}`}>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                              <Eye size={18} />
                            </button>
                          </Link>
                          <Link href={`/dashboard/grupos/${grupo.id}/editar`}>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                              <Edit2 size={18} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(grupo)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Enhanced Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-rose-600 h-2 w-full" />
          <div className="p-8">
            <DialogHeader>
              <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6">
                <Trash2 size={32} />
              </div>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">¿Eliminar este grupo?</DialogTitle>
              <DialogDescription className="text-slate-500 text-lg font-medium pt-2 leading-relaxed">
                Estás a punto de disolver el grupo <span className="text-slate-900 font-bold">{selectedGrupo?.nombre}</span>. Esta acción es irreversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-10 flex gap-3 sm:justify-center">
              <Button variant="outline" className="h-12 flex-1 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 transition-all" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="h-12 flex-1 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold shadow-lg shadow-rose-600/20 transition-all"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}