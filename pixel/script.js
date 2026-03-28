// script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Language & Localization ---
    const langToggleBtn = document.getElementById('lang-toggle');
    const currentLangSpan = document.getElementById('current-lang');
    
    // Get stored preference or default to 'ar'
    let currentLang = localStorage.getItem('pixel_lang') || 'ar';
    
    // Function to apply language change
    function applyLanguage(lang) {
        // Set HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update Button Text
        if(currentLangSpan) currentLangSpan.textContent = lang === 'ar' ? 'English' : 'العربية';
        
        // Translate all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Translate specific attributes like placeholders (if any) or seo tags
        const titleEl = document.querySelector('title');
        if(titleEl && translations[lang]['page_title']) {
            titleEl.textContent = translations[lang]['page_title'];
        }
        const descEl = document.querySelector('meta[name="description"]');
        if(descEl && translations[lang]['page_desc']) {
            descEl.setAttribute('content', translations[lang]['page_desc']);
        }
        
        // Re-trigger GSAP ScrollTriggers since layout/heights might change due to text lengths
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    }
    
    // Apply initial language
    applyLanguage(currentLang);
    
    // Toggle Event
    if(langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            localStorage.setItem('pixel_lang', currentLang);
            applyLanguage(currentLang);
        });
    }

    // --- 2. Theme (Dark/Light Mode) ---
    const themeBtnDesktop = document.getElementById('theme-toggle');
    const themeBtnMobile = document.getElementById('mobile-theme-toggle');
    
    let currentTheme = localStorage.getItem('pixel_theme') || 'dark';

    function applyTheme(theme) {
        if(theme === 'light') {
            document.documentElement.classList.add('light-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
        }
        const iconClasses = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'; // Wait, sun for indicating 'switch to light' or 'currently light'? Usually if light mode, show Moon icon to switch to dark. If dark mode, show Sun.
        // Actually, if it's light mode, we want a Moon icon to signify "Go Dark". 
        // If it's dark mode, we want a Sun icon to signify "Go Light".
        const iconForSwitch = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        if(themeBtnDesktop) themeBtnDesktop.innerHTML = `<i class="${iconForSwitch}"></i>`;
        if(themeBtnMobile) themeBtnMobile.innerHTML = `<i class="${iconForSwitch}"></i>`;
        
        // FIXED: Trigger GSAP recalculation cleanly since layout heights may shift marginally with font weight/pixel changes
        setTimeout(() => {
            if(window.ScrollTrigger) ScrollTrigger.refresh();
        }, 400);
    }

    applyTheme(currentTheme);

    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('pixel_theme', currentTheme);
        applyTheme(currentTheme);
    }

    if(themeBtnDesktop) themeBtnDesktop.addEventListener('click', toggleTheme);
    if(themeBtnMobile) themeBtnMobile.addEventListener('click', toggleTheme);


    // --- 3. Mobile Navigation ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    if(mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if(icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });

    // --- 4. Sticky Navbar ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 5. Update Copyright Year ---
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // --- 6. GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero Animations
    const tlHero = gsap.timeline();
    tlHero.from(".hero-title", {y: 50, opacity: 0, duration: 1, ease: "power3.out"})
          .from(".hero-subtitle", {y: 30, opacity: 0, duration: 0.8, ease: "power3.out"}, "-=0.6")
          .from(".hero-cta", {y: 30, opacity: 0, duration: 0.8, ease: "power3.out"}, "-=0.6")
          .from(".hero-stats .stat-item", {y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out"}, "-=0.4")
          .from(".main-hero-card", {scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)"}, "-=0.6")
          .from(".float-card-1", {x: 50, opacity: 0, duration: 0.8, ease: "power2.out"}, "-=0.5")
          .from(".float-card-2", {x: -50, opacity: 0, duration: 0.8, ease: "power2.out"}, "-=0.5");

    // Fade Up Elements
    const fadeUpElements = gsap.utils.toArray('.section-badge, .section-title, .section-desc, .feature-list li, .info-item, .contact-form');
    fadeUpElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 40, opacity: 0, duration: 0.8, ease: "power2.out", clearProps: "all"
        });
    });

    // Services Stagger
    gsap.from(".service-card", {
        scrollTrigger: { trigger: ".services-grid", start: "top 80%" },
        y: 50, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", clearProps: "all"
    });

    // Portfolio Stagger
    gsap.from(".portfolio-card", {
        scrollTrigger: { trigger: ".portfolio-grid", start: "top 80%" },
        y: 60, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", clearProps: "all"
    });

    // Pricing Stagger
    gsap.from(".pricing-card", {
        scrollTrigger: { trigger: ".pricing-grid", start: "top 80%" },
        scale: 0.9, y: 30, opacity: 0, duration: 0.6, stagger: 0.2, ease: "back.out(1.5)", clearProps: "all"
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter span');
    counters.forEach(counter => {
        const target = parseInt(counter.parentElement.getAttribute('data-target'));
        const parent = counter.parentElement;
        
        ScrollTrigger.create({
            trigger: parent,
            start: "top 90%",
            once: true,
            onEnter: () => {
                let current = { val: 0 };
                gsap.to(current, {
                    val: target,
                    duration: 2.5,
                    ease: "power2.out",
                    onUpdate: function() {
                        counter.textContent = Math.ceil(current.val);
                    }
                });
            }
        });
    });

    // --- 7. Contact Form Submission (EmailJS Implementation) ---
    // --- 7. Contact Form Submission (Formspree Integration) ---
    const form = document.getElementById('lead-form');
    const formAlert = document.getElementById('form-alert');
    if(form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const originalTextHTML = btn.innerHTML;
            
            // Validate basic
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if(!name || !email) {
                showAlert('form_invalid', 'alert-error');
                return;
            }
            
            // Loading State
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span data-i18n="form_sending">${translations[currentLang]['form_sending']}</span>`;
            btn.style.opacity = '0.8';
            btn.disabled = true;

            // Send via Web3Forms API
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let result = await response.json();
                if (response.status == 200) {
                    showAlert('form_success', 'alert-success');
                    form.reset();
                } else {
                    console.error(result);
                    showAlert('form_error', 'alert-error');
                }
            })
            .catch(error => {
                console.error(error);
                showAlert('form_error', 'alert-error');
            })
            .then(() => {
                resetBtn();
            });

            function resetBtn() {
                btn.innerHTML = originalTextHTML;
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        });
    }

    function showAlert(i18nKey, statusClass) {
        if(!formAlert) return;
        formAlert.className = `d-block rounded p-3 mb-4 text-sm font-bold border-l-4 ${statusClass}`;
        formAlert.setAttribute('data-i18n', i18nKey);
        formAlert.textContent = translations[currentLang][i18nKey];
        setTimeout(() => {
            formAlert.className = 'd-none';
        }, 5000);
    }
});
