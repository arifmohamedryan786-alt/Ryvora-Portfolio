/**
 * RYVORA Agency — Portfolio Concept Showcase & Interactive Inspection
 * Demonstrates high-tier design and development across diverse industries.
 */

const PORTFOLIO_DATA = [
  {
    id: 'apex-horizon',
    title: 'Apex Horizon',
    industry: 'Corporate & Business',
    category: 'Commercial Capital & Real Estate',
    typeTag: 'business',
    serviceLink: 'Company & Professional Websites',
    styleTag: 'Architectural & Authoritative',
    image: '/assets/images/apex_horizon.jpg',
    browserUrl: 'concept.ryvora.agency/apex-horizon',
    tagline: 'Authoritative commercial web platform with encrypted lead capture',
    desc: 'A corporate web platform engineered for institutional trust, featuring architectural project case studies, executive leadership directories, and confidential inquiry routing.',
    fullDesc: 'Apex Horizon showcases RYVORA\'s approach to corporate, financial advisory, and commercial development websites. Designed with razor-sharp typography and clean whitespace hierarchy, it establishes immediate market prestige while funneling qualified client leads directly into your database.',
    features: [
      'Multi-tier commercial portfolio case studies',
      'Encrypted stakeholder enquiry capture workflow',
      'Leadership bio cards with modal credential previews',
      'Institutional compliance and legal disclosure framework',
      'Sub-second page load verified across enterprise connections'
    ],
    tech: ['Semantic HTML5', 'Vanilla CSS', 'SQLite Backend', '100% PageSpeed'],
    clientProfile: 'Investment firms, commercial real estate developers, law practices, and corporate consultancies.'
  },
  {
    id: 'aurelia-haute',
    title: 'Aurelia Haute',
    industry: 'E-Commerce & Retail',
    category: 'Artisanal Fashion & Luxury Goods',
    typeTag: 'ecommerce',
    serviceLink: 'E-Commerce Platforms',
    styleTag: 'Editorial & High Fashion',
    image: '/assets/images/aurelia_haute.jpg',
    browserUrl: 'concept.ryvora.agency/aurelia-haute',
    tagline: 'High-contrast editorial commerce engineered for instant checkout conversion',
    desc: 'An editorial fashion flagship featuring responsive product grids, slide-out cart drawers, currency toggles, and seamless payment gateway integration.',
    fullDesc: 'Aurelia Haute embodies modern luxury digital retail. Built without slow third-party template bloat, this concept delivers instantaneous page transitions, high-resolution lookbooks, dynamic variant selectors, and a frictionless multi-step checkout funnel.',
    features: [
      'Instant-filtering product catalog with live search',
      'Slide-out shopping bag drawer with subtotal calculations',
      'Razorpay, UPI & Stripe checkout architecture',
      'Refined editorial lookbook and collection storylines',
      'Touch-optimized mobile purchasing journey'
    ],
    tech: ['Headless Architecture', 'Cart Micro-State', 'Payment Gateway Ready', 'SEO Schema'],
    clientProfile: 'Designer apparel, artisanal jewelry, luxury lifestyle goods, and direct-to-consumer boutique storefronts.'
  },
  {
    id: 'nexaflow-saas',
    title: 'NexaFlow Cloud',
    industry: 'Web Applications & SaaS',
    category: 'Developer Infrastructure & Cloud Analytics',
    typeTag: 'saas',
    serviceLink: 'Management Portals & Dashboards',
    styleTag: 'Modern Tech & Precision UI',
    image: '/assets/images/nexaflow_saas.jpg',
    browserUrl: 'concept.ryvora.agency/nexaflow-cloud',
    tagline: 'High-conversion technical application platform with interactive telemetry',
    desc: 'A developer platform featuring interactive server telemetry charts, tiered pricing calculators, documentation drawers, and user onboarding.',
    fullDesc: 'Engineered for SaaS platforms, developer APIs, and technology businesses where complex technical features must be communicated with absolute clarity. Includes interactive feature matrices, transparent subscription tiers, and optimized sign-up conversions.',
    features: [
      'Interactive tiered subscription & pricing calculator',
      'Visual performance metric charts & telemetry display',
      'Syntax-highlighted code integration snippets',
      'Optimized conversion rate funnel and lead capture',
      'Core Web Vitals green-light compliance'
    ],
    tech: ['Vanilla JavaScript', 'SVG Micro-Charts', 'Zero Dependencies', 'Sub-second Paint'],
    clientProfile: 'Software startups, API providers, fintech services, and modern cloud platforms.'
  },
  {
    id: 'gusto-bistro',
    title: 'Gusto Bistro',
    industry: 'Restaurant & Dining',
    category: 'Artisanal Dining & Table Reservations',
    typeTag: 'restaurant',
    serviceLink: 'Restaurant & Hospitality Websites',
    styleTag: 'Warm Modern & Sensory',
    image: '/assets/images/gusto_bistro.jpg',
    browserUrl: 'concept.ryvora.agency/gusto-bistro',
    tagline: 'Culinary storytelling with automated online table reservation requests',
    desc: 'An inviting dining platform designed for boutique eateries and fine dining, featuring seasonal menus, allergen filters, and instant WhatsApp booking.',
    fullDesc: 'Gusto Bistro demonstrates RYVORA\'s approach to hospitality websites. Built around immersive visual hierarchy and frictionless guest actions, visitors can explore categorized seasonal menus, view operating hours and location, and submit reservation requests directly into the establishment\'s communication channels.',
    features: [
      'Interactive categorized dining & beverage menu',
      'Direct table reservation request workflow',
      'Dietary & allergen filter tags',
      'Google Maps & private event booking integration',
      'Fast mobile layout for on-the-go diners'
    ],
    tech: ['Semantic HTML5', 'Vanilla CSS Grid', 'Accessible ARIA', 'Zero Bloat'],
    clientProfile: 'Independent restaurants, bistros, wine bars, and boutique catering services looking to elevate their dining presence.'
  },
  {
    id: 'solis-escape',
    title: 'Solis Escape',
    industry: 'Travel & Tourism',
    category: 'Luxury Island Villas & Tour Packages',
    typeTag: 'travel',
    serviceLink: 'Travel & High-Impact Landing Pages',
    styleTag: 'Experiential & Scenic',
    image: '/assets/images/solis_escape.jpg',
    browserUrl: 'concept.ryvora.agency/solis-escape',
    tagline: 'Experiential destination showcase with direct booking concierge journeys',
    desc: 'A luxury boutique resort and private villa portal equipped with itinerary breakdowns, destination galleries, and direct WhatsApp concierge pipelines.',
    fullDesc: 'Crafted for travel operators, destination villas, and tour agencies where imagery and trip discovery drive bookings. The architecture emphasizes high-resolution destination lookbooks, transparent package pricing in INR and foreign currencies, and instant WhatsApp inquiry routing.',
    features: [
      'Destination & package filter breakdown',
      'Itinerary highlights & multi-day breakdown',
      'Direct WhatsApp concierge inquiry pipeline',
      'Villa amenity specification cards',
      'Responsive photo galleries with optimized assets'
    ],
    tech: ['Modern CSS', 'Sub-second Load', 'WhatsApp API', 'Mobile-First'],
    clientProfile: 'Tour operators, eco-resorts, experiential travel planners, and boutique hospitality groups.'
  },
  {
    id: 'studio-kroma',
    title: 'Studio Kroma',
    industry: 'Creative Portfolio',
    category: 'Architecture & Art Direction',
    typeTag: 'portfolio',
    serviceLink: 'Portfolio & Creative Websites',
    styleTag: 'Editorial & High Discipline',
    image: '/assets/images/studio_kroma.jpg',
    browserUrl: 'concept.ryvora.agency/studio-kroma',
    tagline: 'Uncompromising visual archive for visionary architects and designers',
    desc: 'An architectural portfolio showcasing high-impact project galleries, typographic discipline, and bespoke client enquiry journeys.',
    fullDesc: 'Studio Kroma is tailored for architects, creative directors, photographers, and independent studios whose work demands a digital canvas as refined as their physical creations. It strips away digital clutter to let case studies command attention.',
    features: [
      'Full-bleed project galleries with lightbox previews',
      'Narrative case study layouts with design briefs',
      'Kinetic typographic hierarchy',
      'Direct client commission inquiry flow',
      'Zero layout shift across tablet and desktop'
    ],
    tech: ['Fluid Typography', 'Custom Lightbox', 'Accessible HTML', 'Fast CDN'],
    clientProfile: 'Architects, interior designers, commercial photographers, and creative directors.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolioGrid('all');
  initPortfolioFilters();
  initPortfolioModal();
});

