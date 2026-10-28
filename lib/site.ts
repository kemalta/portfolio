/**
 * Central content + configuration.
 *
 * `email` and `links` are the real, owner-provided contact channels; the UI
 * (hero status, about card, contact panel, footer) reads them from here.
 * Project entries below are concepts / interactive demos, not client work.
 */

export const siteConfig = {
  name: "Kemal Talha Ekici",
  shortName: "KTE",
  role: "ICT Engineering / AI / Security / Infrastructure",
  tagline: "Systems are complex. I make them work together.",
  intro:
    "Yapay zekâ teknolojilerini, siber güvenliği, network ve server altyapılarını ve web teknolojilerini bir araya getiren; karmaşık bilişim sistemlerini analiz eden, geliştiren ve daha verimli hale getiren bir teknoloji profesyoneliyim.",
  email: "kemaltalhaekici@gmail.com" as string | null,
  location: null as string | null,
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/kemal-talha-ekici-247712254/",
    },
    { label: "GitHub", href: "https://github.com/kemalta" },
    { label: "Instagram", href: "https://www.instagram.com/kemaltalhaekici/" },
  ] as { label: string; href: string }[],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  year: 2026,
};

export type ContactMode = "api" | "mailto";

/**
 * `api` (default) posts to the local demo endpoint in app/api/contact.
 * `mailto` is used by the static GitHub Pages build, where no server exists:
 * the form opens the visitor's mail client with a prefilled message instead.
 */
export const contactMode: ContactMode =
  process.env.NEXT_PUBLIC_CONTACT_MODE === "mailto" ? "mailto" : "api";

export const navItems = [
  { label: "Uzmanlık", href: "#uzmanlik", index: "02" },
  { label: "Laboratuvar", href: "#laboratuvar", index: "03" },
  { label: "Projeler", href: "#projeler", index: "04" },
  { label: "Hakkımda", href: "#hakkimda", index: "05" },
  { label: "İletişim", href: "#iletisim", index: "06" },
];

export type DisciplineId =
  | "ai"
  | "security"
  | "network"
  | "server"
  | "web"
  | "systems";

export type Discipline = {
  id: DisciplineId;
  index: string;
  title: string;
  english: string;
  summary: string;
  skills: string[];
};

export const disciplines: Discipline[] = [
  {
    id: "ai",
    index: "01",
    title: "Yapay Zekâ",
    english: "Artificial Intelligence",
    summary:
      "AI destekli geliştirme, otomasyon, akıllı iş akışları ve üretkenlik sistemleri.",
    skills: [
      "AI destekli yazılım geliştirme",
      "İş akışı otomasyonu",
      "LLM araçları ve entegrasyon",
      "Prompt ve bağlam tasarımı",
      "Prototipleme",
    ],
  },
  {
    id: "security",
    index: "02",
    title: "Siber Güvenlik",
    english: "Cybersecurity",
    summary:
      "Güvenli sistem yapılandırması, tehdit analizi, erişim kontrolü ve savunma odaklı yaklaşımlar.",
    skills: [
      "Sistem sertleştirme",
      "Tehdit analizi",
      "Erişim kontrolü",
      "Güvenlik farkındalığı",
      "Savunma odaklı yapılandırma",
    ],
  },
  {
    id: "network",
    index: "03",
    title: "Network Mühendisliği",
    english: "Network Engineering",
    summary:
      "Ağ mimarisi, VLAN, switching, routing, kablosuz ağlar ve bağlantı sorunlarının analizi.",
    skills: [
      "VLAN ve segmentasyon",
      "Switching / routing",
      "Kablosuz ağ yapılandırması",
      "Topoloji analizi",
      "Bağlantı sorunları",
    ],
  },
  {
    id: "server",
    index: "04",
    title: "Server & Altyapı",
    english: "Server & Infrastructure",
    summary:
      "Server sistemleri, sanallaştırma, depolama, yedekleme ve altyapı yönetimi.",
    skills: [
      "Server yönetimi",
      "Sanallaştırma",
      "Depolama sistemleri",
      "Yedekleme stratejileri",
      "Altyapı izleme",
    ],
  },
  {
    id: "web",
    index: "05",
    title: "Web Mühendisliği",
    english: "Web Engineering",
    summary:
      "Modern web uygulamaları, etkileşimli arayüzler, API entegrasyonları ve yönetim panelleri.",
    skills: [
      "Modern arayüz geliştirme",
      "Etkileşimli uygulamalar",
      "API entegrasyonları",
      "Yönetim panelleri",
      "Performans odaklı frontend",
    ],
  },
  {
    id: "systems",
    index: "06",
    title: "Sistem & Sorun Giderme",
    english: "Systems & Troubleshooting",
    summary:
      "Sistem analizi, performans problemleri, hata ayıklama ve teknik çözümler.",
    skills: [
      "Sistem analizi",
      "Performans ölçümü",
      "Hata ayıklama",
      "Kök neden analizi",
      "Teknik dokümantasyon",
    ],
  },
];

export type ProjectVisual =
  | "topology"
  | "monitoring"
  | "soc"
  | "ai"
  | "creative";

export type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  visual: ProjectVisual;
  description: string;
  detail: string;
  tech: string[];
  note: string;
};

/**
 * All projects are interactive concepts built for this portfolio.
 * There is no real client data, no production telemetry and no invented
 * outcome metrics. Sample data is generated in the browser.
 */
