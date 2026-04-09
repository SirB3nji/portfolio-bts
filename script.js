// ─── SIDEBAR TOGGLE ───────────────────────────────────
const sidebar = document.querySelector('.sidebar');
const hamburger = document.querySelector('.hamburger');
const overlay = document.querySelector('.overlay');

hamburger?.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
});
overlay?.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

// ─── SKILL BARS ANIMATION ─────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width;
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-fill').forEach(fill => observer.observe(fill));

// ─── LOCAL PHOTO FRAMES ───────────────────────────────
// Toutes les frames démarrent avec la classe "empty" dans le HTML.
// Quand l'image se charge bien → on retire "empty" → l'image s'affiche.
// Quand l'image est absente/introuvable → on garde "empty" → le placeholder s'affiche.

function initFrame(frame) {
  const img = frame.querySelector('img');
  if (!img || !img.src || img.src === window.location.href) {
    frame.classList.add('empty');
    return;
  }

  function onLoad() {
    if (img.naturalWidth > 0) {
      frame.classList.remove('empty');
    } else {
      frame.classList.add('empty');
    }
  }

  function onError() {
    frame.classList.add('empty');
  }

  // Image déjà chargée avant que le script tourne
  if (img.complete) {
    onLoad();
    return;
  }

  img.addEventListener('load', onLoad);
  img.addEventListener('error', onError);
}

document.querySelectorAll('.photo-frame, .tp-photo-frame').forEach(initFrame);

// ─── LIGHTBOX ─────────────────────────────────────────
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lb-backdrop"></div>
  <button id="lb-close">✕</button>
  <img id="lb-img" src="" alt="">
`;
document.body.appendChild(lightbox);

const lbImg = document.getElementById('lb-img');

function openLightbox(src, alt) {
  lbImg.src = src;
  lbImg.alt = alt || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}

document.getElementById('lb-backdrop').addEventListener('click', closeLightbox);
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Attach click to all loaded photo frames
function attachLightboxToFrames() {
  document.querySelectorAll('.photo-frame:not(.empty) img, .tp-photo-frame:not(.empty) img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
}

// Re-run after frames are initialized (slight delay to let initFrame run first)
setTimeout(attachLightboxToFrames, 200);

// Also attach whenever a frame becomes non-empty (MutationObserver)
const lbObserver = new MutationObserver(() => attachLightboxToFrames());
document.querySelectorAll('.photo-frame, .tp-photo-frame').forEach(frame => {
  lbObserver.observe(frame, { attributes: true, attributeFilter: ['class'] });
});
