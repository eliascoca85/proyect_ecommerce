const express = require('express');
const router = express.Router();

const marcaRoutes = require('./marcaRoutes');
const productoRoutes = require('./productoRoutes');
const detalleCarritoRoutes = require('./detalleCarritoRoutes');
const authRoutes = require('./authRoutes');

router.use('/marcas', marcaRoutes);
router.use('/productos', productoRoutes);
router.use('/detalleCarrito', detalleCarritoRoutes);
router.use('/auth', authRoutes);  // Asegúrate de que esté esta línea

module.exports = router;
