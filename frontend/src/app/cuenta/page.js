"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaShoppingBag, FaHeart, FaAddressCard, FaKey, FaSignOutAlt, FaEdit, FaDownload } from 'react-icons/fa';

// Componente para los enlaces del sidebar
const SidebarLink = ({ icon, text, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-gradient-to-r from-red-600 to-red-500 text-white' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{text}</span>
    </button>
  );
};

const CuentaPage = () => {

  // Estado para controlar la sección activa
  const [activeSection, setActiveSection] = useState('perfil');

  // Estados para manejar datos del usuario y autenticación
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el formulario de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  // Agregar estos estados al inicio de tu componente CuentaPage
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [errorPedidos, setErrorPedidos] = useState(null);

  // Estados para manejar la edición de formularios
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: {
      calle: '',
      ciudad: '',
      codigoPostal: '',
      pais: ''
    }
  });
  
  const router = useRouter();

  // Obtener datos del usuario autenticado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener token del localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          // Si no hay token, redirigir al login
          router.push('/login');
          return;
        }
        
        // Obtener ID del usuario del localStorage
        const userInfo = JSON.parse(localStorage.getItem('user'));
        
        if (!userInfo || !userInfo.id) {
          throw new Error('Información de usuario no disponible');
        }

        // Hacer petición al backend para obtener datos completos del usuario
        const response = await fetch(`http://localhost:5000/api/auth/usuarios/${userInfo.id}/perfil-completo`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener la información del usuario');
        }

        const data = await response.json();
        // Añadir aquí:
        console.log("Estructura de datos.user:", data.user);
        console.log("Estructura de dirección:", data.user.direccion || data.user || {});
        console.log("Datos recibidos de la API:", data); // Añade esta línea para ver los datos
        
        // Estructura de datos esperada del backend
        setUserData({
          nombre: data.user.nombre || userInfo.nombre,
          email: data.user.correo || userInfo.correo,
          telefono: data.user.telefono || "+34 000 000 000",
          fechaRegistro: new Date().toLocaleDateString(),
          direccion: {
            // Intenta diferentes formas de acceder a los datos de dirección
            calle: data.user.direccion?.calle || 
                   data.user.direccion_calle || 
                   data.user.calle || 
                   "No especificada",
            ciudad: data.user.direccion?.ciudad || 
                    data.user.direccion_ciudad || 
                    data.user.ciudad || 
                    "No especificada",
            codigoPostal: data.user.direccion?.codigoPostal || 
                          data.user.direccion_codigo_postal || 
                          data.user.codigo_postal || 
                          "No especificado",
            pais: data.user.direccion?.pais || 
                  data.user.direccion_pais || 
                  data.user.pais || 
                  "No especificado"
          }
        });
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos de usuario:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Función para manejar el cierre de sesión
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

// Función para iniciar modo edición de información personal
const startEditingInfo = () => {
  setEditFormData({
    ...editFormData,
    nombre: userData.nombre,
    email: userData.email,
    telefono: userData.telefono
  });
  setIsEditingInfo(true);
};

// Función para iniciar modo edición de dirección
const startEditingAddress = () => {
  setEditFormData({
    ...editFormData,
    direccion: {
      ...userData.direccion
    }
  });
  setIsEditingAddress(true);
};

// Función para manejar cambios en los inputs de información
const handleInfoChange = (e) => {
  setEditFormData({
    ...editFormData,
    [e.target.name]: e.target.value
  });
};

// Función para manejar cambios en los inputs de dirección
const handleAddressChange = (e) => {
  setEditFormData({
    ...editFormData,
    direccion: {
      ...editFormData.direccion,
      [e.target.name]: e.target.value
    }
  });
};

// Función para manejar cambios en los inputs de contraseña
const handlePasswordChange = (e) => {
  setPasswordForm({
    ...passwordForm,
    [e.target.name]: e.target.value
  });
  
  // Limpiar mensajes previos
  setPasswordError('');
  setPasswordSuccess('');
};

