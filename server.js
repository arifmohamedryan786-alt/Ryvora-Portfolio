import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import {
  initDb,
  createEnquiry,
  getEnquiryById,
  listEnquiries,
  getEnquiryStats,
  updateEnquiryStatus,
  deleteEnquiry,
  addEnquiryNote,
  getEnquiryNotes,
  saveContactMessage,
  listContactMessages,
  findAdminByEmail,
  findAdminById,
  isRecentDuplicate
} from './db.js';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from './auth.js';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
initDb();

const app = express();

// Security and parser middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Custom Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple in-memory rate limiter for logins and form spam prevention
const rateLimitMap = new Map();
function rateLimit(prefix, maxRequests, windowMs) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = `${prefix}:${ip}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 1;
      entry.resetAt = now + windowMs;
    } else {
      entry.count++;
    }
    rateLimitMap.set(key, entry);

    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a few minutes before trying again.'
      });
    }
    next();
  };
}

// Admin Authentication Middleware
function requireAdmin(req, res, next) {
  const token = req.cookies[config.cookieName] || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  
  if (!token) {
    if (req.accepts('html') && !req.path.startsWith('/api/')) {
      return res.redirect('/admin/login.html');
    }
    return res.status(401).json({ error: 'Unauthorized. Please sign in to access admin resources.' });
  }

  const payload = verifySessionToken(token);
  if (!payload || !payload.adminId) {
    res.clearCookie(config.cookieName);
    if (req.accepts('html') && !req.path.startsWith('/api/')) {
      return res.redirect('/admin/login.html');
    }
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }

  const admin = findAdminById(payload.adminId);
  if (!admin) {
    res.clearCookie(config.cookieName);
    return res.status(401).json({ error: 'Admin account not found.' });
  }

  req.admin = admin;
  next();
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// Public Agency Config (safe values only)
app.get('/api/config', (req, res) => {
  res.json({
    brand: 'RYVORA',
    tagline: 'Your Vision. Our Website.',
    contact: {
      whatsapp: config.contact.whatsapp,
      phone: config.contact.phone,
      email: config.contact.email,
      instagram: config.contact.instagram
    }
  });
});

// Submit Project Requirement Form
app.post('/api/enquiries', rateLimit('enquiry', 10, 60 * 1000), (req, res) => {
  try {
    const {
      customerName,
      businessName,
      email,
      phone,
      websiteType,
      projectNature,
      pages,
      features,
      colors,
      designStyle,
      budget,
      timeline,
      referenceUrl,
      details,
      consent
    } = req.body;

    // Server-side validation
    const errors = [];
    if (!customerName || customerName.trim().length < 2) errors.push('Customer name is required (min 2 characters).');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('Valid email address is required.');
    if (!phone || phone.trim().length < 7) errors.push('Valid phone or WhatsApp number is required.');
    if (!websiteType) errors.push('Please select a website type.');
    if (!budget) errors.push('Please select an estimated budget.');
    if (!timeline) errors.push('Please select a target timeline.');
    if (consent !== true && consent !== 'true' && consent !== 'on') {
      errors.push('Consent to receive project correspondence is required.');
    }

    if (referenceUrl && referenceUrl.trim()) {
      try {
        const parsed = new URL(referenceUrl.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          errors.push('Reference URL must start with http:// or https://');
        }
      } catch {
        errors.push('Please enter a valid reference URL (e.g. https://example.com)');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    // Duplicate check
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const hashSource = `${email.toLowerCase().trim()}|${websiteType}|${budget}|${(details || '').slice(0, 50)}`;
    const duplicateHash = crypto.createHash('sha256').update(hashSource).digest('hex');
    const existingEnquiryId = isRecentDuplicate(duplicateHash);

    if (existingEnquiryId) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        enquiryId: existingEnquiryId,
        message: 'Your project enquiry was already received recently. Our team is already reviewing it.'
      });
    }

    // Create enquiry in database
    const enquiry = createEnquiry({
      customerName,
      businessName,
      email,
      phone,
      websiteType,
      projectNature,
      pages,
      features: Array.isArray(features) ? features : (typeof features === 'string' ? [features] : []),
      colors,
      designStyle,
      budget,
      timeline,
      referenceUrl,
      details,
      ipAddress
    });

    // Optional webhook dispatch (async, non-blocking)
    if (config.webhookUrl) {
      try {
        fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚀 **New RYVORA Project Enquiry: ${enquiry.enquiry_id}**\nClient: ${enquiry.customer_name} (${enquiry.business_name})\nType: ${enquiry.website_type} | Budget: ${enquiry.budget}\nEmail: ${enquiry.email} | Phone: ${enquiry.phone}`
          })
        }).catch(err => console.error('[Webhook] Failed:', err.message));
      } catch (err) {
        console.error('[Webhook] Exception:', err.message);
      }
    }

    return res.status(201).json({
      success: true,
      enquiryId: enquiry.enquiry_id,
      message: 'Project requirements submitted successfully!',
      data: {
        enquiryId: enquiry.enquiry_id,
        customerName: enquiry.customer_name,
        businessName: enquiry.business_name,
        websiteType: enquiry.website_type,
        timeline: enquiry.timeline,
        budget: enquiry.budget,
        createdAt: enquiry.created_at
      }
    });
  } catch (err) {
    console.error('Error submitting enquiry:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred. Please try again.' });
  }
});

