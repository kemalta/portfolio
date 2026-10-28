"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Severity = "critical" | "high" | "medium" | "low";
type Status = "open" | "triage" | "closed";

type Alert = {
  id: string;
  title: string;
  source: string;
  rule: string;
  time: string;
  severity: Severity;
  status: Status;
  summary: string;
  evidence: string[];
};

const severityMeta: Record<
  Severity,
  { label: string; color: string; weight: number }
> = {
  critical: { label: "Kritik", color: "#f2b36a", weight: 3 },
  high: { label: "Yüksek", color: "#e9edf0", weight: 2 },
  medium: { label: "Orta", color: "#5fe3ff", weight: 1 },
  low: { label: "Düşük", color: "rgba(233,237,240,0.5)", weight: 0 },
};

const statusMeta: Record<Status, { label: string; className: string }> = {
  open: { label: "Açık", className: "text-amber border-amber/40" },
  triage: { label: "Triyajda", className: "text-cyan border-cyan/40" },
  closed: { label: "Kapalı", className: "text-faint border-line" },
};

const INITIAL: Alert[] = [
  {
    id: "AL-4821",
    title: "Yetkisiz erişim denemesi",
    source: "iam.edge",
    rule: "access.policy / deny-spike",
    time: "14:02",
    severity: "critical",
    status: "open",
    summary:
      "Aynı servis hesabından kısa aralıkla çok sayıda başarısız yetkilendirme denemesi gözlemlendi. Örnek olay kaydıdır.",
    evidence: [
      "12 başarısız istek / 60 sn",
      "Kaynak: servis hesabı svc-report",
      "Politika: least-privilege",
    ],
  },
  {
    id: "AL-4818",
    title: "Anormal oturum açma",
    source: "auth.gw",
    rule: "session.baseline / deviation",
    time: "13:48",
    severity: "high",
    status: "triage",
    summary:
      "Oturum açma saatleri ve istemci parmak izi, hesabın örnek davranış taban çizgisinden sapıyor.",
    evidence: [
      "Yeni istemci parmak izi",
      "Olağan dışı saat aralığı",
      "MFA doğrulaması tamamlandı",
    ],
  },
  {
    id: "AL-4809",
    title: "Politika dışı bağlantı",
    source: "fw.core",
    rule: "egress.allowlist / mismatch",
    time: "13:21",
    severity: "medium",
    status: "open",
    summary:
      "Bir uygulama düğümü, tanımlı çıkış listesinde yer almayan bir hedefe bağlantı denedi. Örnek kayıt.",
    evidence: [
      "Hedef: 10.24.8.0/24",
      "Protokol: TCP / 443",
      "Kural: egress-deny",
    ],
  },
  {
    id: "AL-4795",
    title: "Yedekleme doğrulama hatası",
    source: "backup.job",
    rule: "backup.verify / checksum",
    time: "12:54",
    severity: "high",
    status: "open",
    summary:
      "Örnek yedekleme işi sağlama toplamı doğrulamasında uyuşmazlık bildirdi. Otomatik yeniden deneme sıraya alındı.",
    evidence: ["Checksum uyuşmazlığı", "Hedef: storage/b", "Yeniden deneme: 1"],
  },
  {
    id: "AL-4788",
    title: "DNS sorgu hacmi artışı",
    source: "dns.resolver",
    rule: "dns.volume / threshold",
    time: "12:20",
    severity: "medium",
    status: "closed",
    summary:
      "Bir istemci grubundan gelen DNS sorguları eşiği aştı. Örnek olay, planlı tarama penceresiyle eşleşti.",
    evidence: ["3.2× taban hacim", "İstemci grubu: lab", "Pencere: 12:00–12:30"],
  },
  {
    id: "AL-4771",
    title: "Yapılandırma sapması",
    source: "config.audit",
    rule: "baseline.diff / drift",
    time: "11:36",
    severity: "low",
    status: "triage",
    summary:
      "Örnek bir sunucuda tanımlı yapılandırma taban çizgisinden sapan iki alan tespit edildi.",
    evidence: ["2 alan farklı", "Sunucu: SRV-03", "Değişiklik kaydı yok"],
  },
];

