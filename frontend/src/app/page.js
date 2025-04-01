"use client";

import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

// Importación de componentes
import HeroSection from '@/components/HeroSection/HeroSection';
import MarcasSection from '@/components/MarcasSection/MarcasSection';
import ProductSection from '@/components/ProductSection/ProductSection';
import BannerUno from '@/components/Banners/BannerUno';
import BannerDos from '@/components/Banners/BannerDos';

import CarritoModal from '@/components/CarritoModal/CarritoModal';

const HomePage = () => {
  // Estado para controlar la apertura del modal del carrito
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  
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
      
      
      {/* Botón flotante del carrito */}
      <button 
        onClick={() => setIsCartModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/30 flex items-center justify-center transition-transform hover:scale-110 group"
        aria-label="Abrir carrito"
      >
        <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-500">
          3
        </span>
        <FaShoppingCart size={20} />
        
        {/* Tooltip */}
        <div className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          Ver carrito
        </div>
      </button>
      
      {/* Modal del carrito */}
      <CarritoModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
      />
    </div>
  );
};

export default HomePage;