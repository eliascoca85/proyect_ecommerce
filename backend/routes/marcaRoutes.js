const express = require('express');
const { 
  obtenerMarcas, 
  obtenerMarcaPorId, 
  crearMarca, 
  actualizarMarca, 
  eliminarMarca 
} = require('../controllers/marcaController');
const upload = require('../config/multer');

const router = express.Router();

// Obtener todas las marcas
router.get('/', obtenerMarcas);

// Obtener una marca por su ID
router.get('/:id', obtenerMarcaPorId);

// Crear una nueva marca con carga de logo
router.post('/', upload.single('logo'), crearMarca);

// Actualizar una marca existente con posibilidad de actualizar el logo
router.put('/:id', upload.single('logo'), actualizarMarca);

// Eliminar una marca
router.delete('/:id', eliminarMarca);

module.exports = router;
