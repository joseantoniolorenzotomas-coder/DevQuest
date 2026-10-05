// Envío de emails sin dependencias.
//
// Opciones, de menos a más trabajo:
//   1. SMTP con el servidor que devuelve la variable SMTP_HOST (recomendado)
//   2. Webhook a un servicio de transactional (RESEND_API_KEY, etc.)
//   3. Nada: el mensaje se guarda en la base de datos y se devuelve warning
//
// Nunca lanza: si el envío falla, guarda el motivo y sigue. El mensaje
// está en la tabla contact_messages pase lo que pase.
// 'use strict';

import { connect } from 'node:net';
import { request as httpsRequest } from 'node:https';
import { request as httpRequest } from 'node:http';
import { config } from './config.js';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_TLS, RESEND_API_KEY, CONTACT_TO } = config;

function escapeBase64(texto) {
  return Buffer.from(texto, 'utf8').toString('base64');
}

// ─────────────────────────────────────
// Cabecera MIME con las partes Unicode en Base64 (UTF-8 sin líos)
function construirMensaje({ to, subject, text }) {
  const asunto = escapeBase64(subject);
  const cuerpo = escapeBase64(text);
  const fecha = new Date().toUTCString();
  return [
    `From: ${SMTP_FROM}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${asunto}?=`,
    `Date: ${fecha}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    cuerpo
  ].join('\r\n');
}

// ─────────────────────────────────────
// 1) SMTP
function enviarPorSmtp({ to, subject, text }) {
  return new Promise((resolve) => {
    const mensaje = construirMensaje({ to, subject, text });
    const usarTls = SMTP_TLS !== 'false';
    const socket = connect({ host: SMTP_HOST, port: SMTP_PORT });
    let paso = 0;
    let buffer = '';
    let resuelto = false;

    const acabar = (ok, error) => {
      if (resuelto) return;
      resuelto = true;
      try { socket.end(); } catch { /* ya cerrado */ }
      resolve({ ok, error });
    };

    const timer = setTimeout(() => acabar(false, 'SMTP: tiempo de espera agotado'), 15_000);
    const responder = (texto) => { socket.write(texto); };

    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
      buffer += chunk;
      // Espera un código de respuesta completo (4 dígitos) o el prompt
      if (!/[-\r\n]\s*$/.test(buffer)) return;

      const codigo = parseInt(buffer.slice(0, 3), 10);
      buffer = '';

      switch (paso) {
        case 0:  // saludo del servidor
          if (usarTls && codigo === 220) socket.write('STARTTLS\r\n');
          else { paso = 1; responder('EHLO devquest.local\r\n'); }
          break;
        case 1:  // EHLO
          if (usarTls && codigo === 220) { paso = 1.5; socket.write('EHLO devquest.local\r\n'); }
          else { paso = SMTP_USER ? 2 : 4; responder(SMTP_USER ? 'AUTH LOGIN\r\n' : 'MAIL FROM:<' + extraerEmail(SMTP_FROM) + '>\r\n'); }
          break;
        case 1.5:  // EHLO después del STARTTLS
          paso = SMTP_USER ? 2 : 4;
          responder(SMTP_USER ? 'AUTH LOGIN\r\n' : 'MAIL FROM:<' + extraerEmail(SMTP_FROM) + '>\r\n');
          break;
        case 2:  // AUTH LOGIN -> usuario
          paso = 3;
          responder(escapeBase64(SMTP_USER) + '\r\n');
          break;
        case 3:  // usuario -> contraseña
          paso = 4;
          responder(escapeBase64(SMTP_PASS) + '\r\n');
          break;
        case 4:  // MAIL FROM -> RCPT TO
          paso = 5;
          responder('RCPT TO:<' + to + '>\r\n');
          break;
        case 5:  // RCPT TO -> DATA
          paso = 6;
          responder('DATA\r\n');
          break;
        case 6:  // DATA -> cuerpo
          paso = 7;
          // El punto final de línea se escapa duplicando el punto
          responder(mensaje.replace(/\r\n\./g, '\r\n..') + '\r\n.\r\n');
          break;
        case 7:  // cuerpo enviado -> cerrar
          clearTimeout(timer);
          acabar(codigo === 250, codigo === 250 ? null : 'SMTP: el servidor rechazó el mensaje (' + codigo + ')');
          break;
        default:
          break;
      }
    });

    socket.on('error', (err) => {
      clearTimeout(timer);
      acabar(false, 'SMTP: ' + err.message);
    });
    socket.on('close', () => {
      clearTimeout(timer);
      acabar(false, 'SMTP: la conexión se cerró antes de terminar');
    });
  });
}

function extraerEmail(cabeza) {
  const m = String(cabeza).match(/<([^>]+)>/);
  return m ? m[1] : cabeza;
}

// ─────────────────────────────────────
// 2) Servicio de transactional por HTTPS
function enviarPorApi({ to, subject, text }) {
  return new Promise((resolve) => {
    const datos = JSON.stringify({
      from: SMTP_FROM,
      to: [to],
      subject,
      text
    });
    const opciones = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(datos)
      }
    };
    const req = httpsRequest(opciones, (res) => {
      let cuerpo = '';
      res.on('data', (c) => { cuerpo += c; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve({ ok: true, error: null });
        else resolve({ ok: false, error: 'API de email: ' + res.statusCode + ' ' + cuerpo.slice(0, 200) });
      });
    });
    req.on('error', (err) => resolve({ ok: false, error: 'API de email: ' + err.message }));
    req.setTimeout(15_000, () => { req.destroy(); resolve({ ok: false, error: 'API de email: tiempo de espera agotado' }); });
    req.end(datos);
  });
}

// ─────────────────────────────────────
// API pública
/**
 * Intenta enviar un email. Nunca lanza.
 * @returns {Promise<{ok: boolean, via: string, error: string|null}>}
 */
export async function enviarEmail({ to, subject, text }) {
  const destinatario = to || CONTACT_TO;
  if (!destinatario) {
    return { ok: false, via: 'ninguna', error: 'No hay destinatario configurado (CONTACT_TO).' };
  }

  if (SMTP_HOST) {
    const r = await enviarPorSmtp({ to: destinatario, subject, text });
    return { ok: r.ok, via: 'smtp', error: r.error };
  }

  if (RESEND_API_KEY) {
    const r = await enviarPorApi({ to: destinatario, subject, text });
    return { ok: r.ok, via: 'api', error: r.error };
  }

  return {
    ok: false,
    via: 'ninguna',
    error: 'No hay servicio de email configurado. Define SMTP_HOST o RESEND_API_KEY (ver server/README.md).'
  };
}
