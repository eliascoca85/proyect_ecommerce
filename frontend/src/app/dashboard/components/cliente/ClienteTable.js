"use client";

import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import ClienteModal from './ClienteModal';
const ClienteTable = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/usuarios', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('No se pudieron cargar los clientes');
        }
        
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        console.error('Error al cargar clientes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientes();
  }, [refreshTrigger]);

  // Abrir modal para editar
  const handleEdit = (cliente) => {
    setCurrentCliente(cliente);
    setShowModal(true);
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setCurrentCliente(null);
    setShowModal(true);
  };

  // Eliminar cliente
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro que deseas eliminar este cliente?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('No se pudo eliminar el cliente');
      }
      
      // Actualizar la lista
      setRefreshTrigger(prev => prev + 1);
      alert('Cliente eliminado con éxito');
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Clientes</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all flex items-center"
        >
          <FaUserPlus className="mr-2" /> Nuevo Cliente
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
        {loading ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando clientes...</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Registro</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {clientes.map((cliente) => (
                  <tr key={cliente.id_persona} className="hover:bg-gray-800">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{cliente.id_persona}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{cliente.nombre_completo}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{cliente.correo}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{cliente.telefono || 'No especificado'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cliente.rol === 'Administrador' 
                          ? 'bg-purple-900 text-purple-300' 
                          : 'bg-green-900 text-green-300'
                      }`}>
                        {cliente.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatDate(cliente.fecha_creacion)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-3">
                      <button 
                        onClick={() => handleEdit(cliente)}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(cliente.id_persona)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {clientes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No hay clientes registrados</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal para crear/editar cliente */}
      {showModal && (
        <ClienteModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          cliente={currentCliente}
          onRefresh={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}
    </div>
  );
};

export default ClienteTable;