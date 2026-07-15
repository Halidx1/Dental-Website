// ============================================================
// MERKEZİ VERİ YÜKLEME (CMS TARAFINDAN YÖNETİLEN JSON DOSYALARI)
// ============================================================
// Aşağıdaki değişkenler artık content/*.json dosyalarından
// doldurulur. Panel üzerinden yapılan her değişiklik bu
// dosyalara yazılır; sayfa yüklendiğinde en güncel veri buradan
// okunur. Eski hardcoded veri artık content/urunler.json,
// content/markalar.json, content/duyurular.json ve
// content/iletisim.json dosyalarında yaşıyor.

let urunVerileri = {};
let markaVerileri = [];
let duyuruVerileri = [];
let iletisimVerileri = {};

// Sayfadaki her script (script.js'in kendisi ve urun-detay.html'in
// içindeki script) veriye ihtiyaç duyduğunda bu promise'i bekler.
window.veriYuklePromise = (async function verileriYukle() {
    try {
        const [urunRes, markaRes, duyuruRes, iletisimRes] = await Promise.all([
            fetch('content/urunler.json'),
            fetch('content/markalar.json'),
            fetch('content/duyurular.json'),
            fetch('content/iletisim.json')
        ]);

        const urunData = urunRes.ok ? await urunRes.json() : { urunler: [] };
        const markaData = markaRes.ok ? await markaRes.json() : { markalar: [] };
        const duyuruData = duyuruRes.ok ? await duyuruRes.json() : { duyurular: [] };
        const iletisimData = iletisimRes.ok ? await iletisimRes.json() : {};

        // urunler.json bir DİZİ (array) formatındadır; mevcut kodun
        // tamamı ise { "urun-id": {...} } şeklinde bir OBJE bekliyor.
        // Geriye dönük uyumluluk için burada diziyi obje haline çeviriyoruz,
        // böylece aşağıdaki tüm fonksiyonlar tek satır değişmeden çalışır.
        urunVerileri = {};
        (urunData.urunler || []).forEach(urun => {
            const { id, ...detay } = urun;
            if (id) urunVerileri[id] = detay;
        });

        markaVerileri = markaData.markalar || [];
        duyuruVerileri = duyuruData.duyurular || [];
        iletisimVerileri = iletisimData || {};

    } catch (err) {
        console.error("İçerik verileri (content/*.json) yüklenirken hata oluştu:", err);
    }
})();

