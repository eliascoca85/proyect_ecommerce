const express = require('express');
const { 
  crearCarrito,
  obtenerCarrito,
  getCarritoById
} = require('../controllers/carritoController');

const router = express.Router();

// Crear un nuevo carrito
router.post('/', crearCarrito);

// Obtener un carrito por ID
router.get('/:id', getCarritoById);

module.exports = router; 