/**
 * RYVORA — Bespoke Web Development Agency Platform
 * Core Interactive Experience, Estimator Engine, and State Management
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initHeader();
  initMobileNav();
  initAgencyConfig();
  initPricingCatalog();
  initScopeEstimator();
  initFaqAccordion();
  initBackToTop();
  initHeroMockupToggles();
});

/**
 * Ambient Subtle Particle Canvas on Clean White Canvas
 * Ultra-lightweight, 60fps, low CPU, delicate blue particles
 */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(width > 768 ? 40 : 18, 50);

  const mouse = {
    x: width / 2,
    y: height / 2,
    active: false
  };

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.6 + 0.8;
      this.alpha = Math.random() * 0.25 + 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;

      // Gentle mouse interaction
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x -= (dx / dist) * force * 0.8;
          this.y -= (dy / dist) * force * 0.8;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const lineAlpha = (1 - dist / 90) * 0.07;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }

    animId = requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouse.active = false;
  });
}

/**
 * Sticky Header Scroll State
 */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close when tapping a navigation link
  const links = document.querySelectorAll('.mobile-nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/**
 * Dynamic Agency Config Sync from Backend API
 */
async function initAgencyConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.contact) return;

    const { whatsapp, phone, email, instagram } = data.contact;

    // Clean phone for links
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    const cleanWa = (whatsapp || '').replace(/[^0-9]/g, '');

    // Update WhatsApp links
    document.querySelectorAll('[data-config="whatsapp-link"]').forEach(el => {
      if (cleanWa) {
        el.href = `https://wa.me/${cleanWa}?text=Hello%20RYVORA%2C%20I%20would%20like%20to%20discuss%20a%20website%20project.`;
      }
    });

    // Update Phone elements
    document.querySelectorAll('[data-config="phone-link"]').forEach(el => {
      if (cleanPhone) el.href = `tel:${cleanPhone}`;
    });

    document.querySelectorAll('[data-config="phone-text"]').forEach(el => {
      if (phone) el.textContent = phone;
    });

    // Update Email elements
    document.querySelectorAll('[data-config="email-link"]').forEach(el => {
      if (email) el.href = `mailto:${email}`;
    });

    document.querySelectorAll('[data-config="email-text"]').forEach(el => {
      if (email) el.textContent = email;
    });

    // Update Instagram
    document.querySelectorAll('[data-config="instagram-link"]').forEach(el => {
      if (instagram) el.href = instagram;
    });
  } catch (err) {
    console.debug('Config load skipped or running offline:', err.message);
  }
}

/**
 * Interactive Project Scope & Cost Estimator
 */
/**
 * Pricing Catalog Filtering, View Mode Switching, and Direct Selection
 */
