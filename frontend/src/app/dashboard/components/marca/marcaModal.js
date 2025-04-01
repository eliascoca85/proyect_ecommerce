import React, { useState, useEffect } from 'react';
import { marcaAPI } from '../../../../api/client';
import { FaTimes, FaUpload, FaSpinner, FaImage } from 'react-icons/fa';

const MarcaModal = ({ marca, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    logo: null
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Inicializar el formulario con los datos de la marca si estamos editando
  useEffect(() => {
    if (marca) {
      setFormData({
        nombre: marca.nombre || '',
        logo: null // No cargamos la imagen existente como File
      });
      
      // Si la marca tiene logo, mostrarlo como preview
      if (marca.logo) {
        setPreviewImage(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${marca.logo}`);
      }
    }
  }, [marca]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setFormData({
          ...formData,
          logo: file
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
      const marcaData = {
        ...formData,
        logo: imageFile // Usar el archivo de imagen si se seleccionó uno
      };
      
      let result;
      
      if (marca) {
        // Actualizar marca existente
        result = await marcaAPI.update(marca.id_marca, marcaData);
        onClose(result, true);
      } else {
        // Crear nueva marca
        result = await marcaAPI.create(marcaData);
        onClose(result, false);
      }
    } catch (err) {
      console.error('Error al guardar marca:', err);
      setError('Error al guardar la marca. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header del modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {marca ? 'Editar Marca' : 'Nueva Marca'}
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
            {/* Nombre de la marca */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre de la marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nombre de la marca"
              />
            </div>
            
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Logo de la marca
              </label>
              
              <div className="flex flex-col gap-4 items-center">
                {/* Previsualización de imagen */}
                <div className="w-32 h-32 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center bg-gray-800">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Vista previa" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FaImage className="text-gray-600 text-4xl" />
                  )}
                </div>
                
                {/* Input de archivo */}
                <div className="w-full">
                  <label className="flex flex-col items-center px-4 py-6 bg-gray-800 rounded-lg border border-dashed border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors">
                    <FaUpload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-400">
                      Haz clic para seleccionar un logo
                    </span>
                    <input
                      type="file"
                      name="logo"
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

export default MarcaModal;
