document.addEventListener('DOMContentLoaded', () => {
    
    // --- MOBİL MENÜ (HAMBURGER) İŞLEVİ ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        const links = navLinks.querySelectorAll('a:not(.dropdown > a)');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- CAROUSEL (ÜRÜNLER) İŞLEVİ ---
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(container => {
        const track = container.querySelector('.carousel-track');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        
        if(!track || !prevBtn || !nextBtn) return;

        const getScrollAmount = () => {
            const card = track.querySelector('.product-card');
            return card ? card.offsetWidth + 30 : 350; 
        };

        const scrollLeft = () => {
            if (track.scrollLeft <= 0) {
                track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            }
        };

        const scrollRight = () => {
            if (Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 5) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            }
        };

        nextBtn.addEventListener('click', scrollRight);
        prevBtn.addEventListener('click', scrollLeft);

        // HIZLANDIRILMIŞ OTOMATİK KAYMA (2 Saniye)
        let autoPlay = setInterval(scrollRight, 2000);

        container.addEventListener('mouseenter', () => clearInterval(autoPlay));
        container.addEventListener('mouseleave', () => {
            clearInterval(autoPlay);
            autoPlay = setInterval(scrollRight, 2000);
        });

        track.addEventListener('scroll', () => {
            clearInterval(autoPlay);
            clearTimeout(track.scrollTimeout);
            track.scrollTimeout = setTimeout(() => {
                if(!container.matches(':hover')) autoPlay = setInterval(scrollRight, 2000);
            }, 3000);
        });
    });
});