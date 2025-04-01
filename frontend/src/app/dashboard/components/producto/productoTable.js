import React, { useState, useEffect } from 'react';
import { productoAPI, marcaAPI } from '../../../../api/client';
import ProductoModal from './productoModal';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';

const ProductoTable = () => {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');

  // Cargar productos y marcas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosData, marcasData] = await Promise.all([
          productoAPI.getAll(),
          marcaAPI.getAll()
        ]);
        setProductos(productosData);
        setMarcas(marcasData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar productos por búsqueda y marca
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMarca = selectedMarca ? producto.id_marca === parseInt(selectedMarca) : true;
    return matchesSearch && matchesMarca;
  });

  // Abrir modal para crear nuevo producto
  const handleAddNew = () => {
    setCurrentProducto(null);
    setShowModal(true);
  };

  // Abrir modal para editar producto
  const handleEdit = (producto) => {
    setCurrentProducto(producto);
    setShowModal(true);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productoAPI.delete(id);
        setProductos(productos.filter(producto => producto.id_producto !== id));
      } catch (err) {
        setError('Error al eliminar el producto. Por favor, intenta de nuevo.');
        console.error('Error deleting product:', err);
      }
    }
  };

  // Manejar cierre del modal y actualización de datos
  const handleModalClose = (newProducto = null, isUpdate = false) => {
    setShowModal(false);
    
    // Si se creó o actualizó un producto, actualizar la lista
    if (newProducto) {
      if (isUpdate) {
        setProductos(productos.map(p => 
          p.id_producto === newProducto.id_producto ? newProducto : p
        ));
      } else {
        setProductos([...productos, newProducto]);
      }
    }
  };

  // Formatear precio para mostrar
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  // Obtener nombre de marca por ID
  const getMarcaName = (marcaId) => {
    const marca = marcas.find(m => m.id_marca === marcaId);
    return marca ? marca.nombre : 'Sin marca';
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <FaSpinner className="animate-spin text-red-500 text-4xl" />
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Gestión de Productos</h2>
      
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {/* Barra de herramientas */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Búsqueda */}
            <div className="relative w-full md:w-auto flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-400" />
              </span>
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            {/* Filtro de marca */}
            <div className="w-full md:w-auto flex-1 md:flex-none">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaFilter className="text-gray-400" />
                </span>
                <select
                  value={selectedMarca}
                  onChange={(e) => setSelectedMarca(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                >
                  <option value="">Todas las marcas</option>
                  {marcas.map(marca => (
                    <option key={marca.id_marca} value={marca.id_marca}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Botón para añadir nuevo producto */}
            <button
              onClick={handleAddNew}
              className="w-full md:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaPlus /> Nuevo Producto
            </button>
          </div>
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="mx-6 mt-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Oferta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900">
              {filteredProductos.length > 0 ? (
                filteredProductos.map(producto => (
                  <tr key={producto.id_producto} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.imagen ? (
                        <img 
                          src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${producto.imagen}`} 
                          alt={producto.nombre}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 border border-gray-700">
                          Sin imagen
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{producto.nombre}</div>
                      {producto.descripcion && (
                        <div className="text-sm text-gray-400 truncate max-w-xs">
                          {producto.descripcion}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {getMarcaName(producto.id_marca)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {formatPrice(producto.precio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {producto.precio_oferta ? (
                        <span className="text-green-400 font-medium">
                          {formatPrice(producto.precio_oferta)}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.cantidad > 10 ? 'bg-green-900 text-green-300' : 
                        producto.cantidad > 0 ? 'bg-yellow-900 text-yellow-300' : 
                        'bg-red-900 text-red-300'
                      }`}>
                        {producto.cantidad} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="p-2 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30 rounded-full transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id_producto)}
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
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación (ejemplo) */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
          <div className="text-sm text-gray-400">
            Mostrando <span className="font-medium text-white">{filteredProductos.length}</span> productos
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700">Anterior</button>
            <button className="px-3 py-1 rounded bg-red-600 text-white">1</button>
            <button className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700">2</button>
            <button className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700">3</button>
            <button className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700">Siguiente</button>
          </div>
        </div>
      </div>
      
      {/* Modal para crear/editar producto */}
      {showModal && (
        <ProductoModal
          producto={currentProducto}
          marcas={marcas}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ProductoTable;
