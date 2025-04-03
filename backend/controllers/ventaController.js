const { pool } = require('../config/db');
const Venta = require('../models/ventaModel');

// Obtener los pedidos de un usuario específico
const getPedidosByUsuario = async (req, res) => {
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

// Obtener últimas ventas
const obtenerUltimasVentas = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const ventas = await Venta.getUltimasVentas(limit);
    
    // Dar formato a las ventas
    const ventasFormateadas = ventas.map(venta => ({
      id: `#${venta.id}`,
      cliente: venta.cliente,
      productos: venta.productos,
      total: `$${venta.total.toFixed(2)}`,
      fecha: new Date(venta.fecha).toISOString().split('T')[0],
      estado: venta.estado
    }));
    
    res.json(ventasFormateadas);
  } catch (error) {
    console.error('Error al obtener últimas ventas:', error);
    res.status(500).json({ error: 'Error al obtener las últimas ventas' });
  }
};

const guardarVenta = async (req, res) => {
    console.log('📝 Iniciando guardado de venta');
    const client = await pool.connect();

    try {
        const { 
            carritoId: carritoTemporal,
            id_persona,
            productos,
            total
        } = req.body;

        // Validación mejorada para id_persona
        if (!id_persona) {
            console.error('❌ Error: id_persona es requerido');
            return res.status(400).json({
                success: false,
                error: 'Se requiere la identificación del cliente para procesar la venta'
            });
        }

        console.log('Datos recibidos:', {
            carritoTemporal,
            id_persona,
            cantidadProductos: productos.length,
            total
        });

        await client.query('BEGIN');

        try {
            // 1. Crear un nuevo carrito con ID válido e id_persona
            const nuevoCarritoQuery = `
                INSERT INTO carrito (id_persona, estado)
                VALUES ($1, 'convertido')
                RETURNING id_carrito
            `;
            
            const carritoResult = await client.query(nuevoCarritoQuery, [id_persona]);
            const nuevoCarritoId = carritoResult.rows[0].id_carrito;
            
            console.log('✅ Nuevo carrito creado con ID:', nuevoCarritoId);

            // 2. Crear la venta con el nuevo ID de carrito e id_persona
            const ventaQuery = `
                INSERT INTO venta (id_persona, origen_carrito, total, estado, metodo_pago)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_venta
            `;

            const ventaResult = await client.query(ventaQuery, [
                id_persona,
                nuevoCarritoId,
                total,
                'Completado',
                'Tarjeta'
            ]);

            const ventaId = ventaResult.rows[0].id_venta;
            console.log('✅ Venta creada con ID:', ventaId);

            // 3. Crear los detalles de la venta
            for (const producto of productos) {
                // Guardar en detalle_carrito con el nuevo ID
                await client.query(`
                    INSERT INTO detalle_carrito (
                        id_carrito,
                        id_producto,
                        cantidad,
                        precio_unitario,
                        total
                    ) VALUES ($1, $2, $3, $4, $5)
                `, [
                    nuevoCarritoId,
                    producto.id_producto,
                    producto.cantidad,
                    producto.precio_unitario,
                    producto.total
                ]);

                // Guardar en detalle_venta
                await client.query(`
                    INSERT INTO detalle_venta (
                        id_venta,
                        id_producto,
                        cantidad,
                        precio_unitario,
                        total
                    ) VALUES ($1, $2, $3, $4, $5)
                `, [
                    ventaId,
                    producto.id_producto,
                    producto.cantidad,
                    producto.precio_unitario,
                    producto.total
                ]);

                // Actualizar stock del producto
                await client.query(`
                    UPDATE producto 
                    SET cantidad = cantidad - $1
                    WHERE id_producto = $2
                `, [
                    producto.cantidad,
                    producto.id_producto
                ]);

                console.log('✅ Producto procesado:', {
                    id_producto: producto.id_producto,
                    cantidad: producto.cantidad
                });
            }

            await client.query('COMMIT');
            console.log('✅ Transacción completada exitosamente');

            res.json({
                success: true,
                mensaje: 'Venta registrada correctamente',
                id_venta: ventaId,
                id_carrito: nuevoCarritoId
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }

    } catch (error) {
        console.error('❌ Error al guardar la venta:', error);
        res.status(500).json({
            success: false,
            error: 'Error al procesar la venta: ' + error.message
        });
    } finally {
        client.release();
    }
};

// Exportar todas las funciones
module.exports = {
  getPedidosByUsuario,
  obtenerUltimasVentas,
  guardarVenta
};