/**
 * Render Portfolio Grid Cards
 */
function renderPortfolioGrid(filterCategory = 'all') {
  const container = document.getElementById('portfolio-grid-container');
  if (!container) return;

  const filtered = filterCategory === 'all'
    ? PORTFOLIO_DATA
    : PORTFOLIO_DATA.filter(item => item.typeTag === filterCategory || item.industry.toLowerCase().includes(filterCategory.toLowerCase()));

  container.innerHTML = filtered.map(item => `
    <article class="preview-showcase-card" data-category="${item.typeTag}">
      
      <!-- Top Simulated Browser Bar -->
      <div class="card-browser-mockup">
        <div class="card-browser-header">
          <div class="mac-window-controls">
            <span class="mac-dot red"></span>
            <span class="mac-dot yellow"></span>
            <span class="mac-dot green"></span>
          </div>
          <span class="card-browser-url">${item.browserUrl}</span>
          <span style="font-family:var(--font-mono); font-size:0.625rem; color:var(--status-green); font-weight:700;">LIVE</span>
        </div>
        <div class="card-image-wrap">
          <img src="${item.image}" alt="${item.title} — ${item.category}" loading="lazy" />
          <span class="card-badge-floating">${item.styleTag}</span>
        </div>
      </div>

      <!-- Card Content Body -->
      <div class="card-body-content">
        <span class="card-industry-category">${item.industry}</span>
        <h3 class="card-project-title">${item.title}</h3>
        <p class="card-project-desc">${item.desc}</p>

        <!-- Feature List -->
        <ul class="card-features-mini-list">
          ${item.features.slice(0, 3).map(f => `
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>

        <!-- Tech Chips -->
        <div class="card-tech-chips-row">
          ${item.tech.map(t => `<span class="card-tech-chip">${t}</span>`).join('')}
        </div>

        <!-- Action Bar -->
        <div class="card-action-bar">
          <button type="button" class="btn-inspect-concept" onclick="openConceptModal('${item.id}')">
            <span>Inspect Concept</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          <a href="#enquiry" class="btn-build-similar" onclick="window.selectService('${item.serviceLink}', '${item.industry}')">Build Similar</a>
        </div>

      </div>

    </article>
  `).join('');
}

/**
 * Filter Chip Buttons Handler
 */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-chip-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderPortfolioGrid(cat);
    });
  });
}

/**
 * Concept Inspection Modal Handling
 */
function initPortfolioModal() {
  const modal = document.getElementById('concept-modal');
  const closeBtn = document.getElementById('concept-modal-close');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * Open Concept Modal with Data
 */
window.openConceptModal = function(conceptId) {
  const item = PORTFOLIO_DATA.find(p => p.id === conceptId);
  if (!item) return;

  const modal = document.getElementById('concept-modal');
  if (!modal) return;

  document.getElementById('modal-concept-title').textContent = item.title;
  document.getElementById('modal-concept-category').textContent = `${item.industry} • ${item.category}`;
  document.getElementById('modal-concept-tagline').textContent = item.tagline;
  document.getElementById('modal-concept-desc').textContent = item.fullDesc;
  document.getElementById('modal-concept-img').src = item.image;
  document.getElementById('modal-concept-img').alt = item.title;
  document.getElementById('modal-concept-url').textContent = item.browserUrl;

  // Features list
  const featuresList = document.getElementById('modal-concept-features');
  if (featuresList) {
    featuresList.innerHTML = item.features.map(f => `
      <li style="display:flex; align-items:center; gap:8px; font-size:0.875rem; color:var(--text-slate-600); margin-bottom:6px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue-600)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${f}</span>
      </li>
    `).join('');
  }

  // Tech stack
  const techContainer = document.getElementById('modal-concept-tech');
  if (techContainer) {
    techContainer.innerHTML = item.tech.map(t => `<span class="card-tech-chip">${t}</span>`).join('');
  }

  // Client profile
  const profileEl = document.getElementById('modal-concept-profile');
  if (profileEl) {
    profileEl.textContent = item.clientProfile;
  }

  // Connect CTA
  const ctaBtn = document.getElementById('modal-concept-cta');
  if (ctaBtn) {
    ctaBtn.onclick = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      window.selectService(item.serviceLink, item.industry);
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};
