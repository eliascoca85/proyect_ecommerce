"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { vaciarCarritoAPI } from '../api/client';

// Crear el contexto del carrito
const CarritoContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};

// Proveedor del contexto del carrito
export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [carritoId, setCarritoId] = useState(null);

  // Inicializar el carrito al cargar la página
  useEffect(() => {
    const initCarrito = async () => {
      try {
        // Intentar obtener el ID del carrito del localStorage
        const storedCarritoId = localStorage.getItem('carritoId');
        const storedItems = localStorage.getItem('carritoItems');
        
        if (storedCarritoId) {
          setCarritoId(parseInt(storedCarritoId));
          
          if (storedItems) {
            try {
              const parsedItems = JSON.parse(storedItems);
              setItems(parsedItems);
              
              // Calcular el total
              const calculatedTotal = parsedItems.reduce((sum, item) => sum + (item.total || 0), 0);
              setTotal(calculatedTotal);
            } catch (parseErr) {
              console.error('Error al parsear items del localStorage:', parseErr);
              setItems([]);
              setTotal(0);
            }
          } else {
            // Intentar cargar desde el servidor
            try {
              await cargarItemsCarrito(parseInt(storedCarritoId));
            } catch (err) {
              console.error('Error al cargar items del servidor:', err);
              setItems([]);
              setTotal(0);
            }
          }
        } else {
          // Si no hay ID de carrito, crear uno nuevo
          const newCarritoId = Date.now();
          setCarritoId(newCarritoId);
          localStorage.setItem('carritoId', newCarritoId.toString());
          setItems([]);
          setTotal(0);
        }
      } catch (err) {
        console.error('Error al inicializar el carrito:', err);
        // Crear un ID temporal para el carrito
        const tempCarritoId = Date.now();
        setCarritoId(tempCarritoId);
        localStorage.setItem('carritoId', tempCarritoId.toString());
        setItems([]);
        setTotal(0);
      }
    };
    
    initCarrito();
  }, []);

  // Crear un nuevo carrito
  const crearNuevoCarrito = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post('/carritos', {
        // Puedes incluir datos adicionales como el ID del usuario si está autenticado
      });
      
      const nuevoCarritoId = response.data.id_carrito;
      setCarritoId(nuevoCarritoId);
      localStorage.setItem('carritoId', nuevoCarritoId.toString());
      
      setItems([]);
      setTotal(0);
      setError(null);
      
      return nuevoCarritoId;
    } catch (err) {
      console.error('Error al crear nuevo carrito:', err);
      setError('No se pudo crear un nuevo carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar los items del carrito desde la API
  const cargarItemsCarrito = async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      try {
        const response = await apiClient.get(`/detalles/carrito/${id}`);
        setItems(response.data || []);
        
        const calculatedTotal = response.data?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
        setTotal(calculatedTotal);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar items del carrito:', err);
        
        // Intentar recuperar items del localStorage
        const storedItems = localStorage.getItem('carritoItems');
        if (storedItems) {
          try {
            const parsedItems = JSON.parse(storedItems);
            setItems(parsedItems);
            
            // Calcular el total
            const calculatedTotal = parsedItems.reduce((sum, item) => sum + (item.total || 0), 0);
            setTotal(calculatedTotal);
          } catch (parseErr) {
            console.error('Error al parsear items del localStorage:', parseErr);
            setItems([]);
            setTotal(0);
          }
        } else {
          setItems([]);
          setTotal(0);
        }
        
        setError('No se pudieron cargar los productos del carrito');
      }
    } finally {
      setLoading(false);
    }
  };

  // Añadir un producto al carrito (modo offline)
  // Modifica tu función agregarProducto para usar un prefijo en los IDs temporales:

