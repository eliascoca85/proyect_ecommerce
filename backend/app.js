const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const app = express();

// Middleware CORS más permisivo para desarrollo
app.use(cors({
  origin: '*',  // Durante desarrollo, permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api', routes);
app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;