// ============================================================
// (ESKİ VERİ BLOĞU - ARTIK KULLANILMIYOR, REFERANS İÇİN SAKLANDI)
// ============================================================
/*
const urunVerileri_ESKI = {
    "protesil-set": {
        kategori: "Ölçü Maddeleri",
        baslik: "Protesil Set C Tipi",
        aciklama: "Çift baskı tekniğinde ilk baskının alınması için geliştirilmiş yüksek viskoziteli yoğunlaşma silikonudur. Ağza yerleştirildiğinde ekstra yumuşak bir doku sunarken, elastikiyet ve sertlik arasında kusursuz bir denge kurar.",
        ozellikler: [
            "Yüksek ilk pürüzsüzlük sayesinde basit ve güvenli manuel karıştırma imkanı.",
            "Çalışma ve kürlenme süresi arasında optimum oran.",
            "Yüksek boyutsal kararlılık ve uzun ömürlü yapı.",
            "Paket İçeriği: I. Ölçü 900 ml. + II. Ölçü 140 ml. + Katalizör 60 ml tüp."
        ],
        gorseller: [
            "images/products/protesil-set-c-tipi/PROTESİL C tipi set.jpeg", 
            "images/products/protesil-set-c-tipi/c tipi.jpg",
            "images/products/protesil-set-c-tipi/katalizör 1.jpeg",
            "images/products/protesil-set-c-tipi/katalizör.jpeg",
            "images/products/protesil-set-c-tipi/protesil light.jpeg",
            "images/products/protesil-set-c-tipi/Protesil putty.jpeg",
            "images/products/protesil-set-c-tipi/protesil.jpeg"
        ]
    },
    "b-tipi-otoklav-23lt": {
        kategori: "Klinik Cihazlar ve Ekipmanlar",
        baslik: "B Tipi Otoklav (23 Litre)",
        aciklama: "Klinik sterilizasyon ihtiyaçlarınız için yüksek kapasiteli, LCD ekranlı ve entegre yazıcılı premium B sınıfı otoklav cihazı.",
        ozellikler: [
            "Kapasite: 23 Litre",
            "Ürün Boyutu: 66 x 50 x 43 cm",
            "Ekran: Kullanıcı dostu LCD panel",
            "Güvenlik: Çift kilit sistemi ile ekstra koruma",
            "Bağlantı ve Raporlama: USB ve dahili Printer (Yazıcı) desteği",
            "Programlar: 7 Önceden ayarlanmış program, 2 Test programı ve 1 Özel program"
        ],
        gorseller: [
            "images/products/b-tipi-otoklav/otoklav.png",
            "images/products/b-tipi-otoklav/otoklav-23lt.jpeg"
        ]
    },
    "cromatic-aljinat": {
        kategori: "Ölçü Maddeleri",
        baslik: "Cromatic Aljinat (453g)",
        aciklama: "Cromatic, yüksek hassasiyet gerektiren diş ölçüleri için geliştirilmiş, fazlı kromatik göstergeye sahip premium bir aljinattır. Özel formülasyonu, karıştırma ve sertleşme sürelerini takip etme zorunluluğunu ortadan kaldırarak; çalışma ve sertleşme süresi boyunca renk değiştiren bileşenleri sayesinde hatasız bir kullanım süreci sunar. Rutin diş ölçüleri, protez çalışmaları ve çalışma modelleri gibi pek çok alanda ideal sonuçlar verir.",
        ozellikler: [
            "Fazlı Kromatik Gösterge: 3 farklı renk aşaması ile karıştırma ve çalışma sürelerini görsel olarak takip etme kolaylığı sağlar.",
            "Tozsuz ve Glütensiz: Özel formülasyonu sayesinde kullanım sırasında tozu tamamen ortadan kaldırır; glütensiz ve hipoalerjenik yapısıyla güvenli bir kullanım sunar.",
            "Yüksek Detay Tanımı: Model üzerinde mükemmel detay hassasiyeti sağlar ve deformasyon olmadan kolayca çıkarılır.",
            "Optimum Alçı Uyumu: Alçı modellerle mükemmel uyum göstererek yüzey kalitesini artırır.",
            "Konfor: Vanilla aroması ile hasta konforunu destekler.",
            "Standartlar: ISO 21563 sertifikasına sahiptir.",
            "Sertleşme Süresi: 2 dakika 35 saniye",
            "Ambalaj: 453g paket"
        ],
        gorseller: [
            "images/products/cromatic-aljinat/cromatic.jpeg",
            "images/products/cromatic-aljinat/cromatic-aljinat.jpeg"
        ]
    },
    "prestige-a-tipi-set": {
        kategori: "Ölçü Maddeleri",
        baslik: "Prestige A Tipi Ölçü Seti",
        aciklama: "Yüksek kaliteli ve hassas diş ilk izlenimleri için tasarlanmış, çift izlenim tekniğinde kullanılmak üzere ekstra yumuşak, hızlı sertleşen tiksotropik ek silikon. Özellikle çalışma aşamasında yumuşak, ağızda hızlı sertleşme süresi sunar. Vulkanizasyondan sonra dengeli sertlik, hastanın ağzından kolayca çıkarılmasını sağlar. Çalışma ve kürlenme süresi arasında uygun oran ve yüksek boyutsal kararlılık sunar.",
        ozellikler: [
            "Çift izlenim tekniği için ideal ekstra yumuşak yapı.",
            "Hızlı sertleşme özelliği sayesinde klinik konforu.",
            "Yüksek boyutsal kararlılık ve hassas detay reprodüksiyonu.",
            "Paket İçeriği: Prestige Putty Soft 300ml Baz + 300ml Katalizör + 2 x 50 ml Prestige Light Kartuş."
        ],
        gorseller: [
            "images/products/prestige-a-tipi-set/prestige a tipi 1. ölçü.jpeg",
            "images/products/prestige-a-tipi-set/1. ölçü a tipi.jpeg",
            "images/products/prestige-a-tipi-set/2. ölçü a tipi.jpeg",
            "images/products/prestige-a-tipi-set/a tipi 1. ölçü.jpeg",
            "images/products/prestige-a-tipi-set/a tipi 2..jpeg"
        ]
    },
    "prestige-labor": {
        kategori: "Laboratuvar Ürünleri",
        baslik: "Prestige Labor A Silikon (5+5 kg)",
        aciklama: "Laboratuvar için yüksek kesinlikte A silikon ve protez dublikasyonu sağlamaktadır. Metal yapı tasarımında kontrol şablonu, mufla içindeki protezi yüksek sıcaklıktan izole eder ve korur.",
        ozellikler: [
            "130 dereceye kadar yüksek ısıya dayanıklıdır.",
            "Hassas metal yapı tasarımlarında kusursuz kontrol şablonu görevi görür.",
            "Paketleme Detayları: 5 kg Baz + 5 kg Katalizör."
        ],
        gorseller: [
            "images/products/prestige-labor/prestige 5+5 labor.jpeg"
        ]
    },
    "prestige-vdg-mask": {
        kategori: "Laboratuvar Ürünleri",
        baslik: "Prestige VDG Mask",
        aciklama: "Rigid, yüksek hassasiyetli gingival maskelerin yeniden üretimi için geliştirilmiş bir ek silikondur. Hassas bir tanımlama aralığı, yüksek doğruluk ve boyutsal stabilite sağlar. Uygulama sırasında yüksek akışkanlık ve vulkanizasyondan sonra dengeli bir sertlik sunar.",
        ozellikler: [
            "Model üzerinde gingivanın bitirilmesi sırasında kenarların kesilmesini kolaylaştıran dengeli sertlik.",
            "Doğrudan teknikle kullanım için özel formülasyon.",
            "Paketleme Detayları: 2 x 50 ml Kartuş + Separator."
        ],
        gorseller: [
            "images/products/prestige-vdg-mask/vdg mask.jpeg",
            "images/products/prestige-vdg-mask/prestige vdg mask.jpeg"
        ]
    },
    
    "protesil-elastic-aljinat": {
        kategori: "Ölçü Maddeleri",
        baslik: "Protesil Elastic Aljinat (500g)",
        aciklama: "Ortodontik diş ölçüleri için tiksotropik hızlı sertleşen elastik aljinat. Ürünün yüksek elastikiyeti, yüksek hassasiyetli diş ölçülerinin yeniden üretilmesini ve deformasyon olmadan ağızdan kolayca çıkarılmasını sağlar.",
        ozellikler: [
            "Ekstra ince kıvam ve optimum alçı uyumluluğu.",
            "Alerji riskini minimize eden glütensiz yapı.",
            "Paketleme Detayları: 500g"
        ],
        gorseller: [
            "images/products/protesil-elastic-aljinat/protesil elastic aljinat.jpeg",
            "images/products/protesil-elastic-aljinat/protesil aljinat elastic.jpeg"

        ]
    },

    "protesil-labor": {
        kategori: "Laboratuvar Ürünleri",
        baslik: "Protesil Labor Silikon",
        aciklama: "Çok yüksek kıvamlı, yüksek viskoziteli, özellikle teknisyen laboratuvarı için formüle edilmiş kondensasyon silikonudur[cite: 12]. Kırmızı tonu sayesinde homojen bir karışımın tanımlanmasına izin veren Protesil Catalyst Gel Labor ile birlikte kullanılır[cite: 12].",
        ozellikler: [
            "80 Shore A yüksek sertlik derecesi[cite: 12].",
            "130°C'den fazla ısıya karşı yüksek direnç[cite: 12].",
            "Paketleme Detayları: 5 kg + 2 Katalizör veya 25 kg + 7 Katalizör seçenekleri[cite: 12]."
        ],
        gorseller: [
            "images/products/protesil-labor/protesil labor katalizör.jpeg",
            "images/products/protesil-labor/protesil 5 kg labor.jpeg",
            "images/products/protesil-labor/protesil labor 5 kg.jpeg"
        ]
    }
};

// MARKA VERİTABANI
const markaVerileri_ESKI2 = [
    { ad: "Vannini Dental", logo: "images/brands/vanini.png", url: "https://www.vanninidental.com" },
    { ad: "Zhermack", logo: "images/brands/zhermack.png", url: "https://www.zhermack.com" },
    { ad: "3M Espe", logo: "images/brands/3m.png", url: "https://www.3m.com.tr" },
    { ad: "Kerr Dental", logo: "images/brands/kerr.png", url: "https://www.kerrdental.com" },
    { ad: "Kulzer", logo: "images/brands/kulzer.png", url: "https://www.kulzer.com" }
];
*/
// ============================================================
// (ESKİ VERİ BLOĞU SONU)
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {

    // Önce content/*.json dosyalarının yüklenmesini bekliyoruz.
    // Bu sayede urunVerileri, markaVerileri, duyuruVerileri ve
    // iletisimVerileri aşağıdaki fonksiyonlar çalışmadan önce dolu olur.
    await window.veriYuklePromise;

    if (typeof navigasyonUrunleriOlustur === 'function') {
        navigasyonUrunleriOlustur();
    }

    if (typeof anaSayfaCarouselOlustur === 'function') {
            anaSayfaCarouselOlustur();
    }

    // Dinamik markaları oluştur
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

        grid.innerHTML += `
            <div class="announcement-card">
                <div class="card-img" style="background: #eee; height: 150px;"></div>
                ${tarihHTML}
                <h3>${duyuru.baslik}</h3>
                <p>${duyuru.aciklama}</p>
            </div>
        `;
    });
}

