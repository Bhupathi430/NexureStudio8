/* ==========================================================================
   Nexure Studios - JavaScript Functionality (Ultra-Smooth & Ultra-Responsive)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* --- TOP SCROLL PROGRESS BAR --- */
    const scrollProgress = document.getElementById('scroll-progress');
    
    const updateScrollProgress = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && scrollProgress) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }
    };
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    /* --- MOBILE MENU TOGGLE WITH OVERLAY --- */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksList = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksList.classList.remove('active');
            });
        });
    }

    /* --- HEADER BACKGROUND SCROLL EFFECT --- */
    const navbar = document.getElementById('navbar');
    
    const handleNavbarScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* --- ULTRA-SMOOTH MOUSE PARALLAX (SILKY 60-120FPS LERP PHYSICS) --- */
    const bubble1 = document.querySelector('.bg-bubble-1');
    const bubble4 = document.querySelector('.bg-bubble-4');
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth) - 0.5;
        targetY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    const updateParallax = () => {
        // Exponential interpolation (lerp factor 0.05 for silky smooth motion)
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        
        if (bubble1) {
            bubble1.style.transform = `translate3d(${currentX * 65}px, ${currentY * 65}px, 0) scale(1.04)`;
        }
        if (bubble4) {
            bubble4.style.transform = `translate3d(${currentX * -45}px, ${currentY * -45}px, 0) scale(0.96)`;
        }
        
        requestAnimationFrame(updateParallax);
    };
    
    requestAnimationFrame(updateParallax);

    /* --- INTERSECTION OBSERVER FOR SCROLL REVEALS --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* --- SCROLLSPY ACTIVE MENU HIGHLIGHTS --- */
    const sections = document.querySelectorAll('section[id], header[id]');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy, { passive: true });
    scrollSpy();

    /* --- EDITABLE SITE DATA BINDING (Reads localStorage & site-data.js) --- */
    const statNumbers = document.querySelectorAll('.stat-number');

    const applySiteData = () => {
        let data = window.SITE_DATA || {};
        const saved = localStorage.getItem('NEXURE_SITE_DATA');
        if (saved) {
            try {
                data = JSON.parse(saved);
            } catch(e) {
                console.error('Error reading saved data:', e);
            }
        }
        
        // 1. Update Stats Numbers
        if (data.stats) {
            if (statNumbers[0] && data.stats.happyClients !== undefined) statNumbers[0].setAttribute('data-target', data.stats.happyClients);
            if (statNumbers[1] && data.stats.projectsCompleted !== undefined) statNumbers[1].setAttribute('data-target', data.stats.projectsCompleted);
            if (statNumbers[2] && data.stats.yearsExperience !== undefined) statNumbers[2].setAttribute('data-target', data.stats.yearsExperience);
            if (statNumbers[3] && data.stats.teamMembers !== undefined) statNumbers[3].setAttribute('data-target', data.stats.teamMembers);
        }
        
        // 2. Update Hero Text
        if (data.hero) {
            const heroBadge = document.getElementById('hero-badge-text');
            const heroDesc = document.getElementById('hero-desc-text');
            if (heroBadge && data.hero.badgePill) heroBadge.textContent = data.hero.badgePill;
            if (heroDesc && data.hero.description) heroDesc.textContent = data.hero.description;
        }

        // 3. Update Pricing Offer
        if (data.package) {
            const pkgTitle = document.getElementById('pkg-title');
            const pkgPrice = document.getElementById('pkg-price');
            const pkgSub = document.getElementById('pkg-sub');
            if (pkgTitle && data.package.title) pkgTitle.textContent = data.package.title;
            if (pkgPrice && data.package.price) pkgPrice.textContent = data.package.price;
            if (pkgSub && data.package.subtitle) pkgSub.textContent = data.package.subtitle;
        }
        
        // 4. Update Contact Email
        if (data.contact && data.contact.email) {
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => {
                link.setAttribute('href', `mailto:${data.contact.email}`);
                link.textContent = data.contact.email;
            });
        }
    };

    applySiteData();
    window.addEventListener('siteDataUpdated', applySiteData);

    /* --- STATISTICS COUNT-UP ANIMATION --- */
    let hasAnimatedStats = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1400;
            const startTime = performance.now();

            const updateNumber = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime >= duration) {
                    stat.textContent = target + '+';
                } else {
                    const progress = elapsedTime / duration;
                    const easeProgress = progress * (2 - progress);
                    const currentVal = Math.floor(easeProgress * target);
                    stat.textContent = currentVal + '+';
                    requestAnimationFrame(updateNumber);
                }
            };

            requestAnimationFrame(updateNumber);
        });
    };

    const statsSection = document.querySelector('.stats-container');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    animateStats();
                    hasAnimatedStats = true;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        statsObserver.observe(statsSection);
    }

    /* --- CONTACT FORM HANDLER --- */
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            console.log('--- Nexure Contact Form Submission ---');
            console.log(`Name: ${name}`);
            console.log(`Email: ${email}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);

            contactForm.style.transition = 'opacity 0.3s ease';
            contactForm.style.opacity = '0';
            
            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'flex';
                formSuccess.style.opacity = '0';
                formSuccess.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    formSuccess.style.opacity = '1';
                }, 50);
            }, 300);
        });
    }

    /* --- NEWSLETTER FORM HANDLER --- */
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm && newsletterSuccess) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            console.log(`Newsletter Subscription Email: ${emailInput.value}`);

            emailInput.value = '';
            newsletterSuccess.style.display = 'block';
            
            setTimeout(() => {
                newsletterSuccess.style.display = 'none';
            }, 4000);
        });
    }
});
