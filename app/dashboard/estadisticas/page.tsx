'use client';

import { useMemo } from 'react';
import { useJovenes } from '@/hooks/useJovenes';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Flame,
  Award,
  Church,
  UserPlus,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
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
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { validatorsColombia } from '../../../utils/validators';
import { cn } from '@/lib/utils';

// Brand colors from paletacolores.md
const COLORS = {
  primary: '#00338D', // Azul Oscuro
  secondary: '#0066B3', // Azul Medio
  accent: '#F5A623', // Naranja/Amarillo
  cyan: '#009FDA', // Azul Claro
  success: '#22c55e',
  purple: '#a855f7',
  error: '#ef4444',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function EstadisticasPage() {
  const { jovenes, isLoading } = useJovenes();

  const chartData = useMemo(() => {
    if (!jovenes || jovenes.length === 0) return null;

    // Estados
    const estadosData = [
      {
        name: 'Bautizados',
        value: jovenes.filter((j) => j.bautizado).length,
        fill: COLORS.success,
        icon: ShieldCheck,
      },
      {
        name: 'Sellados',
        value: jovenes.filter((j) => j.sellado).length,
        fill: COLORS.purple,
        icon: Flame,
      },
      {
        name: 'Servidores',
        value: jovenes.filter((j) => j.servidor).length,
        fill: COLORS.accent,
        icon: Award,
      },
      {
        name: 'Simpatizantes',
        value: jovenes.filter((j) => j.simpatizante).length,
        fill: COLORS.error,
        icon: Church,
      },
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
      count,
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

    // Estadísticas adicionales
    const edadesValidas = jovenes?.filter(j => {
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
      return edad || 0;
    }) || [];

    const promedioEdad = edadesValidas.length > 0
      ? Math.round(edadesValidas.reduce((sum, edad) => sum + edad, 0) / edadesValidas.length)
      : 0;

    const stats = {
      totalJovenes: jovenes?.length || 0,
      promedioEdad,
      gruposActivos: 3, // Mock - debería calcularse de la BD
      registrosEsteMes: monthData[currentMonth]?.registros || 0,
    };

    return { estadosData, edadData, monthData, stats };
  }, [jovenes]);

  if (isLoading || !chartData) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(2).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-xl">
          <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-medium" style={{ color: entry.color || entry.fill }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-1"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight"
          >
            Panel de <span className="text-gradient">Estadísticas</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-blue-500" />
            Análisis detallado del crecimiento y estado espiritual de la juventud
          </motion.p>
        </div>
      </header>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Jóvenes', value: chartData.stats.totalJovenes, icon: Users, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-600' },
          { label: 'Edad Promedio', value: chartData.stats.promedioEdad, icon: Calendar, color: 'from-green-500 to-emerald-600', textColor: 'text-green-600' },
          { label: 'Grupos Activos', value: chartData.stats.gruposActivos, icon: Award, color: 'from-purple-500 to-violet-600', textColor: 'text-purple-600' },
          { label: 'Nuevos este Mes', value: chartData.stats.registrosEsteMes, icon: UserPlus, color: 'from-orange-500 to-amber-600', textColor: 'text-orange-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <Card className="glass-card p-6 overflow-hidden relative group">
              <div className={cn(
                "absolute -right-4 -bottom-4 w-24 h-24 opacity-10 transition-transform group-hover:scale-125",
                stat.textColor
              )}>
                <stat.icon className="w-full h-full" />
              </div>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl bg-gradient-to-br shadow-lg",
                  stat.color
                )}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Spiritual Status Grid */}
      <section className="space-y-4">
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-bold flex items-center gap-2"
        >
          <Flame className="w-6 h-6 text-orange-500" />
          Estado Espiritual
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {chartData.estadosData.map((stat) => (
            <motion.div
              key={stat.name}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-card p-5 border-l-4" style={{ borderLeftColor: stat.fill }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className="p-3 rounded-xl shadow-inner"
                    style={{ backgroundColor: `${stat.fill}15` }}
                  >
                    <stat.icon className="w-7 h-7" style={{ color: stat.fill }} />
                  </div>
                </div>
                <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.value / chartData.stats.totalJovenes) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.fill }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Estados - Pie Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card p-6 h-[450px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-indigo-500" />
              <h3 className="text-xl font-bold">Distribución Espiritual</h3>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.estadosData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.estadosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    content={({ payload }) => (
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {payload?.map((entry: any, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Edades - Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card p-6 h-[450px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-bold">Distribución de Edades</h3>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.edadData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.secondary} stopOpacity={1} />
                      <stop offset="100%" stopColor={COLORS.primary} stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis
                    dataKey="range"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.4 }} />
                  <Bar
                    dataKey="count"
                    name="Jóvenes"
                    fill="url(#barGradient)"
                    radius={[10, 10, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Registros por Mes - Area Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card p-6 h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl font-bold">Crecimiento Mensual</h3>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.monthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRegistros" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis
                    dataKey="mes"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="registros"
                    name="Registros"
                    stroke={COLORS.cyan}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRegistros)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
