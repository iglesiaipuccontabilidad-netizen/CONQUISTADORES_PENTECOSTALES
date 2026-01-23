'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useJovenes } from '@/hooks/useJovenes';
import { useAuth } from '@/hooks/useAuth';
import {
  Users,
  TrendingUp,
  UserPlus,
  Target,
  ShieldCheck,
  Heart,
  ChevronRight,
  Calendar as CalendarIcon,
  BarChart3,
  Search,
  ArrowUpRight,
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { validatorsColombia } from '@/utils/validators';

export default function DashboardPage() {
  const { jovenes, isLoading } = useJovenes();
  const { session } = useAuth();

  // Calcular estadísticas
  const stats = useMemo(() => ({
    total: jovenes?.length || 0,
    bautizados: jovenes?.filter((j) => j.bautizado).length || 0,
    sellados: jovenes?.filter((j) => j.sellado).length || 0,
    servidores: jovenes?.filter((j) => j.servidor).length || 0,
    simpatizantes: jovenes?.filter((j) => j.simpatizante).length || 0,
  }), [jovenes]);

  // Datos para gráficos
  const chartData = useMemo(() => {
    if (!jovenes || jovenes.length === 0) return null;

    // Distribución por edad
    const ageGroups = [
      { range: '12-15', min: 12, max: 15, count: 0 },
      { range: '16-18', min: 16, max: 18, count: 0 },
      { range: '19-25', min: 19, max: 25, count: 0 },
      { range: '26-30', min: 26, max: 30, count: 0 },
      { range: '31+', min: 31, max: 100, count: 0 },
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
      count, // Usamos 'count' en lugar de 'jóvenes' para evitar problemas con acentos
    }));

    // Estado espiritual
    const estadoData = [
      { name: 'Bautizados', value: stats.bautizados, color: '#3b82f6' },
      { name: 'Sellados', value: stats.sellados, color: '#8b5cf6' },
      { name: 'Servidores', value: stats.servidores, color: '#f59e0b' },
      { name: 'Simpatizantes', value: stats.simpatizantes, color: '#f43f5e' },
    ];

    // Crecimiento mensual mock
    const growthData = [
      { month: 'Ene', value: Math.max(0, stats.total - 15) },
      { month: 'Feb', value: Math.max(0, stats.total - 12) },
      { month: 'Mar', value: Math.max(0, stats.total - 8) },
      { month: 'Abr', value: Math.max(0, stats.total - 5) },
      { month: 'May', value: Math.max(0, stats.total - 2) },
      { month: 'Jun', value: stats.total },
    ];

    return { ageData, estadoData, growthData };
  }, [jovenes, stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Hero - Ultra Premium Compact */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] blur-xl opacity-10 group-hover:opacity-15 transition-opacity" />
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 md:p-8 text-white shadow-2xl border border-white/5">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                <Zap size={12} className="animate-pulse" />
                Panel de Administración v3.0
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                ¡Hola, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">{session?.user?.email?.split('@')[0] || 'Líder'}!</span> 👋
              </h1>
              <p className="mt-2 text-slate-400 text-base md:text-lg font-medium max-w-lg">
                Hoy tienes bajo tu liderazgo a <span className="text-white font-bold">{stats.total} jóvenes</span>. ¡Sigue inspirando vidas!
              </p>
              <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
                <Link href="/dashboard/jovenes/nuevo">
                  <Button className="h-11 bg-blue-600 hover:bg-blue-500 text-white border-none rounded-xl px-6 text-sm font-bold shadow-lg shadow-blue-600/25 transition-all hover:scale-105 active:scale-95">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nuevo Registro
                  </Button>
                </Link>
                <Link href="/dashboard/reportes">
                  <Button variant="outline" className="h-11 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white rounded-xl px-6 text-sm font-bold backdrop-blur-md transition-all">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Exportar Datos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-2xl">
                <div className="h-full w-full rounded-[1.9rem] bg-slate-950 flex items-center justify-center backdrop-blur-xl">
                  <Target className="h-14 w-14 text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg -rotate-12 border-2 border-slate-950">
                <ShieldCheck size={18} className="text-white" />
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-[80px] animate-pulse" />
          <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-indigo-600/10 blur-[80px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100 opacity-[0.03]" />
        </div>
      </motion.div>

      {/* Stats Cards - Refined */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Jóvenes"
          value={stats.total}
          icon={Users}
          color="blue"
          trend="+12%"
          label="Crecimiento mensual"
        />
        <StatCard
          title="Bautizados"
          value={stats.bautizados}
          icon={ShieldCheck}
          color="indigo"
          trend="+5%"
          label="Vidas transformadas"
        />
        <StatCard
          title="Miembros Activos"
          value={stats.sellados}
          icon={Target}
          color="violet"
          trend="+2%"
          label="Comprometidos"
        />
        <StatCard
          title="Simpatizantes"
          value={stats.simpatizantes}
          icon={Heart}
          color="rose"
          trend="+8%"
          label="Nuevas visitas"
        />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Analytics Section */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-8">
          <Card className="p-8 border-slate-200/60 shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <BarChart3 className="text-blue-600" />
                  Tendencias de Liderazgo
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Comparativa de registros en el último periodo</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button className="px-5 py-1.5 rounded-xl text-xs font-bold bg-white text-blue-600 shadow-sm transition-all">Mensual</button>
                <button className="px-5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:bg-white transition-all">Anual</button>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData?.growthData}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '20px',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorGrowth)"
                    animationDuration={2000}
                    dot={{ r: 6, fill: "#2563eb", strokeWidth: 3, stroke: "#fff" }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-slate-200/60 shadow-lg bg-white/70 backdrop-blur-xl rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Perfiles por Edad</h3>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <Users size={18} className="text-slate-400" />
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData?.ageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: 'rgba(248, 250, 252, 0.8)' }} contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 600 }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 8, 8]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-8 border-slate-200/60 shadow-lg bg-white/70 backdrop-blur-xl rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Estado Espiritual</h3>
                <div className="p-2 bg-slate-50 rounded-xl text-amber-500">
                  <Zap size={18} />
                </div>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData?.estadoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData?.estadoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 600 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {chartData?.estadoData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Sidebar Widgets */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Calendar Widget */}
          <Card className="p-8 border-slate-200/60 shadow-xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden relative group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Eventos</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Próximas fechas</p>
                </div>
              </div>

              <div className="space-y-4">
                <EventItem
                  title="Reunión General"
                  date="Sábado, Junio 15 • 6:00 PM"
                  type="meeting"
                  tag="Importante"
                />
                <EventItem
                  title="Vigilia de Oración"
                  date="Viernes, Junio 28 • 9:00 PM"
                  type="vigil"
                  tag="Especial"
                />
                <EventItem
                  title="Cumpleañeros"
                  date="Esta semana"
                  type="birthday"
                  tag="Social"
                  link="/dashboard/cumpleanos"
                />
              </div>

              <Link href="/dashboard/grupos">
                <Button className="w-full mt-8 h-12 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm tracking-wide transition-all group/btn shadow-lg">
                  Ver Todo el Calendario
                  <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          </Card>

          {/* Activity Widget */}
          <Card className="p-8 border-slate-200/60 shadow-lg bg-slate-950 text-white rounded-[2.5rem] overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Clock size={20} />
                </div>
                <h3 className="text-lg font-black tracking-tight">Estado del Sistema</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-sm font-bold text-emerald-400">Sincronizado correctamente</span>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">
                    <span>Última copia</span>
                    <span className="text-blue-400">Hace 12m</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
              <Link href="/dashboard/logs">
                <Button variant="ghost" className="w-full mt-4 text-slate-400 hover:text-white hover:bg-white/5 font-bold text-sm">
                  Ver historial completo
                  <ExternalLink size={14} className="ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend, label }: any) {
  const colorSchemes: any = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-600',
      text: 'text-blue-700',
      border: 'border-blue-100/50',
      shadow: 'shadow-blue-600/5'
    },
    indigo: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-600',
      text: 'text-indigo-700',
      border: 'border-indigo-100/50',
      shadow: 'shadow-indigo-600/5'
    },
    violet: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-600',
      text: 'text-purple-700',
      border: 'border-purple-100/50',
      shadow: 'shadow-purple-600/5'
    },
    rose: {
      bg: 'bg-rose-50',
      iconBg: 'bg-rose-600',
      text: 'text-rose-700',
      border: 'border-rose-100/50',
      shadow: 'shadow-rose-600/5'
    }
  };

  const current = colorSchemes[color] || colorSchemes.blue;

  return (
    <Card className={cn(
      "p-5 border-slate-200/60 shadow-lg bg-white/70 backdrop-blur-xl rounded-[1.5rem] flex flex-col justify-between group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden",
    )}>
      <div className="flex justify-between items-start relative z-10">
        <div className={cn("p-3 rounded-xl text-white shadow-lg", current.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-tighter rounded-full border border-emerald-100">
          <ArrowUpRight className="h-2.5 w-2.5" />
          {trend}
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
        </div>
        <p className="text-[9px] text-slate-400 font-medium mt-0.5">{label}</p>
      </div>

      <div className={cn("absolute -right-6 -bottom-6 h-20 w-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", current.iconBg)} />
    </Card>
  );
}

function EventItem({ title, date, type, tag, link }: any) {
  const iconMap: any = {
    meeting: '👥',
    vigil: '🔥',
    birthday: '🎂'
  };

  const Content = (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
      <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-slate-200">
        {iconMap[type]}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-black text-slate-800">{title}</h4>
          {tag && <span className="text-[9px] font-black uppercase tracking-tighter bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md">{tag}</span>}
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">{date}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
    </div>
  );

  return link ? <Link href={link}>{Content}</Link> : Content;
}
