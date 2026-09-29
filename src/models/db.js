// Base de datos simulada en memoria para el sistema de donaciones en Chihuahua
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const db = {
  usuarios: [
    {
      id: 1,
      nombre: 'Manuel Ortega',
      correo: 'admin@donacioneschihuahua.org',
      password: bcrypt.hashSync('Admin123!', salt),
      rol: 'administrador',
      telefono: '6141234567'
    },
    {
      id: 2,
      nombre: 'Carlos Lopez',
      correo: 'donante@gmail.com',
      password: bcrypt.hashSync('Donante123!', salt),
      rol: 'usuario',
      telefono: '6149876543'
    }
  ],
  instituciones: [
    {
      id: 1,
      nombre: 'DIF Estatal Chihuahua - Centro de Acopio',
      direccion: 'Av. Tecnologico 2903, Magisterial, Chihuahua, Chih.',
      lat: 28.6534,
      lng: -106.0889,
      estadoSemaforo: 'amarillo',
      descripcion: 'Atencion y canalizacion de menores. Requiere ropa de invierno y calzado.',
      contacto: '6144141234'
    },
    {
      id: 2,
      nombre: 'Casa Hogar de Ninas de Chihuahua A.C.',
      direccion: 'Calle 16a 2400, Cuauhtemoc, Chihuahua, Chih.',
      lat: 28.6321,
      lng: -106.0712,
      estadoSemaforo: 'rojo',
      descripcion: 'Prioridad alta: escasez critica de ropa para ninas de 4 a 12 anos y juguetes didacticos.',
      contacto: '6144156789'
    },
    {
      id: 3,
      nombre: 'Casa Cuna de Chihuahua',
      direccion: 'Av. Juarez 3100, Centro, Chihuahua, Chih.',
      lat: 28.6410,
      lng: -106.0645,
      estadoSemaforo: 'verde',
      descripcion: 'Abastecimiento suficiente por donaciones recientes. Recursos estables.',
      contacto: '6144102345'
    },
    {
      id: 4,
      nombre: 'Albergue Infantil San Vicente',
      direccion: 'Calle Coronado 1402, Obrera, Chihuahua, Chih.',
      lat: 28.6472,
      lng: -106.0798,
      estadoSemaforo: 'amarillo',
      descripcion: 'Necesidad moderada de chamarras y juguetes infantiles.',
      contacto: '6144128900'
    }
  ],
  donaciones: [
    {
      id: 1,
      idDonante: 2,
      nombreDonante: 'Carlos Lopez',
      tipo: 'ropa',
      categoria: 'Prendas de vestir',
      descripcion: 'Lote de 15 chamarras infantiles',
      talla: 'M (8 a 10 anos)',
      estadoPrenda: 'excelente',
      aprobadoCalidad: true,
      idInstitucionDestino: 2,
      fechaRegistro: '2026-09-15'
    },
    {
      id: 2,
      idDonante: null,
      nombreDonante: 'Anonimo',
      tipo: 'juguete',
      categoria: 'Juegos de mesa y figuras didacticas',
      descripcion: 'Caja con 20 juegos didacticos nuevos',
      talla: 'No aplica',
      estadoPrenda: 'No aplica',
      aprobadoCalidad: true,
      idInstitucionDestino: 1,
      fechaRegistro: '2026-09-20'
    }
  ]
};

module.exports = db;
