import React, { useState, useEffect } from 'react';
import { productoAPI } from '../../../../api/client';
import { FaTimes, FaUpload, FaSpinner, FaImage } from 'react-icons/fa';

const ProductoModal = ({ producto, marcas, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    id_marca: '',
    precio: '',
    precio_oferta: '',
    cantidad: '',
    imagen: null
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Inicializar el formulario con los datos del producto si estamos editando
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        id_marca: producto.id_marca || '',
        precio: producto.precio || '',
        precio_oferta: producto.precio_oferta || '',
        cantidad: producto.cantidad || '',
        imagen: null // No cargamos la imagen existente como File
      });
      
      // Si el producto tiene imagen, mostrarla como preview
      if (producto.imagen) {
        setPreviewImage(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${producto.imagen}`);
      }
    }
  }, [producto]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setFormData({
          ...formData,
          imagen: file
        });
        
        // Crear URL para previsualizar la imagen
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos para enviar
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        precio_oferta: formData.precio_oferta ? parseFloat(formData.precio_oferta) : null,
        cantidad: parseInt(formData.cantidad),
        id_marca: formData.id_marca ? parseInt(formData.id_marca) : null,
        imagen: imageFile // Usar el archivo de imagen si se seleccionó uno
      };
      
      let result;
      
      if (producto) {
        // Actualizar producto existente
        result = await productoAPI.update(producto.id_producto, productoData);
        onClose(result, true);
      } else {
        // Crear nuevo producto
        result = await productoAPI.create(productoData);
        onClose(result, false);
      }
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError('Error al guardar el producto. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header del modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button 
            onClick={() => onClose()}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="mx-6 mt-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Nombre del producto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre del producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nombre del producto"
              />
            </div>
            
            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Descripción del producto"
              ></textarea>
            </div>
            
            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Marca
              </label>
              <select
                name="id_marca"
                value={formData.id_marca}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Seleccionar marca</option>
                {marcas.map(marca => (
                  <option key={marca.id_marca} value={marca.id_marca}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Precios y cantidad en dos columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Precio <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              {/* Precio de oferta */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Precio de oferta
                </label>
                <input
                  type="number"
                  name="precio_oferta"
                  value={formData.precio_oferta}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              {/* Cantidad */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cantidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
            
            {/* Imagen */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen del producto
              </label>
              
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Previsualización de imagen */}
                <div className="w-40 h-40 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center bg-gray-800">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaImage className="text-gray-600 text-4xl" />
                  )}
                </div>
                
                {/* Input de archivo */}
                <div className="flex-1">
                  <label className="flex flex-col items-center px-4 py-6 bg-gray-800 rounded-lg border border-dashed border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors">
                    <FaUpload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-400">
                      Haz clic para seleccionar una imagen
                    </span>
                    <input
                      type="file"
                      name="imagen"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2 disabled:bg-red-800 disabled:opacity-70 transition-colors"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>Guardar</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;
