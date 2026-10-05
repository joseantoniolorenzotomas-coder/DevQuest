// Tests HTTP de extremo a extremo (register → login → me → leaderboard).
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';
import { openDatabase, closeDatabase } from '../src/db.js';

const PORT = 3411;
const BASE = `http://localhost:${PORT}`;
let app;
let memDb;

async function req(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

describe('server HTTP', () => {
  before(async () => {
    process.env.JWT_SECRET = 'test-secret';
    memDb = openDatabase(':memory:');
    app = createApp(memDb);
    await new Promise((resolve) => app.listen(PORT, resolve));
  });

  after(() => new Promise((resolve) => app.close(() => { closeDatabase(memDb); resolve(); })));

  test('health OK', async () => {
    const { status, json } = await req('GET', '/api/health');
    assert.equal(status, 200);
    assert.equal(json.ok, true);
  });

  test('flujo completo: register → me → rename → leaderboard', async () => {
    const reg = await req('POST', '/api/auth/register', { name: 'Test', email: 'test@devquest.dev', password: 'secreta123' });
    assert.equal(reg.status, 201);
    assert.ok(reg.json.token);

    const dup = await req('POST', '/api/auth/register', { name: 'Test', email: 'test@devquest.dev', password: 'secreta123' });
    assert.equal(dup.status, 409);

    const login = await req('POST', '/api/auth/login', { email: 'test@devquest.dev', password: 'secreta123' });
    assert.equal(login.status, 200);

    const bad = await req('POST', '/api/auth/login', { email: 'test@devquest.dev', password: 'mala-clave-1' });
    assert.equal(bad.status, 401);

    const me = await req('GET', '/api/me', null, login.json.token);
    assert.equal(me.status, 200);
    assert.equal(me.json.user.email, 'test@devquest.dev');
    assert.equal(me.json.user.password_hash, undefined);

    const rename = await req('PUT', '/api/me', { name: 'Tester' }, login.json.token);
    assert.equal(rename.status, 200);
    assert.equal(rename.json.user.name, 'Tester');

    const lb = await req('GET', '/api/leaderboard?limit=5');
    assert.equal(lb.status, 200);
    assert.ok(Array.isArray(lb.json.players));
    assert.ok(lb.json.players.some((p) => p.name === 'Tester'));
    assert.ok(lb.json.players.every((p) => p.email === undefined));
  });

  test('forgot/reset por HTTP', async () => {
    await req('POST', '/api/auth/register', { name: 'Rec', email: 'rec@devquest.dev', password: 'secreta123' });
    const forgot = await req('POST', '/api/auth/forgot', { email: 'rec@devquest.dev' });
    assert.equal(forgot.status, 200);
    assert.ok(forgot.json.devToken);
    const reset = await req('POST', '/api/auth/reset', { token: forgot.json.devToken, password: 'nueva-clave-1' });
    assert.equal(reset.status, 200);
    const login = await req('POST', '/api/auth/login', { email: 'rec@devquest.dev', password: 'nueva-clave-1' });
    assert.equal(login.status, 200);
  });

  test('me sin token da 401', async () => {
    const { status } = await req('GET', '/api/me');
    assert.equal(status, 401);
  });
});
