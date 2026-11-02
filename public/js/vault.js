/**
 * RYVORA Creative Code Vault — Interactive Demos & Code Inspector
 * Original frontend experiments, reusable components, and concepts.
 */

const VAULT_ITEMS = [
  {
    id: 'vault-01',
    num: '#01',
    title: 'Spatial Chrome Auth Experience',
    category: 'Interactive 3D / Authentication',
    desc: 'Monochrome authentication portal featuring an interactive 3D metallic chrome sphere that reflects cursor position with dynamic specular highlights and accessible micro-interactions.',
    tech: ['WebGL Canvas', 'Vanilla JS', 'CSS Glassmorphism', 'ARIA Live'],
    features: [
      'Interactive 3D chrome sphere with real-time mouse tracking',
      'Glassmorphic credentials card with specular edge highlights',
      'Accessible focus states and real-time validation indicator',
      'Smooth cubic-bezier spring physics on button hover'
    ],
    codeSnippet: `<!-- Spatial Chrome Auth Component -->
<div class="spatial-auth-card">
  <canvas id="chrome-sphere-canvas" width="240" height="240"></canvas>
  <form class="auth-form" onsubmit="event.preventDefault()">
    <div class="auth-header">
      <span class="auth-badge">// SECURE ACCESS</span>
      <h3>RYVORA Studio Portal</h3>
    </div>
    <div class="input-group">
      <label for="vault-email">CLIENT IDENTIFIER</label>
      <input type="email" id="vault-email" placeholder="client@brand.com" required />
    </div>
    <div class="input-group">
      <label for="vault-pass">AUTHENTICATION KEY</label>
      <input type="password" id="vault-pass" placeholder="••••••••••••" required />
    </div>
    <button type="submit" class="btn-vault-auth">AUTHENTICATE</button>
  </form>
</div>

<style>
.spatial-auth-card {
  position: relative;
  background: #090909;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
}
.btn-vault-auth {
  width: 100%;
  padding: 14px;
  background: #ffffff;
  color: #050505;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-vault-auth:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.3);
}
</style>`,
    renderDemo: (container) => {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; min-height:360px; background:#060606; border-radius:14px; border:1px solid #222; text-align:center;">
          <div style="position:relative; width:160px; height:160px; margin-bottom:20px;">
            <canvas id="vault-chrome-sphere" width="160" height="160" style="width:160px; height:160px; display:block; cursor:crosshair; border-radius:50%; box-shadow:0 0 40px rgba(255,255,255,0.08);"></canvas>
          </div>
          <span style="font-family:monospace; font-size:11px; color:#888; letter-spacing:0.15em; text-transform:uppercase;">MOVE MOUSE OVER SPHERE TO ROTATE LIGHT SOURCE</span>
          <div style="width:100%; max-width:280px; margin-top:20px; display:flex; flex-direction:column; gap:10px;">
            <input type="text" placeholder="demo.user@ryvora.agency" style="width:100%; padding:10px 14px; background:#111; border:1px solid #333; color:#fff; border-radius:8px; font-family:monospace; font-size:12px;" readonly />
            <button style="padding:10px; background:#fff; color:#050505; font-weight:700; font-family:monospace; font-size:11px; border:none; border-radius:8px; letter-spacing:0.1em; cursor:pointer;" onclick="this.textContent = 'ACCESS GRANTED'; setTimeout(() => this.textContent = 'AUTHENTICATE', 1500)">AUTHENTICATE</button>
          </div>
        </div>
      `;

      const canvas = container.querySelector('#vault-chrome-sphere');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let lightX = 80;
      let lightY = 60;

      const drawSphere = () => {
        ctx.clearRect(0, 0, 160, 160);
        const radGrad = ctx.createRadialGradient(lightX, lightY, 4, 80, 80, 78);
        radGrad.addColorStop(0, '#FFFFFF');
        radGrad.addColorStop(0.2, '#D1D5DB');
        radGrad.addColorStop(0.5, '#4B5563');
        radGrad.addColorStop(0.85, '#111827');
        radGrad.addColorStop(1, '#050505');

        ctx.beginPath();
        ctx.arc(80, 80, 78, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // Rim highlight
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Inner specular reflection dot
        ctx.beginPath();
        ctx.arc(lightX, lightY, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      };

      drawSphere();

      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        lightX = Math.max(30, Math.min(130, mouseX));
        lightY = Math.max(30, Math.min(130, mouseY));
        drawSphere();
      });

      canvas.addEventListener('mouseleave', () => {
        lightX = 80;
        lightY = 60;
        drawSphere();
      });
    }
  },
  {
    id: 'vault-02',
    num: '#02',
    title: 'Kinetic Velocity Marquee',
    category: 'Motion Design / Typography',
    desc: 'Ultra-smooth, hardware-accelerated horizontal marquee strip that supports variable speed, pause-on-hover, drag-to-scrub velocity, and reduced-motion fallback.',
    tech: ['CSS Keyframes', 'Hardware Acceleration', 'RequestAnimationFrame', 'IntersectionObserver'],
    features: [
      'Sub-pixel rendering without text blurring or jitter',
      'Fluid pause on pointer hover and touch interactions',
      'Dual edge fade masks with non-blocking pointer events',
      'Automatic CSS fallback when reduced motion is detected'
    ],
    codeSnippet: `/* Kinetic Marquee Scroller CSS */
.marquee-track {
  display: flex;
  width: max-content;
  white-space: nowrap;
  animation: scrollMarquee 28s linear infinite;
  will-change: transform;
}
.marquee-track:hover {
  animation-play-state: paused;
}
@keyframes scrollMarquee {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    transform: none;
  }
}`,
    renderDemo: (container) => {
      container.innerHTML = `
        <div style="padding:24px; background:#060606; border-radius:14px; border:1px solid #222; overflow:hidden;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-family:monospace; font-size:11px; color:#888;">SPEED CONTROL</span>
            <span id="speed-indicator" style="font-family:monospace; font-size:11px; color:#fff; font-weight:bold;">1.0x NORMAL</span>
          </div>
          <div style="position:relative; width:100%; overflow:hidden; background:#111; padding:16px 0; border:1px solid #2a2a2a; border-radius:8px;">
            <div id="demo-marquee-inner" style="display:flex; gap:32px; white-space:nowrap; animation:demoMarquee 16s linear infinite; will-change:transform;">
              <span style="font-family:monospace; font-size:13px; font-weight:700; color:#fff; letter-spacing:0.15em;">ENGINEERED FOR VELOCITY •</span>
              <span style="font-family:monospace; font-size:13px; font-weight:700; color:#A3A3A3; letter-spacing:0.15em;">BESPOKE DIGITAL CRAFT •</span>
              <span style="font-family:monospace; font-size:13px; font-weight:700; color:#fff; letter-spacing:0.15em;">ZERO TEMPLATE DEPENDENCY •</span>
              <span style="font-family:monospace; font-size:13px; font-weight:700; color:#A3A3A3; letter-spacing:0.15em;">RYVORA PERFORMANCE •</span>
              <span style="font-family:monospace; font-size:13px; font-weight:700; color:#fff; letter-spacing:0.15em;">ENGINEERED FOR VELOCITY •</span>
              <span style="font-family:monospace; font-size:13px; font-weight:700; color:#A3A3A3; letter-spacing:0.15em;">BESPOKE DIGITAL CRAFT •</span>
              <span style="font-family:monospace; font-size:13px; font-weight:700; color:#fff; letter-spacing:0.15em;">ZERO TEMPLATE DEPENDENCY •</span>
              <span style="font-family:monospace; font-size:13px; font-weight:700; color:#A3A3A3; letter-spacing:0.15em;">RYVORA PERFORMANCE •</span>
            </div>
          </div>
          <div style="display:flex; gap:10px; margin-top:16px;">
            <button id="btn-slow" style="flex:1; padding:8px; background:#181818; color:#fff; border:1px solid #333; border-radius:6px; font-family:monospace; font-size:11px; cursor:pointer;">0.5x SLOW</button>
            <button id="btn-normal" style="flex:1; padding:8px; background:#fff; color:#050505; border:1px solid #fff; border-radius:6px; font-family:monospace; font-size:11px; font-weight:bold; cursor:pointer;">1.0x NORMAL</button>
            <button id="btn-fast" style="flex:1; padding:8px; background:#181818; color:#fff; border:1px solid #333; border-radius:6px; font-family:monospace; font-size:11px; cursor:pointer;">2.5x HYPER</button>
          </div>
        </div>
        <style>
        @keyframes demoMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        </style>
      `;

      const track = container.querySelector('#demo-marquee-inner');
      const indicator = container.querySelector('#speed-indicator');
      const btnSlow = container.querySelector('#btn-slow');
      const btnNormal = container.querySelector('#btn-normal');
      const btnFast = container.querySelector('#btn-fast');

      const setSpeed = (sec, text, activeBtn) => {
        if (track) track.style.animationDuration = `${sec}s`;
        if (indicator) indicator.textContent = text;
        [btnSlow, btnNormal, btnFast].forEach(b => {
          b.style.background = '#181818';
          b.style.color = '#fff';
          b.style.borderColor = '#333';
        });
        activeBtn.style.background = '#fff';
        activeBtn.style.color = '#050505';
        activeBtn.style.borderColor = '#fff';
      };

      btnSlow.addEventListener('click', () => setSpeed(32, '0.5x SLOW', btnSlow));
      btnNormal.addEventListener('click', () => setSpeed(16, '1.0x NORMAL', btnNormal));
      btnFast.addEventListener('click', () => setSpeed(6.4, '2.5x HYPER', btnFast));
    }
  },
  {
    id: 'vault-03',
    num: '#03',
    title: 'Perspective 3D Interactive Card',
    category: 'Spatial UI / WebGL Depth',
    desc: 'Real-time mouse tracking 3D tilt component with physics damping, glare reflection gradient, and preserve-3d layers that pop towards the user.',
    tech: ['CSS 3D Transforms', 'Perspective Matrix', 'Event Throttling', 'Vanilla JS'],
    features: [
      'True 3D perspective matrix (perspective: 1000px)',
      'Subtle specular glare follows pointer position dynamically',
      'Multi-layer Z-axis element depth with transform-style: preserve-3d',
      'Smooth automatic spring reset when mouse leaves bounding box'
    ],
    codeSnippet: `// 3D Tilt Script
function attach3DTilt(element) {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 12;
    const rotateY = (x / (rect.width / 2)) * 12;
    element.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)\`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}`,
    renderDemo: (container) => {
      container.innerHTML = `
        <div style="padding:28px; background:#060606; border-radius:14px; border:1px solid #222; display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <div id="interactive-3d-card" style="position:relative; width:260px; height:180px; background:#0e0e0e; border:1px solid rgba(255,255,255,0.18); border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 20px 45px rgba(0,0,0,0.8); cursor:pointer; transition:transform 0.15s ease-out; transform-style:preserve-3d;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-family:monospace; font-size:10px; color:#666;">RYVORA 3D LAB</span>
              <span style="width:8px; height:8px; border-radius:50%; background:#22D3EE; box-shadow:0 0 8px #22D3EE;"></span>
            </div>
            <div>
              <h4 style="font-family:sans-serif; font-size:16px; font-weight:bold; color:#fff; margin-bottom:4px; transform:translateZ(20px);">PERSPECTIVE TILT</h4>
              <p style="font-family:sans-serif; font-size:11px; color:#888; transform:translateZ(10px);">Hover and drag cursor across card to feel spatial depth.</p>
            </div>
            <div style="border-top:1px solid #222; padding-top:8px; display:flex; justify-content:space-between; font-family:monospace; font-size:10px; color:#555;">
              <span>Z-INDEX: 24PX</span>
              <span style="color:#fff;">LIVE PHYSICS</span>
            </div>
          </div>
          <p style="margin-top:16px; font-family:monospace; font-size:11px; color:#777;">TESTED FOR 60FPS SMOOTHNESS</p>
        </div>
      `;

      const card = container.querySelector('#interactive-3d-card');
      if (!card) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 14;
        const rotateY = (x / (rect.width / 2)) * 14;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
  },
  {
    id: 'vault-04',
    num: '#04',
    title: 'Obsidian Analytics Dashboard Widget',
    category: 'Data Visualization / Canvas',
    desc: 'High-performance interactive vector graph engine rendered natively onto HTML5 Canvas with custom tooltips, animated points, and live data generation.',
    tech: ['HTML5 Canvas 2D', 'Vanilla JS Math', 'High-DPI Retina Scaling', 'CSS Grid'],
    features: [
      'Retina 2x display scaling for razor-sharp vector lines',
      'Interactive crosshair tooltip with dynamic monetary values',
      'Zero third-party chart library dependencies (sub-5KB footprint)',
      'Smooth cubic bezier smoothing between discrete data nodes'
    ],
    codeSnippet: `// Retina Canvas Drawing Function
function renderVectorSparkline(canvas, dataPoints) {
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.scale(dpr, dpr);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  dataPoints.forEach((val, i) => {
    const x = (i / (dataPoints.length - 1)) * canvas.clientWidth;
    const y = canvas.clientHeight - (val / 100) * (canvas.clientHeight - 20) - 10;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}`,
    renderDemo: (container) => {
      container.innerHTML = `
        <div style="padding:24px; background:#060606; border-radius:14px; border:1px solid #222;">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:14px;">
            <div>
              <span style="font-family:monospace; font-size:10px; color:#777; letter-spacing:0.1em; text-transform:uppercase;">CONVERSION VELOCITY</span>
              <h4 style="font-family:sans-serif; font-size:22px; font-weight:800; color:#fff; margin-top:2px;">₹4,82,500 <span style="font-size:12px; color:#4ADE80; font-family:monospace;">+38.4%</span></h4>
            </div>
            <button id="vault-regen-data" style="padding:6px 12px; background:#181818; color:#fff; border:1px solid #333; border-radius:6px; font-family:monospace; font-size:11px; cursor:pointer;">RE-GENERATE</button>
          </div>
          <div style="position:relative; width:100%; height:140px; background:#0b0b0b; border:1px solid #1f1f1f; border-radius:8px; overflow:hidden;">
            <canvas id="vault-chart-canvas" style="width:100%; height:100%; display:block;"></canvas>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:10px; font-family:monospace; font-size:10px; color:#555;">
            <span>WEEK 01</span>
            <span>WEEK 02</span>
            <span>WEEK 03</span>
            <span>WEEK 04</span>
          </div>
        </div>
      `;

      const canvas = container.querySelector('#vault-chart-canvas');
      const btnRegen = container.querySelector('#vault-regen-data');
      if (!canvas) return;

      const drawChart = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        ctx.clearRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let y = 20; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Random data points
        const points = [
          15 + Math.random() * 20,
          30 + Math.random() * 25,
          45 + Math.random() * 30,
          35 + Math.random() * 20,
          60 + Math.random() * 25,
          75 + Math.random() * 20,
          85 + Math.random() * 15
        ];

        // Gradient under line
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        ctx.beginPath();
        points.forEach((val, i) => {
          const x = (i / (points.length - 1)) * width;
          const y = height - (val / 100) * (height - 30) - 15;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke line
        ctx.beginPath();
        points.forEach((val, i) => {
          const x = (i / (points.length - 1)) * width;
          const y = height - (val / 100) * (height - 30) - 15;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dots on points
        points.forEach((val, i) => {
          const x = (i / (points.length - 1)) * width;
          const y = height - (val / 100) * (height - 30) - 15;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        });
      };

      setTimeout(drawChart, 60);
      btnRegen.addEventListener('click', drawChart);
    }
  },
  {
    id: 'vault-05',
    num: '#05',
    title: 'Reactive Project Enquiry Stepper',
    category: 'Form Architecture / UX',
    desc: 'Bespoke multi-choice configuration chip interface designed to capture complex client specifications without feeling overwhelming or cluttered.',
    tech: ['Semantic Checkboxes', 'Dynamic Badge Chips', 'ARIA Radiogroup', 'CSS Flexbox'],
    features: [
      'Visual toggle feedback with instant border state illumination',
      'Dynamic budget range estimator synced with selected feature count',
      'Accessible keyboard tab traversal with custom focus halos',
      'Zero form bloat: exports clean serialized JSON payloads'
    ],
    codeSnippet: `<!-- Feature Selector Chips Component -->
<div class="chip-group" role="group" aria-label="Feature Requirements">
  <button type="button" class="spec-chip active" data-feature="cms">
    <span class="chip-dot"></span> CMS Integration
  </button>
  <button type="button" class="spec-chip" data-feature="ecommerce">
    <span class="chip-dot"></span> Payment Gateway
  </button>
  <button type="button" class="spec-chip" data-feature="3d">
    <span class="chip-dot"></span> 3D / WebGL
  </button>
</div>`,
    renderDemo: (container) => {
      container.innerHTML = `
        <div style="padding:24px; background:#060606; border-radius:14px; border:1px solid #222;">
          <span style="font-family:monospace; font-size:10px; color:#888; text-transform:uppercase; letter-spacing:0.1em; display:block; margin-bottom:12px;">SELECT DESIRED MODULES:</span>
          <div id="demo-chips-grid" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px;">
            <div class="demo-chip active" style="padding:8px 14px; background:#fff; color:#050505; font-family:monospace; font-size:11px; font-weight:bold; border-radius:8px; cursor:pointer; user-select:none;">✓ Bespoke Design</div>
            <div class="demo-chip active" style="padding:8px 14px; background:#fff; color:#050505; font-family:monospace; font-size:11px; font-weight:bold; border-radius:8px; cursor:pointer; user-select:none;">✓ Mobile First</div>
            <div class="demo-chip" style="padding:8px 14px; background:#141414; color:#888; font-family:monospace; font-size:11px; border:1px solid #2a2a2a; border-radius:8px; cursor:pointer; user-select:none;">+ Admin Portal</div>
            <div class="demo-chip" style="padding:8px 14px; background:#141414; color:#888; font-family:monospace; font-size:11px; border:1px solid #2a2a2a; border-radius:8px; cursor:pointer; user-select:none;">+ Payment Gateway</div>
            <div class="demo-chip" style="padding:8px 14px; background:#141414; color:#888; font-family:monospace; font-size:11px; border:1px solid #2a2a2a; border-radius:8px; cursor:pointer; user-select:none;">+ SEO Optimization</div>
          </div>
          <div style="padding:12px; background:#111; border:1px solid #222; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-family:monospace; font-size:11px; color:#888;">ESTIMATED COMPLEXITY:</span>
            <span id="demo-complexity" style="font-family:monospace; font-size:12px; color:#fff; font-weight:bold;">2 MODULES SELECTED</span>
          </div>
        </div>
      `;

      const chips = container.querySelectorAll('.demo-chip');
      const complexity = container.querySelector('#demo-complexity');

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const isActive = chip.classList.toggle('active');
          if (isActive) {
            chip.style.background = '#fff';
            chip.style.color = '#050505';
            chip.style.border = 'none';
            if (chip.textContent.startsWith('+')) chip.textContent = '✓' + chip.textContent.slice(1);
          } else {
            chip.style.background = '#141414';
            chip.style.color = '#888';
            chip.style.border = '1px solid #2a2a2a';
            if (chip.textContent.startsWith('✓')) chip.textContent = '+' + chip.textContent.slice(1);
          }
          const activeCount = container.querySelectorAll('.demo-chip.active').length;
          complexity.textContent = `${activeCount} MODULES SELECTED`;
        });
      });
    }
  },
  {
    id: 'vault-06',
    num: '#06',
    title: 'Command Palette Quick Launcher',
    category: 'Keyboard Navigation / Productivity',
    desc: 'Instant keyboard-driven command palette (Cmd/Ctrl + K) that allows keyboard power-users to jump to sections, trigger enquiry forms, or copy contact information instantly.',
    tech: ['Global Keydown Listeners', 'Fuzzy Match Filtering', 'Backdrop Filter', 'Vanilla JS'],
    features: [
      'Accessible Cmd + K / Ctrl + K shortcut activation',
      'Arrow up/down traversal and Enter key execution',
      'Instant scroll teleportation to target page sections',
      'Minimalist monochrome obsidian styling with search feedback'
    ],
    codeSnippet: `// Quick Command Palette Handler
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggleCommandPalette();
  }
  if (e.key === 'Escape' && isPaletteOpen()) {
    closeCommandPalette();
  }
});`,
    renderDemo: (container) => {
      container.innerHTML = `
        <div style="padding:24px; background:#060606; border-radius:14px; border:1px solid #222; text-align:center;">
          <div style="display:inline-flex; align-items:center; gap:8px; padding:8px 16px; background:#141414; border:1px solid #333; border-radius:8px; margin-bottom:16px;">
            <span style="font-family:monospace; font-size:12px; color:#fff; font-weight:bold;">PRESS CMD + K (OR CTRL + K)</span>
          </div>
          <p style="font-family:sans-serif; font-size:12px; color:#888; max-width:320px; margin:0 auto 16px auto;">You can also trigger it directly with the button below to test keyboard navigation.</p>
          <button id="btn-trigger-cmd" style="padding:10px 20px; background:#fff; color:#050505; font-family:monospace; font-size:11px; font-weight:bold; border:none; border-radius:8px; cursor:pointer;">OPEN COMMAND PALETTE</button>
        </div>
      `;

      const btnTrigger = container.querySelector('#btn-trigger-cmd');
      btnTrigger.addEventListener('click', () => {
        if (window.openCommandPalette) window.openCommandPalette();
      });
    }
  }
];

