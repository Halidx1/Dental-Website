// ============================================================
// MERKEZİ VERİ YÜKLEME (CMS TARAFINDAN YÖNETİLEN JSON DOSYALARI)
// ============================================================
// Ürün, marka, duyuru, iletişim ve kurumsal (teknik servis /
// avantajlar / istatistikler) verileri artık content/*.json
// dosyalarından okunuyor. Panel üzerinden yapılan her değişiklik
// bu dosyalara yazılır; sayfa yüklendiğinde en güncel veri
// buradan okunur.

let urunVerileri = {};
let markaVerileri = [];
let duyuruVerileri = [];
let iletisimVerileri = {};
let kurumsalVerileri = {};

// Sayfadaki her script (script.js'in kendisi ve urun-detay.html'in
// içindeki script) veriye ihtiyaç duyduğunda bu promise'i bekler.
window.veriYuklePromise = (async function verileriYukle() {
    try {
        const [urunRes, markaRes, duyuruRes, iletisimRes, kurumsalRes] = await Promise.all([
            fetch('content/urunler.json'),
            fetch('content/markalar.json'),
            fetch('content/duyurular.json'),
            fetch('content/iletisim.json'),
            fetch('content/kurumsal.json')
        ]);

        const urunData = urunRes.ok ? await urunRes.json() : { urunler: [] };
        const markaData = markaRes.ok ? await markaRes.json() : { markalar: [] };
        const duyuruData = duyuruRes.ok ? await duyuruRes.json() : { duyurular: [] };
        const iletisimData = iletisimRes.ok ? await iletisimRes.json() : {};
        const kurumsalData = kurumsalRes.ok ? await kurumsalRes.json() : {};

        // urunler.json bir DİZİ (array) formatındadır; mevcut kodun
        // tamamı ise { "urun-id": {...} } şeklinde bir OBJE bekliyor.
        // Geriye dönük uyumluluk için burada diziyi obje haline çeviriyoruz.
        urunVerileri = {};
        (urunData.urunler || []).forEach(urun => {
            const { id, ...detay } = urun;
            if (id) urunVerileri[id] = detay;
        });

        markaVerileri = markaData.markalar || [];
        duyuruVerileri = duyuruData.duyurular || [];
        iletisimVerileri = iletisimData || {};
        kurumsalVerileri = kurumsalData || {};

    } catch (err) {
        console.error("İçerik verileri (content/*.json) yüklenirken hata oluştu:", err);
    }
})();

// ============================================================
// İKON KÜTÜPHANESİ
// ============================================================
// Hem "Hakkımızda" bölümündeki kategori ikonları (isimden otomatik
// eşleştirilir) hem de Teknik Servis / Avantajlarımız bölümlerindeki
// panelden seçilebilir ikonlar burada tanımlanır. Basit, tek renkli
// çizgi ikonlardır; renk CSS üzerinden (currentColor) kontrol edilir.
const ICON_KUTUPHANESI = {
    dis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-2.8 0-5 1.8-5.8 4-1 2.7-.6 5.3.2 7.7.5 1.4 1 3.2 1.9 4.1.5.5 1 0 1.2-.6.4-1.1.6-2.7 1.2-2.7s.8 1.6 1.2 2.7c.2.6.7 1.1 1.2.6.9-.9 1.4-2.7 1.9-4.1.8-2.4 1.2-5 .2-7.7-.8-2.2-3-4-5.8-4z"/></svg>',
    olcu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6M10 2v6.5L4.6 18.8A2 2 0 006.4 22h11.2a2 2 0 001.8-3.2L14 8.5V2"/><path d="M7.5 15h9"/></svg>',
    klinik: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M8 9h3l1-2 2 4 1-2h1"/></svg>',
    laboratuvar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.3L4.7 19a2 2 0 001.7 3h11.2a2 2 0 001.7-3L14 9.3V2"/><path d="M9 2h6M7.5 14.5h9"/></svg>',
    implant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.5 3.5v3l-1.2 1.2v1.8l1.2 1.2v1.8l-1.2 1.2v1.8L12 22l-2.3-4.5v-1.8L8.5 14.5v-1.8l1.2-1.2v-1.8L8.5 8.5v-3z"/></svg>',
    elaletleri: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3l5 9M17 3l-5 9M12 12v9M9 21h6"/></svg>',
    sarf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6v3l2 2.5v12.5a2 2 0 01-2 2H9a2 2 0 01-2-2V7.5L9 5V2z"/><path d="M9 10.5h6"/></svg>',
    enstruman: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12L11 5.5l7.5 7.5L12 20.5z"/><path d="M14.5 5.5l3.8-3.8M18.3 9.3l2.7-2.7"/></svg>',
    deneyim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 3"/></svg>',
    anahtar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.8 2.8-2-2z"/></svg>',
    marka: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M8.3 12.7L6 21l6-3 6 3-2.3-8.3"/></svg>',
    sube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.8 7-11.5a7 7 0 10-14 0C5 14.2 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    kalite: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 3.5v6c0 5-3.3 7.8-7 9.5-3.7-1.7-7-4.5-7-9.5v-6z"/><path d="M9 12l2 2 4-4.5"/></svg>',
    musteri: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01"/></svg>',
    tespit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    bakim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M3 12h3M18 12h3M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1"/></svg>',
    destek: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.5c5-1.8 8.5-5.8 8.5-11V6l-8.5-3.5L3.5 6v4.5c0 5.2 3.5 9.2 8.5 11z"/><path d="M9 12l2 2 4-4.5"/></svg>'
};

