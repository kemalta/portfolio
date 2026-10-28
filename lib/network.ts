/**
 * Sample network used by the hero topology and the Network Laboratory.
 * This is a designed demonstration graph — it does not mirror a real network.
 */

export type NodeGroup = "ai" | "security" | "infra" | "web";

export const groupMeta: Record<
  NodeGroup,
  { label: string; full: string; color: string; soft: string }
> = {
  ai: {
    label: "AI",
    full: "Yapay Zekâ",
    color: "#c6f26e",
    soft: "rgba(198,242,110,0.16)",
  },
  security: {
    label: "SEC",
    full: "Güvenlik",
    color: "#f2b36a",
    soft: "rgba(242,179,106,0.16)",
  },
  infra: {
    label: "NET",
    full: "Network & Altyapı",
    color: "#5fe3ff",
    soft: "rgba(95,227,255,0.16)",
  },
  web: {
    label: "WEB",
    full: "Web & Uygulama",
    color: "#dfe7ee",
    soft: "rgba(223,231,238,0.14)",
  },
};

export type NetworkNode = {
  id: string;
  label: string;
  group: NodeGroup;
  position: [number, number, number];
  role: string;
  detail: string;
  layer: "edge" | "core" | "service";
};

export type NetworkEdge = {
  from: string;
  to: string;
  flow?: boolean;
};

export const networkNodes: NetworkNode[] = [
  // Edge
  {
    id: "edge-fw",
    label: "EDGE-FW",
    group: "security",
    position: [-3.5, 0.55, 1.35],
    role: "Edge firewall",
    detail:
      "Dış bağlantıların karşılandığı, politika ve segment sınırlarının uygulandığı kenar katmanı.",
    layer: "edge",
  },
  {
    id: "web-client",
    label: "WEB-CLIENT",
    group: "web",
    position: [-4.1, -1.05, -0.9],
    role: "İstemci yüzeyi",
    detail:
      "Kullanıcıya açılan arayüz katmanı. API çağrıları ve oturum durumu burada yönetilir.",
    layer: "edge",
  },
  {
    id: "api-gw",
    label: "API-GW",
    group: "web",
    position: [-1.75, 0.05, 2.25],
    role: "API gateway",
    detail:
      "Servisler arası istekleri yönlendiren, kimlik doğrulama ve hız sınırlarını uygulayan giriş noktası.",
    layer: "edge",
  },

  // Core
  {
    id: "core-sw",
    label: "CORE-SW",
    group: "infra",
    position: [0, 1.4, 0.15],
    role: "Çekirdek switch",
    detail:
      "VLAN'lar arası yönlendirme ve toplama noktası. Demo topolojisindeki merkezi bağlantı.",
    layer: "core",
  },
  {
    id: "iam",
    label: "IAM",
    group: "security",
    position: [-1.45, 2.45, -1.15],
    role: "Kimlik ve erişim",
    detail:
      "Kullanıcı, servis ve cihaz kimliklerinin doğrulandığı erişim kontrol katmanı.",
    layer: "core",
  },
  {
    id: "siem",
    label: "SIEM",
    group: "security",
    position: [1.75, 2.55, -1.4],
    role: "Olay korelasyonu",
    detail:
      "Farklı kaynaklardan gelen kayıtları toplayan, ilişkilendiren ve uyarı üreten izleme katmanı.",
    layer: "core",
  },
  {
    id: "compute-a",
    label: "COMPUTE-A",
    group: "infra",
    position: [2.5, 0.9, 0.35],
    role: "Sanallaştırma düğümü",
    detail:
      "Sanal makinelerin ve konteyner iş yüklerinin çalıştığı örnek compute düğümü.",
    layer: "core",
  },

  // Services
  {
    id: "llm-gw",
    label: "LLM-GW",
    group: "ai",
    position: [-1.05, 3.4, 1.25],
    role: "Model geçidi",
    detail:
      "Model çağrılarını tek noktadan yöneten, bağlam ve maliyet sınırlarını uygulayan servis.",
    layer: "service",
  },
  {
    id: "agent",
    label: "AGENT-RUN",
    group: "ai",
    position: [1.35, 3.6, 1.85],
    role: "Ajan çalıştırıcı",
    detail:
      "Görevleri adımlara ayıran ve araç çağrılarını yöneten örnek otomasyon servisi.",
    layer: "service",
  },
  {
    id: "vector",
    label: "VECTOR-DB",
    group: "ai",
    position: [3.3, 2.5, 1.05],
    role: "Vektör deposu",
    detail:
      "Bağlam araması için gömme vektörlerini tutan örnek veri katmanı.",
    layer: "service",
  },
  {
    id: "storage",
    label: "STORAGE",
    group: "infra",
    position: [3.5, -0.75, -1.35],
    role: "Depolama",
    detail:
      "Yedekler ve kalıcı veri için kullanılan örnek depolama birimi.",
    layer: "service",
  },
  {
    id: "admin",
    label: "ADMIN-UI",
    group: "web",
    position: [1.05, -1.95, 1.55],
    role: "Yönetim paneli",
    detail:
      "Sistem durumunu ve yapılandırmayı yöneten iç arayüz. Yetkilendirme gerektirir.",
    layer: "service",
  },
  {
    id: "backup",
    label: "BACKUP",
    group: "infra",
    position: [-2.4, -2.2, -1.55],
    role: "Yedekleme",
    detail:
      "Tanımlı politikalarla alınan yedeklerin doğrulandığı örnek süreç.",
    layer: "service",
  },
  {
    id: "mail",
    label: "MAIL-RELAY",
    group: "web",
    position: [-3.2, -2.05, 1.95],
    role: "Bildirim servisi",
    detail:
      "Uyarı ve bildirimlerin iletilmesini sağlayan örnek servis.",
    layer: "service",
  },
];

export const networkEdges: NetworkEdge[] = [
  { from: "edge-fw", to: "api-gw", flow: true },
  { from: "edge-fw", to: "core-sw", flow: true },
  { from: "web-client", to: "api-gw", flow: true },
  { from: "web-client", to: "edge-fw" },
  { from: "api-gw", to: "core-sw", flow: true },
  { from: "api-gw", to: "iam", flow: true },
  { from: "core-sw", to: "iam" },
  { from: "core-sw", to: "siem", flow: true },
  { from: "core-sw", to: "compute-a", flow: true },
  { from: "core-sw", to: "storage", flow: true },
  { from: "core-sw", to: "admin", flow: true },
  { from: "iam", to: "llm-gw" },
  { from: "iam", to: "agent" },
  { from: "siem", to: "agent", flow: true },
  { from: "siem", to: "backup" },
  { from: "compute-a", to: "llm-gw", flow: true },
  { from: "compute-a", to: "agent", flow: true },
  { from: "compute-a", to: "vector", flow: true },
  { from: "compute-a", to: "backup" },
  { from: "storage", to: "backup", flow: true },
  { from: "llm-gw", to: "vector", flow: true },
  { from: "agent", to: "vector", flow: true },
  { from: "admin", to: "mail" },
  { from: "siem", to: "mail", flow: true },
  { from: "edge-fw", to: "mail" },
];

export const nodeMap = new Map(networkNodes.map((node) => [node.id, node]));

export function connectedNodeIds(id: string): string[] {
  const ids = new Set<string>([id]);
  networkEdges.forEach((edge) => {
    if (edge.from === id) ids.add(edge.to);
    if (edge.to === id) ids.add(edge.from);
  });
  return [...ids];
}

export function connectionCount(id: string): number {
  return networkEdges.filter((edge) => edge.from === id || edge.to === id).length;
}
