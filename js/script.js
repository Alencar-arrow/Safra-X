const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    const closeMenu = () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!isExpanded));
        navMenu.classList.toggle('active', !isExpanded);
    });

    navMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            hamburger.focus();
        }
    });
}

const treeGrowth = document.querySelector('.tree-growth-section');

if (treeGrowth) {
    const treeSvg = treeGrowth.querySelector('.tree-growth');
    const treeSteps = Array.from(treeGrowth.querySelectorAll('.tree-growth-steps p'));
    const treeProgress = treeGrowth.querySelector('.tree-growth-progress');
    const treeStepCount = treeGrowth.querySelector('.tree-growth-step-count');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let treeFramePending = false;

    const progressBetween = (progress, start, end) => {
        const value = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        return value * value * (3 - 2 * value);
    };

    const updateTreeGrowth = () => {
        treeFramePending = false;
        const sectionProgress = reducedMotion
            ? 1
            : Math.max(0, Math.min(1,
                -treeGrowth.getBoundingClientRect().top /
                Math.max(1, treeGrowth.offsetHeight - window.innerHeight)
            ));

        const setScale = (selector, scale, axis = false) => {
            treeSvg.querySelector(selector).style.transform = axis
                ? `scaleY(${scale})`
                : `scale(${scale})`;
        };

        treeSvg.querySelector('.tree-seed').style.opacity =
            1 - progressBetween(sectionProgress, 0.12, 0.24);
        setScale('.tree-trunk', progressBetween(sectionProgress, 0.14, 0.5), true);
        setScale('.tree-canopy-top', progressBetween(sectionProgress, 0.38, 0.62));
        setScale('.tree-canopy-left', progressBetween(sectionProgress, 0.46, 0.7));
        setScale('.tree-canopy-right', progressBetween(sectionProgress, 0.52, 0.76));
        setScale('.tree-canopy-center', progressBetween(sectionProgress, 0.58, 0.82));

        treeSvg.querySelectorAll('.tree-forest').forEach((tree, index) => {
            tree.style.transform = `scale(${progressBetween(sectionProgress, 0.76 + index * 0.025, 0.98)})`;
        });

        const activeStep = Math.min(
            treeSteps.length - 1,
            Math.floor(sectionProgress * treeSteps.length)
        );

        treeProgress.setAttribute('aria-valuenow', String(Math.round(sectionProgress * 100)));
        treeProgress.firstElementChild.style.transform = `scaleX(${sectionProgress})`;
        treeStepCount.firstChild.textContent = `${String(activeStep + 1).padStart(2, '0')} `;

        treeSteps.forEach((step, index) => {
            step.classList.toggle('is-active', index === activeStep);
        });
    };

    const requestTreeUpdate = () => {
        if (!treeFramePending) {
            treeFramePending = true;
            window.requestAnimationFrame(updateTreeGrowth);
        }
    };

    window.addEventListener('scroll', requestTreeUpdate, { passive: true });
    window.addEventListener('resize', requestTreeUpdate);
    updateTreeGrowth();
}

const carousel = document.querySelector('.environment-carousel');

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    let activeSlide = 0;

    const showSlide = (index) => {
        const nextSlide = (index + slides.length) % slides.length;
        const current = slides[activeSlide];
        const next = slides[nextSlide];

        next.hidden = false;
        requestAnimationFrame(() => {
            current.classList.remove('is-active');
            next.classList.add('is-active');
        });
        window.setTimeout(() => {
            current.hidden = true;
        }, 1000);
        activeSlide = nextSlide;
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.setInterval(() => showSlide(activeSlide + 1), 4000);
    }
}