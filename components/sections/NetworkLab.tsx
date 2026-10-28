"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TopologyFallback } from "@/components/three/TopologyFallback";
import { useDeviceProfile } from "@/lib/hooks/useDeviceProfile";
import { useNearViewport } from "@/lib/hooks/useNearViewport";
import {
  connectionCount,
  connectedNodeIds,
  groupMeta,
  networkEdges,
  networkNodes,
  nodeMap,
  type NodeGroup,
} from "@/lib/network";
import { cn } from "@/lib/utils";

const LabTopology = dynamic(
  () => import("@/components/three/LabTopology").then((mod) => mod.LabTopology),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 p-6">
        <TopologyFallback />
      </div>
    ),
  },
);

const ALL_GROUPS: NodeGroup[] = ["ai", "security", "infra", "web"];

const layerLabel: Record<string, string> = {
  edge: "Kenar",
  core: "Çekirdek",
  service: "Servis",
};

export function NetworkLab() {
  const profile = useDeviceProfile();
  const { ref: sceneRef, near } = useNearViewport<HTMLDivElement>();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [groups, setGroups] = useState<NodeGroup[]>(ALL_GROUPS);
  const [resetSignal, setResetSignal] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const displayId = hovered ?? selected;
  const node = displayId ? nodeMap.get(displayId) : null;
  const meta = node ? groupMeta[node.group] : null;

  const activeIds = useMemo(
    () => (displayId ? new Set(connectedNodeIds(displayId)) : null),
    [displayId],
  );

  const groupCounts = useMemo(() => {
    const counts: Record<NodeGroup, number> = {
      ai: 0,
      security: 0,
      infra: 0,
      web: 0,
    };
    networkNodes.forEach((item) => {
      counts[item.group] += 1;
    });
    return counts;
  }, []);

  const toggleGroup = (group: NodeGroup) => {
    setGroups((previous) => {
      if (previous.includes(group)) {
        if (previous.length === 1) return previous;
        return previous.filter((item) => item !== group);
      }
      return ALL_GROUPS.filter(
        (item) => previous.includes(item) || item === group,
      );
    });
  };

  const selectNode = (id: string) => {
    setSelected((current) => (current === id ? null : id));
  };

  return (
    <section
      id="laboratuvar"
      aria-labelledby="laboratuvar-title"
      className="relative border-t border-line bg-[#070a0d] py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHeader
          index="03"
          eyebrow="Network Laboratory"
          id="laboratuvar-title"
          title={[
            <span key="line-1">Ağ topolojisini</span>,
            <span key="line-2">
              <span className="serif text-cyan">elle</span> keşfedin.
            </span>,
          ]}
          description="Yapay zekâ, güvenlik, altyapı ve web katmanlarını tek bir örnek graf üzerinde birleştiren interaktif bir demonstrasyon. Gerçek bir izleme sistemine bağlı değildir."
          note="İnteraktif demo · örnek graf · gerçek sistem bağlantısı yok"
        />

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative border border-line bg-[#070a0d]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 bg-amber" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber/90">
                    İnteraktif demo · örnek graf
                  </span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                  {networkNodes.length} düğüm / {networkEdges.length} bağlantı
                </span>
              </div>

              <div
                ref={sceneRef}
                className="relative h-[420px] sm:h-[520px] lg:h-[600px]"
              >
                <p className="sr-only">
                  Etkileşimli üç boyutlu ağ topolojisi. Sahne fare veya dokunmayla
                  döndürülebilir ve yakınlaştırılabilir. Klavye ile incelemek
                  için sağdaki düğüm dizinini kullanın.
                </p>
                <div className="absolute inset-0" aria-hidden="true">
                  {profile.ready && near ? (
                    <LabTopology
                      hovered={hovered}
                      selected={selected}
                      onHover={setHovered}
                      onSelect={selectNode}
                      activeGroups={groups}
                      resetSignal={resetSignal}
                      autoRotate={autoRotate}
                      reducedMotion={profile.reducedMotion}
                      isMobile={profile.isMobile}
                    />
                  ) : (
                    <div className="absolute inset-0 p-6">
                      <TopologyFallback />
                    </div>
                  )}
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_35%,rgba(7,10,13,0.55)_100%)]"
                />

                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setResetSignal((value) => value + 1)}
                    aria-label="Kamera görünümünü sıfırla"
                    className="grid h-8 w-8 place-items-center border border-line bg-void/70 text-dim backdrop-blur-sm transition-colors hover:border-ink/35 hover:text-ink"
                  >
                    <ResetIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoRotate((value) => !value)}
                    aria-pressed={autoRotate}
                    aria-label="Otomatik döndürmeyi aç veya kapat"
                    className={cn(
                      "grid h-8 w-8 place-items-center border backdrop-blur-sm transition-colors",
                      autoRotate
                        ? "border-cyan/50 bg-cyan/10 text-cyan"
                        : "border-line bg-void/70 text-dim hover:border-ink/35 hover:text-ink",
                    )}
                  >
                    <RotateIcon />
                  </button>
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-4 font-mono text-[8px] uppercase tracking-[0.18em] text-faint sm:flex">
                  <span>Sürükle: döndür</span>
                  <span className="h-2.5 w-px bg-line" />
                  <span>Tekerlek: zoom</span>
                </div>

                <div
                  className={cn(
                    "pointer-events-none absolute bottom-3 left-3 hidden w-[17.5rem] border border-line bg-void/85 px-3.5 py-3 backdrop-blur-sm transition-opacity duration-200 md:block",
                    node ? "opacity-100" : "opacity-70",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-faint">
                      {node ? "Düğüm" : "Topoloji"}
                    </span>
                    <span
                      className="h-1.5 w-1.5"
                      style={{
                        backgroundColor: meta ? meta.color : "#5fe3ff",
                        opacity: node ? 1 : 0.5,
                      }}
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                    {node ? `${node.label} — ${node.role}` : "Örnek ağ grafi"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-dim">
                    {node
                      ? node.detail
                      : "Düğümlerin üzerine gelin veya seçin. Bağlı yollar vurgulanır."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3.5 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                <span>WebGL / react three fiber</span>
                <span>Kamera kontrollü · örnek veri</span>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4">
            <div className="order-2 panel p-4 lg:order-1">
              <div className="flex items-center justify-between">
                <p className="label">Görünür gruplar</p>
                <button
                  type="button"
                  onClick={() => {
                    setGroups(ALL_GROUPS);
                    setSelected(null);
                  }}
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-ink"
                >
                  Tümünü göster
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {ALL_GROUPS.map((group) => {
                  const groupInfo = groupMeta[group];
                  const enabled = groups.includes(group);
                  return (
                    <button
                      key={group}
                      type="button"
                      aria-pressed={enabled}
                      onClick={() => toggleGroup(group)}
                      className={cn(
                        "flex items-center justify-between gap-2 border px-2.5 py-2.5 text-left transition-colors duration-200",
                        enabled
                          ? "border-ink/25 bg-ink/[0.045]"
                          : "border-line text-faint hover:border-ink/15",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 shrink-0"
                          style={{
                            backgroundColor: groupInfo.color,
                            opacity: enabled ? 1 : 0.3,
                          }}
                        />
                        <span
                          className={cn(
                            "font-mono text-[9px] uppercase tracking-[0.12em]",
                            enabled ? "text-ink/85" : "text-faint",
                          )}
                        >
                          {groupInfo.label}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[9px]",
                          enabled ? "text-dim" : "text-faint",
                        )}
                      >
                        {groupCounts[group]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 font-mono text-[8px] leading-relaxed tracking-[0.12em] text-faint">
                Grup kapatıldığında ilgili düğümler sahnede soluklaşır. En az bir
                grup açık kalır.
              </p>
            </div>

            <div className="order-1 panel min-h-[13.5rem] p-4 lg:order-2">
              <div className="flex items-center justify-between gap-3">
                <p className="label">{selected ? "Seçili düğüm" : "Düğüm bilgisi"}</p>
                {selected ? (
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-ink"
                  >
                    Temizle
                  </button>
                ) : (
                  <span className="h-1.5 w-1.5 bg-cyan/50" />
                )}
              </div>

              {node && meta ? (
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-ink">
                      {node.label}
                    </p>
                    <span
                      className="border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em]"
                      style={{
                        color: meta.color,
                        borderColor: `${meta.color}55`,
                        backgroundColor: meta.soft,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-dim">{node.role}</p>
                  <p className="mt-2.5 text-[12px] leading-relaxed text-dim">
                    {node.detail}
                  </p>
                  <dl className="mt-3 flex items-center gap-5 border-t border-line pt-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                    <div className="flex items-center gap-1.5">
                      <dt>Katman</dt>
                      <dd className="text-ink/75">{layerLabel[node.layer]}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt>Bağlantı</dt>
                      <dd className="text-ink/75">{connectionCount(node.id)}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-[12px] leading-relaxed text-dim">
                    Bir düğüm seçerek rolünü, katmanını ve bağlantı sayısını
                    okuyabilirsiniz. Sahnedeki bir düğüme dokunun veya aşağıdaki
                    dizini kullanın.
                  </p>
                  <div className="mt-4 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                    <span className="h-1 w-1 bg-cyan" />
                    Bekleniyor / düğüm seçilmedi
                  </div>
                </div>
              )}
            </div>

            <div className="order-3 panel p-4">
              <div className="flex items-center justify-between">
                <p className="label">Düğüm dizini</p>
                <span className="font-mono text-[9px] tracking-[0.14em] text-faint">
                  {networkNodes.length.toString().padStart(2, "0")}
                </span>
              </div>

              <ul className="mt-2 max-h-[17rem] overflow-y-auto pr-1">
                {networkNodes.map((item) => {
                  const itemMeta = groupMeta[item.group];
                  const isSelected = selected === item.id;
                  const isHovered = hovered === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => selectNode(item.id)}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(item.id)}
                        onBlur={() => setHovered(null)}
                        className={cn(
                          "flex w-full items-center gap-2.5 border-b border-line-soft py-2 text-left transition-colors duration-150",
                          isSelected || isHovered
                            ? "text-ink"
                            : "text-dim hover:text-ink",
                        )}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0"
                          style={{ backgroundColor: itemMeta.color }}
                        />
                        <span className="min-w-0 flex-1 truncate font-mono text-[9px] uppercase tracking-[0.12em]">
                          {item.label}
                        </span>
                        <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                          {itemMeta.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>

        <p className="mt-5 max-w-2xl font-mono text-[9px] leading-relaxed tracking-[0.12em] text-faint">
          Bu bölüm bir tasarım ve etkileşim çalışmasıdır. Düğümler, bağlantılar ve
          veri akışları temsilîdir; gerçek bir ağdan alınmış izleme verisi
          içermez.
        </p>
      </div>
    </section>
  );
}

function ResetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7a4.5 4.5 0 1 0 1.4-3.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M2.5 2v2.6h2.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RotateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <ellipse
        cx="7"
        cy="7"
        rx="5"
        ry="2.4"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="7" cy="7" r="1.4" fill="currentColor" />
      <path
        d="M11.6 5.2 12 3.4l-1.8.3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
