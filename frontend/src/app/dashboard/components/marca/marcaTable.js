import React, { useState, useEffect } from 'react';
import { marcaAPI } from '../../../../api/client';
import MarcaModal from './marcaModal';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSpinner } from 'react-icons/fa';

const MarcaTable = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMarca, setCurrentMarca] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar marcas
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        setLoading(true);
        const marcasData = await marcaAPI.getAll();
        setMarcas(marcasData);
        setError(null);
      } catch (err) {
        setError('Error al cargar las marcas. Por favor, intenta de nuevo.');
        console.error('Error fetching marcas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

  // Filtrar marcas por búsqueda
  const filteredMarcas = marcas.filter(marca => 
    marca.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear nueva marca
  const handleAddNew = () => {
    setCurrentMarca(null);
    setShowModal(true);
  };

  // Abrir modal para editar marca
  const handleEdit = (marca) => {
    setCurrentMarca(marca);
    setShowModal(true);
  };

  // Eliminar marca
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
      try {
        await marcaAPI.delete(id);
        setMarcas(marcas.filter(marca => marca.id_marca !== id));
      } catch (err) {
        setError('Error al eliminar la marca. Por favor, intenta de nuevo.');
        console.error('Error deleting marca:', err);
      }
    }
  };

  // Manejar cierre del modal y actualización de datos
  const handleModalClose = (newMarca = null, isUpdate = false) => {
    setShowModal(false);
    
    // Si se creó o actualizó una marca, actualizar la lista
    if (newMarca) {
      if (isUpdate) {
        setMarcas(marcas.map(m => 
          m.id_marca === newMarca.id_marca ? newMarca : m
        ));
      } else {
        setMarcas([...marcas, newMarca]);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <FaSpinner className="animate-spin text-red-500 text-4xl" />
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Gestión de Marcas</h2>
      
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {/* Barra de herramientas */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Búsqueda */}
            <div className="relative w-full sm:w-auto flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-400" />
              </span>
              <input 
                type="text" 
                placeholder="Buscar marcas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            {/* Botón para añadir */}
            <button
              onClick={handleAddNew}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2 transition-colors"
            >
              <FaPlus />
              <span>Añadir Marca</span>
            </button>
          </div>
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="mx-6 mt-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Tabla de marcas */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900">
              {filteredMarcas.length > 0 ? (
                filteredMarcas.map(marca => (
                  <tr key={marca.id_marca} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {marca.logo ? (
                        <img 
                          src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${marca.logo}`} 
                          alt={marca.nombre}
                          className="w-12 h-12 object-contain rounded-lg border border-gray-700"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 border border-gray-700">
                          Logo
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{marca.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(marca)}
                          className="p-2 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30 rounded-full transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(marca.id_marca)}
                          className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-30 rounded-full transition-colors"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-400">
                    No se encontraron marcas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación (ejemplo) */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
          <div className="text-sm text-gray-400">
            Mostrando <span className="font-medium text-white">{filteredMarcas.length}</span> marcas
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700">Anterior</button>
            <button className="px-3 py-1 rounded bg-red-600 text-white">1</button>
            <button className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700">2</button>
            <button className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700">Siguiente</button>
          </div>
        </div>
      </div>
      
      {/* Modal para crear/editar marca */}
      {showModal && (
        <MarcaModal
          marca={currentMarca}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default MarcaTable;
