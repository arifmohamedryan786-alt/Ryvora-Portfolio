/**
 * RYVORA Agency — Project Enquiry Form Logic & Backend Integration
 * Connects directly to Express / SQLite backend (/api/enquiries)
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectEnquiryForm();
  initInteractiveChips();
  prefillFromQueryParams();
});

/**
 * Pre-fill form from URL Query Parameters (e.g. from homepage CTAs or scope calculator)
 */
function prefillFromQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') || params.get('service');
  const budget = params.get('budget');
  const timeline = params.get('timeline');
  const details = params.get('details');

  const typeSelect = document.getElementById('enq-category');
  if (typeSelect && category) {
    const term = category.toLowerCase();
    for (let i = 0; i < typeSelect.options.length; i++) {
      const optVal = typeSelect.options[i].value.toLowerCase();
      const optText = typeSelect.options[i].text.toLowerCase();
      if (optVal.includes(term) || optText.includes(term) || term.includes(optVal)) {
        typeSelect.selectedIndex = i;
        break;
      }
    }
  }

  const budgetSelect = document.getElementById('enq-budget');
  if (budgetSelect && budget) {
    for (let i = 0; i < budgetSelect.options.length; i++) {
      if (budgetSelect.options[i].value.toLowerCase().includes(budget.toLowerCase()) || 
          budget.toLowerCase().includes(budgetSelect.options[i].value.toLowerCase())) {
        budgetSelect.selectedIndex = i;
        break;
      }
    }
  }

  const timelineSelect = document.getElementById('enq-timeline');
  if (timelineSelect && timeline) {
    for (let i = 0; i < timelineSelect.options.length; i++) {
      if (timelineSelect.options[i].value.toLowerCase().includes(timeline.toLowerCase())) {
        timelineSelect.selectedIndex = i;
        break;
      }
    }
  }

  const detailsField = document.getElementById('enq-details');
  if (detailsField && details) {
    detailsField.value = details;
  }
}

/**
 * Global Service Selector
 * Called from Service cards & Portfolio concepts
 */
window.selectService = function(serviceName, groupName) {
  const typeSelect = document.getElementById('enq-category');
  const enquirySection = document.getElementById('enquiry');

  // If we are not on the dedicated contact form page, navigate to /contact with parameters
  if (!typeSelect) {
    const targetUrl = new URL('/contact', window.location.origin);
    if (serviceName) targetUrl.searchParams.set('service', serviceName);
    if (groupName) targetUrl.searchParams.set('category', groupName);
    window.location.href = targetUrl.toString();
    return;
  }

  if (serviceName) {
    const term = serviceName.toLowerCase();
    for (let i = 0; i < typeSelect.options.length; i++) {
      const optVal = typeSelect.options[i].value.toLowerCase();
      const optText = typeSelect.options[i].text.toLowerCase();
      if (optVal.includes(term) || optText.includes(term) || term.includes(optVal)) {
        typeSelect.selectedIndex = i;
        break;
      }
    }
  }

  const detailsField = document.getElementById('enq-details');
  if (detailsField && (!detailsField.value || detailsField.value.startsWith('I am interested in'))) {
    detailsField.value = `I am interested in discussing a website build for: ${serviceName}${groupName ? ` (${groupName})` : ''}.`;
  }

  if (enquirySection) {
    enquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      typeSelect.focus();
    }, 400);
  }
};

/**
 * Interactive Feature & Page Chips Toggle
 */
function initInteractiveChips() {
  const chips = document.querySelectorAll('.feature-option-tile, .enq-feature-chip');
  chips.forEach(chip => {
    const input = chip.querySelector('input[type="checkbox"]');
    if (!input) return;

    const syncState = () => {
      chip.classList.toggle('selected', input.checked);
    };

    // Sync initial state
    syncState();

    // Listen to change event
    input.addEventListener('change', syncState);
  });
}

/**
 * Universal WhatsApp Chat Opener (Mobile & Desktop Compatible)
 */
function openWhatsAppChat(messageText = '') {
  const phone = '918525039751';
  let url = `https://wa.me/${phone}`;
  if (messageText) {
    url += `?text=${encodeURIComponent(messageText)}`;
  }

  // Detect mobile vs desktop
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
  } else {
    const win = window.open(url, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
  }
}

/**
 * Enquiry Form Handling, Validation, and Backend API Communication
 */
