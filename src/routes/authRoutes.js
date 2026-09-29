// Rutas para autenticacion y donantes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { autenticarToken } = require('../middleware/authMiddleware');

router.post('/register', authController.registrarUsuario);
router.post('/login', authController.iniciarSesion);
router.get('/perfil', autenticarToken, authController.obtenerPerfil);

module.exports = router;
