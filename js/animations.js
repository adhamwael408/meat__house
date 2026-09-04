/* ══════════════════════════════════════════════════
   MEAT HOUSE — Central Motion & Animation Engine
   ══════════════════════════════════════════════════ */

let scrollObserver = null;

/**
 * Initialize IntersectionObserver for all [data-reveal] elements.
 * Elements animate once when entering the viewport, without re-triggering.
 */
export function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  if (scrollObserver) {
    scrollObserver.disconnect();
  }

  scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay');
        if (delay) {
          const delayVal = isNaN(Number(delay)) ? delay : `${delay}ms`;
          el.style.transitionDelay = delayVal;
        }
        el.classList.add('revealed');
        observer.unobserve(el);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  revealElements.forEach(el => {
    if (!el.classList.contains('revealed')) {
      scrollObserver.observe(el);
    }
  });
}

/**
 * Re-run scroll reveal for dynamically injected content (e.g. filtered products)
 */
export function refreshScrollReveal() {
  setTimeout(() => {
    initScrollReveal();
  }, 30);
}

/**
 * Orchestrate the Hero section reveal sequence
 */
export function initHeroAnimation() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  const badge = hero.querySelector('.hero-badge');
  const title = hero.querySelector('.hero-title');
  const subtitle = hero.querySelector('.hero-subtitle');
  const features = hero.querySelector('.hero-features');
  const ctas = hero.querySelector('.hero-ctas');
  const showcase = hero.querySelector('.hero-showcase');
  const scrollIndicator = hero.querySelector('.hero-scroll-indicator');

  const elements = [
    { el: badge, delay: 100 },
    { el: title, delay: 250 },
    { el: subtitle, delay: 400 },
    { el: features, delay: 500 },
    { el: ctas, delay: 600 },
    { el: showcase, delay: 350 },
    { el: scrollIndicator, delay: 750 }
  ];

  elements.forEach(item => {
    if (item.el) {
      item.el.style.opacity = '0';
      item.el.style.transform = 'translateY(24px)';
      item.el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        item.el.style.opacity = '1';
        item.el.style.transform = 'translateY(0)';
      }, item.delay);
    }
  });
}

/**
 * Sticky Navbar Scroll State listener
 */
let navbarScrollInitialized = false;

export function initNavbarScroll() {
  if (navbarScrollInitialized) return;
  navbarScrollInitialized = true;

  const updateNavbar = () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    if (window.scrollY > 30) {
      nav.classList.add('navbar-scrolled');
    } else {
      nav.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/**
 * Smooth numeric counter animation for price transitions
 */
export function animatePrice(element, fromValue, toValue, duration = 350) {
  if (!element) return;

  const startVal = parseFloat(fromValue) || 0;
  const endVal = parseFloat(toValue) || 0;
  if (startVal === endVal) {
    element.textContent = `${endVal.toFixed(0)} ر.س`;
    return;
  }

  const startTime = performance.now();
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentVal = startVal + (endVal - startVal) * easeOutQuart(progress);

    element.textContent = `${currentVal.toFixed(0)} ر.س`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${endVal.toFixed(0)} ر.س`;
    }
  }

  requestAnimationFrame(update);
}

/**
 * Luxury Toast Notification
 */
export function showToast(message, type = 'success', duration = 2800) {
  let toastContainer = document.getElementById('appToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'appToastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === 'success' ? '✓' : 'ℹ'}
    </div>
    <div class="toast-message">${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, duration);
}

/**
 * Coordinated Add-To-Cart Micro-Interaction
 */
export function animateAddToCart(buttonEl, badgeSelector = '#cartCount') {
  if (!buttonEl) return;

  // 1. Button active feedback
  buttonEl.classList.add('btn-add-active');
  const originalText = buttonEl.innerHTML;
  buttonEl.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="display:inline-block; vertical-align:middle; margin-left:4px;">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>تمت الإضافة</span>
  `;

  // 2. Animate cart badge bounce
  const badge = document.querySelector(badgeSelector);
  if (badge) {
    badge.classList.remove('badge-bounce');
    // Force reflow
    void badge.offsetWidth;
    badge.classList.add('badge-bounce');
  }

  // 3. Reset button after brief interval
  setTimeout(() => {
    buttonEl.innerHTML = originalText;
    buttonEl.classList.remove('btn-add-active');
  }, 1200);
}

/**
 * Smooth Page Transition Handler
 */
export function initPageTransition(container, renderFn) {
  if (!container) {
    renderFn();
    return;
  }

  container.classList.add('page-transitioning-out');

  setTimeout(() => {
    renderFn();
    window.scrollTo({ top: 0, behavior: 'instant' });
    container.classList.remove('page-transitioning-out');
    container.classList.add('page-transitioning-in');

    // Initialize reveal animations on new DOM
    setTimeout(() => {
      initScrollReveal();
      initHeroAnimation();
      container.classList.remove('page-transitioning-in');
    }, 50);
  }, 200);
}
