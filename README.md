# Kemal Talha Ekici — Portfolyo

ICT sistemleri, siber güvenlik, yapay zekâ, network ve server altyapısı ile web
mühendisliğini tek bir anlatıda birleştiren kişisel portfolyo sitesi.

Tasarım dili: koyu grafit zemin, off-white tipografi, elektrik cyan ana vurgu,
ölçülü lime/amber ikincil vurgular, ince çizgiler ve teknik okuma düzeni.

---

## Stack

- **Next.js 14** (App Router) · React 18 · TypeScript
- **Tailwind CSS 3.4** — tasarım token'ları `tailwind.config.ts` + `app/globals.css`
- **React Three Fiber / drei / three** — hero ve laboratuvar ağ topolojisi
- **GSAP + ScrollTrigger** — hero girişi, scroll reveals, scroll'a bağlı kamera
- **Motion (framer-motion)** — yalnızca UI durum geçişleri (menü, modal, accordion)
- **Lenis** — yumuşak scroll

Animasyon sorumlulukları bilinçli olarak ayrılmıştır: aynı efekt için iki kütüphane
kullanılmaz. GSAP scroll sinematografisini, Motion bileşen durumlarını yönetir.

## Bölümler

| # | Bölüm | İçerik |
| --- | --- | --- |
| 01 | Hero | İsim odaklı tipografi, etkileşimli 3D ağ topolojisi, iki CTA, durum şeridi |
| 02 | Uzmanlık | Altı disiplin; her biri için ayrı şematik SVG görsel, açılır detay |
| 03 | Laboratuvar | Düğüm/bağlantı grafiği, grup filtreleri, düğüm okuma paneli |
| 04 | Projeler | Beş konsept demo; her biri kendi interaktif arayüzüyle açılır |
| 05 | Hakkımda | Profil metni, çalışma ilkeleri, yetkinlik envanteri |
| 06 | İletişim | Doğrudan e-posta + LinkedIn/GitHub/Instagram ve demo form (yerel kayıt) |

## Kurulum

```bash
cd portfolio
npm install
npm run dev        # http://localhost:3000
```

Üretim derlemesi:

```bash
npm run typecheck
npm run lint
npm run build
npm run start      # varsayılan port 3000
```

## Yayın (GitHub Pages)

Site ücretsiz olarak GitHub Pages üzerinde yayınlanır:

**https://kemalta.github.io/portfolio/**

- `main` dalı kaynak kodu tutar; `gh-pages` dalı yalnızca üretilen statik
  dosyaları içerir. Pages bu dalı kök dizinden sunar.
- Yayınlamak / güncellemek için tek komut:

```bash
npm run deploy     # statik build + gh-pages dalına push
```

`deploy` komutu `NEXT_PUBLIC_BASE_PATH=/portfolio`,
`NEXT_PUBLIC_SITE_URL=https://kemalta.github.io/portfolio` ve
`NEXT_PUBLIC_CONTACT_MODE=mailto` değerlerini kendisi ayarlar.

Statik build'in iki farkı vardır: `app/api` build sırasında geçici olarak
kenara alınır (statik export POST route handler kabul etmez) ve iletişim formu
sunucu yerine `mailto:` ile çalışır.

## Yapılandırma

Tüm içerik tek dosyadan yönetilir: **`lib/site.ts`**

```ts
export const siteConfig = {
  email: "kemaltalhaekici@gmail.com",
  location: null,   // opsiyonel
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kemal-talha-ekici-247712254/" },
    { label: "GitHub", href: "https://github.com/kemalta" },
    { label: "Instagram", href: "https://www.instagram.com/kemaltalhaekici/" },
  ],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
```

- **E-posta ve profiller** yukarıdaki gerçek kanallardır; hero durum şeridi,
  hakkımda kartı, iletişim paneli, mobil menü ve footer bu değerlerden beslenir.
  `location` bilinçli olarak boştur — uydurulmuş adres veya telefon gösterilmez.
