const DetalleCarrito = require('../models/detalleCarritoModel');
const Producto = require('../models/productoModel');
const Carrito = require('../models/carritoModel');

// Obtener todos los detalles de un carrito
const obtenerDetallesCarrito = async (req, res) => {
  try {
    const carritoId = parseInt(req.params.id);
    
    if (!carritoId || isNaN(carritoId)) {
      return res.status(400).json({ error: 'ID de carrito inválido' });
    }
    
    // Verificar si el carrito existe
    const carritoExiste = await Carrito.getById(carritoId);
    if (!carritoExiste) {
      // Si el carrito no existe, devolver un array vacío en lugar de un error
      return res.json([]);
    }
    
    const detalles = await DetalleCarrito.getDetallesByCarritoId(carritoId);
    res.json(detalles || []);
  } catch (error) {
    console.error('Error al obtener detalles del carrito:', error);
    // En caso de error, devolver un array vacío para que el frontend pueda continuar
    res.json([]);
  }
};

// Añadir un producto al carrito
const addProductToCarrito = async (req, res) => {
  try {
    const { id_carrito, id_producto, cantidad } = req.body;
    
    // Validar datos
    if (!id_carrito || !id_producto || !cantidad) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    
    // Verificar si el producto ya existe en el carrito
    const existingDetalle = await DetalleCarrito.getByCarritoAndProducto(id_carrito, id_producto);
    
    if (existingDetalle) {
      // Si existe, actualizar la cantidad
      const nuevaCantidad = existingDetalle.cantidad + cantidad;
      const detalleActualizado = await DetalleCarrito.updateCantidad(existingDetalle.id_detalle_carrito, nuevaCantidad);
      return res.json(detalleActualizado);
    }
    
    // Si no existe, crear un nuevo detalle
    const nuevoDetalle = await DetalleCarrito.create(id_carrito, id_producto, cantidad);
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

// Actualizar la cantidad de un producto en el carrito
const actualizarCantidadProducto = async (req, res) => {
  console.log('Params recibidos:', req.params);
  console.log('Body recibido:', req.body);
  try {
    const detalleId = parseInt(req.params.detalleId);
    console.log('detalleId parseado:', detalleId);
    const { cantidad } = req.body;
    
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a cero' });
    }
    
    // Obtener el detalle actual para verificar el producto
    const detalleActual = await DetalleCarrito.getDetalleById(detalleId);
    if (!detalleActual) {
      return res.status(404).json({ error: 'Detalle de carrito no encontrado' });
    }
    
    // Verificar que haya suficiente stock
    const producto = await Producto.getProductoById(detalleActual.id_producto);
    if (producto.cantidad < cantidad) {
      return res.status(400).json({ 
        error: 'No hay suficiente stock disponible',
        stockDisponible: producto.cantidad
      });
    }
    
    const detalleActualizado = await DetalleCarrito.updateDetalleCarrito(detalleId, cantidad);
    
    // Obtener el detalle actualizado con información adicional del producto
    const detalleCompleto = await DetalleCarrito.getDetalleById(detalleActualizado.id_detalle_carrito);
    
    res.json(detalleCompleto);
  } catch (error) {
    console.error('Error al actualizar cantidad del producto:', error);
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
  }
};

// Eliminar un producto del carrito
const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const detalleId = parseInt(req.params.detalleId);
    
    const detalleEliminado = await DetalleCarrito.removeProductFromCarrito(detalleId);
    
    if (!detalleEliminado) {
      return res.status(404).json({ error: 'Detalle de carrito no encontrado' });
    }
    
    res.json({ 
      mensaje: 'Producto eliminado del carrito correctamente', 
      detalle: detalleEliminado 
    });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
};

// Vaciar el carrito
const vaciarCarrito = async (req, res) => {
  try {
    const carritoId = parseInt(req.params.carritoId);
    
    const detallesEliminados = await DetalleCarrito.clearCarrito(carritoId);
    
    res.json({ 
      mensaje: 'Carrito vaciado correctamente', 
      detalles: detallesEliminados 
    });
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};

// Obtener el total del carrito
const obtenerTotalCarrito = async (req, res) => {
  try {
    const carritoId = parseInt(req.params.carritoId);
    
    const total = await DetalleCarrito.getCarritoTotal(carritoId);
    
    res.json({ total });
  } catch (error) {
    console.error('Error al obtener el total del carrito:', error);
    res.status(500).json({ error: 'Error al obtener el total del carrito' });
  }
};

module.exports = {
  obtenerDetallesCarrito,
  addProductToCarrito,
  actualizarCantidadProducto,
  eliminarProductoDelCarrito,
  vaciarCarrito,
  obtenerTotalCarrito
};
