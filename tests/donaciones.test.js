// Pruebas unitarias para registro de donaciones, control de calidad y sanitizacion
const request = require('supertest');
const app = require('../server');

describe('Modulo de Donaciones e Inventario', () => {

  test('Debe registrar exitosamente una donacion de ropa con talla y estado de prenda', async () => {
    const res = await request(app)
      .post('/api/donaciones')
      .send({
        tipo: 'ropa',
        categoria: 'Chamarras de invierno',
        descripcion: 'Lote de 10 chamarras termicas',
        talla: 'Talla 10',
        estadoPrenda: 'excelente',
        idInstitucionDestino: 2,
        nombreDonante: 'Voluntario Chihuahua'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.exito).toBe(true);
    expect(res.body.donacion.tipo).toBe('ropa');
    expect(res.body.donacion.talla).toBe('Talla 10');
    expect(res.body.donacion.aprobadoCalidad).toBe(true);
  });

  test('Debe registrar una donacion de juguete didactico correctamente', async () => {
    const res = await request(app)
      .post('/api/donaciones')
      .send({
        tipo: 'juguete',
        categoria: 'Juegos de mesa',
        descripcion: '5 juegos de ajedrez y rompecabezas',
        idInstitucionDestino: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.exito).toBe(true);
    expect(res.body.donacion.tipo).toBe('juguete');
    expect(res.body.donacion.talla).toBe('No aplica');
  });

  test('Debe rechazar donacion si falta descripcion o tipo', async () => {
    const res = await request(app)
      .post('/api/donaciones')
      .send({
        tipo: 'ropa'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.exito).toBe(false);
  });

  test('Debe rechazar donacion de ropa si falta talla o estado de prenda', async () => {
    const res = await request(app)
      .post('/api/donaciones')
      .send({
        tipo: 'ropa',
        descripcion: 'Pantalones varios'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.exito).toBe(false);
  });

  test('Debe listar el inventario completo de donaciones', async () => {
    const res = await request(app).get('/api/donaciones');
    expect(res.statusCode).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(Array.isArray(res.body.donaciones)).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  });

  test('Debe filtrar donaciones por tipo ropa', async () => {
    const res = await request(app).get('/api/donaciones?tipo=ropa');
    expect(res.statusCode).toBe(200);
    expect(res.body.donaciones.every(d => d.tipo === 'ropa')).toBe(true);
  });

  test('Debe sanitizar entradas con posibles etiquetas HTML (proteccion XSS)', async () => {
    const res = await request(app)
      .post('/api/donaciones')
      .send({
        tipo: 'juguete',
        descripcion: '<script>alert("xss")</script>Pelota de futbol',
        nombreDonante: '<b>Hacker</b>'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.donacion.descripcion).not.toContain('<script>');
    expect(res.body.donacion.nombreDonante).not.toContain('<b>');
  });

});
