"use client";

import React, { useEffect, useRef } from 'react';
import { ReactTyped } from "react-typed";
import ParticlesBackground from '../ParticlesBg/ParticlesBackground';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SpotLight } from '@react-three/drei';
import AnimaLaptop from '../Animations/AnimaLaptop';
import './HeroSection.css'; // Importa tu CSS personalizado

const HeroSection = () => {
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.style.transform = 'translateY(-100px)';
      modelRef.current.style.opacity = '0';
      setTimeout(() => {
        modelRef.current.style.transition = 'transform 2s ease-out, opacity 1s ease-out';
        modelRef.current.style.transform = 'translateY(0)';
        modelRef.current.style.opacity = '1';
      }, 100);
    }
  }, []);

  return (
    <section className="relative bg-black bg-cover bg-center h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo de partículas */}
      <ParticlesBackground />

      {/* Overlay (opcional) */}
      <div className="absolute inset-0"></div>

      {/* Contenedor principal */}
      <div className="container  mx-auto px-4 relative w-full h-full flex flex-col md:block">
        {/* Sección del Modelo 3D para móviles - Ahora en la parte superior */}
        <div ref={modelRef} className="md:hidden w-full h-[40vh] flex items-center justify-center pt-8 ">
          <Canvas 
            className="model-canvas "
            style={{ width: '100%', height: '100%' }} 
            camera={{ position: [0, 0, 5], fov: 40 }}
            shadows
          >
            <ambientLight intensity={0.3} />
            <directionalLight
              intensity={8}
              position={[0, 5, 0]}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <SpotLight
              position={[0, 3, 0]}
              angle={1}
              penumbra={1}
              intensity={2}
              distance={20}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            <AnimaLaptop position={[0, -4.5, 0]} scale={0.8} />

            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate={true} 
              autoRotateSpeed={1.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>

        {/* Texto del Hero - Solo visible en móvil debajo del modelo */}
        <div className="md:hidden w-full z-1 flex flex-col items-center justify-center flex-grow">
          <h1 className="select-none text-3xl sm:text-4xl font-bold text-white mb-4 animate-slide-four text-center">
            <ReactTyped className='font-game'
              strings={['ASUS TUF GAMING ROG STRIX']}
              typeSpeed={50}
              backSpeed={50}
              loop={false}
            />
          </h1>

          <button className="bg-red-600 animate-slide-four tracking-wide font-designer text-white py-2 px-6 rounded-full text-base sm:text-lg hover:bg-red-700 transition duration-300 select-none">
            Comprar
          </button>
        </div>

        {/* Estructura desktop con texto a la izquierda y modelo 3D expandido */}
        <div className="hidden md:flex w-full h-full">
          {/* Texto del Hero en desktop */}
          <div className="w-1/2 z-20 flex flex-col justify-center items-start px-8">
            <h1 className="select-none text-4xl lg:text-5xl font-bold text-white mb-4 animate-slide-four">
              <ReactTyped className='font-game'
                strings={['ASUS TUF GAMING ROG STRIX']}
                typeSpeed={50}
                backSpeed={50}
                loop={false}
              />
            </h1>

            <button className="bg-red-600 animate-slide-four tracking-wide font-designer text-white py-2 px-6 rounded-full text-lg md:text-xl hover:bg-red-700 transition duration-300 select-none">
              Comprar
            </button>
          </div>
        </div>

        {/* Sección del Modelo 3D para desktop */}
        <div className="hidden  md:block md:absolute md:right-0 md:top-0 md:w-3/5 md:h-screen">
          <Canvas 
            className="model-canvas"
            style={{ width: '100%', height: '100%' }} 
            camera={{ position: [0, 3.5, 0], fov: 40 }}
            shadows
          >
            <ambientLight intensity={0.3} />
            <directionalLight
              intensity={8}
              position={[0, 5, 0]}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <SpotLight
              position={[0, 3.5, 0]}
              angle={0.7}
              penumbra={1}
              intensity={2}
              distance={20}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            <AnimaLaptop position={[0, -1.3, 0]} scale={0.4} />

            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate={true} 
              autoRotateSpeed={1.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>
      </div>

      {/* Icono de scroll - Ajustado para siempre estar visible */}
      <div className="absolute bottom-4 md:bottom-10 animate-bounce z-20">
        <a href='#MarcasSection' aria-label="Desplazar hacia abajo">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </a> 
      </div>
    </section>
  );
};

export default HeroSection;
