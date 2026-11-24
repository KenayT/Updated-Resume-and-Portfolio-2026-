document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. CORE VARIABLES & MOUSE TRACKING
    // ==========================================
    const dot = document.getElementById("cursor-dot");
    const outline = document.getElementById("cursor-outline");
    const titleContainer = document.getElementById("title-container");
    const titleSolid = document.getElementById("title-solid");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isWaterActive = true;
    const ripples = [];
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    const MAX_RIPPLE_AGE = 50;
    let maskX = mouseX;
    let maskY = mouseY;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (dot) {
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        }
    });

    const interactables = document.querySelectorAll('a, button, input, textarea');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => outline?.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => outline?.classList.remove('cursor-hover'));
    });

    // ==========================================
    // 2. CANVAS SETUP & FLUID MATH
    // ==========================================
    const warpCanvas = document.getElementById('warp-grid');
    const warpCtx = warpCanvas ? warpCanvas.getContext('2d') : null;
    const lightCanvas = document.getElementById('lightshow');
    const lightCtx = lightCanvas ? lightCanvas.getContext('2d') : null;

    let canvasW, canvasH;
    const gridSpacing = 50;
    const lights = [];
    const colors = ['#3b82f6', '#10b981', '#ef4444', '#ffffff', '#a855f7'];

    function resizeCanvases() {
        canvasW = window.innerWidth;
        canvasH = window.innerHeight;
        if (warpCanvas) {
            warpCanvas.width = canvasW;
            warpCanvas.height = canvasH;
        }
        if (lightCanvas) {
            lightCanvas.width = canvasW * 1.1;
            lightCanvas.height = canvasH * 1.1;
        }
    }

    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    class LightRay {
        constructor() { this.reset(); }
        reset() {
            this.isHorizontal = Math.random() > 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.length = Math.random() * 100 + 50;
            this.speed = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.1;

            if (this.isHorizontal) {
                this.y = Math.floor((Math.random() * (canvasH * 1.1)) / gridSpacing) * gridSpacing;
                this.x = -this.length;
            } else {
                this.x = Math.floor((Math.random() * (canvasW * 1.1)) / gridSpacing) * gridSpacing;
                this.y = -this.length;
            }
        }
        update() {
            if (this.isHorizontal) {
                this.x += this.speed;
                if (this.x > canvasW * 1.1) this.reset();
            } else {
                this.y += this.speed;
                if (this.y > canvasH * 1.1) this.reset();
            }
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.globalAlpha = this.opacity;
            ctx.lineWidth = 1;
            let grad;
            if (this.isHorizontal) {
                grad = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y);
                grad.addColorStop(0, this.color);
                grad.addColorStop(1, 'transparent');
                ctx.strokeStyle = grad;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.length, this.y);
            } else {
                grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.length);
                grad.addColorStop(0, this.color);
                grad.addColorStop(1, 'transparent');
                ctx.strokeStyle = grad;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y - this.length);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    if (lightCtx) {
        for (let i = 0; i < 20; i++) lights.push(new LightRay());
    }

    function getWarpedPoint(x, y) {
        if (!isWaterActive) return { x, y };
        let pushX = 0;
        let pushY = 0;
        for (let i = 0; i < ripples.length; i++) {
            const r = ripples[i];
            const dx = x - r.x;
            const dy = y - r.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const currentRadius = r.age * 3.5;
            const distanceToWave = dist - currentRadius;
            const waveWidth = 35;

            if (Math.abs(distanceToWave) < waveWidth && dist > 0) {
                const force = Math.sin((distanceToWave / waveWidth) * Math.PI);
                const decay = 1 - (r.age / MAX_RIPPLE_AGE);
                const mag = force * decay * 4;
                pushX += (dx / dist) * mag;
                pushY += (dy / dist) * mag;
            }
        }
        return { x: x + pushX, y: y + pushY };
    }

    // ==========================================
    // 3. MASTER RENDER LOOP & TOGGLES
    // ==========================================
    let outlineX = mouseX;
    let outlineY = mouseY;

    function animateAll() {
        if (outline) {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            outline.style.left = `${outlineX}px`;
            outline.style.top = `${outlineY}px`;
        }

        if (isWaterActive) {
            const distMoved = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2));
            if (distMoved > 30) {
                ripples.push({ x: mouseX, y: mouseY, age: 0 });
                lastMouseX = mouseX;
                lastMouseY = mouseY;
            }
            for (let i = ripples.length - 1; i >= 0; i--) {
                ripples[i].age++;
                if (ripples[i].age > MAX_RIPPLE_AGE) {
                    ripples.splice(i, 1);
                }
            }
        }

        maskX += (mouseX - maskX) * 0.08;
        maskY += (mouseY - maskY) * 0.08;
        if (titleContainer && titleSolid) {
            const rect = titleContainer.getBoundingClientRect();
            titleSolid.style.setProperty('--title-x', `${maskX - rect.left}px`);
            titleSolid.style.setProperty('--title-y', `${maskY - rect.top}px`);
        }

        if (warpCtx) {
            warpCtx.clearRect(0, 0, canvasW, canvasH);
            const isDark = document.documentElement.classList.contains('dark');
            warpCtx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(20, 83, 45, 0.35)';
            warpCtx.lineWidth = 1;
            warpCtx.beginPath();

            const resolution = 15;
            for (let x = 0; x <= canvasW + gridSpacing; x += gridSpacing) {
                warpCtx.moveTo(getWarpedPoint(x, 0).x, getWarpedPoint(x, 0).y);
                for (let y = 0; y <= canvasH + gridSpacing; y += resolution) {
                    const p = getWarpedPoint(x, y);
                    warpCtx.lineTo(p.x, p.y);
                }
            }
            for (let y = 0; y <= canvasH + gridSpacing; y += gridSpacing) {
                warpCtx.moveTo(getWarpedPoint(0, y).x, getWarpedPoint(0, y).y);
                for (let x = 0; x <= canvasW + gridSpacing; x += resolution) {
                    const p = getWarpedPoint(x, y);
                    warpCtx.lineTo(p.x, p.y);
                }
            }
            warpCtx.stroke();
        }

        if (lightCtx) {
            lightCtx.clearRect(0, 0, canvasW * 1.1, canvasH * 1.1);
            lights.forEach(light => {
                light.update();
                light.draw(lightCtx);
            });
        }

        requestAnimationFrame(animateAll);
    }

    animateAll();

    // Water Physics Toggle
    const waterBtn = document.getElementById('water-toggle');
    if (waterBtn) {
        waterBtn.addEventListener('click', () => {
            isWaterActive = !isWaterActive;
            if (isWaterActive) {
                waterBtn.classList.add('text-blue-500');
                waterBtn.classList.remove('text-gray-400', 'dark:text-gray-600');
            } else {
                waterBtn.classList.remove('text-blue-500');
                waterBtn.classList.add('text-gray-400', 'dark:text-gray-600');
                ripples.length = 0;
            }
        });
    }

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const htmlElement = document.documentElement;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            htmlElement.classList.toggle('dark');
            if (darkIcon) darkIcon.classList.toggle('hidden');
            if (lightIcon) lightIcon.classList.toggle('hidden');

            if (htmlElement.classList.contains('dark')) {
                localStorage.setItem('color-theme', 'dark');
            } else {
                localStorage.setItem('color-theme', 'light');
            }
        });
    }

    // Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOpenIcon = document.getElementById('mobile-menu-open-icon');
    const mobileMenuCloseIcon = document.getElementById('mobile-menu-close-icon');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenuOpenIcon) mobileMenuOpenIcon.classList.toggle('hidden');
            if (mobileMenuCloseIcon) mobileMenuCloseIcon.classList.toggle('hidden');
        });
    }

    // ==========================================
    // 4. EXPLORE PORTFOLIO HOVER LOGIC
    // ==========================================
    const exploreItems = document.querySelectorAll('.explore-item');
    const explorePanel = document.getElementById('explore-panel');
    const exploreTitle = document.getElementById('explore-title');
    const exploreDesc = document.getElementById('explore-desc');
    const exploreLink = document.getElementById('explore-link');

    const exploreContent = {
        'about': {
            title: 'The Developer',
            desc: 'Specializing in front-end architecture, crafting clean aesthetics and accessible, responsive UI/UX experiences.',
            link: 'Read Story'
        },
        'projects': {
            title: 'Digital Architecture',
            desc: 'From production CMS landing pages and ES6 hydration to interactive dashboards. See the logic in action.',
            link: 'View Work'
        },
        'resume': {
            title: 'The Credentials',
            desc: '4th-year BSIT Web Development student backed by a 486-hour agency front-end internship and 2026 technical certifications.',
            link: 'View Resume'
        },
        'socials': {
            title: 'Connect',
            desc: 'Let\'s collaborate on the next big project. Reach out through my professional networks.',
            link: 'Get in touch'
        }
    };

    exploreItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const target = item.getAttribute('data-target');
            const data = exploreContent[target];

            if (data && explorePanel) {
                explorePanel.style.opacity = '0';
                setTimeout(() => {
                    exploreTitle.textContent = data.title;
                    exploreDesc.textContent = data.desc;
                    exploreLink.innerHTML = `${data.link} &rarr;`;

                    exploreTitle.classList.add('text-blue-500');
                    explorePanel.style.opacity = '1';

                    setTimeout(() => {
                        exploreTitle.classList.remove('text-blue-500');
                    }, 300);
                }, 150);
            }
        });
    });

    // ==========================================
    // 5. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px 50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});