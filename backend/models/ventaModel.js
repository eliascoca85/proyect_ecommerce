const { pool } = require('../config/db');

// Obtener todas las ventas
const getAll = async () => {
  try {
    const result = await pool.query(`
      SELECT v.*, p.nombre_completo as cliente_nombre
      FROM venta v
      LEFT JOIN persona p ON v.id_cliente = p.id_persona
      ORDER BY v.fecha_venta DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener todas las ventas:', error);
    throw error;
  }
};

// Obtener venta por ID
const getById = async (id) => {
  try {
    const result = await pool.query(`
      SELECT v.*, p.nombre_completo as cliente_nombre
      FROM venta v
      LEFT JOIN persona p ON v.id_cliente = p.id_persona
      WHERE v.id_venta = $1
    `, [id]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    throw error;
  }
};

// Obtener detalles de una venta
const getDetallesByVentaId = async (id_venta) => {
  try {
    const result = await pool.query(`
      SELECT d.*, p.nombre as producto_nombre, p.precio as producto_precio
      FROM detalle_venta d
      JOIN producto p ON d.id_producto = p.id_producto
      WHERE d.id_venta = $1
    `, [id_venta]);
    
    return result.rows;
  } catch (error) {
    console.error('Error al obtener detalles de venta:', error);
    throw error;
  }
};

// Crear una nueva venta
const create = async (ventaData, detallesData) => {
  const client = await pool.connect();
  try {
    const { id_cliente, total, estado, metodo_pago } = ventaData;
    
    await client.query('BEGIN');
    
    // Insertar la venta
    const ventaResult = await client.query(
      `INSERT INTO venta (id_cliente, total, estado, metodo_pago)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_cliente, total, estado || 'Procesando', metodo_pago || 'Tarjeta']
    );
    
    const nuevaVenta = ventaResult.rows[0];
    
    // Insertar los detalles de la venta
    for (const detalle of detallesData) {
      await client.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          nuevaVenta.id_venta,
          detalle.id_producto,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal
        ]
      );
      
      // Actualizar el stock del producto
      await client.query(
        `UPDATE producto SET stock = stock - $1 WHERE id_producto = $2`,
        [detalle.cantidad, detalle.id_producto]
      );
    }
    
    await client.query('COMMIT');
    
    return nuevaVenta;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear venta:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Actualizar estado de venta
const updateEstado = async (id, estado) => {
  try {
    const result = await pool.query(
      `UPDATE venta SET estado = $1 WHERE id_venta = $2 RETURNING *`,
      [estado, id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar estado de venta:', error);
    throw error;
  }
};

// Obtener últimas ventas
const getUltimasVentas = async (limit = 5) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.id_venta,
        COALESCE(p.nombre_completo, 'Cliente no registrado') as cliente,
        v.total,
        v.fecha_creacion,
        v.estado,
        (SELECT COUNT(*) FROM detalle_venta dv WHERE dv.id_venta = v.id_venta) as num_productos
      FROM venta v
      LEFT JOIN persona p ON v.id_persona = p.id_persona
      ORDER BY v.fecha_creacion DESC
      LIMIT $1
    `, [limit]);

    // Dar formato a los resultados
    const ventas = result.rows.map(venta => ({
      id: venta.id_venta,
      cliente: venta.cliente,
      productos: parseInt(venta.num_productos) || 0,
      total: parseFloat(venta.total),
      fecha: venta.fecha_creacion,
      estado: venta.estado
    }));

    return ventas;
  } catch (error) {
    console.error('Error al obtener últimas ventas:', error);
    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  getDetallesByVentaId,
  create,
  updateEstado,
  getUltimasVentas
};