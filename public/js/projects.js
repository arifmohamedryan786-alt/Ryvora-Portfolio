/**
 * ============================================================================
 * RYVORA PORTFOLIO — REAL PROJECTS DATA
 * ============================================================================
 * 
 * Brand: RYVORA
 * Owner: Arif Mohamed
 * Tagline: Your Vision. Our Website.
 * 
 * ----------------------------------------------------------------------------
 * HOW TO ADD A NEW PROJECT IN THE FUTURE:
 * ----------------------------------------------------------------------------
 * 1. Copy the template object at the bottom of this array.
 * 2. Fill in your project details:
 *    - id: Unique identifier slug (e.g. 'my-new-project')
 *    - name: The display title of your project
 *    - description: 1-2 sentences explaining what it does
 *    - technologies: Array of tech tags (e.g. ['React', 'Tailwind', 'Node.js'])
 *    - liveUrl: The live URL where users can test it
 *    - githubUrl: (Optional) Repository URL or empty string ''
 *    - status: 'Live Project', 'In Development', or 'Beta'
 *    - previewType: 'qr-studio' (for bespoke interactive mockup) or 'image'
 *    - image: (Optional) Path to your screenshot image (e.g. '/assets/images/projects/photo.jpg')
 * 3. Save this file — your new project will automatically appear on the website!
 * ============================================================================
 */

export const PROJECTS_DATA = [
  {
    id: 'qr-studio',
    name: 'QR Studio',
    description: 'A simple and user-friendly QR code scanner and generator that allows users to scan QR codes using their device camera or upload an image.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://qr-scanner-beta-opal.vercel.app/',
    githubUrl: '', // Optional: add GitHub link when ready
    status: 'Live Project',
    featured: true,
    previewType: 'qr-studio',
    image: '' // When you take a screenshot, place it in /assets/images/ and set path here
  }

  /*
  // --------------------------------------------------------------------------
  // TEMPLATE: UNCOMMENT AND FILL OUT WHEN ADDING YOUR NEXT REAL PROJECT:
  // --------------------------------------------------------------------------
  ,
  {
    id: 'project-two',
    name: 'Project Name Here',
    description: 'A brief description of what this project does and who it helps.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://your-project.vercel.app/',
    githubUrl: '',
    status: 'Live Project',
    featured: false,
    previewType: 'image', // or 'custom'
    image: '/assets/images/projects/project-two.jpg'
  }
  */
];

/**
 * Render the project cards into the given container element
 * @param {HTMLElement} container 
 */
export function renderProjects(container) {
  if (!container) return;

  // Clear container
  container.innerHTML = '';

  PROJECTS_DATA.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);
    card.setAttribute('data-index', (index + 1).toString().padStart(2, '0'));

    // Generate preview area
    const previewHtml = renderProjectPreview(project);

    // Generate tech tags HTML
    const tagsHtml = project.technologies
      .map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`)
      .join('');

    // Optional GitHub link HTML
    const githubHtml = project.githubUrl
      ? `<a href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn-project-link secondary" aria-label="View ${escapeHtml(project.name)} on GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>Source</span>
        </a>`
      : '';

    card.innerHTML = `
      <div class="project-preview-wrap">
        ${previewHtml}
      </div>
      <div class="project-content">
        <div class="project-meta-top">
          <span class="project-index">PROJECT ${(index + 1).toString().padStart(2, '0')}</span>
          <span class="project-status-badge">
            <span class="status-pulse-dot"></span>
            ${escapeHtml(project.status || 'Live Project')}
          </span>
        </div>
        <h3 class="project-title">${escapeHtml(project.name)}</h3>
        <p class="project-description">${escapeHtml(project.description)}</p>
        <div class="project-tech-tags" aria-label="Technologies used">
          ${tagsHtml}
        </div>
        <div class="project-actions">
          <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-project-link primary" aria-label="View live ${escapeHtml(project.name)} project (opens in a new tab)">
            <span>View Project</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
          ${githubHtml}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Render the visual preview area of a project card
 * Provides a clean bespoke visual representation without pretending to be a fake screenshot
 */
