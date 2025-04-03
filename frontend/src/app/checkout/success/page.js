"use client";

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useCarrito } from '../../../actions/carritoActions';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CheckoutSuccess = () => {
  const { items, carritoId, vaciarCarrito } = useCarrito();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [processingStatus, setProcessingStatus] = useState('processing');
  const [error, setError] = useState(null);

  const guardarVentaEnBD = async () => {
    try {
      console.log('Iniciando guardado de venta...');
      
      // Obtener datos del usuario del localStorage
      const userDataString = localStorage.getItem('user');
      let id_persona = null;
      
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          id_persona = userData.id;
          console.log('✅ ID Persona encontrado:', id_persona);
        } catch (error) {
          console.error('Error al parsear userData:', error);
        }
      }

      if (!id_persona) {
        console.warn('⚠️ No se encontró id_persona en localStorage');
      }
      
      // Calcular el total
      const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total), 0);
      const envio = 15.99;
      const total = subtotal + envio;

      console.log('Datos a enviar:', {
        carritoId,
        id_persona,
        productos: items,
        total
      });

      const response = await fetch(`${API_URL}/api/venta/guardar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carritoId: carritoId,
          id_persona: id_persona,
          productos: items,
          total: total
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Venta guardada correctamente:', data);
        setProcessingStatus('success');
        await vaciarCarrito();
      } else {
        throw new Error(data.error || 'Error al guardar la venta');
      }
    } catch (error) {
      console.error('❌ Error al guardar la venta:', error);
      setProcessingStatus('error');
      setError(error.message);
    }
  };

  useEffect(() => {
    if (sessionId && items.length > 0) {
      console.log('SessionID recibido:', sessionId);
      console.log('Items en carrito:', items.length);
      guardarVentaEnBD();
    } else {
      console.log('No se puede procesar:', {
        tieneSessionId: !!sessionId,
        cantidadItems: items.length
      });
    }
  }, [sessionId, items]);

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
            <FaCheckCircle className={`text-6xl ${
              processingStatus === 'success' ? 'text-green-500' :
              processingStatus === 'error' ? 'text-red-500' :
              'text-yellow-500'
            }`} />
          </div>
          
          <h1 className="text-3xl font-bold mb-6">¡Pago realizado con éxito!</h1>
          
          {processingStatus === 'processing' && (
            <div className="text-lg text-gray-300 mb-4">
              <p>Procesando tu pedido...</p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              </div>
            </div>
          )}

          {processingStatus === 'success' && (
            <div className="text-lg text-gray-300 mb-4">
              <p>¡Gracias por tu compra! Hemos recibido tu pedido y lo estamos procesando.</p>
              <p className="mt-2">Recibirás un correo electrónico con los detalles de tu compra.</p>
              {sessionId && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left">
                  <p className="text-sm text-gray-400">Referencia de pago:</p>
                  <p className="text-xs text-gray-500 break-all">{sessionId}</p>
                </div>
              )}
            </div>
          )}

          {processingStatus === 'error' && (
            <div className="text-red-500 mb-4">
              <p>Hubo un error al procesar tu pedido:</p>
              <p className="mt-2 text-sm">{error}</p>
              <p className="mt-4">Por favor, contacta con soporte y proporciona esta referencia:</p>
              <p className="text-xs break-all mt-2">{sessionId}</p>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <Link href="/" 
                  className="py-3 px-6 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
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