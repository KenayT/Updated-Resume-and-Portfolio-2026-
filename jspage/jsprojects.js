document.addEventListener("DOMContentLoaded", () => {
    const listItems = document.querySelectorAll('.project-list-item');
    const imageSlides = document.querySelectorAll('.project-image-slide');
    const placeholder = document.getElementById('img-placeholder');

    const modal = document.getElementById('project-modal');
    const closeModalBtns = [
        document.getElementById('close-modal-btn'),
        document.getElementById('modal-back-text')
    ];
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalRole = document.getElementById('modal-role');
    const modalDesc = document.getElementById('modal-desc');

    const projectData = {
        'paete-cms': {
            title: 'CMS Paete Landing Page',
            category: 'Agency Web Dev // BB88 Internship',
            role: 'My Role: Front-End & CMS Integration',
            img: 'img/project_me1.jpg',
            color: 'text-blue-500',
            desc: 'Integrated dynamic Content Management System (CMS) functionality into the client landing page architecture during my internship at BB 88 Advertising and Digital Solutions Inc. Collaborated in a three-developer team to ensure scalable content updates, cross-device UI consistency, and deployment readiness.'
        },
        'paete-hydration': {
            title: 'Paete Dynamic Page Hydration',
            category: 'ES6 JavaScript & Tailwind CSS // BB88',
            role: 'My Role: Front-End Architecture',
            img: 'img/project_me2.jpg',
            color: 'text-teal-400',
            desc: 'Refactored and converted a static Tailwind CSS codebase into a dynamic web application using modular ES6 JavaScript for seamless page hydration. Engineered interactive front-end state updates and responsive layouts to improve rendering speed and user accessibility.'
        },
        'green-future': {
            title: 'Asian Hackathon for Green Future',
            category: 'UI/UX & System Design',
            role: 'My Role: Lead UI/UX & Technical Research',
            img: 'img/project_me3.jpg',
            color: 'text-emerald-400',
            desc: 'Designed the high-fidelity UI and visual system for a sustainability-focused platform. Conducted target user research and defined core system requirements to align accessible interface flows with real-world environmental goals.'
        }
    };

    const listWrapper = document.getElementById('project-list-wrapper');
    let resetTimeout;

    listItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            clearTimeout(resetTimeout);
            const targetId = item.getAttribute('data-project');

            if (placeholder) placeholder.style.opacity = '0';
            imageSlides.forEach(slide => slide.classList.remove('is-active'));

            const activeImg = document.getElementById(`img-${targetId}`);
            if (activeImg) activeImg.classList.add('is-active');
        });

        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-project');
            const data = projectData[targetId];

            if (data) {
                modalImg.src = data.img;
                modalTitle.textContent = data.title;
                modalCategory.textContent = data.category;
                modalCategory.className = `font-mono text-xs tracking-widest uppercase mb-2 ${data.color}`;
                if (modalRole) modalRole.textContent = data.role;
                modalDesc.textContent = data.desc;

                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.add('is-open');
                }, 10);
            }
        });
    });

    if (listWrapper) {
        listWrapper.addEventListener('mouseleave', () => {
            resetTimeout = setTimeout(() => {
                imageSlides.forEach(slide => slide.classList.remove('is-active'));
                if (placeholder) placeholder.style.opacity = '1';
            }, 2000);
        });
    }

    closeModalBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                modal.classList.remove('is-open');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 500);
            });
        }
    });
});