// Servidor HTTP fino: routing, JSON, CORS, rate-limit y JWT. Sin dependencias.
'use strict';

import { createServer } from 'node:http';
import { config } from './config.js';
import { openDatabase } from './db.js';
import {
  AuthError, ConflictError, NotFoundError, ValidationError,
  registerUser, loginUser, getProfile, renameUser, syncProgress,
  requestPasswordReset, resetPassword, getLeaderboard, getUserIdFromToken,
} from './users.js';
import { ContactError, recibirContacto, listarMensajes } from './contact.js';

const db = openDatabase(config.dbPath);

// Rate-limit en memoria solo para auth (suficiente para v1 monoproceso;
// con varias instancias usar Redis: ver README).
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, resetAt: now + config.rateLimitWindowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + config.rateLimitWindowMs; }
  entry.count += 1;
  hits.set(ip, entry);
  return entry.count > config.rateLimitMax;
}

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': config.corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  });
  res.end(payload);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new ValidationError('Payload demasiado grande.'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new ValidationError('JSON no válido.')); }
    });
    req.on('error', reject);
  });
}

function bearerUserId(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) throw new AuthError('Falta autorización.');
  return getUserIdFromToken(token);
}

const routes = (db) => ({
  'GET /api/health': async () => ({ status: 200, body: { ok: true, service: 'devquest-server' } }),

  'POST /api/auth/register': async ({ body }) => {
    const { user, token } = await registerUser(db, body);
    return { status: 201, body: { user, token } };
  },

  'POST /api/auth/login': async ({ body }) => {
    const { user, token } = await loginUser(db, body);
    return { status: 200, body: { user, token } };
  },

  'POST /api/auth/forgot': async ({ body }) => {
    const result = await requestPasswordReset(db, body?.email);
    return { status: 200, body: { ok: true, ...(result.devToken ? { devToken: result.devToken } : {}) } };
  },

  'POST /api/auth/reset': async ({ body }) => {
    await resetPassword(db, body?.token, body?.password);
    return { status: 200, body: { ok: true } };
  },

  'GET /api/me': async ({ req }) => {
    const user = getProfile(db, bearerUserId(req));
    return { status: 200, body: { user } };
  },

  'PUT /api/me': async ({ req, body }) => {
    const user = renameUser(db, bearerUserId(req), body?.name);
    return { status: 200, body: { user } };
  },

  'POST /api/progress': async ({ req, body }) => {
    const user = syncProgress(db, bearerUserId(req), body ?? {});
    return { status: 200, body: { user } };
  },

  'GET /api/leaderboard': async ({ url }) => {
    const limit = url.searchParams.get('limit');
    const players = getLeaderboard(db, limit);
    return { status: 200, body: { players } };
  },

  // Formulario de contacto. Acepta body con { name, email, subject, message }.
  // Si viene Authorization, asocia el mensaje al usuario (si existe).
  'POST /api/contact': async ({ req, body }) => {
    let userId = null;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      try { userId = getUserIdFromToken(auth.slice(7)); } catch { userId = null; }
    }
    const resultado = await recibirContacto(db, body, userId);
    return {
      status: 201,
      body: {
        ok: true,
        id: resultado.id,
        // El mensaje queda guardado aunque el email no se haya podido enviar
        sent: resultado.sent,
        warning: resultado.warning
      }
    };
  },

  // Mensajes recibidos. Solo con el JWT de admin (ADMIN_IDS en el entorno).
  'GET /api/contact': async ({ req, url }) => {
    const adminIds = (process.env.ADMIN_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    let userId = null;
    try { userId = token ? getUserIdFromToken(token) : null; } catch { userId = null; }
    if (!adminIds.length) throw new NotFoundError('No encontrado.');
    if (!userId || !adminIds.includes(userId)) throw new AuthError('Necesitas permisos de administrador.');
    return { status: 200, body: { messages: listarMensajes(db, url.searchParams.get('limit')) } };
  },
});

let sharedDb;
function getSharedDb() {
  if (!sharedDb) sharedDb = openDatabase(process.env.SQLITE_PATH || config.dbPath);
  return sharedDb;
}

export function createApp(dbOverride) {
  const database = dbOverride || getSharedDb();
  const table = routes(database);
  return createServer(async (req, res) => {
    try {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': config.corsOrigin,
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        });
        res.end();
        return;
      }
      const url = new URL(req.url, 'http://localhost');
      const key = `${req.method} ${url.pathname}`;
      const handler = table[key];
      if (!handler) return send(res, 404, { error: 'No encontrado.' });

      // Rate-limit: auth y contacto. El contacto es la puerta abierta a tu
      // buzón, así que tiene que estar tan limitado como un login.
      if (key.startsWith('POST /api/auth/') || key === 'POST /api/contact') {
        const ip = req.socket.remoteAddress || 'unknown';
        if (rateLimited(ip)) return send(res, 429, { error: 'Demasiados intentos. Espera un minuto.' });
      }

      const body = req.method === 'GET' ? {} : await readJson(req);
      const { status, body: out } = await handler({ req, body, url });
      send(res, status, out);
    } catch (err) {
      if (err instanceof ValidationError) return send(res, 400, { error: err.message });
      if (err instanceof ContactError) return send(res, 400, { error: err.message });
      if (err instanceof AuthError) return send(res, 401, { error: err.message });
      if (err instanceof ConflictError) return send(res, 409, { error: err.message });
      if (err instanceof NotFoundError) return send(res, 404, { error: err.message });
      console.error('[devquest-server]', err);
      send(res, 500, { error: 'Error interno.' });
    }
  });
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMain || process.argv[1]?.endsWith('server.js')) {
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`[devquest-server] escuchando en http://localhost:${config.port} (db: ${process.env.SQLITE_PATH || config.dbPath})`);
  });
}
