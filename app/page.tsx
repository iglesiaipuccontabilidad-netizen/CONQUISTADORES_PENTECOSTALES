"use client";

import Link from "next/link";
import { motion, easeInOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, BarChart3, ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeInOut,
    },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] relative overflow-hidden font-sans">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-[#00338D] blur-[100px] rounded-full opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-[#009FDA] blur-[120px] rounded-full opacity-20"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-6 max-w-3xl"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#F5A623] text-xs font-medium mb-2">
            <span className="relative flex h-1.5 w-1.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5A623] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F5A623]"></span>
            </span>
            Gestión Unánimes 2025-2027
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9]"
          >
            CONQUISTA<span className="text-[#F5A623]">DORES</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto leading-relaxed font-light"
          >
            Sistema integral para la organización, seguimiento y crecimiento espiritual de la juventud pentecostal.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 pt-4 justify-center"
          >
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#1A1A1A] font-bold px-8 py-6 rounded-xl text-base shadow-[0_0_20px_rgba(245,166,35,0.2)] transition-all duration-300 group">
                Acceder al Portal
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 font-bold px-8 py-6 rounded-xl text-base transition-all duration-300">
                Registrar Joven
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-[#F5A623]" />}
            title="Gestión Segura"
            description="Administración centralizada y segura de la información de cada joven de la congregación."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-[#009FDA]" />}
            title="Comunidad Activa"
            description="Organiza grupos, actividades y mantén un seguimiento cercano del progreso espiritual."
          />
          <FeatureCard
            icon={<BarChart3 className="w-10 h-10 text-[#0066B3]" />}
            title="Análisis y Reportes"
            description="Visualiza el impacto del trabajo ministerial a través de datos y estadísticas precisas."
          />
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20 pt-8 border-t border-white/10 w-full text-center"
        >
          <p className="text-slate-500 text-sm">
            © 2025 IPUC Unánimes - Desarrollado para la gloria de Dios
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500"
    >
      <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>

      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-5 h-5 text-white/20" />
      </div>
    </motion.div>
  );
}
