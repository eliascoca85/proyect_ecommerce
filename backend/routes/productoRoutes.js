const express = require('express');
const { 
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorMarca
} = require('../controllers/productoController');
const upload = require('../config/multer');

const router = express.Router();

// Obtener todos los productos
router.get('/', obtenerProductos);

// Obtener productos por marca (debe ir antes de la ruta con :id)
router.get('/marca/:marcaId', obtenerProductosPorMarca);

// Obtener un producto por su ID
router.get('/:id', obtenerProductoPorId);

// Crear un nuevo producto con carga de imagen
router.post('/', upload.single('imagen'), crearProducto);

// Actualizar un producto existente con posibilidad de actualizar la imagen
router.put('/:id', upload.single('imagen'), actualizarProducto);

// Eliminar un producto
router.delete('/:id', eliminarProducto);

module.exports = router;
