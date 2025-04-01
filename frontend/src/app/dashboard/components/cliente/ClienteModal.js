"use client";

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ClienteModal = ({ isOpen, onClose, cliente, onRefresh }) => {
  const initialFormData = {
    nombre_completo: '',
    correo: '',
    clave: '',
    rol: 'Cliente',
    telefono: '',
    direccion_calle: '',
    direccion_ciudad: '',
    direccion_codigo_postal: '',
    direccion_pais: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar datos del cliente si estamos editando
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre_completo: cliente.nombre_completo || '',
        correo: cliente.correo || '',
        clave: '', // No mostramos la contraseña actual
        rol: cliente.rol || 'Cliente',
        telefono: cliente.telefono || '',
        direccion_calle: cliente.direccion_calle || '',
        direccion_ciudad: cliente.direccion_ciudad || '',
        direccion_codigo_postal: cliente.direccion_codigo_postal || '',
        direccion_pais: cliente.direccion_pais || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [cliente]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error para este campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre_completo) newErrors.nombre_completo = 'El nombre es obligatorio';
    if (!formData.correo) newErrors.correo = 'El email es obligatorio';
    if (!formData.correo.includes('@')) newErrors.correo = 'Email inválido';
    
    // Si es nuevo usuario o se está intentando cambiar la contraseña
    if (!cliente || formData.clave) {
      if (!cliente && !formData.clave) newErrors.clave = 'La contraseña es obligatoria';
      if (formData.clave && formData.clave.length < 6) newErrors.clave = 'Mínimo 6 caracteres';
    }
    
    if (!formData.rol) newErrors.rol = 'El rol es obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Crear objeto con datos a enviar
      const dataToSend = { ...formData };
      
      // Si estamos editando y no se ha ingresado una nueva contraseña, no la enviamos
      if (cliente && !dataToSend.clave) {
        delete dataToSend.clave;
      }
      
      const url = cliente 
        ? `http://localhost:5000/api/admin/usuarios/${cliente.id_persona}`
        : 'http://localhost:5000/api/admin/usuarios';
        
      const response = await fetch(url, {
        method: cliente ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar la solicitud');
      }
      
      // Actualizar lista de clientes
      onRefresh();
      
      // Cerrar modal
      onClose();
      
      // Mostrar mensaje de éxito
      alert(`Cliente ${cliente ? 'actualizado' : 'creado'} con éxito`);
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {errors.nombre_completo && (
                <p className="mt-1 text-sm text-red-500">{errors.nombre_completo}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Correo electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {errors.correo && (
                <p className="mt-1 text-sm text-red-500">{errors.correo}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {cliente ? 'Nueva contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
              </label>
              <input
                type="password"
                name="clave"
                value={formData.clave}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {errors.clave && (
                <p className="mt-1 text-sm text-red-500">{errors.clave}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="Cliente">Cliente</option>
                <option value="Administrador">Administrador</option>
              </select>
              {errors.rol && (
                <p className="mt-1 text-sm text-red-500">{errors.rol}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          {/* Información de dirección */}
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-lg font-medium text-white mb-3">Información de dirección</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Calle y número
                </label>
                <input
                  type="text"
                  name="direccion_calle"
                  value={formData.direccion_calle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="direccion_ciudad"
                    value={formData.direccion_ciudad}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="direccion_codigo_postal"
                    value={formData.direccion_codigo_postal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  País
                </label>
                <input
                  type="text"
                  name="direccion_pais"
                  value={formData.direccion_pais}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando...
                </>
              ) : cliente ? 'Actualizar Cliente' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteModal;