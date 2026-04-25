// ===================================
// Utility Functions
// ===================================
const throttle = (func, limit = 100) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===================================
// DOM Elements Cache
// ===================================
const elements = {
    navbar: document.getElementById('navbar'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    scrollTopBtn: document.getElementById('scrollTop'),
    googleForm: document.getElementById('google-form'),
    yearSpan: document.getElementById('year'),
    animatedElements: document.querySelectorAll('.service-card, .about-content, .contact-item')
};

// ===================================
// Mobile Menu Logic
// ===================================
const toggleMobileMenu = () => {
    const isActive = elements.hamburger.classList.toggle('active');
    elements.navMenu.classList.toggle('active');
    elements.hamburger.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
};

const closeMobileMenu = () => {
    if (elements.hamburger.classList.contains('active')) {
        elements.hamburger.classList.remove('active');
        elements.navMenu.classList.remove('active');
        elements.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
};

// ===================================
// Scroll Effects (Navbar & Back to Top)
// ===================================
const handleScrollEffects = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    // Navbar background change
    if (currentScroll > 50) {
        elements.navbar?.classList.add('scrolled');
    } else {
        elements.navbar?.classList.remove('scrolled');
    }

    // Scroll to Top visibility
    if (currentScroll > 300) {
        elements.scrollTopBtn?.classList.add('visible');
    } else {
        elements.scrollTopBtn?.classList.remove('visible');
    }
}, 100);

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
const smoothScrollToSection = (e) => {
    const targetId = e.currentTarget.getAttribute('href');
    
    if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = elements.navbar ? elements.navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            closeMobileMenu();
        }
    }
};

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// ===================================
// Initialize Application
// ===================================
const init = () => {
    // 1. Set Copyright Year
    if (elements.yearSpan) {
        elements.yearSpan.textContent = new Date().getFullYear();
    }
    
    // 2. Setup Navigation Listeners
    if (elements.hamburger) {
        elements.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    elements.navLinks.forEach(link => {
        link.addEventListener('click', smoothScrollToSection);
    });
    
    window.addEventListener('scroll', handleScrollEffects);
    
    if (elements.scrollTopBtn) {
        elements.scrollTopBtn.addEventListener('click', scrollToTop);
    }

    // 3. FIXED Google Form Submission Handler
    // This triggers the success UI immediately to avoid iframe sync issues
    if (elements.googleForm) {
        elements.googleForm.addEventListener('submit', () => {
            const btn = document.getElementById('form-submit-btn');
            const msg = document.getElementById('success-msg');
            const form = elements.googleForm;

            // Show 'Sending' state immediately
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.7';

            // We use a small timeout to let the form data start its journey to the hidden iframe
            setTimeout(() => {
                // Update UI to 'Sent'
                btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                btn.style.backgroundColor = '#28a745'; // Success green
                btn.style.opacity = '1';

                if (msg) msg.style.display = 'block';

                // Reset the form fields
                form.reset();

                // Reset button back to original look after 5 seconds
                setTimeout(() => {
                    if (msg) msg.style.display = 'none';
                    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                    btn.style.backgroundColor = ''; // Reverts to CSS default (red)
                    btn.style.pointerEvents = 'auto';
                }, 5000);
            }, 800); 
        });
    }

    // 4. Initialize Scroll Animations
    elements.animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animateOnScroll.observe(el);
    });

    // 5. Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    console.log('Rahul Raj Portfolio initialized successfully');
};

// Run Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// ===================================
// PREMIUM UPGRADES
// ===================================

// ── Loading bar ──
const loadingBar = document.createElement('div');
loadingBar.id = 'loading-bar';
loadingBar.style.width = '0%';
document.body.prepend(loadingBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    loadingBar.style.width = progress + '%';
}, { passive: true });

