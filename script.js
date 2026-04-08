document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const navLinks = document.querySelectorAll(".nav-item");
    const navBar = document.querySelector("nav");
    const logoLink = document.querySelector(".logo");
    const lightbox = document.getElementById("lightbox");
    const lightboxContent = document.querySelector(".lightbox-content");
    const closeBtn = document.querySelector(".close-lightbox");
    
    let currentStep = 0;
    let isScrolling = false;

    setTimeout(() => navBar.classList.add("loaded"), 200);

    function goToStep(index) {
        if (index < 0 || index >= slides.length || isScrolling || lightbox.classList.contains("active")) return;
        isScrolling = true;
        currentStep = index;
        slides[index].scrollIntoView({ behavior: "smooth", block: "start" });

        const id = slides[index].getAttribute("id");
        logoLink.classList.toggle("active", index === 0);
        navLinks.forEach(nav => {
            if (!nav.classList.contains('logo')) {
                nav.classList.toggle("active", nav.getAttribute("href") === `#${id}`);
            }
        });
        setTimeout(() => isScrolling = false, 1400); 
    }

    // Lightbox Logic
    document.querySelectorAll(".project-box").forEach(box => {
        box.addEventListener("click", () => {
            const bgImage = window.getComputedStyle(box).backgroundImage;
            if (bgImage !== 'none') {
                lightboxContent.style.backgroundImage = bgImage;
                lightbox.classList.add("active");
            }
        });
    });

    const closeLightbox = () => lightbox.classList.remove("active");
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

    // Global Scroll
    window.addEventListener("wheel", (e) => {
        if (isScrolling || lightbox.classList.contains("active")) return;
        if (Math.abs(e.deltaY) > 40) {
            e.deltaY > 0 ? goToStep(currentStep + 1) : goToStep(currentStep - 1);
        }
    }, { passive: true });

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const id = link.getAttribute("href");
            const targetIndex = Array.from(slides).findIndex(s => `#${s.id}` === id);
            goToStep(targetIndex);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const revealEl = entry.target.querySelector(".reveal");
            if (entry.isIntersecting) {
                revealEl?.classList.add("active");
                const index = Array.from(slides).indexOf(entry.target);
                logoLink.classList.toggle("active", index === 0);
            } else {
                revealEl?.classList.remove("active");
            }
        });
    }, { threshold: 0.3 });

    slides.forEach(slide => observer.observe(slide));
});