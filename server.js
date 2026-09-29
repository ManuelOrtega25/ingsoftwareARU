// Servidor principal del Sistema de Donaciones para Casas Hogar y DIF en Chihuahua
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./src/routes/authRoutes');
const donacionesRoutes = require('./src/routes/donacionesRoutes');
const institucionesRoutes = require('./src/routes/institucionesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad con Helmet (proteccion contra XSS, Clickjacking, MIME sniffing)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org", "https://server.arcgisonline.com", "https://*.arcgisonline.com", "https://unpkg.com"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend estatico
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/donaciones', donacionesRoutes);
app.use('/api/instituciones', institucionesRoutes);

// Endpoint de estado / salud del sistema
app.get('/api/health', (req, res) => {
  res.status(200).json({
    estado: 'ok',
    sistema: 'Sistema de Donaciones Chihuahua',
    version: '1.0.0',
    fecha: new Date().toISOString()
  });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor de donaciones corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
