# RYVORA — Developer Portfolio Platform
**Tagline:** *Your Vision. Our Website.*  
**Founder:** Arif Mohamed

RYVORA is a clean, modern, and professional developer portfolio engineered to showcase real web projects, applications, and digital experiences. Built mobile-first to serve as the primary showcase link in Arif Mohamed's Instagram bio, the platform features a light, modern aesthetic, zero fake projects, an extensible project architecture, and direct WhatsApp messaging.

---

## 1. Portfolio Overview

- **Active Projects Displayed:** 1 real project (**QR Studio**)
- **Extensible Projects Architecture:** [`js/projects.js`](file:///Users/arifmohamed/Ryvora%20Webpage/js/projects.js)
- **Deployment Platform:** Vercel (Pure Frontend Static Site)
- **Design System:** Light background (`#FFFFFF` & `#F8FAFC`), deep slate typography (`#0F172A`), subtle royal blue accents (`#2563EB`), responsive mobile drawer navigation, zero stock images, and zero fake stats.

---

## 2. Project Architecture (100% Frontend Static Site)

This repository is built as a pure static web application with zero backend servers, zero databases, and zero serverless functions:

```text
Ryvora-Portfolio/
├── index.html            # Main portfolio single-page application
├── vercel.json           # Vercel static routing configuration
├── package.json          # Project manifest and local preview scripts
├── css/
│   └── portfolio.css     # Clean design system, typography, and responsive styles
├── js/
│   ├── portfolio-app.js  # Navigation, scroll logic, and WhatsApp form handler
│   └── projects.js       # Real projects data array & dynamic card renderer
└── assets/
    ├── icons/
    │   └── favicon.svg   # Official RYVORA geometric emblem
    └── images/           # High-resolution project visual assets
```

---

## 3. How to Add New Projects

All projects are stored in a single, clearly organized file: [`js/projects.js`](file:///Users/arifmohamed/Ryvora%20Webpage/js/projects.js).

To add a new project in the future:
1. Open [`js/projects.js`](file:///Users/arifmohamed/Ryvora%20Webpage/js/projects.js).
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

## 4. Contact Form WhatsApp Messaging

The portfolio contact form is directly integrated with **WhatsApp Click-to-Chat**. Visitors enter their Name and Message, click **Send via WhatsApp**, and WhatsApp opens (on mobile or desktop) with a pre-formatted message ready to review and send:

```text
Hello Arif,

My Name: [Visitor Name]

Message:
[Visitor Message]
```

### Where the WhatsApp Phone Number is Configured:
In [`js/portfolio-app.js`](file:///Users/arifmohamed/Ryvora%20Webpage/js/portfolio-app.js):
```javascript
export const WHATSAPP_PHONE_NUMBER = '918525039751';
```
*(Configured for +91 85250 39751 in international format without leading `+` or spaces).*

---

## 5. Local Development & Preview

To preview the website locally on port 3000:
```bash
npx serve -l 3000 .
```
Or simply open `index.html` in any modern web browser.
