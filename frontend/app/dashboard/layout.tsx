'use client';

import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import Sidebar from '../../components/dashboard/Sidebar';
import { Skeleton } from '../../components/ui/skeleton';
import { useEffect, useState } from 'react';
import { Menu, X, Bell, Search, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useProtectedRoute();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const getPageTitle = () => {
    const segments = pathname?.split('/') || [];
    const lastSegment = segments[segments.length - 1];

    // Si el último segmento parece un ID (ej: UUID de 36 caracteres o con guiones)
    const isId = /^[0-9a-f-]{20,}$/i.test(lastSegment);

    if (isId) {
      if (pathname?.includes('/jovenes/')) return 'Perfil del Joven';
      if (pathname?.includes('/grupos/')) return 'Detalle del Grupo';
      return 'Detalles';
    }

    if (!lastSegment || lastSegment === 'dashboard') return 'Resumen';

    // Títulos específicos
    const titles: Record<string, string> = {
      'jovenes': 'Directorio de Jóvenes',
      'grupos': 'Gestión de Grupos',
      'configuracion': 'Configuración',
      'reportes': 'Centro de Reportes',
      'estadisticas': 'Estadísticas',
      'logs': 'Bitácora de Actividad',
      'nuevo': 'Nuevo Registro',
      'cumpleanos': 'Calendario de Cumpleaños'
    };

    return titles[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  // Mostrar skeleton mientras se carga la autenticación
  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <div className="hidden md:block w-72 bg-slate-950 p-6">
          <Skeleton className="h-10 w-40 bg-slate-900 mb-10" />
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-slate-900 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
            <Skeleton className="h-6 w-32 bg-slate-100" />
            <Skeleton className="h-8 w-8 rounded-full bg-slate-100" />
          </header>
          <div className="p-10 space-y-8">
            <Skeleton className="h-40 w-full bg-slate-100 rounded-3xl" />
            <div className="grid grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full bg-slate-100 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 -right-12 h-10 w-10 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-lg lg:hidden"
              >
                <X size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Decorative Blobs */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Header */}
        <header className="h-20 flex-shrink-0 border-b border-slate-200/60 bg-white/70 backdrop-blur-md px-4 md:px-10 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl px-3 py-2 w-64 group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all border border-transparent focus-within:border-blue-500/20">
              <Search size={16} className="text-slate-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-slate-400"
              />
            </div>

            <div className="flex gap-1 md:gap-2">
              <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                <Settings size={18} />
              </button>
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 ml-1">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 scroll-smooth">
          <div className="container mx-auto px-4 py-8 md:px-10 max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
