"use client";

import React from 'react';
import Image from 'next/image';
import { FaHandshake, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MarcasSection = () => {
  // Datos de ejemplo para las marcas
  const marcas = [
    {
      id: '1',
      name: 'Asus',
      logo: '/logos/asus.png',
      url: 'https://www.asus.com'
    },
    {
      id: '2',
      name: 'MSI',
      logo: '/logos/msi.png',
      url: 'https://www.msi.com'
    },
    {
      id: '3',
      name: 'Lenovo',
      logo: '/logos/lenovo.png',
      url: 'https://www.lenovo.com'
    },
    {
      id: '4',
      name: 'Acer',
      logo: '/logos/acer.png',
      url: 'https://www.acer.com'
    },
    {
      id: '5',
      name: 'HP',
      logo: '/logos/hp.png',
      url: 'https://www.hp.com'
    },
    {
        id: '6',
        name: 'HP',
        logo: '/logos/dell.png',
        url: 'https://www.hp.com'
      }
  ];

  return (
    <section id='MarcasSection' className="w-full py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Encabezado de la sección */}
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <FaHandshake className="text-red-500 text-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold font-designer text-white">
              <span className="text-red-500">Nuestras</span> marcas
            </h2>
          </div>
          
         
        </div>

        {/* Línea separadora con gradiente */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mb-10"></div>

        {/* Descripción opcional */}
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10">
          Trabajamos con las mejores marcas del mercado para ofrecerte productos de calidad superior con garantía oficial.
        </p>

        {/* Grid de marcas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {marcas.map((marca) => (
            <div 
              key={marca.id}
              className="group relative flex items-center justify-center p-6 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-red-500/30 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
            >
              <a 
                href={marca.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-full h-20 flex items-center justify-center"
              >
                <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={marca.logo}
                    alt={`${marca.name} logo`}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-opacity duration-300 filter grayscale hover:grayscale-0 opacity-80 group-hover:opacity-100"
                  />
                </div>
              </a>
              
              {/* Resplandor rojo al fondo cuando se hace hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-15 bg-red-500 blur-xl transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

      
      </div>
    </section>
  );
};

export default MarcasSection;