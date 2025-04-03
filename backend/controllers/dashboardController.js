const { pool } = require('../config/db');

const obtenerEstadisticasDashboard = async (req, res) => {
  console.log('Endpoint de estadísticas llamado'); // Log para depuración
  try {
    // Obtener ventas totales
    const ventasTotalesQuery = `
      SELECT COALESCE(SUM(total), 0) as total_ventas
      FROM venta
    `;

    // Obtener total de pedidos
    const totalPedidosQuery = `
      SELECT COUNT(*) as total_pedidos
      FROM venta
    `;

    // Obtener nuevos clientes (últimos 30 días)
    const nuevosClientesQuery = `
      SELECT COUNT(*) as nuevos_clientes
      FROM persona
      WHERE rol = 'cliente'
      AND fecha_creacion >= NOW() - INTERVAL '30 days'
    `;

    // Obtener productos agotados
    const productosAgotadosQuery = `
      SELECT COUNT(*) as productos_agotados
      FROM producto
      WHERE cantidad = 0
    `;

    // Ejecutar todas las consultas en paralelo
    const [ventasResult, pedidosResult, clientesResult, agotadosResult] = await Promise.all([
      pool.query(ventasTotalesQuery),
      pool.query(totalPedidosQuery),
      pool.query(nuevosClientesQuery),
      pool.query(productosAgotadosQuery)
    ]);

    // Construir respuesta
    const estadisticas = {
      totalVentas: parseFloat(ventasResult.rows[0].total_ventas),
      totalPedidos: parseInt(pedidosResult.rows[0].total_pedidos),
      nuevosClientes: parseInt(clientesResult.rows[0].nuevos_clientes),
      productosAgotados: parseInt(agotadosResult.rows[0].productos_agotados)
    };

    // Log para depuración
    console.log('Estadísticas obtenidas:', estadisticas);
    
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
};

module.exports = {
  obtenerEstadisticasDashboard
}; 