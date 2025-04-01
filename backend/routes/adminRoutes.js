const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas de gestión de usuarios - utiliza los middlewares existentes
router.get('/usuarios', verifyToken, isAdmin, adminController.getAllUsers);
router.get('/usuarios/:id', verifyToken, isAdmin, adminController.getUserById);
router.post('/usuarios', verifyToken, isAdmin, adminController.createUser);
router.put('/usuarios/:id', verifyToken, isAdmin, adminController.updateUser);
router.delete('/usuarios/:id', verifyToken, isAdmin, adminController.deleteUser);

module.exports = router;