"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#00338D] via-[#0066B3] to-[#009FDA] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              🏴 Conquistadores
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed font-medium">
              Sistema de Gestión de Jóvenes Pentecostales
            </p>
            <p className="text-lg text-[#F5A623] mt-2 font-semibold">
              Gestiona, organiza y acompaña el crecimiento espiritual de tu congregación
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center animate-bounce">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto bg-[#F5A623] hover:bg-[#e6951a] text-[#1A1A1A] font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white bg-transparent hover:bg-white hover:text-[#1A1A1A] font-bold px-8 py-3 rounded-full transition-all duration-300">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#F5A623]">📊 Gestión Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white">
                Administra perfiles, grupos y actividades de manera eficiente y organizada.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#F5A623]">📅 Seguimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white">
                Monitorea el progreso espiritual y cumpleaños de tus jóvenes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#F5A623]">📈 Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white">
                Genera informes detallados para tomar mejores decisiones pastorales.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

      </div>

    </main>
  );
}
