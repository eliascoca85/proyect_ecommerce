"use client";

import React from 'react';
import { FaTimes, FaFileInvoice, FaUserCircle, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

const VentaDetalleModal = ({ isOpen, onClose, venta, detalles }) => {
  if (!isOpen || !venta) return null;

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Color según estado
  const getEstadoColor = () => {
    switch (venta.estado) {
      case 'Completado': return 'bg-green-900 text-green-300';
      case 'Enviado': return 'bg-blue-900 text-blue-300';
      case 'Procesando': return 'bg-yellow-900 text-yellow-300';
      case 'Cancelado': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FaFileInvoice className="mr-2" /> Detalles de la Venta #{venta.id_venta}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Información general de la venta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                <FaUserCircle className="mr-2 text-red-500" /> Información del Cliente
              </h4>
              <p className="text-gray-300"><span className="font-medium text-white">Cliente:</span> {venta.cliente_nombre || 'Cliente Anónimo'}</p>
              <p className="text-gray-300"><span className="font-medium text-white">ID Cliente:</span> {venta.id_cliente || 'N/A'}</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                <FaCalendarAlt className="mr-2 text-red-500" /> Información de la Venta
              </h4>
              <p className="text-gray-300"><span className="font-medium text-white">Fecha:</span> {formatDate(venta.fecha_venta)}</p>
              <p className="text-gray-300"><span className="font-medium text-white">Estado:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor()}`}>
                  {venta.estado}
                </span>
              </p>
              <p className="text-gray-300"><span className="font-medium text-white">Método de Pago:</span> 
                <span className="ml-1 flex items-center">
                  <FaCreditCard className="mr-1 text-red-500" /> {venta.metodo_pago || 'Tarjeta'}
                </span>
              </p>
            </div>
          </div>
          
          {/* Detalles de los productos */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-white mb-3">Productos</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio Unitario</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {detalles.map((detalle) => (
                    <tr key={detalle.id_detalle_venta} className="hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{detalle.producto_nombre}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatCurrency(detalle.precio_unitario)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{detalle.cantidad}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatCurrency(detalle.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-700">
                    <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-white">Total:</td>
                    <td className="px-4 py-3 text-sm font-bold text-white">{formatCurrency(venta.total)}</td>
                  </tr>
                </tfoot>
              </table>
              
              {detalles.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-400">No hay productos en esta venta</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Botón para cerrar */}
        <div className="flex justify-end p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleModal;