"use client";

import React, { useState } from 'react';
import { FaShoppingCart, FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaCheck, FaTruck, FaShieldAlt, FaExchangeAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductoPage = () => {
  // Estados para la página de producto
  const [cantidad, setCantidad] = useState(1);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [tabActivo, setTabActivo] = useState('descripcion');
  const [preguntasAbiertas, setPreguntasAbiertas] = useState({});
  
  // Datos de ejemplo del producto
  const producto = {
    id: 1,
    nombre: "OMEN 45L Gaming Desktop PC",
    precio: 1499.99,
    precioAnterior: 2799.99,
    descuento: 10,
    stock: 15,
    valoracion: 4.5,
    numeroReseñas: 128,
    descripcion: "Experimenta el máximo rendimiento gaming con el OMEN 45L. Equipado con los últimos procesadores Intel Core i9 y gráficas NVIDIA RTX 4080, este equipo está diseñado para ofrecer una experiencia de juego sin precedentes con refrigeración líquida OMEN Cryo Chamber™.",
    caracteristicas: [
      "Procesador Intel® Core™ i9-13900K (hasta 5.8 GHz, 36 MB de caché L3, 24 núcleos, 32 subprocesos)",
      "NVIDIA® GeForce RTX™ 4080 (16 GB GDDR6X dedicada)",
      "32 GB de memoria RAM DDR5-5600 MHz (2 x 16 GB)",
      "2 TB SSD PCIe® NVMe™ M.2",
      "Sistema de refrigeración líquida OMEN Cryo Chamber™",
      "Windows 11 Home",
      "Fuente de alimentación Platinum 1000W"
    ],
    especificaciones: {
      procesador: "Intel Core i9-13900K",
      grafica: "NVIDIA GeForce RTX 4080 16GB",
      memoria: "32GB DDR5-5600MHz",
      almacenamiento: "2TB SSD PCIe NVMe",
      refrigeracion: "Líquida OMEN Cryo Chamber",
      fuente: "1000W 80 Plus Platinum",
      sistema: "Windows 11 Home",
      dimensiones: "46.9 x 21.5 x 58.5 cm",
      peso: "18.5 kg"
    },
    imagenes: [
      "/img/omenmax.png",
      "/img/omenmax.png",
      "/img/omenmax.png",
      "/img/omenmax.png"
    ],
    colores: ["Negro", "Blanco"],
    preguntas: [
      {
        id: 1,
        pregunta: "¿Este equipo es compatible con juegos en 4K a 120fps?",
        respuesta: "Sí, el OMEN 45L con RTX 4080 está diseñado para ofrecer rendimiento 4K a altas tasas de fotogramas en la mayoría de los juegos actuales."
      },
      {
        id: 2,
        pregunta: "¿Puedo actualizar la memoria RAM en el futuro?",
        respuesta: "Sí, el equipo cuenta con 4 slots DIMM y soporta hasta 128GB de memoria DDR5."
      },
      {
        id: 3,
        pregunta: "¿Incluye periféricos como teclado y ratón?",
        respuesta: "Sí, incluye teclado y ratón OMEN de serie. También puedes elegir opciones premium durante la configuración."
      }
    ],
    productosRelacionados: [
      { id: 101, nombre: "Monitor OMEN 27\"", precio: 499.99, imagen: "/img/omenmax.png" },
      { id: 102, nombre: "Teclado OMEN Encoder", precio: 129.99, imagen: "/img/omenmax.png" },
      { id: 103, nombre: "Auriculares OMEN Blast", precio: 79.99, imagen: "/img/omenmax.png" },
      { id: 104, nombre: "Ratón OMEN Vector", precio: 49.99, imagen: "/img/omenmax.png" }
    ]
  };

  // Función para renderizar las estrellas de valoración
  const renderEstrellas = (valoracion) => {
    const estrellas = [];
    const valoracionEntera = Math.floor(valoracion);
    const tieneMedia = valoracion % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= valoracionEntera) {
        estrellas.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === valoracionEntera + 1 && tieneMedia) {
        estrellas.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        estrellas.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    
    return estrellas;
  };

  // Función para manejar la apertura/cierre de preguntas
  const togglePregunta = (id) => {
    setPreguntasAbiertas({
      ...preguntasAbiertas,
      [id]: !preguntasAbiertas[id]
    });
  };

  // Función para incrementar la cantidad
  const incrementarCantidad = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  // Función para decrementar la cantidad
  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Migas de pan */}
      <div className="container mx-auto px-6 py-4">
        <div className="text-sm text-gray-400">
          <a href="/" className="hover:text-red-500">Inicio</a> / 
          <a href="/categorias" className="mx-2 hover:text-red-500">Gaming PCs</a> / 
          <span className="text-red-500 ml-2">{producto.nombre}</span>
        </div>
      </div>
      
      {/* Sección principal del producto */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Galería de imágenes */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg mb-4">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img 
                  src={producto.imagenes[imagenSeleccionada]} 
                  alt={producto.nombre} 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
            
            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-2">
              {producto.imagenes.map((imagen, index) => (
                <button 
                  key={index}
                  onClick={() => setImagenSeleccionada(index)}
                  className={`bg-gray-900 rounded-lg p-2 border-2 ${
                    imagenSeleccionada === index ? 'border-red-500' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={imagen} 
                    alt={`${producto.nombre} - Vista ${index + 1}`} 
                    className="w-full h-16 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Información del producto */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl font-bold text-white mb-2">{producto.nombre}</h1>
            
            {/* Valoraciones */}
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderEstrellas(producto.valoracion)}
              </div>
              <span className="text-gray-400">({producto.numeroReseñas} reseñas)</span>
            </div>
            
            {/* Precio */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-red-500">${producto.precio.toLocaleString()}</span>
                {producto.precioAnterior && (
                  <>
                    <span className="ml-3 text-lg text-gray-400 line-through">${producto.precioAnterior.toLocaleString()}</span>
                    <span className="ml-3 px-2 py-1 bg-red-900 text-red-300 text-sm rounded-lg">-{producto.descuento}%</span>
                  </>
                )}
              </div>
              <p className="text-green-500 mt-1">
                <FaCheck className="inline mr-1" /> En stock ({producto.stock} disponibles)
              </p>
            </div>
            
            {/* Descripción corta */}
            <p className="text-gray-300 mb-6">{producto.descripcion}</p>
            
            {/* Selección de color */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Color:</h3>
              <div className="flex space-x-2">
                {producto.colores.map((color, index) => (
                  <button 
                    key={index}
                    className={`px-4 py-2 border ${
                      index === 0 
                        ? 'border-red-500 bg-gray-800' 
                        : 'border-gray-700 hover:border-gray-500'
                    } rounded-lg text-sm`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Cantidad y botones de acción */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <div className="flex items-center border border-gray-700 rounded-lg">
                <button 
                  onClick={decrementarCantidad}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-center w-12">{cantidad}</span>
                <button 
                  onClick={incrementarCantidad}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                  disabled={cantidad >= producto.stock}
                >
                  +
                </button>
              </div>
              
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all flex items-center justify-center">
                <FaShoppingCart className="mr-2" /> Añadir al carrito
              </button>
              
              <button className="px-4 py-3 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all">
                <FaHeart />
              </button>
            </div>
            
            {/* Beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center">
                <FaTruck className="text-red-500 mr-2" />
                <span className="text-sm text-gray-300">Envío gratuito</span>
              </div>
              <div className="flex items-center">
                <FaShieldAlt className="text-red-500 mr-2" />
                <span className="text-sm text-gray-300">Garantía 2 años</span>
              </div>
              <div className="flex items-center">
                <FaExchangeAlt className="text-red-500 mr-2" />
                <span className="text-sm text-gray-300">Devolución 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs de información */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button 
              onClick={() => setTabActivo('descripcion')}
              className={`px-6 py-4 text-sm font-medium ${
                tabActivo === 'descripcion' 
                  ? 'text-red-500 border-b-2 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Descripción
            </button>
            <button 
              onClick={() => setTabActivo('especificaciones')}
              className={`px-6 py-4 text-sm font-medium ${
                tabActivo === 'especificaciones' 
                  ? 'text-red-500 border-b-2 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Especificaciones
            </button>
            <button 
              onClick={() => setTabActivo('preguntas')}
              className={`px-6 py-4 text-sm font-medium ${
                tabActivo === 'preguntas' 
                  ? 'text-red-500 border-b-2 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Preguntas Frecuentes
            </button>
          </div>
          
          {/* Contenido de los tabs */}
          <div className="p-6">
            {tabActivo === 'descripcion' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Descripción del producto</h3>
                <p className="text-gray-300 mb-6">{producto.descripcion}</p>
                
                <h4 className="text-lg font-semibold text-white mb-3">Características principales</h4>
                <ul className="space-y-2 mb-6">
                  {producto.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{caracteristica}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="aspect-w-16 aspect-h-9 mt-8">
                  <img 
                    src="/img/omenmax.png" 
                    alt="OMEN 45L en detalle" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
            
            {tabActivo === 'especificaciones' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Especificaciones técnicas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-b border-gray-800 pb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Procesador</h4>
                      <p className="text-white">{producto.especificaciones.procesador}</p>
                    </div>
                    <div className="border-b border-gray-800 pb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Tarjeta gráfica</h4>
                      <p className="text-white">{producto.especificaciones.grafica}</p>
                    </div>
                    <div className="border-b border-gray-800 pb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Memoria RAM</h4>
                      <p className="text-white">{producto.especificaciones.memoria}</p>
                    </div>
                    <div className="border-b border-gray-800 pb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Almacenamiento</h4>
                      <p className="text-white">{producto.especificaciones.almacenamiento}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-800 pb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Refrigeración</h4>
                      <p className="text-white">{producto.especificaciones.refrigeracion}</p>
                    </div>
                    <div className="border-b border-gray-800 pb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Fuente de alimentación</h4>
                      <p className="text-white">{producto.especificaciones.fuente}</p>
                    </div>
                    <div className="border-b border-gray-800 pb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Sistema operativo</h4>
                      <p className="text-white">{producto.especificaciones.sistema}</p>
                    </div>
                    <div className="border-b border-gray-800 pb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Dimensiones (Al x An x Pr)</h4>
                      <p className="text-white">{producto.especificaciones.dimensiones}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {tabActivo === 'preguntas' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Preguntas frecuentes</h3>
                
                <div className="space-y-4">
                  {producto.preguntas.map((item) => (
                    <div key={item.id} className="border border-gray-800 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => togglePregunta(item.id)}
                        className="flex justify-between items-center w-full px-6 py-4 text-left"
                      >
                        <span className="font-medium text-white">{item.pregunta}</span>
                        {preguntasAbiertas[item.id] ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </button>
                      
                      {preguntasAbiertas[item.id] && (
                        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
                          <p className="text-gray-300">{item.respuesta}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">¿Tienes más preguntas?</h4>
                  <p className="text-gray-300 mb-4">No dudes en contactarnos si necesitas más información sobre este producto.</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all">
                    Contactar soporte
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Productos relacionados */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Productos relacionados</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {producto.productosRelacionados.map((prod) => (
            <div key={prod.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gray-800 flex items-center justify-center">
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  className="h-full w-full object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{prod.nombre}</h3>
                <p className="text-red-500 font-bold mt-1">${prod.precio.toLocaleString()}</p>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all text-sm">
                    Añadir al carrito
                  </button>
                  <button className="px-3 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all text-sm">
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductoPage;
