import { db, initDb } from '../db.js';
import { hashPassword } from '../auth.js';
import { config } from '../config.js';

initDb();

const args = process.argv.slice(2);
const email = (args[0] || config.admin.email || 'admin@ryvora.agency').trim().toLowerCase();
const password = args[1] || config.admin.password || 'RyvoraSecureAdmin2026!';
const name = args[2] || config.admin.name || 'RYVORA Administrator';

if (!email || !password) {
  console.error('Usage: node scripts/seed-admin.js [email] [password] [name]');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters long.');
  process.exit(1);
}

const now = new Date().toISOString();
const passwordHash = hashPassword(password);

const existing = db.prepare('SELECT id FROM admins WHERE LOWER(email) = LOWER(?)').get(email);

if (existing) {
  const update = db.prepare(`
    UPDATE admins 
    SET password_hash = ?, name = ?, updated_at = ?
    WHERE id = ?
  `);
  update.run(passwordHash, name, now, existing.id);
  console.log(`[Admin Seed] Successfully updated existing admin: ${email}`);
} else {
  const insert = db.prepare(`
    INSERT INTO admins (email, name, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  insert.run(email, name, passwordHash, now, now);
  console.log(`[Admin Seed] Successfully created new admin: ${email}`);
}

console.log('--- ADMIN CREDENTIALS ---');
console.log(`Email:    ${email}`);
console.log(`Password: ${password}`);
console.log('-------------------------');
console.log('You can now log in at /admin/login.html');
