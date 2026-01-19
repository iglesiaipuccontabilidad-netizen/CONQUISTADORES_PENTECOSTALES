'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useJovenes } from '@/hooks/useJovenes';
import { Users, TrendingUp } from 'lucide-react';
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
  LineChart,
  Line,
} from 'recharts';
import { useMemo } from 'react';

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
      const edad = joven.edad || 0;
      ageGroups.forEach((group) => {
        if (edad >= group.min && edad <= group.max) {
          group.count++;
        }
      });
    });

    const ageData = ageGroups.map(({ range, count }) => ({
      range,
      jóvenes: count,
    }));

    // Estado espiritual
    const estadoData = [
      { name: 'Bautizados', value: stats.bautizados, fill: '#22c55e' },
      { name: 'Sellados', value: stats.sellados, fill: '#a855f7' },
      { name: 'Servidores', value: stats.servidores, fill: '#f97316' },
      { name: 'Simpatizantes', value: stats.simpatizantes, fill: '#ef4444' },
    ];

    // Crecimiento mensual (últimos 12 meses) - usando datos mock por ahora
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const growthData = monthNames.map((mes, index) => ({
      mes,
      registros: Math.floor(Math.random() * 15) + 5, // Mock data
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div className="flex justify-between items-center" variants={item}>
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Sistema de Gestión de Jóvenes - Conquistadores</p>
        </div>
        <Link href="/dashboard/jovenes/nuevo">
          <Button>+ Nuevo Joven</Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={item}
      >
        {/* Total Jóvenes */}
        <Card className="p-6 bg-white border-l-4 border-l-blue-500" variants={item}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Jóvenes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalJovenes}</p>
            </div>
            <Users className="text-blue-500 opacity-50" size={32} />
          </div>
        </Card>

        {/* Bautizados */}
        <Card className="p-6 bg-white border-l-4 border-l-green-500" variants={item}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Bautizados</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.bautizados}</p>
            </div>
            <TrendingUp className="text-green-500 opacity-50" size={32} />
          </div>
        </Card>

        {/* Sellados */}
        <Card className="p-6 bg-white border-l-4 border-l-purple-500" variants={item}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Sellados</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.sellados}</p>
            </div>
            <TrendingUp className="text-purple-500 opacity-50" size={32} />
          </div>
        </Card>

        {/* Servidores */}
        <Card className="p-6 bg-white border-l-4 border-l-orange-500" variants={item}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Servidores</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.servidores}</p>
            </div>
            <TrendingUp className="text-orange-500 opacity-50" size={32} />
          </div>
        </Card>

        {/* Simpatizantes */}
        <Card className="p-6 bg-white border-l-4 border-l-red-500" variants={item}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Simpatizantes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.simpatizantes}</p>
            </div>
            <TrendingUp className="text-red-500 opacity-50" size={32} />
          </div>
        </Card>
      </motion.div>

      {/* Charts Section */}
      {chartData && (
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={item}>
          {/* Distribución por Edad - Bar Chart */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Distribución por Edad</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jóvenes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Estado Espiritual - Pie Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Estado Espiritual</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.estadoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.estadoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {/* Crecimiento Mensual */}
      {chartData && (
        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Crecimiento Mensual</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="registros"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Registros"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {/* Quick Links */}
      <motion.div variants={item}>
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Acceso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/jovenes">
              <Button variant="outline" className="w-full">
                Ver Todos los Jóvenes
              </Button>
            </Link>
            <Link href="/dashboard/estadisticas">
              <Button variant="outline" className="w-full">
                Ver Estadísticas
              </Button>
            </Link>
            <Link href="/dashboard/configuracion">
              <Button variant="outline" className="w-full">
                Configuración
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Información</h2>
          <p className="text-slate-600">
            {isLoading
              ? 'Cargando jóvenes...'
              : `Total de ${stats.totalJovenes} jóvenes registrados en el sistema.`}
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
