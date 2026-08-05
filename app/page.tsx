"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

const WORDMARK_LINE_2 = "PENTECOSTALES";

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
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-[100vh] md:min-h-screen bg-[#1A1A1A] relative overflow-hidden font-sans flex flex-col">
      {/* Animated Background Elements - visible on mobile below the contained photo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={reduceMotion ? undefined : {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-[#00338D] blur-[100px] rounded-full opacity-30"
        />
        <motion.div
          animate={reduceMotion ? undefined : {
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

      {/* Directional scrims: contrast only where text sits, so the faces in the
          middle of the photo stay legible instead of being flattened by a global veil. */}
      <div className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] sm:h-[55%] bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

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
      <div className="relative z-10 px-4 sm:px-8 pb-5 sm:pb-6 md:pb-8 w-full">
        {/* Wordmark lockup: line 2 distributes its letters to match the measured
            width of line 1, so both words read as one block at any viewport. */}
        <motion.h1
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          aria-label="Conquistadores Pentecostales"
          className="w-fit text-[clamp(1.75rem,8.5vw,9rem)] font-black tracking-tighter leading-[0.85] uppercase [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]"
        >
          <span aria-hidden="true" className="block text-white">
            CONQUISTADORES
          </span>
          <span aria-hidden="true" className="flex justify-between text-[#F5A623]">
            {WORDMARK_LINE_2.split("").map((letter, index) => (
              <span key={`${letter}-${index}`}>{letter}</span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-3 sm:mt-4 max-w-sm sm:max-w-md text-sm sm:text-base text-white/80 leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]"
        >
          Registro y acompañamiento de la juventud de la congregación.
        </motion.p>

        {/* Footer info - Responsive spacing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-white/10 w-full text-center"
        >
          <p className="text-white/40 text-[11px] sm:text-sm">
            © 2026 IPUC Unánimes - Desarrollado para la gloria de Dios
          </p>
        </motion.div>
      </div>
    </main>
  );
}

