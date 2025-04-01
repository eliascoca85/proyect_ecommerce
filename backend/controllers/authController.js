const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

// Función para manejar el login de usuarios
exports.login = async (req, res) => {
  console.log('Endpoint login llamado con datos:', req.body);
  
  try {
    const { correo, clave } = req.body;

    // Validar datos
    if (!correo || !clave) {
      console.log('Error: Faltan datos obligatorios');
      return res.status(400).json({ 
        message: 'El correo y la contraseña son obligatorios' 
      });
    }

    // Buscar usuario en la base de datos
    console.log('Buscando usuario con correo:', correo);
    const userResult = await pool.query(
      'SELECT * FROM persona WHERE correo = $1',
      [correo]
    );

    const user = userResult.rows[0];

    // Verificar si el usuario existe
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    console.log('Usuario encontrado:', { id: user.id_persona, rol: user.rol });

    // Verificar la contraseña
    if (user.clave !== clave) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token JWT
    console.log('Generando token JWT');
    const token = jwt.sign(
      { 
        id: user.id_persona, 
        rol: user.rol 
      },
      process.env.JWT_SECRET || 'tu_clave_secreta',
      { expiresIn: '24h' }
    );

    // Responder con datos del usuario y token
    console.log('Login exitoso para:', user.correo);
    return res.status(200).json({
      user: {
        id: user.id_persona,
        nombre: user.nombre_completo,
        correo: user.correo,
        rol: user.rol
      },
      token,
      message: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};



// Función para manejar el registro de nuevos usuarios (siempre con rol Cliente)
exports.register = async (req, res) => {
  console.log('Endpoint register llamado con datos:', req.body);
  
  try {
    const { nombre_completo, correo, clave } = req.body;

    // Validar datos
    if (!nombre_completo || !correo || !clave) {
      console.log('Error: Faltan datos obligatorios');
      return res.status(400).json({ 
        message: 'Nombre completo, correo y contraseña son obligatorios' 
      });
    }

    // Verificar si el correo ya existe
    console.log('Verificando si el correo ya existe:', correo);
    const existingUserResult = await pool.query(
      'SELECT * FROM persona WHERE correo = $1',
      [correo]
    );

    if (existingUserResult.rows.length > 0) {
      console.log('Error: El correo ya está registrado');
      return res.status(400).json({ 
        message: 'Este correo electrónico ya está registrado' 
      });
    }

    // Insertar nuevo usuario con rol Cliente
    console.log('Creando nuevo usuario con rol Cliente');
    const result = await pool.query(
      'INSERT INTO persona (nombre_completo, correo, clave, rol, fecha_creacion) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id_persona',
      [nombre_completo, correo, clave, 'Cliente']  // Forzamos el rol a Cliente siempre
    );

    const newUserId = result.rows[0].id_persona;
    console.log('Usuario creado con ID:', newUserId);

    // Responder con éxito
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      userId: newUserId
    });
    
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};
// Añadir al final del archivo authController.js
// Para añadir en authController.js
exports.getFullProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verificar si el usuario del token coincide con el ID solicitado
    if (req.user.id != userId) {
      return res.status(403).json({ 
        message: 'No tienes permiso para acceder a este perfil' 
      });
    }
    
    const userResult = await pool.query(
      'SELECT * FROM persona WHERE id_persona = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const user = userResult.rows[0];
    
    return res.status(200).json({
      user: {
        id: user.id_persona,
        nombre: user.nombre_completo,
        correo: user.correo,
        telefono: user.telefono || null,
        rol: user.rol,
        direccion: {
          calle: user.direccion_calle || "",
          ciudad: user.direccion_ciudad || "",
          codigoPostal: user.direccion_codigo_postal || "",
          pais: user.direccion_pais || ""
        }
      }
    });
    
  } catch (error) {
    console.error('Error en getFullProfile:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};
// Añadir estos controladores
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Añadir esta línea que falta
    
    // Verificar si el usuario del token coincide con el ID solicitado
    if (req.user.id != userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este perfil' });
    }
    
    const { nombre, correo, telefono } = req.body; // Extraer estos valores correctamente
    
    await pool.query(
      'UPDATE persona SET nombre_completo = $1, correo = $2, telefono = $3 WHERE id_persona = $4',
      [nombre, correo, telefono, userId]
    );
    
    return res.status(200).json({ message: 'Perfil actualizado con éxito' });
    
  } catch (error) {
    console.error('Error en updateUserProfile:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.updateUserAddress = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verificar si el usuario del token coincide con el ID solicitado
    if (req.user.id != userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta dirección' });
    }
    
    const { direccion_calle, direccion_ciudad, direccion_codigo_postal, direccion_pais } = req.body;
    
    await pool.query(
      'UPDATE persona SET direccion_calle = $1, direccion_ciudad = $2, direccion_codigo_postal = $3, direccion_pais = $4 WHERE id_persona = $5',
      [direccion_calle, direccion_ciudad, direccion_codigo_postal, direccion_pais, userId]
    );
    
    return res.status(200).json({ message: 'Dirección actualizada con éxito' });
    
  } catch (error) {
    console.error('Error en updateUserAddress:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};
exports.updateUserPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verificar si el usuario del token coincide con el ID solicitado
    if (req.user.id != userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este perfil' });
    }
    
    const { claveActual, nuevaClave } = req.body;
    
    // Obtener el usuario de la base de datos
    const userResult = await pool.query(
      'SELECT clave FROM persona WHERE id_persona = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const user = userResult.rows[0];
    
    // Verificar que la contraseña actual sea correcta
    if (user.clave !== claveActual) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }
    
    // Actualizar la contraseña
    await pool.query(
      'UPDATE persona SET clave = $1 WHERE id_persona = $2',
      [nuevaClave, userId]
    );
    
    return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    
  } catch (error) {
    console.error('Error en updateUserPassword:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};