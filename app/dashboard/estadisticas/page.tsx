'use client';

import { useMemo } from 'react';
import { useJovenes } from '@/hooks/useJovenes';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
} from 'recharts';

export default function EstadisticasPage() {
  const { jovenes, isLoading } = useJovenes();

  const chartData = useMemo(() => {
    if (!jovenes || jovenes.length === 0) return null;

    // Estados
    const estadosData = [
      {
        name: 'Bautizados',
        value: jovenes.filter((j) => j.bautizado).length,
        fill: '#22c55e',
      },
      {
        name: 'Sellados',
        value: jovenes.filter((j) => j.sellado).length,
        fill: '#a855f7',
      },
      {
        name: 'Servidores',
        value: jovenes.filter((j) => j.servidor).length,
        fill: '#f97316',
      },
      {
        name: 'Simpatizantes',
        value: jovenes.filter((j) => j.simpatizante).length,
        fill: '#ef4444',
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
      const edad = joven.edad || 0;
      edgeGroups.forEach((group) => {
        if (edad >= group.min && edad <= group.max) {
          group.count++;
        }
      });
    });

    const edadData = edgeGroups.map(({ range, count }) => ({
      range,
      jóvenes: count,
    }));

    // Crecimiento mensual (últimos 12 meses) - datos calculados
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const monthData = monthNames.map((mes, index) => {
      // Calcular registros por mes basado en fechas de creación
      const monthIndex = (currentMonth - 11 + index + 12) % 12;
      const registros = jovenes?.filter(joven => {
        if (!joven.created_at) return false;
        const fecha = new Date(joven.created_at);
        return fecha.getMonth() === monthIndex;
      }).length || 0;

      return { mes, registros };
    });

    // Estadísticas adicionales
    const stats = {
      totalJovenes: jovenes?.length || 0,
      promedioEdad: jovenes?.length ?
        Math.round(jovenes.reduce((sum, j) => sum + (j.edad || 0), 0) / jovenes.length) : 0,
      gruposActivos: 3, // Mock - debería calcularse de la BD
      registrosEsteMes: monthData[currentMonth]?.registros || 0,
    };

    return { estadosData, edadData, monthData, stats };
  }, [jovenes]);

  if (isLoading || !chartData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Estadísticas</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-80 w-full" />
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Estadísticas</h1>
        <p className="text-slate-500 mt-1">Análisis del sistema de jóvenes</p>
      </div>

      {/* General Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{chartData.stats.totalJovenes}</div>
            <p className="text-sm text-slate-600">Total Jóvenes</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{chartData.stats.promedioEdad}</div>
            <p className="text-sm text-slate-600">Edad Promedio</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{chartData.stats.gruposActivos}</div>
            <p className="text-sm text-slate-600">Grupos Activos</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">{chartData.stats.registrosEsteMes}</div>
            <p className="text-sm text-slate-600">Registros Este Mes</p>
          </div>
        </Card>
      </div>

      {/* Estados Espirituales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {chartData.estadosData.map((stat) => (
          <Card key={stat.name} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{stat.name}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div
                className="w-12 h-12 rounded-lg"
                style={{ backgroundColor: stat.fill }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estados - Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Distribución de Estados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.estadosData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.estadosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Edades - Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Distribución de Edades</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.edadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jóvenes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Registros por Mes - Line Chart */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Registros por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="registros"
                stroke="#3b82f6"
                name="Registros"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
