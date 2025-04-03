"use client";

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import { useCarrito } from '../../../actions/carritoActions';
import { useSearchParams } from 'next/navigation';

const CheckoutSuccess = () => {
  const { vaciarCarrito, items, carritoId } = useCarrito();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [hasCleared, setHasCleared] = useState(false);
  const [clearingStatus, setClearingStatus] = useState('waiting'); // waiting, clearing, success, error
  const [clearingMessage, setClearingMessage] = useState('');

  // Verificar si el carrito ya está vacío
  const carritoVacio = items.length === 0;

  // Función para vaciar el carrito de forma controlada
  const limpiarCarrito = async () => {
    if (carritoVacio) {
      console.log('El carrito ya está vacío, no es necesario limpiarlo');
      setClearingStatus('success');
      setClearingMessage('El carrito ya estaba vacío');
      setHasCleared(true);
      return;
    }

    try {
      console.log('Iniciando limpieza del carrito, ID:', carritoId);
      setClearingStatus('clearing');
      
      // Intentar vaciar el carrito
      const resultado = await vaciarCarrito();
      console.log('Resultado de vaciar carrito:', resultado);
      
      if (resultado.success) {
        setClearingStatus('success');
        setClearingMessage(resultado.mensaje || 'Carrito vaciado correctamente');
        
        // Si hubo un error 500 pero se manejó como éxito (el carrito ya fue procesado)
        if (resultado.mensaje?.includes('error 500') || resultado.mensaje?.includes('error en servidor')) {
          console.log('Se recibió un error 500 pero se manejó como éxito');
          
          // Asegurarse de tener un nuevo ID de carrito para futuras compras
          const newTempId = Date.now();
          localStorage.setItem('carritoId', newTempId.toString());
          localStorage.setItem('carritoItems', JSON.stringify([]));
        }
      } else {
        setClearingStatus('error');
        setClearingMessage(resultado.error || 'Error al vaciar el carrito');
        console.error('Error al vaciar carrito:', resultado.error);
        
        // Intentar limpiar localmente de todos modos
        localStorage.setItem('carritoItems', JSON.stringify([]));
        
        if (resultado.error?.includes('no disponible') || resultado.error?.includes('no encontrado')) {
          // Crear un nuevo ID de carrito si el actual no es válido
          const newTempId = Date.now();
          localStorage.setItem('carritoId', newTempId.toString());
        }
      }
      
      // Marcar como limpiado independientemente del resultado para evitar intentos repetidos
      setHasCleared(true);
    } catch (error) {
      console.error('Error inesperado al limpiar carrito:', error);
      setClearingStatus('error');
      setClearingMessage('Error inesperado: ' + error.message);
      
      // Intentar limpiar localmente de todos modos
      localStorage.setItem('carritoItems', JSON.stringify([]));
      
      // Crear un nuevo ID de carrito si ocurrió un error grave
      const newTempId = Date.now();
      localStorage.setItem('carritoId', newTempId.toString());
      
      setHasCleared(true);
    }
  };

  // Limpiar el carrito cuando se redirige a esta página
  useEffect(() => {
    // Solo vaciar si hay un sessionId, no se ha limpiado ya, y tenemos un carritoId
    if (sessionId && !hasCleared && carritoId) {
      // Verificar si ya tenemos guardado este sessionId (para evitar vaciar múltiples veces)
      const lastPayment = localStorage.getItem('lastSuccessfulPayment');
      if (lastPayment !== sessionId) {
        console.log('Detectado nuevo pago, sessionId:', sessionId);
        localStorage.setItem('lastSuccessfulPayment', sessionId);
        
        // Iniciar el proceso de limpieza del carrito
        limpiarCarrito();
      } else {
        console.log('Este pago ya fue procesado anteriormente');
        setClearingStatus('success');
        setClearingMessage('Pago procesado previamente');
        setHasCleared(true);
      }
    }
  }, [sessionId, hasCleared, carritoId]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link className='hover:animate-pulse' href="/">
              <div className="text-2xl font-ka1 font-bold">
                <span className='text-white'>Los <span className="text-red-500">Miserables</span></span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl p-8 shadow-lg text-center">
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          
          <h1 className="text-3xl font-bold mb-6">¡Pago realizado con éxito!</h1>
          
          <p className="text-lg text-gray-300 mb-4">
            Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
            Recibirás un correo electrónico con los detalles de tu compra.
          </p>

          {/* Estado del carrito */}
          <div className={`mb-6 p-3 rounded-lg text-sm ${
            clearingStatus === 'success' ? 'bg-green-500/20 text-green-300' :
            clearingStatus === 'error' ? 'bg-red-500/20 text-red-300' :
            clearingStatus === 'clearing' ? 'bg-blue-500/20 text-blue-300' :
            'bg-gray-500/20 text-gray-300'
          }`}>
            {clearingStatus === 'waiting' && (
              <p className="flex items-center justify-center gap-2">
                <FaShoppingCart className="animate-pulse" />
                Preparando carrito para tu próxima compra...
              </p>
            )}
            {clearingStatus === 'clearing' && (
              <p className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></span>
                Vaciando carrito...
              </p>
            )}
            {clearingStatus === 'success' && (
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle />
                {clearingMessage || 'Carrito vaciado correctamente'}
              </p>
            )}
            {clearingStatus === 'error' && (
              <p className="flex items-center justify-center gap-2">
                <span className="text-red-500">⚠️</span>
                {clearingMessage || 'No se pudo vaciar el carrito'}
              </p>
            )}
          </div>

          {sessionId && (
            <div className="mb-8 p-4 bg-gray-800 rounded-lg text-left">
              <p className="text-sm text-gray-400">Referencia de pago:</p>
              <p className="text-xs text-gray-500 break-all">{sessionId}</p>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/" className="py-3 px-6 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
              <FaArrowLeft className="mr-2" />
              Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutSuccess; 