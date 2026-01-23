'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Home, Users, BarChart3, Settings, UserCheck, Calendar, FileText, Activity, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function Sidebar() {
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
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/jovenes', label: 'Jóvenes', icon: Users },
    { href: '/dashboard/grupos', label: 'Grupos', icon: UserCheck },
    { href: '/dashboard/cumpleanos', label: 'Cumpleaños', icon: Calendar },
    { href: '/dashboard/reportes', label: 'Reportes', icon: FileText },
    { href: '/dashboard/estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
    { href: '/dashboard/logs', label: 'Logs', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-[#1A1A1A] text-white min-h-screen p-6 border-r border-white/5 flex flex-col shadow-2xl relative z-20">
      {/* Brand Header */}
      <div className="mb-10 px-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-[#00338D] text-white shadow-lg shadow-[#00338D]/20">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            CONQUISTA<span className="text-[#F5A623]">DORES</span>
          </h1>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-11">Unánimes 2025-2027</p>
      </div>

      {/* User Card */}
      {session?.user && (
        <div className="mb-8 p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Sesión Activa</p>
          <p className="font-bold text-sm truncate text-[#F5A623]">{session.user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${isActive
                    ? 'bg-[#00338D] text-white shadow-lg shadow-[#00338D]/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-[#00338D] rounded-2xl -z-10"
                  />
                )}
                <Icon size={20} className={isActive ? 'text-[#F5A623]' : 'group-hover:text-[#F5A623] transition-colors'} />
                <span className="text-sm font-bold tracking-wide">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 h-12 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Cerrar Sistema
        </Button>
      </div>
    </aside>
  );
}
