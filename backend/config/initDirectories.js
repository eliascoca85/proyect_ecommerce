const fs = require('fs');
const path = require('path');

// Crear directorio para uploads si no existe
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(path.join(__dirname, '../public'))) {
  fs.mkdirSync(path.join(__dirname, '../public'));
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

console.log('✅ Directorios de uploads inicializados');

module.exports = { uploadsDir }; 