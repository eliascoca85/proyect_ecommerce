"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaFire, FaClock, FaArrowRight } from 'react-icons/fa';

const BannerUno = ({ promotion }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Datos de ejemplo para la promoción (pueden ser reemplazados por props)
  const {
    title = "MEGA OFERTA GAMING",
    subtitle = "HP OMEN 30L",
    description = "Potencia extrema con RTX 4070 y procesador Intel i9",
    discount = 20,
    endDate = "2025-04-30",
    originalPrice = 1999.99,
    currentPrice = 1599.99,
    backgroundImage = "/img/fondo-dota2.jpg",
    productImage = "/img/omenmax.png",
    link = "/promociones/omen-30l"
  } = promotion || {};

  // Cálculo del tiempo restante (simulado)
  const daysLeft = 3;
  const hoursLeft = 19;

  return (
    <div 
      className="relative w-full h-[400px] md:h-[300px] lg:h-[400px] rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo del banner con gradiente oscuro */}
      <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900">
        {/* Imagen de fondo con opacidad reducida */}
        <div className="absolute inset-0 opacity-95 mix-blend-overlay">
          <Image
            src={backgroundImage}
            alt="Banner background"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Overlay de degradado */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        
        {/* Efecto de patrón geométrico */}
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'url("/img/grid-pattern.png")', 
            backgroundSize: '100px'
          }}>
        </div>
      </div>

      {/* Contenido del banner */}
      <div className="relative flex flex-col md:flex-row h-full z-10">
        {/* Lado izquierdo: Contenido de texto */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
          {/* Badge de descuento */}
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold py-1 px-3 rounded-lg flex items-center gap-1 shadow-lg">
              <FaFire className="text-yellow-300" />
              <span>-{discount}% DESCUENTO</span>
            </div>
            
            {/* Tiempo restante */}
            <div className="bg-black/50 backdrop-blur-sm text-white text-xs py-1 px-3 rounded-lg flex items-center gap-1">
              <FaClock className="text-red-500" />
              <span className='text-base'>Quedan: {daysLeft}d {hoursLeft}h</span>
            </div>
          </div>
          
          {/* Título y descripción */}
          <div className="mt-4 md:mt-0">
            <div className="mb-1">
              <span className="text-red-500 text-sm font-medium tracking-wider">{title}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              {subtitle}
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-md mb-4">
              {description}
            </p>
            
            {/* Precios */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gray-400 line-through">${originalPrice}</span>
              <span className="text-2xl md:text-3xl font-bold text-white">${currentPrice}</span>
            </div>
            
            {/* Botón CTA */}
            <button 
              className={`group flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 md:py-3 px-5 md:px-6 rounded-lg transition-all duration-300 ${
                isHovered ? 'shadow-lg shadow-red-600/30' : ''
              }`}
            >
              Ver oferta
              <FaArrowRight className={`transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Lado derecho: Imagen del producto */}
        <div className="relative flex-1 hidden md:flex items-center justify-center">
          <div className={`relative h-[250px] lg:h-[350px] w-full transition-all duration-500 ${
            isHovered ? 'scale-105 transform -rotate-2' : 'scale-100'
          }`}>
            <Image 
              src={productImage} 
              alt={subtitle}
              fill
              className="object-contain drop-shadow-[0_10px_15px_rgba(255,0,0,0.3)]"
            />
          </div>
          
          {/* Efecto de resplandor en la imagen */}
          <div className={`absolute -inset-2 bg-red-500/10 blur-3xl rounded-full transition-opacity duration-300 ${
            isHovered ? 'opacity-60' : 'opacity-30'
          }`}></div>
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
      
      {/* Borde lateral decorativo */}
      <div className="absolute top-0 bottom-0 left-0 w-1 md:w-2 bg-gradient-to-b from-red-500 via-red-600 to-transparent"></div>
    </div>
  );
};

export default BannerUno;