// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Footer year
document.getElementById('year')?.appendChild(document.createTextNode(new Date().getFullYear()));

// Lightbox for menu images
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

function openLightbox(src, alt, caption) {
  if (!lightbox) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
});

// Attach click handlers to menu images/cards
document.querySelectorAll('.menu-card .menu-img').forEach(img => {
  img.addEventListener('click', () => {
    const card = img.closest('.menu-card');
    const name = card?.dataset?.name || img.alt || '';
    openLightbox(img.src, img.alt, name);
  });
});

