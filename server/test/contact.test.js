// Tests del formulario de contacto y del envío de emails
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { openDatabase } from '../src/db.js';
import { createApp } from '../src/server.js';
import { recibirContacto, guardarMensaje, listarMensajes, ContactError } from '../src/contact.js';
import { enviarEmail } from '../src/mailer.js';

const VALIDO = {
  name: 'Marta',
  email: 'marta@example.com',
  subject: 'No me funciona el ejercicio 12',
  message: 'Hola, creo que hay un fallo en el módulo de filtros, ¿puedes revisarlo?'
};

describe('Formulario de contacto', () => {
  let db;
  beforeEach(() => { db = openDatabase(':memory:'); });

  test('guarda el mensaje con los datos correctos', () => {
    const r = guardarMensaje(db, VALIDO);
    assert.ok(r.id);
    assert.equal(r.name, 'Marta');
    assert.equal(r.email, 'marta@example.com');
    assert.equal(r.sent, false);

    const guardados = listarMensajes(db);
    assert.equal(guardados.length, 1);
    assert.equal(guardados[0].subject, VALIDO.subject);
    assert.equal(guardados[0].message, VALIDO.message);
  });

  test('asocia el usuario si se pasa su id', () => {
    guardarMensaje(db, VALIDO, 'user-123');
    const rows = db.prepare('SELECT user_id FROM contact_messages').all();
    assert.equal(rows[0].user_id, 'user-123');
  });

  test('guarda el mensaje aunque el email no se pueda enviar', async () => {
    // Sin SMTP_HOST ni RESEND_API_KEY el envío falla, pero no debe perder nada
    const r = await recibirContacto(db, VALIDO);
    assert.equal(r.sent, false);
    assert.ok(r.warning, 'debe avisar de que no se envió');
    assert.equal(listarMensajes(db).length, 1, 'el mensaje debe seguir guardado');
  });

  test('marca el envío fallido con su motivo', async () => {
    await recibirContacto(db, VALIDO);
    const m = listarMensajes(db)[0];
    assert.equal(m.sent, false);
    assert.match(m.sendError, /SMTP_HOST|RESEND_API_KEY/);
  });

  test('descarta los mensajes más antiguos al listar', () => {
    guardarMensaje(db, { ...VALIDO, subject: 'Primero' });
    guardarMensaje(db, { ...VALIDO, subject: 'Segundo' });
    guardarMensaje(db, { ...VALIDO, subject: 'Tercero' });
    const lista = listarMensajes(db);
    assert.equal(lista[0].subject, 'Tercero', 'el más reciente primero');
    assert.equal(lista[lista.length - 1].subject, 'Primero', 'el más antiguo al final');
  });

  test('el límite de la lista está acotado', () => {
    // El asunto mínimo son 3 caracteres, así que 'S0' no valdría
    for (let i = 0; i < 5; i++) guardarMensaje(db, { ...VALIDO, subject: 'Asunto ' + i });
    assert.equal(listarMensajes(db, 2).length, 2, 'respeta el límite pedido');
    assert.equal(listarMensajes(db).length, 5, 'sin límite devuelve todo');
    assert.equal(listarMensajes(db, 9999).length, 5, 'un límite enorme no rompe nada');
    assert.equal(listarMensajes(db, -3).length, 5, 'un límite negativo cae al valor por defecto');
  });
});

