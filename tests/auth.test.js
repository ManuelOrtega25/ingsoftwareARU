// Pruebas unitarias para autenticacion JWT y registro de usuarios
const request = require('supertest');
const app = require('../server');
const db = require('../src/models/db');

describe('Modulo de Autenticacion y JWT', () => {

  test('Debe registrar exitosamente un nuevo donante y retornar un token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Maria Fernanda',
        correo: 'maria.test@example.com',
        password: 'Password123!',
        rol: 'usuario',
        telefono: '6143332211'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.exito).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario.nombre).toBe('Maria Fernanda');
    expect(res.body.usuario.rol).toBe('usuario');
  });

  test('Debe rechazar el registro si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        correo: 'incompleto@example.com'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.exito).toBe(false);
  });

  test('Debe rechazar el registro con una contrasena menor a 6 caracteres', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Pedro',
        correo: 'pedro@example.com',
        password: '123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.exito).toBe(false);
  });

  test('Debe rechazar el registro si el correo ya existe en la base de datos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Duplicado',
        correo: 'admin@donacioneschihuahua.org',
        password: 'Password123!'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.exito).toBe(false);
  });

  test('Debe iniciar sesion exitosamente con credenciales validas y retornar token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'admin@donacioneschihuahua.org',
        password: 'Admin123!'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario.rol).toBe('administrador');
  });

  test('Debe denegar inicio de sesion con contrasena incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'admin@donacioneschihuahua.org',
        password: 'ContrasenaIncorrecta'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.exito).toBe(false);
  });

  test('Debe denegar inicio de sesion si falta correo o contrasena', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'admin@donacioneschihuahua.org'
      });

    expect(res.statusCode).toBe(400);
  });

  test('Debe consultar el perfil del usuario autenticado con token valido', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'admin@donacioneschihuahua.org',
        password: 'Admin123!'
      });

    const token = loginRes.body.token;

    const perfilRes = await request(app)
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(perfilRes.statusCode).toBe(200);
    expect(perfilRes.body.usuario.correo).toBe('admin@donacioneschihuahua.org');
  });

  test('Debe denegar acceso al perfil si no se envia token', async () => {
    const res = await request(app).get('/api/auth/perfil');
    expect(res.statusCode).toBe(401);
  });

});
