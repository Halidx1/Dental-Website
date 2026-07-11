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
// Hero Slider Otomatik Geçiş
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// ==========================================================================
// KATEGORİLİ VE CAROUSEL (KAYDIRMALI) OTOMATİK ÜRÜN OLUŞTURUCU
// ==========================================================================

function urunleriListele() {
    const anaKutu = document.getElementById('kategorize-urunler-alani');
    if (!anaKutu) return; // Sayfada bu kutu yoksa işlem yapma

    anaKutu.innerHTML = ""; // İçeriği temizle

    // 1. Ürünleri Kategorilerine Göre Grupla
    const kategoriler = {};
    for (const [urunId, urunDetayi] of Object.entries(urunVerileri)) {
        const katAdi = urunDetayi.kategori;
        if (!kategoriler[katAdi]) {
            kategoriler[katAdi] = []; // Kategori yoksa yeni liste aç
        }
        // Ürünü ilgili kategorinin listesine ekle
        kategoriler[katAdi].push({ id: urunId, ...urunDetayi });
    }

    // 2. Her Kategori İçin Ayrı Bir Carousel (Slider) Çiz
    for (const [kategoriAdi, urunlerListesi] of Object.entries(kategoriler)) {
        
        let kategoriHTML = `
        <div class="category-slider-section" style="margin-bottom: 70px;">
            <div class="section-title">
                <h2 style="font-size: 2.2rem; margin-bottom: 30px;">${kategoriAdi}</h2>
            </div>
            
            <div class="carousel-container">
                <button class="carousel-btn prev-btn">❮</button>
                <div class="carousel-track">
        `;

        // O kategoriye ait ürünleri kart olarak carousel'in içine diz
        urunlerListesi.forEach(urun => {
            const anaGorsel = Array.isArray(urun.gorseller) ? urun.gorseller[0] : urun.gorseller;
            
            kategoriHTML += `
                <div class="product-card">
                    <div class="product-img">
                        <img src="${anaGorsel}" alt="${urun.baslik}" style="width:100%; height:200px; object-fit:contain; padding:20px;">
                    </div>
                    <div class="product-info">
                        <h3 style="margin-bottom:15px; font-size:1.1rem; color:#2C3539;">${urun.baslik}</h3>
                        <a href="urun-detay.html?id=${urun.id}" class="btn-outline" style="display:inline-block; width:100%;">Detayları İncele</a>
                    </div>
                </div>
            `;
        });

        // Carousel'i kapat ve sağ ok tuşunu ekle
        kategoriHTML += `
                </div>
                <button class="carousel-btn next-btn">❯</button>
            </div>
        </div>
        `;

        anaKutu.innerHTML += kategoriHTML;
    }

    // 3. Sağ / Sol Kaydırma (Scroll) Butonlarını Aktifleştir
    document.querySelectorAll('.category-slider-section').forEach(section => {
        const track = section.querySelector('.carousel-track');
        const prevBtn = section.querySelector('.prev-btn');
        const nextBtn = section.querySelector('.next-btn');

        // Mobilde tek kart, masaüstünde kart genişliği kadar kaydırır (yaklaşık 350px)
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -350, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 350, behavior: 'smooth' });
        });
    });
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', urunleriListele);

// Sayfa yüklendiğinde bu otomasyonu çalıştır
document.addEventListener('DOMContentLoaded', urunleriListele);

// 5 Saniyede bir dönsün
setInterval(nextSlide, 5000);