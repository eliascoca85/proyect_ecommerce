const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { pool } = require('../config/db');
const DetalleCarrito = require('../models/detalleCarritoModel');

// Verificar la conexión con Stripe al iniciar el servidor
(async () => {
  try {
    console.log('Intentando conectar con Stripe usando la clave:', process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 10)}...` : 'No definida');
    
    const paymentMethods = await stripe.paymentMethods.list({
      limit: 1,
    });
    console.log('✅ Conexión con Stripe establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con Stripe:', error.message);
    console.error('Por favor verifica las claves de Stripe en tu archivo .env');
  }
})();

// Crear una sesión de checkout con Stripe
const createCheckoutSession = async (req, res) => {
  try {
    console.log('---------------------------------------------');
    console.log('📝 Nueva solicitud de checkout:', new Date().toISOString());
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    const { 
      items, 
      carritoId,
      formData, 
      shipping = 15.99, 
      taxRate = 0.21 
    } = req.body;

    // Validaciones
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ Error: No hay productos válidos en el carrito');
      return res.status(400).json({ error: 'No hay productos en el carrito' });
    }

    // Validar carritoId
    if (!carritoId) {
      console.error('❌ Error: No se recibió carritoId');
      return res.status(400).json({ error: 'ID de carrito no proporcionado' });
    }

    // Validar formData
    if (!formData || typeof formData !== 'object') {
      console.error('❌ Error: formData no válido');
      return res.status(400).json({ error: 'Datos del formulario inválidos' });
    }

    const carritoIdString = String(carritoId);
    console.log('✅ CarritoId (procesado):', carritoIdString);
    
    // Formatear los items para Stripe
    const lineItems = [];
    
    for (const item of items) {
      // Validar campos obligatorios
      if (!item.nombre || !item.precio_unitario || !item.cantidad) {
        console.warn(`⚠️ Item con datos incompletos: ${JSON.stringify(item)}`);
        continue; // Saltar este item
      }
      
      const unitAmount = Math.round((parseFloat(item.precio_unitario) || 0) * 100);
      const quantity = parseInt(item.cantidad) || 1;
      
      console.log(`📦 Item: ${item.nombre}, Precio: ${item.precio_unitario}, Cantidad: ${item.cantidad}, Amount: ${unitAmount/100}€ x ${quantity}`);
      
      if (unitAmount <= 0) {
        console.warn(`⚠️ Precio unitario inválido para ${item.nombre}: ${unitAmount}`);
        continue; // Saltar productos con precio <= 0
      }
      
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.nombre || 'Producto',
            description: item.marca_nombre ? `Marca: ${item.marca_nombre}` : '',
            images: item.imagen ? [`${process.env.FRONTEND_URL || 'http://localhost:3000'}${item.imagen}`] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: quantity,
      });
    }
    
    // Verificar que hay items válidos
    if (lineItems.length === 0) {
      console.error('❌ Error: No hay productos válidos para procesar');
      return res.status(400).json({ error: 'No hay productos válidos para procesar' });
    }

    // Agregar gastos de envío como un ítem separado
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Gastos de envío',
          description: 'Envío estándar',
        },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    });
    
    console.log(`📦 Envío: ${shipping}€`);

    // Crear metadatos para la sesión
    const metadata = {
      carritoId: carritoIdString,
      customerEmail: formData.email || '',
      customerName: `${formData.nombre || ''} ${formData.apellido || ''}`,
      shippingAddress: JSON.stringify({
        street: formData.direccion || '',
        city: formData.ciudad || '',
        postalCode: formData.codigoPostal || '',
        country: formData.pais || ''
      }),
      paymentMethod: formData.metodoPago || 'tarjeta'
    };

    console.log('📝 Creando sesión de Stripe con los siguientes datos:');
    console.log(`- Items: ${lineItems.length} productos`);
    console.log(`- Cliente: ${metadata.customerName} (${metadata.customerEmail})`);
    console.log(`- CarritoID: ${metadata.carritoId}`);

    // Crear la sesión de Stripe
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/cancel`,
        metadata: metadata,
      });

      console.log('✅ Sesión de Stripe creada con éxito:', session.id);
      console.log('✅ URL de checkout:', session.url);
      console.log('---------------------------------------------');
      
      return res.json({ id: session.id, url: session.url });
    } catch (stripeError) {
      console.error('❌ Error de Stripe al crear la sesión:', stripeError);
      return res.status(400).json({ 
        error: 'Error al crear la sesión de pago', 
        details: stripeError.message
      });
    }
  } catch (error) {
    console.error('❌ Error al procesar la solicitud de checkout:', error);
    return res.status(500).json({ 
      error: 'Error al procesar el pago', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Webhook para procesar eventos de Stripe
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Error de firma webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar eventos específicos
  switch (event.type) {
    case 'checkout.session.completed':
      // Procesar la compra exitosa
      await handleSuccessfulPayment(event.data.object);
      break;
    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  res.json({ received: true });
};

// Procesar compra exitosa
const handleSuccessfulPayment = async (session) => {
  console.log('🎉 Iniciando procesamiento de pago exitoso');
  console.log('ID de sesión:', session.id);
  
  try {
    const { carritoId, customerEmail, customerName, shippingAddress, paymentMethod } = session.metadata;
    
    console.log('Datos de la sesión:', {
      carritoId,
      customerEmail,
      customerName,
      shippingAddress: JSON.parse(shippingAddress),
      paymentMethod
    });

    if (!carritoId) {
      throw new Error('CarritoId no encontrado en la metadata de la sesión');
    }

    // Buscar persona por email
    let personaId = null;
    const emailQuery = 'SELECT id_persona FROM persona WHERE correo = $1';
    const emailResult = await pool.query(emailQuery, [customerEmail]);
    
    if (emailResult.rows.length > 0) {
      personaId = emailResult.rows[0].id_persona;
      console.log('✅ Persona encontrada con ID:', personaId);
    } else {
      console.log('⚠️ No se encontró persona con el email:', customerEmail);
    }

    // Obtener detalles del carrito
    const detallesCarrito = await DetalleCarrito.getDetallesByCarritoId(carritoId);
    console.log('Detalles del carrito obtenidos:', detallesCarrito.length, 'items');

    if (!detallesCarrito || detallesCarrito.length === 0) {
      throw new Error(`No se encontraron productos en el carrito ${carritoId}`);
    }

    // Calcular totales
    const subtotal = detallesCarrito.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const envio = 15.99;
    const total = subtotal + envio;

    console.log('Totales calculados:', {
      subtotal: subtotal.toFixed(2),
      envio: envio.toFixed(2),
      total: total.toFixed(2)
    });

    // Iniciar transacción
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      console.log('🔄 Transacción iniciada');

      // 1. Insertar venta
      const insertVentaQuery = `
        INSERT INTO venta (
          id_persona, 
          origen_carrito, 
          total, 
          estado, 
          metodo_pago
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id_venta
      `;

      const ventaResult = await client.query(insertVentaQuery, [
        personaId,
        carritoId,
        total,
        'Completado',
        paymentMethod
      ]);

      const ventaId = ventaResult.rows[0].id_venta;
      console.log('✅ Venta creada con ID:', ventaId);

      // 2. Insertar detalles de venta
      for (const item of detallesCarrito) {
        const insertDetalleQuery = `
          INSERT INTO detalle_venta (
            id_venta,
            id_producto,
            cantidad,
            precio_unitario,
            total
          ) VALUES ($1, $2, $3, $4, $5)
          RETURNING id_detalle_venta
        `;

        const detalleResult = await client.query(insertDetalleQuery, [
          ventaId,
          item.id_producto,
          item.cantidad,
          item.precio_unitario,
          item.total
        ]);

        console.log('✅ Detalle de venta creado:', {
          id_detalle: detalleResult.rows[0].id_detalle_venta,
          producto: item.id_producto,
          cantidad: item.cantidad
        });

        // Actualizar stock del producto
        const updateStockQuery = `
          UPDATE producto 
          SET cantidad = cantidad - $1
          WHERE id_producto = $2
          RETURNING cantidad as nuevo_stock
        `;

        const stockResult = await client.query(updateStockQuery, [
          item.cantidad,
          item.id_producto
        ]);

        console.log('✅ Stock actualizado para producto:', {
          id_producto: item.id_producto,
          nuevo_stock: stockResult.rows[0].nuevo_stock
        });
      }

      // 3. Actualizar estado del carrito
      const updateCarritoQuery = `
        UPDATE carrito 
        SET estado = 'convertido'
        WHERE id_carrito = $1
      `;

      await client.query(updateCarritoQuery, [carritoId]);
      console.log('✅ Carrito marcado como convertido:', carritoId);

      // Confirmar transacción
      await client.query('COMMIT');
      console.log('✅ Transacción completada exitosamente');
      console.log(`💫 Venta #${ventaId} procesada completamente`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error durante la transacción:', error);
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Error general en el procesamiento del pago:', error);
    // Aquí podrías implementar algún sistema de notificación para errores críticos
  }
};

// Obtener clave pública de Stripe
const getPublicKey = (req, res) => {
  res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getPublicKey
}; 