// Función para actualizar contraseña
const handleUpdatePassword = async (e) => {
  e.preventDefault();
  
  // Validar que la nueva contraseña y la confirmación sean iguales
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setPasswordError('La nueva contraseña y su confirmación no coinciden');
    return;
  }
  
  // Validar que la nueva contraseña tenga al menos 6 caracteres
  if (passwordForm.newPassword.length < 6) {
    setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('user'));
    
    const response = await fetch(`http://localhost:5000/api/auth/usuarios/${userInfo.id}/actualizar-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        claveActual: passwordForm.currentPassword,
        nuevaClave: passwordForm.newPassword
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar contraseña');
    }
    
    // Mostrar mensaje de éxito
    setPasswordSuccess('Contraseña actualizada correctamente');
    
    // Limpiar formulario
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    setPasswordError(error.message || 'Error al actualizar la contraseña');
  }
};

// Añadir esta función para cargar pedidos
const cargarPedidos = async () => {
  if (activeSection !== 'pedidos') return;
  
  try {
    setLoadingPedidos(true);
    setErrorPedidos(null);
    
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !userInfo || !userInfo.id) {
      throw new Error('No hay información de sesión disponible');
    }
    
    const response = await fetch(`http://localhost:5000/api/ventas/usuario/${userInfo.id}/pedidos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('No se pudieron obtener los pedidos');
    }
    
    const data = await response.json();
    setPedidos(data.pedidos || []);
    
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    setErrorPedidos(error.message);
  } finally {
    setLoadingPedidos(false);
  }
};


// Añadir este useEffect para cargar los pedidos cuando se cambia a esa sección
useEffect(() => {
  if (activeSection === 'pedidos') {
    cargarPedidos();
  }
}, [activeSection]);


// Función para guardar cambios de información personal
// Función para guardar cambios de información personal
const saveUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('user'));
    
    const response = await fetch(`http://localhost:5000/api/auth/usuarios/${userInfo.id}/actualizar-perfil`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: editFormData.nombre,
        correo: editFormData.email,
        telefono: editFormData.telefono
      })
    });
    
    if (!response.ok) {
      throw new Error('No se pudo actualizar la información');
    }
    
    // Actualizar el estado local con los nuevos datos
    setUserData({
      ...userData,
      nombre: editFormData.nombre,
      email: editFormData.email,
      telefono: editFormData.telefono
    });
    
    // Actualizar también la información en localStorage
    const updatedUserInfo = {
      ...userInfo,
      nombre: editFormData.nombre
    };
    localStorage.setItem('user', JSON.stringify(updatedUserInfo));
    
    // Salir del modo edición
    setIsEditingInfo(false);
    
    // Mostrar notificación de éxito
    alert('Información actualizada correctamente');
    
  } catch (error) {
    console.error('Error al actualizar información:', error);
    alert('Error al actualizar la información');
  }
};