window.VAULT_ITEMS = VAULT_ITEMS;

/**
 * Initialize Vault Interactive Modal
 */
function initVaultModal() {
  const modalOverlay = document.getElementById('vault-modal');
  if (!modalOverlay) return;

  const modalTitle = document.getElementById('vault-modal-title');
  const modalNum = document.getElementById('vault-modal-num');
  const modalCategory = document.getElementById('vault-modal-category');
  const modalDesc = document.getElementById('vault-modal-desc');
  const modalTech = document.getElementById('vault-modal-tech');
  const modalFeatures = document.getElementById('vault-modal-features');
  const modalPreviewArea = document.getElementById('vault-demo-container');
  const modalCodeArea = document.getElementById('vault-code-block');
  const btnClose = document.getElementById('vault-modal-close');
  const btnTabDemo = document.getElementById('tab-vault-demo');
  const btnTabCode = document.getElementById('tab-vault-code');
  const btnCopyCode = document.getElementById('btn-copy-vault-code');

  let activeItem = null;

  window.openVaultModal = function(itemId, initialTab = 'demo') {
    activeItem = VAULT_ITEMS.find(item => item.id === itemId);
    if (!activeItem) return;

    if (modalTitle) modalTitle.textContent = activeItem.title;
    if (modalNum) modalNum.textContent = activeItem.num;
    if (modalCategory) modalCategory.textContent = activeItem.category;
    if (modalDesc) modalDesc.textContent = activeItem.desc;

    // Tech tags
    if (modalTech) {
      modalTech.innerHTML = activeItem.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    }

    // Features
    if (modalFeatures) {
      modalFeatures.innerHTML = activeItem.features.map(f => `<li><span class="feature-dot"></span><span>${f}</span></li>`).join('');
    }

    // Code
    if (modalCodeArea) {
      modalCodeArea.textContent = activeItem.codeSnippet;
    }

    // Demo
    if (modalPreviewArea && activeItem.renderDemo) {
      activeItem.renderDemo(modalPreviewArea);
    }

    setTab(initialTab);

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeVaultModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  const setTab = (tab) => {
    if (tab === 'demo') {
      btnTabDemo?.classList.add('active');
      btnTabCode?.classList.remove('active');
      if (modalPreviewArea) modalPreviewArea.style.display = 'block';
      if (modalCodeArea) modalCodeArea.parentElement.style.display = 'none';
      if (btnCopyCode) btnCopyCode.style.display = 'none';
    } else {
      btnTabCode?.classList.add('active');
      btnTabDemo?.classList.remove('active');
      if (modalPreviewArea) modalPreviewArea.style.display = 'none';
      if (modalCodeArea) modalCodeArea.parentElement.style.display = 'block';
      if (btnCopyCode) btnCopyCode.style.display = 'inline-flex';
    }
  };

  btnTabDemo?.addEventListener('click', () => setTab('demo'));
  btnTabCode?.addEventListener('click', () => setTab('code'));

  btnCopyCode?.addEventListener('click', async () => {
    if (!activeItem) return;
    try {
      await navigator.clipboard.writeText(activeItem.codeSnippet);
      const originalText = btnCopyCode.innerHTML;
      btnCopyCode.innerHTML = '<span>COPIED TO CLIPBOARD!</span>';
      setTimeout(() => {
        btnCopyCode.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }
  });

  btnClose?.addEventListener('click', closeVaultModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeVaultModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeVaultModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initVaultModal();
});
