// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Print functionality
    window.printCV = function() {
        window.print();
    };

    // Dark mode toggle
    function updateToggleIcon() {
        const icon = document.querySelector('.toggle-icon');
        if (icon) {
            icon.textContent = document.body.classList.contains('dark-mode') ? '\u2600\uFE0F' : '\uD83C\uDF19';
        }
    }

    window.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        updateToggleIcon();
    };

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateToggleIcon();

    // Scrollspy: highlight the TOC link for the section currently in view
    const tocLinks = document.querySelectorAll('.cv-toc__link');
    const sectionMap = new Map();
    tocLinks.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) sectionMap.set(target, link);
    });

    if (sectionMap.size && 'IntersectionObserver' in window) {
        const visible = new Set();
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            });
            // Pick the topmost visible section (smallest bounding-box top)
            let chosen = null;
            visible.forEach(el => {
                if (!chosen || el.getBoundingClientRect().top < chosen.getBoundingClientRect().top) {
                    chosen = el;
                }
            });
            tocLinks.forEach(l => l.classList.remove('is-active'));
            if (chosen && sectionMap.has(chosen)) sectionMap.get(chosen).classList.add('is-active');
        }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

        sectionMap.forEach((_, el) => observer.observe(el));
    }
});