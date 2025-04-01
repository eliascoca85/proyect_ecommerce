"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCarrito } from '../../actions/carritoActions';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Usar el contexto del carrito para obtener la cantidad real de productos
  const { cantidadTotal } = useCarrito();
  
  // Determinar si estamos en una página interna (no homepage)
  const isInternalPage = pathname !== '/';

  // Cargar datos del usuario al inicio
  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    // Eliminar datos de usuario y token
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Resetear estado
    setUser(null);
    setShowUserMenu(false);
    
    // Redirigir a la página de inicio
    router.push('/');
  };

  return (
    <header className={`${isInternalPage ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' : 'bg-transparent absolute'} top-0 left-0 w-full z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        <nav className="hidden md:flex space-x-8">
          <Link className='hover:animate-pulse' href="/">
            <span className={`font-designer text-white hover:text-red-500 transition-colors ${pathname === '/' ? 'text-red-500' : ''}`}>Inicio</span>
          </Link>
          <Link href="/catalogo">
            <span className={`font-designer text-white hover:text-red-500 transition-colors ${pathname === '/catalogo' ? 'text-red-500' : ''}`}>Catálogo</span>
          </Link>
          <Link href="/contacto">
            <span className={`font-designer text-white hover:text-red-500 transition-colors ${pathname === '/contacto' ? 'text-red-500' : ''}`}>Contacto</span>
          </Link>
        </nav>
        
        <div className="flex-1 flex justify-center md:justify-center">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="font-designer text-3xl">Los<span className="text-red-500">miserables</span></span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          
          {/* Mostrar perfil de usuario o icono de login */}
          {user ? (
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors px-3 py-2 rounded-md"
              >
                <span className="max-w-[120px] truncate">{user.nombre}</span>
                <FaUserCircle className="w-6 h-6" />
              
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg py-1 z-20">
                  {/* Si el usuario es administrador, mostrar enlace al dashboard */}
                  {user.rol === 'Administrador' && (
                    <Link href="/dashboard">
                      <div className="px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Dashboard
                      </div>
                    </Link>
                  )}
                  
                  {/* Enlace a perfil */}
                  <Link href="/cuenta">
                    <div className="px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Mi Perfil
                    </div>
                  </Link>
                  
                  {/* Botón para cerrar sesión */}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-white hover:text-red-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </Link>
          )}
          
          {/* Icono de carrito con contador real */}
          <Link href="/carrito" className="text-white hover:text-red-500 transition-colors relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                {cantidadTotal}
              </span>
            )}
          </Link>
        </div>
        
        <div className="md:hidden flex items-center space-x-4">
          {/* Icono de carrito móvil con contador real */}
          <Link href="/carrito" className="text-white hover:text-red-500 transition-colors relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                {cantidadTotal}
              </span>
            )}
          </Link>
          
          {/* Botón de menú móvil */}
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
          <nav className="px-4 pt-2 pb-4 space-y-1 animate-slide-in">
            <Link href="/">
              <span className={`block animate-slide-one font-designer py-3 text-white hover:text-red-500 transition-colors ${pathname === '/' ? 'text-red-500' : ''} border-b border-gray-800`}>Inicio</span>
            </Link>
            <Link href="/catalogo">
              <span className={`block animate-slide-two font-designer py-3 text-white hover:text-red-500 transition-colors ${pathname === '/catalogo' ? 'text-red-500' : ''} border-b border-gray-800`}>Catálogo</span>
            </Link>
            <Link href="/contacto">
              <span className={`block animate-slide-three font-designer py-3 text-white hover:text-red-500 transition-colors ${pathname === '/contacto' ? 'text-red-500' : ''} border-b border-gray-800`}>Contacto</span>
            </Link>
            
            {/* Versión móvil: mostrar usuario o login */}
            {user ? (
              <>
                <div className="block animate-slide-four font-designer py-3 text-white border-b border-gray-800">
                  <div className="flex items-center space-x-3">
                    <FaUserCircle className="w-6 h-6 text-red-500" />
                    <span className="truncate">{user.nombre}</span>
                  </div>
                </div>
                
                {/* Si el usuario es administrador, mostrar enlace al dashboard */}
                {user.rol === 'Administrador' && (
                  <Link href="/dashboard">
                    <span className={`block animate-slide-five pl-7 font-designer py-3 text-white hover:text-red-500 transition-colors ${pathname === '/dashboard' ? 'text-red-500' : ''} border-b border-gray-800`}>
                      Dashboard
                    </span>
                  </Link>
                )}
                
                <Link href="/Cuenta">
                  <span className={`block animate-slide-five pl-7 font-designer py-3 text-white hover:text-red-500 transition-colors ${pathname === '/perfil' ? 'text-red-500' : ''} border-b border-gray-800`}>
                    Mi Perfil
                  </span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left animate-slide-six pl-7 font-designer py-3 text-red-400 hover:text-red-500 transition-colors border-b border-gray-800 flex items-center space-x-2"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link href="/login">
                <span className={`block animate-slide-four font-designer py-3 text-white hover:text-red-500 transition-colors ${pathname === '/login' ? 'text-red-500' : ''} border-b border-gray-800`}>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Iniciar Sesión</span>
                  </div>
                </span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;