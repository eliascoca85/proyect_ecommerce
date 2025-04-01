const Carrito = require('../models/carritoModel');

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

module.exports = {
  crearCarrito,
  getCarritoById
}; 