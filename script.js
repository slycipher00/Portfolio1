/* ============================================================
   MOHAMMED MUNEER — CYBERSECURITY PORTFOLIO
   script.js  |  Tabbed Version
   ============================================================
   UPDATE GUIDE:
   - MEDIUM_USERNAME: change to your Medium handle (no @)
   - TYPEWRITER_ROLES: add/remove the animated roles
   ============================================================ */

// ── MEDIUM RSS CONFIG ──────────────────────────────────────
// UPDATE: Replace with your Medium username (without @)
const MEDIUM_USERNAME = 'm.munr44';

// ── TYPEWRITER ROLES ───────────────────────────────────────
// UPDATE: Add/remove roles
const TYPEWRITER_ROLES = [
  'Security Analyst',
  'Cybersecurity Content Engineer',
  'Malware Analyst',
  'Incident Responder',
  'DFIR Practitioner',
];

// ── FOOTER YEAR ────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── TAB NAVIGATION ─────────────────────────────────────────
const navLinks    = document.querySelectorAll('.sidebar-nav a[data-tab]');
const tabPanels   = document.querySelectorAll('.tab-panel');
const breadcrumb  = document.getElementById('breadcrumb');

function switchTab(tabId) {
  // Hide all panels
  tabPanels.forEach(p => p.classList.remove('active'));
  // Deactivate all nav links
  navLinks.forEach(l => l.classList.remove('active'));

  // Show target panel
  const panel = document.getElementById(`tab-${tabId}`);
  if (panel) panel.classList.add('active');

  // Activate nav link
  const link = document.querySelector(`.sidebar-nav a[data-tab="${tabId}"]`);
  if (link) link.classList.add('active');

  // Update breadcrumb
  if (breadcrumb) breadcrumb.innerHTML = `<span>${tabId}</span>`;

  // Load Medium feed when blog tab is opened
  if (tabId === 'blog') loadMediumPosts();
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = link.getAttribute('data-tab');
    switchTab(tabId);
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
  });
});

// ── MOBILE SIDEBAR TOGGLE ──────────────────────────────────
const mobileBtn = document.getElementById('mobile-menu-btn');
const sidebar   = document.getElementById('sidebar');

if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 &&
      !sidebar.contains(e.target) &&
      e.target !== mobileBtn) {
    sidebar.classList.remove('open');
  }
});

// ── TYPEWRITER ANIMATION ───────────────────────────────────
(function typewriter() {
  const el     = document.getElementById('typed');
  if (!el) return;

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  function tick() {
    const role    = TYPEWRITER_ROLES[roleIdx];
    const current = deleting ? role.slice(0, charIdx - 1) : role.slice(0, charIdx + 1);
    el.textContent = current;

    if (!deleting && current === role) {
      setTimeout(() => { deleting = true; tick(); }, 2000);
      return;
    }

    if (deleting && current === '') {
      deleting = false;
      roleIdx  = (roleIdx + 1) % TYPEWRITER_ROLES.length;
      charIdx  = 0;
      setTimeout(tick, 300);
      return;
    }

    charIdx = deleting ? charIdx - 1 : charIdx + 1;
    setTimeout(tick, deleting ? 40 : 80);
  }

  tick();
})();

// ── MEDIUM RSS FEED ────────────────────────────────────────
let mediumLoaded = false;

async function loadMediumPosts() {
  if (mediumLoaded) return;
  mediumLoaded = true;

  const grid    = document.getElementById('blog-grid');
  const loading = document.getElementById('blog-loading');

  const RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

  try {
    const res  = await fetch(API_URL);
    const data = await res.json();

    if (data.status !== 'ok' || !data.items?.length) throw new Error('No posts found');

    if (loading) loading.style.display = 'none';

    data.items.slice(0, 6).forEach(post => {
      const date    = new Date(post.pubDate).toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' });
      const excerpt = post.description.replace(/<[^>]+>/g, '').slice(0, 160).trim() + '…';

      const card = document.createElement('a');
      card.className = 'blog-card';
      card.href      = post.link;
      card.target    = '_blank';
      card.rel       = 'noopener noreferrer';
      card.innerHTML = `
        <div class="blog-date">${date}</div>
        <div class="blog-title">${post.title}</div>
        <div class="blog-excerpt">${excerpt}</div>
        <div class="blog-read-more">Read on Medium ↗</div>
      `;
      grid.appendChild(card);
    });

  } catch (err) {
    if (loading) loading.textContent = '// Could not load posts — visit Medium directly.';
    const fallback = document.createElement('a');
    fallback.href       = `https://medium.com/@${MEDIUM_USERNAME}`;
    fallback.className  = 'btn';
    fallback.target     = '_blank';
    fallback.textContent = 'View on Medium ↗';
    if (grid) grid.appendChild(fallback);
    console.error('Medium RSS error:', err);
  }
}