// Contact API Route (WhatsApp Routing & Database Backup)
app.post('/api/contact', rateLimit('contact', 10, 60 * 1000), (req, res) => {
  try {
    const { name, message } = req.body;
    if (name && message) {
      saveContactMessage({
        name: name.trim(),
        email: 'whatsapp-client',
        subject: 'WhatsApp Inquiry',
        message: message.trim()
      });
    }

    const cleanNumber = (config.contact.whatsapp || '').replace(/[^0-9]/g, '') || '918525039751';
    return res.json({
      success: true,
      whatsappNumber: cleanNumber,
      whatsappUrl: `https://wa.me/${cleanNumber}`
    });
  } catch (err) {
    console.error('Error in /api/contact:', err);
    return res.status(500).json({ error: 'Failed to process contact inquiry.' });
  }
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION ROUTES
// -------------------------------------------------------------

// Admin Login
app.post('/api/admin/login', rateLimit('admin-login', 8, 10 * 60 * 1000), (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const admin = findAdminByEmail(email.trim());
  if (!admin) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = verifyPassword(password, admin.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = createSessionToken({
    adminId: admin.id,
    email: admin.email,
    name: admin.name
  });

  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  return res.json({
    success: true,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name
    }
  });
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie(config.cookieName);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Admin Profile / Auth Check
app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({
    admin: {
      id: req.admin.id,
      email: req.admin.email,
      name: req.admin.name
    }
  });
});

// -------------------------------------------------------------
// PROTECTED ADMIN DASHBOARD API ROUTES
// -------------------------------------------------------------

// Admin Dashboard Overview Statistics
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const stats = getEnquiryStats();
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});

// List Enquiries with Filters & Search
app.get('/api/admin/enquiries', requireAdmin, (req, res) => {
  try {
    const { status, search, limit, offset } = req.query;
    const enquiries = listEnquiries({
      status: status || 'all',
      search: search || '',
      limit: parseInt(limit, 10) || 100,
      offset: parseInt(offset, 10) || 0
    });
    res.json(enquiries);
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
});

// Single Enquiry Details with Notes
app.get('/api/admin/enquiries/:id', requireAdmin, (req, res) => {
  try {
    const enquiry = getEnquiryById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }
    const notes = getEnquiryNotes(req.params.id);
    res.json({ ...enquiry, notes });
  } catch (err) {
    console.error('Error fetching enquiry details:', err);
    res.status(500).json({ error: 'Failed to fetch enquiry.' });
  }
});

// Update Enquiry Status
app.patch('/api/admin/enquiries/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const success = updateEnquiryStatus(req.params.id, status);
    if (!success) {
      return res.status(404).json({ error: 'Enquiry not found or status unchanged.' });
    }
    res.json({ success: true, status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add Internal Note to Enquiry
app.post('/api/admin/enquiries/:id/notes', requireAdmin, (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Note content cannot be empty.' });
    }
    const notes = addEnquiryNote(req.params.id, req.admin.name, note);
    res.status(201).json({ success: true, notes });
  } catch (err) {
    console.error('Error adding note:', err);
    res.status(500).json({ error: 'Failed to add note.' });
  }
});

// Delete Enquiry Permanently
app.delete('/api/admin/enquiries/:id', requireAdmin, (req, res) => {
  try {
    const success = deleteEnquiry(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }
    res.json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (err) {
    console.error('Error deleting enquiry:', err);
    res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
});

// List Contact Messages
app.get('/api/admin/messages', requireAdmin, (req, res) => {
  try {
    const messages = listContactMessages(100);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({ error: 'Failed to fetch contact messages.' });
  }
});

// -------------------------------------------------------------
// STATIC FILES & HTML ROUTES
// -------------------------------------------------------------

// Protected Admin Dashboard Route
app.get('/admin', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// Dedicated Contact / Project Inquiry Page Route
app.get(['/contact', '/project-inquiry', '/contact.html', '/project-inquiry.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Serve Public Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve main index.html for root or SPA fallback
app.use((req, res) => {
  if (req.path.startsWith('/admin')) {
    return res.redirect('/admin/login.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(config.port, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 RYVORA Agency Platform is running!`);
  console.log(`📡 URL:       http://localhost:${config.port}`);
  console.log(`🔐 Admin:     http://localhost:${config.port}/admin`);
  console.log(`🔑 Login:     http://localhost:${config.port}/admin/login.html`);
  console.log(`💾 Database:  ${config.dbPath}`);
  console.log(`=================================================\n`);
});
