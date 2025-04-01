"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaArrowLeft, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCarrito } from '../../actions/carritoActions';

const CarritoPage = () => {
  const { 
    items, 
    loading, 
    error, 
    total, 
    cantidadTotal,
    actualizarCantidad, 
    eliminarProducto, 
    vaciarCarrito 
  } = useCarrito();

  const [isProcessing, setIsProcessing] = useState(false);

  // Formatear precio con separador de miles
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0.00';
    return Number(price).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Manejar cambio de cantidad
  // Manejar cambio de cantidad (versión mejorada)
const handleCantidadChange = async (detalleId, cantidad, currentCantidad) => {
  console.log('ID del detalle:', detalleId, 'Cantidad a cambiar:', cantidad, 'Cantidad actual:', currentCantidad);
  
  const nuevaCantidad = currentCantidad + cantidad;
  if (nuevaCantidad < 1) return;
  
  try {
    const resultado = await actualizarCantidad(detalleId, nuevaCantidad);
    
    // Si la actualización falló por stock insuficiente
    if (resultado && resultado.success === false && resultado.error === 'Stock insuficiente') {
      // Mostrar notificación adicional si quieres (opcional)
      console.log(`Stock insuficiente. Disponible: ${resultado.stockDisponible}`);
      
      // Podrías mostrar una notificación visual aquí si lo deseas
      // toast.error(`Solo hay ${resultado.stockDisponible} unidades disponibles`);
    }
  } catch (error) {
    console.error('Error al cambiar cantidad:', error);
  }
};

  // Manejar eliminación de producto
  const handleEliminarProducto = async (detalleId) => {
    try {
      await eliminarProducto(detalleId);
    } catch (error) {
      // El error ya se maneja en el contexto
    }
  };

  // Manejar vaciado del carrito
  const handleVaciarCarrito = async () => {
    try {
      await vaciarCarrito();
    } catch (error) {
      // El error ya se maneja en el contexto
    }
  };

  // Manejar el proceso de checkout
  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Simulación de proceso de checkout
    setTimeout(() => {
      setIsProcessing(false);
      // Aquí podrías redirigir a la página de checkout
      window.location.href = '/checkout';
    }, 1500);
  };

  // URL base para imágenes
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header de la página */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-8 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-4 md:mb-0">
              <FaShoppingCart className="text-red-500" />
              <span>Mi <span className="text-red-500">Carrito</span> de Compras</span>
            </h1>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors duration-300">
              <FaArrowLeft />
              <span>Continuar comprando</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-8xl text-gray-800 mb-6">
              <FaShoppingCart />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-400 text-center max-w-md mb-8">
              Parece que aún no has agregado productos a tu carrito. Descubre nuestras increíbles ofertas y encuentra el equipo gaming perfecto para ti.
            </p>
            <Link href="/catalogo" className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30">
              Ver productos destacados
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Lista de productos */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800/50 border-b border-gray-800 text-sm font-medium text-gray-400">
                  <div className="col-span-6 md:col-span-6">Producto</div>
                  <div className="col-span-2 md:col-span-2 text-center">Precio</div>
                  <div className="col-span-2 md:col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 md:col-span-2 text-right">Total</div>
                </div>
                
                <div className="divide-y divide-gray-800">
                  {items.map((item) => (
                    <div key={item.id_detalle_carrito} className="grid grid-cols-12 gap-4 p-4 items-center">
                      {/* Producto */}
                      <div className="col-span-6 md:col-span-6 flex gap-3">
                        <div className="w-16 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                          {item.imagen ? (
                            <img 
                              src={`${API_URL}${item.imagen}`} 
                              alt={item.nombre} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-medium line-clamp-1">{item.nombre}</h3>
                          <p className="text-xs text-gray-400">{item.marca_nombre || 'Sin marca'}</p>
                          <button 
                            onClick={() => handleEliminarProducto(item.id_detalle_carrito)}
                            className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 mt-1"
                          >
                            <FaTrash size={10} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Precio */}
                      <div className="col-span-2 md:col-span-2 text-center">
                        <span className="text-white">${formatPrice(item.precio_unitario)}</span>
                      </div>
                      
                      {/* Cantidad */}
                      <div className="col-span-2 md:col-span-2 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleCantidadChange(item.id_detalle_carrito, -1, item.cantidad)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="text-white w-6 text-center">{item.cantidad}</span>
                          <button 
                            onClick={() => handleCantidadChange(item.id_detalle_carrito, 1, item.cantidad)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="col-span-2 md:col-span-2 text-right">
                        <span className="text-white font-medium">${formatPrice(item.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={handleVaciarCarrito}
                  className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Vaciar carrito
                </button>
                <Link href="/" className="text-gray-400 hover:text-red-500 transition-colors">
                  Seguir comprando
                </Link>
              </div>
            </div>
            
            {/* Columna derecha - Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4 pb-4 border-b border-gray-800">Resumen de compra</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({cantidadTotal} productos):</span>
                    <span className="text-white">${formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envío:</span>
                    <span className="text-white">Gratis</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-lg font-bold mb-6 pt-4 border-t border-gray-800">
                  <span>Total:</span>
                  <span className="text-red-500">${formatPrice(total)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"></span>
                      Procesando...
                    </>
                  ) : (
                    'Proceder al pago'
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Los precios y la disponibilidad están sujetos a cambios. El carrito se considera un documento sin valor contractual.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarritoPage;