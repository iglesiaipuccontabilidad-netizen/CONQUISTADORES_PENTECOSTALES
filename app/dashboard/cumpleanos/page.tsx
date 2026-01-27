'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Send, Cake, User, Phone, Search, PartyPopper, Bell, Clock } from 'lucide-react';
import { useCumpleanos, type CumpleanosDetalle } from '@/hooks/useCumpleanos';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Joven } from '@/types';

export default function CumpleanosPage() {
  const { isLoading, error, cumpleanosHoy, cumpleanosSemana, estadisticasMes, jovenesPorMes, proximos30 } = useCumpleanos();
  const [activeTab, setActiveTab] = useState<string>('hoy');

  const tabs = [
    { id: 'hoy', label: 'Hoy', count: cumpleanosHoy.length, icon: StarIcon },
    { id: 'semana', label: 'Esta Semana', count: cumpleanosSemana.reduce((acc, dia) => acc + dia.jovenes.length, 0), icon: Calendar },
    { id: 'mes', label: 'Este Mes', count: estadisticasMes.totalEnMes, icon: Clock },
    { id: 'proximos30', label: 'Próximos 30 días', count: proximos30.length, icon: Bell },
  ];

  const handleTabClick = (id: string) => setActiveTab(id);

  const handleEnviarFelicitacion = (joven: CumpleanosDetalle) => {
    const message = encodeURIComponent(`¡Hola ${joven.nombre_completo}! Que Dios te bendiga grandemente en este día de tu cumpleaños. Te deseamos lo mejor, de parte de los Jóvenes de la IPUC Tercera.`);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 bg-[#00338D] rounded-full" />
            <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] tracking-tight">Calendario de Cumpleaños</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm md:text-base">Gestionar felicitaciones y celebrar la vida de nuestros jóvenes</p>
        </div>
      </div>

      {/* Modern Tabs - Glassmorphism & Responsiveness */}
      <div className="relative">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "relative px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0",
                activeTab === tab.id
                  ? "bg-white text-[#00338D] shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              )}
              onClick={() => handleTabClick(tab.id)}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="active-tab" className="absolute inset-0 bg-white rounded-xl -z-10" />
              )}
              <tab.icon size={14} className={activeTab === tab.id ? "text-[#0066B3]" : ""} />
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black",
                  activeTab === tab.id ? "bg-[#00338D] text-white" : "bg-slate-200 text-slate-600"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {cumpleanosHoy.length === 0 ? (
                <Card className="col-span-full p-8 md:p-12 flex flex-col items-center justify-center border-dashed border-2 bg-slate-50/50 rounded-[1.5rem] md:rounded-[2.5rem] border-slate-200">
                  <div className="h-16 w-16 md:h-20 md:w-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 md:mb-6">
                    <Calendar size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">Hoy no hay cumpleaños</h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium text-center">¡No te preocupes! Siempre hay tiempo para celebrar.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {cumpleanosSemana.map((dia) => (
                <div key={dia.fecha} className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-2 w-2 rounded-full bg-[#0066B3]" />
                    <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-500">{dia.dia}</h3>
                    <span className="text-[10px] md:text-xs font-bold text-slate-300 ml-auto">{dia.fecha}</span>
                  </div>
                  <div className="space-y-4">
                    {dia.jovenes.map((joven) => (
                      <BirthdayCard
                        key={joven.id}
                        joven={joven}
                        onAction={() => handleEnviarFelicitacion(joven)}
                        variant="upcoming"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'mes' && (
            <div className="space-y-8">

              <Card className="p-4 md:p-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2.5rem] bg-white">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                    <Search size={18} />
                  </div>
                  <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">Listado Mensual</h3>
                </div>
                {/* List visualization for month */}
                <div className="divide-y divide-slate-100">
                  {jovenesPorMes.length === 0 ? (
                    <div className="py-8 md:py-12 text-center">
                      <div className="h-12 w-12 md:h-16 md:w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 mx-auto">
                        <Calendar size={28} strokeWidth={1.5} />
                      </div>
                      <p className="text-slate-400 text-sm md:text-base font-medium">No hay cumpleaños este mes</p>
                    </div>
                  ) : (
                    jovenesPorMes.map((joven, index) => (
                      <div key={joven.id} className="py-3 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 transition-colors group gap-3">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                            <User size={20} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-sm md:text-base font-bold text-slate-900">{joven.nombre_completo}</p>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                              <span className="text-[10px] md:text-xs font-bold text-slate-400 flex items-center gap-1">
                                <Calendar size={12} className="text-[#0066B3]" />
                                {new Date(joven.fecha_nacimiento).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short'
                                })} • {joven.edad} años
                              </span>
                              <span className="text-[10px] md:text-xs font-bold text-slate-400 flex items-center gap-1">
                                <Phone size={12} className="text-[#009FDA]" />
                                {joven.celular}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full sm:w-auto h-9 md:h-10 rounded-lg md:rounded-xl hover:bg-blue-50 hover:text-[#00338D] font-bold px-3 md:px-4 text-xs md:text-sm"
                          onClick={() => handleEnviarFelicitacion(joven)}
                        >
                          <Send size={14} className="mr-2" />
                          Felicitar
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'proximos30' && (
            <Card className="overflow-hidden border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2.5rem] bg-white">
              <div className="p-5 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-[#1A1A1A] tracking-tight">Próximos 30 días</h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium">Organiza y programa tus felicitaciones</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-50 text-[#0066B3] rounded-xl md:rounded-2xl flex items-center justify-center">
                  <Bell className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {proximos30.map((joven) => (
                  <div key={joven.id} className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 transition-colors group gap-3 md:gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                        <User size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-bold text-slate-900">{joven.nombre_completo}</p>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                          <span className="text-[10px] md:text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Calendar size={12} className="text-[#0066B3]" />
                            {joven.fecha_nacimiento}
                          </span>
                          <Badge variant="outline" className="text-[9px] md:text-[10px] font-black uppercase text-[#0066B3] border-blue-100 bg-blue-50/50">
                            Faltan {joven.dias} días
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto h-9 md:h-10 rounded-lg md:rounded-xl hover:bg-blue-50 hover:text-[#00338D] font-bold px-3 md:px-4 text-xs md:text-sm" disabled>
                      <Clock size={14} className="mr-2" />
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

interface BirthdayCardProps {
  joven: CumpleanosDetalle;
  onAction: (joven: CumpleanosDetalle) => void;
  variant?: 'today' | 'upcoming';
}

function BirthdayCard({ joven, onAction, variant = 'today' }: BirthdayCardProps) {
  const isToday = variant === 'today';

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border-slate-200/60 shadow-lg group-hover:shadow-2xl transition-all duration-300 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem]",
        isToday ? "bg-white ring-2 ring-[#F5A623]/20" : "bg-white/70 backdrop-blur-md"
      )}>
        {/* Background Sparkles for Today */}
        {isToday && (
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-[#F5A623]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        )}

        <div className="flex flex-col gap-4 md:gap-5 items-center text-center">
          {/* Avatar Area */}
          <div className="relative">
            <div className={cn(
              "h-20 w-20 md:h-24 md:w-24 rounded-2xl md:rounded-3xl p-0.5 md:p-1 shadow-xl md:shadow-2xl transition-transform duration-500 group-hover:rotate-6",
              isToday ? "bg-gradient-to-br from-[#F5A623] via-[#0066B3] to-[#00338D]" : "bg-slate-200"
            )}>
              <div className="h-full w-full rounded-[1rem] md:rounded-[1.4rem] bg-white flex items-center justify-center text-xl md:text-2xl font-black text-[#1A1A1A] border border-slate-100">
                {joven.nombre_completo.charAt(0)}
              </div>
            </div>
            {isToday && (
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 h-8 w-8 md:h-10 md:w-10 bg-[#F5A623] text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg border-2 md:border-4 border-white animate-bounce">
                <PartyPopper className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-black text-[#1A1A1A] tracking-tight line-clamp-1">{joven.nombre_completo}</h3>
            <div className="flex flex-col items-center gap-1 mt-1.5 md:mt-2">
              <span className={cn(
                "text-xs md:text-sm font-bold",
                isToday ? "text-[#0066B3]" : "text-slate-500"
              )}>
                {isToday ? `¡Hoy cumple ${joven.edad} años! 🎂` : `Cumplirá ${joven.edad} años`}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-[#009FDA]" strokeWidth={3} />
                {joven.celular}
              </span>
            </div>
          </div>

          <Button
            onClick={() => onAction(joven)}
            className={cn(
              "w-full h-10 md:h-12 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-wider shadow-lg transition-all",
              isToday
                ? "bg-[#1A1A1A] hover:bg-black text-white shadow-black/10"
                : "bg-[#00338D] hover:bg-[#00338D]/90 text-white shadow-blue-900/10"
            )}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Enviar Felicitación
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}


const StarIcon = ({ size = 24, className, ...props }: { size?: number; className?: string } & React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);