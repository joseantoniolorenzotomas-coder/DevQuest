// Config del servidor. Todo por entorno con valores seguros por defecto.
// Para Postgres en el futuro: define DATABASE_URL y adapta server/src/db.js
// (ver server/README.md, sección "Migrar a Postgres").
'use strict';

const toInt = (value, fallback) => {
  const n = parseInt(value ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const config = {
  port: toInt(process.env.PORT, 3001),
  dbPath: process.env.SQLITE_PATH || new URL('../devquest.db', import.meta.url).pathname,
  // JWT_SECRET es OBLIGATORIO en producción. En desarrollo usa un valor por defecto.
  jwtSecret: process.env.NODE_ENV === 'production'
    ? (process.env.JWT_SECRET ?? (() => { throw new Error('JWT_SECRET requerido en producción'); })())
    : (process.env.JWT_SECRET || 'dev-secret-cambialo-en-produccion'),
  jwtExpiresSeconds: toInt(process.env.JWT_EXPIRES_SECONDS, 7 * 24 * 3600),
  resetTokenHours: toInt(process.env.RESET_TOKEN_HOURS, 1),
  // CORS wildcard '*' solo en desarrollo. En producción definir CORS_ORIGIN.
  corsOrigin: process.env.NODE_ENV === 'production'
    ? (process.env.CORS_ORIGIN ?? (() => { throw new Error('CORS_ORIGIN requerido en producción'); })())
    : (process.env.CORS_ORIGIN || '*'),
  // Rate-limit simple en memoria (solo endpoints de auth)
  rateLimitWindowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 30),
  // ── Email ──
  // Sin SMTP_HOST ni RESEND_API_KEY los mensajes se guardan en la base de
  // datos (tabla contact_messages) pero no se envían. Ver server/README.md.
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: toInt(process.env.SMTP_PORT, 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  // 'true' (por defecto) hace STARTTLS en el puerto 587; ponlo a 'false'
  // si usas un servidor local sin TLS.
  smtpTls: process.env.SMTP_TLS === 'false' ? 'false' : 'true',
  smtpFrom: process.env.SMTP_FROM || 'DevQuest <no-reply@devquest.local>',
  // Alternativa a SMTP: API de transactional (Resend y compatibles).
  resendApiKey: process.env.RESEND_API_KEY || '',
  // A quién llegan los mensajes del formulario de contacto.
  contactTo: process.env.CONTACT_TO || 'duckdev77@gmail.com',
  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
};
