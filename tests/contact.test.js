// Tests de contact.js — el módulo de envío del formulario
//
// En GitHub Pages no hay backend, así que el módulo tiene que ser capaz de
// entregar el mensaje por tres vías distintas. Aquí se comprueba cada una
// con un fetch falso, sin tocar la red ni abrir ventanas.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { syncGlobals } from './setup.js';

await import('../contact.js');
syncGlobals();

const C = () => global.window.Contact;

const DATOS = {
  name: 'Marta',
  email: 'marta@example.com',
  subject: 'No me funciona el ejercicio 12',
  message: 'Hola, creo que hay un fallo en el módulo de filtros, ¿puedes revisarlo?'
};

/** fetch que siempre responde bien, y guarda lo que le pasaron. */
const fetchOk = (cuerpo = { ok: true, sent: true }) => {
  const llamadas = [];
  const fn = async (url, opts) => {
    llamadas.push({ url, opts });
    return { ok: true, status: 200, json: async () => cuerpo, text: async () => JSON.stringify(cuerpo) };
  };
  fn.llamadas = llamadas;
  return fn;
};

/** fetch que siempre falla, como cuando no hay servidor. */
const fetchFalla = (mensaje = 'Failed to fetch') => async () => {
  throw new Error(mensaje);
};

describe('Contacto: configuración', () => {
  test('el destino por defecto es el buzón del proyecto', () => {
    assert.equal(C().DESTINO, 'duckdev77@gmail.com');
  });

  test('sin configurar nada no hay vía de red', () => {
    // FormSubmit está configurado por defecto para el buzón de DevQuest.
    assert.equal(C().API_URL ?? null, null);
    assert.equal(C().FORM_URL ?? null, null);
    assert.equal(C().FORMSUBMIT_URL, 'https://formsubmit.co/ajax/duckdev77@gmail.com');
  });
});

describe('Contacto: validación', () => {
  test('acepta un mensaje bien escrito', () => {
    const r = C().validar(DATOS);
    assert.equal(r.ok, true);
    assert.equal(r.errores.length, 0);
  });

  test('recorta los espacios', () => {
    const r = C().validar({ ...DATOS, name: '  Marta  ' });
    assert.equal(r.datos.name, 'Marta');
  });

  test('devuelve todos los errores a la vez, no solo el primero', () => {
    const r = C().validar({ name: '', email: 'malo', subject: '', message: '' });
    assert.equal(r.ok, false);
    assert.equal(r.errores.length, 4);
    assert.deepEqual(r.errores.map(e => e.campo).sort(), ['email', 'message', 'name', 'subject']);
  });

  test('acepta emails normales y con subdominio', () => {
    ['a@b.com', 'nombre.apellido@mail.devquest.app', 'con+etiqueta@gmail.com']
      .forEach(email => {
        assert.equal(C().validar({ ...DATOS, email }).ok, true, 'debería aceptar ' + email);
      });
  });

  test('rechaza emails mal formados', () => {
    ['malo', 'a@b', '@b.com', 'a b@c.com', 'a@'].forEach(email => {
      assert.equal(C().validar({ ...DATOS, email }).ok, false, 'debería rechazar ' + email);
    });
  });

  test('exige contenido suficiente en cada campo', () => {
    assert.equal(C().validar({ ...DATOS, name: 'A' }).ok, false);
    assert.equal(C().validar({ ...DATOS, subject: 'ab' }).ok, false);
    assert.equal(C().validar({ ...DATOS, message: 'corto' }).ok, false);
  });
});