// Kategori adına göre en uygun ikonu bulur (anahtar kelime eşleşmesi).
// Panelden eklenen yeni bir kategori bu listede yoksa "dis" ikonu
// otomatik olarak kullanılır, sistem hiçbir zaman kırılmaz.
function ikonBul(anahtarKelime) {
    return ICON_KUTUPHANESI[anahtarKelime] || ICON_KUTUPHANESI.dis;
}

function kategoriIkonuBul(kategoriAdi) {
    const ad = (kategoriAdi || '').toLocaleLowerCase('tr-TR');
    if (ad.includes('ölçü')) return ICON_KUTUPHANESI.olcu;
    if (ad.includes('implant')) return ICON_KUTUPHANESI.implant;
    if (ad.includes('laboratuvar')) return ICON_KUTUPHANESI.laboratuvar;
    if (ad.includes('el alet')) return ICON_KUTUPHANESI.elaletleri;
    if (ad.includes('enstrüman') || ad.includes('dinamik')) return ICON_KUTUPHANESI.enstruman;
    if (ad.includes('sarf')) return ICON_KUTUPHANESI.sarf;
    if (ad.includes('klinik')) return ICON_KUTUPHANESI.klinik;
    return ICON_KUTUPHANESI.dis;
}

document.addEventListener('DOMContentLoaded', async () => {

    // Önce content/*.json dosyalarının yüklenmesini bekliyoruz.
    await window.veriYuklePromise;

    if (typeof navigasyonUrunleriOlustur === 'function') {
        navigasyonUrunleriOlustur();
    }

    if (typeof anaSayfaCarouselOlustur === 'function') {
            anaSayfaCarouselOlustur();
    }

    if (typeof dinamikMarkalariOlustur === 'function') {
        dinamikMarkalariOlustur();
    }

    // Ürünleri Listele (Tüm Ürünler Sayfası İçin)
    if (typeof urunleriListele === 'function') {
        urunleriListele();
    }

    if (typeof footerKategorileriOlustur === 'function') {
        footerKategorileriOlustur();
    }

    // YENİ: Duyuruları Listele (Duyurular Sayfası İçin)
    if (typeof duyurulariOlustur === 'function') {
        duyurulariOlustur();
    }

    // YENİ: İletişim bilgilerini (footer, iletişim sayfası, CTA, WhatsApp) doldur
    if (typeof iletisimBilgileriniDoldur === 'function') {
        iletisimBilgileriniDoldur();
    }

    // YENİ: Hakkımızda bölümündeki kategori ikon ızgarası
    if (typeof kategoriGridOlustur === 'function') {
        kategoriGridOlustur();
    }

    // YENİ: Teknik Servis bölümü (Anasayfa, Hakkımızda'dan önce)
    if (typeof teknikServisOlustur === 'function') {
        teknikServisOlustur();
    }

    // YENİ: Avantajlarımız bölümü
    if (typeof avantajlarGridOlustur === 'function') {
        avantajlarGridOlustur();
    }

    // YENİ: İstatistikler bölümü
    if (typeof istatistiklerGridOlustur === 'function') {
        istatistiklerGridOlustur();
    }

    if (typeof netlifyFormGonder === 'function') {
        netlifyFormGonder();
    }


    // --- MOBİL MENÜ (HAMBURGER) İŞLEVİ ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Sadece normal linklere tıklandığında (dropdown OLMAYANLARA) menüyü kapat
        const links = navLinks.querySelectorAll('a:not(.dropdown > a, .dropdown-submenu > a)');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- MOBİLDE AÇILIR MENÜ (DROPDOWN) DOKUNMA KONTROLÜ ---
    const dropdowns = document.querySelectorAll('.dropdown, .dropdown-submenu');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', (e) => {
            // Sadece mobil ekranda (768px ve altı) çalışır
            if (window.innerWidth <= 768) {
                
                // Menü kapalıysa aç
                if (!dropdown.classList.contains('active')) {
                    e.preventDefault(); // Sayfa atlamasını/yenilenmesini KESİNLİKLE durdurur
                    
                    // Sadece aynı seviyedeki diğer açık menüleri kapat (Örn: Ürünler açıksa Hakkımızda'yı kapat)
                    // Ancak Ürünler içindeyken bir kategoriye basarsan Ürünler'i KAPATMA
                    dropdowns.forEach(d => { 
                        if (d !== dropdown && d.parentElement === dropdown.parentElement) {
                             d.classList.remove('active'); 
                        }
                    });
                    
                    dropdown.classList.add('active'); // Tıklanan menüyü veya alt menüyü aç
                }
                // Menü zaten açıksa 2. tıklamada (eğer bir sayfaya gitmesi gerekiyorsa) linke gitmesine izin verir
            }
        });
    });

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

