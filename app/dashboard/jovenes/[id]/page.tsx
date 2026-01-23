'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useJovenes } from '@/hooks/useJovenes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Save, X, User, Calendar, Phone, CheckCircle2, Award, Shield, Sparkles, Fingerprint, Info } from 'lucide-react';
import Link from 'next/link';

export default function JovenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const joven_id = params.id as string;
  const { useGetJoven, updateJoven } = useJovenes();
  const { data: joven, isLoading, error } = useGetJoven(joven_id);
  const [formData, setFormData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (joven) {
      setFormData(joven);
    }
  }, [joven]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [field]: checked }));
  };

  const handleSave = async () => {
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
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar registro');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="space-y-10 pb-12">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-40 rounded-lg" />
          </div>
        </div>
        <Card className="p-10 rounded-[3rem] border-slate-100 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      {/* Header Premium Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/jovenes">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200 bg-white shadow-sm hover:border-[#00338D] hover:text-[#00338D] transition-all">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
              DETALLE DEL <span className="text-[#00338D] ml-2">MIEMBRO</span>
              <Shield className="ml-3 w-6 h-6 text-[#F5A623]" />
            </h1>
            <p className="text-slate-500 font-medium font-prose uppercase tracking-widest text-[10px] opacity-70">
              Expediente Ministerial Individual - Unánimes
            </p>
          </div>
        </div>

        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="h-12 px-8 rounded-2xl bg-[#00338D] hover:bg-[#00338D]/90 text-white font-bold shadow-lg shadow-[#00338D]/20 transition-all flex items-center gap-2"
          >
            <Edit size={16} />
            EDITAR PERFIL
          </Button>
        )}
      </div>

      {/* Profile Main Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10 border-slate-100 shadow-2xl rounded-[3rem] bg-white relative overflow-hidden ring-1 ring-slate-100/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00338D]/[0.02] rounded-bl-full -mr-20 -mt-20" />

            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#00338D] to-[#0066B3] flex items-center justify-center font-black text-white text-4xl shadow-xl shadow-[#00338D]/20">
                  {formData.nombre_completo.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{formData.nombre_completo}</h2>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">ID: {formData.cedula}</span>
                    <span className="text-[10px] font-black text-[#F5A623] uppercase tracking-widest bg-[#F5A623]/10 px-3 py-1 rounded-full">{formData.edad || '—'} AÑOS DE EDAD</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <DataField label="Nombre Completo" icon={User}>
                  <Input
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white font-bold ${!isEditing ? 'opacity-100' : ''}`}
                  />
                </DataField>
                <DataField label="Número de Cédula" icon={Fingerprint}>
                  <Input disabled value={formData.cedula} className="h-14 rounded-2xl border-slate-200 bg-slate-100 font-bold opacity-100" />
                </DataField>
                <DataField label="Contacto Celular" icon={Phone}>
                  <Input
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white font-bold`}
                  />
                </DataField>
                <DataField label="Nacimiento" icon={Calendar}>
                  <Input type="date" value={formData.fecha_nacimiento?.split('T')[0] || ''} disabled className="h-14 rounded-2xl border-slate-200 bg-slate-100 font-bold opacity-100" />
                </DataField>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-end pt-8 border-t border-slate-100"
                >
                  <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData(joven); }} className="h-12 rounded-xl font-bold px-6">CANCELAR</Button>
                  <Button onClick={handleSave} disabled={isSaving} className="h-12 px-8 rounded-xl bg-[#00338D] text-white font-bold shadow-lg">
                    {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                  </Button>
                </motion.div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Status & Achievement */}
        <div className="space-y-8">
          <Card className="p-8 border-slate-100 shadow-xl rounded-[2.5rem] bg-white h-full">
            <div className="flex items-center gap-3 mb-8">
              <Award className="text-[#F5A623]" size={22} />
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest text-[11px]">Estado Ministerial</h3>
            </div>

            <div className="space-y-4">
              <StatusToggle
                id="bautizado"
                label="Bautizado"
                checked={formData.bautizado}
                onChange={(v) => handleCheckboxChange('bautizado', v)}
                disabled={!isEditing}
                color="#00338D"
              />
              <StatusToggle
                id="sellado"
                label="Sellado"
                checked={formData.sellado}
                onChange={(v) => handleCheckboxChange('sellado', v)}
                disabled={!isEditing}
                color="#F5A623"
              />
              <StatusToggle
                id="servidor"
                label="Servidor"
                checked={formData.servidor}
                onChange={(v) => handleCheckboxChange('servidor', v)}
                disabled={!isEditing}
                color="#0066B3"
              />
              <StatusToggle
                id="simpatizante"
                label="Simpatizante"
                checked={formData.simpatizante}
                onChange={(v) => handleCheckboxChange('simpatizante', v)}
                disabled={!isEditing}
                color="#1A1A1A"
              />
            </div>

            <div className="mt-10 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-start gap-4">
              <Info size={16} className="text-[#00338D] mt-1" />
              <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">
                Cualquier modificación en los estatus marcará un registro en los logs de auditoría administrativa.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function DataField({ label, icon: Icon, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
        <Icon size={12} className="text-[#00338D]" />
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusToggle({ id, label, checked, onChange, disabled, color }: { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; disabled: boolean; color: string }) {
  return (
    <motion.div
      whileHover={!disabled ? { x: 5 } : {}}
      className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${checked ? 'border-slate-100 bg-white shadow-sm' : 'border-slate-50 bg-slate-50/50'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${checked ? 'text-white' : 'text-slate-300'}`} style={{ backgroundColor: checked ? color : 'transparent', border: !checked ? '2px dashed #e2e8f0' : 'none' }}>
          <CheckCircle2 size={18} />
        </div>
        <label htmlFor={id} className={`text-xs font-black uppercase tracking-widest cursor-pointer ${checked ? 'text-slate-800' : 'text-slate-400'}`}>
          {label}
        </label>
      </div>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v as boolean)}
        disabled={disabled}
        className={`h-5 w-5 rounded-lg ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
      />
    </motion.div>
  );
}
