'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  User,
  Bell,
  MessageSquare,
  Mail,
  Shield,
  Database,
  Settings as SettingsIcon,
  Save,
  TestTube,
  Globe,
  Lock,
  Smartphone,
  CheckCircle2,
  Trash2,
  Settings2
} from 'lucide-react';

export default function ConfiguracionPage() {
  const { session, loading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Configuración del sistema (mock)
  const [config, setConfig] = useState({
    // General
    nombreComite: 'Conquistadores Pentecostales',
    descripcion: 'Sistema de gestión ministerial de jóvenes - IPUC Unánimes',
    emailContacto: 'admin@conquistadores.org',
    telefono: '+57 300 123 4567',
    registroHabilitado: true,
    requiereAprobacion: false,
    edadMinima: 12,
    edadMaxima: 35,

    // Notificaciones
    notificacionesActivas: true,
    emailsAdmins: ['admin@conquistadores.org'],
    horaInicio: '08:00',
    horaFin: '20:00',
    notificarNuevoRegistro: true,
    notificarCumpleanos: true,
    notificarReportes: false,

    // WhatsApp
    codigoPais: '+57',
    formatoNumero: '+57XXXXXXXXXX',

    // Email
    plantillaBienvenida: 'Bienvenido {NOMBRE} a Conquistadores Pentecostales...',
    plantillaRecuperacion: 'Para recuperar tu contraseña, haz clic en: {LINK}',
    plantillaNuevoRegistro: 'Nuevo registro: {NOMBRE} ({EMAIL})',

    // Backup
    backupAutomatico: true,
    frecuenciaBackup: 'diario',

    // Seguridad
    tiempoSesion: 1440,
    intentosLogin: 5,
    tiempoBloqueo: 15,
    contrasenaFuerte: true,
    minCaracteres: 8,
    requiereMayusculas: true,
    requiereNumeros: true,
    requiereEspeciales: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Cambios sincronizados con el servidor');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="space-y-8 pb-12">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-6 gap-2">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
        </div>
        <Card className="p-10 space-y-6 rounded-[2.5rem]">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-14 rounded-2xl" />
            <Skeleton className="h-14 rounded-2xl" />
          </div>
          <Skeleton className="h-32 rounded-2xl" />
        </Card>
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
            SETTINGS <span className="text-[#00338D] ml-2">SISTEMA</span>
            <Settings2 className="ml-3 w-6 h-6 text-[#F5A623]" />
          </h1>
          <p className="text-slate-500 font-medium font-prose uppercase tracking-widest text-xs opacity-70">
            Panel de Control Administrativo - Unánimes
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-12 px-8 rounded-2xl bg-[#00338D] hover:bg-[#00338D]/90 text-white font-bold shadow-lg shadow-[#00338D]/20 transition-all flex items-center gap-2"
        >
          {isSaving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Save size={18} /></motion.div>
          ) : (
            <Save size={18} />
          )}
          {isSaving ? 'SINCRONIZANDO...' : 'GUARDAR CAMBIOS'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="h-auto p-1.5 bg-slate-100/70 rounded-[2rem] border border-slate-100 flex flex-wrap md:flex-nowrap gap-1">
          <ConfigTab value="general" icon={SettingsIcon} label="General" />
          <ConfigTab value="notificaciones" icon={Bell} label="Notificaciones" />
          <ConfigTab value="whatsapp" icon={MessageSquare} label="WhatsApp" />
          <ConfigTab value="email" icon={Mail} label="Email" />
          <ConfigTab value="backup" icon={Database} label="Backup" />
          <ConfigTab value="seguridad" icon={Shield} label="Seguridad" />
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="general">
            <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <Card className="p-8 md:p-12 border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white space-y-8">
                <SectionHeader icon={Globe} title="Identidad del Sistema" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ConfigField label="Nombre del Comité">
                    <Input
                      value={config.nombreComite}
                      onChange={(e) => setConfig({ ...config, nombreComite: e.target.value })}
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white font-bold"
                    />
                  </ConfigField>
                  <ConfigField label="Email Administrativo">
                    <Input
                      type="email"
                      value={config.emailContacto}
                      onChange={(e) => setConfig({ ...config, emailContacto: e.target.value })}
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white font-bold"
                    />
                  </ConfigField>
                </div>

                <ConfigField label="Descripción de la Organización">
                  <Textarea
                    value={config.descripcion}
                    onChange={(e) => setConfig({ ...config, descripcion: e.target.value })}
                    rows={4}
                    className="rounded-[1.5rem] border-slate-200 bg-slate-50/50 focus:bg-white font-medium p-4"
                  />
                </ConfigField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ConfigField label="Teléfono de Soporte">
                    <Input
                      value={config.telefono}
                      onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white font-bold"
                    />
                  </ConfigField>
                  <div className="grid grid-cols-2 gap-4">
                    <ConfigField label="Edad Mínima">
                      <Input
                        type="number"
                        value={config.edadMinima}
                        onChange={(e) => setConfig({ ...config, edadMinima: parseInt(e.target.value) })}
                        className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white font-bold"
                      />
                    </ConfigField>
                    <ConfigField label="Edad Máxima">
                      <Input
                        type="number"
                        value={config.edadMaxima}
                        onChange={(e) => setConfig({ ...config, edadMaxima: parseInt(e.target.value) })}
                        className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white font-bold"
                      />
                    </ConfigField>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-6">
                  <SwitchRow
                    label="Registro Público Activo"
                    desc="Habilita el formulario de registro externo para nuevos miembros."
                    checked={config.registroHabilitado}
                    onCheckedChange={(v) => setConfig({ ...config, registroHabilitado: v })}
                  />
                  <SwitchRow
                    label="Moderación de Usuarios"
                    desc="Los nuevos registros requerirán aprobación manual de un administrador."
                    checked={config.requiereAprobacion}
                    onCheckedChange={(v) => setConfig({ ...config, requiereAprobacion: v })}
                  />
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notificaciones">
            <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-8 md:p-12 border-slate-100 shadow-xl rounded-[2.5rem] bg-white space-y-8">
                <SectionHeader icon={Bell} title="Configuración de Alertas" />
                <SwitchRow
                  label="Permitir Notificaciones"
                  desc="Activa el envío global de notificaciones por email y sistema."
                  checked={config.notificacionesActivas}
                  onCheckedChange={(v) => setConfig({ ...config, notificacionesActivas: v })}
                />
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="seguridad">
            <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-8 md:p-12 border-slate-100 shadow-xl rounded-[2.5rem] bg-white space-y-8">
                <SectionHeader icon={Lock} title="Políticas de Acceso" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ConfigField label="Tiempo de Sesión (min)">
                    <Input type="number" value={config.tiempoSesion} onChange={(e) => setConfig({ ...config, tiempoSesion: parseInt(e.target.value) })} className="h-14 rounded-2xl border-slate-200" />
                  </ConfigField>
                  <ConfigField label="Máximo de Intentos">
                    <Input type="number" value={config.intentosLogin} onChange={(e) => setConfig({ ...config, intentosLogin: parseInt(e.target.value) })} className="h-14 rounded-2xl border-slate-200" />
                  </ConfigField>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}

function ConfigTab({ value, icon: Icon, label }: any) {
  return (
    <TabsTrigger
      value={value}
      className="flex-1 min-w-[120px] h-11 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all data-[state=active]:bg-[#00338D] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#00338D]/20 gap-2"
    >
      <Icon size={14} className="opacity-70" />
      {label}
    </TabsTrigger>
  );
}

function SectionHeader({ icon: Icon, title }: any) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-6">
      <div className="p-3 rounded-2xl bg-slate-50 text-[#00338D]">
        <Icon size={22} />
      </div>
      <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">{title}</h2>
    </div>
  );
}

function ConfigField({ label, children }: any) {
  return (
    <div className="space-y-2">
ss      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}

function SwitchRow({ label, desc, checked, onCheckedChange }: { label: string; desc: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50/50 transition-colors">
      <div className="space-y-1">
        <label className="text-sm font-black text-slate-800 uppercase tracking-tight">{label}</label>
        <p className="text-xs font-medium text-slate-400 tracking-wide">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
