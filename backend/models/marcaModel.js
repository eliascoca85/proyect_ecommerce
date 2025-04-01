const { pool } = require('../config/db');

const getMarcas = async () => {
  const result = await pool.query('SELECT * FROM marca ORDER BY nombre');
  return result.rows;
};

const getMarcaById = async (id) => {
  const result = await pool.query('SELECT * FROM marca WHERE id_marca = $1', [id]);
  return result.rows[0];
};

const createMarca = async (nombre, logo) => {
  const result = await pool.query(
    'INSERT INTO marca (nombre, logo) VALUES ($1, $2) RETURNING *',
    [nombre, logo]
  );
  return result.rows[0];
};

const updateMarca = async (id, marca) => {
  const { nombre, logo } = marca;
  
  // Construir la consulta SQL dinámicamente
  let query = 'UPDATE marca SET nombre = $1';
  let params = [nombre];
  
  // Si se proporcionó un logo, incluirlo en la actualización
  if (logo !== undefined) {
    query += ', logo = $2';
    params.push(logo);
    query += ' WHERE id_marca = $3 RETURNING *';
    params.push(id);
  } else {
    query += ' WHERE id_marca = $2 RETURNING *';
    params.push(id);
  }
  
  const result = await pool.query(query, params);
  return result.rows[0];
};

const deleteMarca = async (id) => {
  const result = await pool.query('DELETE FROM marca WHERE id_marca = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { 
  getMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca
};
