// Pruebas unitarias para control de roles y semaforo de instituciones
const request = require('supertest');
const app = require('../server');

describe('Modulo de Roles e Instituciones (Semaforo)', () => {
  let adminToken = '';
  let usuarioToken = '';

  beforeAll(async () => {
    // Obtener token de administrador
    const resAdmin = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'admin@donacioneschihuahua.org',
        password: 'Admin123!'
      });
    adminToken = resAdmin.body.token;

    // Obtener token de usuario regular
    const resUser = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'donante@gmail.com',
        password: 'Donante123!'
      });
    usuarioToken = resUser.body.token;
  });

  test('Debe listar las instituciones con su estado de semaforo', async () => {
    const res = await request(app).get('/api/instituciones');
    expect(res.statusCode).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.instituciones.length).toBeGreaterThan(0);
  });

  test('Debe filtrar instituciones por color de semaforo', async () => {
    const res = await request(app).get('/api/instituciones?semaforo=rojo');
    expect(res.statusCode).toBe(200);
    expect(res.body.instituciones.every(i => i.estadoSemaforo === 'rojo')).toBe(true);
  });

  test('Debe obtener una institucion especifica por su ID', async () => {
    const res = await request(app).get('/api/instituciones/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.institucion.id).toBe(1);
  });

  test('Debe retornar 404 si la institucion no existe por su ID', async () => {
    const res = await request(app).get('/api/instituciones/999');
    expect(res.statusCode).toBe(404);
  });

  test('Debe permitir a un administrador actualizar el semaforo a rojo (prioridad alta)', async () => {
    const res = await request(app)
      .patch('/api/instituciones/1/semaforo')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nuevoSemaforo: 'rojo',
        descripcion: 'Requiere apoyo urgente de ropa invernal'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.institucion.estadoSemaforo).toBe('rojo');
  });

  test('Debe rechazar la actualizacion de semaforo si no se envia el campo nuevoSemaforo', async () => {
    const res = await request(app)
      .patch('/api/instituciones/1/semaforo')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test('Debe retornar 404 al intentar actualizar semaforo de una institucion inexistente', async () => {
    const res = await request(app)
      .patch('/api/instituciones/999/semaforo')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nuevoSemaforo: 'verde'
      });

    expect(res.statusCode).toBe(404);
  });

  test('Debe denegar a un usuario regular (rol usuario) cambiar el semaforo (error 403)', async () => {
    const res = await request(app)
      .patch('/api/instituciones/1/semaforo')
      .set('Authorization', `Bearer ${usuarioToken}`)
      .send({
        nuevoSemaforo: 'verde'
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.exito).toBe(false);
  });

  test('Debe rechazar un color de semaforo no valido', async () => {
    const res = await request(app)
      .patch('/api/instituciones/1/semaforo')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nuevoSemaforo: 'azul'
      });

    expect(res.statusCode).toBe(400);
  });

  test('Debe permitir al administrador actualizar el control de calidad de una donacion', async () => {
    const res = await request(app)
      .patch('/api/donaciones/1/calidad')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        aprobadoCalidad: true,
        observaciones: 'Prenda inspeccionada y en perfecto estado'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.exito).toBe(true);
  });

  test('Debe retornar 404 si la donacion a calificar no existe', async () => {
    const res = await request(app)
      .patch('/api/donaciones/999/calidad')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        aprobadoCalidad: false
      });

    expect(res.statusCode).toBe(404);
  });

  test('Debe permitir registrar usuario con rol administrador directamente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Admin Auxiliar',
        correo: 'admin2@donacioneschihuahua.org',
        password: 'Password123!',
        rol: 'administrador'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.usuario.rol).toBe('administrador');
  });

  test('Debe retornar 200 en el endpoint de salud del sistema /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.estado).toBe('ok');
  });

  test('Debe retornar 404 para rutas no existentes', async () => {
    const res = await request(app).get('/api/ruta-inexistente');
    expect(res.statusCode).toBe(404);
  });

});
