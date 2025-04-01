const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ruta para obtener los pedidos de un usuario
router.get('/usuario/:id/pedidos', verifyToken, ventaController.getPedidosByUsuario);

module.exports = router;