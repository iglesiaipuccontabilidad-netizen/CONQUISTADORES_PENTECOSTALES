'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  Trash2,
  Search,
  Calendar,
  User,
  Database,
  Eye,
  Download,
  ShieldAlert,
  Clock,
  Fingerprint,
  RotateCcw,
  Zap
} from 'lucide-react';

// Mock data
const mockActivityLogs = [
  {
    id: '1',
    usuario: 'admin@conquistadores.org',
    accion: 'CREATE',
    tabla: 'jovenes',
    registro_id: '123',
    fecha: '2024-01-19 10:30:00',
    ip: '192.168.1.100',
    detalles: { nombre_completo: 'Juan Pérez', cedula: '12345678' }
  },
  {
    id: '2',
    usuario: 'admin@conquistadores.org',
    accion: 'UPDATE',
    tabla: 'jovenes',
    registro_id: '124',
    fecha: '2024-01-19 11:15:00',
    ip: '192.168.1.100',
    detalles: { bautizado: true, servidor: false }
  },
  {
    id: '3',
    usuario: 'admin@conquistadores.org',
    accion: 'DELETE',
    tabla: 'jovenes',
    registro_id: '125',
    fecha: '2024-01-19 12:00:00',
    ip: '192.168.1.100',
    detalles: { nombre_completo: 'María García', motivo: 'Solicitud del interesado' }
  },
];

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [accionFilter, setAccionFilter] = useState('todos');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Mock loading
  const isLoading = false;

  const filteredActivityLogs = mockActivityLogs.filter(log => {
    const matchesSearch = log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tabla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccion = accionFilter === 'todos' || log.accion === accionFilter;
    return matchesSearch && matchesAccion;
  });

  const getAccionBadge = (accion: string) => {
    const map: any = {
      CREATE: { color: '#0066B3', bg: '#0066B310' },
      UPDATE: { color: '#F5A623', bg: '#F5A62310' },
      DELETE: { color: '#ef4444', bg: '#ef444410' },
      READ: { color: '#00338D', bg: '#00338D10' }
    };
    const style = map[accion] || { color: '#64748b', bg: '#f1f5f9' };
    return (
      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest" style={{ color: style.color, backgroundColor: style.bg }}>
        {accion}
      </span>
    );
  };

  const handleViewDetails = (log: any) => {
    setSelectedLog(log);
    setDetailsDialogOpen(true);
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
            LOGS DE <span className="text-[#00338D] ml-2">AUDITORÍA</span>
            <ShieldAlert className="ml-3 w-6 h-6 text-[#F5A623]" />
          </h1>
          <p className="text-slate-500 font-medium font-prose uppercase tracking-widest text-xs opacity-70">
            Trazabilidad e Integridad de Datos - Unánimes
          </p>
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50">
          <Download size={18} className="mr-2" />
          EXPORTAR REGISTROS
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="p-6 md:p-8 border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative group">
            <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#00338D] transition-colors" size={20} />
            <Input
              placeholder="Buscar usuario o acción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
          <Select value={accionFilter} onValueChange={setAccionFilter}>
            <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold uppercase tracking-widest text-[10px]">
              <SelectValue placeholder="Acción" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="todos">TODAS LAS ACCIONES</SelectItem>
              <SelectItem value="CREATE">CREAR</SelectItem>
              <SelectItem value="UPDATE">ACTUALIZAR</SelectItem>
              <SelectItem value="DELETE">ELIMINAR</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 px-6 bg-slate-50 rounded-2xl border border-slate-200">
            <Clock size={18} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizado</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="actividad" className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-[1.8rem] border border-slate-100 h-auto">
          <TabsTrigger value="actividad" className="rounded-[1.3rem] py-3.5 px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-[#00338D] data-[state=active]:text-white">
            Actividad Global
          </TabsTrigger>
          <TabsTrigger value="eliminaciones" className="rounded-[1.3rem] py-3.5 px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Eliminaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="actividad">
          <Card className="overflow-hidden border-slate-100 shadow-2xl rounded-[2.5rem] bg-white h-full relative overflow-hidden">
            {isLoading ? (
              <div className="p-10 space-y-4">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b border-slate-100">
                      <TableHead className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">USUARIO</TableHead>
                      <TableHead className="px-6 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">EVENTO</TableHead>
                      <TableHead className="px-6 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">MÓDULO</TableHead>
                      <TableHead className="px-6 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">TIMESTAMP</TableHead>
                      <TableHead className="px-6 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">DIRECCIÓN IP</TableHead>
                      <TableHead className="px-8 py-5 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">ACCIONES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivityLogs.map((log) => (
                      <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#00338D]/5 flex items-center justify-center">
                              <User size={14} className="text-[#00338D]" />
                            </div>
                            <span className="font-bold text-slate-700">{log.usuario}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">{getAccionBadge(log.accion)}</TableCell>
                        <TableCell className="px-6 py-5 h-16">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tight">
                            <Database size={14} className="text-slate-300" />
                            {log.tabla}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <Clock size={14} className="text-slate-300" />
                            {log.fecha}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 font-mono text-[10px] text-slate-400">{log.ip}</TableCell>
                        <TableCell className="px-8 py-5 text-right">
                          <Button size="icon" variant="ghost" className="w-10 h-10 rounded-xl" onClick={() => handleViewDetails(log)}>
                            <Eye size={18} className="text-[#00338D]" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="eliminaciones">
          <Card className="p-20 text-center space-y-4 border-slate-100 shadow-xl rounded-[2.5rem] bg-white border-dashed border-2">
            <RotateCcw size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Módulo de recuperación inactivo</p>
            <p className="text-slate-400 font-medium text-[10px] max-w-xs mx-auto">Las eliminaciones son permanentes en este servidor por políticas de seguridad de datos.</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog Premium */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-[#00338D] h-2 w-full" />
          <div className="p-8 md:p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Fingerprint className="text-[#F5A623]" size={28} />
                FOOTPRINT DIGITAL
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">Detalle técnico de la operación realizada</DialogDescription>
            </DialogHeader>

            {selectedLog && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <ParamBox label="Usuario Ejecutor" value={selectedLog.usuario} />
                  <ParamBox label="Evento" value={selectedLog.accion} color="#00338D" />
                  <ParamBox label="Timestamp" value={selectedLog.fecha} />
                  <ParamBox label="Operado en IP" value={selectedLog.ip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objeto de Datos Sincronizado</label>
                  <pre className="p-6 rounded-2xl bg-[#1A1A1A] text-emerald-400 text-xs font-mono overflow-x-auto ring-1 ring-white/10 shadow-inner">
                    {JSON.stringify(selectedLog.detalles, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function ParamBox({ label, value, color }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-700 truncate" style={{ color: color }}>{value}</p>
    </div>
  );
}