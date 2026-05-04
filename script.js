document.addEventListener('DOMContentLoaded', () => {
    // Ensure scroll starts at top
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initial Lucide Icons
    lucide.createIcons();

    // Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cinematic Intro Sequence
    const introRotatingText = document.getElementById('intro-rotating-text');
    const titles = ["PYTHON", "ANGULAR JS", "FIGMA", "WEB DEV", "MARSHAL BORAD"];
    let titleIndex = 1;

    const changeTitle = () => {
        if (titleIndex < titles.length) {
            gsap.to(introRotatingText, {
                y: -50,
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    introRotatingText.textContent = titles[titleIndex];
                    gsap.fromTo(introRotatingText, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
                    titleIndex++;
                }
            });
        }
    };

    const introTl = gsap.timeline();

    // Rotate titles every 1.2s
    const titleInterval = setInterval(changeTitle, 1200);

    introTl.to('.intro-progress-bar', { width: '100%', duration: 6, ease: "none" })
        .add(() => clearInterval(titleInterval))
        .to('.intro-sequence', { y: -50, opacity: 0, duration: 0.5 })
        .to('.intro-overlay', { height: 0, duration: 1.2, ease: "expo.inOut" })
        .from('.hero-profile-img', { scale: 1.5, filter: 'blur(10px)', duration: 2, ease: "power4.out" }, "-=0.5")
        .from('.h-line span', { y: '110%', skewY: 7, duration: 1.5, stagger: 0.1, ease: "power4.out" }, "-=1.2")
        .from('.luxury-nav', { y: -100, opacity: 0, duration: 1 }, "-=1");

    // Clock Logic
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('clock').textContent = `${hrs}:${mins}:${secs}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Scroll Logic
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercent = Math.round((winScroll / height) * 100);
        document.querySelector('.scroll-status span').textContent = `${scrolledPercent}%`;

        // Nav Background Change
        const nav = document.querySelector('.luxury-nav');
        if (winScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Parallax & Reveal Effects
    gsap.to('.hero-bg-text', {
        scrollTrigger: {
            trigger: '#hero',
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: -200,
        opacity: 0
    });

    document.querySelectorAll('.reveal').forEach((el) => {
        gsap.fromTo(el,
            { y: 60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                },
                y: 0,
                opacity: 1,
                duration: 1.5,
                ease: "expo.out"
            }
        );
    });

    // Skill Bars Animation
    document.querySelectorAll('.skill-progress').forEach((bar) => {
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: "top 95%",
                toggleActions: "play none none none"
            },
            width: bar.getAttribute('data-progress'),
            duration: 2,
            ease: "power4.out"
        });
    });

    // Smooth reveal for work images
    document.querySelectorAll('.work-img-box img').forEach(img => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: "top 90%",
                scrub: 1
            },
            scale: 1.3
        });
    });

    // Magnetic & Tilt Interactions
    const brandLogo = document.querySelector('.brand-logo');
    const heroVisual = document.querySelector('.hero-image-wrapper');

    const magneticEffect = (el, strength = 0.5) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power2.out" });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
    };

    if (brandLogo) magneticEffect(brandLogo, 0.3);

    if (heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(heroVisual, {
                rotateY: x * 15,
                rotateX: -y * 15,
                x: x * 20,
                y: y * 20,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        heroVisual.addEventListener('mouseleave', () => {
            gsap.to(heroVisual, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // Toggle body scroll
            if (mobileMenu.classList.contains('active')) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                lenis.start();
            });
        });
    }

    // Custom Cursor Enhanced
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        });

        document.querySelectorAll('a, button, .hero-visual, .work-img-box').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }
});
