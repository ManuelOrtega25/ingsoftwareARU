// Controlador para registro y autenticacion con JWT
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function registrarUsuario(req, res) {
  const { nombre, correo, password, rol, telefono } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({
      exito: false,
      mensaje: 'El nombre, correo y contrasena son obligatorios'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      exito: false,
      mensaje: 'La contrasena debe tener al menos 6 caracteres'
    });
  }

  const usuarioExistente = db.usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());
  if (usuarioExistente) {
    return res.status(400).json({
      exito: false,
      mensaje: 'El correo electronico ya se encuentra registrado'
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const nuevoUsuario = {
    id: db.usuarios.length + 1,
    nombre: nombre.trim(),
    correo: correo.trim().toLowerCase(),
    password: passwordHash,
    rol: rol === 'administrador' ? 'administrador' : 'usuario',
    telefono: telefono || ''
  };

  db.usuarios.push(nuevoUsuario);

  const token = jwt.sign(
    {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.status(201).json({
    exito: true,
    mensaje: 'Usuario registrado correctamente',
    token,
    usuario: {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol
    }
  });
}

function iniciarSesion(req, res) {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Debes proporcionar correo y contrasena'
    });
  }

  const usuario = db.usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());
  if (!usuario) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Credenciales invalidas'
    });
  }

  const passwordValido = bcrypt.compareSync(password, usuario.password);
  if (!passwordValido) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Credenciales invalidas'
    });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.status(200).json({
    exito: true,
    mensaje: 'Inicio de sesion exitoso',
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    }
  });
}

function obtenerPerfil(req, res) {
  const usuario = db.usuarios.find(u => u.id === req.usuario.id);
  if (!usuario) {
    return res.status(404).json({
      exito: false,
      mensaje: 'Usuario no encontrado'
    });
  }

  return res.status(200).json({
    exito: true,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      telefono: usuario.telefono
    }
  });
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil
};
