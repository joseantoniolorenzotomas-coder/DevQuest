// Tests de crypto.js: hash y JWT.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, signJwt, verifyJwt } from '../src/crypto.js';

describe('crypto', () => {
  test('hash verifica la contraseña y rechaza otra', async () => {
    const hash = await hashPassword('secreta123');
    assert.equal(await verifyPassword(hash, 'secreta123'), true);
    assert.equal(await verifyPassword(hash, 'otra-clave'), false);
  });

  test('dos hashes de la misma clave son distintos (salt)', async () => {
    const a = await hashPassword('misma-clave-1');
    const b = await hashPassword('misma-clave-1');
    assert.notEqual(a, b);
  });

  test('JWT firma y verifica, y detecta caducidad', async () => {
    const token = signJwt({ sub: 'u1' }, 'secret-test', 60);
    assert.equal(verifyJwt(token, 'secret-test').sub, 'u1');
    assert.throws(() => verifyJwt(token, 'otra-secret'));
    const expired = signJwt({ sub: 'u1' }, 'secret-test', -10);
    assert.throws(() => verifyJwt(expired, 'secret-test'));
  });
});
