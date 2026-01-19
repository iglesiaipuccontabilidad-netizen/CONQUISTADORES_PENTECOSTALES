'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Users, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Mock data
const mockReportes = {
  general: {
    totalJovenes: 150,
    bautizados: 45,
    sellados: 32,
    servidores: 28,
    simpatizantes: 45,
    crecimientoMensual: [
      { mes: 'Ene', total: 120 },
      { mes: 'Feb', total: 135 },
      { mes: 'Mar', total: 142 },
      { mes: 'Abr', total: 150 },
    ]
  }
};

export default function ReportesPage() {
  const [tipoReporte, setTipoReporte] = useState('general');
  const [formato, setFormato] = useState('excel');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const tiposReporte = [
    { value: 'general', label: 'General', icon: FileText },
    { value: 'edad', label: 'Por Edad', icon: Users },
    { value: 'estado', label: 'Estado Espiritual', icon: TrendingUp },
    { value: 'cumpleanos', label: 'Cumpleaños', icon: Calendar },
    { value: 'grupos', label: 'Por Grupos', icon: Users },
    { value: 'crecimiento', label: 'Crecimiento', icon: TrendingUp },
  ];

  const handleGenerarReporte = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implementar generación real de reportes
      console.log('Generando reporte:', { tipoReporte, formato, fechaDesde, fechaHasta });

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Descargar archivo
      alert(`Reporte ${tipoReporte} generado en formato ${formato.toUpperCase()}`);
    } catch (error) {
      console.error('Error generando reporte:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPreview = () => {
    switch (tipoReporte) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockReportes.general.totalJovenes}</div>
                  <p className="text-sm text-slate-600">Total Jóvenes</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{mockReportes.general.bautizados}</div>
                  <p className="text-sm text-slate-600">Bautizados</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{mockReportes.general.sellados}</div>
                  <p className="text-sm text-slate-600">Sellados</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{mockReportes.general.servidores}</div>
                  <p className="text-sm text-slate-600">Servidores</p>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Crecimiento Mensual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockReportes.general.crecimientoMensual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        );

      default:
        return (
          <Card className="p-8 text-center text-slate-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>Selecciona un tipo de reporte para ver la previsualización</p>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reportes</h1>
        <p className="text-slate-500 mt-1">Genera reportes detallados del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Configuración */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Configurar Reporte</h2>

            <div className="space-y-4">
              {/* Tipo de Reporte */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Tipo de Reporte
                </label>
                <Select value={tipoReporte} onValueChange={setTipoReporte}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposReporte.map((tipo) => {
                      const Icon = tipo.icon;
                      return (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          <div className="flex items-center gap-2">
                            <Icon size={16} />
                            {tipo.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Formato */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Formato de Exportación
                </label>
                <Select value={formato} onValueChange={setFormato}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtros de Fecha */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Desde
                  </label>
                  <Input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Hasta
                  </label>
                  <Input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                  />
                </div>
              </div>

              {/* Botón Generar */}
              <Button
                onClick={handleGenerarReporte}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  'Generando...'
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Generar Reporte
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Información */}
          <Card className="p-4">
            <h3 className="font-medium text-slate-900 mb-2">Información</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p>• Los reportes incluyen datos actualizados</p>
              <p>• Formato Excel incluye múltiples hojas</p>
              <p>• PDF incluye gráficos y tablas</p>
              <p>• CSV para análisis externos</p>
            </div>
          </Card>
        </div>

        {/* Previsualización */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Previsualización</h2>
              <Badge variant="outline">
                {tiposReporte.find(t => t.value === tipoReporte)?.label}
              </Badge>
            </div>

            {renderPreview()}
          </Card>
        </div>
      </div>
    </div>
  );
}