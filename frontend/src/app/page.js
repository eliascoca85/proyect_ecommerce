"use client";

import React from 'react';

// Importación de componentes
import HeroSection from '@/components/HeroSection/HeroSection';
import MarcasSection from '@/components/MarcasSection/MarcasSection';
import ProductSection from '@/components/ProductSection/ProductSection';
import BannerUno from '@/components/Banners/BannerUno';
import BannerDos from '@/components/Banners/BannerDos';

const HomePage = () => {
  // Datos de ejemplo para los banners (podrían venir de una API)
  const ofertaEspecial = {
    title: "MEGA OFERTA GAMING",
    subtitle: "HP OMEN 30L",
    description: "Potencia extrema con RTX 4070 y procesador Intel i9",
    discount: 20,
    endDate: "2025-04-30",
    originalPrice: 1999.99,
    currentPrice: 1599.99,
    backgroundImage: "/img/fondo-dota2.jpg",
    productImage: "/img/omenmax.png",
    link: "/promociones/omen-30l"
  };
  
  const coleccionGpu = {
    title: "COLECCIÓN GAMING",
    subtitle: "RTX 4080 SERIES",
    description: "Descubre nuestra nueva colección de tarjetas gráficas con tecnología de última generación",
    features: [
      "Ray-Tracing en tiempo real",
      "DLSS 3.0 Ultra",
      "24GB GDDR6X"
    ],
    tagline: "EDICIÓN LIMITADA",
    backgroundImage: "/img/dota2-bg.jpg",
    productImage: "/img/omenmax.png",
    link: "/coleccion/rtx-4080"
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Componentes principales de la página */}
      <HeroSection />
      <MarcasSection />
      <BannerDos offer={coleccionGpu} />
      <ProductSection />
      <BannerUno promotion={ofertaEspecial} />
      
    </div>
  );
};

export default HomePage;