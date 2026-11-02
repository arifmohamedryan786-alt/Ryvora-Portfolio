# RYVORA — Developer Portfolio Platform
**Tagline:** *Your Vision. Our Website.*  
**Founder:** Arif Mohamed

RYVORA is a clean, modern, and professional developer portfolio engineered to showcase real web projects, applications, and digital experiences. Built mobile-first to serve as the primary showcase link in Arif Mohamed's Instagram bio, the platform features a light, modern aesthetic, zero fake projects, an extensible project architecture, and a working backend contact pipeline.

---

## 1. Portfolio Overview

- **Primary URL (Instagram Bio Link):** [http://localhost:3000](http://localhost:3000)
- **Active Projects Displayed:** 1 real project (**QR Studio**)
- **Extensible Projects Architecture:** [public/js/projects.js](file:///Users/arifmohamed/Ryvora%20Webpage/public/js/projects.js)
- **Design System:** Light background (`#FFFFFF` & `#F8FAFC`), deep slate typography (`#0F172A`), subtle royal blue accents (`#2563EB`), responsive mobile drawer navigation, zero stock images, and zero fake stats.

---

## 2. How to Add New Projects

All projects are stored in a single, clearly organized file: [`public/js/projects.js`](file:///Users/arifmohamed/Ryvora%20Webpage/public/js/projects.js).

To add a new project in the future:
1. Open [`public/js/projects.js`](file:///Users/arifmohamed/Ryvora%20Webpage/public/js/projects.js).
2. Inside `PROJECTS_DATA`, duplicate the template object:
   ```javascript
   {
     id: 'project-slug',
     name: 'Project Title',
     description: 'A concise 1-2 sentence overview of what the project does.',
     technologies: ['React', 'Node.js', 'Tailwind'],
     liveUrl: 'https://your-project.vercel.app/',
     githubUrl: 'https://github.com/your-username/repo', // optional
     status: 'Live Project',
     featured: false,
     previewType: 'image', // or custom preview
     image: '/assets/images/projects/your-screenshot.jpg' // optional image path
   }
   ```
3. Save the file. The new project will automatically render on the website!

---

## 3. Contact Form WhatsApp Messaging

The portfolio contact form is directly integrated with **WhatsApp Click-to-Chat**. Visitors enter their Name and Message, click **Send via WhatsApp**, and WhatsApp opens (on mobile or desktop) with a pre-formatted message ready to review and send:

```text
Hello Arif,

My Name: [Visitor Name]

Message:
[Visitor Message]
```

### Where the WhatsApp Phone Number is Configured:
1. **Frontend constant:** [`public/js/portfolio-app.js`](file:///Users/arifmohamed/Ryvora%20Webpage/public/js/portfolio-app.js#L9)
   ```javascript
   export const WHATSAPP_PHONE_NUMBER = '918525039751';
   ```
2. **Environment variable:** [`.env`](file:///Users/arifmohamed/Ryvora%20Webpage/.env#L12)
   ```env
   CONTACT_WHATSAPP=+91 85250 39751
   ```
*(Country code `91` for India + phone `85250 39751`). If you ever change your phone number, update it in these two spots.*

---

## 4. Technology Stack

- **Backend:** Node.js (v22+) with [Express.js](https://expressjs.com/)
- **Database:** Native SQLite via Node's built-in `node:sqlite` (`DatabaseSync`), requiring zero external native compilation or external database subscriptions for local or persistent VPS deployment.
- **Security & Authentication:**
  - Password hashing with `crypto.scryptSync` and cryptographically random salts.
  - Custom tamper-proof HMAC-SHA256 session tokens delivered over secure `HttpOnly` cookies.
  - In-memory IP rate-limiting to prevent form spam and brute-force logins.
  - Security response headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`).
- **Frontend:** Handcrafted Vanilla CSS design system with custom properties, high-contrast typography (`Space Grotesk` & `Plus Jakarta Sans`), responsive grid/flexbox layouts, and zero heavy frameworks.

---

## 2. Quick Start: Local Development

### Prerequisites
- Node.js version 22 or higher (tested on Node v26)
- macOS / Linux / Windows with VS Code or any terminal

### Setup Steps

1. **Clone or Open the Project Directory:**
   ```bash
   cd "/Users/arifmohamed/Ryvora Webpage"
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   *(See Section 3 below to configure your actual business contact details).*

4. **Seed the Administrator Account:**
   ```bash
   npm run seed:admin
   ```
   *Default Credentials:*
   - **Email:** `admin@ryvora.agency`
   - **Password:** `RyvoraSecureAdmin2026!`

5. **Start the Application:**
   - **Production Mode:**
     ```bash
     npm start
     ```
   - **Development Mode (with auto-reload):**
     ```bash
     npm run dev
     ```

6. **Open in Browser:**
   - **Public Website:** [http://localhost:3000](http://localhost:3000)
   - **Admin Portal Sign In:** [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)
   - **Protected Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 3. Configuring Your Official Contact Details

In `.env`, update the following lines with your real business information:

```env
# Official WhatsApp business number with country code (no spaces or plus signs)
# Example: CONTACT_WHATSAPP=+919876543210
CONTACT_WHATSAPP=+91 85250 39751

# Official business email address
# Example: CONTACT_EMAIL=hello@ryvora.com
CONTACT_EMAIL=contact@ryvora.agency

# Agency Instagram profile URL
# Example: CONTACT_INSTAGRAM=https://instagram.com/ryvora
CONTACT_INSTAGRAM=https://instagram.com/ryvora
```

### Where these appear:
- The backend serves these values dynamically through `GET /api/config`.
- Links in the header, contact channels, and footer automatically bind to your real channels.
- When clients submit the requirement form, the success confirmation button links directly to your configured WhatsApp number with their unique ticket ID pre-filled.
- If left as placeholder (`+91XXXXXXXXXX`), the links gracefully point to the requirement form without generating broken numbers.

---

## 4. Key Sections & Capabilities

### 1. Homepage & Brand Identity
- **Palette:** Rich obsidian blacks (`#070709`, `#0e0f14`), crisp white headlines, brushed silver accents (`#d8dde6`, `#e2e8f0`), and hairline 1px borders.
- **Hero Section:** Clean headline ("Websites Engineered For Distinct Brands"), availability badge, concise introduction, and direct CTAs to start a project or view our work.
- **Key Metrics:** 8+ Disciplines, 100% Handcrafted Code, &lt;0.8s target load times, direct engineer collaboration.

### 2. All 8 Website Engineering Services
Every service card has a distinct description and a working button that smooth-scrolls to the form and pre-selects that specific service in the dropdown:
1. **Business Websites** — Multi-page credibility and corporate lead-generation platforms.
2. **Landing Pages** — High-velocity single-page conversion funnels for ad campaigns.
3. **Portfolio Websites** — High-impact visual platforms for studios, architects, and creatives.
4. **Restaurant Websites** — Dynamic digital culinary menus, hours, and table reservation flows.
5. **Travel & Tourism Websites** — Experiential destination lookbooks, package showcases, and tour enquiry pipelines.
6. **E-Commerce Websites** — Fast, conversion-optimized storefronts with product filters and UPI/payment gateways.
7. **Website Redesigns** — Modernizing legacy websites without losing established SEO rankings.
8. **Custom Web Development** — Bespoke portals, internal dashboards, and custom database integrations.

### 3. Curated Concept Portfolio
- Realistic visual concepts across multiple industries (Dining, Travel, Fashion E-Commerce, Corporate Advisory, Architecture Studio, SaaS).
- Clearly labeled with **"Concept Demonstration"** watermarks to maintain absolute client honesty.
- Featured **Spotlight Concept Card** with an authentic simulated browser chrome header.
- **"Inspect Concept Spec"** opens an interactive modal detailing the architectural blueprint, engineered capabilities, and ideal client profile.
- Adheres to the rule of only displaying external "View Website" links when a working live demo exists.

### 4. Comprehensive Project Requirement Form
One of the most essential components of the platform, collecting all necessary specifications before client kickoff:
- **Client & Business:** Full Name, Business/Company Name, Email Address, Phone/WhatsApp Number.
- **Scope & Architecture:** Website Type (dropdown with all 8 services), Project Nature (New site / Redesign / Overhaul), Estimated Page Count (1–3, 4–7, 8–15, 15+).
- **Features Required (Interactive Checkbox Cards):**
  - WhatsApp quick chat integration
  - Contact form & lead capture
  - Online payments (UPI / Razorpay / Stripe)
  - Appointment / table booking system
  - E-commerce & catalog
  - Admin dashboard & CMS
  - Blog & articles section
  - Subtle micro-animations
- **Aesthetics:** Preferred colours and design style.
- **Commercials:** Budget in Indian rupees (INR: ₹15k–₹30k, ₹30k–₹60k, ₹60k–₹1.2L, ₹1.2L+) and Target Timeline (Urgent 1–2 weeks, Standard 3–4 weeks, Flexible 1–2 months).
- **Competitor/Inspiration:** Reference website URL (with protocol validation).
- **Additional Vision:** Open textarea for specific technical goals.
- **Duplicate Prevention:** Cryptographic hash of client submissions within 15 minutes prevents accidental duplicate entries.
- **Confirmation:** Issues a unique human-friendly ticket ID (e.g. `RYV-2026-XXXX`) with a 1-click clipboard copy button.

### 5. Protected Administrative Dashboard
- **Authentication:** Protected by `requireAdmin` middleware checking `HttpOnly` session cookies. Unauthenticated requests to `/admin` redirect to `/admin/login.html`.
- **KPI Metrics:** Real-time summary cards for Total Enquiries, Pending / New, In Development, and Completed / Approved.
- **Pipeline Search & Filters:**
  - Full-text search across client names, business names, emails, and ticket IDs.
  - Filter by status: *New, Reviewing, Contacted, Approved, In Development, Completed, Rejected*.
- **Slide-out Detail Drawer:**
  - View complete customer requirements, features, reference website, and submission timestamp.
  - Direct 1-click WhatsApp and Email buttons pre-populated with ticket context.
  - Clickable link to customer's reference website (`target="_blank" rel="noopener noreferrer"`).
  - Status management dropdown with instant server update.
  - Private internal team notes with chronological logging and author tagging.
  - Secure deletion with confirmation modal.
- **Quick Contact Messages View:** Dedicated tab to review and respond to inquiries sent through the public contact box.

---

## 5. Free-Tier Deployment Guide

Because the application is built on lightweight Node.js and SQLite, it is straightforward to deploy for free or low-cost:

### Option A: Render (Recommended Free Web Service)
1. Push your repository to GitHub.
2. Sign in to [Render.com](https://render.com) and create a **New Web Service**.
3. Select your repository.
4. Set the following build settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV=production`
   - `SESSION_SECRET=<generate-a-strong-random-32-char-key>`
   - `ADMIN_EMAIL=your-admin-email@domain.com`
   - `ADMIN_PASSWORD=YourStrongPasswordHere!`
   - `CONTACT_WHATSAPP=+91XXXXXXXXXX`
   - `CONTACT_EMAIL=contact@ryvora.agency`
   - `CONTACT_INSTAGRAM=https://instagram.com/ryvora`
6. *(Optional)* Add a Persistent Disk mounted at `/data` if you want the SQLite database to persist across service restarts on Render's paid tiers, or use an external hosted database adapter (such as Turso or Supabase Postgres) for stateless serverless containers.

### Option B: Railway or Fly.io
1. Both platforms support running `server.js` directly with a persistent volume for the `./data` directory.
2. Set environment variables identical to the `.env.example` file.

### Option C: Self-Hosted VPS (DigitalOcean / Hetzner / AWS EC2)
1. Install Node.js 22+.
2. Clone repository, run `npm install`, and configure `.env`.
3. Seed admin with `npm run seed:admin`.
4. Run under `pm2` with `pm2 start server.js --name "ryvora"`.
5. Point Nginx reverse proxy with SSL via Let's Encrypt.

---

## 6. Verification & Automated Test Summary

The following test suites have been verified against the live running server:
- [x] **Public Configuration:** `GET /api/config` serves accurate brand and contact metadata.
- [x] **Enquiry Intake:** Validated form submission generates unique `RYV-2026-XXXX` IDs.
- [x] **Anti-Spam / Anti-Duplicate:** 15-minute duplicate hash prevents duplicate database rows.
- [x] **Input Validation:** Rejects incomplete or invalid emails, short names, or missing consent.
- [x] **Security Headers & Cookies:** `HttpOnly`, `SameSite=Lax`, `nosniff`, `SAMEORIGIN`.
- [x] **Protected Endpoints:** Non-admin requests to `/api/admin/*` return 401 Unauthorized.
- [x] **Admin Lifecycle:** Successful login, KPI computation, search, status updating, private note creation, and cascade record deletion.
- [x] **Responsive Viewports:** Layout tested across mobile phones (360px–480px), tablets (768px–1024px), and desktop screens.
