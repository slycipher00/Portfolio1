/* ============================================================
   MOHAMMED MUNEER — CYBERSECURITY PORTFOLIO
   script.js  |  One-Page Scrollable Version
   ============================================================
   UPDATE GUIDE:
   - MEDIUM_USERNAME: change to your Medium handle (no @)
   - TYPEWRITER_ROLES: add/remove the roles in the animation
   ============================================================ */

// ── MEDIUM RSS CONFIG ──────────────────────────────────────
// UPDATE: Replace with your Medium username (without @)
const MEDIUM_USERNAME = 'm.munr44';

// ── TYPEWRITER ROLES ───────────────────────────────────────
// UPDATE: Add/remove roles to match what you do
const TYPEWRITER_ROLES = [
  'Security Analyst Level 3',
  'Detection Engineer',
  'Incident Responder',
  'Malware Analyst',
  'Cybersecurity Course Author',
];

// ── FOOTER YEAR ────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── NAVBAR SCROLL EFFECT ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightActiveNav();
});

// ── HAMBURGER MOBILE MENU ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── ACTIVE NAV HIGHLIGHTING ────────────────────────────────
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  let current    = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id;
    }
  });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ── TYPEWRITER ANIMATION ───────────────────────────────────
(function typewriter() {
  const el     = document.getElementById('typed');
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  function tick() {
    const role    = TYPEWRITER_ROLES[roleIdx];
    const current = deleting ? role.slice(0, charIdx - 1) : role.slice(0, charIdx + 1);
    el.textContent = current;

    if (!deleting && current === role) {
      // Pause at end before deleting
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

// ── SCROLL FADE-IN ANIMATIONS ──────────────────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── MEDIUM RSS FEED ────────────────────────────────────────
// Uses rss2json.com to convert Medium's RSS feed to JSON
// (free tier, no API key needed for low traffic)
async function loadMediumPosts() {
  const grid    = document.getElementById('blog-grid');
  const loading = document.getElementById('blog-loading');

  const RSS_URL  = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
  const API_URL  = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

  try {
    const res  = await fetch(API_URL);
    const data = await res.json();

    if (data.status !== 'ok' || !data.items?.length) throw new Error('No posts found');

    loading.style.display = 'none';

    // Show up to 6 most recent posts
    data.items.slice(0, 6).forEach(post => {
      const date    = new Date(post.pubDate).toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' });
      // Strip HTML tags from description for excerpt
      const excerpt = post.description.replace(/<[^>]+>/g, '').slice(0, 160).trim() + '…';

      const card = document.createElement('a');
      card.className  = 'blog-card';
      card.href       = post.link;
      card.target     = '_blank';
      card.rel        = 'noopener noreferrer';
      card.innerHTML  = `
        <div class="blog-date">${date}</div>
        <div class="blog-title">${post.title}</div>
        <div class="blog-excerpt">${excerpt}</div>
        <div class="blog-read-more">Read on Medium ↗</div>
      `;
      grid.appendChild(card);
    });

  } catch (err) {
    loading.textContent = '// Could not load posts — visit Medium directly.';
    // Fallback: show a static link to Medium profile
    const fallback = document.createElement('a');
    fallback.href  = `https://medium.com/@${MEDIUM_USERNAME}`;
    fallback.className = 'btn';
    fallback.target    = '_blank';
    fallback.textContent = 'View on Medium ↗';
    grid.appendChild(fallback);
    console.error('Medium RSS error:', err);
  }
}

// UTC clock for hero dashboard
function updateUtcClock() {
  const clock = document.getElementById("utc-clock");
  if (!clock) return;

  const now = new Date();
  clock.textContent = now.toISOString().slice(11, 19) + " UTC";
}

updateUtcClock();
setInterval(updateUtcClock, 1000);


loadMediumPosts();
