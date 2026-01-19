'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Home, Users, BarChart3, Settings, UserCheck, Calendar, FileText, Activity } from 'lucide-react';
import { toast } from 'sonner';

export function Sidebar() {
  const router = useRouter();
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
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 border-r border-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">Conquistadores</h1>
        <p className="text-sm text-slate-400">Sistema de Gestión</p>
      </div>

      {/* User Info */}
      {session?.user && (
        <div className="mb-8 p-4 bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-300">Usuario</p>
          <p className="font-semibold truncate">{session.user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5, backgroundColor: 'rgba(30, 41, 59, 1)' }} // slate-800
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-8 border-t border-slate-800">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full justify-start gap-2"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
