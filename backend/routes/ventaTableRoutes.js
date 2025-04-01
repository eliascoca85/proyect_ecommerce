const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaTableController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Ruta de prueba para debugging (sin protección)
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Ruta de ventas funciona correctamente' });
});

// Rutas protegidas - sólo administradores
router.get('/', verifyToken, isAdmin, ventaController.getAllVentas);
router.get('/:id', verifyToken, isAdmin, ventaController.getVentaById);
router.patch('/:id/estado', verifyToken, isAdmin, ventaController.updateEstadoVenta);

module.exports = router;