// ============================================================
// KATEGORİLİ VE CAROUSEL (KAYDIRMALI) OTOMATİK ÜRÜN OLUŞTURUCU
// ============================================================

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

        const katSlug = kategoriAdi.toLowerCase()
                    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
                    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                    .replace(/[^a-z0-9]/g, '-');
        let kategoriHTML = `
        <div id="${katSlug}" class="category-slider-section" style="margin-bottom: 70px;">
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

// ==========================================================================
// ANA SAYFA ÖNE ÇIKAN ÜRÜNLER OTOMASYONU
// ==========================================================================

function anaSayfaCarouselOlustur() {
    // Sadece ana sayfadaki ürünler bölümü varsa çalışsın
    const carouselTrack = document.getElementById('featured-carousel-track');
    if (!carouselTrack) return;

    // Öne çıkarmak istediğimiz ürünlerin ID'leri
    const seciliUrunler = ['b-tipi-otoklav-23lt', 'protesil-set', 'cromatic-aljinat', 'prestige-labor'];
    
    carouselTrack.innerHTML = ''; // İçeriği temizle

    seciliUrunler.forEach(id => {
        const urun = urunVerileri[id];
        if (urun) {
            // Görsel kontrolü (Gorseller dizisi varsa ilkini, yoksa placeholder kullan)
            let gorselYolu = "images/placeholder.jpg";
            if (urun.gorseller && urun.gorseller.length > 0) {
                gorselYolu = urun.gorseller[0];
            }

            const kartHTML = `
                <div class="product-card">
                    <div class="product-img" style="background-color: #fff;">
                        <img src="${gorselYolu}" alt="${urun.baslik}" style="width:100%; height:100%; object-fit:contain; padding:20px;">
                    </div>
                    <div class="product-info">
                        <h3 style="margin-bottom:15px; font-size:1.1rem; color:#2C3539;">${urun.baslik}</h3>
                        <a href="urun-detay.html?id=${id}" class="btn-primary" style="padding: 10px 20px; font-size: 0.8rem; margin-top: 10px;">Detaylı İncele</a>
                    </div>
                </div>
            `;
            carouselTrack.innerHTML += kartHTML;
        }
    });
}

// ==========================================================================
// DİNAMİK NAVİGASYON (MENÜ) OLUŞTURUCU
// ==========================================================================

function navigasyonUrunleriOlustur() {
    const navContainer = document.getElementById('dynamic-nav-products');
    if (!navContainer) return; 

    const kategoriler = {};
    for (const [urunId, urunDetayi] of Object.entries(urunVerileri)) {
        const katAdi = urunDetayi.kategori;
        if (!kategoriler[katAdi]) { kategoriler[katAdi] = []; }
        kategoriler[katAdi].push({ id: urunId, ...urunDetayi });
    }

    // YENİ: Inline style silindi, "all-products-link" sınıfı eklendi
    let navHTML = `<li><a href="urunler.html" class="all-products-link">Tüm Ürünler</a></li>`;

    for (const [kategoriAdi, urunlerListesi] of Object.entries(kategoriler)) {
        
        const katSlug = kategoriAdi.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, '-');

        // YENİ: Sadece iskelet bırakıldı
        navHTML += `
            <li class="dropdown-submenu">
                <a href="urunler.html#${katSlug}">
                    ${kategoriAdi} 
                    <span class="nav-arrow">▸</span>
                </a>
                <ul class="dropdown-menu-side">
        `;

        urunlerListesi.forEach(urun => {
            navHTML += `<li><a href="urun-detay.html?id=${urun.id}">${urun.baslik}</a></li>`;
        });

        navHTML += `
                </ul>
            </li>
        `;
    }

    navContainer.innerHTML = navHTML;
}

// ==========================================================================
// DİNAMİK MARKA CAROUSEL (MARQUEE) OLUŞTURUCU - KUSURSUZ DÖNGÜ
// ==========================================================================

function dinamikMarkalariOlustur() {
    const track = document.getElementById('dynamic-brands-track');
    if (!track) return;

    if (markaVerileri.length === 0) return;

    let markalarHTML = "";

    // Sadece mevcut markaları bir kez HTML'e çeviriyoruz
    markaVerileri.forEach(marka => {
        markalarHTML += `
            <a href="${marka.url}" target="_blank" rel="noopener noreferrer" class="logo-box" title="${marka.ad}">
                <img src="${marka.logo}" alt="${marka.ad}" onerror="this.style.display='none'; this.parentElement.innerText='${marka.ad}';">
            </a>
        `;
    });

    // 1 Vagon (Slide) oluşturmak için markaları kendi içinde 4 kez çoğaltıyoruz (Ekranı kesin doldurması için)
    const tekVagon = markalarHTML.repeat(4);

    // Track içine birbirinin BİREBİR AYNISI iki vagon
    track.innerHTML = `
        <div class="brands-slide">${tekVagon}</div>
        <div class="brands-slide">${tekVagon}</div>
    `;
}

// ==========================================================================
// DİNAMİK FOOTER KATEGORİLERİ OLUŞTURUCU
// ==========================================================================

function footerKategorileriOlustur() {
    const footerContainer = document.getElementById('dynamic-footer-categories');
    if (!footerContainer) return; // Sayfada footer kategori alanı yoksa çalışma

    // Ürün verilerinden sadece benzersiz (tekrarsız) kategori isimlerini topluyoruz
    const kategoriler = new Set();
    for (const urunDetayi of Object.values(urunVerileri)) {
        kategoriler.add(urunDetayi.kategori);
    }

    let footerHTML = `<li><a href="urunler.html">Tüm Ürünler</a></li>`;

    // Her bir kategori için footer linkini oluşturuyoruz
    kategoriler.forEach(kategoriAdi => {
        // Linkin doğru yere gitmesi için Türkçe karakterleri çevirip slug (url) yapıyoruz
        const katSlug = kategoriAdi.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, '-');

        footerHTML += `<li><a href="urunler.html#${katSlug}">${kategoriAdi}</a></li>`;
    });

    footerContainer.innerHTML = footerHTML;
}

// ==========================================================================
// DİNAMİK DUYURULAR OLUŞTURUCU (duyurular.html İÇİN)
// ==========================================================================

function duyurulariOlustur() {
    const grid = document.getElementById('duyurular-grid');
    if (!grid) return; // Bu sayfada duyuru alanı yoksa çalışma

    grid.innerHTML = "";

    if (!duyuruVerileri || duyuruVerileri.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color:#888;">Şu anda görüntülenecek bir duyuru bulunmuyor.</p>';
        return;
    }

    duyuruVerileri.forEach(duyuru => {
        const tarihHTML = duyuru.tarih
            ? `<p style="font-size:0.8rem; color:#999; margin-bottom:8px;">${new Date(duyuru.tarih).toLocaleDateString('tr-TR')}</p>`
            : '';

        // Panelden görsel yüklenmişse onu, yüklenmemişse gri bir alan gösteriyoruz
        const gorselHTML = duyuru.gorsel
            ? `<img src="${duyuru.gorsel}" alt="${duyuru.baslik}" style="width:100%; height:150px; object-fit:cover; border-radius:4px;">`
            : `<div class="card-img" style="background: #eee; height: 150px;"></div>`;

        grid.innerHTML += `
            <div class="announcement-card">
                ${gorselHTML}
                ${tarihHTML}
                <h3>${duyuru.baslik}</h3>
                <p>${duyuru.aciklama}</p>
            </div>
        `;
    });
}

// ==========================================================================
// DİNAMİK İLETİŞİM BİLGİLERİ DOLDURUCU
// (footer - iki şube kutusu -, iletisim.html adres kutuları, anasayfa CTA,
//  teknik servis bölümü ve WhatsApp linki)
// ==========================================================================

function iletisimBilgileriniDoldur() {
    if (!iletisimVerileri || Object.keys(iletisimVerileri).length === 0) return;

    const metniDoldur = (id, deger) => {
        const el = document.getElementById(id);
        if (el && deger !== undefined) el.innerText = deger;
    };

    // Google Maps'te arama linki oluşturur (adresi tıklanabilir yapar)
    const haritaLinki = (adres) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adres)}`;

    // Bir şube nesnesini (merkez veya sube), footer'daki karşılık gelen
    // <ul> kutusuna, tüm bilgiler tıklanabilir olacak şekilde basar.
    const subeFooterKutusunuDoldur = (onEkKey, subeVerisi) => {
        const baslikEl = document.getElementById(`footer-${onEkKey}-baslik`);
        const adresEl = document.getElementById(`footer-${onEkKey}-adres-link`);
        const telEl = document.getElementById(`footer-${onEkKey}-tel-link`);
        const mobilEl = document.getElementById(`footer-${onEkKey}-mobil-link`);
        const mailEl = document.getElementById(`footer-${onEkKey}-mail-link`);

        if (!subeVerisi) return;
        if (baslikEl) baslikEl.innerText = subeVerisi.baslik;
        if (adresEl) { adresEl.href = haritaLinki(subeVerisi.adres); adresEl.innerText = subeVerisi.adres; }
        if (telEl) { telEl.href = `tel:${(subeVerisi.tel || '').replace(/\s/g, '')}`; telEl.innerText = `Tel: ${subeVerisi.tel}`; }
        if (mobilEl) { mobilEl.href = `tel:${(subeVerisi.mobil || '').replace(/\s/g, '')}`; mobilEl.innerText = `Mobil: ${subeVerisi.mobil}`; }
        if (mailEl) { mailEl.href = `mailto:${subeVerisi.mail}`; mailEl.innerText = subeVerisi.mail; }
    };

    // --- Footer: Bursa Merkez ve İstanbul Şube kutuları (tüm sayfalarda ortak) ---
    subeFooterKutusunuDoldur('merkez', iletisimVerileri.merkez);
    subeFooterKutusunuDoldur('sube', iletisimVerileri.sube);

    // --- iletisim.html sayfasındaki Merkez / Şube adres kutuları ---
    if (iletisimVerileri.merkez) {
        metniDoldur('merkez-baslik', iletisimVerileri.merkez.baslik);
        metniDoldur('merkez-adres', iletisimVerileri.merkez.adres);
        metniDoldur('merkez-tel', iletisimVerileri.merkez.tel);
        metniDoldur('merkez-mobil', iletisimVerileri.merkez.mobil);
        metniDoldur('merkez-mail', iletisimVerileri.merkez.mail);
    }
    if (iletisimVerileri.sube) {
        metniDoldur('sube-baslik', iletisimVerileri.sube.baslik);
        metniDoldur('sube-adres', iletisimVerileri.sube.adres);
        metniDoldur('sube-tel', iletisimVerileri.sube.tel);
        metniDoldur('sube-mobil', iletisimVerileri.sube.mobil);
        metniDoldur('sube-mail', iletisimVerileri.sube.mail);
    }

    // --- Anasayfa CTA (Teknik Servis telefonu) ---
    metniDoldur('cta-teknik-servis-tel', iletisimVerileri.cta_teknik_servis_tel);

    // --- Anasayfa Teknik Servis bölümündeki telefon butonu ---
    const tsTelButon = document.getElementById('ts-telefon-link');
    if (tsTelButon && iletisimVerileri.cta_teknik_servis_tel) {
        tsTelButon.href = `tel:${iletisimVerileri.cta_teknik_servis_tel.replace(/\s/g, '')}`;
        tsTelButon.innerText = iletisimVerileri.cta_teknik_servis_tel;
    }

    // --- WhatsApp float butonu (tüm sayfalarda) ---
    if (iletisimVerileri.whatsapp_numara) {
        const waLink = document.getElementById('whatsapp-float-link');
        if (waLink) waLink.href = `https://wa.me/${iletisimVerileri.whatsapp_numara}`;
    }
}

