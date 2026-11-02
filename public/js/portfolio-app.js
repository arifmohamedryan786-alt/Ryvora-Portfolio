/**
 * ============================================================================
 * RYVORA PORTFOLIO — INTERACTIVE APPLICATION LOGIC
 * ============================================================================
 * Brand: RYVORA
 * Owner: Arif Mohamed
 * Tagline: Your Vision. Our Website.
 * ============================================================================
 */

import { PROJECTS_DATA, renderProjects } from './projects.js';

document.addEventListener('DOMContentLoaded', () => {
  initProjectShowcase();
  initStickyHeader();
  initMobileNavigation();
  initSmoothScroll();
  initSectionObservers();
  initContactActions();
  initContactForm();
  loadAgencyConfig();
});

/**
 * 1. Initialize and render projects into the showcase grid
 */
function initProjectShowcase() {
  const container = document.getElementById('projects-grid');
  if (container) {
    renderProjects(container);
  }
}

/**
 * 2. Sticky Navbar with elevation on scroll
 */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 3. Mobile Navigation Drawer (Toggle, Close, Keyboard, and Outside Click)
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Close when clicking any nav link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/**
 * 4. Smooth Scrolling with Offset for Sticky Header
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const header = document.getElementById('site-header');
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

        window.scrollTo({
          top: Math.max(0, targetPos),
          behavior: 'smooth'
        });

        // Update URL hash cleanly without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

/**
 * 5. IntersectionObserver to highlight active navigation link
 */
function initSectionObservers() {
  const sections = document.querySelectorAll('section[id], header[id="home"]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/**
 * 6. Contact Action Helpers (Copy Email, Tooltips)
 */
function initContactActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'contact@ryvora.agency';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Copied!</span>
        `;
        copyBtn.classList.add('is-copied');

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('is-copied');
        }, 2200);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  }
}

/**
 * ============================================================================
 * OFFICIAL WHATSAPP PHONE NUMBER CONFIGURATION
 * Set your WhatsApp phone number here in international format (no '+', no spaces).
 * Current configured number: +91 85250 39751 -> '918525039751'
 * ============================================================================
 */
export const WHATSAPP_PHONE_NUMBER = '918525039751';

/**
 * Helper to get the active WhatsApp phone number (from config or default constant)
 */
function getActiveWhatsAppNumber() {
  const backendNumber = window.RYVORA_CONFIG?.contact?.whatsapp;
  if (backendNumber && typeof backendNumber === 'string') {
    const cleaned = backendNumber.replace(/[^0-9]/g, '');
    if (cleaned.length >= 7) return cleaned;
  }
  return WHATSAPP_PHONE_NUMBER;
}

/**
 * 7. WhatsApp Contact Form Handler
 * Validates Name and Message, then opens WhatsApp with pre-filled message format.
 */
function initContactForm() {
  const form = document.getElementById('quick-contact-form');
  const alertBox = document.getElementById('form-feedback-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name?.value?.trim() || '';
    const message = form.message?.value?.trim() || '';

    // Reset previous alert state
    if (alertBox) {
      alertBox.className = 'form-feedback-alert';
      alertBox.style.display = 'none';
      alertBox.textContent = '';
    }

    // 1. Validation: Check that both fields are filled in
    if (!name || name.length < 2) {
      showFeedback('Please enter your name.', 'error');
      form.name?.focus();
      return;
    }

    if (!message || message.length < 2) {
      showFeedback('Please enter your message.', 'error');
      form.message?.focus();
      return;
    }

    // 2. Resolve Active WhatsApp Phone Number
    const phone = getActiveWhatsAppNumber();

    // 3. Format pre-filled WhatsApp message as requested:
    // Hello Arif,
    //
    // My Name: [Visitor Name]
    //
    // Message:
    // [Visitor Message]
    const prefilledText = `Hello Arif,\n\nMy Name: ${name}\n\nMessage:\n${message}`;

    // 4. Construct WhatsApp click-to-chat URL with URL encoding
    const encodedMessage = encodeURIComponent(prefilledText);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    // 5. Open WhatsApp using click-to-chat
    // Works on iOS, Android, and Desktop (WhatsApp Web)
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });

  function showFeedback(msg, type) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `form-feedback-alert is-${type}`;
    alertBox.style.display = 'block';
  }
}

/**
 * 8. Asynchronously sync agency configuration from backend if available
 */
async function loadAgencyConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return;
    const data = await res.json();
    window.RYVORA_CONFIG = data;

    if (data.contact) {
      // WhatsApp links
      if (data.contact.whatsapp) {
        const cleanNumber = data.contact.whatsapp.replace(/[^0-9]/g, '');
        document.querySelectorAll('[data-config="whatsapp-link"]').forEach(el => {
          el.href = `https://wa.me/${cleanNumber}`;
        });
        document.querySelectorAll('[data-config="whatsapp-text"]').forEach(el => {
          el.textContent = data.contact.whatsapp;
        });
      }
    }
  } catch (err) {
    // Graceful fallback to static HTML defaults
  }
}

