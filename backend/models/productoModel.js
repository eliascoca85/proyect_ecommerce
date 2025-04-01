const { pool } = require('../config/db');

const getProductos = async () => {
  const result = await pool.query(`
    SELECT p.*, m.nombre as nombre_marca 
    FROM producto p
    LEFT JOIN marca m ON p.id_marca = m.id_marca
    ORDER BY p.nombre
  `);
  return result.rows;
};

const getProductoById = async (id) => {
  const result = await pool.query(`
    SELECT p.*, m.nombre as nombre_marca 
    FROM producto p
    LEFT JOIN marca m ON p.id_marca = m.id_marca
    WHERE p.id_producto = $1
  `, [id]);
  return result.rows[0];
};

const createProducto = async (producto) => {
  const { 
    nombre, 
    descripcion, 
    id_marca, 
    precio, 
    precio_oferta, 
    cantidad, 
    imagen 
  } = producto;
  
  const result = await pool.query(
    `INSERT INTO producto (
      nombre, 
      descripcion, 
      id_marca, 
      precio, 
      precio_oferta, 
      cantidad, 
      imagen
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [nombre, descripcion, id_marca, precio, precio_oferta, cantidad, imagen]
  );
  return result.rows[0];
};

const updateProducto = async (id, producto) => {
  const { 
    nombre, 
    descripcion, 
    id_marca, 
    precio, 
    precio_oferta, 
    cantidad, 
    imagen 
  } = producto;
  
  const result = await pool.query(
    `UPDATE producto SET 
      nombre = $1, 
      descripcion = $2, 
      id_marca = $3, 
      precio = $4, 
      precio_oferta = $5, 
      cantidad = $6, 
      imagen = $7
    WHERE id_producto = $8 
    RETURNING *`,
    [nombre, descripcion, id_marca, precio, precio_oferta, cantidad, imagen, id]
  );
  return result.rows[0];
};

const deleteProducto = async (id) => {
  const result = await pool.query('DELETE FROM producto WHERE id_producto = $1 RETURNING *', [id]);
  return result.rows[0];
};

const getProductosByMarca = async (marcaId) => {
  const result = await pool.query(`
    SELECT p.*, m.nombre as nombre_marca 
    FROM producto p
    LEFT JOIN marca m ON p.id_marca = m.id_marca
    WHERE p.id_marca = $1
    ORDER BY p.nombre
  `, [marcaId]);
  return result.rows;
};

const getProductosWithDetails = async () => {
  const result = await pool.query(`
    SELECT p.*, m.nombre as marca_nombre 
    FROM producto p
    LEFT JOIN marca m ON p.id_marca = m.id_marca
    ORDER BY p.nombre
  `);
  return result.rows;
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosByMarca,
  getProductosWithDetails
};