export function SocDemo() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL);
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [selectedId, setSelectedId] = useState(INITIAL[0].id);

  const filtered = useMemo(
    () =>
      alerts.filter((alert) => filter === "all" || alert.severity === filter),
    [alerts, filter],
  );

  const selected = alerts.find((alert) => alert.id === selectedId) ?? null;
  const openCount = alerts.filter((alert) => alert.status !== "closed").length;
  const criticalCount = alerts.filter(
    (alert) => alert.severity === "critical" && alert.status !== "closed",
  ).length;

  const setStatus = (status: Status) => {
    if (!selected) return;
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === selected.id ? { ...alert, status } : alert,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Önem filtresi">
          {(["all", "critical", "high", "medium", "low"] as const).map((item) => {
            const active = filter === item;
            const count =
              item === "all"
                ? alerts.length
                : alerts.filter((alert) => alert.severity === item).length;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item)}
                className={cn(
                  "border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                  active
                    ? "border-ink/30 bg-ink/[0.06] text-ink"
                    : "border-line text-faint hover:border-ink/20 hover:text-dim",
                )}
              >
                {item === "all" ? "Tümü" : severityMeta[item].label}
                <span className="ml-1.5 text-faint">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
          <span>
            Açık <span className="text-ink/80">{openCount}</span>
          </span>
          <span>
            Kritik <span className="text-amber">{criticalCount}</span>
          </span>
          <span className="border border-amber/40 px-1.5 py-0.5 text-amber">
            Temsilî
          </span>
        </div>
      </div>

      <div className="grid gap-2.5 lg:grid-cols-[1.1fr_1fr]">
        <div className="border border-line bg-ink/[0.015]">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
              Uyarı kuyruğu
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
              {filtered.length.toString().padStart(2, "0")} kayıt
            </span>
          </div>
          <ul className="max-h-[300px] overflow-y-auto">
            {filtered.map((alert) => {
              const isSelected = alert.id === selectedId;
              const meta = severityMeta[alert.severity];
              return (
                <li key={alert.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(alert.id)}
                    className={cn(
                      "relative flex w-full items-start gap-3 border-b border-line-soft px-3 py-3 text-left transition-colors",
                      isSelected
                        ? "bg-ink/[0.05]"
                        : "hover:bg-ink/[0.025]",
                    )}
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-[2px]"
                      style={{
                        backgroundColor: meta.color,
                        opacity: isSelected ? 1 : 0.45,
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[8px] tracking-[0.1em] text-faint">
                          {alert.id}
                        </span>
                        <span
                          className="font-mono text-[8px] uppercase tracking-[0.1em]"
                          style={{ color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        {alert.status === "closed" ? (
                          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                            · kapalı
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block truncate text-[12px]",
                          isSelected ? "text-ink" : "text-ink/75",
                        )}
                      >
                        {alert.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                        {alert.source} · {alert.time}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 ? (
              <li className="px-3 py-8 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                Bu filtrede kayıt yok
              </li>
            ) : null}
          </ul>
        </div>

        <div className="border border-line bg-ink/[0.015]">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
              Olay detayı
            </span>
            {selected ? (
              <span
                className={cn(
                  "border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em]",
                  statusMeta[selected.status].className,
                )}
              >
                {statusMeta[selected.status].label}
              </span>
            ) : null}
          </div>

          {selected ? (
            <div className="px-3.5 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[9px] tracking-[0.1em] text-faint">
                  {selected.id}
                </span>
                <span
                  className="font-mono text-[8px] uppercase tracking-[0.12em]"
                  style={{ color: severityMeta[selected.severity].color }}
                >
                  {severityMeta[selected.severity].label}
                </span>
              </div>
              <h4 className="mt-1.5 font-display text-[15px] font-medium leading-snug tracking-[-0.01em] text-ink">
                {selected.title}
              </h4>
              <p className="mt-2 text-[12px] leading-relaxed text-dim">
                {selected.summary}
              </p>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-2.5">
                {[
                  { label: "Kaynak", value: selected.source },
                  { label: "Kural", value: selected.rule },
                  { label: "Saat", value: selected.time },
                  { label: "Durum", value: statusMeta[selected.status].label },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[7px] uppercase tracking-[0.14em] text-faint">
                      {row.label}
                    </dt>
                    <dd className="mt-0.5 truncate font-mono text-[9px] tracking-[0.04em] text-ink/80">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-3 space-y-1.5 border-t border-line pt-2.5">
                {selected.evidence.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 font-mono text-[8.5px] leading-relaxed tracking-[0.04em] text-dim"
                  >
                    <span className="h-1 w-1 shrink-0 bg-cyan/60" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-3.5 flex flex-wrap gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => setStatus("triage")}
                  className="border border-cyan/40 bg-cyan/[0.07] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan transition-colors hover:bg-cyan/[0.14]"
                >
                  Triyaj et
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("closed")}
                  className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-ink/30 hover:text-ink"
                >
                  Kapat
                </button>
                {selected.status === "closed" ? (
                  <button
                    type="button"
                    onClick={() => setStatus("open")}
                    className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-ink/30 hover:text-ink"
                  >
                    Yeniden aç
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="px-3.5 py-8 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              Kayıt seçin
            </p>
          )}
        </div>
      </div>

      <p className="font-mono text-[8px] leading-relaxed tracking-[0.12em] text-faint">
        Tüm uyarılar temsilîdir. Triyaj aksiyonları yalnızca bu arayüzün yerel
        durumunu değiştirir; gerçek bir SIEM veya olay yönetim sistemine bağlı
        değildir.
      </p>
    </div>
  );
}
