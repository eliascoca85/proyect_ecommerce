const { pool } = require('../config/db');

// Obtener todos los detalles de un carrito específico
const getDetallesByCarritoId = async (carritoId) => {
  try {
    const result = await pool.query(
      `SELECT dc.*, p.nombre, p.imagen, m.nombre as marca_nombre
       FROM detalle_carrito dc
       JOIN producto p ON dc.id_producto = p.id_producto
       LEFT JOIN marca m ON p.id_marca = m.id_marca
       WHERE dc.id_carrito = $1
       ORDER BY dc.fecha_agregado DESC`,
      [carritoId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error al obtener detalles del carrito:', error);
    // En caso de error, devolver un array vacío
    return [];
  }
};

// Obtener un detalle específico por su ID
// En la función getDetalleById:

const getDetalleById = async (detalleId) => {
  try {
    // Convertir a BigInt si es necesario
    const id = BigInt(detalleId).toString();
    
    const query = `
      SELECT dc.*, p.nombre, p.imagen, m.nombre as marca_nombre
      FROM detalle_carrito dc
      JOIN producto p ON dc.id_producto = p.id_producto
      LEFT JOIN marca m ON p.id_marca = m.id_marca
      WHERE dc.id_detalle_carrito = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error en getDetalleById:', error);
    throw error;
  }
};

// Añadir un producto al carrito
const addProductToCarrito = async (detalleCarrito) => {
  const { id_carrito, id_producto, cantidad, precio_unitario } = detalleCarrito;
  
  // Calcular el total
  const total = precio_unitario * cantidad;
  
  // Verificar si el producto ya existe en el carrito
  const existingProduct = await pool.query(
    'SELECT * FROM detalle_carrito WHERE id_carrito = $1 AND id_producto = $2',
    [id_carrito, id_producto]
  );
  
  if (existingProduct.rows.length > 0) {
    // Si el producto ya existe, actualizar la cantidad y el total
    const result = await pool.query(
      `UPDATE detalle_carrito 
       SET cantidad = cantidad + $1, 
           total = precio_unitario * (cantidad + $1),
           fecha_agregado = CURRENT_TIMESTAMP
       WHERE id_carrito = $2 AND id_producto = $3
       RETURNING *`,
      [cantidad, id_carrito, id_producto]
    );
    return result.rows[0];
  } else {
    // Si el producto no existe, crear un nuevo detalle
    const result = await pool.query(
      `INSERT INTO detalle_carrito (id_carrito, id_producto, cantidad, precio_unitario, total, fecha_agregado)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [id_carrito, id_producto, cantidad, precio_unitario, total]
    );
    return result.rows[0];
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateDetalleCarrito = async (detalleId, cantidad) => {
  // Primero obtenemos el detalle actual para conocer el precio unitario
  const currentDetalle = await pool.query(
    'SELECT precio_unitario FROM detalle_carrito WHERE id_detalle_carrito = $1',
    [detalleId]
  );
  
  if (currentDetalle.rows.length === 0) {
    throw new Error('Detalle de carrito no encontrado');
  }
  
  const { precio_unitario } = currentDetalle.rows[0];
  const total = precio_unitario * cantidad;
  
  const result = await pool.query(
    `UPDATE detalle_carrito 
     SET cantidad = $1, 
         total = $2,
         fecha_agregado = CURRENT_TIMESTAMP
     WHERE id_detalle_carrito = $3
     RETURNING *`,
    [cantidad, total, detalleId]
  );
  
  return result.rows[0];
};

// Eliminar un producto del carrito
const removeProductFromCarrito = async (detalleId) => {
  const result = await pool.query(
    'DELETE FROM detalle_carrito WHERE id_detalle_carrito = $1 RETURNING *',
    [detalleId]
  );
  return result.rows[0];
};

// Vaciar un carrito (eliminar todos los productos)
const clearCarrito = async (carritoId) => {
  const result = await pool.query(
    'DELETE FROM detalle_carrito WHERE id_carrito = $1 RETURNING *',
    [carritoId]
  );
  return result.rows;
};

// Obtener el total del carrito
const getCarritoTotal = async (carritoId) => {
  const result = await pool.query(
    'SELECT SUM(total) as total FROM detalle_carrito WHERE id_carrito = $1',
    [carritoId]
  );
  return result.rows[0].total || 0;
};

// Crear un nuevo detalle de carrito
const create = async (id_carrito, id_producto, cantidad) => {
  try {
    // Obtener el precio del producto
    const [producto] = await pool.query(
      'SELECT precio, precio_oferta FROM producto WHERE id_producto = ?',
      [id_producto]
    );
    
    if (!producto.length) {
      throw new Error('Producto no encontrado');
    }
    
    // Usar el precio de oferta si existe, de lo contrario usar el precio normal
    const precioUnitario = producto[0].precio_oferta || producto[0].precio;
    
    // Calcular el total
    const total = precioUnitario * cantidad;
    
    // Insertar el detalle
    const [result] = await pool.query(
      'INSERT INTO detalle_carrito (id_carrito, id_producto, cantidad, precio_unitario, total) VALUES (?, ?, ?, ?, ?)',
      [id_carrito, id_producto, cantidad, precioUnitario, total]
    );
    
    // Obtener el detalle completo con información del producto
    const [detalle] = await pool.query(
      `SELECT dc.*, p.nombre, p.imagen, m.nombre as marca_nombre
       FROM detalle_carrito dc
       JOIN producto p ON dc.id_producto = p.id_producto
       LEFT JOIN marca m ON p.id_marca = m.id_marca
       WHERE dc.id_detalle_carrito = ?`,
      [result.insertId]
    );
    
    return detalle[0];
  } catch (error) {
    console.error('Error al crear detalle de carrito:', error);
    throw error;
  }
};

module.exports = {
  getDetallesByCarritoId,
  getDetalleById,
  addProductToCarrito,
  updateDetalleCarrito,
  removeProductFromCarrito,
  clearCarrito,
  getCarritoTotal,
  create
};