// ── Cursor glow ──
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ── Particle canvas on hero ──
(function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    hero.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    const resize = () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COUNT = 60;
    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            o: Math.random() * 0.5 + 0.1
        });
    }

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 60, 60, ${p.o})`;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255,60,60,${0.08 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animFrameId = requestAnimationFrame(draw);
    };
    draw();
})();

// ── Typewriter effect on hero subtitle ──
(function typewriter() {
    const el = document.querySelector('.hero-subtitle');
    if (!el) return;
    const text = el.textContent.trim();
    el.textContent = '';
    el.style.borderRight = '2px solid #ff0000';
    let i = 0;
    const type = () => {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(type, 60);
        } else {
            // Blink cursor then remove
            setTimeout(() => { el.style.borderRight = 'none'; }, 2000);
        }
    };
    setTimeout(type, 800);
})();

// ── Active nav link on scroll ──
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => obs.observe(s));
})();

// ── Improved scroll reveal (fixes opacity stuck at 0 bug) ──
(function fixReveal() {
    const all = document.querySelectorAll('.project-card, .service-card, .contact-item, .about-content, .about-image-wrapper');
    
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    all.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        obs.observe(el);
    });
})();

// ── Add project number badges ──
(function addBadges() {
    document.querySelectorAll('.project-card').forEach((card, i) => {
        const badge = document.createElement('span');
        badge.className = 'project-num-badge';
        badge.textContent = String(i + 1).padStart(2, '0');
        card.style.position = 'relative';
        card.appendChild(badge);
    });
})();

// ── Noise texture on hero ──
(function addNoise() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const noise = document.createElement('div');
    noise.className = 'hero-noise';
    hero.appendChild(noise);
})();

console.log('Premium portfolio initialized ✓');


// ===================================
// LIGHTBOX — Full-screen image viewer
// ===================================
(function initLightbox() {
    const lightbox  = document.getElementById('lightbox');
    const backdrop  = document.getElementById('lightbox-backdrop');
    const img       = document.getElementById('lightbox-img');
    const loader    = document.getElementById('lightbox-loader');
    const caption   = document.getElementById('lightbox-caption');
    const counter   = document.getElementById('lightbox-counter');
    const closeBtn  = document.getElementById('lightbox-close');
    const prevBtn   = document.getElementById('lightbox-prev');
    const nextBtn   = document.getElementById('lightbox-next');

    if (!lightbox || !img) return;

    let triggers = [];
    let currentIndex = 0;

    // Collect triggers AFTER DOM is ready
    function collectTriggers() {
        triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
    }

    // ── Open ──
    function open(index) {
        collectTriggers();
        currentIndex = Math.max(0, Math.min(index, triggers.length - 1));
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        loadImage(currentIndex);
    }

    // ── Close ──
    function close() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        img.src = '';
    }

    // ── Load image ──
    function loadImage(index) {
        const trigger = triggers[index];
        if (!trigger) return;

        loader.classList.add('visible');
        img.style.opacity = '0';

        const src = trigger.getAttribute('src') || trigger.src;
        const alt = trigger.getAttribute('alt') || '';
        const cap = trigger.getAttribute('data-caption') || alt;

        img.onload = () => {
            loader.classList.remove('visible');
            img.style.opacity = '1';
        };
        img.onerror = () => loader.classList.remove('visible');
        img.src = src;
        img.alt = alt;

        caption.textContent = cap;
        counter.textContent = triggers.length > 1 ? `${index + 1} / ${triggers.length}` : '';

        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === triggers.length - 1;
    }

    function prev() { if (currentIndex > 0) loadImage(--currentIndex); }
    function next() { if (currentIndex < triggers.length - 1) loadImage(++currentIndex); }

    // ── Bind clicks using event delegation on document ──
    // This fires even if other overlays are present
    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('.lightbox-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            collectTriggers();
            const index = triggers.indexOf(trigger);
            open(index >= 0 ? index : 0);
        }
    }, true); // useCapture = true — fires before anything else

    // ── Controls ──
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop)  backdrop.addEventListener('click', close);
    if (prevBtn)   prevBtn.addEventListener('click', prev);
    if (nextBtn)   nextBtn.addEventListener('click', next);

    // ── Keyboard ──
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  prev();
        if (e.key === 'ArrowRight') next();
    });

    // ── Touch swipe on mobile ──
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });

    // Make cursor show zoom-in on all triggers
    collectTriggers();
    triggers.forEach(el => { el.style.cursor = 'zoom-in'; });
})();