// Controlador para instituciones, casas hogar y DIF en Chihuahua
const db = require('../models/db');

function listarInstituciones(req, res) {
  const { semaforo } = req.query;
  let lista = [...db.instituciones];

  if (semaforo) {
    lista = lista.filter(inst => inst.estadoSemaforo.toLowerCase() === semaforo.toLowerCase());
  }

  return res.status(200).json({
    exito: true,
    total: lista.length,
    instituciones: lista
  });
}

function obtenerInstitucionPorId(req, res) {
  const { id } = req.params;
  const institucion = db.instituciones.find(inst => inst.id === parseInt(id, 10));

  if (!institucion) {
    return res.status(404).json({
      exito: false,
      mensaje: 'Institucion no encontrada'
    });
  }

  return res.status(200).json({
    exito: true,
    institucion
  });
}

function actualizarSemaforo(req, res) {
  const { id } = req.params;
  const { nuevoSemaforo, descripcion } = req.body;

  if (!nuevoSemaforo) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Debes indicar el nuevo estado del semaforo (verde, amarillo o rojo)'
    });
  }

  const color = nuevoSemaforo.toLowerCase();
  if (color !== 'verde' && color !== 'amarillo' && color !== 'rojo') {
    return res.status(400).json({
      exito: false,
      mensaje: 'El color del semaforo debe ser verde, amarillo o rojo'
    });
  }

  const institucion = db.instituciones.find(inst => inst.id === parseInt(id, 10));
  if (!institucion) {
    return res.status(404).json({
      exito: false,
      mensaje: 'Institucion no encontrada'
    });
  }

  institucion.estadoSemaforo = color;
  if (descripcion) {
    institucion.descripcion = descripcion.trim();
  }

  return res.status(200).json({
    exito: true,
    mensaje: 'Estado de prioridad actualizado en el mapa',
    institucion
  });
}

module.exports = {
  listarInstituciones,
  obtenerInstitucionPorId,
  actualizarSemaforo
};
