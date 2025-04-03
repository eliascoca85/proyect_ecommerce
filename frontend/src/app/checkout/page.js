"use client";

import React, { useState } from 'react';
import { FaShoppingCart, FaArrowLeft, FaCreditCard, FaPaypal, FaMoneyBill, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useCarrito } from '../../actions/carritoActions';
import { createCheckoutSession } from '../../api/stripe';
import { useRouter } from 'next/navigation';

// URL base para imágenes
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Checkout = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
    metodoPago: 'tarjeta'
  });

  // Access carrito context
  const { items, total: cartTotal, carritoId, vaciarCarrito } = useCarrito();

  // Replace hardcoded cartItems with items from context
  const cartItems = items;

  // Create a helper function to safely format prices
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0.00';
    return Number(price).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate subtotal safely
  const subtotal = cartItems.reduce((total, item) => {
    const precio = parseFloat(item.precio_unitario) || 0;
    const cantidad = parseInt(item.cantidad) || 0;
    return total + (precio * cantidad);
  }, 0);
  const impuestos = subtotal * 0.21; // 21% IVA
  const envio = 15.99;
  const totalPedido = subtotal + impuestos + envio;

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('No hay productos en el carrito');
      return;
    }
    
    // Validar el carritoId
    if (!carritoId) {
      console.error('Error: carritoId no disponible:', carritoId);
      setError('ID de carrito no disponible. Por favor, intenta recargar la página.');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      console.log('Datos para el checkout:', { 
        items: cartItems, 
        carritoId, 
        formData,
        total: totalPedido
      });
      
      // Verificar que todos los items tengan los campos requeridos
      const itemsValidados = cartItems.map(item => ({
        ...item,
        nombre: item.nombre || 'Producto sin nombre',
        precio_unitario: parseFloat(item.precio_unitario) || 0,
        cantidad: parseInt(item.cantidad) || 1
      }));
      
      // Crear sesión de checkout con Stripe
      const session = await createCheckoutSession(itemsValidados, carritoId, formData);
      
      if (session && session.url) {
        // Redirigir a la página de checkout de Stripe
        window.location.href = session.url;
      } else {
        throw new Error('No se recibió una URL de checkout válida');
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      
      // Mostrar un mensaje de error más específico si es posible
      if (err.response && err.response.data && err.response.data.error) {
        setError(`Error: ${err.response.data.error}`);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('No se pudo procesar el pago. Por favor, inténtalo de nuevo.');
      }
      
      setIsProcessing(false);
    }
  };

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
            <div className="flex items-center space-x-4">
            <Link className='hover:animate-pulse' href="/catalogo">
              <button  className="flex items-center text-gray-400 hover:text-white transition-colors">
                <FaArrowLeft className="mr-2" />
                
                <span>Volver a la tienda</span>
              </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Mensajes de error */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulario de checkout */}
          <div className="lg:w-2/3">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FaShoppingCart className="mr-2 text-red-500" />
                Finalizar Compra
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-800">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="nombre">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full py-2 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="apellido">
                        Apellido
                      </label>
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="w-full py-2 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full py-2 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-800">Dirección de Envío</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="direccion">
                        Dirección
                      </label>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full py-2 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="ciudad">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        className="w-full py-2 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="codigoPostal">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        className="w-full py-2 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="pais">
                        País
                      </label>
                      <select
                        id="pais"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        className="w-full py-2 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="España">España</option>
                        <option value="México">México</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Chile">Chile</option>
                        <option value="Bolivia">Bolivia</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-800">Método de Pago</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="tarjeta"
                        name="metodoPago"
                        value="tarjeta"
                        checked={formData.metodoPago === 'tarjeta'}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-700 bg-gray-800"
                      />
                      <label htmlFor="tarjeta" className="ml-2 flex items-center text-white">
                        <FaCreditCard className="mr-2 text-red-500" /> Tarjeta de Crédito/Débito
                      </label>
                    </div>
                    {/* Otros métodos de pago (deshabilitados para esta implementación) */}
                    <div className="flex items-center opacity-50 cursor-not-allowed">
                      <input
                        type="radio"
                        id="paypal"
                        name="metodoPago"
                        value="paypal"
                        disabled
                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-700 bg-gray-800"
                      />
                      <label htmlFor="paypal" className="ml-2 flex items-center text-white">
                        <FaPaypal className="mr-2 text-blue-500" /> PayPal (No disponible)
                      </label>
                    </div>
                    <div className="flex items-center opacity-50 cursor-not-allowed">
                      <input
                        type="radio"
                        id="transferencia"
                        name="metodoPago"
                        value="transferencia"
                        disabled
                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-700 bg-gray-800"
                      />
                      <label htmlFor="transferencia" className="ml-2 flex items-center text-white">
                        <FaMoneyBill className="mr-2 text-green-500" /> Transferencia Bancaria (No disponible)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isProcessing || cartItems.length === 0}
                    className={`w-full py-3 px-6 ${isProcessing || cartItems.length === 0 ? 'bg-gray-600' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'} text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors flex items-center justify-center`}
                  >
                    {isProcessing ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : cartItems.length === 0 ? (
                      'Carrito vacío'
                    ) : (
                      'Pagar con Stripe'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg sticky top-6">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No hay productos en el carrito
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id_detalle_carrito} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imagen ? (
                          <img 
                            src={`${API_URL}${item.imagen}`} 
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.nombre}</h3>
                        <p className="text-xs text-gray-400">Cantidad: {item.cantidad}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${formatPrice(item.precio_unitario)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="space-y-2 py-4 border-t border-b border-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Impuestos (21%)</span>
                  <span>${formatPrice(impuestos)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío</span>
                  <span>${formatPrice(envio)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold text-red-500">${formatPrice(totalPedido)}</span>
              </div>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>Al completar tu pedido, aceptas nuestros <a href="#" className="text-red-500 hover:underline">Términos y Condiciones</a> y nuestra <a href="#" className="text-red-500 hover:underline">Política de Privacidad</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
