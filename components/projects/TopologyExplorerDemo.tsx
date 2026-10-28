"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Layer = "access" | "core" | "service";

type DemoNode = {
  id: string;
  label: string;
  layer: Layer;
  x: number;
  y: number;
  role: string;
  detail: string;
};

const layerMeta: Record<Layer, { label: string; short: string; color: string }> = {
  access: { label: "Erişim", short: "ACCESS", color: "#5fe3ff" },
  core: { label: "Çekirdek", short: "CORE", color: "#c6f26e" },
  service: { label: "Servis", short: "SERVICE", color: "#f2b36a" },
};

const nodes: DemoNode[] = [
  {
    id: "client-a",
    label: "CLIENT-A",
    layer: "access",
    x: 84,
    y: 88,
    role: "İstemci",
    detail: "Kablolu istemci. Erişim anahtarına bağlı örnek uç nokta.",
  },
  {
    id: "ap-01",
    label: "AP-01",
    layer: "access",
    x: 84,
    y: 200,
    role: "Kablosuz erişim",
    detail: "Kurumsal SSID yayını yapan örnek erişim noktası.",
  },
  {
    id: "client-b",
    label: "CLIENT-B",
    layer: "access",
    x: 84,
    y: 312,
    role: "İstemci",
    detail: "Kablosuz istemci. VLAN ataması erişim anahtarında yapılır.",
  },
  {
    id: "edge-fw",
    label: "EDGE-FW",
    layer: "core",
    x: 312,
    y: 72,
    role: "Kenar güvenlik duvarı",
    detail: "Segmentler arası politika uygulayan örnek kenar katmanı.",
  },
  {
    id: "core-sw",
    label: "CORE-SW",
    layer: "core",
    x: 312,
    y: 200,
    role: "Çekirdek switch",
    detail: "VLAN'lar arası yönlendirme ve toplama noktası.",
  },
  {
    id: "iam",
    label: "IAM",
    layer: "core",
    x: 312,
    y: 328,
    role: "Kimlik ve erişim",
    detail: "Oturum ve servis kimliklerinin doğrulandığı katman.",
  },
  {
    id: "api",
    label: "API",
    layer: "service",
    x: 540,
    y: 120,
    role: "Uygulama servisi",
    detail: "İstemci isteklerini karşılayan örnek API servisi.",
  },
  {
    id: "db",
    label: "DB",
    layer: "service",
    x: 540,
    y: 288,
    role: "Veri katmanı",
    detail: "Kalıcı verinin tutulduğu örnek veritabanı düğümü.",
  },
];

const edges: { from: string; to: string }[] = [
  { from: "client-a", to: "edge-fw" },
  { from: "client-a", to: "core-sw" },
  { from: "ap-01", to: "core-sw" },
  { from: "ap-01", to: "iam" },
  { from: "client-b", to: "core-sw" },
  { from: "client-b", to: "iam" },
  { from: "edge-fw", to: "core-sw" },
  { from: "core-sw", to: "iam" },
  { from: "core-sw", to: "api" },
  { from: "core-sw", to: "db" },
  { from: "iam", to: "api" },
  { from: "api", to: "db" },
  { from: "edge-fw", to: "api" },
];

const nodeMap = new Map(nodes.map((node) => [node.id, node]));

