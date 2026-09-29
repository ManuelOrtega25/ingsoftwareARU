// Controlador para gestion de inventario y donaciones de ropa y juguetes
const db = require('../models/db');

function sanitizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

function registrarDonacion(req, res) {
  const { tipo, categoria, descripcion, talla, estadoPrenda, idInstitucionDestino, nombreDonante } = req.body;

  if (!tipo || !descripcion) {
    return res.status(400).json({
      exito: false,
      mensaje: 'El tipo de donacion (ropa o juguete) y la descripcion son obligatorios'
    });
  }

  const tipoNormalizado = tipo.toLowerCase();
  if (tipoNormalizado !== 'ropa' && tipoNormalizado !== 'juguete') {
    return res.status(400).json({
      exito: false,
      mensaje: 'El tipo debe ser ropa o juguete'
    });
  }

  if (tipoNormalizado === 'ropa') {
    if (!talla || !estadoPrenda) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Para donaciones de ropa es obligatorio registrar talla y estado de la prenda para el control de calidad'
      });
    }
  }

  const donanteId = req.usuario ? req.usuario.id : null;
  const nombreFinal = req.usuario ? req.usuario.nombre : (nombreDonante ? sanitizarTexto(nombreDonante) : 'Anonimo');

  const nuevaDonacion = {
    id: db.donaciones.length + 1,
    idDonante: donanteId,
    nombreDonante: nombreFinal,
    tipo: tipoNormalizado,
    categoria: sanitizarTexto(categoria || (tipoNormalizado === 'ropa' ? 'Prendas de vestir' : 'Juguetes infantiles')),
    descripcion: sanitizarTexto(descripcion),
    talla: tipoNormalizado === 'ropa' ? sanitizarTexto(talla) : 'No aplica',
    estadoPrenda: tipoNormalizado === 'ropa' ? sanitizarTexto(estadoPrenda) : 'No aplica',
    aprobadoCalidad: true,
    idInstitucionDestino: idInstitucionDestino ? parseInt(idInstitucionDestino, 10) : 1,
    fechaRegistro: new Date().toISOString().split('T')[0]
  };

  db.donaciones.push(nuevaDonacion);

  return res.status(201).json({
    exito: true,
    mensaje: 'Donacion registrada exitosamente en el inventario',
    donacion: nuevaDonacion
  });
}

function listarDonaciones(req, res) {
  const { tipo, idInstitucion } = req.query;
  let resultado = [...db.donaciones];

  if (tipo) {
    resultado = resultado.filter(d => d.tipo.toLowerCase() === tipo.toLowerCase());
  }

  if (idInstitucion) {
    resultado = resultado.filter(d => d.idInstitucionDestino === parseInt(idInstitucion, 10));
  }

  return res.status(200).json({
    exito: true,
    total: resultado.length,
    donaciones: resultado
  });
}

function actualizarControlCalidad(req, res) {
  const { id } = req.params;
  const { aprobadoCalidad, observaciones } = req.body;

  const donacion = db.donaciones.find(d => d.id === parseInt(id, 10));
  if (!donacion) {
    return res.status(404).json({
      exito: false,
      mensaje: 'Donacion no encontrada'
    });
  }

  donacion.aprobadoCalidad = Boolean(aprobadoCalidad);
  if (observaciones) {
    donacion.observacionesCalidad = sanitizarTexto(observaciones);
  }

  return res.status(200).json({
    exito: true,
    mensaje: 'Control de calidad actualizado correctamente',
    donacion
  });
}

module.exports = {
  registrarDonacion,
  listarDonaciones,
  actualizarControlCalidad,
  sanitizarTexto
};
