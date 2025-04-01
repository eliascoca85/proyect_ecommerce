// filepath: c:\Users\elias\Downloads\proyect\proyectosistemasinformaciontres\backend\models\personaModel.js
const { pool } = require('../config/db');

// Obtener todos los usuarios
const getAll = async () => {
  try {
    const result = await pool.query('SELECT * FROM persona ORDER BY id_persona DESC');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    throw error;
  }
};

// Obtener usuario por ID
const getById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM persona WHERE id_persona = $1',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};

// Obtener usuario por correo
const getByEmail = async (correo) => {
  try {
    const result = await pool.query(
      'SELECT * FROM persona WHERE correo = $1',
      [correo]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por correo:', error);
    throw error;
  }
};

// Crear un nuevo usuario
const create = async (userData) => {
  const client = await pool.connect();
  try {
    const { 
      nombre_completo, 
      correo, 
      clave, 
      rol,
      telefono,
      direccion_calle,
      direccion_ciudad,
      direccion_codigo_postal,
      direccion_pais
    } = userData;
    
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO persona (
        nombre_completo, correo, clave, rol, telefono,
        direccion_calle, direccion_ciudad, direccion_codigo_postal, direccion_pais
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [
        nombre_completo, 
        correo, 
        clave, 
        rol || 'Cliente',
        telefono || null,
        direccion_calle || null,
        direccion_ciudad || null,
        direccion_codigo_postal || null,
        direccion_pais || null
      ]
    );
    
    await client.query('COMMIT');
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear usuario:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Actualizar un usuario existente
const update = async (id, userData) => {
  const client = await pool.connect();
  try {
    const { 
      nombre_completo, 
      correo, 
      clave, 
      rol,
      telefono,
      direccion_calle,
      direccion_ciudad,
      direccion_codigo_postal,
      direccion_pais
    } = userData;
    
    // Construir la consulta SQL dinámicamente
    let query = 'UPDATE persona SET ';
    const values = [];
    let valueIndex = 1;
    const updateFields = [];
    
    // Agregar campos al update sólo si están definidos
    if (nombre_completo !== undefined) {
      updateFields.push(`nombre_completo = $${valueIndex++}`);
      values.push(nombre_completo);
    }
    
    if (correo !== undefined) {
      updateFields.push(`correo = $${valueIndex++}`);
      values.push(correo);
    }
    
    if (clave !== undefined && clave) {
      updateFields.push(`clave = $${valueIndex++}`);
      values.push(clave);
    }
    
    if (rol !== undefined) {
      updateFields.push(`rol = $${valueIndex++}`);
      values.push(rol);
    }
    
    // Campos opcionales
    if (telefono !== undefined) {
      updateFields.push(`telefono = $${valueIndex++}`);
      values.push(telefono);
    }
    
    if (direccion_calle !== undefined) {
      updateFields.push(`direccion_calle = $${valueIndex++}`);
      values.push(direccion_calle);
    }
    
    if (direccion_ciudad !== undefined) {
      updateFields.push(`direccion_ciudad = $${valueIndex++}`);
      values.push(direccion_ciudad);
    }
    
    if (direccion_codigo_postal !== undefined) {
      updateFields.push(`direccion_codigo_postal = $${valueIndex++}`);
      values.push(direccion_codigo_postal);
    }
    
    if (direccion_pais !== undefined) {
      updateFields.push(`direccion_pais = $${valueIndex++}`);
      values.push(direccion_pais);
    }
    
    if (updateFields.length === 0) {
      return null; // No hay campos para actualizar
    }
    
    query += updateFields.join(', ');
    query += ` WHERE id_persona = $${valueIndex} RETURNING *`;
    values.push(id);
    
    await client.query('BEGIN');
    const result = await client.query(query, values);
    await client.query('COMMIT');
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar usuario:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Eliminar un usuario
const remove = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'DELETE FROM persona WHERE id_persona = $1 RETURNING *',
      [id]
    );
    await client.query('COMMIT');
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar usuario:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  create,
  update,
  remove
};