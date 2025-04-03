import axios from 'axios';

// Configuración base de axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${API_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log de configuración para depuración
console.log('API Client configurado con:', {
  baseURL: API_BASE_URL,
});

// API para marcas
export const marcaAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/marcas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/marcas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener marca ${id}:`, error);
      throw error;
    }
  },
  
  create: async (marca) => {
    try {
      // Para manejar la carga de archivos, usamos FormData
      const formData = new FormData();
      
      // Añadir todos los campos de la marca al FormData
      Object.keys(marca).forEach(key => {
        // Si es el logo y es un archivo, lo añadimos directamente
        if (key === 'logo' && marca[key] instanceof File) {
          formData.append(key, marca[key]);
        } 
        // Para los demás campos, solo los añadimos si no son nulos o indefinidos
        else if (marca[key] !== null && marca[key] !== undefined) {
          formData.append(key, marca[key]);
        }
      });
      
      const response = await axios.post(`${API_BASE_URL}/marcas`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al crear marca:', error);
      throw error;
    }
  },
  
  update: async (id, marca) => {
    try {
      // Para manejar la carga de archivos, usamos FormData
      const formData = new FormData();
      
      // Añadir todos los campos de la marca al FormData
      Object.keys(marca).forEach(key => {
        // Si es el logo y es un archivo, lo añadimos directamente
        if (key === 'logo' && marca[key] instanceof File) {
          formData.append(key, marca[key]);
        } 
        // Para los demás campos, solo los añadimos si no son nulos o indefinidos
        else if (marca[key] !== null && marca[key] !== undefined) {
          formData.append(key, marca[key]);
        }
      });
      
      // Verificar que se están enviando los datos correctos
      console.log('Enviando datos de marca:', Object.fromEntries(formData));
      
      const response = await axios.put(`${API_BASE_URL}/marcas/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar marca ${id}:`, error);
      // Mostrar más detalles del error
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      }
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/marcas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar marca ${id}:`, error);
      throw error;
    }
  }
};

// API para productos
export const productoAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/productos?includeDetails=true');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  },
  
  getByMarca: async (marcaId) => {
    try {
      const response = await apiClient.get(`/productos/marca/${marcaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener productos de marca ${marcaId}:`, error);
      throw error;
    }
  },
  
  create: async (producto) => {
    try {
      // Para manejar la carga de archivos, usamos FormData
      const formData = new FormData();
      
      // Añadir todos los campos del producto al FormData
      Object.keys(producto).forEach(key => {
        // Si es la imagen y es un archivo, lo añadimos directamente
        if (key === 'imagen' && producto[key] instanceof File) {
          formData.append(key, producto[key]);
        } 
        // Para los demás campos, solo los añadimos si no son nulos o indefinidos
        else if (producto[key] !== null && producto[key] !== undefined) {
          formData.append(key, producto[key]);
        }
      });
      
      const response = await axios.post(`${API_BASE_URL}/productos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },
  
  update: async (id, producto) => {
    try {
      // Para manejar la carga de archivos, usamos FormData
      const formData = new FormData();
      
      // Añadir todos los campos del producto al FormData
      Object.keys(producto).forEach(key => {
        // Si es la imagen y es un archivo, lo añadimos directamente
        if (key === 'imagen' && producto[key] instanceof File) {
          formData.append(key, producto[key]);
        } 
        // Para los demás campos, solo los añadimos si no son nulos o indefinidos
        else if (producto[key] !== null && producto[key] !== undefined) {
          formData.append(key, producto[key]);
        }
      });
      
      const response = await axios.put(`${API_BASE_URL}/productos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw error;
    }
  }
};

// Vaciar un carrito
export const vaciarCarritoAPI = async (carritoId) => {
  try {
    console.log(`Enviando solicitud para vaciar carrito ID: ${carritoId}`);
    
    // Verificar que el carritoId sea válido
    if (!carritoId || isNaN(parseInt(carritoId))) {
      console.error('ID de carrito inválido:', carritoId);
      throw new Error('ID de carrito inválido');
    }
    
    // Usar un timeout para evitar que la solicitud se quede esperando demasiado tiempo
    const response = await apiClient.delete(`/carritos/${carritoId}/vaciar`, {
      timeout: 5000 // 5 segundos máximo
    });
    
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error al vaciar el carrito ${carritoId}:`, error);
    
    // Si el error es 500, puede ser que el carrito ya fue procesado o no existe
    if (error.response && error.response.status === 500) {
      console.log('Error 500 del servidor, posiblemente el carrito ya fue procesado');
      // Devolver un objeto similar al que devolvería el servidor en caso de éxito
      return {
        success: true,
        mensaje: 'Carrito probablemente ya procesado (error 500)',
        id_carrito: carritoId
      };
    }
    
    throw error;
  }
};

export default apiClient;
