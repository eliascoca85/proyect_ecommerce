"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { FaTrophy, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { productoAPI, marcaAPI } from '../../api/client';
import Link from 'next/link';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos y marcas en paralelo
        const [productosData, marcasData] = await Promise.all([
          productoAPI.getAll(),
          marcaAPI.getAll()
        ]);
        
        // Crear un mapa de marcas para búsqueda rápida
        const marcasMap = {};
        marcasData.forEach(marca => {
          marcasMap[marca.id_marca] = marca.nombre;
        });
        
        // Añadir el nombre de la marca a cada producto
        const productosConMarca = productosData.map(producto => ({
          ...producto,
          marca: marcasMap[producto.id_marca] || 'N/A'
        }));
        
        // Ordenar por descuento
        const sortedProducts = productosConMarca.sort((a, b) => {
          const discountA = a.precio_oferta ? (a.precio - a.precio_oferta) / a.precio : 0;
          const discountB = b.precio_oferta ? (b.precio - b.precio_oferta) / b.precio : 0;
          return discountB - discountA;
        });
        
        // Tomar los primeros 5 productos
        setProducts(sortedProducts.slice(0, 5));
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="w-full py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        {/* Encabezado de la sección */}
        <div className="flex flex-col-2 md:flex-row justify-between items-center mb-10">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <FaTrophy className="text-red-500 text-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold font-designer text-white">
              <span className="text-red-500 ">Productos</span> destacados
            </h2>
          </div>
          
          {/* Botones de navegación para futura implementación de carrusel */}
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-full bg-gray-800 hover:bg-red-600 text-white transition-colors duration-300">
              <FaChevronLeft />
            </button>
            <button className="p-3 rounded-full bg-gray-800 hover:bg-red-600 text-white transition-colors duration-300">
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Línea separadora con gradiente */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mb-10"></div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-red-500 text-4xl animate-spin mb-4" />
            <p className="text-gray-400">Cargando productos destacados...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Error al cargar productos</h3>
            <p className="text-gray-400 max-w-md mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400">No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          /* Grid de productos */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product.id_producto} className="transform transition-all duration-300 hover:scale-102">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Botón "Ver todos" */}
        <div className="flex justify-center mt-10">
          <Link href="/catalogo" className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30">
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;