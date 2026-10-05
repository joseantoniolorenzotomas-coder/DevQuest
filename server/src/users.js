// Lógica de negocio: validación + usuarios + ranking. Sin HTTP aquí.
'use strict';

import { randomUUID } from 'node:crypto';
import { hashPassword, verifyPassword, signJwt, verifyJwt, randomToken } from './crypto.js';
import { config } from './config.js';

export class ValidationError extends Error {}
export class AuthError extends Error {}
export class ConflictError extends Error {}
export class NotFoundError extends Error {}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(name) {
  const clean = String(name ?? '').trim().replace(/\s+/g, ' ');
  if (clean.length < 1 || clean.length > 40) {
    throw new ValidationError('El nombre debe tener entre 1 y 40 caracteres.');
  }
  return clean;
}

export function validateEmail(email) {
  const clean = String(email ?? '').trim().toLowerCase();
  if (clean.length > 254 || !EMAIL_RE.test(clean)) {
    throw new ValidationError('Email no válido.');
  }
  return clean;
}

export function validatePassword(password) {
  const pw = String(password ?? '');
  if (pw.length < 8 || pw.length > 128) {
    throw new ValidationError('La contraseña debe tener entre 8 y 128 caracteres.');
  }
  return pw;
}

const publicProfile = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  xp: row.xp,
  level: row.level,
});

const nowMs = () => Date.now();

export function issueToken(userId) {
  return signJwt({ sub: userId }, config.jwtSecret, config.jwtExpiresSeconds);
}

export function getUserIdFromToken(token) {
  const payload = verifyJwt(token, config.jwtSecret);
  if (!payload.sub) throw new AuthError('Token inválido.');
  return payload.sub;
}

export async function registerUser(db, { name, email, password }) {
  const cleanName = validateName(name);
  const cleanEmail = validateEmail(email);
  const pw = validatePassword(password);

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (existing) throw new ConflictError('Ese email ya está registrado.');

  const id = randomUUID();
  const now = nowMs();
  const passwordHash = await hashPassword(pw);
  db.prepare(
    'INSERT INTO users (id, name, email, password_hash, xp, level, created_at, updated_at) VALUES (?, ?, ?, ?, 0, 1, ?, ?)'
  ).run(id, cleanName, cleanEmail, passwordHash, now, now);

  const user = db.prepare('SELECT id, name, email, xp, level FROM users WHERE id = ?').get(id);
  return { user: publicProfile(user), token: issueToken(id) };
}

export async function loginUser(db, { email, password }) {
  const cleanEmail = validateEmail(email);
  // No distinguir "no existe" de "password mal" para no filtrar emails.
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
  const ok = row ? await verifyPassword(row.password_hash, String(password ?? '')) : false;
  if (!row || !ok) throw new AuthError('Email o contraseña incorrectos.');
  const user = { id: row.id, name: row.name, email: row.email, xp: row.xp, level: row.level };
  return { user, token: issueToken(row.id) };
}

export function getProfile(db, userId) {
  const row = db.prepare('SELECT id, name, email, xp, level FROM users WHERE id = ?').get(userId);
  if (!row) throw new NotFoundError('Usuario no encontrado.');
  return publicProfile(row);
}

export function renameUser(db, userId, name) {
  const cleanName = validateName(name);
  const res = db.prepare('UPDATE users SET name = ?, updated_at = ? WHERE id = ?').run(cleanName, nowMs(), userId);
  if (res.changes === 0) throw new NotFoundError('Usuario no encontrado.');
  return getProfile(db, userId);
}

export function syncProgress(db, userId, { xp, level }) {
  const cleanXp = Math.max(0, Math.floor(Number(xp) || 0));
  const cleanLevel = Math.min(999, Math.max(1, Math.floor(Number(level) || 1)));
  const res = db.prepare('UPDATE users SET xp = ?, level = ?, updated_at = ? WHERE id = ?')
    .run(cleanXp, cleanLevel, nowMs(), userId);
  if (res.changes === 0) throw new NotFoundError('Usuario no encontrado.');
  return getProfile(db, userId);
}

// Devuelve SIEMPRE ok para no revelar si el email existe.
// En desarrollo devuelve el token (para probar el flujo sin SMTP);
// en producción con SMTP configurado se enviaría por email.
export async function requestPasswordReset(db, email) {
  const cleanEmail = validateEmail(email);
  const row = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (!row) return { ok: true };
  const token = randomToken(32);
  const { createHash } = await import('node:crypto');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const now = nowMs();
  db.prepare('INSERT INTO password_resets (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(tokenHash, row.id, now + config.resetTokenHours * 3600_000, now);
  // TODO: enviar por SMTP cuando esté configurado (ver server/.env.example)
  return { ok: true, devToken: config.smtpHost ? undefined : token };
}

export async function resetPassword(db, token, newPassword) {
  const pw = validatePassword(newPassword);
  const { createHash } = await import('node:crypto');
  const tokenHash = createHash('sha256').update(String(token)).digest('hex');
  const row = db.prepare('SELECT * FROM password_resets WHERE token_hash = ?').get(tokenHash);
  if (!row || row.used_at || row.expires_at < nowMs()) throw new AuthError('Enlace no válido o caducado.');
  const passwordHash = await hashPassword(pw);
  db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(passwordHash, nowMs(), row.user_id);
  db.prepare('UPDATE password_resets SET used_at = ? WHERE token_hash = ?').run(nowMs(), tokenHash);
  return { ok: true };
}

export function getLeaderboard(db, limit = 20) {
  const n = Math.min(100, Math.max(1, Math.floor(Number(limit) || 20)));
  return db.prepare('SELECT id, name, xp, level FROM users ORDER BY xp DESC, created_at ASC LIMIT ?').all(n);
}
