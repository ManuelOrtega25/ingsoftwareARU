// Rutas para instituciones, mapa y semaforo de prioridad
const express = require('express');
const router = express.Router();
const institucionesController = require('../controllers/institucionesController');
const { autenticarToken, requerirRol } = require('../middleware/authMiddleware');

// Listar todas las casas hogar y centros DIF (publico)
router.get('/', institucionesController.listarInstituciones);

// Obtener detalle de una institucion
router.get('/:id', institucionesController.obtenerInstitucionPorId);

// Actualizar estado del semaforo (solo administrador)
router.patch('/:id/semaforo', autenticarToken, requerirRol('administrador'), institucionesController.actualizarSemaforo);

module.exports = router;