// ==========================================================================
// HAKKIMIZDA: DİNAMİK KATEGORİ İKON IZGARASI
// ==========================================================================
// content/urunler.json içindeki benzersiz "kategori" değerlerinden otomatik
// olarak oluşturulur. Panelden yeni bir kategoride ürün eklediğinizde bu
// ızgara otomatik olarak güncellenir, hiçbir ek işlem gerekmez.

function kategoriGridOlustur() {
    const grid = document.getElementById('kategori-grid');
    if (!grid) return;

    const kategoriler = [...new Set(Object.values(urunVerileri).map(u => u.kategori).filter(Boolean))];
    if (kategoriler.length === 0) return;

    grid.innerHTML = kategoriler.map(kat => `
        <div class="kategori-item">
            <div class="kategori-icon">${kategoriIkonuBul(kat)}</div>
            <span>${kat}</span>
        </div>
    `).join('');
}

// ==========================================================================
// ANASAYFA: TEKNİK SERVİS BÖLÜMÜ (Hakkımızda'dan önce)
// ==========================================================================

function teknikServisOlustur() {
    const grid = document.getElementById('teknik-servis-grid');
    if (!grid) return;

    const veri = kurumsalVerileri.teknik_servis;
    if (!veri) return;

    const aciklamaEl = document.getElementById('teknik-servis-aciklama');
    if (aciklamaEl && veri.aciklama) aciklamaEl.innerText = veri.aciklama;

    grid.innerHTML = (veri.hizmetler || []).map(hizmet => `
        <div class="ts-item">
            <div class="ts-icon">${ikonBul(hizmet.ikon)}</div>
            <h4>${hizmet.baslik}</h4>
            <p>${hizmet.aciklama}</p>
        </div>
    `).join('');
}

