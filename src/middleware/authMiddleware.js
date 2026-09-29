// Middleware para autenticacion JWT y verificacion de roles
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_donaciones_chihuahua_2026';

function autenticarToken(req, res, next) {
  const cabeceraAuth = req.headers['authorization'];
  if (!cabeceraAuth) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Acceso denegado, falta token de autenticacion'
    });
  }

  const partes = cabeceraAuth.split(' ');
  const token = partes.length === 2 ? partes[1] : partes[0];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token no valido o expirado'
    });
  }
}

function requerirRol(rolRequerido) {
  return function(req, res, next) {
    if (!req.usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no autenticado'
      });
    }

    if (req.usuario.rol !== rolRequerido && req.usuario.rol !== 'administrador') {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes los permisos necesarios para realizar esta accion'
      });
    }

    next();
  };
}

module.exports = {
  autenticarToken,
  requerirRol,
  JWT_SECRET
};
