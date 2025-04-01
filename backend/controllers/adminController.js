// filepath: c:\Users\elias\Downloads\proyect\proyectosistemasinformaciontres\backend\controllers\adminController.js
const personaModel = require('../models/personaModel');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await personaModel.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await personaModel.getById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// Crear nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Verificar campos obligatorios
    if (!userData.nombre_completo || !userData.correo || !userData.clave) {
      return res.status(400).json({ 
        message: 'Nombre, correo y contraseña son obligatorios' 
      });
    }
    
    // Verificar si el correo ya existe
    const existingUser = await personaModel.getByEmail(userData.correo);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'El correo electrónico ya está registrado' 
      });
    }
    
    const newUser = await personaModel.create(userData);
    
    res.status(201).json({
      message: 'Usuario creado con éxito',
      id: newUser.id_persona
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    // Verificar si el usuario existe
    const existingUser = await personaModel.getById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si se cambia el correo, verificar que no exista ya
    if (userData.correo && userData.correo !== existingUser.correo) {
      const emailExists = await personaModel.getByEmail(userData.correo);
      if (emailExists) {
        return res.status(400).json({ 
          message: 'El correo electrónico ya está registrado por otro usuario' 
        });
      }
    }
    
    const updatedUser = await personaModel.update(id, userData);
    
    if (!updatedUser) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }
    
    res.status(200).json({ 
      message: 'Usuario actualizado con éxito',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el usuario existe
    const existingUser = await personaModel.getById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    await personaModel.remove(id);
    
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};