// ==========================================================================
// ANASAYFA: AVANTAJLARIMIZ BÖLÜMÜ
// ==========================================================================

function avantajlarGridOlustur() {
    const grid = document.getElementById('avantajlar-grid');
    if (!grid) return;

    const liste = kurumsalVerileri.avantajlar || [];
    if (liste.length === 0) return;

    grid.innerHTML = liste.map(item => `
        <div class="avantaj-item">
            <div class="avantaj-icon">${ikonBul(item.ikon)}</div>
            <div>
                <h4>${item.baslik}</h4>
                <p>${item.aciklama}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// ANASAYFA: İSTATİSTİKLER BÖLÜMÜ
// ==========================================================================

function istatistiklerGridOlustur() {
    const grid = document.getElementById('istatistik-grid');
    if (!grid) return;

    const liste = kurumsalVerileri.istatistikler || [];
    if (liste.length === 0) {
        grid.closest('.istatistikler-section')?.remove();
        return;
    }

    grid.innerHTML = liste.map(item => `
        <div class="istatistik-item">
            <div class="istatistik-sayi">${item.sayi}</div>
            <div class="istatistik-etiket">${item.etiket}</div>
        </div>
    `).join('');
}

// ==========================================================================
// NETLIFY AJAX FORM GÖNDERİMİ (AKILLI SIKIŞTIRMA VE ÇOKLU DOSYA)
// ==========================================================================
function netlifyFormGonder() {
    const contactForm = document.getElementById('contactForm');
    const successDiv = document.getElementById('form-success');
    const errorDiv = document.getElementById('form-error');

    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const fileInputs = contactForm.querySelectorAll('.dosya-yukle');
        const MAX_SIZE = 7340032; // 7 MB Sınırı (Byte cinsinden)

        // GÖRSEL SIKIŞTIRMA FONKSİYONU (Sadece gerekirse çalışır)
        const compressImage = async (file, { quality = 0.7, maxWidth = 1200 }) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = event => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        canvas.toBlob((blob) => {
                            if(blob) {
                                resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' }));
                            } else {
                                reject(new Error('Sıkıştırma başarısız'));
                            }
                        }, 'image/jpeg', quality);
                    };
                    img.onerror = error => reject(error);
                };
                reader.onerror = error => reject(error);
            });
        };

        // BUTON KONTROLÜ (Artık anlık boyut kısıtlaması yok, doğrulamaya bakıyoruz)
        const checkButtonState = () => {
            if (contactForm.checkValidity()) {
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            } else {
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
            }
        };

        checkButtonState();

        // TÜM INPUTLARI DİNLE
        const allInputs = contactForm.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.type !== 'file') this.setCustomValidity(''); 
                checkButtonState();
            });
            input.addEventListener('change', checkButtonState);

            input.addEventListener('invalid', function(e) {
                if (this.validity.valueMissing) {
                    this.type === 'checkbox' 
                        ? this.setCustomValidity('Lütfen formu göndermeden önce KVKK metnini onaylayınız.')
                        : this.setCustomValidity('Lütfen bu alanı eksiksiz doldurunuz.');
                } else if ((this.validity.typeMismatch || this.validity.patternMismatch) && this.type === 'email') {
                    this.setCustomValidity('Lütfen geçerli bir e-posta adresi giriniz (Örn: isim@alanadi.com).');
                } else if (this.type !== 'file') {
                    this.setCustomValidity('Lütfen geçerli bir değer giriniz.');
                }
            });
        });

        // AJAX GÖNDERİM İŞLEMİ (Akıllı Karar Mekanizması)
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 

            const originalBtnText = submitBtn.innerText;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'wait';
            submitBtn.disabled = true; 

            try {
                const formData = new FormData(contactForm);
                let totalOriginalSize = 0;

                // 1. Orijinal toplam boyutu hesapla
                fileInputs.forEach(input => {
                    if (input.files.length > 0) {
                        totalOriginalSize += input.files[0].size;
                    }
                });

                // 2. KARAR AŞAMASI: Sıkıştırmaya gerek var mı?
                if (totalOriginalSize <= MAX_SIZE) {
                    // HIZLI YOL: Toplam boyut 7 MB altıysa direkt gönder.
                    submitBtn.innerText = "Gönderiliyor...";
                } else {
                    // KURTARICI YOL: Boyut 7 MB üstü, resimleri sıkıştır.
                    submitBtn.innerText = "Görseller İşleniyor & Gönderiliyor...";
                    let totalCompressedSize = 0;

                    for (let i = 0; i < fileInputs.length; i++) {
                        const input = fileInputs[i];
                        const inputName = input.getAttribute('name');
                        
                        formData.delete(inputName); // Eski ağır dosyayı formdan çıkar

                        if (input.files.length > 0) {
                            const originalFile = input.files[0];
                            
                            // Sadece resim formatındaysa sıkıştır
                            if (originalFile.type.startsWith('image/')) {
                                const compressedFile = await compressImage(originalFile, { quality: 0.7, maxWidth: 1200 });
                                formData.append(inputName, compressedFile);
                                totalCompressedSize += compressedFile.size;
                            } else {
                                // Resim değilse (PDF vs.) orijinali ekle
                                formData.append(inputName, originalFile);
                                totalCompressedSize += originalFile.size;
                            }
                        }
                    }

                    // Sıkıştırma sonrası son güvenlik kontrolü
                    if (totalCompressedSize > MAX_SIZE) {
                        throw new Error("OVERSIZE"); // Sıkıştırılamayan ağır dosyalar (örn: 10MB PDF)
                    }
                }
                
                // 3. Verileri Netlify'a gönder
                const response = await fetch("/", {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    contactForm.style.display = 'none'; 
                    if(errorDiv) errorDiv.style.display = 'none';
                    if(successDiv) successDiv.style.display = 'block'; 
                    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    throw new Error("SUNUCU_HATASI");
                }

            } catch (error) {
                console.error("Gönderim Hatası:", error);
                
                if (error.message === "OVERSIZE") {
                    alert("Yüklediğiniz dosyalar çok büyük ve sıkıştırılamıyor (Örn: Büyük PDF dosyaları). Lütfen daha küçük dosyalar seçiniz.");
                } else {
                    if(errorDiv) errorDiv.style.display = 'block';
                }
                
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                checkButtonState(); 
            }
        });
    }
}


// 5 Saniyede bir dönsün
setInterval(nextSlide, 5000);