function initPricingCatalog() {
  const searchInput = document.getElementById('pricing-search-input');
  const searchClear = document.getElementById('pricing-search-clear');
  const filterBtns = document.querySelectorAll('.pricing-filter-btn');
  const rows = document.querySelectorAll('.pricing-row');
  const cards = document.querySelectorAll('.pricing-solution-card');
  const counter = document.getElementById('pricing-results-counter');
  const emptyCard = document.getElementById('pricing-empty-card');
  const resetBtn = document.getElementById('pricing-reset-btn');
  const cardsContainer = document.getElementById('pricing-cards-container');
  const tableContainer = document.getElementById('pricing-table-container');
  const btnCardsView = document.getElementById('view-mode-cards');
  const btnTableView = document.getElementById('view-mode-table');

  if (!cards.length && !rows.length) return;

  let currentFilter = 'all';
  let searchQuery = '';
  const totalCount = Math.max(cards.length, rows.length);

  function applyFilters() {
    let visibleCount = 0;

    // Filter Cards
    cards.forEach(card => {
      const group = card.getAttribute('data-group') || '';
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesGroup = currentFilter === 'all' || group === currentFilter;
      const matchesSearch = !searchQuery || keywords.includes(searchQuery) || text.includes(searchQuery);

      if (matchesGroup && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Filter Rows
    rows.forEach(row => {
      const group = row.getAttribute('data-group') || '';
      const keywords = (row.getAttribute('data-keywords') || '').toLowerCase();
      const text = row.textContent.toLowerCase();

      const matchesGroup = currentFilter === 'all' || group === currentFilter;
      const matchesSearch = !searchQuery || keywords.includes(searchQuery) || text.includes(searchQuery);

      if (matchesGroup && matchesSearch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });

    // Update Counter Text
    if (counter) {
      counter.textContent = `Showing ${visibleCount} of ${totalCount} Website Solutions`;
    }

    // Toggle Empty Card
    if (emptyCard) {
      if (visibleCount === 0) {
        emptyCard.style.display = 'flex';
        if (cardsContainer) cardsContainer.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'none';
      } else {
        emptyCard.style.display = 'none';
        const isCardsActive = btnCardsView && btnCardsView.classList.contains('active');
        if (cardsContainer) cardsContainer.style.display = isCardsActive ? 'grid' : 'none';
        if (tableContainer) tableContainer.style.display = isCardsActive ? 'none' : 'block';
      }
    }

    // Toggle clear icon
    if (searchClear) {
      searchClear.style.display = searchQuery ? 'block' : 'none';
    }
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-pricing-filter') || 'all';
      applyFilters();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target.value || '').trim().toLowerCase();
      applyFilters();
    });
  }

  // Search Clear Button
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  // View Switcher (Cards vs Table)
  if (btnCardsView && btnTableView) {
    btnCardsView.addEventListener('click', () => {
      btnCardsView.classList.add('active');
      btnTableView.classList.remove('active');
      if (cardsContainer) cardsContainer.style.display = 'grid';
      if (tableContainer) tableContainer.style.display = 'none';
    });

    btnTableView.addEventListener('click', () => {
      btnTableView.classList.add('active');
      btnCardsView.classList.remove('active');
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (tableContainer) tableContainer.style.display = 'block';
    });
  }

  // Reset Button
  window.resetPricingFilters = function() {
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    currentFilter = 'all';
    filterBtns.forEach(b => {
      if (b.getAttribute('data-pricing-filter') === 'all') b.classList.add('active');
      else b.classList.remove('active');
    });
    applyFilters();
  };

  if (resetBtn) {
    resetBtn.addEventListener('click', window.resetPricingFilters);
  }

  applyFilters();
}

/**
 * Global Pricing Tier Selector
 * Called when clicking "Get Started" on any pricing row
 */
window.selectPricingTier = function(typeName, priceRange, useCase) {
  const enquirySection = document.getElementById('enquiry');
  const categorySelect = document.getElementById('enq-category');
  const budgetSelect = document.getElementById('enq-budget');
  const detailsField = document.getElementById('enq-details');

  // Match category option
  if (categorySelect && typeName) {
    const term = typeName.toLowerCase();
    for (let i = 0; i < categorySelect.options.length; i++) {
      const optVal = categorySelect.options[i].value.toLowerCase();
      const optText = categorySelect.options[i].text.toLowerCase();
      if (optVal.includes(term) || optText.includes(term) || term.includes(optVal)) {
        categorySelect.selectedIndex = i;
        break;
      }
    }
  }

  // Match budget option based on starting price
  if (budgetSelect && priceRange) {
    const term = priceRange.toLowerCase().replace(/[^0-9]/g, '');
    let matched = false;
    for (let i = 0; i < budgetSelect.options.length; i++) {
      const optVal = budgetSelect.options[i].value;
      if (priceRange.includes('3,000') || priceRange.includes('4,000')) {
        budgetSelect.selectedIndex = 1; // ₹3,000 – ₹8,000
        matched = true;
        break;
      } else if (priceRange.includes('5,000')) {
        budgetSelect.selectedIndex = 2; // ₹5,000 – ₹15,000
        matched = true;
        break;
      } else if (priceRange.includes('7,000')) {
        budgetSelect.selectedIndex = 3; // ₹7,000 – ₹15,000
        matched = true;
        break;
      } else if (priceRange.includes('8,000') || priceRange.includes('10,000')) {
        budgetSelect.selectedIndex = 4; // ₹8,000 – ₹25,000
        matched = true;
        break;
      } else if (priceRange.includes('12,000') || priceRange.includes('15,000')) {
        budgetSelect.selectedIndex = 5; // ₹12,000 – ₹40,000
        matched = true;
        break;
      } else if (priceRange.includes('25,000')) {
        budgetSelect.selectedIndex = 6; // ₹25,000 – ₹1,00,000+
        matched = true;
        break;
      }
    }
  }

  // Pre-fill details textarea
  if (detailsField) {
    detailsField.value = `Selected Package: ${typeName} (${priceRange})\nUse Case: ${useCase}\n\nKey requirements / brand goals: `;
  }

  // Scroll smoothly to enquiry form
  if (enquirySection) {
    enquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (categorySelect) {
      setTimeout(() => {
        categorySelect.focus();
      }, 400);
    }
  }
};

/**
 * Interactive Project Scope & Cost Estimator
 */
function initScopeEstimator() {
  const typeBtns = document.querySelectorAll('.estimator-type-btn');
  const featurePills = document.querySelectorAll('.estimator-feature-pill');
  const priceDisplay = document.getElementById('est-price-display');
  const timelineDisplay = document.getElementById('est-timeline-display');
  const summaryType = document.getElementById('est-summary-type');
  const summaryFeatures = document.getElementById('est-summary-features');
  const transferBtn = document.getElementById('btn-transfer-estimator');

  if (!priceDisplay) return;

  const typeConfig = {
    business: { name: 'Business Website', basePrice: 7000, days: '7–12 Days', category: 'Business Website' },
    ecommerce: { name: 'E-commerce Website', basePrice: 15000, days: '14–21 Days', category: 'E-commerce Website' },
    webapp: { name: 'SaaS / Custom Web App', basePrice: 25000, days: '21–30 Days', category: 'SaaS Web Application' },
    landing: { name: 'Landing Page', basePrice: 3000, days: '3–5 Days', category: 'Landing Page' },
    portfolio: { name: 'Portfolio Website', basePrice: 3000, days: '3–5 Days', category: 'Portfolio Website' }
  };

  let selectedType = 'business';

  function recalculate() {
    const base = typeConfig[selectedType] || typeConfig.business;
    let total = base.basePrice;
    let featureCount = 0;
    const selectedFeatureNames = [];

    featurePills.forEach(pill => {
      const input = pill.querySelector('input');
      if (input && input.checked) {
        const cost = parseInt(pill.getAttribute('data-cost') || '0', 10);
        total += cost;
        featureCount++;
        selectedFeatureNames.push(input.value);
        pill.classList.add('selected');
      } else {
        pill.classList.remove('selected');
      }
    });

    // Format INR
    priceDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
    timelineDisplay.textContent = base.days;
    if (summaryType) summaryType.textContent = base.name;
    if (summaryFeatures) summaryFeatures.textContent = `${featureCount} Selected Add-ons`;

    return { base, total, selectedFeatureNames };
  }

  // Type selection
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedType = btn.getAttribute('data-type') || 'business';
      recalculate();
    });
  });

  // Feature pill clicks
  featurePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const input = pill.querySelector('input');
      if (input && e.target !== input) {
        input.checked = !input.checked;
      }
      recalculate();
    });
  });

  // Transfer to Enquiry Brief
  if (transferBtn) {
    transferBtn.addEventListener('click', () => {
      const { base, total, selectedFeatureNames } = recalculate();
      const enquirySection = document.getElementById('enquiry');
      const categorySelect = document.getElementById('enq-category');
      const budgetSelect = document.getElementById('enq-budget');
      const detailsField = document.getElementById('enq-details');

      let calculatedBudget = "₹10,000–₹25,000";
      if (total < 5000) calculatedBudget = "Under ₹5,000";
      else if (total <= 10000) calculatedBudget = "₹5,000–₹10,000";
      else if (total <= 25000) calculatedBudget = "₹10,000–₹25,000";
      else if (total <= 50000) calculatedBudget = "₹25,000–₹50,000";
      else calculatedBudget = "₹50,000+";

      const detailsText = `Estimated Scope: ${base.name}\nEstimated Budget: ₹${total.toLocaleString('en-IN')}\nAdd-ons: ${selectedFeatureNames.join(', ')}`;

      // If dedicated form is on another page (/contact), redirect smoothly
      if (!categorySelect) {
        const targetUrl = new URL('/contact', window.location.origin);
        if (base.category) targetUrl.searchParams.set('category', base.category);
        targetUrl.searchParams.set('budget', calculatedBudget);
        targetUrl.searchParams.set('details', detailsText);
        window.location.href = targetUrl.toString();
        return;
      }

      if (base.category) {
        for (let i = 0; i < categorySelect.options.length; i++) {
          if (categorySelect.options[i].value === base.category) {
            categorySelect.selectedIndex = i;
            break;
          }
        }
      }

      if (budgetSelect) {
        budgetSelect.value = calculatedBudget;
      }

      // Check corresponding feature options in enquiry form
      selectedFeatureNames.forEach(featName => {
        const tiles = document.querySelectorAll('.feature-option-tile, .enq-feature-chip');
        tiles.forEach(tile => {
          const input = tile.querySelector('input');
          if (input && input.value.toLowerCase().includes(featName.toLowerCase())) {
            input.checked = true;
            tile.classList.add('selected');
            const mark = tile.querySelector('.chip-status-mark');
            if (mark) mark.textContent = '✓';
          }
        });
      });

      if (detailsField) {
        detailsField.value = detailsText;
      }

      if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  recalculate();
}

/**
 * FAQ Accordion Expansion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-header-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Smooth Back to Top
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Hero Mockup Interactive Viewport Switcher
 */
function initHeroMockupToggles() {
  const viewportBtns = document.querySelectorAll('.viewport-btn');
  const innerMockup = document.getElementById('hero-mockup-inner');

  viewportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewportBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-viewport');

      if (!innerMockup) return;
      if (mode === 'mobile') {
        innerMockup.style.maxWidth = '380px';
        innerMockup.style.margin = '0 auto';
        innerMockup.style.transition = 'max-width 0.3s ease';
      } else if (mode === 'tablet') {
        innerMockup.style.maxWidth = '680px';
        innerMockup.style.margin = '0 auto';
        innerMockup.style.transition = 'max-width 0.3s ease';
      } else {
        innerMockup.style.maxWidth = '100%';
        innerMockup.style.margin = '0 auto';
        innerMockup.style.transition = 'max-width 0.3s ease';
      }
    });
  });
}