const agregarProducto = async (producto, cantidad = 1) => {
  try {
    setLoading(true);
    
    // Verificar si el producto ya existe en el carrito
    const itemExistente = items.find(item => item.id_producto === producto.id_producto);
    
    if (itemExistente) {
      // Si existe, actualizar la cantidad
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      await actualizarCantidad(itemExistente.id_detalle_carrito, nuevaCantidad);
      return;
    }
    
    // Si no existe, crear un nuevo item con ID temporal
    const nuevoItem = {
      id_detalle_carrito: Date.now(), // ID temporal
      id_carrito: carritoId,
      id_producto: producto.id_producto,
      cantidad,
      precio_unitario: producto.precio_oferta || producto.precio,
      total: (producto.precio_oferta || producto.precio) * cantidad,
      nombre: producto.nombre,
      imagen: producto.imagen,
      marca_nombre: producto.marca_nombre || producto.marca
    };
    
    const nuevosItems = [...items, nuevoItem];
    setItems(nuevosItems);
    
    // Actualizar el total
    const nuevoTotal = total + nuevoItem.total;
    setTotal(nuevoTotal);
    
    // Guardar en localStorage
    localStorage.setItem('carritoItems', JSON.stringify(nuevosItems));
    
    return nuevoItem;
  } catch (err) {
    console.error('Error al agregar producto al carrito:', err);
    setError('No se pudo agregar el producto al carrito');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Actualizar la cantidad de un producto en el carrito
  // Reemplaza tu función actualizarCantidad por esta:

// Reemplaza tu función actualizarCantidad por esta versión mejorada:

const actualizarCantidad = async (detalleId, cantidad) => {
  if (!carritoId) return;
  
  try {
    setLoading(true);
    
    // Verificar si el ID es temporal (generado por Date.now())
    const esIdTemporal = detalleId > 1000000000; // IDs de base de datos suelen ser pequeños
    
    // Encontrar el item en el carrito actual
    const item = items.find(i => i.id_detalle_carrito === detalleId);
    if (!item) {
      throw new Error('Producto no encontrado en el carrito');
    }
    
    // Verificar stock disponible
    try {
      // Obtener información actualizada del producto desde el backend
      const productoResponse = await apiClient.get(`/productos/${item.id_producto}`);
      const stockDisponible = productoResponse.data.cantidad;
      
      // Si la cantidad solicitada es mayor al stock disponible
      if (cantidad > stockDisponible) {
        setError(`Solo hay ${stockDisponible} unidades disponibles de este producto`);
        console.warn(`Cantidad solicitada (${cantidad}) mayor que stock disponible (${stockDisponible})`);
        return { 
          success: false, 
          error: 'Stock insuficiente',
          stockDisponible
        };
      }
    } catch (stockError) {
      console.warn('No se pudo verificar el stock:', stockError);
      // Continuar, pero con precaución - podríamos estar trabajando offline
    }
    
    // Si es un ID temporal, actualizar solo localmente
    if (esIdTemporal) {
      console.log('Actualizando producto con ID temporal:', detalleId);
      
      // Actualizar localmente
      const nuevosItems = items.map(item => {
        if (item.id_detalle_carrito === detalleId) {
          const nuevoTotal = item.precio_unitario * cantidad;
          return { ...item, cantidad, total: nuevoTotal };
        }
        return item;
      });
      
      // Actualizar el estado
      setItems(nuevosItems);
      
      // Recalcular el total
      const nuevoTotal = nuevosItems.reduce((sum, item) => sum + item.total, 0);
      setTotal(nuevoTotal);
      
      // Guardar en localStorage
      localStorage.setItem('carritoItems', JSON.stringify(nuevosItems));
      
      return { success: true };
    } 
    // Si no es temporal, actualizar en el backend
    else {
      console.log('Actualizando producto en el backend:', detalleId);
      const response = await apiClient.put(`/detalles/${detalleId}`, {
        cantidad
      });
      
      // Si llegamos aquí, la actualización en el backend fue exitosa
      
      // Actualizar los items del carrito
      await cargarItemsCarrito(carritoId);
      
      return response.data;
    }
  } catch (err) {
    // Si el error es específico de stock insuficiente (backend puede devolver este error)
    if (err.response?.status === 400 && err.response?.data?.error?.includes('stock')) {
      const stockDisponible = err.response?.data?.stockDisponible || 'limitado';
      setError(`Solo hay ${stockDisponible} unidades disponibles de este producto`);
      return { 
        success: false, 
        error: 'Stock insuficiente',
        stockDisponible
      };
    }
    
    console.error('Error al actualizar cantidad del producto:', err);
    setError('No se pudo actualizar la cantidad del producto');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Eliminar un producto del carrito
  // Reemplaza tu función eliminarProducto por esta:

const eliminarProducto = async (detalleId) => {
  if (!carritoId) return;
  
  try {
    setLoading(true);
    
    // Verificar si el ID es temporal (generado por Date.now())
    const esIdTemporal = detalleId > 1000000000; // IDs de base de datos suelen ser pequeños
    
    // Si es un ID temporal, eliminar solo localmente
    if (esIdTemporal) {
      console.log('Eliminando producto con ID temporal:', detalleId);
      
      // Encontrar el item a eliminar para restar su total
      const itemAEliminar = items.find(item => item.id_detalle_carrito === detalleId);
      
      if (!itemAEliminar) {
        throw new Error('Producto no encontrado en el carrito');
      }
      
      // Actualizar los items y el total
      const nuevosItems = items.filter(item => item.id_detalle_carrito !== detalleId);
      setItems(nuevosItems);
      
      const nuevoTotal = total - itemAEliminar.total;
      setTotal(nuevoTotal);
      
      // Guardar en localStorage
      localStorage.setItem('carritoItems', JSON.stringify(nuevosItems));
      
      return { success: true };
    } 
    // Si no es temporal, eliminar en el backend
    else {
      console.log('Eliminando producto en el backend:', detalleId);
      const response = await apiClient.delete(`/detalles/${detalleId}`);
      
      // Actualizar los items del carrito
      await cargarItemsCarrito(carritoId);
      
      return response.data;
    }
  } catch (err) {
    console.error('Error al eliminar producto del carrito:', err);
    setError('No se pudo eliminar el producto del carrito');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Vaciar el carrito
  const vaciarCarrito = async () => {
    console.log('Intentando vaciar carrito, ID:', carritoId);
    
    // Si no hay carritoId, no hacer nada
    if (!carritoId) {
      console.warn('No se puede vaciar el carrito: carritoId no disponible');
      return { success: false, error: 'ID de carrito no disponible' };
    }
    
    try {
      // Ya estamos cargando, salir para evitar actualizaciones dobles
      if (loading) {
        console.log('Operación de vaciado ya en progreso, ignorando llamada duplicada');
        return { success: false, error: 'Operación en progreso' };
      }
      
      // Forzar inicio de carga
      setLoading(true);
      setError(null);
      
      // Verificar si el carritoId es temporal (generado por Date.now())
      const esCarritoTemporal = carritoId > 1000000000; // IDs de base de datos suelen ser pequeños
      console.log('Es carrito temporal:', esCarritoTemporal, carritoId);
      
      // Si el carrito ya está vacío, actualizar localStorage de todos modos
      if (items.length === 0) {
        console.log('El carrito ya está vacío, actualizando localStorage');
        localStorage.setItem('carritoItems', JSON.stringify([]));
        setLoading(false);
        return { success: true, mensaje: 'El carrito ya está vacío' };
      }
      
      // Vaciar el estado local primero para respuesta inmediata al usuario
      console.log('Vaciando carrito local, items antes:', items.length);
      setItems([]);
      setTotal(0);
      
      // Actualizar localStorage (mantener el ID del carrito)
      localStorage.setItem('carritoItems', JSON.stringify([]));
      
      // Si es un carrito temporal, no necesitamos hacer nada más
      if (esCarritoTemporal) {
        console.log('Carrito temporal vaciado con éxito');
        setLoading(false);
        return { success: true, mensaje: 'Carrito vaciado correctamente' };
      } 
      
      // Si es un carrito real, usar la API específica para vaciar el carrito
      console.log('Enviando solicitud para vaciar carrito en el servidor:', carritoId);
      try {
        // Usar la función específica para vaciar el carrito
        const response = await vaciarCarritoAPI(carritoId);
        console.log('Respuesta del servidor:', response);
        setLoading(false);
        return { success: true, mensaje: response.mensaje || 'Carrito vaciado correctamente en el servidor' };
      } catch (backendError) {
        console.error('Error al vaciar carrito en el backend:', backendError);
        
        // Si el error es 500, probablemente sea porque el carrito ya fue procesado o eliminado
        if (backendError.response && backendError.response.status === 500) {
          console.log('Error 500 recibido, asumiendo que el carrito ya no existe o fue procesado');
          // Limpiar el ID del carrito en localStorage para evitar intentos futuros
          localStorage.removeItem('carritoId');
          // Crear un nuevo ID para futuras compras
          const newTempId = Date.now();
          setCarritoId(newTempId);
          localStorage.setItem('carritoId', newTempId.toString());
        }
        
        // El carrito ya está vacío localmente, así que no hay problema
        setLoading(false);
        return { success: true, mensaje: 'Carrito vaciado localmente (error en servidor)' };
      }
    } catch (err) {
      console.error('Error inesperado al vaciar el carrito:', err);
      setError('No se pudo vaciar el carrito completamente');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Calcular el número total de items en el carrito
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

  // Valor del contexto
  const value = {
    items,
    loading,
    error,
    total,
    cantidadTotal,
    carritoId,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    cargarItemsCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
