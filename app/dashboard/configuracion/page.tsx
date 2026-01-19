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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
          <p className="text-slate-500 mt-1">Administra la configuración del sistema</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save size={16} className="mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon size={16} />
            General
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell size={16} />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare size={16} />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail size={16} />
            Email
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database size={16} />
            Backup
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield size={16} />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon size={20} />
              <h2 className="text-lg font-semibold">Configuración General</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre del Comité</label>
                <Input
                  value={config.nombreComite}
                  onChange={(e) => setConfig({...config, nombreComite: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email de Contacto</label>
                <Input
                  type="email"
                  value={config.emailContacto}
                  onChange={(e) => setConfig({...config, emailContacto: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <Textarea
                value={config.descripcion}
                onChange={(e) => setConfig({...config, descripcion: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <Input
                  value={config.telefono}
                  onChange={(e) => setConfig({...config, telefono: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Edad Mínima</label>
                <Input
                  type="number"
                  value={config.edadMinima}
                  onChange={(e) => setConfig({...config, edadMinima: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Registro Público Habilitado</label>
                  <p className="text-xs text-slate-500">Permitir que jóvenes se registren solos</p>
                </div>
                <Switch
                  checked={config.registroHabilitado}
                  onCheckedChange={(checked) => setConfig({...config, registroHabilitado: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Requiere Aprobación</label>
                  <p className="text-xs text-slate-500">Los nuevos registros necesitan aprobación</p>
                </div>
                <Switch
                  checked={config.requiereAprobacion}
                  onCheckedChange={(checked) => setConfig({...config, requiereAprobacion: checked})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notificaciones">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} />
              <h2 className="text-lg font-semibold">Notificaciones</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Notificaciones Activas</label>
                <p className="text-xs text-slate-500">Habilitar sistema de notificaciones</p>
              </div>
              <Switch
                checked={config.notificacionesActivas}
                onCheckedChange={(checked) => setConfig({...config, notificacionesActivas: checked})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Emails de Administradores</label>
              <Textarea
                value={config.emailsAdmins.join('\n')}
                onChange={(e) => setConfig({...config, emailsAdmins: e.target.value.split('\n')})}
                placeholder="admin1@email.com&#10;admin2@email.com"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hora de Inicio</label>
                <Input
                  type="time"
                  value={config.horaInicio}
                  onChange={(e) => setConfig({...config, horaInicio: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hora de Fin</label>
                <Input
                  type="time"
                  value={config.horaFin}
                  onChange={(e) => setConfig({...config, horaFin: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Nuevo Registro</label>
                  <p className="text-xs text-slate-500">Notificar cuando hay un nuevo registro</p>
                </div>
                <Switch
                  checked={config.notificarNuevoRegistro}
                  onCheckedChange={(checked) => setConfig({...config, notificarNuevoRegistro: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Cumpleaños del Día</label>
                  <p className="text-xs text-slate-500">Recordatorio diario de cumpleaños</p>
                </div>
                <Switch
                  checked={config.notificarCumpleanos}
                  onCheckedChange={(checked) => setConfig({...config, notificarCumpleanos: checked})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* WhatsApp */}
        <TabsContent value="whatsapp">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={20} />
              <h2 className="text-lg font-semibold">WhatsApp</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Código de País</label>
                <Input
                  value={config.codigoPais}
                  onChange={(e) => setConfig({...config, codigoPais: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Formato de Número</label>
                <Input
                  value={config.formatoNumero}
                  onChange={(e) => setConfig({...config, formatoNumero: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Test de Número</label>
              <div className="flex gap-2">
                <Input placeholder="Ej: 3001234567" />
                <Button variant="outline">
                  <TestTube size={16} className="mr-2" />
                  Validar
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={20} />
              <h2 className="text-lg font-semibold">Plantillas de Email</h2>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Bienvenida</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestEmail('bienvenida')}
                >
                  <TestTube size={14} className="mr-1" />
                  Test
                </Button>
              </div>
              <Textarea
                value={config.plantillaBienvenida}
                onChange={(e) => setConfig({...config, plantillaBienvenida: e.target.value})}
                rows={4}
                placeholder="Variables: {NOMBRE}, {EMAIL}"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Recuperación de Contraseña</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestEmail('recuperacion')}
                >
                  <TestTube size={14} className="mr-1" />
                  Test
                </Button>
              </div>
              <Textarea
                value={config.plantillaRecuperacion}
                onChange={(e) => setConfig({...config, plantillaRecuperacion: e.target.value})}
                rows={3}
                placeholder="Variables: {LINK}"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Notificación Nuevo Registro</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestEmail('nuevo-registro')}
                >
                  <TestTube size={14} className="mr-1" />
                  Test
                </Button>
              </div>
              <Textarea
                value={config.plantillaNuevoRegistro}
                onChange={(e) => setConfig({...config, plantillaNuevoRegistro: e.target.value})}
                rows={3}
                placeholder="Variables: {NOMBRE}, {EMAIL}"
              />
            </div>
          </Card>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Database size={20} />
              <h2 className="text-lg font-semibold">Backup y Restauración</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Backup Automático</label>
                <p className="text-xs text-slate-500">Realizar backups automáticamente</p>
              </div>
              <Switch
                checked={config.backupAutomatico}
                onCheckedChange={(checked) => setConfig({...config, backupAutomatico: checked})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Frecuencia de Backup</label>
              <Select
                value={config.frecuenciaBackup}
                onValueChange={(value) => setConfig({...config, frecuenciaBackup: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diario</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Database size={16} className="mr-2" />
                Descargar Backup Manual
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="seguridad">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} />
              <h2 className="text-lg font-semibold">Seguridad</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tiempo de Sesión (minutos)</label>
                <Input
                  type="number"
                  value={config.tiempoSesion}
                  onChange={(e) => setConfig({...config, tiempoSesion: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Intentos de Login Permitidos</label>
                <Input
                  type="number"
                  value={config.intentosLogin}
                  onChange={(e) => setConfig({...config, intentosLogin: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tiempo de Bloqueo (minutos)</label>
              <Input
                type="number"
                value={config.tiempoBloqueo}
                onChange={(e) => setConfig({...config, tiempoBloqueo: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Contraseña Fuerte Requerida</label>
                  <p className="text-xs text-slate-500">Aplicar reglas estrictas de contraseña</p>
                </div>
                <Switch
                  checked={config.contrasenaFuerte}
                  onCheckedChange={(checked) => setConfig({...config, contrasenaFuerte: checked})}
                />
              </div>

              {config.contrasenaFuerte && (
                <div className="ml-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Mínimo Caracteres</label>
                      <Input
                        type="number"
                        value={config.minCaracteres}
                        onChange={(e) => setConfig({...config, minCaracteres: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.requiereMayusculas}
                        onChange={(e) => setConfig({...config, requiereMayusculas: e.target.checked})}
                      />
                      <label className="text-xs">Requiere mayúsculas</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.requiereNumeros}
                        onChange={(e) => setConfig({...config, requiereNumeros: e.target.checked})}
                      />
                      <label className="text-xs">Requiere números</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.requiereEspeciales}
                        onChange={(e) => setConfig({...config, requiereEspeciales: e.target.checked})}
                      />
                      <label className="text-xs">Requiere caracteres especiales</label>
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
