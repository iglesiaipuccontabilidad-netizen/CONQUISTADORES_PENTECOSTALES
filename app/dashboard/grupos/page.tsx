'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Edit2, Trash2, Eye, Users, Search, UserPlus, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

// Mock data - reemplazar con hook real cuando esté disponible
const mockGrupos = [
  {
    id: '1',
    nombre: 'Grupo Alfa (Varones)',
    descripcion: 'Liderazgo y formación ministerial para jóvenes varones.',
    lider_id: 'user1',
    lider_nombre: 'Caleb Aguilar',
    integrantes_count: 15,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    nombre: 'Grupo Ester (Damas)',
    descripcion: 'Crecimiento espiritual y servicio abnegado para señoritas.',
    lider_id: 'user2',
    lider_nombre: 'Sara Uzcategui',
    integrantes_count: 12,
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
      toast.error(error.message || 'Error al eliminar grupo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
            GRUPOS <span className="text-[#00338D] ml-2">MINISTERIALES</span>
            <ShieldCheck className="ml-3 w-6 h-6 text-[#F5A623]" />
          </h1>
          <p className="text-slate-500 font-medium font-prose uppercase tracking-widest text-xs opacity-70">
            Unidades de Crecimiento - IPUC Unánimes
          </p>
        </div>
        <Link href="/dashboard/grupos/nuevo">
          <Button className="h-12 px-6 rounded-2xl bg-[#00338D] hover:bg-[#00338D]/90 text-white font-bold shadow-lg shadow-[#00338D]/20 transition-all">
            <UserPlus size={18} className="mr-2" />
            NUEVO GRUPO
          </Button>
        </Link>
      </div>

      {/* Search Bar Premium */}
      <Card className="p-6 md:p-8 border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white">
        <div className="relative group">
          <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#00338D] transition-colors" size={20} />
          <Input
            placeholder="Buscar por nombre, descripción o líder del grupo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#00338D]/20 focus:border-[#00338D] transition-all"
          />
        </div>
      </Card>

      {/* Groups Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array(2).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />
          ))
        ) : filteredGrupos.length === 0 ? (
          <div className="col-span-full p-20 text-center space-y-4">
            <Users size={40} className="mx-auto text-slate-300" />
            <p className="text-slate-500 font-bold">No se encontraron grupos</p>
          </div>
        ) : (
          filteredGrupos.map((grupo) => (
            <motion.div
              layout
              key={grupo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/30 rounded-[2.5rem] bg-white h-full flex flex-col justify-between transition-all group-hover:border-[#00338D]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00338D]/5 rounded-bl-[3rem] -mr-8 -mt-8" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#F5A623] uppercase tracking-[0.2em] bg-[#F5A623]/10 px-3 py-1 rounded-full">Activo</span>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                      <Users size={14} />
                      {grupo.integrantes_count} miembros
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{grupo.nombre}</h3>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed font-medium">{grupo.descripcion}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-[#00338D]">
                      {grupo.lider_nombre.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liderado por</span>
                      <span className="text-sm font-bold text-slate-700">{grupo.lider_nombre}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-8 mt-auto border-t border-slate-50 relative z-10">
                  <Link href={`/dashboard/grupos/${grupo.id}`} className="flex-1">
                    <Button variant="outline" className="w-full h-11 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-[#00338D]/5 hover:text-[#00338D] transition-all">
                      <Eye size={16} className="mr-2" /> VER DETALLES
                    </Button>
                  </Link>
                  <Link href={`/dashboard/grupos/${grupo.id}/editar`}>
                    <Button size="icon" variant="ghost" className="w-11 h-11 rounded-xl text-slate-400 hover:text-[#0066B3] hover:bg-[#0066B3]/5">
                      <Edit2 size={16} />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteClick(grupo)}
                    className="w-11 h-11 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-red-600 h-2 w-full" />
          <div className="p-8 md:p-10 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Eliminar Grupo</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium pt-2">
                ¿Está seguro de que desea eliminar el <span className="font-bold text-slate-900">{selectedGrupo?.nombre}</span>? Los miembros asociados al grupo perderán su vinculación, pero sus datos personales permanecerán en el sistema.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 pt-4">
              <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="h-12 rounded-xl font-bold px-6">Cancelar</Button>
              <Button onClick={handleConfirmDelete} disabled={isDeleting} className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-lg shadow-red-200">
                {isDeleting ? 'Eliminando...' : 'Eliminar Grupo'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}