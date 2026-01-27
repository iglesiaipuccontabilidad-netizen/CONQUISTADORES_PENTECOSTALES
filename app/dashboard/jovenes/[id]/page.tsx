'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJovenes } from '@/hooks/useJovenes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  User,
  Phone,
  IdCard,
  Calendar,
  ShieldCheck,
  Target,
  Zap,
  Heart,
  CheckCircle2,
  Clock,
  Mail,
  Activity,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Joven } from '@/types/index';

export default function JovenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const joven_id = params.id as string;
  const { useGetJoven, updateJoven } = useJovenes();
  const { data: joven, isLoading, error } = useGetJoven(joven_id);
  const [formData, setFormData] = useState<Joven | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (joven) {
      console.log('DEBUG: Setting formData with:', joven);
      setFormData(joven);
    }
  }, [joven]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: checked,
      };
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      await updateJoven.mutateAsync({
        id: joven_id,
        data: {
          nombre_completo: formData.nombre_completo,
          celular: formData.celular,
          bautizado: formData.bautizado,
          sellado: formData.sellado,
          servidor: formData.servidor,
          simpatizante: formData.simpatizante,
        },
      });
      toast.success('Joven actualizado correctamente');
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
          <X size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Error al cargar el joven</h2>
        <p className="text-slate-500">No pudimos encontrar la información solicitada.</p>
        <Link href="/dashboard/jovenes">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft size={16} className="mr-2" />
            Volver al listado
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading || !formData) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] md:col-span-2 rounded-[2rem]" />
          <Skeleton className="h-[400px] rounded-[2rem]" />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/jovenes">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 hover:bg-slate-50 transition-all">
              <ArrowLeft size={20} className="text-slate-600" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isEditing ? 'Editando Perfil' : 'Perfil del Joven'}
            </h1>
            {!isEditing && (
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg" />
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(joven || null);
                }}
                className="h-11 rounded-xl border-slate-200 font-bold px-6"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="h-11 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold px-6 shadow-lg"
              >
                {isSaving ? (
                  <Activity className="animate-spin mr-2" size={18} />
                ) : (
                  <Save className="mr-2" size={18} />
                )}
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 shadow-xl"
            >
              <Edit3 className="mr-2" size={18} />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-slate-200 shadow-2xl shadow-slate-200 rounded-[2.5rem] bg-white">
              <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                <div className="absolute inset-0 bg-grid-slate-100/10 pointer-events-none" />
              </div>

              <div className="px-8 pb-8">
                <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16 mb-8">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-white p-2 shadow-2xl relative z-20">
                    <div className="h-full w-full rounded-[2.2rem] bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center text-slate-400 border border-slate-100">
                      <User size={64} strokeWidth={1} />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left pb-2 relative z-10">
                    {isEditing ? (
                      <div className="space-y-3 max-w-md">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                        <Input
                          name="nombre_completo"
                          value={formData.nombre_completo}
                          onChange={handleInputChange}
                          className="h-12 text-lg font-bold bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all rounded-2xl"
                          placeholder="Nombre Completo"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                          {formData.nombre_completo}
                        </h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                          <Badge icon={Calendar} label={`${formData.edad ?? '—'} Años`} color="slate" />
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            Activo
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                  <div className="space-y-6">
                    <DetailItem
                      icon={Phone}
                      label="Nro. Celular"
                      value={formData.celular}
                      isEditing={isEditing}
                      name="celular"
                      onChange={handleInputChange}
                    />
                    <DetailItem
                      icon={Mail}
                      label="Estado del Registro"
                      value={formData.estado === 'activo' ? 'Verificado' : 'Pendiente'}
                      isEditing={false}
                      name=""
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                  <div className="space-y-6">
                    <DetailItem
                      icon={Calendar}
                      label="Fecha de Nacimiento"
                      value={formData.fecha_nacimiento ? format(new Date(formData.fecha_nacimiento), 'dd MMMM, yyyy', { locale: es }) : 'No registra'}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Activity / Status Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Estado Espiritual</h3>
                  <p className="text-slate-400 text-sm font-medium">Información sobre el proceso espiritual del joven</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatusToggle
                  id="bautizado"
                  icon={ShieldCheck}
                  label="Bautizado"
                  description="Ha recibido el bautismo en agua"
                  checked={formData.bautizado}
                  onChange={(checked: boolean) => handleCheckboxChange('bautizado', checked)}
                  isEditing={isEditing}
                  activeColor="text-emerald-600"
                  activeBg="bg-emerald-50"
                  activeBorder="border-emerald-100"
                />
                <StatusToggle
                  id="sellado"
                  icon={Target}
                  label="Sellado"
                  description="Ha recibido el bautismo del Espíritu Santo"
                  checked={formData.sellado}
                  onChange={(checked: boolean) => handleCheckboxChange('sellado', checked)}
                  isEditing={isEditing}
                  activeColor="text-purple-600"
                  activeBg="bg-purple-50"
                  activeBorder="border-purple-100"
                />
                <StatusToggle
                  id="servidor"
                  icon={Zap}
                  label="Servidor"
                  description="Ofrece un servicio activo en la iglesia"
                  checked={formData.servidor}
                  onChange={(checked: boolean) => handleCheckboxChange('servidor', checked)}
                  isEditing={isEditing}
                  activeColor="text-amber-600"
                  activeBg="bg-amber-50"
                  activeBorder="border-amber-100"
                />
                <StatusToggle
                  id="simpatizante"
                  icon={Heart}
                  label="Simpatizante"
                  description="Persona en proceso de integración"
                  checked={formData.simpatizante}
                  onChange={(checked: boolean) => handleCheckboxChange('simpatizante', checked)}
                  isEditing={isEditing}
                  activeColor="text-rose-600"
                  activeBg="bg-rose-50"
                  activeBorder="border-rose-100"
                />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Sidebar info */}
        <div className="space-y-8">
          {/* Metadata Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border-slate-200/60 shadow-lg shadow-slate-200/30 rounded-[2.5rem] bg-white sticky top-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Detalles del Registro</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Grupo / Sociedad</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">{formData.grupo?.nombre || 'General'}</span>
                      <Target size={16} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Estado General</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 capitalize">{formData.estado || 'Activo'}</span>
                      <div className="h-6 px-2 bg-blue-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center uppercase tracking-tighter">Oficial</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Consentimientos</span>
                  </div>
                  <div className="space-y-2">
                    <ConsentBadge label="Datos Personales" status={formData.consentimiento_datos_personales} />
                    <ConsentBadge label="Comunicaciones WhatsApp" status={formData.consentimiento_whatsapp} />
                    <ConsentBadge label="Procesamiento de Datos" status={formData.consentimiento_procesamiento} />
                    <ConsentBadge label="Términos y Condiciones" status={formData.consentimiento_terminos} />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                    <Clock size={14} />
                    <span>Registrado el {formData.created_at ? format(new Date(formData.created_at), 'PPP', { locale: es }) : '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-medium mt-2">
                    <Activity size={14} />
                    <span>Última actualización {formData.updated_at ? format(new Date(formData.updated_at), 'PPP', { locale: es }) : '—'}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface DetailItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  isEditing?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function DetailItem({ icon: Icon, label, value, isEditing, name, onChange, disabled }: DetailItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-slate-400" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      {isEditing && !disabled ? (
        <Input
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500 transition-all font-semibold"
        />
      ) : (
        <div className="text-slate-900 font-bold text-lg min-h-[1.75rem]">{value || '—'}</div>
      )}
    </div>
  );
}

interface StatusToggleProps {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isEditing: boolean;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
}

function StatusToggle({ id, icon: Icon, label, description, checked, onChange, isEditing, activeColor, activeBg, activeBorder }: StatusToggleProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-2xl border transition-all flex items-start gap-4",
        checked ? cn(activeBg, activeBorder) : "bg-slate-50 border-slate-100",
        isEditing && "cursor-pointer hover:border-blue-300"
      )}
      onClick={() => isEditing && onChange(!checked)}
    >
      <div className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
        checked ? activeColor : "text-slate-300"
      )}>
        <Icon size={24} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className={cn("text-sm font-black uppercase tracking-tight", checked ? "text-slate-900" : "text-slate-400")}>{label}</span>
          {isEditing ? (
            <div className={cn(
              "h-5 w-5 rounded-md border flex items-center justify-center transition-all",
              checked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200"
            )}>
              {checked && <CheckCircle2 size={14} strokeWidth={3} />}
            </div>
          ) : (
            checked && <CheckCircle2 size={16} className={activeColor} strokeWidth={3} />
          )}
        </div>
        <p className="text-[11px] text-slate-500 font-medium leading-tight">{description}</p>
      </div>
    </div>
  );
}

function ConsentBadge({ label, status }: { label: string, status?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl">
      <span className="text-[11px] font-bold text-slate-600">{label}</span>
      {status ? (
        <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <FileCheck size={12} />
        </div>
      ) : (
        <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
          <X size={12} />
        </div>
      )}
    </div>
  );
}

interface BadgeProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  color: string;
}

function Badge({ icon: Icon, label, color }: BadgeProps) {
  const families: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest", families[color])}>
      <Icon size={12} />
      {label}
    </div>
  );
}
