const { pool } = require('../config/db');

const findByEmail = async (correo) => {
  try {
    const result = await pool.query(
      'SELECT id_persona, nombre_completo, correo, clave, rol FROM persona WHERE correo = $1',
      [correo]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al buscar usuario por correo:', error);
    throw error;
  }
};

const createUser = async (userData) => {
  const { nombre_completo, correo, clave, rol } = userData;
  
  try {
    const result = await pool.query(
      'INSERT INTO persona (nombre_completo, correo, clave, rol, fecha_creacion) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id_persona',
      [nombre_completo, correo, clave, rol]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

module.exports = {
  findByEmail,
  createUser
};