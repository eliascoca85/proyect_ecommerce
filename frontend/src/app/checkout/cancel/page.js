"use client";

import React from 'react';
import { FaTimesCircle, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

const CheckoutCancel = () => {
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
            <FaTimesCircle className="text-red-500 text-6xl" />
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Pago cancelado</h1>
          
          <p className="text-lg text-gray-300 mb-8">
            Has cancelado el proceso de pago. Tu carrito se ha guardado y puedes 
            completar la compra en cualquier momento.
          </p>
          
          <p className="text-gray-400 mb-8">
            Si tuviste algún problema durante el proceso de pago, no dudes en 
            contactar con nuestro equipo de soporte.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/carrito" className="py-3 px-6 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center">
              <FaShoppingCart className="mr-2" />
              Volver al carrito
            </Link>
            
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

export default CheckoutCancel; 