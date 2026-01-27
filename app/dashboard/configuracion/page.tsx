'use client';

import { useState } from 'react';
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
  TestTube
} from 'lucide-react';

export default function ConfiguracionPage() {
  const { session, loading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Configuración del sistema (mock)
  const [config, setConfig] = useState({
    // General
    nombreComite: 'Conquistadores Pentecostales',
    descripcion: 'Sistema de gestión de jóvenes',
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
      // TODO: Implementar guardado real
      console.log('Guardando configuración:', config);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async (tipo: string) => {
    try {
      // TODO: Implementar test real
      toast.success(`Email de ${tipo} enviado correctamente`);
    } catch (error) {
      toast.error('Error al enviar email de prueba');
    }
  };

  if (loading || !session) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card className="p-6 space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header - Premium Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 bg-[#00338D] rounded-full" />
            <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] tracking-tight">Configuración</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm md:text-base">Administra los parámetros y preferencias del sistema</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto h-10 md:h-11 rounded-xl bg-[#00338D] hover:bg-[#00338D]/90 text-white font-bold px-6 shadow-lg shadow-blue-900/10 transition-all"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <div className="relative">
          <TabsList className="flex w-full bg-slate-100/80 backdrop-blur-md rounded-2xl p-1.5 h-auto overflow-x-auto no-scrollbar scroll-smooth justify-start md:justify-center lg:grid lg:grid-cols-6 gap-1 md:gap-2">
            <TabsTrigger value="general" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider flex-shrink-0 data-[state=active]:bg-white data-[state=active]:text-[#00338D] data-[state=active]:shadow-sm transition-all">
              <SettingsIcon size={16} />
              General
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider flex-shrink-0 data-[state=active]:bg-white data-[state=active]:text-[#00338D] data-[state=active]:shadow-sm transition-all">
              <Bell size={16} />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider flex-shrink-0 data-[state=active]:bg-white data-[state=active]:text-[#00338D] data-[state=active]:shadow-sm transition-all">
              <MessageSquare size={16} />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider flex-shrink-0 data-[state=active]:bg-white data-[state=active]:text-[#00338D] data-[state=active]:shadow-sm transition-all">
              <Mail size={16} />
              Email
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider flex-shrink-0 data-[state=active]:bg-white data-[state=active]:text-[#00338D] data-[state=active]:shadow-sm transition-all">
              <Database size={16} />
              Backup
            </TabsTrigger>
            <TabsTrigger value="seguridad" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider flex-shrink-0 data-[state=active]:bg-white data-[state=active]:text-[#00338D] data-[state=active]:shadow-sm transition-all">
              <Shield size={16} />
              Seguridad
            </TabsTrigger>
          </TabsList>
        </div>

        {/* General */}
        <TabsContent value="general">
          <Card className="p-6 md:p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2.5rem] bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-50 text-[#00338D] flex items-center justify-center">
                <SettingsIcon size={24} />
              </div>
              <h2 className="text-lg md:text-xl font-black text-[#1A1A1A] tracking-tight">Configuración General</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Nombre del Comité</label>
                <Input
                  value={config.nombreComite}
                  onChange={(e) => setConfig({ ...config, nombreComite: e.target.value })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Email de Contacto</label>
                <Input
                  type="email"
                  value={config.emailContacto}
                  onChange={(e) => setConfig({ ...config, emailContacto: e.target.value })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Descripción</label>
              <Textarea
                value={config.descripcion}
                onChange={(e) => setConfig({ ...config, descripcion: e.target.value })}
                rows={3}
                className="rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Teléfono</label>
                <Input
                  value={config.telefono}
                  onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Edad Mínima</label>
                <Input
                  type="number"
                  value={config.edadMinima}
                  onChange={(e) => setConfig({ ...config, edadMinima: parseInt(e.target.value) })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                <div>
                  <label className="text-sm font-black text-slate-900">Registro Público Habilitado</label>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Permitir que jóvenes se registren solos</p>
                </div>
                <Switch
                  checked={config.registroHabilitado}
                  onCheckedChange={(checked) => setConfig({ ...config, registroHabilitado: checked })}
                  className="data-[state=checked]:bg-[#00338D]"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                <div>
                  <label className="text-sm font-black text-slate-900">Requiere Aprobación</label>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Los nuevos registros necesitan aprobación</p>
                </div>
                <Switch
                  checked={config.requiereAprobacion}
                  onCheckedChange={(checked) => setConfig({ ...config, requiereAprobacion: checked })}
                  className="data-[state=checked]:bg-[#00338D]"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notificaciones">
          <Card className="p-6 md:p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2.5rem] bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Bell size={24} />
              </div>
              <h2 className="text-lg md:text-xl font-black text-[#1A1A1A] tracking-tight">Notificaciones</h2>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 transition-all hover:bg-white hover:shadow-md">
              <div>
                <label className="text-sm font-black text-indigo-900">Notificaciones Activas</label>
                <p className="text-xs text-indigo-600/70 font-medium mt-0.5">Habilitar sistema de notificaciones global</p>
              </div>
              <Switch
                checked={config.notificacionesActivas}
                onCheckedChange={(checked) => setConfig({ ...config, notificacionesActivas: checked })}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Emails de Administradores</label>
              <Textarea
                value={config.emailsAdmins.join('\n')}
                onChange={(e) => setConfig({ ...config, emailsAdmins: e.target.value.split('\n') })}
                placeholder="admin1@email.com\nadmin2@email.com"
                rows={3}
                className="rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Hora de Inicio</label>
                <Input
                  type="time"
                  value={config.horaInicio}
                  onChange={(e) => setConfig({ ...config, horaInicio: e.target.value })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Hora de Fin</label>
                <Input
                  type="time"
                  value={config.horaFin}
                  onChange={(e) => setConfig({ ...config, horaFin: e.target.value })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                <div>
                  <label className="text-sm font-black text-slate-900">Nuevo Registro</label>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Notificar cuando hay un nuevo registro</p>
                </div>
                <Switch
                  checked={config.notificarNuevoRegistro}
                  onCheckedChange={(checked) => setConfig({ ...config, notificarNuevoRegistro: checked })}
                  className="data-[state=checked]:bg-[#00338D]"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                <div>
                  <label className="text-sm font-black text-slate-900">Cumpleaños del Día</label>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Recordatorio diario de cumpleaños</p>
                </div>
                <Switch
                  checked={config.notificarCumpleanos}
                  onCheckedChange={(checked) => setConfig({ ...config, notificarCumpleanos: checked })}
                  className="data-[state=checked]:bg-[#00338D]"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* WhatsApp */}
        <TabsContent value="whatsapp">
          <Card className="p-6 md:p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2.5rem] bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-lg md:text-xl font-black text-[#1A1A1A] tracking-tight">WhatsApp</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Código de País</label>
                <Input
                  value={config.codigoPais}
                  onChange={(e) => setConfig({ ...config, codigoPais: e.target.value })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Formato de Número</label>
                <Input
                  value={config.formatoNumero}
                  onChange={(e) => setConfig({ ...config, formatoNumero: e.target.value })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Validar Número de Prueba</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Ej: 3001234567"
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 transition-all font-medium flex-1"
                />
                <Button variant="outline" className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 font-bold px-6 hover:bg-slate-50">
                  <TestTube size={18} className="mr-2 text-emerald-600" />
                  Validar
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <Card className="p-6 md:p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2.5rem] bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Mail size={24} />
              </div>
              <h2 className="text-lg md:text-xl font-black text-[#1A1A1A] tracking-tight">Plantillas de Email</h2>
            </div>

            <div className="space-y-6">
              <div className="p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs md:text-sm font-black uppercase tracking-widest text-[#00338D]">Bienvenida</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-lg text-xs font-bold text-orange-600 hover:bg-orange-50"
                    onClick={() => handleTestEmail('bienvenida')}
                  >
                    <TestTube size={14} className="mr-1.5" />
                    Test
                  </Button>
                </div>
                <Textarea
                  value={config.plantillaBienvenida}
                  onChange={(e) => setConfig({ ...config, plantillaBienvenida: e.target.value })}
                  rows={4}
                  placeholder="Variables: {NOMBRE}, {EMAIL}"
                  className="rounded-xl border-slate-200 bg-white focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs md:text-sm font-black uppercase tracking-widest text-[#00338D]">Recuperación de Contraseña</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-lg text-xs font-bold text-orange-600 hover:bg-orange-50"
                    onClick={() => handleTestEmail('recuperacion')}
                  >
                    <TestTube size={14} className="mr-1.5" />
                    Test
                  </Button>
                </div>
                <Textarea
                  value={config.plantillaRecuperacion}
                  onChange={(e) => setConfig({ ...config, plantillaRecuperacion: e.target.value })}
                  rows={3}
                  placeholder="Variables: {LINK}"
                  className="rounded-xl border-slate-200 bg-white focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs md:text-sm font-black uppercase tracking-widest text-[#00338D]">Notificación Nuevo Registro</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-lg text-xs font-bold text-orange-600 hover:bg-orange-50"
                    onClick={() => handleTestEmail('nuevo-registro')}
                  >
                    <TestTube size={14} className="mr-1.5" />
                    Test
                  </Button>
                </div>
                <Textarea
                  value={config.plantillaNuevoRegistro}
                  onChange={(e) => setConfig({ ...config, plantillaNuevoRegistro: e.target.value })}
                  rows={3}
                  placeholder="Variables: {NOMBRE}, {EMAIL}"
                  className="rounded-xl border-slate-200 bg-white focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup">
          <Card className="p-6 md:p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2.5rem] bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-50 text-[#0066B3] flex items-center justify-center">
                <Database size={24} />
              </div>
              <h2 className="text-lg md:text-xl font-black text-[#1A1A1A] tracking-tight">Backup y Restauración</h2>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/50 border border-blue-100 transition-all hover:bg-white hover:shadow-md">
              <div>
                <label className="text-sm font-black text-[#1A1A1A]">Backup Automático</label>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Realizar backups periódicos automáticamente</p>
              </div>
              <Switch
                checked={config.backupAutomatico}
                onCheckedChange={(checked) => setConfig({ ...config, backupAutomatico: checked })}
                className="data-[state=checked]:bg-[#00338D]"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Frecuencia de Respaldo</label>
              <Select
                value={config.frecuenciaBackup}
                onValueChange={(value) => setConfig({ ...config, frecuenciaBackup: value })}
              >
                <SelectTrigger className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  <SelectItem value="diario">Diario</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                className="w-full h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 font-bold text-[#1A1A1A] hover:bg-slate-50 hover:text-[#00338D] transition-all"
              >
                <Database size={18} className="mr-2" />
                Descargar Backup Manual
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="seguridad">
          <Card className="p-6 md:p-8 space-y-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2.5rem] bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-lg md:text-xl font-black text-[#1A1A1A] tracking-tight">Seguridad</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Tiempo de Sesión (min)</label>
                <Input
                  type="number"
                  value={config.tiempoSesion}
                  onChange={(e) => setConfig({ ...config, tiempoSesion: parseInt(e.target.value) })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Intentos Fallidos Permitidos</label>
                <Input
                  type="number"
                  value={config.intentosLogin}
                  onChange={(e) => setConfig({ ...config, intentosLogin: parseInt(e.target.value) })}
                  className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Tiempo de Bloqueo (minutos)</label>
              <Input
                type="number"
                value={config.tiempoBloqueo}
                onChange={(e) => setConfig({ ...config, tiempoBloqueo: parseInt(e.target.value) })}
                className="h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50/50 transition-all font-medium"
              />
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                <div>
                  <label className="text-sm font-black text-slate-900">Políticas de Password Estrictas</label>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Exigir seguridad máxima en cuentas</p>
                </div>
                <Switch
                  checked={config.contrasenaFuerte}
                  onCheckedChange={(checked) => setConfig({ ...config, contrasenaFuerte: checked })}
                  className="data-[state=checked]:bg-[#1A1A1A]"
                />
              </div>

              {config.contrasenaFuerte && (
                <div className="ml-0 md:ml-6 p-6 rounded-[2rem] bg-slate-50/80 border border-slate-200/60 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mínimo Caracteres</label>
                      <Input
                        type="number"
                        value={config.minCaracteres}
                        onChange={(e) => setConfig({ ...config, minCaracteres: parseInt(e.target.value) })}
                        className="h-10 rounded-xl border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                      <input
                        type="checkbox"
                        checked={config.requiereMayusculas}
                        onChange={(e) => setConfig({ ...config, requiereMayusculas: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-[#00338D] focus:ring-[#00338D]"
                      />
                      <label className="text-xs font-bold text-slate-700">Mayúsculas</label>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                      <input
                        type="checkbox"
                        checked={config.requiereNumeros}
                        onChange={(e) => setConfig({ ...config, requiereNumeros: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-[#00338D] focus:ring-[#00338D]"
                      />
                      <label className="text-xs font-bold text-slate-700">Números</label>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                      <input
                        type="checkbox"
                        checked={config.requiereEspeciales}
                        onChange={(e) => setConfig({ ...config, requiereEspeciales: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-[#00338D] focus:ring-[#00338D]"
                      />
                      <label className="text-xs font-bold text-slate-700">Caract. Especiales</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
