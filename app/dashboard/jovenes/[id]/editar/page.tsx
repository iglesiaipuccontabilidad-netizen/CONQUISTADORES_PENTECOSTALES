'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJovenes } from '@/hooks/useJovenes';
import { useGrupos } from '@/hooks/useGrupos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ArrowLeft,
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
  Users,
  Loader2,
  Mail,
  Home,
  Briefcase,
  Church,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Constantes de diseño y colores
const COLORS = {
  primary: '#00338D', // Azul Oscuro
  secondary: '#0066B3', // Azul Medio
  accent: '#F5A623', // Naranja
  cyan: '#009FDA', // Azul Claro
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function EditJovenPage() {
  const params = useParams();
  const router = useRouter();
  const joven_id = params.id as string;
  const { useGetJoven, updateJoven } = useJovenes();
  const { grupos } = useGrupos();
  const { data: joven, isLoading, error } = useGetJoven(joven_id);

  const [formData, setFormData] = useState({
    nombre_completo: '',
    fecha_nacimiento: '',
    cedula: '',
    celular: '',
    grupo_id: '',
    bautizado: false,
    sellado: false,
    servidor: false,
    simpatizante: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (joven) {
      setFormData({
        nombre_completo: joven.nombre_completo || '',
        fecha_nacimiento: joven.fecha_nacimiento || '',
        cedula: joven.cedula || '',
        celular: joven.celular || '',
        grupo_id: joven.grupo_id || 'none',
        bautizado: joven.bautizado || false,
        sellado: joven.sellado || false,
        servidor: joven.servidor || false,
        simpatizante: joven.simpatizante || false,
      });
    }
  }, [joven]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSave = async () => {
    if (!formData.nombre_completo || !formData.celular || !formData.cedula) {
      toast.error('Nombre, Cédula y Celular son requeridos');
      return;
    }

    setIsSaving(true);
    try {
      await updateJoven.mutateAsync({
        id: joven_id,
        data: {
          nombre_completo: formData.nombre_completo,
          fecha_nacimiento: formData.fecha_nacimiento,
          cedula: formData.cedula,
          celular: formData.celular,
          grupo_id: formData.grupo_id === 'none' ? null : formData.grupo_id,
          bautizado: formData.bautizado,
          sellado: formData.sellado,
          servidor: formData.servidor,
          simpatizante: formData.simpatizante,
        },
      });

      toast.success('Información actualizada correctamente');
      router.push(`/dashboard/jovenes/${joven_id}`);
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[500px] lg:col-span-2 rounded-3xl" />
          <Skeleton className="h-[500px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !joven) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Card className="p-12 glass shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <X className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-slate-500 mb-8">{error ? 'No se pudo cargar la información.' : 'El joven no existe.'}</p>
          <Button onClick={() => router.back()} className="w-full h-12 rounded-xl bg-slate-900">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver atrás
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Navigation & Actions */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div>
              <motion.h1
                variants={itemVariants}
                className="text-3xl font-extrabold tracking-tight"
              >
                Editar <span className="text-gradient">Perfil</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-slate-500 flex items-center gap-2 text-sm mt-1"
              >
                Actualizando información de <span className="font-semibold text-slate-900">{joven.nombre_completo}</span>
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/jovenes/${joven_id}`)}
              disabled={isSaving}
              className="rounded-xl border-slate-200 hover:bg-slate-50 h-11"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 h-11 px-6 min-w-[140px]"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isSaving ? 'Guardando...' : 'Guardar Perfil'}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-8">
            {/* Form Section: Personal Info */}
            <motion.div variants={itemVariants}>
              <Card className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <User className="w-32 h-32" />
                </div>

                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-blue-50 rounded-2xl">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Datos Personales</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Nombre Completo</Label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="nombre_completo"
                        value={formData.nombre_completo}
                        onChange={handleInputChange}
                        className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                        placeholder="Ej: Juan Pérez Martínez"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Documento (Cédula)</Label>
                    <div className="relative group">
                      <IdCard className="absolute left-3.5 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleInputChange}
                        className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-medium"
                        placeholder="1.123.456.789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Fecha de Nacimiento</Label>
                    <div className="relative group">
                      <Calendar className="absolute left-3.5 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="fecha_nacimiento"
                        type="date"
                        value={formData.fecha_nacimiento}
                        onChange={handleInputChange}
                        className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Número de Celular</Label>
                    <div className="relative group">
                      <Phone className="absolute left-3.5 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-medium"
                        placeholder="310 123 4567"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Spiritual Status Section */}
            <motion.div variants={itemVariants}>
              <Card className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-amber-50 rounded-2xl">
                    <Activity className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold">Estado Espiritual</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'bautizado', label: 'Bautizado', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50', desc: 'Reg. oficial de bautismo' },
                    { id: 'sellado', label: 'Sellado', icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-50', desc: 'Promesa del Espíritu Santo' },
                    { id: 'servidor', label: 'Servidor', icon: Briefcase, color: 'text-emerald-600', bgColor: 'bg-emerald-50', desc: 'Activo en algún ministerio' },
                    { id: 'simpatizante', label: 'Simpatizante', icon: Heart, color: 'text-rose-500', bgColor: 'bg-rose-50', desc: 'Asiste a las reuniones' },
                  ].map((field) => (
                    <motion.div
                      key={field.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center p-5 rounded-2xl bg-white/60 border border-slate-100 cursor-pointer transition-all hover:shadow-md",
                        formData[field.id as keyof typeof formData] && "bg-white border-blue-100 shadow-sm"
                      )}
                      onClick={() => handleCheckboxChange(field.id, !formData[field.id as keyof typeof formData])}
                    >
                      <div className="flex-1 flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", field.bgColor)}>
                          <field.icon className={cn("w-6 h-6", field.color)} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{field.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{field.desc}</p>
                        </div>
                      </div>
                      <Checkbox
                        id={field.id}
                        checked={formData[field.id as keyof typeof formData] as boolean}
                        className="w-6 h-6 rounded-full data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        onCheckedChange={(checked) => handleCheckboxChange(field.id, checked as boolean)}
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="glass-card p-8 bg-gradient-to-br from-indigo-50/50 to-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-indigo-100 rounded-2xl">
                    <Church className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold">Asignación</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                      Grupo Ministerial <span className="text-[10px] text-slate-400 font-normal">(Seleccionar grupo actual)</span>
                    </Label>
                    <Select
                      value={formData.grupo_id}
                      onValueChange={(value) => handleSelectChange('grupo_id', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-white border-slate-200 focus:ring-blue-100 font-medium">
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-xl border-slate-100 p-1">
                        <SelectItem value="none" className="rounded-lg py-2.5">
                          <div className="flex items-center gap-2 text-slate-500 italic">
                            <span>Sin asignar</span>
                          </div>
                        </SelectItem>
                        {grupos?.map((grupo) => (
                          <SelectItem key={grupo.id} value={grupo.id} className="rounded-lg py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              {grupo.nombre}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Ayuda rápida</p>
                    </div>
                    <ul className="space-y-3">
                      {[
                        { text: 'Completa todos los datos personales básicos.', icon: User },
                        { text: 'Actualiza el estado espiritual anualmente.', icon: Activity },
                        { text: 'Asegura que el número de celular sea correcto.', icon: Phone },
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                          <item.icon className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Visual preview of the user profile card */}
            <motion.div variants={itemVariants}>
              <div className="p-8 rounded-3xl bg-blue-600 relative overflow-hidden text-white shadow-xl shadow-blue-100">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <Church className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-blue-100 truncate">Vista previa</p>
                    <h4 className="text-xl font-bold truncate">{formData.nombre_completo || 'Nombre Apellido'}</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <p className="text-[10px] text-blue-100 uppercase font-bold tracking-tighter">Estado</p>
                    <p className="text-sm font-bold truncate">{formData.bautizado ? 'Bautizado' : 'En proceso'}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <p className="text-[10px] text-blue-100 uppercase font-bold tracking-tighter">Celular</p>
                    <p className="text-sm font-bold truncate">...{formData.celular?.slice(-4) || '----'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}