export const projects: Project[] = [
  {
    id: "topology-explorer",
    index: "01",
    title: "Network Topology Explorer",
    subtitle: "Ağ topolojisi / etkileşimli keşif",
    visual: "topology",
    description:
      "Katmanlı bir ağ topolojisini düğüm, bağlantı ve veri akışı üzerinden okumayı sağlayan bir keşif arayüzü konsepti.",
    detail:
      "Demo, örnek bir ağ haritasını üç katmanda gösterir: erişim, çekirdek ve servisler. Bir düğüme tıkladığınızda bağlı yollar vurgulanır; bağlantıların üzerindeki paketler yön bilgisini görselleştirir.",
    tech: ["React", "SVG", "TypeScript", "Veri görselleştirme"],
    note: "Konsept demo · örnek topoloji",
  },
  {
    id: "infrastructure-monitoring",
    index: "02",
    title: "Infrastructure Monitoring",
    subtitle: "Altyapı izleme panosu",
    visual: "monitoring",
    description:
      "CPU, bellek, disk ve ağ metriklerini tek bir operasyonel yüzeyde birleştiren örnek bir izleme panosu.",
    detail:
      "Paneldeki değerler tarayıcıda üretilen örnek verilerdir. Amaç, yoğun bir metrik setini okunabilir hiyerarşiye indirmek ve eşik durumlarını renk kadar konumla da anlatmak.",
    tech: ["React", "SVG charts", "Örnek veri", "Durum tasarımı"],
    note: "Konsept demo · üretilen örnek veri",
  },
  {
    id: "security-operations",
    index: "03",
    title: "Security Operations Interface",
    subtitle: "Olay triyajı arayüzü",
    visual: "soc",
    description:
      "Güvenlik uyarılarını önem sırasına göre ayıran, triyaj akışını sadeleştiren temsili bir SOC arayüzü.",
    detail:
      "Uyarılar severity ve kaynak bilgisiyle listelenir; filtreler ve triyaj aksiyonları çalışır. Tüm kayıtlar temsili örneklerdir ve gerçek bir izleme sistemine bağlı değildir.",
    tech: ["React", "State machine", "Filtreleme", "Erişilebilir UI"],
    note: "Konsept demo · temsili olaylar",
  },
  {
    id: "ai-workflow-lab",
    index: "04",
    title: "AI Workflow Laboratory",
    subtitle: "AI destekli iş akışı",
    visual: "ai",
    description:
      "Bir görevin bağlam toplama, model çağrısı, doğrulama ve teslim adımlarından geçişini görselleştiren deney.",
    detail:
      "Çalıştır düğmesi pipeline'ı adım adım ilerletir; her aşamanın durumu, süresi ve çıktısı aynı yüzeyde görünür. Model çağrısı simüle edilir, gerçek bir AI servisine bağlanmaz.",
    tech: ["React", "Pipeline state", "Simülasyon", "Motion"],
    note: "Konsept demo · simüle edilmiş pipeline",
  },
  {
    id: "creative-web",
    index: "05",
    title: "Creative Web Experience",
    subtitle: "Hareket ve tipografi çalışması",
    visual: "creative",
    description:
      "Tipografi, ışık ve işaretçi etkileşimini tek bir kompozisyonda birleştiren küçük bir yaratıcı kod çalışması.",
    detail:
      "Bu çalışma, portföyün görsel dilini test etmek için yazıldı. İşaretçi konumu ve scroll ilerlemesi tipografik katmanları hafifçe kaydırır; amaç dekorasyon değil, derinlik algısı kurmak.",
    tech: ["GSAP", "CSS", "Pointer events", "Tipografi"],
    note: "Konsept demo · motion study",
  },
];

export const principles = [
  {
    index: "01",
    title: "Önce bütünlük",
    body: "Bir sistemin en zayıf halkası, en görünür olmayan parçasıdır. Güvenlik ve veri bütünlüğü sonradan eklenen katmanlar değil, tasarımın başlangıcıdır.",
  },
  {
    index: "02",
    title: "Ölç, sonra karar ver",
    body: "Performans ve güvenlik varsayımlarla yönetilmez. Ölçüm, log ve doğrulanabilir kanıt olmadan yapılan iyileştirme tesadüftür.",
  },
  {
    index: "03",
    title: "Karmaşıklığı görünür kıl",
    body: "İyi arayüz, alttaki sistemin karmaşıklığını saklamaz; doğru zamanda, doğru ayrıntıda görünür kılar. Tasarım da mühendisliğin bir parçasıdır.",
  },
  {
    index: "04",
    title: "Sadeleştir, sonra ölçekle",
    body: "Gereksiz bağımlılık ve katman, bakım maliyeti üretir. Önce çalışan en küçük çözüm; sonra ölçülen ihtiyaç kadar genişleme.",
  },
];

export const capabilityGroups = [
  {
    label: "AI & Otomasyon",
    items: ["AI destekli geliştirme", "İş akışı otomasyonu", "LLM araçları"],
  },
  {
    label: "Güvenlik",
    items: ["Sistem sertleştirme", "Tehdit analizi", "Erişim kontrolü"],
  },
  {
    label: "Network",
    items: ["VLAN / switching", "Routing", "Kablosuz ağlar"],
  },
  {
    label: "Altyapı",
    items: ["Server yönetimi", "Sanallaştırma", "Yedekleme"],
  },
  {
    label: "Web",
    items: ["React / Next.js", "API entegrasyonu", "Yönetim panelleri"],
  },
  {
    label: "Sistemler",
    items: ["Performans analizi", "Hata ayıklama", "Kök neden analizi"],
  },
];

export const statusReadout = [
  { label: "Ortam", value: "WEBGL / R3F" },
  { label: "Topoloji", value: "İNTERAKTİF DEMO" },
  { label: "İçerik", value: "TR / EN TEKNİK" },
];
