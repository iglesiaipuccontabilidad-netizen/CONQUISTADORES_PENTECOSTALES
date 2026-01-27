'use client';

import { useState, useMemo } from 'react';
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
import {
  FileText,
  Download,
  Calendar,
  Users,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  ChevronRight,
  Info,
  Zap,
  Target,
  ShieldCheck,
  Eye,
  Sparkles
} from 'lucide-react';
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
  AreaChart,
  Area,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCumpleanos } from '@/hooks/useCumpleanos';

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
  const formato = 'pdf';
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mesCumpleanos, setMesCumpleanos] = useState(new Date().getMonth() + 1);

  const { cumpleanosHoy, estadisticasMes, proximos30, isLoading: loadingCumpleanos } = useCumpleanos();

  const tiposReporte = [
    { value: 'general', label: 'General Ministerial', icon: FileText, desc: 'Resumen completo de la membresía', color: '#00338D' },
    { value: 'edad', label: 'Directorio por Edad', icon: Users, desc: 'Clasificación por rangos etarios', color: '#0066B3' },
    { value: 'estado', label: 'Estado Espiritual', icon: Sparkles, desc: 'Filtro por bautismo y sellamiento', color: '#009FDA' },
    { value: 'cumpleanos', label: 'Cumpleaños del Mes', icon: Calendar, desc: 'Programación para agasajos', color: '#F5A623' },
    { value: 'grupos', label: 'Informes por Grupo', icon: Users, desc: 'Detalle de unidades de crecimiento', color: '#00338D' },
    { value: 'crecimiento', label: 'Kardex Progresivo', icon: TrendingUp, desc: 'Estadísticas de nuevos ingresos', color: '#0066B3' },
  ];

  const handleGenerarReporte = async () => {
    setIsGenerating(true);
    try {
      await generarPDF();
    } catch (error) {
      toast.error('Error al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para obtener cumpleaños por mes
  const getCumpleanosPorMes = (mes: number) => {
    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Simular datos - en producción esto vendría del hook useCumpleanos
    const mockCumpleanos = [
      { nombre: 'Juan Pérez García', fecha: `15/${mes.toString().padStart(2, '0')}/2005`, edad: 21, celular: '+57 300 123 4567' },
      { nombre: 'María José García López', fecha: `22/${mes.toString().padStart(2, '0')}/2006`, edad: 20, celular: '+57 301 234 5678' },
      { nombre: 'Carlos Andrés López Rodríguez', fecha: `08/${mes.toString().padStart(2, '0')}/2004`, edad: 22, celular: '+57 302 345 6789' },
      { nombre: 'Ana María Rodríguez Martínez', fecha: `30/${mes.toString().padStart(2, '0')}/2007`, edad: 19, celular: '+57 303 456 7890' },
      { nombre: 'Pedro José Martínez Sánchez', fecha: `12/${mes.toString().padStart(2, '0')}/2005`, edad: 21, celular: '+57 304 567 8901' },
    ];

    return {
      mes: nombresMeses[mes - 1],
      cumpleanos: mockCumpleanos,
      total: mockCumpleanos.length
    };
  };

  const generarPDF = async () => {
    const doc = new jsPDF();

    // Colores de la paleta
    const colores = {
      primario: '#00338D',
      secundario: '#F5A623',
      azulMedio: '#0066B3',
      azulClaro: '#009FDA',
      texto: '#1A1A1A',
      blanco: '#FFFFFF'
    };

    // Header del PDF
    doc.setFillColor(colores.primario);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(colores.blanco);
    doc.setFontSize(20);
    doc.text('CONQUISTADORES IPUC UNÁNIMES', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('REPORTE DE GESTIÓN DE JÓVENES', 105, 28, { align: 'center' });

    // Fecha
    doc.setTextColor(colores.texto);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 15, 50);

    let yPosition = 65;

    // Contenido según tipo de reporte
    const tipoInfo = tiposReporte.find(t => t.value === tipoReporte);
    doc.setFontSize(16);
    doc.setTextColor(colores.primario);
    doc.text(tipoInfo?.label.toUpperCase() || 'REPORTE', 15, yPosition);
    yPosition += 15;

    switch (tipoReporte) {
      case 'general':
        const datosGenerales = [
          ['Total Jóvenes Registrados', mockReportes.general.totalJovenes.toString(), 'Activos'],
          ['Jóvenes Bautizados', mockReportes.general.bautizados.toString(), '56.7%'],
          ['Jóvenes Sellados', mockReportes.general.sellados.toString(), '30.0%'],
          ['Jóvenes Servidores', mockReportes.general.servidores.toString(), '40.0%'],
          ['Grupos Activos', '8', 'Líderes asignados'],
          ['Cumpleaños este mes', '12', 'Próximos 30 días: 25']
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Indicador', 'Valor', 'Observaciones']],
          body: datosGenerales,
          theme: 'grid',
          headStyles: { fillColor: colores.primario, textColor: colores.blanco },
          styles: { fontSize: 10 }
        });
        break;

      case 'edad':
        const datosEdad = [
          ['12-15 años', '45', '30.0%'],
          ['16-18 años', '52', '34.7%'],
          ['19-25 años', '38', '25.3%'],
          ['26-30 años', '12', '8.0%'],
          ['31-35 años', '3', '2.0%']
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Rango de Edad', 'Cantidad', 'Porcentaje']],
          body: datosEdad,
          theme: 'grid',
          headStyles: { fillColor: colores.secundario, textColor: colores.texto },
          styles: { fontSize: 10 }
        });
        break;

      case 'estado':
        const datosEstado = [
          ['Bautizados', mockReportes.general.bautizados.toString(), '56.7%'],
          ['Sellados', mockReportes.general.sellados.toString(), '30.0%'],
          ['Servidores', mockReportes.general.servidores.toString(), '40.0%'],
          ['Simpatizantes', mockReportes.general.simpatizantes.toString(), '10.0%'],
          ['No Clasificados', '5', '3.3%']
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Estado Espiritual', 'Cantidad', 'Porcentaje']],
          body: datosEstado,
          theme: 'grid',
          headStyles: { fillColor: colores.azulMedio, textColor: colores.blanco },
          styles: { fontSize: 10 }
        });
        break;

      case 'cumpleanos':
        const datosMesCumpleanos = getCumpleanosPorMes(mesCumpleanos);
        doc.setFontSize(14);
        doc.setTextColor(colores.primario);
        doc.text(`CUMPLEAÑOS DE ${datosMesCumpleanos.mes.toUpperCase()}`, 15, yPosition);
        yPosition += 10;

        if (datosMesCumpleanos.cumpleanos.length > 0) {
          const datosCumpleanosDetalle = datosMesCumpleanos.cumpleanos.map(cumple => [
            cumple.nombre,
            cumple.fecha,
            cumple.edad.toString() + ' años',
            cumple.celular
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [['Nombre Completo', 'Fecha de Nacimiento', 'Edad', 'Celular']],
            body: datosCumpleanosDetalle,
            theme: 'grid',
            headStyles: { fillColor: colores.secundario, textColor: colores.texto },
            styles: { fontSize: 10 }
          });
        } else {
          doc.setFontSize(12);
          doc.setTextColor(colores.texto);
          doc.text('No hay cumpleaños registrados para este mes.', 15, yPosition + 10);
        }
        break;

      case 'grupos':
        const datosGrupos = [
          ['Grupo Alfa', '12', 'Líder: Juan Pérez'],
          ['Grupo Beta', '15', 'Líder: María García'],
          ['Grupo Gamma', '10', 'Líder: Carlos López'],
          ['Grupo Delta', '8', 'Líder: Ana Rodríguez']
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Grupo', 'Miembros', 'Líder']],
          body: datosGrupos,
          theme: 'grid',
          headStyles: { fillColor: colores.primario, textColor: colores.blanco },
          styles: { fontSize: 10 }
        });
        break;

      case 'crecimiento':
        const datosCrecimiento = mockReportes.general.crecimientoMensual.map(item => [
          item.mes,
          item.total.toString(),
          'jóvenes registrados'
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Mes', 'Total Jóvenes', 'Observaciones']],
          body: datosCrecimiento,
          theme: 'grid',
          headStyles: { fillColor: colores.azulClaro, textColor: colores.texto },
          styles: { fontSize: 10 }
        });
        break;

      default:
        doc.text('Tipo de reporte no válido', 15, yPosition);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(colores.primario);
    doc.rect(0, pageHeight - 20, 210, 20, 'F');
    doc.setTextColor(colores.blanco);
    doc.setFontSize(8);
    doc.text('Sistema de Gestión de Jóvenes - Conquistadores Pentecostales - IPUC Unánimes', 105, pageHeight - 10, { align: 'center' });

    // Descargar
    doc.save(`reporte_${tipoReporte}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const renderPreview = () => {
    if (tipoReporte === 'cumpleanos') {
      const datosMes = getCumpleanosPorMes(mesCumpleanos);
      const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      return (
        <div className="space-y-6 md:space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h4 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-widest">
              Cumpleaños de {nombresMeses[mesCumpleanos - 1]}
            </h4>
            <p className="text-sm text-slate-600 font-medium">
              {datosMes.total} jóvenes cumplen años este mes
            </p>
          </div>

          {/* Lista de cumpleaños */}
          <div className="space-y-3">
            {datosMes.cumpleanos.map((cumple, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
                    <Calendar size={18} className="text-[#F5A623]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{cumple.nombre}</p>
                    <p className="text-xs text-slate-500">Cumple el {cumple.fecha}</p>
                  </div>
                </div>
                <Badge className="bg-[#00338D]/10 text-[#00338D] border-none font-bold">
                  {cumple.edad} años
                </Badge>
              </motion.div>
            ))}
          </div>

          {datosMes.cumpleanos.length === 0 && (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No hay cumpleaños registrados para este mes</p>
            </div>
          )}
        </div>
      );
    }

    if (tipoReporte !== 'general') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-16 text-center flex flex-col items-center"
        >
          <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
            <Eye size={48} />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Previsualización disponible</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Estamos preparando la vista previa interactiva para este tipo de reporte.</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatMiniCard label="Total" value={mockReportes.general.totalJovenes} color="blue" icon={Users} />
          <StatMiniCard label="Bautizados" value={mockReportes.general.bautizados} color="emerald" icon={ShieldCheck} />
          <StatMiniCard label="Sellados" value={mockReportes.general.sellados} color="violet" icon={Target} />
          <StatMiniCard label="Servidores" value={mockReportes.general.servidores} color="amber" icon={Zap} />
        </div>

        <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Tendencia de Crecimiento
            </h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Datos proyectados v3.0</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockReportes.general.crecimientoMensual}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700 }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-12"
    >
      {/* Header Section */}
      <div className="relative group">
        <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-[2.5rem] -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tight">Reportes Avanzados</h1>
            <p className="text-slate-400 font-medium mt-1">Genera inteligencia de datos para tu sociedad.</p>
          </div>
          <Zap size={80} className="absolute right-10 top-1/2 -translate-y-1/2 text-white/5 -rotate-12 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 border-slate-200/60 shadow-xl bg-white/80 backdrop-blur-xl rounded-[2.5rem]">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              Parámetros
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Categoría del Reporte
                </label>
                <div className="space-y-2">
                  {tiposReporte.map((tipo) => {
                    const Icon = tipo.icon;
                    const isSelected = tipoReporte === tipo.value;
                    return (
                      <button
                        key={tipo.value}
                        onClick={() => setTipoReporte(tipo.value)}
                        className={cn(
                          "w-full flex items-center text-left p-3.5 rounded-2xl transition-all border",
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25"
                            : "bg-slate-50 border-slate-100/50 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                          isSelected ? "bg-white/20 text-white" : "bg-white text-blue-600 shadow-sm"
                        )}>
                          <Icon size={20} />
                        </div>
                        <div className="ml-3 overflow-hidden">
                          <p className="font-bold text-sm leading-tight truncate">{tipo.label}</p>
                          <p className={cn("text-[10px] mt-0.5 truncate", isSelected ? "text-blue-100" : "text-slate-400")}>
                            {tipo.desc}
                          </p>
                        </div>
                        {isSelected && <ChevronRight size={16} className="ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                    Formato de Salida SOLO PDF
                  </label>
                  <div className="h-12 bg-white border-slate-200 rounded-xl font-bold flex items-center px-4">
                    Adobe PDF (.pdf)
                  </div>
                </div>

                {/* Month Filter for Cumpleanos */}
                {tipoReporte === 'cumpleanos' && (
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                      Mes de Cumpleaños
                    </label>
                    <Select value={mesCumpleanos.toString()} onValueChange={(value) => setMesCumpleanos(parseInt(value))}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="1" className="font-bold">Enero</SelectItem>
                        <SelectItem value="2" className="font-bold">Febrero</SelectItem>
                        <SelectItem value="3" className="font-bold">Marzo</SelectItem>
                        <SelectItem value="4" className="font-bold">Abril</SelectItem>
                        <SelectItem value="5" className="font-bold">Mayo</SelectItem>
                        <SelectItem value="6" className="font-bold">Junio</SelectItem>
                        <SelectItem value="7" className="font-bold">Julio</SelectItem>
                        <SelectItem value="8" className="font-bold">Agosto</SelectItem>
                        <SelectItem value="9" className="font-bold">Septiembre</SelectItem>
                        <SelectItem value="10" className="font-bold">Octubre</SelectItem>
                        <SelectItem value="11" className="font-bold">Noviembre</SelectItem>
                        <SelectItem value="12" className="font-bold">Diciembre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                    Rango Cronológico
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="h-12 bg-white border-slate-200 rounded-xl font-bold text-xs"
                    />
                    <Input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="h-12 bg-white border-slate-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerarReporte}
                disabled={isGenerating}
                className="w-full h-14 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl font-black text-base shadow-xl transition-all group active:scale-[0.98]"
              >
                {isGenerating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Zap size={20} />
                  </motion.div>
                ) : (
                  <>
                    <Download size={20} className="mr-2 group-hover:-translate-y-1 transition-transform" />
                    Generar Documento
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50/50 border-blue-100 shadow-sm rounded-3xl">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Info size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Información de Exportación</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">Los reportes se generan usando el motor v3 con soporte para múltiples hojas y gráficas de alta resolución en PDF.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-8">
          <Card className="p-8 border-slate-200/60 shadow-2xl shadow-slate-200/40 bg-white/90 backdrop-blur-xl rounded-[2.5rem] min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Previsualización en tiempo real</h2>
                <p className="text-sm font-medium text-slate-500">Muestra instantánea de los datos que se incluirán.</p>
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Live Sync</span>
              </div>
            </div>

            <div className="flex-1">
              {renderPreview()}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function StatMiniCard({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: React.ComponentType<{ size?: number; className?: string }> }) {
  const families: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:shadow-md transition-all">
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110", families[color])}>
        <Icon size={16} />
      </div>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{label}</p>
    </div>
  );
}