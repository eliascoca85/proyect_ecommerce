require('dotenv').config();
const app = require('./app');
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Importar el archivo de inicialización de directorios
require('./config/initDirectories');

// ...existing code...

// Importar las rutas
const marcaRoutes = require('./routes/marcaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const detalleCarritoRoutes = require('./routes/detalleCarritoRoutes'); // Verifica que esta línea exista
const carritoRoutes = require('./routes/carritoRoutes');
const authRoutes = require('./routes/authRoutes');


const ventaTableRoutes = require('./routes/ventaTableRoutes');
app.use('/api/ventas', ventaTableRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const ventaRoutes = require('./routes/ventaRoutes');
app.use('/api/ventas', ventaRoutes);

// Rutas de la API
app.use('/api/marcas', marcaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/detalles', detalleCarritoRoutes); // ¡ASEGÚRATE QUE ESTA LÍNEA EXISTA!
app.use('/api/carritos', carritoRoutes);
app.use('/api/auth', authRoutes);

// ...existing code...

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
