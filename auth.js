import crypto from 'node:crypto';
import { config } from './config.js';

/**
 * Securely hash a password using scrypt with random salt
 * @param {string} password 
 * @returns {string} salt:derivedKey
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * Verify a plain password against stored salt:derivedKey hash
 * @param {string} password 
 * @param {string} storedHash 
 * @returns {boolean}
 */
export function verifyPassword(password, storedHash) {
  try {
    if (!storedHash || !storedHash.includes(':')) return false;
    const [salt, key] = storedHash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Create a signed, tamper-proof session token
 * @param {object} payload 
 * @param {number} expiresInMs (default 24 hours)
 * @returns {string}
 */
export function createSessionToken(payload, expiresInMs = 24 * 60 * 60 * 1000) {
  const expiresAt = Date.now() + expiresInMs;
  const data = JSON.stringify({ ...payload, exp: expiresAt });
  const b64Data = Buffer.from(data).toString('base64url');
  const signature = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(b64Data)
    .digest('base64url');
  return `${b64Data}.${signature}`;
}

/**
 * Verify and decode a session token
 * @param {string} token 
 * @returns {object|null}
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [b64Data, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(b64Data)
    .digest('base64url');

  if (signature.length !== expectedSig.length) return null;
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);

  if (!crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(b64Data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}
