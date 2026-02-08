// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function}
 */
const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {Number} limit - Limit in milliseconds
 * @returns {Function}
 */
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
    contactForm: document.getElementById('contact-form'),
    yearSpan: document.getElementById('year'),
    animatedElements: document.querySelectorAll('.service-card, .about-content, .contact-item')
};

// ===================================
// Mobile Menu Toggle
// ===================================
const toggleMobileMenu = () => {
    const isActive = elements.hamburger.classList.toggle('active');
    elements.navMenu.classList.toggle('active');
    elements.hamburger.setAttribute('aria-expanded', isActive);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
};

const closeMobileMenu = () => {
    elements.hamburger.classList.remove('active');
    elements.navMenu.classList.remove('active');
    elements.hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
};

// ===================================
// Navbar Scroll Effects
// ===================================
let lastScrollTop = 0;

const handleNavbarScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = currentScroll;
}, 100);

// ===================================
// Scroll to Top Button
// ===================================
const handleScrollTopVisibility = throttle(() => {
    if (window.pageYOffset > 300) {
        elements.scrollTopBtn.classList.add('visible');
    } else {
        elements.scrollTopBtn.classList.remove('visible');
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
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    
    if (targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = elements.navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
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
            // Unobserve after animation to improve performance
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// ===================================
// Form Submission Handler
// ===================================
const handleFormSubmit = async (e) => {
    const submitButton = elements.contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // If using Formspree or similar, the form will submit normally
    // This is just for UX feedback
    
    // Reset button after a delay (Formspree handles actual submission)
    setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    }, 1000);
};

// ===================================
// Typing Effect for Hero Subtitle (Optional)
// ===================================
const typeWriterEffect = () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let charIndex = 0;
    
    const type = () => {
        if (charIndex < text.length) {
            subtitle.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        }
    };
    
    // Start typing after a delay
    setTimeout(type, 500);
};

// ===================================
// Initialize Animated Elements
// ===================================
const initAnimations = () => {
    elements.animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animateOnScroll.observe(el);
    });
};

// ===================================
// Update Copyright Year
// ===================================
const updateCopyrightYear = () => {
    if (elements.yearSpan) {
        elements.yearSpan.textContent = new Date().getFullYear();
    }
};

// ===================================
// Keyboard Navigation Enhancement
// ===================================
const handleKeyboardNavigation = (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && elements.navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
};

// ===================================
// Event Listeners Setup
// ===================================
const setupEventListeners = () => {
    // Mobile menu toggle
    if (elements.hamburger) {
        elements.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking nav links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', smoothScrollToSection);
    });
    
    // Scroll events (debounced/throttled)
    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('scroll', handleScrollTopVisibility);
    
    // Scroll to top button
    if (elements.scrollTopBtn) {
        elements.scrollTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Form submission
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScrollToSection);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.navMenu.classList.contains('active') &&
            !elements.navMenu.contains(e.target) &&
            !elements.hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
};

// ===================================
// Performance Optimization
// ===================================
const optimizePerformance = () => {
    // Lazy load images (if browser doesn't support native lazy loading)
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// ===================================
// Initialize Application
// ===================================
const init = () => {
    // Update copyright year
    updateCopyrightYear();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Initialize animations
    initAnimations();
    
    // Optional: Typing effect
    // typeWriterEffect();
    
    // Performance optimizations
    optimizePerformance();
    
    // Log initialization (remove in production)
    console.log('Portfolio initialized successfully');
};

// ===================================
// DOMContentLoaded Event
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// Handle Page Visibility Changes
// ===================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause any animations or timers if needed
    } else {
        // Page is visible - resume animations if needed
    }
});

// ===================================
// Expose utility functions globally (optional)
// ===================================
window.portfolioUtils = {
    debounce,
    throttle,
    smoothScrollToSection
};