export function TopologyExplorerDemo() {
  const [selected, setSelected] = useState("core-sw");
  const [layer, setLayer] = useState<Layer | "all">("all");

  const node = nodeMap.get(selected) ?? null;

  const neighbors = useMemo(() => {
    const ids = new Set<string>();
    edges.forEach((edge) => {
      if (edge.from === selected) ids.add(edge.to);
      if (edge.to === selected) ids.add(edge.from);
    });
    return ids;
  }, [selected]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Katman filtresi">
          {(["all", "access", "core", "service"] as const).map((item) => {
            const active = layer === item;
            const label = item === "all" ? "Tümü" : layerMeta[item].label;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setLayer(item)}
                className={cn(
                  "border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                  active
                    ? "border-ink/30 bg-ink/[0.06] text-ink"
                    : "border-line text-faint hover:border-ink/20 hover:text-dim",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-amber">
          Örnek topoloji · 08 düğüm
        </span>
      </div>

      <div className="relative w-full overflow-hidden border border-line bg-[#080c10]">
        <div className="grid-bg-fine absolute inset-0 opacity-60" />
        <div className="relative aspect-[16/10] w-full">
          <svg
            viewBox="0 0 640 400"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {(["access", "core", "service"] as Layer[]).map((item, index) => (
              <g key={item}>
                <text
                  x={index === 0 ? 84 : index === 1 ? 312 : 540}
                  y="32"
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="9"
                  letterSpacing="2"
                  fill="rgba(233,237,240,0.32)"
                >
                  {layerMeta[item].short}
                </text>
                <line
                  x1={index === 0 ? 40 : index === 1 ? 268 : 496}
                  y1="48"
                  x2={index === 0 ? 128 : index === 1 ? 356 : 584}
                  y2="48"
                  stroke="rgba(233,237,240,0.1)"
                  strokeWidth="0.8"
                />
              </g>
            ))}

            {edges.map((edge) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const connected =
                edge.from === selected || edge.to === selected;
              const visible =
                layer === "all" || from.layer === layer || to.layer === layer;
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={connected ? "#5fe3ff" : "rgba(233,237,240,0.14)"}
                  strokeWidth={connected ? 1.4 : 0.8}
                  strokeDasharray={connected ? "4 7" : undefined}
                  className={connected ? "visual-dash" : undefined}
                  opacity={visible ? 1 : 0.25}
                />
              );
            })}
          </svg>

          {nodes.map((item) => {
            const isSelected = item.id === selected;
            const isNeighbor = neighbors.has(item.id);
            const muted = layer !== "all" && item.layer !== layer && !isSelected;
            const color = layerMeta[item.layer].color;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(item.id)}
                style={{
                  left: `${(item.x / 640) * 100}%`,
                  top: `${(item.y / 400) * 100}%`,
                }}
                className={cn(
                  "group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-offset-4",
                  muted ? "opacity-35" : "opacity-100",
                )}
              >
                <span
                  className={cn(
                    "relative grid place-items-center border bg-[#0b1014] transition-all duration-200",
                    isSelected
                      ? "h-9 w-9 rotate-45 border-cyan"
                      : "h-6 w-6 rotate-45 border-ink/25 group-hover:border-ink/60",
                  )}
                  style={
                    isSelected || isNeighbor
                      ? { borderColor: color, boxShadow: `0 0 0 4px ${color}14` }
                      : undefined
                  }
                >
                  <span
                    className={cn(
                      "-rotate-45",
                      isSelected ? "h-2 w-2" : "h-1 w-1",
                    )}
                    style={{ backgroundColor: color }}
                  />
                </span>
                <span
                  className={cn(
                    "absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] transition-colors",
                    isSelected
                      ? "text-ink"
                      : isNeighbor
                        ? "text-dim"
                        : "text-faint",
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 border border-line bg-ink/[0.015] p-3.5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
              {node?.label}
            </span>
            {node ? (
              <span
                className="border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em]"
                style={{
                  color: layerMeta[node.layer].color,
                  borderColor: `${layerMeta[node.layer].color}55`,
                }}
              >
                {layerMeta[node.layer].label}
              </span>
            ) : null}
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
              {neighbors.size + 1} düğüm bağlı
            </span>
          </div>
          <p className="mt-2 max-w-lg text-[12px] leading-relaxed text-dim">
            {node?.detail ?? "Bir düğüm seçin."}
          </p>
        </div>
        <dl className="flex shrink-0 gap-5 border-t border-line pt-2.5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div>
            <dt className="font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
              Rol
            </dt>
            <dd className="mt-1 text-[11px] text-ink/80">{node?.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
              Bağlantı
            </dt>
            <dd className="mt-1 font-mono text-[11px] text-ink/80">
              {neighbors.size}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
