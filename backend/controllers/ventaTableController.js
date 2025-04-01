const { pool } = require('../config/db');  // Importar directamente la conexión

// Obtener todas las ventas
// filepath: c:\Users\elias\Downloads\proyect\proyectosistemasinformaciontres\backend\controllers\ventaTableController.js
exports.getAllVentas = async (req, res) => {
  try {
    console.log('Recibida solicitud para obtener todas las ventas');
    
    const query = `
      SELECT 
        v.id_venta, 
        v.id_persona, -- Cambiado de id_cliente a id_persona
        v.total,
        v.fecha_creacion as fecha_venta,
        COALESCE(v.estado, 'Procesando') as estado,
        COALESCE(v.metodo_pago, 'Tarjeta') as metodo_pago,
        p.nombre_completo as cliente_nombre
      FROM venta v
      LEFT JOIN persona p ON v.id_persona = p.id_persona -- Cambiado de id_cliente a id_persona
      ORDER BY v.fecha_creacion DESC
    `;
    
    const result = await pool.query(query);
    console.log(`Se encontraron ${result.rows.length} ventas`);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener todas las ventas:', error);
    res.status(500).json({ 
      message: 'Error al obtener ventas', 
      error: error.message
    });
  }
};

// Obtener una venta por ID
exports.getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Recibida solicitud para obtener venta con ID: ${id}`);
    
    // Consulta para obtener la información de la venta
    const ventaQuery = `
      SELECT 
        v.id_venta, 
        v.id_cliente, 
        v.total,
        v.fecha_creacion as fecha_venta,
        COALESCE(v.estado, 'Procesando') as estado,
        COALESCE(v.metodo_pago, 'Tarjeta') as metodo_pago,
        p.nombre_completo as cliente_nombre
      FROM venta v
      LEFT JOIN persona p ON v.id_cliente = p.id_persona
      WHERE v.id_venta = $1
    `;
    
    const ventaResult = await pool.query(ventaQuery, [id]);
    
    if (ventaResult.rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    // Consulta para obtener los detalles de la venta
    const detallesQuery = `
      SELECT 
        dv.id_detalle_venta,
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal,
        p.id_producto,
        p.nombre as producto_nombre,
        p.precio as producto_precio,
        m.nombre as marca_nombre
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto = p.id_producto
      LEFT JOIN marca m ON p.id_marca = m.id_marca
      WHERE dv.id_venta = $1
    `;
    
    const detallesResult = await pool.query(detallesQuery, [id]);
    
    res.status(200).json({
      venta: ventaResult.rows[0],
      detalles: detallesResult.rows
    });
  } catch (error) {
    console.error(`Error al obtener venta con ID ${req.params.id}:`, error);
    res.status(500).json({ 
      message: 'Error al obtener venta', 
      error: error.message 
    });
  }
};

// Actualizar estado de venta
exports.updateEstadoVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    console.log(`Recibida solicitud para actualizar estado de venta ${id} a: ${estado}`);
    
    if (!estado) {
      return res.status(400).json({ message: 'El estado es obligatorio' });
    }
    
    // Verificar estados válidos
    const estadosValidos = ['Procesando', 'Enviado', 'Completado', 'Cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        message: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}` 
      });
    }
    
    // Verificar que la venta existe
    const checkQuery = 'SELECT id_venta FROM venta WHERE id_venta = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    // Actualizar el estado
    const updateQuery = `
      UPDATE venta 
      SET estado = $1, 
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_venta = $2
      RETURNING id_venta, estado
    `;
    
    const updateResult = await pool.query(updateQuery, [estado, id]);
    
    res.status(200).json({
      message: 'Estado de venta actualizado con éxito',
      venta: updateResult.rows[0]
    });
  } catch (error) {
    console.error(`Error al actualizar estado de venta ${req.params.id}:`, error);
    res.status(500).json({ 
      message: 'Error al actualizar estado de venta',
      error: error.message
    });
  }
};

// Este endpoint no es necesario aquí ya que está en ventaController.js
exports.createVenta = async (req, res) => {
  res.status(501).json({ message: 'Función no implementada en este controlador' });
};