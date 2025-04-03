const Carrito = require('../models/carritoModel');
const DetalleCarrito = require('../models/detalleCarritoModel');

// Crear un nuevo carrito
const crearCarrito = async (req, res) => {
  try {
    // Puedes recibir datos adicionales como el ID del usuario
    const { id_usuario } = req.body;
    
    const nuevoCarrito = await Carrito.create(id_usuario);
    
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
};

// Obtener un carrito por ID
const getCarritoById = async (req, res) => {
  try {
    const carritoId = parseInt(req.params.id);
    
    const carrito = await Carrito.getById(carritoId);
    
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    res.json(carrito);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Vaciar un carrito por ID
const vaciarCarrito = async (req, res) => {
  try {
    const carritoId = parseInt(req.params.id);
    
    if (!carritoId || isNaN(carritoId)) {
      return res.status(400).json({ error: 'ID de carrito inválido' });
    }
    
    console.log(`Vaciando carrito ID: ${carritoId}`);
    
    // Verificar que el carrito existe
    const carrito = await Carrito.getById(carritoId);
    
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    // Eliminar todos los detalles del carrito
    await DetalleCarrito.clearCarrito(carritoId);
    
    // Actualizar el carrito para indicar que ha sido vaciado
    await Carrito.updateStatus(carritoId, 'vaciado');
    
    res.json({ 
      success: true, 
      mensaje: 'Carrito vaciado correctamente',
      id_carrito: carritoId
    });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};

module.exports = {
  crearCarrito,
  getCarritoById,
  vaciarCarrito
}; 