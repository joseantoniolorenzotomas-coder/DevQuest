// Tests de db.js: schema e índices.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { openDatabase, closeDatabase } from '../src/db.js';

describe('db', () => {
  test('crea las tablas users y password_resets', () => {
    const db = openDatabase(':memory:');
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
    assert.ok(tables.includes('users'));
    assert.ok(tables.includes('password_resets'));
    closeDatabase(db);
  });

  test('email es único', () => {
    const db = openDatabase(':memory:');
    const now = Date.now();
    db.prepare('INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (?,?,?,?,?,?)')
      .run('1', 'Ana', 'ana@test.com', 'x', now, now);
    assert.throws(() => {
      db.prepare('INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (?,?,?,?,?,?)')
        .run('2', 'Otra', 'ana@test.com', 'x', now, now);
    });
    closeDatabase(db);
  });
});
