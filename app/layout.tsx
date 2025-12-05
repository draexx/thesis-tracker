import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Thesis Track & Compare - Gestión de Tesis de Posgrado",
    template: "%s | TTC",
  },
  description: "Sistema de gestión y seguimiento de tesis de posgrado. Monitorea tu progreso, compárate con tus pares y mantén comunicación con tu asesor.",
  keywords: ["tesis", "posgrado", "seguimiento", "gestión académica", "maestría", "doctorado"],
  authors: [{ name: "TTC Team" }],
  creator: "TTC",
  publisher: "TTC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://your-domain.com",
    title: "Thesis Track & Compare",
    description: "Sistema de gestión y seguimiento de tesis de posgrado",
    siteName: "Thesis Track & Compare",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thesis Track & Compare",
    description: "Sistema de gestión y seguimiento de tesis de posgrado",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { ThemeProvider } from "@/lib/context/ThemeContext"

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
