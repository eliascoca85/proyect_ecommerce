const express = require('express');
const router = express.Router();
const { 
  obtenerDetallesCarrito,
  addProductToCarrito,
  actualizarCantidadProducto,
  eliminarProductoDelCarrito,
  vaciarCarrito,
  obtenerTotalCarrito
} = require('../controllers/detalleCarritoController');

// Rutas para detalles del carrito

router.get('/carrito/:id', obtenerDetallesCarrito);
router.post('/', addProductToCarrito); // Esta es la ruta importante
router.put('/:detalleId', actualizarCantidadProducto); // Esta es la ruta importante
router.delete('/:detalleId', eliminarProductoDelCarrito);
router.delete('/carrito/:carritoId', vaciarCarrito);
router.get('/carrito/:carritoId/total', obtenerTotalCarrito);

module.exports = router;
