'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Gift, Send, Loader2, Cake, Sparkles, MessageCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useCumpleanos } from '@/hooks/useCumpleanos';

export default function CumpleanosPage() {
  const [activeTab, setActiveTab] = useState<'hoy' | 'semana' | 'mes' | '30dias'>('hoy');
  const {
    cumpleanosHoy,
    cumpleanosSemana,
    estadisticasMes,
    proximos30,
    isLoading,
    error
  } = useCumpleanos();

  const tabs = [
    { id: 'hoy', label: 'Hoy', count: cumpleanosHoy.length, icon: Calendar },
    { id: 'semana', label: 'Esta Semana', count: cumpleanosSemana.reduce((acc, dia) => acc + dia.jovenes.length, 0), icon: UserCheck },
    { id: 'mes', label: 'Este Mes', count: estadisticasMes.totalEnMes, icon: Cake },
    { id: '30dias', label: 'Próximos 30', count: proximos30.length, icon: Calendar },
  ];

  const handleEnviarFelicitacion = (joven: any) => {
    const message = `¡Feliz cumpleaños, ${joven.nombre_completo}! 🎉 Que el Señor te bendiga grandemente en este nuevo año de vida. Tus hermanos de Conquistadores IPUC Unánimes te saludan.`;
    const whatsappUrl = `https://wa.me/${joven.celular?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-80 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-2xl" />)}
        </div>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-[2rem]" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 text-center p-20">
        <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
          <Calendar size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Error de Sincronización</h2>
          <p className="text-slate-500 max-w-xs mx-auto">No pudimos obtener el calendario de cumpleaños ministerial en este momento.</p>
        </div>
        <Button onClick={() => window.location.reload()} className="rounded-xl">Reintentar</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
            CALENDARIO <span className="text-[#00338D] ml-2">CUMPLEAÑOS</span>
            <Cake className="ml-3 w-6 h-6 text-[#F5A623]" />
          </h1>
          <p className="text-slate-500 font-medium font-prose uppercase tracking-widest text-xs opacity-70">
            Social y Convivencia - IPUC Unánimes
          </p>
        </div>
        <Button variant="outline" className="h-12 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50">
          <Gift size={16} className="mr-2 text-[#F5A623]" />
          PLANTILLAS DE SALUDO
        </Button>
      </div>

      {/* Premium Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-slate-100/50 rounded-[1.8rem] border border-slate-100 ring-1 ring-white/50 backdrop-blur-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-[1.3rem] text-xs font-black uppercase tracking-widest transition-all ${isActive
                  ? 'bg-[#00338D] text-white shadow-xl shadow-[#00338D]/20'
                  : 'text-slate-500 hover:text-[#00338D] hover:bg-white'
                }`}
            >
              <Icon size={14} className={isActive ? 'text-[#F5A623]' : 'text-slate-400'} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'hoy' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cumpleanosHoy.length === 0 ? (
                  <EmptyState message="No hay cumpleaños registrados para el día de hoy." />
                ) : (
                  cumpleanosHoy.map((joven) => (
                    <BirthdayCard key={joven.id} joven={joven} onSend={handleEnviarFelicitacion} isToday={true} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'semana' && (
              <div className="space-y-8">
                {cumpleanosSemana.length === 0 ? (
                  <EmptyState message="No hay cumpleaños próximos en el calendario semanal." />
                ) : (
                  cumpleanosSemana.map((dia) => (
                    <div key={dia.fecha} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">{dia.dia} - {dia.fecha}</span>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dia.jovenes.map((joven) => (
                          <BirthdayCard key={joven.id} joven={joven} onSend={handleEnviarFelicitacion} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'mes' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <StatBox label="Total del Mes" value={estadisticasMes.totalEnMes} color="#00338D" />
                  <StatBox label="Enviados" value={estadisticasMes.enviados} color="#0066B3" />
                  <StatBox label="Pendientes" value={estadisticasMes.pendientes} color="#F5A623" />
                </div>

                <Card className="p-10 border-slate-100 shadow-xl rounded-[2.5rem] bg-white flex items-center justify-center border-dashed border-2">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Análisis mensual de eventos sociales activo</p>
                </Card>
              </div>
            )}

            {activeTab === '30dias' && (
              <Card className="overflow-hidden border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">CRONOGRAMA PRÓXIMOS 30 DÍAS</h3>
                  <Sparkles size={20} className="text-[#F5A623]" />
                </div>
                {proximos30.length === 0 ? (
                  <div className="p-20 text-center text-slate-400">No hay registros próximos.</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {proximos30.map((joven) => (
                      <div key={joven.id} className="p-6 md:px-10 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-[#00338D] text-xs">
                            {joven.nombre_completo.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{joven.nombre_completo}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faltan {joven.dias} días • {joven.fecha_nacimiento}</span>
                          </div>
                        </div>
                        <Button variant="ghost" className="rounded-xl text-[#00338D] font-bold text-xs" onClick={() => handleEnviarFelicitacion(joven)}>
                          PROGRAMAR SALUDO
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function BirthdayCard({ joven, onSend, isToday = false }: any) {
  return (
    <Card className={`p-6 border-slate-100 shadow-xl rounded-[2rem] bg-white group hover:border-[#00338D]/20 transition-all relative overflow-hidden ${isToday ? 'ring-2 ring-[#F5A623]/20 border-[#F5A623]/20 shadow-[#F5A623]/5' : ''}`}>
      {isToday && <div className="absolute top-0 right-0 bg-[#F5A623] text-white px-4 py-1 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest z-10">HOY</div>}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${isToday ? 'bg-[#F5A623] text-white shadow-lg shadow-[#F5A623]/20' : 'bg-slate-100 text-[#00338D]'}`}>
            {joven.nombre_completo.charAt(0)}
          </div>
          <div className="space-y-0.5">
            <h3 className="font-black text-slate-900 tracking-tight leading-tight">{joven.nombre_completo}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Cake size={12} className="text-[#F5A623]" />
              CUMPLE {joven.edad} AÑOS
            </p>
            <p className="text-[10px] font-medium text-slate-400 tracking-wide">{joven.celular || 'Sin contacto'}</p>
          </div>
        </div>
        <Button
          onClick={() => onSend(joven)}
          className={`h-11 w-11 rounded-xl p-0 transition-all ${isToday ? 'bg-[#00338D] text-white shadow-lg shadow-[#00338D]/20' : 'bg-slate-50 text-slate-400 hover:bg-[#00338D] hover:text-white'}`}
          title="Felicitar por WhatsApp"
        >
          <MessageCircle size={18} />
        </Button>
      </div>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="col-span-full p-20 text-center flex flex-col items-center gap-4 border-slate-100 shadow-xl rounded-[2.5rem] bg-white">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
        <Calendar size={32} />
      </div>
      <p className="text-slate-500 font-bold max-w-xs uppercase tracking-widest text-[11px] leading-relaxed">{message}</p>
    </Card>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <Card className="p-6 border-slate-100 shadow-xl rounded-[2rem] bg-white border-l-4" style={{ borderLeftColor: color }}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    </Card>
  );
}