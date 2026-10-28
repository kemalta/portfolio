import type { ReactNode } from "react";
import type { ProjectVisual } from "@/lib/site";
import { cn } from "@/lib/utils";

const mono = "font-mono";
const line = "rgba(233,237,240,0.14)";
const faint = "rgba(233,237,240,0.42)";
const dim = "rgba(233,237,240,0.65)";

function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 640 400"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      className={cn("h-full w-full", className)}
    >
      {children}
    </svg>
  );
}

function TopologyPreview() {
  const outer = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 320 + Math.cos(angle) * 132,
      y: 200 + Math.sin(angle) * 112,
      id: index,
    };
  });

  const labels = ["EDGE", "IAM", "API", "AI", "SIEM", "DB", "WEB", "NET"];

  return (
    <Shell>
      <text x="40" y="38" className={mono} fontSize="9" letterSpacing="2.4" fill={faint}>
        SAMPLE TOPOLOGY / 3 LAYERS
      </text>
      <text x="600" y="38" className={mono} fontSize="9" letterSpacing="2" fill="rgba(95,227,255,0.7)" textAnchor="end">
        09 NODES
      </text>

      {[70, 112, 156].map((r) => (
        <circle
          key={r}
          cx="320"
          cy="200"
          r={r * 0.92}
          fill="none"
          stroke="rgba(233,237,240,0.08)"
          strokeWidth="1"
          strokeDasharray="2 7"
        />
      ))}

      <g stroke="rgba(95,227,255,0.18)" strokeWidth="1">
        {outer.map((node) => (
          <line key={`core-${node.id}`} x1="320" y1="200" x2={node.x} y2={node.y} />
        ))}
        {outer.map((node, index) => {
          const next = outer[(index + 1) % outer.length];
          return (
            <line key={`ring-${node.id}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y} />
          );
        })}
      </g>

      <circle
        cx="320"
        cy="200"
        r="156"
        fill="none"
        stroke="rgba(95,227,255,0.35)"
        strokeWidth="1"
        strokeDasharray="3 12"
        className="visual-dash"
      />

      {outer.map((node, index) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r="14"
            fill="rgba(95,227,255,0.05)"
            stroke="rgba(95,227,255,0.28)"
            strokeWidth="0.8"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={index === 3 ? 4.6 : 3.4}
            fill={index === 3 ? "#c6f26e" : "#5fe3ff"}
            className={index % 3 === 0 ? "visual-pulse" : undefined}
            style={{ animationDelay: `${index * 0.3}s` }}
          />
          <text
            x={node.x}
            y={node.y + 30}
            className={mono}
            fontSize="8"
            letterSpacing="1.4"
            fill={dim}
            textAnchor="middle"
          >
            {labels[index]}
          </text>
        </g>
      ))}

      <g transform="translate(320 200)">
        <polygon points="0,-17 17,0 0,17 -17,0" fill="#0b1014" stroke="#5fe3ff" strokeWidth="1.2" />
        <polygon points="0,-8 8,0 0,8 -8,0" fill="#5fe3ff" opacity="0.85" />
      </g>

      <g transform="translate(40 344)">
        {[
          { label: "ERİŞİM", color: "#5fe3ff" },
          { label: "ÇEKİRDEK", color: "#c6f26e" },
          { label: "SERVİS", color: "#f2b36a" },
        ].map((item, index) => (
          <g key={item.label} transform={`translate(${index * 96} 0)`}>
            <rect x="0" y="-5" width="6" height="6" fill={item.color} opacity="0.85" />
            <text x="14" y="0" className={mono} fontSize="8" letterSpacing="1.4" fill={faint}>
              {item.label}
            </text>
          </g>
        ))}
      </g>

      <text x="600" y="358" className={mono} fontSize="8" letterSpacing="1.6" fill={faint} textAnchor="end">
        TIKLA / DÜĞÜM SEÇ
      </text>
    </Shell>
  );
}

function MonitoringPreview() {
  const tiles = [
    { label: "CPU", value: "42", unit: "%", width: 86, color: "#5fe3ff" },
    { label: "RAM", value: "68", unit: "%", width: 128, color: "#c6f26e" },
    { label: "NET", value: "128", unit: "Mb/s", width: 104, color: "#f2b36a" },
  ];

  const servers = [
    { name: "SRV-01", value: "OK", width: 118, color: "#c6f26e" },
    { name: "SRV-02", value: "OK", width: 96, color: "#c6f26e" },
    { name: "SRV-03", value: "DEGRADED", width: 64, color: "#f2b36a" },
  ];

  return (
    <Shell>
      <text x="40" y="38" className={mono} fontSize="9" letterSpacing="2.4" fill={faint}>
        INFRASTRUCTURE / SAMPLE FEED
      </text>
      <text x="600" y="38" className={mono} fontSize="9" letterSpacing="2" fill="#f2b36a" textAnchor="end">
        ÖRNEK VERİ
      </text>

      {tiles.map((tile, index) => (
        <g key={tile.label} transform={`translate(${40 + index * 190} 62)`}>
          <rect width="170" height="82" fill="rgba(233,237,240,0.02)" stroke={line} strokeWidth="0.8" />
          <text x="14" y="22" className={mono} fontSize="8" letterSpacing="1.8" fill={faint}>
            {tile.label}
          </text>
          <text x="14" y="54" className="font-display" fontSize="30" fontWeight="600" fill="#e9edf0">
            {tile.value}
          </text>
          <text x="14" y="70" className={mono} fontSize="7" letterSpacing="1.4" fill={faint}>
            {tile.unit}
          </text>
          <rect x="14" y="60" width="142" height="3" fill="rgba(233,237,240,0.08)" />
          <rect x="14" y="60" width={tile.width} height="3" fill={tile.color} opacity="0.8" />
        </g>
      ))}

      <g transform="translate(40 166)">
        <rect width="384" height="168" fill="rgba(233,237,240,0.015)" stroke={line} strokeWidth="0.8" />
        <text x="14" y="22" className={mono} fontSize="8" letterSpacing="1.8" fill={faint}>
          LATENCY / LAST 24 SAMPLES
        </text>
        {[46, 74, 102, 130].map((y) => (
          <line key={y} x1="14" y1={y} x2="370" y2={y} stroke="rgba(233,237,240,0.06)" strokeWidth="0.7" />
        ))}
        <path
          d="M14 132 L42 124 L70 128 L98 112 L126 118 L154 96 L182 104 L210 88 L238 96 L266 76 L294 84 L322 66 L350 74 L370 60 L370 150 L14 150 Z"
          fill="rgba(95,227,255,0.08)"
        />
        <path
          d="M14 132 L42 124 L70 128 L98 112 L126 118 L154 96 L182 104 L210 88 L238 96 L266 76 L294 84 L322 66 L350 74 L370 60"
          fill="none"
          stroke="#5fe3ff"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="370" cy="60" r="3" fill="#5fe3ff" className="visual-pulse" />
        <text x="370" y="50" className={mono} fontSize="7" letterSpacing="1.2" fill="#5fe3ff" textAnchor="end">
          12.4ms
        </text>
      </g>

      <g transform="translate(440 166)">
        <rect width="160" height="168" fill="rgba(233,237,240,0.015)" stroke={line} strokeWidth="0.8" />
        <text x="14" y="22" className={mono} fontSize="8" letterSpacing="1.8" fill={faint}>
          SERVERS
        </text>
        {servers.map((server, index) => (
          <g key={server.name} transform={`translate(14 ${44 + index * 40})`}>
            <circle cx="3" cy="3" r="2.4" fill={server.color} opacity="0.9" />
            <text x="14" y="6" className={mono} fontSize="8" letterSpacing="1.2" fill={dim}>
              {server.name}
            </text>
            <text x="132" y="6" className={mono} fontSize="7" letterSpacing="1" fill={server.color} textAnchor="end">
              {server.value}
            </text>
            <rect x="0" y="14" width="132" height="2.4" fill="rgba(233,237,240,0.08)" />
            <rect x="0" y="14" width={server.width} height="2.4" fill={server.color} opacity="0.65" />
          </g>
        ))}
      </g>

      <text x="40" y="362" className={mono} fontSize="8" letterSpacing="1.6" fill={faint}>
        PENCERE 24 ÖRNEK · TARAYICIDA ÜRETİLİR
      </text>
    </Shell>
  );
}

function SocPreview() {
  const alerts = [
    { id: "4821", title: "Yetkisiz erişim denemesi", source: "iam.edge", time: "14:02", severity: "kritik", color: "#f2b36a", width: 118 },
    { id: "4818", title: "Anormal oturum açma", source: "auth.gw", time: "13:48", severity: "yüksek", color: "#f2b36a", width: 88 },
    { id: "4809", title: "Politika dışı bağlantı", source: "fw.core", time: "13:21", severity: "orta", color: "#5fe3ff", width: 58 },
  ];

  return (
    <Shell>
      <text x="40" y="38" className={mono} fontSize="9" letterSpacing="2.4" fill={faint}>
        SECURITY OPERATIONS / TRIAGE
      </text>
      <text x="600" y="38" className={mono} fontSize="9" letterSpacing="2" fill={faint} textAnchor="end">
        TEMSİLİ OLAYLAR
      </text>

      <rect x="40" y="58" width="330" height="286" fill="rgba(233,237,240,0.015)" stroke={line} strokeWidth="0.8" />
      <text x="56" y="82" className={mono} fontSize="8" letterSpacing="1.8" fill={faint}>
        UYARI KUYRUĞU
      </text>

      {alerts.map((alert, index) => (
        <g key={alert.id} transform={`translate(52 ${100 + index * 78})`}>
          <rect width="306" height="64" fill={index === 0 ? "rgba(242,179,106,0.06)" : "rgba(233,237,240,0.015)"} stroke={index === 0 ? "rgba(242,179,106,0.35)" : "rgba(233,237,240,0.08)"} strokeWidth="0.7" />
          <rect x="0" y="0" width="3" height="64" fill={alert.color} opacity={index === 0 ? 0.95 : 0.55} />
          <text x="16" y="21" className={mono} fontSize="8" letterSpacing="1.4" fill={faint}>
            #{alert.id} · {alert.source}
          </text>
          <text x="16" y="39" className="font-display" fontSize="13" fontWeight="500" fill="#e9edf0">
            {alert.title}
          </text>
          <text x="16" y="54" className={mono} fontSize="7" letterSpacing="1.2" fill={alert.color}>
            {alert.severity.toUpperCase()}
          </text>
          <text x="290" y="21" className={mono} fontSize="7" letterSpacing="1" fill={faint} textAnchor="end">
            {alert.time}
          </text>
        </g>
      ))}

      <g transform="translate(392 58)">
        <rect width="208" height="286" fill="rgba(233,237,240,0.02)" stroke={line} strokeWidth="0.8" />
        <text x="18" y="26" className={mono} fontSize="8" letterSpacing="1.8" fill={faint}>
          OLAY #4821
        </text>
        <circle cx="186" cy="22" r="12" fill="none" stroke="rgba(242,179,106,0.4)" strokeWidth="1" />
        <circle cx="186" cy="22" r="5" fill="#f2b36a" opacity="0.8" />
        {[
          { label: "KAYNAK", value: "iam.edge" },
          { label: "KURAL", value: "access.policy" },
          { label: "DURUM", value: "triyaj" },
          { label: "ÖNCELİK", value: "P1" },
        ].map((row, index) => (
          <g key={row.label} transform={`translate(18 ${50 + index * 26})`}>
            <text className={mono} fontSize="7.5" letterSpacing="1.4" fill={faint}>
              {row.label}
            </text>
            <text x="94" className={mono} fontSize="8" letterSpacing="1.2" fill={dim}>
              {row.value}
            </text>
          </g>
        ))}
        <line x1="18" y1="168" x2="190" y2="168" stroke={line} strokeWidth="0.7" />
        <text x="18" y="190" className={mono} fontSize="7.5" letterSpacing="1.4" fill={faint}>
          NOT
        </text>
        <text x="18" y="206" className={mono} fontSize="7.5" letterSpacing="1" fill={dim}>
          Örnek triyaj kaydı.
        </text>
        <rect x="18" y="232" width="78" height="24" fill="rgba(95,227,255,0.1)" stroke="rgba(95,227,255,0.4)" strokeWidth="0.7" />
        <text x="57" y="247" className={mono} fontSize="7" letterSpacing="1.2" fill="#5fe3ff" textAnchor="middle">
          İNCELE
        </text>
        <rect x="104" y="232" width="86" height="24" fill="none" stroke="rgba(233,237,240,0.18)" strokeWidth="0.7" />
        <text x="147" y="247" className={mono} fontSize="7" letterSpacing="1.2" fill={faint} textAnchor="middle">
          KAPAT
        </text>
      </g>
    </Shell>
  );
}

function AiPreview() {
  const stages = [
    { x: 54, name: "BAĞLAM", state: "OK" },
    { x: 200, name: "MODEL", state: "OK" },
    { x: 346, name: "DOĞRULAMA", state: "OK" },
    { x: 492, name: "TESLİM", state: "OK" },
  ];

  return (
    <Shell>
      <text x="40" y="38" className={mono} fontSize="9" letterSpacing="2.4" fill={faint}>
        AI WORKFLOW / PIPELINE
      </text>
      <text x="600" y="38" className={mono} fontSize="9" letterSpacing="2" fill="#f2b36a" textAnchor="end">
        SİMÜLASYON
      </text>

      <line x1="40" y1="70" x2="600" y2="70" stroke={line} strokeWidth="0.8" />
      <rect x="40" y="70" width="392" height="2" fill="rgba(198,242,110,0.55)" />
      <text x="600" y="62" className={mono} fontSize="7.5" letterSpacing="1.4" fill={faint} textAnchor="end">
        4 / 4 ADIM
      </text>

      {stages.map((stage, index) => (
        <g key={stage.name} transform={`translate(${stage.x} 108)`}>
          <rect width="98" height="72" fill="rgba(233,237,240,0.02)" stroke={index === 1 ? "rgba(198,242,110,0.45)" : line} strokeWidth="0.8" />
          <circle cx="14" cy="16" r="3" fill={index < 2 ? "#c6f26e" : "#5fe3ff"} opacity="0.9" />
          <text x="26" y="20" className={mono} fontSize="7.5" letterSpacing="1.4" fill={faint}>
            0{index + 1}
          </text>
          <text x="12" y="44" className="font-display" fontSize="12" fontWeight="500" fill="#e9edf0">
            {stage.name}
          </text>
          <text x="12" y="60" className={mono} fontSize="7" letterSpacing="1.2" fill="rgba(198,242,110,0.7)">
            TAMAM · {140 + index * 220}ms
          </text>
        </g>
      ))}

      {[152, 298, 444].map((x) => (
        <g key={x}>
          <line x1={x} y1="144" x2={x + 46} y2="144" stroke="rgba(198,242,110,0.3)" strokeWidth="1" />
          <line
            x1={x}
            y1="144"
            x2={x + 46}
            y2="144"
            stroke="#c6f26e"
            strokeWidth="1.4"
            strokeDasharray="4 8"
            className="visual-dash"
          />
        </g>
      ))}

      <g transform="translate(40 216)">
        <rect width="384" height="126" fill="rgba(233,237,240,0.015)" stroke={line} strokeWidth="0.8" />
        <text x="14" y="22" className={mono} fontSize="8" letterSpacing="1.8" fill={faint}>
          ÇIKTI / ÖRNEK
        </text>
        {["context: 6 belge", "model: simulated", "verify: başarılı"].map((text, index) => (
          <text key={text} x="14" y={48 + index * 22} className={mono} fontSize="8" letterSpacing="1.1" fill={dim}>
            {text}
          </text>
        ))}
        <rect x="14" y="108" width="60" height="2" fill="rgba(198,242,110,0.6)" />
        <rect x="78" y="108" width="34" height="2" fill="rgba(233,237,240,0.14)" />
      </g>

      <g transform="translate(440 216)">
        <rect width="160" height="126" fill="rgba(233,237,240,0.015)" stroke={line} strokeWidth="0.8" />
        <text x="14" y="22" className={mono} fontSize="8" letterSpacing="1.8" fill={faint}>
          BAĞLAM PENCERESİ
        </text>
        {[0, 1, 2, 3].map((row) => (
          <g key={row} transform={`translate(14 ${40 + row * 18})`}>
            <rect width="132" height="6" fill="rgba(233,237,240,0.06)" />
            <rect width={120 - row * 22} height="6" fill={row === 0 ? "#5fe3ff" : "rgba(95,227,255,0.35)"} />
          </g>
        ))}
        <text x="14" y="116" className={mono} fontSize="7" letterSpacing="1.2" fill={faint}>
          TOKEN 4 120 / 8 192
        </text>
      </g>

      <text x="40" y="366" className={mono} fontSize="8" letterSpacing="1.6" fill={faint}>
        ÇALIŞTIR → ADIMLAR SIRAYLA İLERLER · GERÇEK MODEL ÇAĞRISI YOK
      </text>
    </Shell>
  );
}

function CreativePreview() {
  return (
    <Shell>
      <text x="40" y="38" className={mono} fontSize="9" letterSpacing="2.4" fill={faint}>
        MOTION STUDY / TYPE
      </text>
      <text x="600" y="38" className={mono} fontSize="9" letterSpacing="2" fill={faint} textAnchor="end">
        POINTER REACTIVE
      </text>

      <g opacity="0.5">
        {[80, 160, 240, 320].map((y) => (
          <line key={y} x1="40" y1={y} x2="600" y2={y} stroke="rgba(233,237,240,0.05)" strokeWidth="0.7" />
        ))}
        {[120, 240, 360, 480].map((x) => (
          <line key={x} x1={x} y1="52" x2={x} y2="348" stroke="rgba(233,237,240,0.05)" strokeWidth="0.7" />
        ))}
      </g>

      <circle cx="468" cy="176" r="88" fill="none" stroke="rgba(95,227,255,0.2)" strokeWidth="0.8" strokeDasharray="3 10" />
      <circle cx="468" cy="176" r="58" fill="none" stroke="rgba(198,242,110,0.22)" strokeWidth="0.8" />
      <circle cx="468" cy="176" r="3.4" fill="#5fe3ff" className="visual-pulse" />

      <text x="46" y="200" className="font-display" fontSize="104" fontWeight="700" letterSpacing="-6" fill="none" stroke="rgba(233,237,240,0.55)" strokeWidth="1">
        SYSTEMS
      </text>
      <text x="128" y="264" className="serif" fontStyle="italic" fontSize="56" fill="#5fe3ff">
        in motion
      </text>
      <text x="46" y="300" className={mono} fontSize="8" letterSpacing="1.8" fill={faint}>
        KATMAN 01 / TİPOGRAFİ · KATMAN 02 / IŞIK
      </text>

      <g transform="translate(486 276)">
        <line x1="-14" y1="0" x2="14" y2="0" stroke="#f2b36a" strokeWidth="0.9" />
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#f2b36a" strokeWidth="0.9" />
        <circle cx="0" cy="0" r="3" fill="none" stroke="#f2b36a" strokeWidth="0.9" />
      </g>
      <text x="486" y="306" className={mono} fontSize="7" letterSpacing="1.2" fill="rgba(242,179,106,0.8)" textAnchor="middle">
        X 486 / Y 276
      </text>

      <rect x="40" y="340" width="560" height="1" fill={line} />
      <text x="40" y="362" className={mono} fontSize="8" letterSpacing="1.6" fill={faint}>
        HAREKET / İŞARETÇİ KONUMU · SCROLL BAĞIMSIZ
      </text>
      <text x="600" y="362" className={mono} fontSize="8" letterSpacing="1.6" fill={faint} textAnchor="end">
        CSS · POINTER
      </text>
    </Shell>
  );
}

const previews: Record<ProjectVisual, () => JSX.Element> = {
  topology: TopologyPreview,
  monitoring: MonitoringPreview,
  soc: SocPreview,
  ai: AiPreview,
  creative: CreativePreview,
};

export function ProjectPreview({
  visual,
  className,
}: {
  visual: ProjectVisual;
  className?: string;
}) {
  const Preview = previews[visual];
  return (
    <div className={cn("h-full w-full", className)}>
      <Preview />
    </div>
  );
}
