// Tests de users.js: registro, login, perfil, reset y ranking.
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { openDatabase, closeDatabase } from '../src/db.js';
import {
  registerUser, loginUser, getProfile, renameUser, syncProgress,
  requestPasswordReset, resetPassword, getLeaderboard,
  ValidationError, AuthError, ConflictError,
} from '../src/users.js';

describe('users', () => {
  let db;
  beforeEach(() => {
    if (db) closeDatabase(db);
    db = openDatabase(':memory:');
  });

  test('registro OK devuelve perfil público + token (sin hash)', async () => {
    const { user, token } = await registerUser(db, { name: ' Ana ', email: 'ANA@test.com', password: 'secreta123' });
    assert.equal(user.name, 'Ana');
    assert.equal(user.email, 'ana@test.com');
    assert.ok(user.id);
    assert.ok(token);
    assert.equal(user.password_hash, undefined);
  });

  test('registro duplicado da 409 lógico (ConflictError)', async () => {
    await registerUser(db, { name: 'Ana', email: 'ana@test.com', password: 'secreta123' });
    await assert.rejects(
      registerUser(db, { name: 'Otra', email: 'ana@test.com', password: 'secreta123' }),
      ConflictError
    );
  });

  test('validación: email malo y password corta', async () => {
    await assert.rejects(registerUser(db, { name: 'Ana', email: 'no-es-email', password: 'secreta123' }), ValidationError);
    await assert.rejects(registerUser(db, { name: 'Ana', email: 'a@b.com', password: 'corta' }), ValidationError);
    await assert.rejects(registerUser(db, { name: '   ', email: 'a@b.com', password: 'secreta123' }), ValidationError);
  });

  test('login OK y login con clave mala', async () => {
    await registerUser(db, { name: 'Ana', email: 'ana@test.com', password: 'secreta123' });
    const { user, token } = await loginUser(db, { email: 'ana@test.com', password: 'secreta123' });
    assert.equal(user.email, 'ana@test.com');
    assert.ok(token);
    await assert.rejects(loginUser(db, { email: 'ana@test.com', password: 'malaclave1' }), AuthError);
    await assert.rejects(loginUser(db, { email: 'nadie@test.com', password: 'secreta123' }), AuthError);
  });

  test('rename actualiza el nombre', async () => {
    const { user } = await registerUser(db, { name: 'Ana', email: 'ana@test.com', password: 'secreta123' });
    const updated = renameUser(db, user.id, 'Anita');
    assert.equal(updated.name, 'Anita');
    assert.throws(() => renameUser(db, user.id, ''), ValidationError);
  });

  test('forgot siempre ok + reset con token válido/inválido/reutilizado', async () => {
    await registerUser(db, { name: 'Ana', email: 'ana@test.com', password: 'secreta123' });
    const r1 = await requestPasswordReset(db, 'ana@test.com');
    assert.equal(r1.ok, true);
    assert.ok(r1.devToken);
    const r2 = await requestPasswordReset(db, 'nadie@test.com');
    assert.equal(r2.ok, true);
    assert.equal(r2.devToken, undefined);

    await resetPassword(db, r1.devToken, 'nueva-clave-1');
    const { token } = await loginUser(db, { email: 'ana@test.com', password: 'nueva-clave-1' });
    assert.ok(token);
    await assert.rejects(resetPassword(db, r1.devToken, 'otra-clave-22'), AuthError);
    await assert.rejects(resetPassword(db, 'token-inventado', 'otra-clave-22'), AuthError);
  });

  test('leaderboard ordenado por xp sin exponer emails', async () => {
    const a = await registerUser(db, { name: 'Ana', email: 'ana@test.com', password: 'secreta123' });
    const b = await registerUser(db, { name: 'Beto', email: 'beto@test.com', password: 'secreta123' });
    syncProgress(db, a.user.id, { xp: 100, level: 2 });
    syncProgress(db, b.user.id, { xp: 500, level: 3 });
    const top = getLeaderboard(db, 10);
    assert.equal(top[0].name, 'Beto');
    assert.equal(top[1].name, 'Ana');
    assert.equal(top[0].email, undefined);
  });

  test('getProfile no existe lanza NotFound', async () => {
    const { NotFoundError } = await import('../src/users.js');
    assert.throws(() => getProfile(db, 'no-existe'), NotFoundError);
  });
});
