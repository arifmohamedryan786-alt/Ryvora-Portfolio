/**
 * RYVORA Agency — Admin Dashboard Controller
 */

let currentAdmin = null;
let currentEnquiryId = null;
let searchDebounceTimer = null;
let currentView = 'enquiries';

document.addEventListener('DOMContentLoaded', async () => {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return;

  initEventListeners();
  loadDashboardData();
});

/**
 * Check admin authentication
 */
async function checkAdminAuth() {
  try {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      window.location.replace('/admin/login.html');
      return false;
    }
    const data = await res.json();
    currentAdmin = data.admin;

    // Display admin name and initials
    const nameEl = document.getElementById('admin-name-display');
    const initialsEl = document.getElementById('admin-initials');
    if (nameEl) nameEl.textContent = currentAdmin.name || currentAdmin.email;
    if (initialsEl && currentAdmin.name) {
      const parts = currentAdmin.name.trim().split(' ');
      initialsEl.textContent = parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
    }
    return true;
  } catch (err) {
    window.location.replace('/admin/login.html');
    return false;
  }
}

/**
 * Event listeners for search, filter, and drawer
 */
function initEventListeners() {
  const searchInput = document.getElementById('enquiry-search');
  const statusFilter = document.getElementById('enquiry-status-filter');
  const backdrop = document.getElementById('admin-backdrop');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        loadEnquiries();
      }, 300);
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      loadEnquiries();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeDrawer();
      closeDeleteModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeDeleteModal();
    }
  });
}

/**
 * Load stats & current view data
 */
window.refreshAdminData = function() {
  loadStats();
  if (currentView === 'enquiries') {
    loadEnquiries();
  } else {
    loadMessages();
  }
  showToast('Dashboard refreshed');
};

function loadDashboardData() {
  loadStats();
  loadEnquiries();
}

/**
 * Load aggregate KPIs
 */