function initProjectEnquiryForm() {
  const form = document.getElementById('project-enquiry-form');
  if (!form) return;

  const alertBox = document.getElementById('enquiry-alert-box');
  const submitBtn = document.getElementById('btn-submit-enquiry');
  const formContainer = document.getElementById('enquiry-form-container');
  const confirmationContainer = document.getElementById('enquiry-confirmation-container');
  const resetBtn = document.getElementById('btn-reset-enquiry-form');

  // Clear invalid styling on user interaction
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      if (alertBox && alertBox.style.display !== 'none') {
        alertBox.style.display = 'none';
      }
    });
    input.addEventListener('change', () => {
      input.classList.remove('invalid');
    });
  });

  // Attach WhatsApp handlers to all contact action elements
  const contactLinks = document.querySelectorAll('.contact-method-item, .process-wa-cta, .contact-founder-sig, #btn-direct-wa');
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('https://wa.me/')) {
        e.preventDefault();
        const textParam = href.includes('text=') ? decodeURIComponent(href.split('text=')[1]) : '';
        openWhatsAppChat(textParam);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset error box
    if (alertBox) {
      alertBox.className = 'enquiry-alert';
      alertBox.textContent = '';
      alertBox.style.display = 'none';
    }

    // Collect values
    const customerName = (form.customerName?.value || '').trim();
    const businessName = (form.businessName?.value || '').trim();
    const email = (form.email?.value || '').trim();
    const phone = (form.phone?.value || '').trim();
    const websiteType = form.websiteType?.value || '';
    const projectNature = form.projectNature?.value || '';
    const budget = form.budget?.value || '';
    const timeline = form.timeline?.value || '';
    const referenceUrl = (form.referenceUrl?.value || '').trim();
    const details = (form.details?.value || '').trim();
    const consent = form.consent ? form.consent.checked : false;

    // Collect selected features
    const features = [];
    const featureInputs = form.querySelectorAll('input[name="features"]:checked');
    featureInputs.forEach(fi => features.push(fi.value));

    // Client-side Validation
    const errors = [];
    if (!customerName || customerName.length < 2) {
      errors.push('Please enter your full name (minimum 2 characters).');
      form.customerName?.classList.add('invalid');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid work email address.');
      form.email?.classList.add('invalid');
    }
    if (!phone || phone.length < 7) {
      errors.push('Please enter a valid phone or WhatsApp number.');
      form.phone?.classList.add('invalid');
    }
    if (!websiteType) {
      errors.push('Please select a website category.');
      form.websiteType?.classList.add('invalid');
    }
    if (!projectNature) {
      errors.push('Please select a project type.');
      form.projectNature?.classList.add('invalid');
    }
    if (!budget) {
      errors.push('Please select an estimated budget.');
      form.budget?.classList.add('invalid');
    }
    if (!timeline) {
      errors.push('Please select an expected timeline.');
      form.timeline?.classList.add('invalid');
    }
    if (!consent) {
      errors.push('Please accept the consent agreement to proceed.');
    }

    if (referenceUrl) {
      try {
        const parsed = new URL(referenceUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          errors.push('Reference website URL must start with http:// or https://');
          form.referenceUrl?.classList.add('invalid');
        }
      } catch {
        errors.push('Please enter a valid reference URL (e.g. https://example.com).');
        form.referenceUrl?.classList.add('invalid');
      }
    }

    if (errors.length > 0) {
      if (alertBox) {
        alertBox.className = 'enquiry-alert error';
        alertBox.innerHTML = `
          <div>${errors[0]}</div>
          <div style="margin-top:6px; font-size:0.75rem;">
            Prefer to chat directly? <a href="https://wa.me/918525039751?text=Hello%20RYVORA%2C%20I%20would%20like%20to%20discuss%20a%20website%20project." target="_blank" rel="noopener noreferrer" style="color:#2563EB; font-weight:600; text-decoration:underline;">Click here to open WhatsApp (+91 85250 39751)</a>
          </div>
        `;
        alertBox.style.display = 'block';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    // Construct formatted WhatsApp message with full inquiry details
    const waLines = [
      '🚀 *NEW PROJECT INQUIRY — RYVORA*',
      '',
      `👤 *Full Name:* ${customerName}`,
      businessName ? `🏢 *Company / Business:* ${businessName}` : null,
      `📧 *Work Email:* ${email}`,
      `📱 *Phone / WhatsApp:* ${phone}`,
      `🌐 *Website Category:* ${websiteType}`,
      `🛠️ *Project Type:* ${projectNature}`,
      `💰 *Estimated Budget:* ${budget}`,
      `⏱️ *Expected Timeline:* ${timeline}`,
      features.length > 0 ? `✨ *Required Features:* ${features.join(', ')}` : null,
      referenceUrl ? `🔗 *Reference Website:* ${referenceUrl}` : null,
      details ? `📝 *Project Description:* ${details}` : null,
      '',
      'Please review my project requirements and share a proposal!'
    ].filter(Boolean);

    const waMessage = waLines.join('\n');

    // Open WhatsApp directly for the user on both mobile & desktop
    openWhatsAppChat(waMessage);

    // Update Confirmation Details
    if (formContainer && confirmationContainer) {
      formContainer.style.display = 'none';
      confirmationContainer.style.display = 'block';

      const confCustName = document.getElementById('conf-customer-name');
      const confEnqId = document.getElementById('conf-enquiry-id');
      const confWebType = document.getElementById('conf-website-type');
      const confBudget = document.getElementById('conf-budget');
      const confTimeline = document.getElementById('conf-timeline');
      const confWhatsAppBtn = document.getElementById('conf-whatsapp-btn');

      if (confCustName) confCustName.textContent = customerName;
      if (confEnqId) confEnqId.textContent = 'RYV-' + Date.now().toString(36).toUpperCase();
      if (confWebType) confWebType.textContent = websiteType;
      if (confBudget) confBudget.textContent = budget;
      if (confTimeline) confTimeline.textContent = timeline;

      if (confWhatsAppBtn) {
        confWhatsAppBtn.href = `https://wa.me/918525039751?text=${encodeURIComponent(waMessage)}`;
        confWhatsAppBtn.onclick = (ev) => {
          ev.preventDefault();
          openWhatsAppChat(waMessage);
        };
      }

      confirmationContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Asynchronously log to SQLite database so no submission is lost
    try {
      fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          businessName,
          email,
          phone,
          websiteType,
          projectNature,
          features,
          budget,
          timeline,
          referenceUrl,
          details,
          consent: true
        }),
        keepalive: true
      })
      .then(res => res.json())
      .then(result => {
        const confEnqId = document.getElementById('conf-enquiry-id');
        if (confEnqId && result && result.enquiryId) {
          confEnqId.textContent = result.enquiryId;
        }
      })
      .catch(err => {
        console.warn('Backend sync note:', err);
      });
    } catch (e) {
      console.warn('Database record note:', e);
    }
  });

  // Reset Form
  if (resetBtn && formContainer && confirmationContainer) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      initInteractiveChips();
      formContainer.style.display = 'block';
      confirmationContainer.style.display = 'none';
      if (alertBox) alertBox.style.display = 'none';
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