describe('Contacto: enlace mailto', () => {
  test('detecta la apertura del gestor sin usar noopener', () => {
    let opciones = null;
    const abierto = C().abrirMailto('mailto:duckdev77@gmail.com', {
      open: (_url, _target, features) => {
        opciones = features;
        return {};
      }
    });

    assert.equal(abierto, true);
    assert.equal(opciones, undefined);
  });

  test('lleva el destinatario, el asunto y el cuerpo', () => {
    const { url } = C().construirMailto(DATOS);
    assert.ok(url.startsWith('mailto:duckdev77@gmail.com?'));
    // El asunto va URL-encoded: los espacios son %20
    assert.ok(decodeURIComponent(url).includes('subject=[DevQuest] No me funciona el ejercicio 12'));
    assert.ok(decodeURIComponent(url).includes('el módulo de filtros'));
  });

  test('incluye quién escribe, para poder responderle', () => {
    const { url } = C().construirMailto(DATOS);
    const texto = decodeURIComponent(url);
    assert.ok(texto.includes('Marta'));
    assert.ok(texto.includes('marta@example.com'));
  });

  test('permite cambiar el destinatario', () => {
    const { url } = C().construirMailto(DATOS, 'otro@ejemplo.com');
    assert.ok(url.startsWith('mailto:otro@ejemplo.com?'));
  });

  test('recorta los mensajes largos en vez de romper el enlace', () => {
    const larguisimo = { ...DATOS, message: 'a'.repeat(6000) };
    const { url, recortado } = C().construirMailto(larguisimo);
    assert.equal(recortado, true);
    assert.ok(url.length < 6000, 'el enlace no debe crecer sin control');
    assert.ok(url.includes('%5B%E2%80%A6%5D'), 'debe avisar de que se ha recortado');
  });

  test('no marca recortado cuando el mensaje cabe de sobra', () => {
    assert.equal(C().construirMailto(DATOS).recortado, false);
  });

  test('escapa caracteres que romperían el enlace', () => {
    const { url } = C().construirMailto({ ...DATOS, subject: 'a&b=c?d#e' });
    // Solo puede haber un '?' (el que separa los parámetros) y ningún '#'
    assert.equal(url.split('?').length - 1, 1);
    assert.ok(!url.slice(url.indexOf('?')).includes('#'));
  });
});