async function loadStats() {
  try {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) return;
    const stats = await res.json();

    document.getElementById('kpi-total').textContent = stats.total || 0;
    document.getElementById('kpi-pending').textContent = stats.pending || 0;
    document.getElementById('kpi-indev').textContent = stats.inDev || 0;
    document.getElementById('kpi-completed').textContent = (stats.completed || 0) + (stats.approved || 0);
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

/**
 * Load and render enquiries list
 */
async function loadEnquiries() {
  const tbody = document.getElementById('enquiries-table-body');
  const countLabel = document.getElementById('result-count-label');
  const search = document.getElementById('enquiry-search')?.value || '';
  const status = document.getElementById('enquiry-status-filter')?.value || 'all';

  try {
    const params = new URLSearchParams({ search, status });
    const res = await fetch(`/api/admin/enquiries?${params}`);
    if (!res.ok) throw new Error('Failed to fetch enquiries.');
    const enquiries = await res.json();

    if (countLabel) {
      countLabel.textContent = `Showing ${enquiries.length} ${enquiries.length === 1 ? 'enquiry' : 'enquiries'}`;
    }

    if (!enquiries || enquiries.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 48px; color: var(--admin-text-sub);">
            No enquiries found matching your search criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = enquiries.map(item => {
      const createdDate = new Date(item.created_at).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return `
        <tr>
          <td>
            <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: #ffffff; font-size: 0.84rem;">
              ${escapeHtml(item.enquiry_id)}
            </span>
          </td>
          <td>
            <div style="font-weight: 600; color: #fff;">${escapeHtml(item.customer_name)}</div>
            <div style="font-size: 0.78rem; color: var(--admin-text-sub);">${escapeHtml(item.business_name || 'Individual')}</div>
          </td>
          <td>
            <div style="font-weight: 500;">${escapeHtml(item.website_type)}</div>
            <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${escapeHtml(item.project_nature)}</div>
          </td>
          <td>
            <span style="font-weight: 600; color: #ffffff;">${escapeHtml(item.budget)}</span>
          </td>
          <td>
            <span style="font-size: 0.8125rem; color: var(--admin-text-sub);">${escapeHtml(item.timeline)}</span>
          </td>
          <td>
            <span style="font-size: 0.8125rem; color: var(--admin-text-sub);">${createdDate}</span>
          </td>
          <td>
            <span class="status-pill status-${item.status}">
              ${escapeHtml(item.status)}
            </span>
          </td>
          <td style="text-align: right;">
            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="openEnquiryDrawer('${item.enquiry_id}')">
              Inspect Spec
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading enquiries:', err);
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 32px; color: #f87171;">
          Error retrieving records: ${escapeHtml(err.message)}
        </td>
      </tr>
    `;
  }
}

/**
 * Open detail drawer for an enquiry
 */
window.openEnquiryDrawer = async function(enquiryId) {
  try {
    const res = await fetch(`/api/admin/enquiries/${enquiryId}`);
    if (!res.ok) throw new Error('Could not load enquiry details.');
    const data = await res.json();
    currentEnquiryId = data.enquiry_id;

    // Populate drawer header
    document.getElementById('drawer-ticket-id').textContent = data.enquiry_id;
    document.getElementById('drawer-client-name').textContent = data.customer_name;
    document.getElementById('drawer-status-select').value = data.status;

    // Contact buttons
    const cleanPhone = (data.phone || '').replace(/[^0-9]/g, '');
    const waLink = document.getElementById('drawer-wa-btn');
    if (waLink) {
      const msg = encodeURIComponent(`Hello ${data.customer_name}, this is RYVORA regarding your enquiry (${data.enquiry_id}) for ${data.website_type}.`);
      waLink.href = `https://wa.me/${cleanPhone}?text=${msg}`;
    }

    const emailLink = document.getElementById('drawer-email-btn');
    if (emailLink) {
      emailLink.href = `mailto:${data.email}?subject=${encodeURIComponent(`RYVORA Website Project Scope [${data.enquiry_id}]`)}`;
    }

    // Customer fields
    document.getElementById('drawer-field-name').textContent = data.customer_name;
    document.getElementById('drawer-field-business').textContent = data.business_name || 'Individual';
    document.getElementById('drawer-field-email').textContent = data.email;
    document.getElementById('drawer-field-phone').textContent = data.phone;

    // Scope fields
    document.getElementById('drawer-field-type').textContent = data.website_type;
    document.getElementById('drawer-field-nature').textContent = data.project_nature;
    document.getElementById('drawer-field-pages').textContent = data.pages;
    document.getElementById('drawer-field-budget').textContent = data.budget;
    document.getElementById('drawer-field-timeline').textContent = data.timeline;
    document.getElementById('drawer-field-style').textContent = data.design_style || 'Not specified';
    document.getElementById('drawer-field-colors').textContent = data.colors || 'Not specified';

    const dateFormatted = new Date(data.created_at).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    document.getElementById('drawer-field-date').textContent = dateFormatted;

    // Reference URL
    const refContainer = document.getElementById('drawer-field-ref');
    if (data.reference_url && data.reference_url.trim()) {
      refContainer.innerHTML = `
        <a href="${escapeHtml(data.reference_url)}" target="_blank" rel="noopener noreferrer" style="color: #ffffff; text-decoration: underline; display: inline-flex; align-items: center; gap: 6px;">
          <span>${escapeHtml(data.reference_url)}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      `;
    } else {
      refContainer.textContent = 'None provided';
    }

    // Features
    const featContainer = document.getElementById('drawer-field-features');
    if (data.features && data.features.length > 0) {
      featContainer.innerHTML = data.features.map(f => `
        <span class="status-pill status-New" style="font-size: 0.72rem;">${escapeHtml(f)}</span>
      `).join('');
    } else {
      featContainer.innerHTML = '<span style="color: var(--admin-text-muted); font-size: 0.8125rem;">Standard baseline architecture</span>';
    }

    // Vision details
    document.getElementById('drawer-field-details').textContent = data.details || 'No additional vision notes provided.';

    // Render notes
    renderDrawerNotes(data.notes || []);

    // Open drawer
    document.getElementById('enquiry-drawer').classList.add('open');
    document.getElementById('admin-backdrop').classList.add('active');
  } catch (err) {
    showToast(err.message, 'error');
  }
};

window.closeDrawer = function() {
  document.getElementById('enquiry-drawer')?.classList.remove('open');
  document.getElementById('admin-backdrop')?.classList.remove('active');
  currentEnquiryId = null;
};

/**
 * Render notes in drawer
 */
function renderDrawerNotes(notes) {
  const container = document.getElementById('drawer-notes-list');
  if (!container) return;

  if (!notes || notes.length === 0) {
    container.innerHTML = '<div style="font-size: 0.8125rem; color: var(--admin-text-muted);">No internal team notes recorded yet.</div>';
    return;
  }

  container.innerHTML = notes.map(n => {
    const timeFormatted = new Date(n.created_at).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
    return `
      <div class="note-item">
        <div class="note-meta">
          <span style="font-weight: 600; color: #fff;">${escapeHtml(n.admin_name)}</span>
          <span>${timeFormatted}</span>
        </div>
        <div style="color: var(--admin-text-main);">${escapeHtml(n.note)}</div>
      </div>
    `;
  }).join('');
}

/**
 * Update enquiry status from drawer
 */
window.updateCurrentStatus = async function() {
  if (!currentEnquiryId) return;
  const select = document.getElementById('drawer-status-select');
  const newStatus = select.value;

  try {
    const res = await fetch(`/api/admin/enquiries/${currentEnquiryId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status.');

    showToast(`Status updated to "${newStatus}"`, 'success');
    loadStats();
    loadEnquiries();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

/**
 * Submit internal note
 */
window.submitAdminNote = async function(e) {
  e.preventDefault();
  if (!currentEnquiryId) return;
  const input = document.getElementById('new-note-input');
  const note = input.value.trim();
  if (!note) return;

  try {
    const res = await fetch(`/api/admin/enquiries/${currentEnquiryId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add note.');

    input.value = '';
    renderDrawerNotes(data.notes);
    showToast('Internal note saved', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
};

/**
 * Delete Enquiry Confirmation Workflow
 */
window.confirmDeleteEnquiry = function() {
  if (!currentEnquiryId) return;
  document.getElementById('delete-ticket-id').textContent = currentEnquiryId;
  document.getElementById('delete-modal-backdrop').style.display = 'block';
};

window.closeDeleteModal = function() {
  document.getElementById('delete-modal-backdrop').style.display = 'none';
};

window.executeDeleteEnquiry = async function() {
  if (!currentEnquiryId) return;
  const btn = document.getElementById('confirm-delete-action-btn');
  btn.disabled = true;
  btn.textContent = 'Deleting...';

  try {
    const res = await fetch(`/api/admin/enquiries/${currentEnquiryId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete enquiry.');

    closeDeleteModal();
    closeDrawer();
    showToast(`Enquiry ${currentEnquiryId} permanently deleted.`, 'success');
    loadStats();
    loadEnquiries();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Yes, Delete Permanently';
  }
};

/**
 * View Switcher (Enquiries vs Quick Messages)
 */
window.switchView = function(viewName) {
  currentView = viewName;
  const tabEnq = document.getElementById('tab-enquiries');
  const tabMsg = document.getElementById('tab-messages');
  const viewEnq = document.getElementById('enquiries-view');
  const viewMsg = document.getElementById('messages-view');

  if (viewName === 'enquiries') {
    tabEnq.classList.add('active');
    tabMsg.classList.remove('active');
    viewEnq.style.display = 'block';
    viewMsg.style.display = 'none';
    loadEnquiries();
  } else {
    tabEnq.classList.remove('active');
    tabMsg.classList.add('active');
    viewEnq.style.display = 'none';
    viewMsg.style.display = 'block';
    loadMessages();
  }
};

/**
 * Load quick messages
 */
async function loadMessages() {
  const tbody = document.getElementById('messages-table-body');
  try {
    const res = await fetch('/api/admin/messages');
    if (!res.ok) throw new Error('Failed to fetch messages');
    const messages = await res.json();

    if (!messages || messages.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 48px; color: var(--admin-text-sub);">
            No quick contact messages received yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = messages.map(m => {
      const date = new Date(m.created_at).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return `
        <tr>
          <td style="font-size: 0.8125rem; color: var(--admin-text-sub);">${date}</td>
          <td style="font-weight: 600; color: #fff;">${escapeHtml(m.name)}</td>
          <td>
            <a href="mailto:${escapeHtml(m.email)}" style="color: #ffffff; text-decoration: underline;">
              ${escapeHtml(m.email)}
            </a>
          </td>
          <td style="font-size: 0.875rem; color: var(--admin-text-main);">${escapeHtml(m.message)}</td>
          <td style="text-align: right;">
            <a href="mailto:${escapeHtml(m.email)}?subject=Re: RYVORA Contact Inquiry" class="admin-btn admin-btn-outline admin-btn-sm">
              Reply
            </a>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 32px; color: #f87171;">
          ${escapeHtml(err.message)}
        </td>
      </tr>
    `;
  }
}

/**
 * Toast Notice
 */
function showToast(message, type = 'info') {
  const toast = document.getElementById('admin-toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.className = `toast-notice show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
