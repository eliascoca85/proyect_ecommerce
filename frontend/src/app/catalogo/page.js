"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaChevronDown, 
  FaChevronUp, 
  FaSortAmountDown, 
  FaStar, 
  FaTags, 
  FaLaptop, 
  FaDesktop, 
  FaGamepad, 
  FaHeadset, 
  FaKeyboard, 
  FaMouse, 
  FaMemory, 
  FaMicrochip
} from 'react-icons/fa';

import ProductCardDos from '@/components/ProductCard/ProductCardDos';
import { productoAPI, marcaAPI } from '../../api/client';

export default function CatalogoPage() {
  // Estado para productos y filtros
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortOption, setSortOption] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Estados para secciones de filtro expandidas/colapsadas
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    price: true
  });

  // Datos de ejemplo para categorías (puedes reemplazar esto con datos reales más adelante)
  const categories = [
    { id: 'laptops', name: 'Laptops Gaming', icon: <FaLaptop /> },
    { id: 'desktops', name: 'PCs Gaming', icon: <FaDesktop /> },
    { id: 'monitors', name: 'Monitores', icon: <FaDesktop /> },
    { id: 'consoles', name: 'Consolas', icon: <FaGamepad /> },
    { id: 'keyboards', name: 'Teclados', icon: <FaKeyboard /> },
    { id: 'mice', name: 'Ratones', icon: <FaMouse /> },
    { id: 'headsets', name: 'Auriculares', icon: <FaHeadset /> },
    { id: 'components', name: 'Componentes', icon: <FaMicrochip /> },
  ];

  // Cargar productos y marcas desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar productos y marcas en paralelo
        const [productosData, marcasData] = await Promise.all([
          productoAPI.getAll(),
          marcaAPI.getAll()
        ]);
        
        setProducts(productosData);
        
        // Transformar marcas para el formato del filtro
        const brandsFormatted = marcasData.map(marca => ({
          id: marca.id_marca,
          name: marca.nombre,
          // Contar productos por marca
          count: productosData.filter(p => p.id_marca === marca.id_marca).length
        }));
        
        setBrands(brandsFormatted);
        
        // Establecer rango de precios basado en los productos
        if (productosData.length > 0) {
          const prices = productosData.map(p => p.precio);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange({ min: 0, max: maxPrice });
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los productos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar productos cuando cambian los filtros
  useEffect(() => {
    if (!products.length) return;
    
    let result = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por marcas seleccionadas
    if (selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.id_marca));
    }

    // Filtrar por rango de precio
    result = result.filter(product => 
      product.precio >= priceRange.min && product.precio <= priceRange.max
    );

    // Aplicar clasificación
    switch (sortOption) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.precio - b.precio);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.precio - a.precio);
        break;
      case 'newest':
        // Aquí podrías ordenar por fecha de creación si tienes ese campo
        break;
      case 'discount':
        // Ordenar por mayor descuento (si tiene precio_oferta)
        result = [...result].sort((a, b) => {
          const discountA = a.precio_oferta ? (a.precio - a.precio_oferta) / a.precio : 0;
          const discountB = b.precio_oferta ? (b.precio - b.precio_oferta) / b.precio : 0;
          return discountB - discountA;
        });
        break;
      // Por defecto es 'featured', no se modifica el orden
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedBrands, priceRange, sortOption]);

  // Manejar cambios en los filtros de marcas
  const handleBrandChange = (brandId) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandId)) {
        return prev.filter(id => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedBrands([]);
    // Restablecer el rango de precios a los valores iniciales
    if (products.length > 0) {
      const prices = products.map(p => p.precio);
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange({ min: 0, max: maxPrice });
    } else {
      setPriceRange({ min: 0, max: 5000 });
    }
    setSortOption('featured');
  };

  // Alternar secciones expandidas/colapsadas
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Encabezado de la página */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-gray-300 max-w-2xl">
            Explora nuestra selección de productos gaming de alta calidad. Filtra por marca, categoría y precio para encontrar exactamente lo que buscas.
          </p>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Barra de búsqueda y filtros móviles */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-400" />
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-2"
            >
              <FaFilter />
              <span>Filtros</span>
            </button>
            
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="newest">Más Recientes</option>
              <option value="discount">Mayor Descuento</option>
            </select>
          </div>
        </div>
        
        {/* Contenido principal con filtros laterales */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtros laterales (escritorio) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-gray-900 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Filtros</h2>
              
              {/* Filtro de marcas */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection('brands')}
                >
                  <h3 className="font-medium">Marcas</h3>
                  <span className="text-gray-400">{expandedSections.brands ? '−' : '+'}</span>
                </div>
                
                {expandedSections.brands && (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {brands.map(brand => (
                      <label key={brand.id} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => handleBrandChange(brand.id)}
                          className="form-checkbox h-4 w-4 text-red-500 rounded border-gray-700 bg-gray-800 focus:ring-0 focus:ring-offset-0"
                        />
                        <span className="ml-2 text-sm">{brand.name}</span>
                        <span className="ml-auto text-xs text-gray-500">{brand.count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Filtro de precio */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection('price')}
                >
                  <h3 className="font-medium">Precio</h3>
                  <span className="text-gray-400">{expandedSections.price ? '−' : '+'}</span>
                </div>
                
                {expandedSections.price && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">${priceRange.min}</span>
                      <span className="text-sm">${priceRange.max}</span>
                    </div>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max={Math.max(5000, ...products.map(p => p.precio))} 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                )}
              </div>
              
              {/* Botón para limpiar filtros */}
              <button
                onClick={clearAllFilters}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1">
            {/* Estado de los filtros */}
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedBrands.length > 0 && (
                <div className="flex items-center text-sm bg-gray-800/80 py-1 px-3 rounded-full border border-gray-700">
                  <span className="mr-2">Marcas:</span> 
                  <span className="font-medium">{selectedBrands.length}</span>
                </div>
              )}
              
              {(priceRange.min > 0 || priceRange.max < 5000) && (
                <div className="flex items-center text-sm bg-gray-800/80 py-1 px-3 rounded-full border border-gray-700">
                  <span className="mr-2">Precio:</span> 
                  <span className="font-medium">${priceRange.min} - ${priceRange.max}</span>
                </div>
              )}
              
              {searchTerm && (
                <div className="flex items-center text-sm bg-gray-800/80 py-1 px-3 rounded-full border border-gray-700">
                  <span className="mr-2">Búsqueda:</span> 
                  <span className="font-medium">{searchTerm}</span>
                </div>
              )}
            </div>

            {/* Resultados */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-gray-800 border-t-red-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl text-red-500 mb-4">
                  <FaTimes />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Error al cargar productos</h2>
                <p className="text-gray-400 max-w-md mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl text-gray-700 mb-4">
                  <FaSearch />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No se encontraron productos</h2>
                <p className="text-gray-400 max-w-md mb-6">
                  No hay productos que coincidan con tus criterios de búsqueda. Intenta cambiar los filtros o buscar con otros términos.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Mostrando {filteredProducts.length} de {products.length} productos
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCardDos key={product.id_producto} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}