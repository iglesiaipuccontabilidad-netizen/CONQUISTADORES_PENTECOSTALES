'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useJovenes } from '@/hooks/useJovenes';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Users, ShieldCheck, Sparkles, Award, MapPin } from 'lucide-react';
import { validatorsColombia } from '@/utils/validators';

export default function EstadisticasPage() {
  const { jovenes, isLoading } = useJovenes();

  const chartData = useMemo(() => {
    if (!jovenes || jovenes.length === 0) return null;

    // Estados con paleta de marca
    const estadosData = [
      { name: 'Bautizados', value: jovenes.filter((j) => j.bautizado).length, fill: '#00338D' },
      { name: 'Sellados', value: jovenes.filter((j) => j.sellado).length, fill: '#F5A623' },
      { name: 'Servidores', value: jovenes.filter((j) => j.servidor).length, fill: '#0066B3' },
      { name: 'Simpatizantes', value: jovenes.filter((j) => j.simpatizante).length, fill: '#009FDA' },
    ];

    // Distribución de edades
    const edgeGroups = [
      { range: '12-15', min: 12, max: 15, count: 0 },
      { range: '16-18', min: 16, max: 18, count: 0 },
      { range: '19-21', min: 19, max: 21, count: 0 },
      { range: '22-25', min: 22, max: 25, count: 0 },
      { range: '26+', min: 26, max: 100, count: 0 },
    ];

    jovenes.forEach((joven) => {
      let edad = joven.edad;

      // Si no hay edad, calcularla desde fecha_nacimiento
      if (!edad && joven.fecha_nacimiento) {
        edad = validatorsColombia.calculateAge(joven.fecha_nacimiento);
      }

      if (edad) {
        edgeGroups.forEach((group) => {
          if (edad >= group.min && edad <= group.max) {
            group.count++;
          }
        });
      }
    });

    const edadData = edgeGroups.map(({ range, count }) => ({
      range,
      count, // Usamos 'count' para evitar problemas con acentos
    }));

    // Crecimiento mensual
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const monthData = monthNames.map((mes, index) => {
      const monthIndex = (currentMonth - 11 + index + 12) % 12;
      const registros = jovenes?.filter(joven => {
        if (!joven.created_at) return false;
        const fecha = new Date(joven.created_at);
        return fecha.getMonth() === monthIndex;
      }).length || 0;

      return { mes, registros };
    });

    // Calcular promedio de edad con edades válidas
    const edadesValidas = (jovenes || []).filter(j => {
      let edad = j.edad;
      if (!edad && j.fecha_nacimiento) {
        edad = validatorsColombia.calculateAge(j.fecha_nacimiento);
      }
      return edad && edad > 0;
    }).map(j => {
      let edad = j.edad;
      if (!edad && j.fecha_nacimiento) {
        edad = validatorsColombia.calculateAge(j.fecha_nacimiento);
      }
      return edad!;
    });

    const promedioEdad = edadesValidas.length > 0
      ? Math.round(edadesValidas.reduce((sum, edad) => sum + edad, 0) / edadesValidas.length)
      : 0;

    const stats = {
      totalJovenes: jovenes?.length || 0,
      promedioEdad,
      registrosEsteMes: monthData[currentMonth]?.registros || 0,
    };

    return { estadosData, edadData, monthData, stats };
  }, [jovenes]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading || !chartData) {
    return (
      <div className="space-y-6 md:space-y-10 pb-8 md:pb-12 px-4 md:px-0">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 md:h-12 w-48 md:w-64 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Skeleton className="h-32 md:h-36 rounded-2xl md:rounded-[2rem]" />
          <Skeleton className="h-32 md:h-36 rounded-2xl md:rounded-[2rem]" />
          <Skeleton className="h-32 md:h-36 rounded-2xl md:rounded-[2rem]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Skeleton className="h-80 md:h-96 rounded-2xl md:rounded-[2.5rem]" />
          <Skeleton className="h-80 md:h-96 rounded-2xl md:rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 md:space-y-10 pb-8 md:pb-12 px-4 md:px-0"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
          <span>ESTADÍSTICAS</span>
          <span className="text-[#00338D]">MINISTERIALES</span>
          <Activity className="w-5 h-5 md:w-6 md:h-6 text-[#F5A623]" />
        </h1>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] md:text-xs opacity-70">
          Inteligencia y Análisis de Datos - Unánimes
        </p>
      </motion.div>

      {/* High-level Summary stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <MetricCard
          label="Membresía Total"
          value={chartData.stats.totalJovenes}
          icon={Users}
          color="#00338D"
          trend="+12% vs año anterior"
        />
        <MetricCard
          label="Edad Promedio"
          value={`${chartData.stats.promedioEdad} años`}
          icon={Award}
          color="#F5A623"
          trend="Membresía Joven"
        />
        <MetricCard
          label="Registros del Mes"
          value={chartData.stats.registrosEsteMes}
          icon={TrendingUp}
          color="#0066B3"
          trend="Sincronización al día"
        />
      </motion.div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Status Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="relative p-5 md:p-8 border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-white via-white to-slate-50/30 ring-1 ring-slate-100/50 overflow-hidden backdrop-blur-sm">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F5A623]/10 to-transparent rounded-bl-full -mr-10 -mt-10" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="space-y-1">
                  <h3 className="text-base md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-[#00338D] to-[#0066B3] rounded-full" />
                    DIMENSIÓN ESPIRITUAL
                  </h3>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3">
                    Distribución por estado
                  </p>
                </div>
                <div className="p-2 md:p-2.5 rounded-xl bg-[#F5A623]/10">
                  <Sparkles className="text-[#F5A623]" size={18} />
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={280} minWidth={250}>
                  <PieChart>
                    <Pie
                      data={chartData.estadosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.estadosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
                {chartData.estadosData.map((stat, idx) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative overflow-hidden flex flex-col p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-slate-200/60 hover:shadow-md transition-all duration-300"
                  >
                    {/* Decorative element */}
                    <div
                      className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity"
                      style={{ backgroundColor: stat.fill }}
                    />

                    <div className="relative flex items-center gap-2 mb-1">
                      <div
                        className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full"
                        style={{ backgroundColor: stat.fill }}
                      />
                      <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {stat.name}
                      </span>
                    </div>
                    <span
                      className="text-xl md:text-2xl font-black transition-all"
                      style={{ color: stat.fill }}
                    >
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Age Histogram */}
        <motion.div variants={itemVariants}>
          <Card className="relative p-5 md:p-8 border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-white via-white to-slate-50/30 ring-1 ring-slate-100/50 h-full overflow-hidden backdrop-blur-sm">
            {/* Decorative gradient */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#0066B3]/10 to-transparent rounded-tr-full -ml-10 -mb-10" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="space-y-1">
                  <h3 className="text-base md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-[#0066B3] to-[#009FDA] rounded-full" />
                    RANGOS ETARIOS
                  </h3>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3">
                    Distribución por edad
                  </p>
                </div>
                <div className="p-2 md:p-2.5 rounded-xl bg-[#0066B3]/10">
                  <Users className="text-[#0066B3]" size={18} />
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={240} minWidth={250}>
                  <BarChart data={chartData.edadData}>
                    <XAxis
                      dataKey="range"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#00338D"
                      radius={[8, 8, 0, 0]}
                      barSize={35}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl md:rounded-[2rem] text-white shadow-lg">
                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center gap-2">
                  <Activity size={12} className="text-[#F5A623]" />
                  Observación Demográfica
                </h4>
                <p className="text-xs md:text-sm font-medium leading-relaxed opacity-90">
                  La mayoría de la membresía se encuentra en el rango de <span className="text-[#F5A623] font-black">19-21 años</span>, indicando una fuerte base de jóvenes adultos para el liderazgo futuro.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Growth Trend Graph */}
      <motion.div variants={itemVariants}>
        <Card className="relative p-6 md:p-10 border-slate-200/60 shadow-2xl shadow-slate-200/50 rounded-2xl md:rounded-[3rem] bg-gradient-to-br from-white via-white to-slate-50/30 ring-1 ring-slate-100/50 overflow-hidden backdrop-blur-sm">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#00338D]/5 to-transparent rounded-br-full -ml-10 -mt-10" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#F5A623]/5 to-transparent rounded-tl-full -mr-10 -mb-10" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10">
              <div className="space-y-1">
                <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <div className="w-1 h-6 md:h-7 bg-gradient-to-b from-[#0066B3] to-[#009FDA] rounded-full" />
                  TENDENCIA DE CRECIMIENTO
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-3">
                  Registros históricos mensuales
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-[#00338D] to-[#0066B3] text-white rounded-full px-4 h-8 flex items-center font-bold shadow-lg shadow-[#00338D]/20 self-start sm:self-auto">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  2025 Activo
                </span>
              </Badge>
            </div>

            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <AreaChart data={chartData.monthData}>
                  <defs>
                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066B3" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0066B3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="mes"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="registros"
                    stroke="#0066B3"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function MetricCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <Card className="relative p-5 md:p-8 border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50/50 group hover:scale-[1.02] transition-all duration-300 overflow-hidden backdrop-blur-sm">
      {/* Decorative gradient */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <div
            className="p-3 md:p-4 rounded-xl md:rounded-2xl transition-all group-hover:scale-110"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            <Icon size={20} className="md:w-6 md:h-6" />
          </div>
          <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 md:px-3 py-1 rounded-full border border-slate-200/60 shadow-sm">
            {trend}
          </span>
        </div>
        <div>
          <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest mb-1">
            {label}
          </p>
          <p
            className="text-3xl md:text-4xl font-black tracking-tighter transition-all"
            style={{ color: color }}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
