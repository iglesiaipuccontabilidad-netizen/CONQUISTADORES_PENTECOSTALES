'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useJovenes } from '@/hooks/useJovenes';
import { Users, TrendingUp, Sparkles, UserPlus, ArrowRight, Activity, Calendar, Award, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
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
import { useMemo } from 'react';
import { validatorsColombia } from '@/utils/validators';

export default function DashboardPage() {
  const { jovenes, isLoading } = useJovenes();

  // Calcular estadísticas
  const stats = {
    totalJovenes: jovenes?.length || 0,
    bautizados: jovenes?.filter((j) => j.bautizado).length || 0,
    sellados: jovenes?.filter((j) => j.sellado).length || 0,
    servidores: jovenes?.filter((j) => j.servidor).length || 0,
    simpatizantes: jovenes?.filter((j) => j.simpatizante).length || 0,
  };

  // Datos para gráficos
  const chartData = useMemo(() => {
    if (!jovenes || jovenes.length === 0) return null;

    // Distribución por edad
    const ageGroups = [
      { range: '12-15', min: 12, max: 15, count: 0 },
      { range: '16-18', min: 16, max: 18, count: 0 },
      { range: '19-25', min: 19, max: 25, count: 0 },
      { range: '26-30', min: 26, max: 30, count: 0 },
      { range: '31-35', min: 31, max: 35, count: 0 },
    ];

    jovenes.forEach((joven) => {
      let edad = joven.edad;

      // Si no hay edad, calcularla desde fecha_nacimiento
      if (!edad && joven.fecha_nacimiento) {
        edad = validatorsColombia.calculateAge(joven.fecha_nacimiento);
      }

      if (edad) {
        ageGroups.forEach((group) => {
          if (edad >= group.min && edad <= group.max) {
            group.count++;
          }
        });
      }
    });

    const ageData = ageGroups.map(({ range, count }) => ({
      range,
      count,
    }));

    // Estado espiritual - Using Brand Palette
    const estadoData = [
      { name: 'Bautizados', value: stats.bautizados, fill: '#00338D' },
      { name: 'Sellados', value: stats.sellados, fill: '#F5A623' },
      { name: 'Servidores', value: stats.servidores, fill: '#0066B3' },
      { name: 'Simpatizantes', value: stats.simpatizantes, fill: '#009FDA' },
    ];

    // Crecimiento mensual (últimos 12 meses) - usando datos mock por ahora
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const growthData = monthNames.map((mes, index) => ({
      mes,
      registros: Math.floor(Math.random() * 8) + 2, // Mock data but realistic for a local church
    }));

    return { ageData, estadoData, growthData };
  }, [jovenes, stats]);

  /* Animation Variants */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-10 pb-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-6" variants={item}>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
            DASH<span className="text-[#00338D]">BOARD</span>
            <Activity className="ml-3 w-6 h-6 text-[#F5A623]" />
          </h1>
          <p className="text-slate-500 font-medium font-prose uppercase tracking-widest text-xs opacity-70">
            Resumen General Ministerial - Unánimes
          </p>
        </div>
        <Link href="/dashboard/jovenes/nuevo">
          <Button className="h-12 px-6 rounded-2xl bg-[#00338D] hover:bg-[#00338D]/90 text-white font-bold shadow-lg shadow-[#00338D]/20 transition-all">
            <UserPlus size={18} className="mr-2" />
            NUEVO REGISTRO
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={item}
      >
        <StatCard
          label="Total Jóvenes"
          value={stats.totalJovenes}
          icon={Users}
          color="#00338D"
          description="Total miembros registrados"
        />
        <StatCard
          label="Bautizados"
          value={stats.bautizados}
          icon={Award}
          color="#0066B3"
          description="En nombre de Jesús"
        />
        <StatCard
          label="Sellados"
          value={stats.sellados}
          icon={Sparkles}
          color="#F5A623"
          description="Con el Espíritu Santo"
        />
        <StatCard
          label="Servidores"
          value={stats.servidores}
          icon={TrendingUp}
          color="#1A1A1A"
          description="En diversas áreas"
        />
      </motion.div>

      {/* Main Charts Area */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Chart */}
          <motion.div className="lg:col-span-2" variants={item}>
            <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Crecimiento Ministerial</h3>
                  <p className="text-xs text-slate-400 font-medium">Registros mensuales 2025</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 text-slate-400">
                  <Calendar size={20} />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.growthData}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00338D" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#00338D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="mes"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="registros"
                    stroke="#00338D"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorGrowth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Spiritual Status Pie */}
          <motion.div variants={item}>
            <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white h-full">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-8">Estado Espiritual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.estadoData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.estadoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {chartData.estadoData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Bottom Grid: Age & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={item}>
          <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-8">Perfiles por Edad</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData?.ageData}>
                <XAxis
                  dataKey="range"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar
                  dataKey="count"
                  fill="#0066B3"
                  radius={[10, 10, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 gap-6">
          <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-[#1A1A1A] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold">Gestión de Directorio</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Administre los perfiles de los jóvenes, gestione sus estados ministeriales y mantenga la base de datos actualizada.
              </p>
              <Link href="/dashboard/jovenes" className="inline-flex">
                <Button className="rounded-xl bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#1A1A1A] font-bold group">
                  EXPLORAR JÓVENES
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <QuickActionCard
              href="/dashboard/reportes"
              label="Reportes"
              icon={FileText}
              color="#00338D"
            />
            <QuickActionCard
              href="/dashboard/configuracion"
              label="Configuración"
              icon={Settings}
              color="#64748b"
            />
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <motion.div variants={item}>
        <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/30 rounded-[2rem] bg-white/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight flex items-center">
            <Sparkles className="mr-2 text-[#F5A623]" size={20} />
            Estado del Sistema
          </h2>
          <p className="text-slate-600 font-medium">
            {isLoading
              ? 'Sincronizando datos con el servidor...'
              : `Se han sincronizado correctamente ${stats.totalJovenes} registros ministeriales en el sistema actual.`}
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, color, description }: any) {
  return (
    <Card className="p-6 border-slate-100 shadow-xl shadow-slate-200/30 rounded-[2rem] bg-white group hover:border-[#00338D]/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl transition-colors" style={{ backgroundColor: `${color}10`, color: color }}>
          <Icon size={24} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        <p className="text-sm font-bold text-slate-700 mt-1 uppercase tracking-wide text-[10px]">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase leading-tight">{description}</p>
      </div>
    </Card>
  );
}

function QuickActionCard({ href, label, icon: Icon, color }: any) {
  return (
    <Link href={href}>
      <Card className="p-6 border-slate-100 shadow-lg shadow-slate-200/20 rounded-[1.5rem] bg-white hover:bg-slate-50 transition-all flex items-center gap-4 group">
        <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-[#00338D] group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        <span className="font-bold text-slate-700">{label}</span>
      </Card>
    </Link>
  );
}
