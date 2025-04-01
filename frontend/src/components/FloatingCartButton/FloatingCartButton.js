"use client";

import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCarrito } from '@/actions/carritoActions';
import CarritoModal from '@/components/CarritoModal/CarritoModal';

const FloatingCartButton = () => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { cantidadTotal } = useCarrito();

  return (
    <>
      <button 
        onClick={() => setIsCartModalOpen(true)}
        className="fixed bottom-4 right-6 z-[1000] w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/30 flex items-center justify-center transition-transform hover:scale-110 group"
        aria-label="Abrir carrito"
      >
        {cantidadTotal > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-500">
            {cantidadTotal}
          </span>
        )}
        <FaShoppingCart size={25} />
        
        {/* Tooltip */}
        <div className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          Ver carrito
        </div>
      </button>
      
      {/* Modal del carrito */}
      <CarritoModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
      />
    </>
  );
};

export default FloatingCartButton; 