import apiClient from './client';

// Obtener la clave pública de Stripe
export const getStripePublicKey = async () => {
  try {
    const response = await apiClient.get('/stripe/config');
    return response.data.publicKey;
  } catch (error) {
    console.error('Error al obtener la clave pública de Stripe:', error);
    throw error;
  }
};

// Crear una sesión de checkout
export const createCheckoutSession = async (items, carritoId, formData) => {
  try {
    console.log('Enviando datos a Stripe:', {
      items,
      carritoId,
      formData
    });

    // Asegurarse de que carritoId existe
    if (!carritoId) {
      throw new Error('ID de carrito no disponible');
    }

    const response = await apiClient.post('/stripe/create-checkout-session', {
      items,
      carritoId,
      formData
    });

    console.log('Respuesta de Stripe:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear sesión de checkout:', error);
    console.error('Detalles del error:', error.response?.data);
    throw error;
  }
}; 