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