"use client";

import React, { useState } from 'react';
import { FaShoppingCart, FaArrowLeft, FaCreditCard, FaPaypal, FaMoneyBill } from 'react-icons/fa';
import Link from 'next/link';
const Checkout = () => {
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

  // Estado para los productos en el carrito
  const [cartItems] = useState([
    { id: 1, nombre: "RTX 4070 Ti", precio: 899.99, cantidad: 1, imagen: "/img/omenmax.png" },
    { id: 3, nombre: "ASUS ROG Strix Z790", precio: 429.99, cantidad: 1, imagen: "/img/omenmax.png" },
  ]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const impuestos = subtotal * 0.21; // 21% IVA
  const envio = 15.99;
  const total = subtotal + impuestos + envio;

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del pedido:', { formData, productos: cartItems, total });
    // Aquí iría la lógica para procesar el pago
    alert('¡Pedido realizado con éxito!');
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
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="metodoPago"
                        value="paypal"
                        checked={formData.metodoPago === 'paypal'}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-700 bg-gray-800"
                      />
                      <label htmlFor="paypal" className="ml-2 flex items-center text-white">
                        <FaPaypal className="mr-2 text-blue-500" /> PayPal
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transferencia"
                        name="metodoPago"
                        value="transferencia"
                        checked={formData.metodoPago === 'transferencia'}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-700 bg-gray-800"
                      />
                      <label htmlFor="transferencia" className="ml-2 flex items-center text-white">
                        <FaMoneyBill className="mr-2 text-green-500" /> Transferencia Bancaria
                      </label>
                    </div>
                  </div>
                </div>

                {formData.metodoPago === 'tarjeta' && (
                  <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-md font-medium mb-4">Detalles de la Tarjeta</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Número de Tarjeta
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Fecha de Expiración
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="MM/AA"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Código de Seguridad (CVV)
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg shadow-md hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                  >
                    Completar Pedido
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
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.imagen} 
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.nombre}</h3>
                      <p className="text-xs text-gray-400">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.precio.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 py-4 border-t border-b border-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Impuestos (21%)</span>
                  <span>${impuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío</span>
                  <span>${envio.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold text-red-500">${total.toFixed(2)}</span>
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