describe('Validación del contacto', () => {
  let db;
  beforeEach(() => { db = openDatabase(':memory:'); });

  const rechaza = (datos, patron) => {
    assert.throws(() => guardarMensaje(db, datos), (err) => {
      assert.ok(err instanceof ContactError, 'debe ser ContactError');
      assert.match(err.message, patron);
      return true;
    });
  };

  test('exige un nombre', () => {
    rechaza({ ...VALIDO, name: '' }, /nombre/i);
    rechaza({ ...VALIDO, name: 'A' }, /nombre/i);
  });

  test('exige un email con forma válida', () => {
    rechaza({ ...VALIDO, email: 'no-es-email' }, /email/i);
    rejects({ ...VALIDO, email: 'a@b' });
  });

  function rejects(datos) {
    assert.throws(() => guardarMensaje(db, datos), ContactError);
  }

  test('exige un asunto', () => {
    rechaza({ ...VALIDO, subject: '' }, /asunto/i);
    rechaza({ ...VALIDO, subject: 'ab' }, /asunto/i);
  });

  test('exige un mensaje con contenido', () => {
    rechaza({ ...VALIDO, message: 'corto' }, /más/i);
    rechaza({ ...VALIDO, message: '' }, /más/i);
  });

  test('recorta los campos en vez de rechazar los largos', () => {
    const r = guardarMensaje(db, { ...VALIDO, message: 'a'.repeat(9000) });
    assert.equal(r.message.length, 4000);
  });

  test('recorta los espacios de los bordes', () => {
    const r = guardarMensaje(db, { ...VALIDO, name: '  Marta  ' });
    assert.equal(r.name, 'Marta');
  });
});

describe('Envío de emails', () => {
  test('sin SMTP ni API avisa de que falta configurarlo', async () => {
    const r = await enviarEmail({ to: 'x@example.com', subject: 'Hola', text: 'Prueba' });
    if (r.via === 'ninguna') {
      assert.equal(r.ok, false);
      assert.match(r.error, /SMTP_HOST|RESEND_API_KEY/);
    }
  });

  test('nunca lanza aunque no haya destinatario', async () => {
    const r = await enviarEmail({ subject: 'Hola', text: 'Prueba' });
    assert.equal(typeof r.ok, 'boolean');
  });
});

describe('Endpoint /api/contact', () => {
  let db;
  let app;
  let url;

  beforeEach(async () => {
    db = openDatabase(':memory:');
    app = createApp(db);
    await new Promise((resolve) => {
      app.listen(0, resolve);
    });
    url = 'http://127.0.0.1:' + app.address().port;
  });

  // Sin cerrar el servidor, el proceso de test no termina nunca
  afterEach(async () => {
    await new Promise((resolve) => app.close(resolve));
  });

  const post = async (cuerpo, headers = {}) => {
    const res = await fetch(url + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(cuerpo)
    });
    return { status: res.status, body: await res.json() };
  };

  test('acepta un mensaje válido y responde 201', async () => {
    const r = await post(VALIDO);
    assert.equal(r.status, 201);
    assert.equal(r.body.ok, true);
    assert.ok(r.body.id);
    assert.equal(listarMensajes(db).length, 1);
  });

  test('rechaza un mensaje vacío con 400 y explica qué falta', async () => {
    const r = await post({ name: '', email: 'x', subject: '', message: '' });
    assert.equal(r.status, 400);
    assert.match(r.body.error, /nombre|email|asunto/i);
    assert.equal(listarMensajes(db).length, 0, 'no debe guardar nada inválido');
  });

  test('funciona sin Authorization (no hace falta estar registrado)', async () => {
    const r = await post(VALIDO);
    assert.equal(r.status, 201);
  });

  test('ignora un token inválido en vez de fallar', async () => {
    const r = await post(VALIDO, { Authorization: 'Bearer no-es-un-jwt' });
    assert.equal(r.status, 201, 'un token roto no debe romper el envío público');
  });
});

describe('Endpoint GET /api/contact', () => {
  let db;
  let app;
  let url;

  beforeEach(async () => {
    db = openDatabase(':memory:');
    app = createApp(db);
    await new Promise((resolve) => app.listen(0, resolve));
    url = 'http://127.0.0.1:' + app.address().port;
  });

  afterEach(async () => {
    await new Promise((resolve) => app.close(resolve));
  });

  test('sin ADMIN_IDS configurados responde 404', async () => {
    const res = await fetch(url + '/api/contact');
    assert.equal(res.status, 404);
  });

  test('con ADMIN_IDS exige un token de admin', async () => {
    process.env.ADMIN_IDS = 'admin-1';
    const res = await fetch(url + '/api/contact');
    // Sin token -> 401
    assert.equal(res.status, 401);
    delete process.env.ADMIN_IDS;
  });
});
