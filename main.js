/**
 * CYBO Personal Website - Interactive JavaScript
 * Handles splash screen, animations, parallax, and interactivity
 */

// ========================================================================
// SPLASH SCREEN LOGIC
// ========================================================================
const splash = document.getElementById('mobile-splash');
const wrapper = document.getElementById('main-wrapper');
const continueBtn = document.getElementById('splash-continue');
const body = document.body;

// Check if mobile device view
const isMobile = window.innerWidth < 768;

if (isMobile) {
    body.classList.add('mobile-splash-active');
}

continueBtn.addEventListener('click', () => {
    splash.style.transition = 'opacity 1s ease, transform 1s ease';
    splash.style.opacity = '0';
    splash.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        splash.style.display = 'none';
        wrapper.style.opacity = '1';
        body.classList.remove('mobile-splash-active');
    }, 1000);
});

// ========================================================================
// REVEAL ANIMATIONS (Intersection Observer)
// ========================================================================
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
    observer.observe(section);
});

// ========================================================================
// PARALLAX EFFECT (DESKTOP ONLY)
// ========================================================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Hero Image Parallax
    const heroImage = document.querySelector('.group img');
    if (heroImage && !isMobile) {
        heroImage.style.transform = `scale(1.05) translateY(${scrolled * 0.05}px)`;
    }

    // Back to top button visibility
    const backToTop = document.getElementById('back-to-top');
    if (scrolled > 500) {
        backToTop.classList.add('opacity-100', 'pointer-events-auto');
        backToTop.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        backToTop.classList.add('opacity-0', 'pointer-events-none');
        backToTop.classList.remove('opacity-100', 'pointer-events-auto');
    }
});

// ========================================================================
// BACK TO TOP ACTION
// ========================================================================
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================================================
// CYBO EASTER EGG
// ========================================================================
let keys = [];
document.addEventListener('keydown', (e) => {
    keys.push(e.key.toLowerCase());
    if (keys.length > 4) keys.shift();
    if (keys.join('') === 'cybo') {
        document.body.style.filter = 'hue-rotate(90deg)';
        setTimeout(() => document.body.style.filter = 'none', 2000);
    }
});
