// Mensajes del formulario de contacto.
//
// El mensaje se guarda SIEMPRE en la tabla contact_messages. El envío por
// email es un extra: si falla, el mensaje sigue guardado y se puede leer
// desde la base de datos. Por eso el endpoint responde 201 aunque el email
// no haya salido, y devuelve `sent: false` con el motivo.
// 'use strict';

import { randomUUID } from 'node:crypto';
import { config } from './config.js';
import { enviarEmail } from './mailer.js';

export class ContactError extends Error {}

// ─────────────────────────────────────
// Validación
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const limpiar = (v, max) => String(v ?? '').trim().slice(0, max);

function validar({ name, email, subject, message }) {
  const limpio = {
    name: limpiar(name, 80),
    email: limpiar(email, 160),
    subject: limpiar(subject, 120),
    message: limpiar(message, 4000)
  };

  if (limpio.name.length < 2) throw new ContactError('Escribe tu nombre (mínimo 2 caracteres).');
  if (!RE_EMAIL.test(limpio.email)) throw new ContactError('El email no parece válido.');
  if (limpio.subject.length < 3) throw new ContactError('Escribe un asunto.');
  if (limpio.message.length < 10) throw new ContactError('Cuéntanos un poco más (mínimo 10 caracteres).');

  return limpio;
}

// ─────────────────────────────────────
// Guardar (sin enviar)
export function guardarMensaje(db, datos, userId = null) {
  const limpio = validar(datos);
  const id = randomUUID();
  const ahora = Date.now();

  db.prepare(`
    INSERT INTO contact_messages
      (id, name, email, subject, message, user_id, sent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `).run(id, limpio.name, limpio.email, limpio.subject, limpio.message, userId, ahora);

  return { id, ...limpio, sent: false, createdAt: ahora };
}

// ─────────────────────────────────────
// Marcar el envío
export function marcarEnvio(db, id, ok, error) {
  db.prepare('UPDATE contact_messages SET sent = ?, send_error = ? WHERE id = ?')
    .run(ok ? 1 : 0, error ?? null, id);
}

// ─────────────────────────────────────
// Listar (para leerlos desde la consola o un panel)
export function listarMensajes(db, limite = 50) {
  const bruto = parseInt(limite, 10);
  const n = Number.isFinite(bruto) && bruto > 0 ? Math.min(bruto, 200) : 50;
  // rowid como segundo criterio: dos mensajes guardados en el mismo
  // milisegundo tienen el mismo created_at y el orden sería arbitrario.
  return db.prepare(`
    SELECT id, name, email, subject, message, sent, send_error, created_at
    FROM contact_messages ORDER BY created_at DESC, rowid DESC LIMIT ?
  `).all(n).map((f) => ({
    id: f.id,
    name: f.name,
    email: f.email,
    subject: f.subject,
    message: f.message,
    sent: !!f.sent,
    sendError: f.send_error ?? null,
    createdAt: f.created_at
  }));
}

// ─────────────────────────────────────
// Guardar e intentar enviar
export async function recibirContacto(db, datos, userId = null) {
  const registro = guardarMensaje(db, datos, userId);

  const texto = [
    'Nuevo mensaje desde el formulario de contacto de DevQuest.',
    '',
    `De:    ${registro.name} <${registro.email}>`,
    `Asunto: ${registro.subject}`,
    '',
    registro.message,
    '',
    '---',
    `Id: ${registro.id}`,
    config.publicBaseUrl
  ].join('\n');

  let resultado;
  try {
    resultado = await enviarEmail({
      to: config.contactTo,
      subject: `[DevQuest] ${registro.subject} — ${registro.name}`,
      text: texto
    });
  } catch (err) {
    // enviarEmail no debería lanzar, pero si lo hace no se pierde el mensaje
    resultado = { ok: false, via: 'error', error: err?.message ?? String(err) };
  }

  marcarEnvio(db, registro.id, resultado.ok, resultado.error);

  return {
    id: registro.id,
    // 201: el mensaje está guardado. Que el email salga es otra cosa.
    sent: resultado.ok,
    via: resultado.via,
    warning: resultado.ok ? null : resultado.error
  };
}
