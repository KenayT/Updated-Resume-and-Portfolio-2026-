document.addEventListener("DOMContentLoaded", () => {
    
    // Elements
    const socialBtns = document.querySelectorAll('.social-icon-btn');
    const modal = document.getElementById('social-modal');
    const closeModalBtns = [document.getElementById('close-modal-btn'), document.getElementById('modal-back-text')];
    
    const modalBanner = document.getElementById('modal-banner');
    const modalIcon = document.getElementById('modal-icon');
    const modalBgIcon = document.getElementById('modal-bg-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalHandle = document.getElementById('modal-handle');
    const modalDesc = document.getElementById('modal-desc');
    const modalLink = document.getElementById('modal-link');
    const modalLinkText = document.getElementById('modal-link-text');

    // SVGs for the modal
    const svgs = {
        linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
        github: '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.151-1.11-1.46-1.11-1.46-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/>',
        instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>'
    };

    // Social Data
    const socialData = {
        'linkedin': {
            title: 'LinkedIn',
            handle: 'Connect with me professionally',
            desc: 'View my complete academic background, work history, and certifications. Let\'s connect and discuss future opportunities in web development and front-end architecture.',
            url: 'https://www.linkedin.com/in/kenneth-punsalan-599b6a255/?skipRedirect=true', 
            btnText: 'Go to my LinkedIn',
            gradient: 'from-[#004182] to-[#0a66c2]' // LinkedIn Blue colors
        },
        'github': {
            title: 'GitHub',
            handle: '@KenayT',
            desc: 'Dive into my code repositories. Here you can find the source code for the Electronic Portfolio, MonsoonAI, and my database architecture projects.',
            url: 'https://github.com/KenayT/',
            btnText: 'Go to my GitHub',
            gradient: 'from-gray-700 to-gray-900' // GitHub Dark colors
        },
        'instagram': {
            title: 'Instagram',
            handle: 'See my creative side',
            desc: 'Beyond the IDE. Follow along for updates on my fitness journey, game development interests, and daily life behind the screen.',
            url: 'https://www.instagram.com/kenkenayt/', 
            btnText: 'Go to my Instagram',
            gradient: 'from-[#f09433] via-[#dc2743] to-[#bc1888]' // IG gradient colors
        }
    };

    // Open Modal Logic
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.getAttribute('data-social');
            const data = socialData[platform];

            if (data) {
                // Set SVGs
                modalIcon.innerHTML = svgs[platform];
                modalBgIcon.innerHTML = svgs[platform];
                
                // Set Gradient
                modalBanner.className = `w-full md:w-1/2 h-64 md:h-auto rounded-xl flex items-center justify-center bg-gradient-to-br transition-all duration-500 relative overflow-hidden shadow-inner ${data.gradient}`;

                // Set Text Content
                modalTitle.textContent = data.title;
                modalHandle.textContent = data.handle;
                modalDesc.textContent = data.desc;
                modalLinkText.textContent = data.btnText;
                
                // Set the final redirect URL
                modalLink.href = data.url;

                // Open Modal smoothly
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.add('is-open');
                }, 10);
            }
        });
    });

    // Close Modal Logic
    closeModalBtns.forEach(btn => {
        if(btn) {
            btn.addEventListener('click', () => {
                modal.classList.remove('is-open');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 500);
            });
        }
    });
});