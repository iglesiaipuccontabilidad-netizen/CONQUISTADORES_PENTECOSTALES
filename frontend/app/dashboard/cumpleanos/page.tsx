'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Send, Cake, ChevronRight, User, Phone, Search, PartyPopper, Bell, Clock } from 'lucide-react';
import { useCumpleanos } from '../../../hooks/useCumpleanos';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CumpleanosPage() {
  const { isLoading, error, cumpleanosHoy, cumpleanosSemana, estadisticasMes, proximos30 } = useCumpleanos();
  const [activeTab, setActiveTab] = useState<'hoy' | 'semana' | 'mes' | '30dias'>('hoy');

  const tabs = [
    { id: 'hoy', label: 'Hoy', count: cumpleanosHoy.length, icon: StarIcon },
    { id: 'semana', label: 'Esta Semana', count: cumpleanosSemana.reduce((acc, dia) => acc + dia.jovenes.length, 0), icon: Calendar },
    { id: 'mes', label: 'Este Mes', count: estadisticasMes.totalEnMes, icon: Clock },
    { id: '30dias', label: 'Próximos 30 días', count: proximos30.length, icon: Bell },
  ];

  const handleEnviarFelicitacion = (joven: any) => {
    const message = encodeURIComponent(`¡Hola ${joven.nombre_completo}! 🎉 Que Dios te bendiga grandemente en este día de tu cumpleaños. Te deseamos lo mejor desde IPUC Conquistadores. 🙏🎂`);
    window.open(`https://wa.me/${joven.celular}?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/10"
        >
          <Cake size={32} />
        </motion.div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Preparando celebraciones...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-8 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header - Premium Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-1 bg-blue-600 rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calendario de Cumpleaños</h1>
          </div>
          <p className="text-slate-500 font-medium">Gestionar felicitaciones y celebrar la vida de nuestros jóvenes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm font-bold px-6 hover:bg-white">
            <Gift size={18} className="mr-2 text-rose-500" />
            Gestionar Plantillas
          </Button>
        </div>
      </div>

      {/* Modern Tabs - Glassmorphism */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl w-full md:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "relative px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2",
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
            )}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="active-tab" className="absolute inset-0 bg-white rounded-xl -z-10" />
            )}
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black",
                activeTab === tab.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {activeTab === 'hoy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cumpleanosHoy.length === 0 ? (
                <Card className="col-span-full p-12 flex flex-col items-center justify-center border-dashed border-2 bg-slate-50/50 rounded-[2.5rem] border-slate-200">
                  <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                    <Calendar size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Hoy no hay cumpleaños</h3>
                  <p className="text-slate-500 text-sm font-medium">¡No te preocupes! Siempre hay tiempo para celebrar.</p>
                </Card>
              ) : (
                cumpleanosHoy.map((joven) => (
                  <BirthdayCard
                    key={joven.id}
                    joven={joven}
                    onAction={() => handleEnviarFelicitacion(joven)}
                    variant="today"
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'semana' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cumpleanosSemana.map((dia) => (
                <div key={dia.fecha} className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{dia.dia}</h3>
                    <span className="text-xs font-bold text-slate-300 ml-auto">{dia.fecha}</span>
                  </div>
                  <div className="space-y-4">
                    {dia.jovenes.map((joven) => (
                      <BirthdayCard
                        key={joven.id}
                        joven={joven}
                        onAction={() => handleEnviarFelicitacion(joven)}
                        variant="week"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'mes' && (
            <div className="space-y-8">
              {/* StatCards for Month */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MiniStatCard
                  label="Total del Mes"
                  value={estadisticasMes.totalEnMes}
                  icon={Calendar}
                  color="blue"
                />
                <MiniStatCard
                  label="Felicicaciones Enviadas"
                  value={estadisticasMes.enviados}
                  icon={Send}
                  color="emerald"
                />
                <MiniStatCard
                  label="Pendientes por Felicitar"
                  value={estadisticasMes.pendientes}
                  icon={Clock}
                  color="amber"
                />
              </div>

              <Card className="p-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                    <Search size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Listado Completo Mensual</h3>
                </div>
                {/* List visualization for month */}
                <div className="divide-y divide-slate-100">
                  {/* Here we could map all users of the month, but it requires hook data structure */}
                  <p className="py-12 text-center text-slate-400 font-medium italic">Mostrando resumen de {estadisticasMes.totalEnMes} celebraciones.</p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === '30dias' && (
            <Card className="overflow-hidden border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Próximos 30 días</h3>
                  <p className="text-sm text-slate-500 font-medium">Organiza y programa tus felicitaciones</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Bell size={24} />
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {proximos30.map((joven) => (
                  <div key={joven.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                        <User size={24} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900">{joven.nombre_completo}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {joven.fecha_nacimiento}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-black uppercase text-blue-600 border-blue-100 bg-blue-50/50">
                            Faltan {joven.dias} días
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 font-bold px-4" onClick={() => handleEnviarFelicitacion(joven)}>
                      <Clock size={16} className="mr-2" />
                      Programar
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function BirthdayCard({ joven, onAction, variant = 'today' }: any) {
  const isToday = variant === 'today';

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border-slate-200/60 shadow-lg group-hover:shadow-2xl transition-all duration-300 p-6 rounded-[2rem]",
        isToday ? "bg-white ring-2 ring-blue-500/20" : "bg-white/70 backdrop-blur-md"
      )}>
        {/* Background Sparkles for Today */}
        {isToday && (
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        )}

        <div className="flex flex-col gap-5 items-center text-center">
          {/* Avatar Area */}
          <div className="relative">
            <div className={cn(
              "h-24 w-24 rounded-3xl p-1 shadow-2xl transition-transform duration-500 group-hover:rotate-6",
              isToday ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" : "bg-slate-200"
            )}>
              <div className="h-full w-full rounded-[1.4rem] bg-white flex items-center justify-center text-2xl font-black text-slate-900 border border-slate-100">
                {joven.nombre_completo.charAt(0)}
              </div>
            </div>
            {isToday && (
              <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
                <PartyPopper size={20} />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight line-clamp-1">{joven.nombre_completo}</h3>
            <div className="flex flex-col items-center gap-1.5 mt-2">
              <span className={cn(
                "text-sm font-bold",
                isToday ? "text-blue-600" : "text-slate-500"
              )}>
                {isToday ? `¡Hoy cumple ${joven.edad} años! 🎂` : `Cumplirá ${joven.edad} años`}
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Phone size={12} strokeWidth={3} />
                {joven.celular}
              </span>
            </div>
          </div>

          <Button
            onClick={onAction}
            className={cn(
              "w-full h-12 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all",
              isToday
                ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
            )}
          >
            <Send size={18} className="mr-2" />
            Enviar Felicitación
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function MiniStatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 shadow-blue-500/5",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-500/5",
    amber: "text-amber-600 bg-amber-50 border-amber-100 shadow-amber-500/5",
  };

  return (
    <Card className={cn("p-6 flex items-center gap-5 border-slate-100 shadow-xl rounded-[2rem] bg-white transition-all hover:scale-[1.02]", colors[color])}>
      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border", colors[color].replace('shadow-', ''))}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
      </div>
    </Card>
  );
}

const StarIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);