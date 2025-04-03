const express = require('express');
const router = express.Router();
const { 
  createCheckoutSession, 
  handleWebhook, 
  getPublicKey 
} = require('../controllers/stripeController');

// Ruta para obtener la clave pública de Stripe
router.get('/config', getPublicKey);

// Ruta para crear una sesión de checkout
router.post('/create-checkout-session', createCheckoutSession);

// Ruta para el webhook de Stripe (eventos)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router; 