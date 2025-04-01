"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaGift, FaStar, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { IoFlashSharp } from 'react-icons/io5';

const BannerDos = ({ offer }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Datos de ejemplo para la oferta (pueden ser reemplazados por props)
  const {
    title = "COLECCIÓN GAMING",
    subtitle = "RTX 4080 SERIES",
    description = "Descubre nuestra nueva colección de tarjetas gráficas con tecnología de última generación",
    features = [
      "Ray-Tracing en tiempo real",
      "DLSS 3.0 Ultra",
      "24GB GDDR6X"
    ],
    tagline = "EDICIÓN LIMITADA",
    backgroundImage = "/img/dota2-bg.jpg",
    productImage = "/img/omenmax.png",
    link = "/coleccion/rtx-4080"
  } = offer || {};

  return (
    <div 
      className="relative w-full h-[500px] md:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Imagen de fondo con degradado */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src={backgroundImage}
            alt="Banner background"
            fill
            className="object-cover"
          />
        </div>

        {/* Efecto de partículas/luces */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 bg-gradient-to-l from-red-500/30 to-transparent"></div>
        
        {/* Líneas decorativas angulares */}
        <div className="absolute top-0 right-0 bottom-0 left-0 opacity-10" 
          style={{ 
            backgroundImage: `
              linear-gradient(135deg, transparent 0%, transparent 49%, rgba(255,0,0,0.2) 50%, transparent 51%, transparent 100%),
              linear-gradient(45deg, transparent 0%, transparent 49%, rgba(255,0,0,0.1) 50%, transparent 51%, transparent 100%)
            `, 
            backgroundSize: '40px 40px' 
          }}>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative h-full flex flex-col md:flex-row z-10">
        {/* Lado izquierdo: Imagen del producto */}
        <div className="relative md:w-2/5 h-[200px] md:h-auto p-6 flex items-center justify-center">
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-red-500/5 to-transparent z-0"></div>
          
          <div className={`relative w-4/5 h-4/5 flex items-center justify-center transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}>
            <Image 
              src={productImage} 
              alt={subtitle}
              fill
              style={{ objectFit: 'contain' }}
              className="drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] z-10"
            />
            
            {/* Efecto de resplandor */}
            <div className={`absolute inset-0 bg-red-500/20 blur-3xl rounded-full transition-opacity duration-300 ${
              isHovered ? 'opacity-70' : 'opacity-30'
            }`}></div>
          </div>

          {/* Badge promocional en esquina */}
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center">
            <IoFlashSharp className="mr-1" />
            {tagline}
          </div>
        </div>
        
        {/* Lado derecho: Contenido de texto */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center gap-6 border-l border-red-500/20">
          {/* Encabezado y título */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-1 bg-red-500"></div>
              <span className="text-red-500 text-sm font-medium uppercase tracking-wider">{title}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {subtitle}
            </h2>
            
            <p className="text-gray-300 text-sm md:text-base max-w-lg mb-4">
              {description}
            </p>
          </div>
          
          {/* Características destacadas */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FaStar className="text-red-500 text-xs" />
                </div>
                <span className="text-white text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <button 
              className={`group flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg w-full sm:w-auto transition-all duration-300 ${
                isHovered ? 'shadow-lg shadow-red-600/30' : ''
              }`}
            >
              <span>Ver detalles</span>
              <FaArrowRight className={`transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`} />
            </button>
            
            <button className="flex items-center gap-2 bg-transparent border border-red-500/30 hover:border-red-500/70 text-red-500 font-semibold py-3 px-6 rounded-lg w-full sm:w-auto transition-all duration-300">
              <FaGift className="text-red-500" />
              <span>Agregar a favoritos</span>
            </button>
          </div>
          
          
        </div>
      </div>
      
      {/* Elementos decorativos laterales */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/70 to-transparent"></div>
      <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-red-500/70 to-transparent"></div>
    </div>
  );
};

export default BannerDos;