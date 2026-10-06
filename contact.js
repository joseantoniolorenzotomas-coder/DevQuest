// DevQuest — Módulo de contacto
//
// El sitio se sirve desde GitHub Pages, que es ESTÁTICO: allí no se ejecuta
// Node, así que el backend de la carpeta server/ no puede recibir nada.
// Por eso el envío tiene varias vías y se prueban en orden, parando en la
// primera que funciona:
//
//   1. API propia       → DEVQUEST_API_URL (si despliegas server/)
//   2. Servicio elegido → DEVQUEST_CONTACT_FORM_URL
//   3. FormSubmit       → mismo servicio que usa el portfolio
//   4. mailto:          → abre el gestor de correo del visitante.
//
// La vía 3 abre un borrador en el gestor de correo del visitante; no puede
// enviar el mensaje por sí sola. El envío automático requiere configurar una
// API o un servicio de formularios.
//
// Cada vía tiene su propio formato: nuestro backend espera JSON y los
// servicios de formularios esperan application/x-www-form-urlencoded.
// 'use strict';

window.Contact = (function () {

  // ─────────────────────────────────────
  // Configuración
  // ─────────────────────────────────────

  /** Buzón de destino. Se puede cambiar con window.DEVQUEST_CONTACT_EMAIL. */
  const DESTINO = (typeof window !== 'undefined' && window.DEVQUEST_CONTACT_EMAIL)
    || 'duckdev77@gmail.com';

  /** Extremo de nuestro backend (server/), si está desplegado. */
  const API_URL = (typeof window !== 'undefined' && window.DEVQUEST_API_URL) || null;

  /**
   * Servicio de formularios (Formspree, Web3Forms, Basin…).
   * Basta con poner su URL aquí antes de cargar contact.js, o definirla
   * después con window.DEVQUEST_CONTACT_FORM_URL = 'https://…'.
   */
  const FORM_URL = (typeof window !== 'undefined' && window.DEVQUEST_CONTACT_FORM_URL) || null;
  const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/' + DESTINO;

  // Mismos mínimos que el servidor (server/src/contact.js)
  const MIN = { name: 2, email: 5, subject: 3, message: 10 };

  // Los gestores de correo se atragantan con cuerpos muy largos
  const MAX_MAILTO = 1800;

  const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ─────────────────────────────────────
  // Validación (en cliente, para no hacer el viaje en balde)
  // ─────────────────────────────────────

  /**
   * @returns {{ok: boolean, errores: Array<{campo: string, texto: string}>}}
   */
  function validar(datos) {
    const d = {
      name: String(datos.name ?? '').trim(),
      email: String(datos.email ?? '').trim(),
      subject: String(datos.subject ?? '').trim(),
      message: String(datos.message ?? '').trim()
    };
    const errores = [];

    if (d.name.length < MIN.name) errores.push({ campo: 'name', texto: 'Escribe tu nombre.' });
    if (!RE_EMAIL.test(d.email)) errores.push({ campo: 'email', texto: 'El email no parece válido.' });
    if (d.subject.length < MIN.subject) errores.push({ campo: 'subject', texto: 'Escribe un asunto.' });
    if (d.message.length < MIN.message) errores.push({ campo: 'message', texto: 'Cuéntanos un poco más.' });

    return { ok: errores.length === 0, errores, datos: d };
  }

  // ─────────────────────────────────────
  // Vía 3: mailto
  // ─────────────────────────────────────

  /**
   * Monta un enlace mailto: con el cuerpo recortado si hace falta.
   * @returns {{url: string, recortado: boolean}}
   */
  function construirMailto(datos, destino) {
    const d = {
      name: String(datos.name ?? '').trim(),
      email: String(datos.email ?? '').trim(),
      subject: String(datos.subject ?? '').trim(),
      message: String(datos.message ?? '').trim()
    };

    const asunto = `[DevQuest] ${d.subject}`;
    const firmante = `\n\n---\nDe: ${d.name} <${d.email}>`;
    // El enlace debe caber: los gestores recortan los muy largos sin avisar
    let cuerpo = d.message + firmante;
    let recortado = false;
    if (cuerpo.length + asunto.length > MAX_MAILTO) {
      const sitio = Math.max(MAX_MAILTO - asunto.length - firmante.length - 6, 200);
      cuerpo = d.message.slice(0, sitio) + '\n[…]' + firmante;
      recortado = true;
    }

    const url = 'mailto:' + (destino || DESTINO)
      + '?subject=' + encodeURIComponent(asunto)
      + '&body=' + encodeURIComponent(cuerpo);
    return { url, recortado };
  }

  /** Abre el gestor de correo. Devuelve false si el navegador lo bloquea. */
  function abrirMailto(url, win) {
    try {
      const w = win || (typeof window !== 'undefined' ? window : null);
      if (!w || !w.open) return false;
      // noopener hace que window.open devuelva null incluso si abrió el gestor.
      const ventana = w.open(url, '_blank');
      return !!ventana;
    } catch (e) {
      return false;
    }
  }

  // ─────────────────────────────────────
  // Vías 1 y 2: por red
  // ─────────────────────────────────────

  async function enviarJson(url, datos, fetchImpl, token) {
    const cabeceras = { 'Content-Type': 'application/json' };
    if (token) cabeceras.Authorization = 'Bearer ' + token;
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: cabeceras,
      body: JSON.stringify(datos)
    });
    const cuerpo = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(cuerpo.error || 'HTTP ' + res.status);
    return cuerpo;
  }

  // Los servicios de formularios no quieren JSON, sino el cuerpo del
  // formulario, y algunos exigen campos extra (_subject, _to…).
  async function enviarForm(url, datos, fetchImpl) {
    const cuerpo = new URLSearchParams();
    for (const clave of Object.keys(datos)) cuerpo.append(clave, datos[clave]);
    // Campos que estos servicios usan para el destino
    if (!cuerpo.has('_subject')) cuerpo.append('_subject', '[DevQuest] ' + datos.subject);
    if (!cuerpo.has('_to')) cuerpo.append('_to', DESTINO);

    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: cuerpo.toString()
    });
    const texto = await res.text().catch(() => '');
    if (!res.ok) throw new Error('HTTP ' + res.status + (texto ? ': ' + texto.slice(0, 120) : ''));
    return { ok: true };
  }

  async function enviarFormSubmit(url, datos, fetchImpl) {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: datos.name,
        email: datos.email,
        _replyto: datos.email,
        _subject: `[DevQuest] ${datos.subject} (de ${datos.name})`,
        message: datos.message
      })
    });
    const resultado = await res.json().catch(() => ({}));
    if (!res.ok || (resultado.success !== true && resultado.success !== 'true')) {
      throw new Error(resultado.message || 'FormSubmit no pudo enviar el mensaje.');
    }
    return resultado;
  }

  // ─────────────────────────────────────
  // API pública
  // ─────────────────────────────────────

  /**
   * Intenta entregar el mensaje por la primera vía disponible.
   *
   * @param {object} datos  { name, email, subject, message }
   * @param {object} [opciones]
   *   - apiUrl, formUrl: sobrescriben la configuración
   *   - fetchImpl: para poder probar sin red
   *   - token: JWT del usuario, si lo hay
   *   - abrir: función para abrir el mailto (para poder probar)
   * @returns {Promise<{ok: boolean, via: string, aviso: string|null}>}
   */
  async function enviar(datos, opciones = {}) {
    const {
      apiUrl = API_URL,
      formUrl = FORM_URL,
      formSubmitUrl = FORMSUBMIT_URL,
      fetchImpl = (typeof fetch !== 'undefined' ? fetch : null),
      token = null,
      abrir = abrirMailto,
      win = null
    } = opciones;

    const fallo = [];
    const limpia = (v) => String(v ?? '').trim();
    const cuerpo = {
      name: limpia(datos.name),
      email: limpia(datos.email),
      subject: limpia(datos.subject),
      message: limpia(datos.message)
    };

    // 1) Nuestro backend
    if (apiUrl && fetchImpl) {
      try {
        const r = await enviarJson(apiUrl, cuerpo, fetchImpl, token);
        if (r.sent === false) {
          // Guardado pero sin email: mejor que la vía 3 para que llegue ya
          fallo.push('api: ' + (r.warning || 'guardado sin envío'));
        } else {
          return { ok: true, via: 'api', aviso: null };
        }
      } catch (err) {
        fallo.push('api: ' + (err.message || err));
      }
    }

    // 2) Servicio de formularios
    if (formUrl && fetchImpl) {
      try {
        await enviarForm(formUrl, cuerpo, fetchImpl);
        return { ok: true, via: 'form', aviso: null };
      } catch (err) {
        fallo.push('form: ' + (err.message || err));
      }
    }

    // 3) FormSubmit, la misma integración usada por el portfolio
    if (formSubmitUrl && fetchImpl) {
      try {
        await enviarFormSubmit(formSubmitUrl, cuerpo, fetchImpl);
        return { ok: true, via: 'form', aviso: null };
      } catch (err) {
        fallo.push('FormSubmit: ' + (err.message || err));
      }
    }

    // 4) mailto: abre un borrador como último recurso
    const { url, recortado } = construirMailto(cuerpo);
    // El open() puede lanzar o estar bloqueado: nunca debe romper el envío
    let abierto = false;
    try {
      abierto = !!abrir(url, win);
    } catch (err) {
      abierto = false;
    }
    if (abierto) {
      return {
        ok: true,
        via: 'mailto',
        aviso: recortado ? 'El mensaje era largo y se ha recortado un poco.' : null
      };
    }

    // Si ni siquiera eso, al menos que el mensaje no se pierda
    return {
      ok: false,
      via: 'ninguna',
      aviso: 'No hemos podido abrir tu gestor de correo. Escríbenos a ' + DESTINO +
        (fallo.length ? ' (fallos: ' + fallo.join(' | ') + ')' : '')
    };
  }

  return {
    DESTINO,
    MIN,
    validar,
    construirMailto,
    abrirMailto,
    enviar,
    enviarForm,
    enviarJson,
    enviarFormSubmit,
    FORMSUBMIT_URL
  };
})();
