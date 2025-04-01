const { pool } = require('../config/db');

// Obtener los pedidos de un usuario específico
exports.getPedidosByUsuario = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verificar permisos
    if (req.user.id != userId) {
      return res.status(403).json({ message: 'No tienes permiso para ver estos pedidos' });
    }
    
    // Consulta para obtener pedidos con sus detalles
    const query = `
      SELECT 
        v.id_venta, 
        v.fecha_creacion, 
        v.total,
        CASE
          WHEN EXISTS (SELECT 1 FROM detalle_venta dv WHERE dv.id_venta = v.id_venta) THEN 'Completado'
          ELSE 'Procesando'
        END AS estado,
        (SELECT COUNT(*) FROM detalle_venta dv WHERE dv.id_venta = v.id_venta) as num_productos,
        ARRAY_AGG(DISTINCT p.nombre) as productos_nombres
      FROM venta v
      LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta
      LEFT JOIN producto p ON dv.id_producto = p.id_producto
      WHERE v.id_persona = $1
      GROUP BY v.id_venta
      ORDER BY v.fecha_creacion DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    // Dar formato a los datos para la respuesta
    const pedidos = result.rows.map(row => {
      // Convertir la fecha al formato deseado
      const fecha = new Date(row.fecha_creacion);
      const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      
      return {
        id: `ORD-${row.id_venta.toString().padStart(6, '0')}`,
        fecha: fechaFormateada,
        total: parseFloat(row.total),
        estado: row.estado,
        productos: row.num_productos,
        detalle: row.productos_nombres.filter(p => p !== null).join(', ')
      };
    });
    
    res.status(200).json({ pedidos });
    
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
};