'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  LogOut,
  Home,
  Users,
  BarChart3,
  Settings,
  UserCheck,
  Calendar,
  FileText,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, session } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
      router.push('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/jovenes', label: 'Jóvenes', icon: Users },
    { href: '/dashboard/grupos', label: 'Grupos', icon: UserCheck },
    { href: '/dashboard/cumpleanos', label: 'Cumpleaños', icon: Calendar },
    { href: '/dashboard/reportes', label: 'Reportes', icon: FileText },
    { href: '/dashboard/estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { href: '/dashboard/configuracion', label: 'Ajustes', icon: Settings },
    { href: '/dashboard/logs', label: 'Actividad', icon: Activity },
  ];

  return (
    <aside className="h-full flex flex-col bg-slate-950 text-white border-r border-slate-900/50 shadow-2xl overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* Header / Brand */}
      <div className="p-8 pb-10 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3.5 group">
          <div className="h-11 w-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">IPUC</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none mt-1">Conquistadores</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 relative z-10 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all relative overflow-hidden",
                  isActive
                    ? "bg-blue-600/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-900/50 text-slate-400 group-hover:text-white group-hover:bg-slate-800"
                  )}>
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>

                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-1.5 h-7 bg-blue-500 rounded-r-full" />
                )}

                <ChevronRight size={14} className={cn(
                  "transition-all duration-300 transform",
                  isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                )} />
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User & Footer */}
      <div className="mt-auto p-6 space-y-4 relative z-10">
        {session?.user && (
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-sm font-bold text-blue-400 border border-slate-700 shadow-inner">
                {session.user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{session.user.email?.split('@')[0]}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-5 py-3.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all group font-semibold text-sm"
        >
          <div className="p-2 rounded-xl bg-slate-900/50 text-slate-400 group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-all duration-300">
            <LogOut size={18} />
          </div>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
