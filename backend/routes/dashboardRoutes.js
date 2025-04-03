const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Ruta de prueba para verificar que funciona
router.get('/test', (req, res) => {
  res.json({ message: 'Dashboard route working' });
});

router.get('/estadisticas', dashboardController.obtenerEstadisticasDashboard);

module.exports = router; 