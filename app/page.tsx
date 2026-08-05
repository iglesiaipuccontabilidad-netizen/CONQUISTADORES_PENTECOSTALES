"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    },
  },
};

export default function Home() {
  return (
    <main className="min-h-[100vh] md:min-h-screen bg-[#1A1A1A] relative overflow-hidden font-sans flex flex-col">
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

      {/* Hero Background Image - Responsive positioning */}
      <div
        className="absolute inset-0 bg-no-repeat md:bg-cover md:bg-center bg-contain bg-top"
        style={{
          backgroundImage: "url('/ComiteCP2026.webp')",
        }}
      />

      {/* Dark Overlay - Adjusted for mobile visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 md:via-black/50 to-black/70" />

      {/* Top Navigation Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 w-full">
        {/* Badge - Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#F5A623] text-[10px] sm:text-xs font-medium"
        >
          <span className="relative flex h-1.5 w-1.5 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5A623] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F5A623]"></span>
          </span>
          Gestión Unánimes 2026
        </motion.div>

        {/* Buttons - Right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href="/login">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 rounded-xl text-sm transition-all duration-300 active:scale-95">
              ACCEDER AL PORTAL
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="sm" className="bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#1A1A1A] font-black px-6 rounded-xl text-sm shadow-[0_20px_40px_-10px_rgba(245,166,35,0.3)] transition-all duration-300 active:scale-95">
              REGISTRAR JOVEN
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Center Spacer - Responsive height */}
      <div className="relative z-10 flex-1 min-h-[3rem] md:flex-1" />

      {/* Title at Bottom - Responsive padding and spacing */}
      <div className="relative z-10 px-4 sm:px-8 pb-8 sm:pb-16 md:pb-20 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[clamp(2rem,9vw,9rem)] font-black text-white tracking-tighter leading-[0.85] uppercase"
        >
          CONQUISTA<span className="text-[#F5A623]">DORES</span>
        </motion.h1>

        {/* Features Section - Responsive grid and spacing */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 sm:mt-20 md:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
        >
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-white" />}
            title="Gestión Segura"
            description="Administración centralizada y segura de la información de cada joven de la congregación."
            gradient="from-[#00338D] to-[#0066B3]"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-white" />}
            title="Comunidad Activa"
            description="Organiza grupos, actividades y mantén un seguimiento cercano del progreso espiritual."
            gradient="from-[#009FDA] to-[#0066B3]"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-white" />}
            title="Análisis y Reportes"
            description="Visualiza el impacto del trabajo ministerial a través de datos y estadísticas precisas."
            gradient="from-[#0066B3] to-[#F5A623]"
          />
        </motion.div>

        {/* Footer info - Responsive spacing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-white/10 w-full text-center"
        >
          <p className="text-slate-500 text-[11px] sm:text-sm">
            © 2026 IPUC Unánimes - Desarrollado para la gloria de Dios
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode, title: string, description: string, gradient: string }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br ${gradient} hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-fit shadow-xl shadow-black/20 cursor-pointer`}
    >
      {/* Diagonal accent line */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />

      {/* Icon container with subtle background */}
      <div className="relative z-10 mb-4 sm:mb-6 inline-flex p-3 sm:p-4 rounded-2xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2 sm:mb-3 tracking-tight line-clamp-2">{title}</h3>
        <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed line-clamp-3">{description}</p>
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 z-10">
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
      </div>
    </motion.div>
  );
}

