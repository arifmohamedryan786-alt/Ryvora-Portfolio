import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import { config } from './config.js';
import { hashPassword } from './auth.js';

// Initialize synchronous SQLite database connection
export const db = new DatabaseSync(config.dbPath);

// Enable WAL mode for better concurrency and foreign keys
try {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
} catch (e) {
  console.warn('Note on PRAGMA execution:', e.message);
}

/**
 * Initialize all database tables and indexes
 */
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      business_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      website_type TEXT NOT NULL,
      project_nature TEXT NOT NULL,
      pages TEXT NOT NULL,
      features TEXT NOT NULL,
      colors TEXT,
      design_style TEXT,
      budget TEXT NOT NULL,
      timeline TEXT NOT NULL,
      reference_url TEXT,
      details TEXT,
      status TEXT NOT NULL DEFAULT 'New',
      ip_address TEXT,
      duplicate_hash TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enquiry_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_id TEXT NOT NULL,
      admin_name TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (enquiry_id) REFERENCES enquiries(enquiry_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
    CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_enquiry_notes_ref ON enquiry_notes(enquiry_id);
  `);

  ensureDefaultAdmin();
}

/**
 * Ensures an initial administrator exists if no admins are in the database
 */
export function ensureDefaultAdmin() {
  const checkStmt = db.prepare('SELECT COUNT(*) AS count FROM admins');
  const result = checkStmt.get();
  
  if (result.count === 0) {
    const now = new Date().toISOString();
    const hash = hashPassword(config.admin.password);
    const insertAdmin = db.prepare(`
      INSERT INTO admins (email, name, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertAdmin.run(config.admin.email, config.admin.name, hash, now, now);
    console.log(`[Database] Initial admin created with email: ${config.admin.email}`);
  }
}

/**
 * Generate unique human-friendly Enquiry ID (e.g. RYV-2026-X7K9)
 */
export function generateEnquiryId() {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  const bytes = crypto.randomBytes(4);
  for (let i = 0; i < 4; i++) {
    rand += chars[bytes[i] % chars.length];
  }
  return `RYV-${year}-${rand}`;
}

/**
 * Find admin user by email (case-insensitive)
 */
export function findAdminByEmail(email) {
  if (!email) return null;
  const stmt = db.prepare('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)');
  return stmt.get(email.trim());
}

/**
 * Find admin user by ID
 */
export function findAdminById(id) {
  const stmt = db.prepare('SELECT id, email, name, created_at FROM admins WHERE id = ?');
  return stmt.get(id);
}

/**
 * Check if a duplicate submission exists in the last 15 minutes
 */
export function isRecentDuplicate(duplicateHash) {
  if (!duplicateHash) return false;
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const stmt = db.prepare(`
    SELECT enquiry_id FROM enquiries 
    WHERE duplicate_hash = ? AND created_at > ?
    LIMIT 1
  `);
  const existing = stmt.get(duplicateHash, fifteenMinutesAgo);
  return existing ? existing.enquiry_id : null;
}

/**
 * Create a new project enquiry
 */
export function createEnquiry(data) {
  const now = new Date().toISOString();
  const enquiryId = generateEnquiryId();

  // Create duplicate hash from customer email + website type + budget + details
  const hashSource = `${(data.email || '').toLowerCase().trim()}|${data.websiteType}|${data.budget}|${(data.details || '').slice(0, 50)}`;
  const duplicateHash = crypto.createHash('sha256').update(hashSource).digest('hex');

  const insert = db.prepare(`
    INSERT INTO enquiries (
      enquiry_id, customer_name, business_name, email, phone,
      website_type, project_nature, pages, features, colors,
      design_style, budget, timeline, reference_url, details,
      status, ip_address, duplicate_hash, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      'New', ?, ?, ?, ?
    )
  `);

  insert.run(
    enquiryId,
    data.customerName.trim(),
    (data.businessName || 'Not specified').trim(),
    data.email.trim().toLowerCase(),
    data.phone.trim(),
    data.websiteType,
    data.projectNature || 'New Website',
    data.pages || '1-5 pages',
    JSON.stringify(Array.isArray(data.features) ? data.features : []),
    data.colors || '',
    data.designStyle || 'Minimalist & Clean',
    data.budget,
    data.timeline,
    data.referenceUrl ? data.referenceUrl.trim() : '',
    data.details ? data.details.trim() : '',
    data.ipAddress || 'unknown',
    duplicateHash,
    now,
    now
  );

  return getEnquiryById(enquiryId);
}

