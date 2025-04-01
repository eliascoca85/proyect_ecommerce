const Marca = require('../models/marcaModel');
const fs = require('fs');
const path = require('path');

const obtenerMarcas = async (req, res) => {
  try {
    const marcas = await Marca.getMarcas();
    res.json(marcas);
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
};

const obtenerMarcaPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const marca = await Marca.getMarcaById(id);
    
    if (!marca) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    res.json(marca);
  } catch (error) {
    console.error('Error al obtener marca por ID:', error);
    res.status(500).json({ error: 'Error al obtener la marca' });
  }
};

const crearMarca = async (req, res) => {
  try {
    const { nombre, logo } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre de la marca es obligatorio' });
    }
    
    const nuevaMarca = await Marca.createMarca(nombre, logo || null);
    res.status(201).json(nuevaMarca);
  } catch (error) {
    console.error('Error al crear marca:', error);
    res.status(500).json({ error: 'Error al crear la marca' });
  }
};

const actualizarMarca = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    
    if (!nombre) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        error: 'El nombre de la marca es obligatorio' 
      });
    }
    
    let logoPath = null;
    if (req.file) {
      logoPath = `/uploads/${req.file.filename}`;
      
      const marcaExistente = await Marca.getMarcaById(id);
      if (marcaExistente && marcaExistente.logo) {
        const oldLogoPath = path.join(__dirname, '../public', marcaExistente.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
    }
    
    const marcaActualizada = await Marca.updateMarca(id, {
      nombre,
      logo: logoPath || undefined
    });
    
    if (!marcaActualizada) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    res.json(marcaActualizada);
  } catch (error) {
    console.error('Error al actualizar marca:', error);
    res.status(500).json({ error: 'Error al actualizar la marca' });
  }
};

const eliminarMarca = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const marcaEliminada = await Marca.deleteMarca(id);
    
    if (!marcaEliminada) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    res.json({ mensaje: 'Marca eliminada correctamente', marca: marcaEliminada });
  } catch (error) {
    console.error('Error al eliminar marca:', error);
    res.status(500).json({ error: 'Error al eliminar la marca' });
  }
};

module.exports = { 
  obtenerMarcas,
  obtenerMarcaPorId,
  crearMarca,
  actualizarMarca,
  eliminarMarca
};
