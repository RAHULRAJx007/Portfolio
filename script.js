// ===================================
// Portfolio — Premium JS (Dev × AI Theme)
// ===================================

'use strict';

// ── Utils ──
const throttle = (fn, ms = 100) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
};

// ── DOM Cache ──
const $  = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ===================================
// Loading Bar (scroll progress)
// ===================================
const loadingBar = document.createElement('div');
loadingBar.id = 'loading-bar';
document.body.prepend(loadingBar);

window.addEventListener('scroll', throttle(() => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - innerHeight) * 100;
  loadingBar.style.width = pct + '%';
}, 60), { passive: true });

// ===================================
// Cursor Glow
// ===================================
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ===================================
// Hero Noise Overlay
// ===================================
const hero = document.querySelector('.hero');
if (hero) {
  const noise = document.createElement('div');
  noise.className = 'hero-noise';
  hero.appendChild(noise);
}

// ===================================
// Particles Canvas
// ===================================
(function initParticles() {
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const resize = () => { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; };
  resize();
  window.addEventListener('resize', throttle(resize, 200), { passive: true });

  const COUNT = 70;
  const COLORS = ['255,36,66', '25,167,255'];
  const pts = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.4,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    o: Math.random() * 0.45 + 0.08,
    c: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));

  // Draw connecting lines between nearby particles
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${pts[i].c},${(1 - dist / 100) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},${p.o})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  };
  draw();
})();

// ===================================
// Typed / Blinking Subtitle
// ===================================
(function initTyped() {
  const el = document.querySelector('.hero-subtitle');
  if (!el) return;
  const base = 'Java Full Stack Developer';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.textContent = '';
  el.appendChild(document.createTextNode(base));
  el.appendChild(cursor);
})();

// ===================================
// Navigation Logic
// ===================================
const navbar    = $('navbar');
const hamburger = $('hamburger');
const navMenu   = $('nav-menu');
const navLinks  = $$('.nav-link');

const closeMobileMenu = () => {
  hamburger?.classList.remove('active');
  navMenu?.classList.remove('active');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

hamburger?.addEventListener('click', () => {
  const on = hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', String(on));
  document.body.style.overflow = on ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id?.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        window.scrollTo({ top: target.offsetTop - (navbar?.offsetHeight || 70), behavior: 'smooth' });
      }
      closeMobileMenu();
    }
  });
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

// ===================================
// Scroll: Navbar + Back-to-Top
// ===================================
const scrollTopBtn = $('scrollTop');

window.addEventListener('scroll', throttle(() => {
  const s = window.scrollY;
  navbar?.classList.toggle('scrolled', s > 50);
  scrollTopBtn?.classList.toggle('visible', s > 320);
}, 80), { passive: true });

scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===================================
// Active Nav Link (IntersectionObserver)
// ===================================
(function trackActiveSection() {
  const sections = $$('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-link[href="#${en.target.id}"]`)?.classList.add('active');
      }
    });
  }, { rootMargin: '-38% 0px -57% 0px' });
  sections.forEach(s => obs.observe(s));
})();

// ===================================
// Scroll Reveal (IntersectionObserver)
// ===================================
const revealOpts = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.style.opacity  = '1';
      en.target.style.transform = 'translateY(0) translateX(0)';
      revealObs.unobserve(en.target);
    }
  });
}, revealOpts);

const revealSelectors = '.service-card, .project-card, .about-content, .contact-item, .certificate-card, .about-image-wrapper, .about-stats .stat, .resume-preview';

document.querySelectorAll(revealSelectors).forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = `opacity .65s ${i * 0.04}s cubic-bezier(0.4,0,0.2,1), transform .65s ${i * 0.04}s cubic-bezier(0.4,0,0.2,1)`;
  revealObs.observe(el);
});

// ===================================
// Project Number Badges
// ===================================
$$('.project-card').forEach((card, i) => {
  const badge = document.createElement('span');
  badge.className = 'project-num-badge';
  badge.textContent = String(i + 1).padStart(2, '0');
  card.appendChild(badge);
});

// ===================================
// Footer Year
// ===================================
const yearEl = $('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===================================
// Lightbox — unified (projects + certificates)
// ===================================
(function initLightbox() {
  const lightbox = $('lightbox');
  const backdrop = $('lightbox-backdrop');
  const img      = $('lightbox-img');
  const loader   = $('lightbox-loader');
  const caption  = $('lightbox-caption');
  const counter  = $('lightbox-counter');
  const closeBtn = $('lightbox-close');
  const prevBtn  = $('lightbox-prev');
  const nextBtn  = $('lightbox-next');
  if (!lightbox || !img) return;

  let triggers = [];
  let idx = 0;

  const collect = () => { triggers = Array.from($$('.lightbox-trigger')); };

  const load = (i) => {
    const t = triggers[i];
    if (!t) return;
    loader?.classList.add('visible');
    img.style.opacity = '0';
    const src = t.getAttribute('src') || t.src;
    const alt = t.getAttribute('alt') || '';
    img.onload  = () => { loader?.classList.remove('visible'); img.style.opacity = '1'; };
    img.onerror = () => loader?.classList.remove('visible');
    img.src = src; img.alt = alt;
    caption.textContent = t.getAttribute('data-caption') || alt;
    counter.textContent = triggers.length > 1 ? `${i + 1} / ${triggers.length}` : '';
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === triggers.length - 1;
  };

  const open = (i) => {
    collect();
    idx = Math.max(0, Math.min(i, triggers.length - 1));
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    load(idx);
  };
  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  };
  const prev = () => { if (idx > 0) load(--idx); };
  const next = () => { if (idx < triggers.length - 1) load(++idx); };

  // Click via capture (fires before other handlers)
  document.addEventListener('click', e => {
    const t = e.target.closest('.lightbox-trigger');
    if (t) {
      e.preventDefault(); e.stopPropagation();
      collect();
      open(triggers.indexOf(t));
    }
  }, true);

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch swipe
  let sx = 0;
  lightbox.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = sx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) diff > 0 ? next() : prev();
  });

  // Cursor hint
  collect();
  triggers.forEach(el => { el.style.cursor = 'zoom-in'; });
})();

// ===================================
// Certificates — bind "View Certificate" buttons
// ===================================
(function initCertButtons() {
  const certCards = $$('.certificate-card');
  let certSources = [];

  const collectCerts = () => {
    certSources = Array.from(certCards).map(card => ({
      img:    card.querySelector('.certificate-image'),
      title:  card.querySelector('.certificate-content h3')?.textContent || '',
    }));
  };
  collectCerts();

  $$('.certificate-view-btn').forEach((btn, i) => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const imgEl = certCards[i]?.querySelector('.certificate-image');
      if (imgEl) {
        // Trigger the lightbox via click on the image
        imgEl.classList.add('lightbox-trigger');
        imgEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });
  });
})();

console.log('%c Rahul Raj Portfolio ✓ Dev × AI Theme', 'color:#ff2442;font-weight:bold;font-size:12px;');