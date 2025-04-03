const { pool } = require('../config/db');

// Crear un nuevo carrito
const create = async (id_usuario = null) => {
  try {
    const query = id_usuario 
      ? 'INSERT INTO carrito (id_usuario) VALUES ($1) RETURNING *'
      : 'INSERT INTO carrito DEFAULT VALUES RETURNING *';
    
    const params = id_usuario ? [id_usuario] : [];
    
    const result = await pool.query(query, params);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear carrito:', error);
    throw error;
  }
};

// Obtener un carrito por ID
const getById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM carrito WHERE id_carrito = $1',
      [id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener carrito por ID:', error);
    throw error;
  }
};

// Actualizar el estado de un carrito
const updateStatus = async (id, estado) => {
  try {
    const result = await pool.query(
      'UPDATE carrito SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_carrito = $2 RETURNING *',
      [estado, id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar estado del carrito:', error);
    throw error;
  }
};

module.exports = {
  create,
  getById,
  updateStatus
}; 