// Rutas para gestion de donaciones e inventario
const express = require('express');
const router = express.Router();
const donacionesController = require('../controllers/donacionesController');
const { autenticarToken, requerirRol } = require('../middleware/authMiddleware');

// Registro de donacion (publico o con sesion opcional)
router.post('/', (req, res, next) => {
  if (req.headers['authorization']) {
    return autenticarToken(req, res, next);
  }
  next();
}, donacionesController.registrarDonacion);

// Listado de inventario
router.get('/', donacionesController.listarDonaciones);

// Control de calidad (solo administrador)
router.patch('/:id/calidad', autenticarToken, requerirRol('administrador'), donacionesController.actualizarControlCalidad);

module.exports = router;