// Función para guardar cambios de dirección
const saveUserAddress = async () => {
  try {
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('user'));
    
    const response = await fetch(`http://localhost:5000/api/auth/usuarios/${userInfo.id}/actualizar-direccion`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        direccion_calle: editFormData.direccion.calle,
        direccion_ciudad: editFormData.direccion.ciudad,
        direccion_codigo_postal: editFormData.direccion.codigoPostal,
        direccion_pais: editFormData.direccion.pais
      })
    });
    
    if (!response.ok) {
      throw new Error('No se pudo actualizar la dirección');
    }
    
    // Actualizar el estado local con los nuevos datos
    setUserData({
      ...userData,
      direccion: {
        ...editFormData.direccion
      }
    });
    
    // Salir del modo edición
    setIsEditingAddress(false);
    
    // Mostrar notificación de éxito
    alert('Dirección actualizada correctamente');
    
  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    alert('Error al actualizar la dirección');
  }
};

  // Datos de ejemplo de pedidos (en un proyecto real, esto vendría de una API)
  

  // Si está cargando, mostrar spinner o mensaje
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Cargando información de usuario...</p>
        </div>
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center bg-gray-900 p-8 rounded-xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Error al cargar datos</h1>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }
  const renderContent = () => {
    switch (activeSection) {
      case 'perfil':
        return (
          <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
          
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-red-400 flex items-center justify-center text-white text-4xl font-bold mb-4 md:mb-0 md:mr-6">
                {userData?.nombre?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{userData?.nombre || "Usuario"}</h3>
                <p className="text-gray-400">Cliente desde {userData?.fechaRegistro || "..."}</p>
                <button className="mt-2 flex items-center text-red-500 hover:text-red-400">
                  <FaEdit className="mr-1" /> Editar foto de perfil
                </button>
              </div>
            </div>
            
            {/* Grid de 2 columnas para info personal y dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna de Información Personal */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Información Personal</h4>
                {!isEditingInfo ? (
                  <>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Nombre completo</p>
                        <p className="text-white">{userData?.nombre || "No especificado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Correo electrónico</p>
                        <p className="text-white">{userData?.email || "No especificado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Teléfono</p>
                        <p className="text-white">{userData?.telefono || "No especificado"}</p>
                      </div>
                    </div>
                    <button 
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all flex items-center"
                      onClick={startEditingInfo}
                    >
                      <FaEdit className="mr-2" /> Editar información
                    </button>
                  </>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400">Nombre completo</label>
                      <input
                        type="text"
                        name="nombre"
                        value={editFormData.nombre}
                        onChange={handleInfoChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400">Correo electrónico</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInfoChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400">Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={editFormData.telefono}
                        onChange={handleInfoChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={saveUserInfo}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingInfo(false)}
                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Columna de Dirección */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Dirección de Envío</h4>
                {!isEditingAddress ? (
                  <>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Dirección</p>
                        <p className="text-white">{userData?.direccion?.calle || "No especificada"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Ciudad</p>
                        <p className="text-white">{userData?.direccion?.ciudad || "No especificada"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Código Postal</p>
                        <p className="text-white">{userData?.direccion?.codigoPostal || "No especificado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">País</p>
                        <p className="text-white">{userData?.direccion?.pais || "No especificado"}</p>
                      </div>
                    </div>
                    <button 
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all flex items-center"
                      onClick={startEditingAddress}
                    >
                      <FaEdit className="mr-2" /> Editar dirección
                    </button>
                  </>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400">Dirección</label>
                      <input
                        type="text"
                        name="calle"
                        value={editFormData.direccion.calle}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400">Ciudad</label>
                      <input
                        type="text"
                        name="ciudad"
                        value={editFormData.direccion.ciudad}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400">Código Postal</label>
                      <input
                        type="text"
                        name="codigoPostal"
                        value={editFormData.direccion.codigoPostal}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400">País</label>
                      <input
                        type="text"
                        name="pais"
                        value={editFormData.direccion.pais}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={saveUserAddress}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      case 'pedidos':
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Mis Pedidos</h2>
              
              <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                {loadingPedidos ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando tus pedidos...</p>
                  </div>
                ) : errorPedidos ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">{errorPedidos}</p>
                    <button 
                      onClick={cargarPedidos} 
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pedido</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Productos</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {pedidos.map((pedido) => (
                            <tr key={pedido.id} className="hover:bg-gray-800">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{pedido.id}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{pedido.fecha}</td>
                              <td className="px-4 py-4 text-sm text-gray-300">
                                <div className="max-w-xs truncate" title={pedido.detalle}>
                                  {pedido.detalle || `${pedido.productos} productos`}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">${pedido.total.toLocaleString()}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  pedido.estado === 'Completado' ? 'bg-green-900 text-green-300' : 
                                  pedido.estado === 'Enviado' ? 'bg-blue-900 text-blue-300' : 
                                  'bg-yellow-900 text-yellow-300'
                                }`}>
                                  {pedido.estado}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                <button className="text-blue-500 hover:text-blue-400 mr-3 flex items-center">
                                  <FaDownload className="mr-1" /> Factura
                                </button>
                                <button 
                                  onClick={() => router.push(`/pedidos/${pedido.id}`)}
                                  className="text-red-500 hover:text-red-400 mt-1 flex items-center"
                                >
                                  Detalles
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {pedidos.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No tienes pedidos realizados todavía.</p>
                        <button 
                          onClick={() => router.push('/productos')}
                          className="mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
                        >
                          Explorar productos
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );

        case 'seguridad':
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Seguridad</h2>
              
              <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Cambiar Contraseña</h3>
                
                <form className="space-y-4" onSubmit={handleUpdatePassword}>
                  {passwordError && (
                    <div className="p-3 bg-red-900 border border-red-800 text-red-200 rounded-lg">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="p-3 bg-green-900 border border-green-800 text-green-200 rounded-lg">
                      {passwordSuccess}
                    </div>
                  )}
        
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-400 mb-1">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
                  >
                    Actualizar contraseña
                  </button>
                </form>
              </div>
            
            </div>
          );
      default:
        return <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-red-500">Mi Cuenta</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-900 rounded-xl shadow-lg p-6 h-fit">
            <nav className="space-y-2">
              <SidebarLink 
                icon={<FaUser />} 
                text="Mi Perfil" 
                active={activeSection === 'perfil'} 
                onClick={() => setActiveSection('perfil')} 
              />
              <SidebarLink 
                icon={<FaShoppingBag />} 
                text="Mis Pedidos" 
                active={activeSection === 'pedidos'} 
                onClick={() => setActiveSection('pedidos')} 
              />
              
              <SidebarLink 
                icon={<FaKey />} 
                text="Seguridad" 
                active={activeSection === 'seguridad'} 
                onClick={() => setActiveSection('seguridad')} 
              />
              <SidebarLink 
                icon={<FaSignOutAlt />} 
                text="Cerrar Sesión" 
                onClick={handleLogout} 
              />
            </nav>
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
/*export */
export default CuentaPage;