// ==========================================================================
// DİNAMİK İLETİŞİM BİLGİLERİ DOLDURUCU
// (footer, iletisim.html adres kutuları, anasayfa CTA, WhatsApp linki)
// ==========================================================================

function iletisimBilgileriniDoldur() {
    if (!iletisimVerileri || Object.keys(iletisimVerileri).length === 0) return;

    const doldur = (id, deger) => {
        const el = document.getElementById(id);
        if (el && deger !== undefined) el.innerText = deger;
    };

    // --- Tüm sayfalarda ortak olan FOOTER ---
    doldur('footer-merkez-adres', iletisimVerileri.footer_adres_kisa);
    doldur('footer-telefon', iletisimVerileri.footer_telefon);

    // --- iletisim.html sayfasındaki Merkez / Şube kutuları ---
    if (iletisimVerileri.merkez) {
        doldur('merkez-baslik', iletisimVerileri.merkez.baslik);
        doldur('merkez-adres', iletisimVerileri.merkez.adres);
        doldur('merkez-tel', iletisimVerileri.merkez.tel);
        doldur('merkez-mobil', iletisimVerileri.merkez.mobil);
        doldur('merkez-mail', iletisimVerileri.merkez.mail);
    }
    if (iletisimVerileri.sube) {
        doldur('sube-baslik', iletisimVerileri.sube.baslik);
        doldur('sube-adres', iletisimVerileri.sube.adres);
        doldur('sube-tel', iletisimVerileri.sube.tel);
        doldur('sube-mobil', iletisimVerileri.sube.mobil);
        doldur('sube-mail', iletisimVerileri.sube.mail);
    }

    // --- Anasayfa CTA (Teknik Servis telefonu) ---
    doldur('cta-teknik-servis-tel', iletisimVerileri.cta_teknik_servis_tel);

    // --- WhatsApp float butonu (tüm sayfalarda) ---
    if (iletisimVerileri.whatsapp_numara) {
        const waLink = document.getElementById('whatsapp-float-link');
        if (waLink) waLink.href = `https://wa.me/${iletisimVerileri.whatsapp_numara}`;
    }
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