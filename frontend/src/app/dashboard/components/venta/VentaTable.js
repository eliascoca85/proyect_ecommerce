"use client";

import React, { useEffect, useState } from 'react';
import { FaEye, FaTruck, FaCheckCircle, FaTimesCircle, FaFileInvoice } from 'react-icons/fa';
import VentaDetalleModal from './VentaDetalleModal';

const VentaTable = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cargar ventas
  useEffect(() => {
    // Reemplaza la función fetchVentas con esta versión para depuración:

const fetchVentas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token utilizado:', token);
      
      // Primero prueba la ruta de test
      const testResponse = await fetch('http://localhost:5000/api/ventas/test');
      const testData = await testResponse.json();
      console.log('Respuesta de prueba:', testData);
      
      // Luego intenta la ruta principal
      const response = await fetch('http://localhost:5000/api/ventas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Código de estado:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error del servidor:', errorData);
        throw new Error(`No se pudieron cargar las ventas: ${errorData.message || response.status}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setVentas(data);
    } catch (err) {
      console.error('Error al cargar ventas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
    
    fetchVentas();
  }, [refreshTrigger]);

  // Ver detalles de una venta
  const handleVerDetalles = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/ventas/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('No se pudieron cargar los detalles de la venta');
      }
      
      const data = await response.json();
      setCurrentVenta(data);
      setShowModal(true);
    } catch (err) {
      console.error('Error al cargar detalles de la venta:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de una venta
  const handleCambiarEstado = async (id, nuevoEstado) => {
    if (!confirm(`¿Estás seguro que deseas cambiar el estado a "${nuevoEstado}"?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/ventas/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      
      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de la venta');
      }
      
      // Actualizar la lista
      setRefreshTrigger(prev => prev + 1);
      alert('Estado actualizado con éxito');
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
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

  // Renderizar icono según estado
  const renderEstadoIcon = (estado) => {
    switch (estado) {
      case 'Procesando':
        return <FaFileInvoice className="mr-1" />;
      case 'Enviado':
        return <FaTruck className="mr-1" />;
      case 'Completado':
        return <FaCheckCircle className="mr-1" />;
      case 'Cancelado':
        return <FaTimesCircle className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Ventas</h2>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
        {loading && !showModal ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando ventas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Método de Pago</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {ventas.map((venta) => (
                  <tr key={venta.id_venta} className="hover:bg-gray-800">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">#{venta.id_venta}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{venta.cliente_nombre || 'Cliente Anónimo'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatDate(venta.fecha_venta)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatCurrency(venta.total)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                        venta.estado === 'Completado' ? 'bg-green-900 text-green-300' : 
                        venta.estado === 'Enviado' ? 'bg-blue-900 text-blue-300' : 
                        venta.estado === 'Cancelado' ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {renderEstadoIcon(venta.estado)} {venta.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{venta.metodo_pago || 'Tarjeta'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                      <button 
                        onClick={() => handleVerDetalles(venta.id_venta)}
                        className="px-2 py-1 bg-blue-800 text-blue-300 rounded hover:bg-blue-700 transition-all inline-flex items-center"
                      >
                        <FaEye className="mr-1" /> Ver
                      </button>
                      
                      {venta.estado === 'Procesando' && (
                        <button 
                          onClick={() => handleCambiarEstado(venta.id_venta, 'Enviado')}
                          className="px-2 py-1 bg-indigo-800 text-indigo-300 rounded hover:bg-indigo-700 transition-all inline-flex items-center"
                        >
                          <FaTruck className="mr-1" /> Enviar
                        </button>
                      )}
                      
                      {venta.estado === 'Enviado' && (
                        <button 
                          onClick={() => handleCambiarEstado(venta.id_venta, 'Completado')}
                          className="px-2 py-1 bg-green-800 text-green-300 rounded hover:bg-green-700 transition-all inline-flex items-center"
                        >
                          <FaCheckCircle className="mr-1" /> Completar
                        </button>
                      )}
                      
                      {(venta.estado === 'Procesando') && (
                        <button 
                          onClick={() => handleCambiarEstado(venta.id_venta, 'Cancelado')}
                          className="px-2 py-1 bg-red-800 text-red-300 rounded hover:bg-red-700 transition-all inline-flex items-center"
                        >
                          <FaTimesCircle className="mr-1" /> Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {ventas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No hay ventas registradas</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal para ver detalles de venta */}
      {showModal && currentVenta && (
        <VentaDetalleModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          venta={currentVenta.venta}
          detalles={currentVenta.detalles}
        />
      )}
    </div>
  );
};

export default VentaTable;