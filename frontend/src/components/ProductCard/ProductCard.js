"use client";

import React, { useState } from 'react';
import { FaShoppingCart, FaFire, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { useCarrito } from '../../actions/carritoActions';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { agregarProducto } = useCarrito();
  
  // Si no hay producto o no tiene precio, no renderizar nada o mostrar un placeholder
  if (!product || (product.precio === undefined && product.precio_oferta === undefined)) {
    return null; // O podrías devolver un componente de placeholder
  }

  // Calcular descuento si hay precio de oferta
  const hasDiscount = product.precio_oferta && 
                     product.precio !== undefined && 
                     product.precio_oferta < product.precio;

  const discountPercentage = hasDiscount 
    ? Math.round(((product.precio - product.precio_oferta) / product.precio) * 100) 
    : 0;

  // URL base para imágenes
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Formatear precio con separador de miles
  const formatPrice = (price) => {
    // Verificar si price es un número válido
    if (price === undefined || price === null || isNaN(price)) {
      return '0.00';
    }
    
    return Number(price).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Manejar la adición al carrito
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevenir navegación si está dentro de un enlace
    
    if (isAdding || isAdded) return;
    
    try {
      setIsAdding(true);
      await agregarProducto(product, 1);
      setIsAdded(true);
      
      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div 
      className={`relative flex flex-col md:flex-row rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/10 shadow-xl transition-all duration-300 ${
        isHovered ? 'transform md:translate-y-[-5px] shadow-red-500/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges / Etiquetas */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
        {hasDiscount && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-md">
            -{discountPercentage}%
          </span>
        )}
        {product.es_nuevo && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded-md">
            NUEVO
          </span>
        )}
      </div>

      {/* Sección de imagen */}
      <div className="relative md:w-2/5 h-[200px] md:h-auto flex items-center justify-center bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 overflow-visible">
        <div className={`relative w-full h-full transition-all duration-500 ${
          isHovered ? 'scale-110 rotate-2' : 'scale-100'
        }`}>
          {/* La imagen está contenida en un div que puede desbordarse */}
          <div className="absolute inset-0 flex items-center justify-center md:-left-8">
            {product.imagen ? (
              <img 
                src={`${API_URL}${product.imagen}`}
                alt={product.nombre}
                className="object-contain w-full h-full drop-shadow-[0_10px_10px_rgba(255,0,0,0.2)]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                Sin imagen
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido / Información */}
      <div className="flex-1 flex flex-col justify-between p-5 bg-zinc-900">
        {/* Encabezado */}
        <div>
          <span className="block text-xs font-medium text-red-500 uppercase tracking-wider mb-1">
            {product.categoria || 'Producto'}
          </span>
          <Link href={`/producto/${product.id_producto}`}>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2 hover:text-red-500 transition-colors">
              {product.nombre}
            </h3>
          </Link>
          
          {/* Descripción */}
          {product.descripcion && (
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
              {product.descripcion}
            </p>
          )}
          
          {/* Especificaciones - Adaptadas a tu estructura de datos */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">Marca:</span>
              <span className="text-xs text-white font-semibold">{product.marca || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">Stock:</span>
              <span className="text-xs text-white font-semibold">{product.cantidad} unidades</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">SKU:</span>
              <span className="text-xs text-white font-semibold">{product.sku || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">ID:</span>
              <span className="text-xs text-white font-semibold">{product.id_producto}</span>
            </div>
          </div>
        </div>
        
        {/* Footer con precio y botón */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-3">
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-sm text-zinc-500 line-through">
                ${formatPrice(product.precio)}
              </span>
            )}
            <span className="text-2xl font-bold text-white">
              ${formatPrice(hasDiscount ? product.precio_oferta : product.precio)}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            className={`group flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
              isHovered ? 'shadow-lg shadow-red-600/30' : ''
            } ${
              isAdded 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isAdding ? (
              <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
            ) : isAdded ? (
              <FaCheck />
            ) : (
              <FaShoppingCart className="text-sm" />
            )}
            <span className="text-sm">Añadir al carrito</span>
          </button>
        </div>
      </div>

      {/* Hot Deal Badge */}
      {discountPercentage >= 10 && (
        <div className="absolute -top-2 right-5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold py-1 px-3 rounded-b-lg flex items-center gap-1 shadow-lg">
          <FaFire className="text-yellow-300" />
          <span>HOT</span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
