const express = require('express');
const { 
  crearCarrito,
  getCarritoById,
  vaciarCarrito
} = require('../controllers/carritoController');

const router = express.Router();

// Crear un nuevo carrito
router.post('/', crearCarrito);

// Obtener un carrito por ID
router.get('/:id', getCarritoById);

// Vaciar un carrito por ID
router.delete('/:id/vaciar', vaciarCarrito);

module.exports = router; 