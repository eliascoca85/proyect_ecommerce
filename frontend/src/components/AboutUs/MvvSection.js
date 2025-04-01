"use client";

import React from 'react';
import { FaBullseye, FaEye, FaHandsHelping } from 'react-icons/fa';
import './MvvSection.css'; // Importar el archivo CSS para las animaciones

const MvvSection = () => {
  return (
    <section id='mvvsection' className="py-12 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-white md:text-4xl font-bold font-designer">Nuestra Misión, Visión y Valores</h2>
        </div>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
              <div className="text-center mb-4">
                <img src="/img/arrow.gif" alt="Misión" className="w-16 h-16 mx-auto animate-mission" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Misión</h3>
              <p className="text-gray-700">
                Nuestra misión es proporcionar servicios de alta calidad que ayuden a nuestros clientes a alcanzar sus objetivos.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
              <div className="text-center mb-4">
              <img src="/img/eye.gif" alt="Misión" className="w-16 h-16 mx-auto animate-mission" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Visión</h3>
              <p className="text-gray-700">
                Nuestra visión es ser líderes en el mercado, reconocidos por nuestra innovación y excelencia en el servicio.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
              <div className="text-center mb-4">
              <img src="/img/hands.gif" alt="Misión" className="w-16 h-16 mx-auto animate-mission" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Valores</h3>
              <p className="text-gray-700">
             
                Nuestros valores incluyen integridad, compromiso y trabajo en equipo, los cuales guían todas nuestras acciones.
              </p>
            </div>
          </div>
          
        </div>
      </div>
      
    </section>
  );
};

export default MvvSection;
