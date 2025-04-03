const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { guardarVenta } = require('../controllers/ventaController');

// Ruta para obtener las últimas ventas (añadir esta ruta primero)
router.get('/ultimas/ventas', ventaController.obtenerUltimasVentas);

// Ruta para obtener los pedidos de un usuario
router.get('/usuario/:id/pedidos', verifyToken, ventaController.getPedidosByUsuario);

router.post('/guardar', guardarVenta);

module.exports = router;