- Kimlik doğrulaması için `Person` JSON-LD (`app/layout.tsx`) aynı e-posta ve
  `sameAs` profillerini yayınlar.
- **Site adresi** `NEXT_PUBLIC_SITE_URL` ile verilir; metadata, `robots.txt`,
  `sitemap.xml` ve Open Graph görseli bu değeri kullanır.
- **Projeler** `projects` dizisinde tanımlıdır. Hepsi konsept demodur; gerçek
  müşteri işi veya üretim sistemi olarak sunulmaz.

## Demo sınırları (önemli)

- Beş proje **konsept demosudur**; örnek veriyle çalışır, gerçek telemetri veya
  müşteri verisi içermez. Arayüzde bu durum her projede ve modal içinde yazar.
- İletişim formunun iki modu vardır. Yerel/Node çalışmasında (`api` modu) mesaj
  sunucu tarafında doğrulanır, honeypot ve IP bazlı hız sınırı uygulanır ve
  yalnızca yerel `.data/contact-submissions.jsonl` dosyasına eklenir; ardından
  aynı mesajı hazır konu/gövde ile `mailto:` üzerinden göndermeyi öneren bir
  bağlantı çıkar. GitHub Pages yayınında (`mailto` modu) hiçbir veri sunucuya
  gitmez: form, ziyaretçinin kendi e-posta uygulamasını hazır konu ve gövdeyle
  açar.
- Hiçbir analitik, CRM veya üçüncü taraf izleme entegrasyonu yoktur.

## Erişilebilirlik ve performans notları

- Semantik başlık hiyerarşisi, `aria-expanded` / `aria-pressed` / `aria-current`
  durumları, görünür `:focus-visible` halkası ve klavye ile tam gezinme.
- Accordion ok tuşları / Home / End ile gezilebilir; modal odak tuzağı, `Escape`
  ile kapanma ve odak geri yükleme içerir.
- `prefers-reduced-motion` desteklenir: GSAP zaman çizelgeleri ve kamera
  hareketleri devre dışı kalır, içerik doğrudan görünür.
- WebGL desteklenmezse veya sahne yüklenemezse statik SVG topoloji gösterilir.
- 3D sahneler `ssr: false` ile dinamik yüklenir; ilk boyama engellenmez.
- Proje demoları yalnızca modal açıldığında yüklenir.

## Klasör yapısı

```
portfolio/
├── app/
│   ├── api/contact/route.ts     # demo form endpoint'i (doğrulama + yerel kayıt)
│   ├── globals.css              # token'lar, bileşen sınıfları, motion
│   ├── layout.tsx               # fontlar, metadata, chrome
│   ├── page.tsx                 # bölüm kompozisyonu
│   ├── opengraph-image.tsx      # 1200×630 OG görseli
│   ├── icon.svg / favicon.ico
│   ├── robots.ts / sitemap.ts / not-found.tsx
├── components/
│   ├── layout/                  # Navbar, Footer, SiteChrome, smooth scroll
│   ├── sections/                # Hero, Interlude, Disciplines, NetworkLab,
│   │                            # Projects, About, Contact
│   ├── projects/                # modal + beş interaktif demo + SVG önizlemeler
│   ├── three/                   # TopologyScene, HeroTopology, LabTopology,
│   │                            # TopologyFallback, WebGLBoundary
│   ├── visuals/                 # disiplin görselleri
│   └── ui/                      # Reveal, SectionHeader
├── scripts/
│   ├── build-pages.mjs          # statik export build'i (app/api'yi kenara alır)
│   └── deploy-pages.sh          # build + gh-pages dalına push
└── lib/
    ├── site.ts                  # tüm içerik ve yapılandırma
    ├── network.ts               # örnek topoloji verisi
    ├── gsap.ts                  # ScrollTrigger kaydı
    └── hooks/
```

## Lisans

Kişisel portfolyo projesi. İçerik ve görseller Kemal Talha Ekici'ye aittir.
