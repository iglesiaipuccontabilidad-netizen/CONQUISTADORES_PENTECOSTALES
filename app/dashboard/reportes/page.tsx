'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Activity,
  FileSpreadsheet,
  FilePieChart,
  Printer,
  Info,
  ChevronDown,
  ChevronUp
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
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
  const [showConfig, setShowConfig] = useState(true);
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
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para obtener cumpleaños por mes
  const getCumpleanosPorMes = (mes: number) => {
    // Esta función debería obtener los jóvenes que cumplen años en el mes especificado
    // Por ahora retornamos datos mock, pero debería usar datos reales del hook
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
          ['Jóvenes Servidores', mockReportes.general.servidores.toString(), '40.0%'],
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
    if (tipoReporte === 'general') {
      const stats = [
        { label: 'Total Jóvenes', value: 150, color: '#00338D', icon: Users },
        { label: 'Bautizados', value: 45, color: '#0066B3', icon: Sparkles },
        { label: 'Sellados', value: 32, color: '#F5A623', icon: Activity },
        { label: 'Servidores', value: 28, color: '#009FDA', icon: TrendingUp },
      ];
      return (
        <div className="space-y-6 md:space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden"
                >
                  {/* Glassmorphism card */}
                  <div className="relative p-4 md:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                    {/* Decorative gradient */}
                    <div
                      className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10 transition-opacity group-hover:opacity-20"
                      style={{ backgroundColor: s.color }}
                    />

                    {/* Icon */}
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="p-2 rounded-xl transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${s.color}15` }}
                      >
                        <Icon size={16} style={{ color: s.color }} />
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {s.label}
                    </p>
                    <p
                      className="text-2xl md:text-3xl font-black transition-all"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 shadow-lg p-4 md:p-6"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#00338D]/5 rounded-br-full -ml-10 -mt-10" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#F5A623]/5 rounded-tl-full -mr-8 -mb-8" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h4 className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#00338D]" />
                  Tendencia de Membresía
                </h4>
                <Badge className="bg-[#00338D]/10 text-[#00338D] border-none font-bold text-[9px] px-3 py-1 rounded-full">
                  Últimos 4 meses
                </Badge>
              </div>

              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={200} minWidth={300}>
                  <AreaChart data={mockReportes.general.crecimientoMensual}>
                    <defs>
                      <linearGradient id="prevColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00338D" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00338D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="mes"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontWeight: 'bold'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#00338D"
                      strokeWidth={3}
                      fill="url(#prevColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

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

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 md:p-20 text-center space-y-4 rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-50 to-white border-2 border-dashed border-slate-200/80"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-slate-200/50 blur-2xl rounded-full" />
          <FilePieChart size={48} className="relative mx-auto text-slate-300" />
        </div>
        <p className="text-sm md:text-base text-slate-600 font-bold">Vista previa no disponible</p>
        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
          Configure y genere el reporte para visualizar los datos finales.
        </p>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-8 pb-8 md:pb-12 px-4 md:px-0"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 md:gap-4"
      >
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>MÓDULO DE</span>
            <span className="text-[#00338D]">REPORTES</span>
            <FileSpreadsheet className="w-5 h-5 md:w-6 md:h-6 text-[#F5A623]" />
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] md:text-xs opacity-70">
            Inteligencia de Datos - Unánimes 2025
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 md:space-y-6 order-2 lg:order-1"
        >
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="lg:hidden w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#00338D] to-[#0066B3] text-white font-bold shadow-lg"
          >
            <span className="flex items-center gap-2">
              <FileText size={18} />
              Configuración del Reporte
            </span>
            {showConfig ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Configuration Card */}
          <AnimatePresence>
            {(showConfig || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-5 md:p-8 border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-white via-white to-slate-50/30 ring-1 ring-slate-100/50 backdrop-blur-sm">
                  <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight mb-6 md:mb-8 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#00338D] to-[#0066B3] rounded-full" />
                    Personalizar Informe
                  </h2>

                  <div className="space-y-5 md:space-y-6">
                    {/* Report Type */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <FileText size={12} />
                        Categoría del Reporte
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {tiposReporte.map((tipo, idx) => {
                          const Icon = tipo.icon;
                          const isActive = tipoReporte === tipo.value;
                          return (
                            <motion.button
                              key={tipo.value}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => setTipoReporte(tipo.value)}
                              className={`group relative flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all text-left border overflow-hidden ${isActive
                                ? 'bg-gradient-to-r from-[#00338D] to-[#0066B3] border-[#00338D] text-white shadow-lg shadow-[#00338D]/30'
                                : 'bg-white border-slate-200/60 text-slate-600 hover:border-[#00338D]/30 hover:shadow-md'
                                }`}
                            >
                              {/* Decorative gradient */}
                              {!isActive && (
                                <div
                                  className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity"
                                  style={{ backgroundColor: tipo.color }}
                                />
                              )}

                              <div className={`relative p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all ${isActive
                                ? 'bg-white/20 backdrop-blur-sm'
                                : 'bg-slate-50 shadow-sm group-hover:shadow'
                                }`}>
                                <Icon size={16} className={isActive ? 'text-white' : 'text-[#00338D]'} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs md:text-sm font-bold block truncate">{tipo.label}</span>
                                <span className={`text-[8px] md:text-[9px] font-medium uppercase block truncate ${isActive ? 'text-white/70' : 'text-slate-400'
                                  }`}>
                                  {tipo.desc}
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Format Select */}
                    {/* Format Selection - Always PDF */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Download size={12} />
                        Formato de Salida
                      </label>
                      <div className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-200/60 bg-white font-bold shadow-sm flex items-center px-4">
                        <span className="flex items-center gap-2">
                          <FileText size={14} className="text-[#00338D]" />
                          DOCUMENTO PDF (.PDF)
                        </span>
                      </div>
                    </div>

                    {/* Month Filter for Cumpleanos */}
                    {tipoReporte === 'cumpleanos' && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Calendar size={12} />
                          Mes de Cumpleaños
                        </label>
                        <Select value={mesCumpleanos.toString()} onValueChange={(value: string) => setMesCumpleanos(parseInt(value))}>
                          <SelectTrigger className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-200/60 bg-white hover:bg-slate-50 font-bold shadow-sm transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl md:rounded-2xl border-slate-200/60 shadow-xl backdrop-blur-sm">
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

                    {/* Date Filters */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                          <Calendar size={10} />
                          Desde
                        </label>
                        <Input
                          type="date"
                          className="h-11 md:h-12 rounded-xl border-slate-200/60 bg-white hover:bg-slate-50 font-medium shadow-sm transition-all text-xs md:text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                          <Calendar size={10} />
                          Hasta
                        </label>
                        <Input
                          type="date"
                          className="h-11 md:h-12 rounded-xl border-slate-200/60 bg-white hover:bg-slate-50 font-medium shadow-sm transition-all text-xs md:text-sm"
                        />
                      </div>
                    </div>

                    {/* Generate Button */}
                    <div className="pt-2 md:pt-4">
                      <Button
                        onClick={handleGenerarReporte}
                        disabled={isGenerating}
                        className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-r from-[#00338D] to-[#0066B3] hover:from-[#00338D]/90 hover:to-[#0066B3]/90 text-white font-bold shadow-xl shadow-[#00338D]/30 transition-all uppercase tracking-widest text-[10px] md:text-xs disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            PREPARANDO ARCHIVO...
                          </motion.span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Printer size={16} /> GENERAR DOCUMENTO
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 md:p-6 border-blue-200/60 shadow-lg shadow-blue-200/20 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50/80 to-white border-2 border-dashed flex items-start gap-3 md:gap-4 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-white text-[#00338D] shadow-sm flex-shrink-0">
                <Info size={16} />
              </div>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase leading-relaxed tracking-wide pt-1">
                Los reportes generados contienen información sensible. El uso de estos datos es exclusivo para fines ministeriales internos.
              </p>
            </Card>
          </motion.div>
        </motion.div>

        {/* Live Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 order-1 lg:order-2"
        >
          <Card className="p-5 md:p-10 border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-white via-white to-slate-50/30 h-full relative overflow-hidden backdrop-blur-sm">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-[#F5A623]/10 to-[#F5A623]/5 rounded-bl-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tr from-[#00338D]/5 to-transparent rounded-tr-full -ml-8 -mb-8" />

            <div className="relative z-10">
              {/* Preview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10">
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#00338D] to-[#0066B3] rounded-full" />
                    VISTA PREVIA
                  </h3>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-3">
                    {tiposReporte.find(t => t.value === tipoReporte)?.label}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-[#00338D]/10 to-[#0066B3]/10 text-[#00338D] border-none font-black text-[9px] md:text-[10px] px-3 md:px-4 py-1.5 rounded-full ring-1 ring-[#00338D]/20 self-start sm:self-auto">
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#00338D] rounded-full animate-pulse" />
                    Sincronizado
                  </span>
                </Badge>
              </div>

              {/* Preview Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tipoReporte}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderPreview()}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}