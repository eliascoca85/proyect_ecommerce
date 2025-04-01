const jwt = require('jsonwebtoken'); // Asegúrate de que esta línea esté presente

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'Administrador') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
  }
};

// Middleware para verificar rol de administrador
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'Administrador') {
    next();
  } else {
    res.status(403).json({ message: 'Requiere rol de Administrador' });
  }
};

// Middleware para verificar rol de cliente
exports.isCliente = (req, res, next) => {
  if (req.user && req.user.rol === 'Cliente') {
    next();
  } else {
    res.status(403).json({ message: 'Requiere rol de Cliente' });
  }
};


// Middleware para verificar si el usuario es administrador
exports.checkAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'Administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
  }
  next();
};