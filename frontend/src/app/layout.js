"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/tailwind.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { usePathname } from "next/navigation";
import CarritoProviderWrapper from '../components/Providers/CarritoProviderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideHeaderOn = ["/carrito", "/login", "/register", "/dashboard", "/checkout"]; // Puedes agregar más rutas si quieres ocultarlo en otras
  const shouldHideHeader = hideHeaderOn.includes(pathname);

  const hideFooterOn = ["/carrito", "/login", "/register", "/dashboard", "/checkout"]; // Puedes agregar más rutas si quieres ocultarlo en otras
  const shouldHideFooter = hideFooterOn.includes(pathname);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CarritoProviderWrapper>
          {/* Muestra el Header solo si NO es /carrito */}
          {!shouldHideHeader && <Header />}

          <main>{children}</main>

          {!shouldHideFooter && <Footer />}
        </CarritoProviderWrapper>
      </body>
    </html>
  );
}
