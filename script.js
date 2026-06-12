/* ==========================================================
   MOHAMMED MUNEER — SECURITY ENGINEERING PORTFOLIO

   This file intentionally contains behavior only.
   Edit page content in index.html and styling in style.css.
   ========================================================== */

'use strict';

document.documentElement.classList.add('js-enabled');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('#menu-button');
const navigation = document.querySelector('#site-nav');
const navLinks = [...document.querySelectorAll('#site-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const copyButton = document.querySelector('#copy-email');
const copyMessage = document.querySelector('#copy-message');
const yearElement = document.querySelector('#current-year');

// Current footer year.
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

// Add a subtle header border after scrolling.
const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Mobile navigation.
const closeMenu = () => {
  if (!menuButton || !navigation) return;

  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
};

menuButton?.addEventListener('click', () => {
  if (!navigation) return;

  const willOpen = !navigation.classList.contains('is-open');
  navigation.classList.toggle('is-open', willOpen);
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
});

// Close the mobile menu when Escape is pressed.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Highlight the navigation item for the section currently in view.
if ('IntersectionObserver' in window && sections.length > 0) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);

          if (isActive) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => activeSectionObserver.observe(section));
}

// Lightweight reveal animation. Disabled automatically for reduced motion.
const revealElements = [...document.querySelectorAll('.reveal')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

// Copy email address with a safe fallback for browsers without Clipboard API.
copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  if (!email) return;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }

    copyMessage.textContent = 'Email copied to clipboard.';
    copyButton.textContent = 'Copied';

    window.setTimeout(() => {
      copyMessage.textContent = '';
      copyButton.textContent = 'Copy email';
    }, 2400);
  } catch (error) {
    copyMessage.textContent = `Copy failed. Email: ${email}`;
    console.error('Unable to copy email:', error);
  }
});
