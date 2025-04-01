const Producto = require('../models/productoModel');
const fs = require('fs');
const path = require('path');

const obtenerProductos = async (req, res) => {
  try {
    const includeDetails = req.query.includeDetails === 'true';
    
    let productos;
    if (includeDetails) {
      // Consulta con JOIN para incluir el nombre de la marca
      productos = await Producto.getProductosWithDetails();
    } else {
      productos = await Producto.getProductos();
    }
    
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await Producto.getProductoById(id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      id_marca, 
      precio, 
      precio_oferta, 
      cantidad
    } = req.body;
    
    if (!nombre || !precio || !cantidad) {
      // Si hay un archivo subido pero hay error en la validación, eliminar el archivo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        error: 'Los campos nombre, precio y cantidad son obligatorios' 
      });
    }
    
    // Obtener la ruta de la imagen si se subió
    let imagenPath = null;
    if (req.file) {
      // Guardar la ruta relativa para acceder desde el frontend
      imagenPath = `/uploads/${req.file.filename}`;
    }
    
    const nuevoProducto = await Producto.createProducto({
      nombre, 
      descripcion: descripcion || null, 
      id_marca: id_marca || null, 
      precio, 
      precio_oferta: precio_oferta || null, 
      cantidad, 
      imagen: imagenPath
    });
    
    res.status(201).json(nuevoProducto);
  } catch (error) {
    // Si hay un error y se subió un archivo, eliminar el archivo
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { 
      nombre, 
      descripcion, 
      id_marca, 
      precio, 
      precio_oferta, 
      cantidad
    } = req.body;
    
    if (!nombre || !precio || !cantidad) {
      // Si hay un archivo subido pero hay error en la validación, eliminar el archivo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        error: 'Los campos nombre, precio y cantidad son obligatorios' 
      });
    }
    
    // Obtener el producto actual para verificar si tiene una imagen
    const productoActual = await Producto.getProductoById(id);
    
    if (!productoActual) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Obtener la ruta de la imagen si se subió una nueva
    let imagenPath = productoActual.imagen;
    if (req.file) {
      // Si hay una imagen anterior, eliminarla
      if (productoActual.imagen) {
        const rutaImagenAnterior = path.join(__dirname, '../public', productoActual.imagen);
        if (fs.existsSync(rutaImagenAnterior)) {
          fs.unlinkSync(rutaImagenAnterior);
        }
      }
      // Guardar la ruta relativa de la nueva imagen
      imagenPath = `/uploads/${req.file.filename}`;
    }
    
    const productoActualizado = await Producto.updateProducto(id, {
      nombre, 
      descripcion: descripcion || null, 
      id_marca: id_marca || null, 
      precio, 
      precio_oferta: precio_oferta || null, 
      cantidad, 
      imagen: imagenPath
    });
    
    res.json(productoActualizado);
  } catch (error) {
    // Si hay un error y se subió un archivo, eliminar el archivo
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Obtener el producto para verificar si tiene una imagen
    const producto = await Producto.getProductoById(id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Eliminar la imagen si existe
    if (producto.imagen) {
      const rutaImagen = path.join(__dirname, '../public', producto.imagen);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    }
    
    const productoEliminado = await Producto.deleteProducto(id);
    
    res.json({ 
      mensaje: 'Producto eliminado correctamente', 
      producto: productoEliminado 
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

const obtenerProductosPorMarca = async (req, res) => {
  try {
    const marcaId = parseInt(req.params.marcaId);
    const productos = await Producto.getProductosByMarca(marcaId);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por marca:', error);
    res.status(500).json({ error: 'Error al obtener los productos por marca' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorMarca
};
