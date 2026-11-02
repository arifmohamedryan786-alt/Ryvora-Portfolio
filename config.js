import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'ryvora.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  dbPath,
  sessionSecret: process.env.SESSION_SECRET || 'ryvora_dev_insecure_secret_key_2026',
  admin: {
    email: (process.env.ADMIN_EMAIL || 'admin@ryvora.agency').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'RyvoraSecureAdmin2026!',
    name: process.env.ADMIN_NAME || 'RYVORA Administrator'
  },
  contact: {
    whatsapp: process.env.CONTACT_WHATSAPP || '+91 85250 39751',
    phone: process.env.CONTACT_PHONE || process.env.CONTACT_WHATSAPP || '+91 85250 39751',
    email: process.env.CONTACT_EMAIL || 'contact@ryvora.agency',
    instagram: process.env.CONTACT_INSTAGRAM || 'https://instagram.com/ryvora'
  },
  webhookUrl: process.env.NOTIFICATION_WEBHOOK_URL || null,
  cookieName: 'ryvora_admin_session'
};
