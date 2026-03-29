/* ================================================
   QLM MIDDLE EAST - Website JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Navigation ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.page');

    // Scroll effect on navbar
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // ---- Page Navigation (SPA) ----
    function navigateToPage(pageId, solutionId) {
        // Hide all pages
        pages.forEach(p => p.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });

        // Close mobile menu
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-trigger page hero animations
        setTimeout(() => {
            const pageHero = targetPage.querySelector('.page-hero, .hero');
            if (pageHero) {
                const animElements = pageHero.querySelectorAll('.animate-fade-in, .animate-fade-in-up');
                animElements.forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight; // trigger reflow
                    el.style.animation = '';
                });
            }

            // Re-observe scroll animations
            observeScrollElements();
        }, 100);

        // If a specific solution is targeted, expand it
        if (solutionId && pageId === 'solutions') {
            setTimeout(() => {
                const solutionCard = document.querySelector(`[data-solution-id="${solutionId}"]`);
                if (solutionCard) {
                    // Collapse all others
                    document.querySelectorAll('.solution-card').forEach(c => c.classList.remove('expanded'));
                    // Expand target
                    solutionCard.classList.add('expanded');
                    // Scroll to it
                    setTimeout(() => {
                        solutionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            }, 400);
        }

        // Update URL hash
        history.pushState(null, '', `#${pageId}`);
    }

    // Attach click handlers to all navigation links
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            const solutionId = link.dataset.solution;
            navigateToPage(pageId, solutionId);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1) || 'home';
        navigateToPage(hash);
    });

    // Load initial page from hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash && initialHash !== 'home') {
        navigateToPage(initialHash);
    }

    // ---- Solution Card Toggles ----
    document.querySelectorAll('.solution-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.solution-card');
            card.classList.toggle('expanded');
        });
    });

    // ---- Scroll Animations (Intersection Observer) ----
    let scrollObserver;

    function observeScrollElements() {
        if (scrollObserver) {
            scrollObserver.disconnect();
        }

        scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animate stat circles
                    if (entry.target.classList.contains('stat-card')) {
                        const circle = entry.target.querySelector('.stat-circle');
                        if (circle) {
                            circle.classList.add('animated');
                        }
                    }

                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        document.querySelectorAll('.scroll-animate').forEach(el => {
            // Reset visibility for re-observation
            if (!el.classList.contains('visible')) {
                scrollObserver.observe(el);
            }
        });
    }

    observeScrollElements();

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    const thankYouOverlay = document.getElementById('thankYouOverlay');
    const thankYouClose = document.getElementById('thankYouClose');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            fetch('/', {
                method: 'POST',
                body: new URLSearchParams(formData).toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(response => {
                if (!response.ok) throw new Error('Form submission failed');
            })
            .then(() => {
                // Track Google Ads conversion
                if (typeof gtag === 'function') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-17957861353/uiy6CL_Q2JEcEOnv_PJC',
                        'value': 1.0,
                        'currency': 'AED'
                    });
                }
                // Show thank you banner
                thankYouOverlay.classList.add('active');
                contactForm.reset();
            })
            .catch(() => {
                // Show banner even if offline (form data may still be queued)
                thankYouOverlay.classList.add('active');
                contactForm.reset();
            })
            .finally(() => {
                btn.innerHTML = `
                    Send Message
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                `;
                btn.disabled = false;
            });
        });
    }

    // Close thank you banner
    if (thankYouClose) {
        thankYouClose.addEventListener('click', () => {
            thankYouOverlay.classList.remove('active');
        });
    }

    // Close on overlay click (outside banner)
    if (thankYouOverlay) {
        thankYouOverlay.addEventListener('click', (e) => {
            if (e.target === thankYouOverlay) {
                thankYouOverlay.classList.remove('active');
            }
        });
    }

    // ---- Stat Circle Animation Setup ----
    document.querySelectorAll('.stat-circle').forEach(circle => {
        const percent = circle.dataset.percent;
        const fill = circle.querySelector('.stat-circle-fill');
        if (fill) {
            fill.style.setProperty('--percent', percent);
        }
    });

    // ---- Smooth anchor scrolling within same page ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.dataset.page) {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
});
