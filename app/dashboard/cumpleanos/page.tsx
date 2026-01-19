'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Send } from 'lucide-react';

// Mock data - reemplazar con hooks reales
const mockCumpleanos = {
  hoy: [
    { id: '1', nombre: 'Juan Pérez', edad: 18, celular: '3001234567' },
    { id: '2', nombre: 'María García', edad: 16, celular: '3019876543' },
  ],
  semana: [
    { dia: 'Mañana', fecha: '2024-01-20', jovenes: [
      { id: '3', nombre: 'Carlos Rodríguez', edad: 17, celular: '3024567890' }
    ]},
    { dia: 'Pasado mañana', fecha: '2024-01-21', jovenes: [
      { id: '4', nombre: 'Ana López', edad: 15, celular: '3035678901' }
    ]},
  ],
  mes: { total: 12, enviados: 8 },
  proximos30: [
    { id: '5', nombre: 'Pedro Sánchez', fecha: '2024-01-25', dias: 5 },
    { id: '6', nombre: 'Laura Martínez', fecha: '2024-01-28', dias: 8 },
  ]
};

export default function CumpleanosPage() {
  const [activeTab, setActiveTab] = useState<'hoy' | 'semana' | 'mes' | '30dias'>('hoy');

  const tabs = [
    { id: 'hoy', label: 'Hoy', count: mockCumpleanos.hoy.length },
    { id: 'semana', label: 'Esta Semana', count: mockCumpleanos.semana.reduce((acc, dia) => acc + dia.jovenes.length, 0) },
    { id: 'mes', label: 'Este Mes', count: mockCumpleanos.mes.total },
    { id: '30dias', label: 'Próximos 30 días', count: mockCumpleanos.proximos30.length },
  ];

  const handleEnviarFelicitacion = (joven: any) => {
    // TODO: Implementar envío de felicitación
    console.log('Enviar felicitación a:', joven);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cumpleaños</h1>
          <p className="text-slate-500 mt-1">Gestionar felicitaciones de cumpleaños</p>
        </div>
        <Button>
          <Gift size={16} className="mr-2" />
          Gestionar Plantillas
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <Badge variant="secondary" className="ml-2">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'hoy' && (
          <div className="grid gap-4">
            {mockCumpleanos.hoy.length === 0 ? (
              <Card className="p-8 text-center text-slate-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay cumpleaños hoy</p>
              </Card>
            ) : (
              mockCumpleanos.hoy.map((joven) => (
                <Card key={joven.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {joven.nombre.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{joven.nombre}</h3>
                        <p className="text-slate-500">Cumple {joven.edad} años hoy</p>
                        <p className="text-sm text-slate-400">{joven.celular}</p>
                      </div>
                    </div>
                    <Button onClick={() => handleEnviarFelicitacion(joven)}>
                      <Send size={16} className="mr-2" />
                      Enviar Felicitación
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'semana' && (
          <div className="space-y-4">
            {mockCumpleanos.semana.map((dia) => (
              <Card key={dia.fecha} className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">{dia.dia} - {dia.fecha}</h3>
                <div className="space-y-3">
                  {dia.jovenes.map((joven) => (
                    <div key={joven.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{joven.nombre}</p>
                        <p className="text-sm text-slate-500">Cumple {joven.edad} años</p>
                      </div>
                      <Button size="sm" onClick={() => handleEnviarFelicitacion(joven)}>
                        <Send size={14} className="mr-1" />
                        Enviar
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'mes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {mockCumpleanos.mes.total}
                </div>
                <p className="text-slate-600">Total cumpleaños este mes</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {mockCumpleanos.mes.enviados}
                </div>
                <p className="text-slate-600">Felicitaciones enviadas</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {mockCumpleanos.mes.total - mockCumpleanos.mes.enviados}
                </div>
                <p className="text-slate-600">Pendientes</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === '30dias' && (
          <Card className="overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="font-semibold text-slate-900">Próximos cumpleaños</h3>
            </div>
            <div className="divide-y">
              {mockCumpleanos.proximos30.map((joven) => (
                <div key={joven.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{joven.nombre}</p>
                    <p className="text-sm text-slate-500">{joven.fecha} ({joven.dias} días)</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Send size={14} className="mr-1" />
                    Programar
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}