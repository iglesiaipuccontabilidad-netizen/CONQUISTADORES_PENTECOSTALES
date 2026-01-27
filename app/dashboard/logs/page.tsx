'use client';

import { useState } from 'react';
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
  Database,
  Eye,
  Download
} from 'lucide-react';

// Types
interface ActivityLog {
  id: string;
  usuario: string;
  accion: string;
  tabla: string;
  registro_id: string;
  fecha: string;
  ip: string;
  detalles: Record<string, string | number | boolean>;
}

interface DeletionLog {
  id: string;
  tabla: string;
  registro_id: string;
  eliminado_por: string;
  motivo: string;
  fecha: string;
  datos_eliminados: Record<string, string | number | boolean>;
}

// Mock data
const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    usuario: 'admin@conquistadores.org',
    accion: 'CREATE',
    tabla: 'jovenes',
    registro_id: '123',
    fecha: '2024-01-19 10:30:00',
    ip: '192.168.1.100',
    detalles: { nombre_completo: 'Juan Pérez', celular: '3001234567' }
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

const mockDeletionHistory = [
  {
    id: '1',
    tabla: 'jovenes',
    registro_id: '125',
    eliminado_por: 'admin@conquistadores.org',
    motivo: 'Solicitud del interesado',
    fecha: '2024-01-19 12:00:00',
    datos_eliminados: {
      nombre_completo: 'María García',
      celular: '3009876543',
      fecha_nacimiento: '2000-05-15'
    }
  },
];

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [accionFilter, setAccionFilter] = useState('todos');
  const [usuarioFilter, setUsuarioFilter] = useState('todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | DeletionLog | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Mock loading
  const isLoading = false;

  const filteredActivityLogs = mockActivityLogs.filter(log => {
    const matchesSearch = log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.tabla.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.accion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccion = accionFilter === 'todos' || log.accion === accionFilter;
    const matchesUsuario = usuarioFilter === 'todos' || log.usuario === usuarioFilter;

    return matchesSearch && matchesAccion && matchesUsuario;
  });

  const filteredDeletionHistory = mockDeletionHistory.filter(log => {
    return log.eliminado_por.toLowerCase().includes(searchTerm.toLowerCase()) ||
           log.tabla.toLowerCase().includes(searchTerm.toLowerCase()) ||
           log.motivo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getAccionBadge = (accion: string) => {
    const variants = {
      CREATE: 'default',
      UPDATE: 'secondary',
      DELETE: 'destructive',
      READ: 'outline'
    } as const;
    return <Badge variant={variants[accion as keyof typeof variants] || 'outline'}>{accion}</Badge>;
  };

  const handleViewDetails = (log: ActivityLog | DeletionLog) => {
    setSelectedLog(log);
    setDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Logs y Auditoría</h1>
          <p className="text-slate-500 mt-1">Historial de actividades y eliminaciones</p>
        </div>
        <Button variant="outline">
          <Download size={16} className="mr-2" />
          Exportar Logs
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por usuario, tabla, acción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={accionFilter} onValueChange={setAccionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por acción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las acciones</SelectItem>
              <SelectItem value="CREATE">Crear</SelectItem>
              <SelectItem value="UPDATE">Actualizar</SelectItem>
              <SelectItem value="DELETE">Eliminar</SelectItem>
              <SelectItem value="READ">Leer</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            placeholder="Desde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Hasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="actividad" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actividad" className="flex items-center gap-2">
            <Activity size={16} />
            Actividad de Usuarios
          </TabsTrigger>
          <TabsTrigger value="eliminaciones" className="flex items-center gap-2">
            <Trash2 size={16} />
            Historial de Eliminaciones
          </TabsTrigger>
        </TabsList>

        {/* Actividad de Usuarios */}
        <TabsContent value="actividad">
          <Card className="overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Tabla</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivityLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{log.usuario}</TableCell>
                        <TableCell>{getAccionBadge(log.accion)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Database size={14} className="text-slate-400" />
                            {log.tabla}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500">{log.fecha}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(log)}
                          >
                            <Eye size={14} />
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

        {/* Historial de Eliminaciones */}
        <TabsContent value="eliminaciones">
          <Card className="overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeletionHistory.map((log) => (
                  <Card key={log.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Trash2 size={16} className="text-red-500" />
                          <span className="font-medium">Eliminación en {log.tabla}</span>
                          <Badge variant="outline">ID: {log.registro_id}</Badge>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p><strong>Eliminado por:</strong> {log.eliminado_por}</p>
                          <p><strong>Motivo:</strong> {log.motivo}</p>
                          <p><strong>Fecha:</strong> {log.fecha}</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-slate-700 mb-1">Datos eliminados:</p>
                          <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.datos_eliminados, null, 2)}
                          </pre>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye size={14} className="mr-1" />
                        Ver Detalles
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedLog && 'usuario' in selectedLog ? 'Detalles de la Actividad' : 'Detalles de Eliminación'}
            </DialogTitle>
            <DialogDescription>
              Información completa de la acción realizada
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              {'usuario' in selectedLog ? (
                // Activity Log
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-700">Usuario</p>
                      <p>{selectedLog.usuario}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">Acción</p>
                      <p>{selectedLog.accion}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">Tabla</p>
                      <p>{selectedLog.tabla}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">ID Registro</p>
                      <p>{selectedLog.registro_id}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">Fecha</p>
                      <p>{selectedLog.fecha}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">IP</p>
                      <p className="font-mono">{selectedLog.ip}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-2">Detalles</p>
                    <pre className="bg-slate-100 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.detalles, null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                // Deletion Log
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-700">Eliminado por</p>
                      <p>{selectedLog.eliminado_por}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">Tabla</p>
                      <p>{selectedLog.tabla}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">ID Registro</p>
                      <p>{selectedLog.registro_id}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">Fecha</p>
                      <p>{selectedLog.fecha}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium text-slate-700">Motivo</p>
                      <p>{selectedLog.motivo}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-2">Datos Eliminados</p>
                    <pre className="bg-slate-100 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.datos_eliminados, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}