describe('Contacto: envío por la vía que toque', () => {
  test('usa la API propia si está configurada y responde', async () => {
    const fetchImpl = fetchOk();
    const r = await C().enviar(DATOS, { apiUrl: 'https://api.example.com/api/contact', fetchImpl });
    assert.equal(r.ok, true);
    assert.equal(r.via, 'api');
    assert.equal(fetchImpl.llamadas.length, 1);
    assert.equal(fetchImpl.llamadas[0].url, 'https://api.example.com/api/contact');
  });

  test('envía JSON a nuestra API e incluye el JWT si lo hay', async () => {
    const fetchImpl = fetchOk();
    await C().enviar(DATOS, { apiUrl: 'https://api.example.com/api/contact', fetchImpl, token: 'jwt-123' });
    const { opts } = fetchImpl.llamadas[0];
    assert.equal(opts.method, 'POST');
    assert.equal(opts.headers['Content-Type'], 'application/json');
    assert.equal(opts.headers.Authorization, 'Bearer jwt-123');
    assert.equal(JSON.parse(opts.body).email, 'marta@example.com');
  });

  test('si la API guarda pero no envía email, pasa a la siguiente vía', async () => {
    // Un servidor accesible sin SMTP devolvería sent: false
    const fetchImpl = fetchOk({ ok: true, sent: false, warning: 'sin email' });
    let abierto = null;
    const r = await C().enviar(DATOS, {
      apiUrl: 'https://api.example.com/api/contact',
      fetchImpl,
      abrir: (url) => { abierto = url; return true; }
    });
    assert.equal(r.via, 'mailto', 'debe caer al mailto para que el mensaje llegue ya');
    assert.ok(abierto, 'debe abrir el gestor de correo');
  });

  test('usa el servicio de formularios si la API no está', async () => {
    const fetchImpl = fetchOk();
    const r = await C().enviar(DATOS, {
      formUrl: 'https://formspree.io/f/abc123',
      fetchImpl,
      abrir: () => { throw new Error('no debería llegar al mailto'); }
    });
    assert.equal(r.ok, true);
    assert.equal(r.via, 'form');
    assert.equal(fetchImpl.llamadas[0].url, 'https://formspree.io/f/abc123');
  });

  test('el servicio de formularios recibe urlencoded, no JSON', async () => {
    const fetchImpl = fetchOk();
    await C().enviar(DATOS, { formUrl: 'https://formspree.io/f/abc123', fetchImpl });
    const { opts } = fetchImpl.llamadas[0];
    assert.equal(opts.headers['Content-Type'], 'application/x-www-form-urlencoded');
    assert.ok(opts.body.includes('name=Marta'));
    // Estos servicios usan campos propios para el destino
    assert.ok(opts.body.includes('_subject='));
    assert.ok(opts.body.includes('_to='));
  });

  test('si la red falla del todo, cae al mailto y lo dice', async () => {
    let abierto = null;
    const r = await C().enviar(DATOS, {
      apiUrl: 'https://api.example.com/api/contact',
      fetchImpl: fetchFalla(),
      abrir: (url) => { abierto = url; return true; }
    });
    assert.equal(r.ok, true);
    assert.equal(r.via, 'mailto');
    assert.ok(abierto.startsWith('mailto:'));
  });

  test('sin nada configurado usa mailto directamente', async () => {
    let abierto = null;
    const r = await C().enviar(DATOS, {
      apiUrl: null,
      formUrl: null,
      formSubmitUrl: null,
      abrir: (url) => { abierto = url; return true; }
    });
    assert.equal(r.ok, true);
    assert.equal(r.via, 'mailto');
    assert.ok(abierto.includes('duckdev77@gmail.com'));
  });

  test('envía automáticamente a FormSubmit con el formato JSON del portfolio', async () => {
    const fetchImpl = fetchOk({ success: 'true' });
    const r = await C().enviar(DATOS, { apiUrl: null, formUrl: null, fetchImpl });

    assert.equal(r.ok, true);
    assert.equal(r.via, 'form');
    assert.equal(fetchImpl.llamadas.length, 1);
    assert.equal(fetchImpl.llamadas[0].url, 'https://formsubmit.co/ajax/duckdev77@gmail.com');
    assert.equal(fetchImpl.llamadas[0].opts.method, 'POST');
    assert.equal(fetchImpl.llamadas[0].opts.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(fetchImpl.llamadas[0].opts.body), {
      name: DATOS.name,
      email: DATOS.email,
      _replyto: DATOS.email,
      _subject: `[DevQuest] ${DATOS.subject} (de ${DATOS.name})`,
      message: DATOS.message
    });
  });

  test('si FormSubmit falla, ofrece el borrador mailto al usuario', async () => {
    const fetchImpl = fetchOk({ success: 'false', message: 'No autorizado' });
    let abierto = null;
    const r = await C().enviar(DATOS, {
      apiUrl: null,
      formUrl: null,
      fetchImpl,
      abrir: (url) => { abierto = url; return true; }
    });

    assert.equal(r.ok, true);
    assert.equal(r.via, 'mailto');
    assert.ok(abierto.startsWith('mailto:duckdev77@gmail.com'));
  });

  test('el orden es API → formulario → mailto', async () => {
    const usadas = [];
    const fetchImpl = async (url) => {
      usadas.push(url);
      throw new Error('sin conexión');
    };
    await C().enviar(DATOS, {
      apiUrl: 'https://api.example.com/contact',
      formUrl: 'https://formspree.io/f/abc',
      fetchImpl,
      abrir: () => true
    });
    assert.deepEqual(usadas, [
      'https://api.example.com/contact',
      'https://formspree.io/f/abc',
      'https://formsubmit.co/ajax/duckdev77@gmail.com'
    ]);
  });

  test('si ni el navegador abre el mailto, avisa con el buzón a mano', async () => {
    const r = await C().enviar(DATOS, { apiUrl: null, formUrl: null, abrir: () => false });
    assert.equal(r.ok, false);
    assert.equal(r.via, 'ninguna');
    assert.ok(r.aviso.includes('duckdev77@gmail.com'), 'debe dar el email para escribir a mano');
  });

  test('nunca lanza, pase lo que pase', async () => {
    // fetch que devuelve basura, y un mailto que revienta
    const fetchRaro = async () => ({ ok: false, status: 500, json: async () => null, text: async () => null });
    const r = await C().enviar(DATOS, {
      apiUrl: 'https://api.example.com/x',
      fetchImpl: fetchRaro,
      abrir: () => { throw new Error('boom'); }
    });
    assert.equal(typeof r.ok, 'boolean');
    assert.equal(r.ok, false);
  });

  test('un error del servidor se interpreta bien', async () => {
    const fetchErr = async () => ({
      ok: false, status: 400, json: async () => ({ error: 'Escribe tu nombre.' }), text: async () => ''
    });
    let abierto = null;
    const r = await C().enviar(DATOS, {
      apiUrl: 'https://api.example.com/x',
      fetchImpl: fetchErr,
      abrir: (url) => { abierto = url; return true; }
    });
    // Aunque la API diga que no, se ofrece el mailto para no perder el mensaje
    assert.equal(r.via, 'mailto');
    assert.ok(abierto);
  });
});
