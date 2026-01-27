import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../lib/globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conquistadores - Sistema de Gestión de Jóvenes Pentecostales",
  description: "Plataforma completa para gestionar, organizar y acompañar el crecimiento espiritual de jóvenes en congregaciones pentecostales. Gestiona perfiles, grupos, actividades y reportes de manera eficiente.",
  keywords: ["conquistadores", "jóvenes pentecostales", "gestión iglesia", "sistema jóvenes", "congregación"],
  authors: [{ name: "Equipo Conquistadores" }],
  openGraph: {
    title: "Conquistadores - Gestión de Jóvenes Pentecostales",
    description: "Sistema integral para el acompañamiento espiritual de jóvenes en iglesias pentecostales.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conquistadores",
    description: "Sistema de Gestión de Jóvenes Pentecostales",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
