document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // RESUME PAGE SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.resume-reveal');

    const revealOptions = {
        threshold: 0.1, // Triggers when 10% of the element is in view
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve so the animation only happens once
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});