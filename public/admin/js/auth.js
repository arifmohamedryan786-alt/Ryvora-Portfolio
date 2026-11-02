/**
 * RYVORA Agency — Admin Authentication Client
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admin-login-form');
  if (form) {
    // If on login page, check if already authenticated
    checkExistingSession();
    form.addEventListener('submit', handleLogin);
  }
});

async function checkExistingSession() {
  try {
    const res = await fetch('/api/admin/me');
    if (res.ok) {
      // Already logged in, direct to admin
      window.location.replace('/admin');
    }
  } catch (err) {
    // Not logged in, stay on login page
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const alertBox = document.getElementById('login-alert');
  const submitBtn = document.getElementById('login-submit-btn');

  if (alertBox) {
    alertBox.className = 'form-alert';
    alertBox.style.display = 'none';
  }

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    showLoginAlert(alertBox, 'Please enter both email and password.');
    return;
  }

  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner"></span> Authenticating...`;

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed. Please verify credentials.');
    }

    // Redirect to protected dashboard
    window.location.replace('/admin');
  } catch (err) {
    showLoginAlert(alertBox, err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

function showLoginAlert(box, msg) {
  if (!box) return;
  box.textContent = msg;
  box.className = 'form-alert error';
  box.style.display = 'block';
}

window.adminLogout = async function() {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
  } finally {
    window.location.replace('/admin/login.html');
  }
};
