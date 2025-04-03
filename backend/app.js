const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const ventaRoutes = require('./routes/ventaRoutes');
const app = express();

// Middleware CORS más permisivo para desarrollo
app.use(cors({
  origin: '*',  // Durante desarrollo, permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Total-Count']
}));

// Middleware para registrar solicitudes HTTP (para depuración)
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} [${req.method}] ${req.originalUrl}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} [${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Verificar si la solicitud es para el webhook de Stripe
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    console.log('Recibida solicitud para webhook de Stripe, usando raw body');
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json({
      limit: '10mb' // Aumentar límite para manejar cargas más grandes
    })(req, res, next);
  }
});

// Rutas
app.use('/api', routes);
app.use('/api/venta', ventaRoutes);
app.use(express.static(path.join(__dirname, 'public')));

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
