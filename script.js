// --- MOBİL MENÜ (HAMBURGER) İŞLEVİ ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // "active" sınıfını ekleyip çıkararak menüyü aç/kapat
            navLinks.classList.toggle('active');
        });

        // Menüdeki bir linke tıklandığında menüyü otomatik kapat
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
// -------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    // Sayfadaki tüm slider'ları bul
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(container => {
        const track = container.querySelector('.carousel-track');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        
        if(!track || !prevBtn || !nextBtn) return;

        // Kartın genişliğini dinamik hesapla (30px gap css'ten geliyor)
        const getScrollAmount = () => {
            const card = track.querySelector('.product-card');
            return card ? card.offsetWidth + 30 : 350; 
        };

        // Sola Kaydırma Fonksiyonu
        const scrollLeft = () => {
            if (track.scrollLeft <= 0) {
                track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' }); // Başa döner
            } else {
                track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            }
        };

        // Sağa Kaydırma Fonksiyonu
        const scrollRight = () => {
            if (Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 5) {
                track.scrollTo({ left: 0, behavior: 'smooth' }); // Sona gelince başa sarar
            } else {
                track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            }
        };

        // Butonların Tıklanma Olayları (Kesin Çalışmasını Sağlayan Kısım)
        nextBtn.addEventListener('click', scrollRight);
        prevBtn.addEventListener('click', scrollLeft);

        // Otomatik kayma özelliği
        let autoPlay = setInterval(scrollRight, 3500);

        // Fare ile üstüne gelince otomatik kaymayı durdur
        container.addEventListener('mouseenter', () => {
            clearInterval(autoPlay);
        });

        // Fare çıkınca tekrar başlat
        container.addEventListener('mouseleave', () => {
            clearInterval(autoPlay);
            autoPlay = setInterval(scrollRight, 3500);
        });

        // Kullanıcı Trackpad ile manuel kaydırırken çakışmayı önle
        track.addEventListener('scroll', () => {
            clearInterval(autoPlay);
            clearTimeout(track.scrollTimeout);
            track.scrollTimeout = setTimeout(() => {
                if(!container.matches(':hover')) {
                    autoPlay = setInterval(scrollRight, 3500);
                }
            }, 3000);
        });
    });
});