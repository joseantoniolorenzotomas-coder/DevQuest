// Cripto: hash de contraseñas (scrypt) y JWT HS256 manual. Sin dependencias.
'use strict';

import { randomBytes, scrypt as _scrypt, timingSafeEqual, createHmac } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(_scrypt);

const b64urlEncode = (buf) => Buffer.from(buf).toString('base64url');
const b64urlDecode = (str) => Buffer.from(str, 'base64url');

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${Buffer.from(derived).toString('hex')}`;
}

export async function verifyPassword(storedHash, password) {
  try {
    const [algo, saltHex, hashHex] = String(storedHash).split('$');
    if (algo !== 'scrypt' || !saltHex || !hashHex) return false;
    const derived = await scrypt(password, Buffer.from(saltHex, 'hex'), 64);
    const expected = Buffer.from(hashHex, 'hex');
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(derived), expected);
  } catch {
    return false;
  }
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

function sign(data, secret) {
  return createHmac('sha256', secret).update(data).digest();
}

export function signJwt(payload, secret, expiresInSeconds) {
  const header = b64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const body = b64urlEncode(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }));
  const sig = b64urlEncode(sign(`${header}.${body}`, secret));
  return `${header}.${body}.${sig}`;
}

export function verifyJwt(token, secret) {
  const parts = String(token).split('.');
  if (parts.length !== 3) throw new Error('invalid token');
  const [header, body, sig] = parts;
  const expected = b64urlEncode(sign(`${header}.${body}`, secret));
  const a = b64urlDecode(sig);
  const b = b64urlDecode(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error('invalid signature');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) throw new Error('expired token');
  return payload;
}
