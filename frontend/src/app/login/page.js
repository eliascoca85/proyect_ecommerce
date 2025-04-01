"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importamos useRouter
import { FaUser, FaLock, FaGoogle, FaFacebook, FaDiscord, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar carga
  const [error, setError] = useState(''); // Estado para mostrar errores
  
  const router = useRouter(); // Hook para redireccionar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Versión simplificada
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          correo: email, 
          clave: password 
        })
        // Elimina credentials: 'include' temporalmente
      });
  
      // Para depurar
      console.log('Respuesta recibida:', response.status);
      
      const data = await response.json();
      console.log('Datos de respuesta:', data);
  
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      // Guardar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Redirigir según el rol
      if (data.user.rol === 'Administrador') {
        router.push('../dashboard');
      } else {
        router.push('./catalogo');
      }
      
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white py-2 px-4 rounded-lg border border-gray-800 hover:border-red-500 transition-colors duration-300 group"
      >
        <FaArrowLeft className="text-red-500 group-hover:transform group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Volver al inicio</span>
      </Link>
      
      {/* Lado izquierdo - Imagen */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 relative">
        <Image 
          src="/img/login-bg.jpg" 
          alt="Gaming Setup" 
          fill
          className="object-cover opacity-70"
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10"></div>
        
        {/* Contenido sobre la imagen */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-12">
          <div className="relative h-16 ">
            <span className="font-ka1 text-center text-4xl text-white">Los miserables</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="text-red-500">NEXT</span> LEVEL GAMING
          </h2>
          <p className="text-gray-300 max-w-md mb-6">
            Únete a la comunidad gaming más grande y accede a ofertas exclusivas, seguimiento de pedidos y mucho más.
          </p>
          <div className="space-y-3 font-contm text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span>Ofertas exclusivas para miembros</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span>Soporte prioritario</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span>Recompensas por cada compra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-black">
        <div className="w-full max-w-md">
          {/* Logo móvil (visible solo en móviles) */}
          <div className="flex justify-center md:hidden mb-8">
            <div className="relative w-32 h-14">
              <Image
                src="/img/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Encabezado del formulario */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Iniciar <span className="text-red-500">Sesión</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Accede a tu cuenta para disfrutar de la experiencia gaming definitiva
            </p>
          </div>

          {/* Contenedor del formulario con efecto de borde */}
          <div className="relative bg-gray-900/60 p-8 rounded-xl border border-gray-800">
            {/* Efecto de borde brillante */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-red-500/0 rounded-xl blur-sm"></div>
            
            {/* Formulario real */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              {/* Mostrar mensaje de error si existe */}
              {error && (
                <div className="p-3 mb-4 text-sm text-white bg-red-500/80 rounded-lg">
                  {error}
                </div>
              )}
              
              {/* Campo de email */}
              <div className="space-y-2 font-contm">
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Correo electrónico
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full py-3 bg-gray-800/70 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors duration-200"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>

              {/* Campo de contraseña */}
              <div className="space-y-2 font-contm">
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Contraseña
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full py-3 bg-gray-800/70 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="flex items-center justify-between font-contm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 accent-red-500 rounded focus:ring-red-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                    Recordarme
                  </label>
                </div>
                <Link href="/recuperar-contrasena" className="text-sm text-red-500 hover:text-red-400">
                  ¿Olvidaste la contraseña?
                </Link>
              </div>

              {/* Botón de inicio de sesión */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-contm py-3 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>

              {/* Resto del formulario igual que antes */}
              {/* Separador */}
              <div className="flex font-contm items-center my-4">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="px-4 text-sm text-gray-500">O continúa con</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              {/* Botones de redes sociales */}
              <div className="grid grid-cols-3 gap-3">
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors duration-200"
                >
                  <FaGoogle className="text-white/80" />
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-700 transition-colors duration-200"
                >
                  <FaFacebook className="text-white/80" />
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg border border-indigo-700 transition-colors duration-200"
                >
                  <FaDiscord className="text-white/80" />
                </button>
              </div>
            </form>
          </div>

          {/* Enlace de registro */}
          <p className="text-center mt-8 text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-red-500 hover:text-red-400 font-medium">
              Regístrate
            </Link>
          </p>
          
          {/* Enlaces de ayuda */}
          <div className="flex justify-center space-x-4 mt-6">
            <Link href="/ayuda" className="text-xs text-gray-500 hover:text-gray-400">
              Centro de ayuda
            </Link>
            <Link href="/terminos" className="text-xs text-gray-500 hover:text-gray-400">
              Términos y condiciones
            </Link>
            <Link href="/privacidad" className="text-xs text-gray-500 hover:text-gray-400">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}