/**
 * Get single enquiry by ID
 */
export function getEnquiryById(enquiryId) {
  const stmt = db.prepare('SELECT * FROM enquiries WHERE enquiry_id = ?');
  const row = stmt.get(enquiryId);
  if (!row) return null;
  return formatEnquiry(row);
}

/**
 * List all enquiries with search, filtering, and pagination
 */
export function listEnquiries({ status = 'all', search = '', limit = 100, offset = 0 } = {}) {
  let query = 'SELECT * FROM enquiries WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query += ' AND (customer_name LIKE ? OR business_name LIKE ? OR email LIKE ? OR enquiry_id LIKE ?)';
    params.push(term, term, term, term);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(formatEnquiry);
}

/**
 * Get counts by status and overall metrics
 */
export function getEnquiryStats() {
  const total = db.prepare('SELECT COUNT(*) AS count FROM enquiries').get().count;
  const pending = db.prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'New'").get().count;
  const reviewing = db.prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'Reviewing'").get().count;
  const inDev = db.prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'In Development'").get().count;
  const completed = db.prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'Completed'").get().count;
  const contacted = db.prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'Contacted'").get().count;
  const approved = db.prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'Approved'").get().count;
  const rejected = db.prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'Rejected'").get().count;

  return {
    total,
    pending,
    reviewing,
    contacted,
    approved,
    inDev,
    completed,
    rejected
  };
}

/**
 * Update enquiry status
 */
export function updateEnquiryStatus(enquiryId, newStatus) {
  const validStatuses = ['New', 'Reviewing', 'Contacted', 'Approved', 'In Development', 'Completed', 'Rejected'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  const now = new Date().toISOString();
  const stmt = db.prepare('UPDATE enquiries SET status = ?, updated_at = ? WHERE enquiry_id = ?');
  const result = stmt.run(newStatus, now, enquiryId);
  return result.changes > 0;
}

/**
 * Delete enquiry with CASCADE on notes
 */
export function deleteEnquiry(enquiryId) {
  // First delete notes
  db.prepare('DELETE FROM enquiry_notes WHERE enquiry_id = ?').run(enquiryId);
  const stmt = db.prepare('DELETE FROM enquiries WHERE enquiry_id = ?');
  const result = stmt.run(enquiryId);
  return result.changes > 0;
}

/**
 * Add an internal note to an enquiry
 */
export function addEnquiryNote(enquiryId, adminName, note) {
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT INTO enquiry_notes (enquiry_id, admin_name, note, created_at)
    VALUES (?, ?, ?, ?)
  `);
  insert.run(enquiryId, adminName, note.trim(), now);
  return getEnquiryNotes(enquiryId);
}

/**
 * Get internal notes for an enquiry
 */
export function getEnquiryNotes(enquiryId) {
  const stmt = db.prepare('SELECT * FROM enquiry_notes WHERE enquiry_id = ? ORDER BY created_at ASC');
  return stmt.all(enquiryId);
}

/**
 * Save quick contact message
 */
export function saveContactMessage({ name, email, subject, message }) {
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT INTO contact_messages (name, email, subject, message, status, created_at)
    VALUES (?, ?, ?, ?, 'New', ?)
  `);
  insert.run(name.trim(), email.trim().toLowerCase(), subject ? subject.trim() : 'General Enquiry', message.trim(), now);
}

/**
 * List all contact messages
 */
export function listContactMessages(limit = 100) {
  const stmt = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ?');
  return stmt.all(limit);
}

/**
 * Helper to safely format enquiry object (parsing JSON features)
 */
function formatEnquiry(row) {
  let parsedFeatures = [];
  try {
    parsedFeatures = JSON.parse(row.features || '[]');
  } catch {
    parsedFeatures = [];
  }

  return {
    ...row,
    features: parsedFeatures
  };
}
