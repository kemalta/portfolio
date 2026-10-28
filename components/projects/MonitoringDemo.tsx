"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clamp, seededRandom } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Series = {
  cpu: number[];
  ram: number[];
  net: number[];
  latency: number[];
};

const LENGTH = 24;

function buildSeries(): Series {
  const random = seededRandom(7319);
  const make = (base: number, spread: number, min: number, max: number) =>
    Array.from({ length: LENGTH }, (_, index) => {
      const wave = Math.sin(index / 2.6) * spread * 0.55;
      return clamp(
        base + wave + (random() - 0.5) * spread,
        min,
        max,
      );
    });

  return {
    cpu: make(44, 18, 6, 96),
    ram: make(63, 10, 24, 94),
    net: make(184, 90, 20, 420),
    latency: make(26, 14, 6, 74),
  };
}

function nextValue(value: number, min: number, max: number, step: number) {
  return clamp(value + (Math.random() - 0.5) * step, min, max);
}

function Sparkline({
  values,
  color,
  className,
}: {
  values: number[];
  color: string;
  className?: string;
}) {
  const { line, area } = useMemo(() => {
    const max = Math.max(...values) * 1.1 || 1;
    const min = Math.min(...values) * 0.9;
    const span = max - min || 1;
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 32 - ((value - min) / span) * 28;
      return [x, y] as const;
    });
    const linePath = points
      .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(" ");
    return {
      line: linePath,
      area: `${linePath} L100 34 L0 34 Z`,
    };
  }, [values]);

  return (
    <svg
      viewBox="0 0 100 36"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-9 w-full", className)}
    >
      <path d={area} fill={color} opacity="0.09" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MainChart({ values }: { values: number[] }) {
  const max = Math.max(...values) * 1.25 || 1;
  const points = values.map((value, index) => {
    const x = 8 + (index / (values.length - 1)) * 304;
    const y = 104 - (value / max) * 88;
    return [x, y] as const;
  });
  const line = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L312 104 L8 104 Z`;

  return (
    <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
      {[24, 48, 72, 96].map((y) => (
        <line
          key={y}
          x1="8"
          x2="312"
          y1={y}
          y2={y}
          stroke="rgba(233,237,240,0.07)"
          strokeWidth="0.8"
        />
      ))}
      {[8, 84, 160, 236, 312].map((x) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1="16"
          y2="104"
          stroke="rgba(233,237,240,0.05)"
          strokeWidth="0.8"
        />
      ))}
      <path d={area} fill="rgba(95,227,255,0.07)" />
      <path
        d={line}
        fill="none"
        stroke="#5fe3ff"
        strokeWidth="1.4"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="2.4"
        fill="#5fe3ff"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="5"
        fill="none"
        stroke="rgba(95,227,255,0.35)"
        strokeWidth="0.8"
        className="visual-ping"
      />
    </svg>
  );
}

const servers = [
  { name: "SRV-01", zone: "app / eu-1", base: 38, state: "OK" },
  { name: "SRV-02", zone: "db / eu-1", base: 64, state: "OK" },
  { name: "SRV-03", zone: "worker / eu-2", base: 81, state: "YÜKSEK" },
];

export function MonitoringDemo() {
  const [series, setSeries] = useState<Series>(buildSeries);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setSeries((previous) => ({
        cpu: [...previous.cpu.slice(1), nextValue(previous.cpu[previous.cpu.length - 1], 8, 94, 14)],
        ram: [...previous.ram.slice(1), nextValue(previous.ram[previous.ram.length - 1], 30, 92, 6)],
        net: [...previous.net.slice(1), nextValue(previous.net[previous.net.length - 1], 30, 400, 80)],
        latency: [
          ...previous.latency.slice(1),
          nextValue(previous.latency[previous.latency.length - 1], 8, 72, 20),
        ],
      }));
    }, 1500);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const latest = {
    cpu: series.cpu[series.cpu.length - 1],
    ram: series.ram[series.ram.length - 1],
    net: series.net[series.net.length - 1],
    latency: series.latency[series.latency.length - 1],
  };

  const tiles = [
    { key: "cpu", label: "CPU", value: latest.cpu.toFixed(0), unit: "%", color: "#5fe3ff", values: series.cpu },
    { key: "ram", label: "RAM", value: latest.ram.toFixed(0), unit: "%", color: "#c6f26e", values: series.ram },
    { key: "net", label: "NETWORK", value: latest.net.toFixed(0), unit: "Mb/s", color: "#f2b36a", values: series.net },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "h-1.5 w-1.5",
              paused ? "bg-faint" : "animate-led bg-lime",
            )}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
            {paused ? "Akış duraklatıldı" : "Örnek akış · 1.5 sn"}
          </span>
          <span className="border border-amber/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-amber">
            Örnek veri
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-ink/30 hover:text-ink"
        >
          {paused ? "Devam et" : "Duraklat"}
        </button>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        {tiles.map((tile) => {
          const previous = tile.values[tile.values.length - 2] ?? tile.value;
          const previousNumber = Number(previous);
          const current = Number(tile.value);
          const delta = current - previousNumber;
          return (
            <div key={tile.key} className="border border-line bg-ink/[0.015] px-3.5 py-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                  {tile.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-[8px] tracking-[0.1em]",
                    delta > 0 ? "text-amber/80" : "text-lime/70",
                  )}
                >
                  {delta > 0 ? "+" : ""}
                  {delta.toFixed(1)}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-medium leading-none tracking-[-0.03em] text-ink">
                  {tile.value}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                  {tile.unit}
                </span>
              </div>
              <Sparkline values={tile.values} color={tile.color} className="mt-2.5" />
            </div>
          );
        })}
      </div>

      <div className="grid gap-2.5 lg:grid-cols-[1.65fr_1fr]">
        <div className="border border-line bg-ink/[0.015] px-3.5 pb-3 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
              Gecikme / ms
            </span>
            <span className="font-mono text-[9px] tracking-[0.12em] text-cyan">
              {latest.latency.toFixed(1)} ms
            </span>
          </div>
          <div className="mt-2 h-[132px]">
            <MainChart values={series.latency} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[7px] uppercase tracking-[0.14em] text-faint">
            <span>24 örnek önce</span>
            <span>şimdi</span>
          </div>
        </div>

        <div className="border border-line bg-ink/[0.015] px-3.5 py-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
              Sunucular
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
              03
            </span>
          </div>
          <ul className="mt-2.5 space-y-3">
            {servers.map((server, index) => {
              const load = Math.round(
                clamp(
                  server.base + Math.sin(index + latest.cpu / 18) * 6,
                  8,
                  96,
                ),
              );
              return (
                <li key={server.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-1.5 w-1.5",
                          server.state === "OK" ? "bg-lime/80" : "bg-amber",
                        )}
                      />
                      <span className="font-mono text-[9px] tracking-[0.1em] text-ink/80">
                        {server.name}
                      </span>
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                      {server.state}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-px flex-1 bg-line">
                      <div
                        className="h-px"
                        style={{
                          width: `${load}%`,
                          backgroundColor:
                            server.state === "OK" ? "#c6f26e" : "#f2b36a",
                          opacity: 0.7,
                          transition: "width 700ms cubic-bezier(0.23,1,0.32,1)",
                        }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-[8px] text-faint">
                      {load}%
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-faint/70">
                    {server.zone}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="font-mono text-[8px] leading-relaxed tracking-[0.12em] text-faint">
        Tüm değerler tarayıcıda üretilen temsilî verilerdir. Gerçek bir sunucuya,
        izleme ajanına veya metrik servisine bağlantı yoktur.
      </p>
    </div>
  );
}
