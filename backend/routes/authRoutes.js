const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rutas existentes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Ruta para obtener perfil completo (protegida por token)
router.get('/usuarios/:id/perfil-completo', verifyToken, authController.getFullProfile);
// Añadir estas rutas
router.put('/usuarios/:id/actualizar-perfil', verifyToken, authController.updateUserProfile);
router.put('/usuarios/:id/actualizar-direccion', verifyToken, authController.updateUserAddress);
// Si ya tienes esta ruta para actualizar el perfil
// router.put('/usuarios/:id/perfil-completo', verifyToken, authController.updateFullProfile);
router.put('/usuarios/:id/actualizar-password', verifyToken, authController.updateUserPassword);

module.exports = router;