function renderProjectPreview(project) {
  // If an actual real image screenshot is provided, render it
  if (project.image && project.previewType === 'image') {
    return `
      <div class="project-image-view">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.name)} preview" loading="lazy" />
      </div>
    `;
  }

  // Bespoke, honest, high-craft QR Studio UI representation
  if (project.previewType === 'qr-studio' || project.id === 'qr-studio') {
    return `
      <div class="qr-preview-stage" aria-hidden="true">
        <!-- Simulated App Header -->
        <div class="qr-preview-chrome">
          <div class="chrome-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="chrome-address">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>qr-scanner-beta-opal.vercel.app</span>
          </div>
          <div class="chrome-badge">
            <span>LIVE WEB APP</span>
          </div>
        </div>

        <!-- Interactive Scanner Visualizer -->
        <div class="qr-scanner-viewport">
          <!-- Ambient Grid Background -->
          <div class="qr-grid-pattern"></div>

          <!-- Viewfinder Frame with Target Corners -->
          <div class="qr-viewfinder">
            <span class="corner corner-tl"></span>
            <span class="corner corner-tr"></span>
            <span class="corner corner-bl"></span>
            <span class="corner corner-br"></span>

            <!-- Animated Laser Scan Beam -->
            <div class="qr-scan-beam"></div>

            <!-- Stylized Clean QR Code Matrix -->
            <svg class="qr-matrix-svg" viewBox="0 0 100 100" fill="currentColor">
              <!-- Top-Left Finder Pattern -->
              <rect x="10" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
              <rect x="17" y="17" width="10" height="10" rx="1.5" fill="currentColor"/>
              
              <!-- Top-Right Finder Pattern -->
              <rect x="66" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
              <rect x="73" y="17" width="10" height="10" rx="1.5" fill="currentColor"/>
              
              <!-- Bottom-Left Finder Pattern -->
              <rect x="10" y="66" width="24" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
              <rect x="17" y="73" width="10" height="10" rx="1.5" fill="currentColor"/>

              <!-- Central & Alignment Pattern Cells -->
              <rect x="42" y="12" width="6" height="6" rx="1"/>
              <rect x="52" y="12" width="6" height="6" rx="1"/>
              <rect x="42" y="24" width="6" height="6" rx="1"/>
              <rect x="48" y="32" width="6" height="6" rx="1"/>
              
              <rect x="12" y="42" width="6" height="6" rx="1"/>
              <rect x="24" y="42" width="6" height="6" rx="1"/>
              <rect x="32" y="48" width="6" height="6" rx="1"/>
              
              <rect x="42" y="42" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="3"/>
              <rect x="47" y="47" width="6" height="6" rx="1"/>

              <rect x="66" y="42" width="6" height="6" rx="1"/>
              <rect x="78" y="42" width="8" height="6" rx="1"/>
              <rect x="66" y="52" width="18" height="6" rx="1"/>

              <rect x="42" y="66" width="6" height="8" rx="1"/>
              <rect x="52" y="72" width="8" height="6" rx="1"/>
              <rect x="42" y="80" width="12" height="6" rx="1"/>
              <rect x="66" y="68" width="8" height="8" rx="1"/>
              <rect x="78" y="74" width="12" height="12" rx="1"/>
            </svg>
          </div>

          <!-- Feature Capability Pills -->
          <div class="qr-capability-row">
            <span class="cap-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              Camera Scanner
            </span>
            <span class="cap-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              Upload Image
            </span>
            <span class="cap-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              Generate Codes
            </span>
          </div>
        </div>
      </div>
    `;
  }

  // Generic fallback placeholder for future projects
  return `
    <div class="project-generic-preview">
      <div class="generic-placeholder-box">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        <span>${escapeHtml(project.name)}</span>
      </div>
    </div>
  `;
}

/**
 * Basic HTML escaping helper to prevent XSS
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Global browser window attachment for compatibility
if (typeof window !== 'undefined') {
  window.RYVORA_PROJECTS = {
    PROJECTS_DATA,
    renderProjects
  };
}
