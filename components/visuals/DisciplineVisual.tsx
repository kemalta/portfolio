import type { DisciplineId } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Accent per discipline. Colour is used sparingly: one hue per visual layer,
 * with cyan reserved for live signal and link state.
 */
export const disciplineAccent: Record<DisciplineId, string> = {
  ai: "#c6f26e",
  security: "#f2b36a",
  network: "#5fe3ff",
  server: "#f2b36a",
  web: "#e9edf0",
  systems: "#5fe3ff",
};

const LINE = "rgba(233,237,240,0.14)";
const FAINT = "rgba(233,237,240,0.45)";
const DIM = "rgba(233,237,240,0.62)";
const PANEL = "rgba(233,237,240,0.015)";

const label = {
  className: "font-mono",
  fontSize: 5.6,
  letterSpacing: 1.1,
  fill: FAINT,
} as const;

function AiVisual() {
  const layers = [
    { x: 44, ys: [70, 110, 150], caption: "INPUT", cx: 44 },
    { x: 148, ys: [52, 92, 132, 172], caption: "HIDDEN", cx: 148 },
    { x: 252, ys: [92, 130], caption: "OUTPUT", cx: 252 },
  ];

  const edges: { key: string; x1: number; y1: number; x2: number; y2: number }[] =
    [];

  for (let layer = 0; layer < layers.length - 1; layer += 1) {
    layers[layer].ys.forEach((y1, a) => {
      layers[layer + 1].ys.forEach((y2, b) => {
        edges.push({
          key: `${layer}-${a}-${b}`,
          x1: layers[layer].x,
          y1,
          x2: layers[layer + 1].x,
          y2,
        });
      });
    });
  }

  return (
    <svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">
      <g stroke={LINE} strokeWidth="0.7">
        {edges.map((edge) => (
          <line
            key={edge.key}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
          />
        ))}
      </g>

      {/* forward pass */}
      <path
        d="M44 110 L148 92 L252 130"
        fill="none"
        stroke="#c6f26e"
        strokeWidth="1.1"
        strokeDasharray="3 9"
        className="visual-dash"
      />
      <path
        d="M44 70 L148 52 L252 92"
        fill="none"
        stroke="#c6f26e"
        strokeWidth="0.8"
        strokeOpacity="0.35"
        strokeDasharray="2 12"
        className="visual-dash"
        style={{ animationDuration: "7s" }}
      />

      <g>
        {layers.map((layer) =>
          layer.ys.map((y, index) => {
            const highlight =
              (layer.x === 44 && y === 110) ||
              (layer.x === 148 && y === 92) ||
              (layer.x === 252 && y === 130);
            return (
              <g key={`${layer.x}-${y}`}>
                <circle
                  cx={layer.x}
                  cy={y}
                  r={highlight ? 4 : 3.2}
                  fill={highlight ? "#c6f26e" : "#0b1014"}
                  stroke={highlight ? "#c6f26e" : "rgba(233,237,240,0.3)"}
                  strokeWidth="0.9"
                />
                {layer.x === 148 ? (
                  <circle
                    cx={layer.x}
                    cy={y}
                    r={6.5}
                    fill="none"
                    stroke="#c6f26e"
                    strokeOpacity="0.3"
                    strokeWidth="0.7"
                    className="visual-pulse"
                    style={{ animationDelay: `${index * 0.55}s` }}
                  />
                ) : null}
              </g>
            );
          }),
        )}
        <circle
          cx={252}
          cy={130}
          r={10}
          fill="none"
          stroke="#c6f26e"
          strokeOpacity="0.55"
          strokeWidth="0.7"
        />
      </g>

      {/* annotation */}
      <g stroke="rgba(233,237,240,0.28)" strokeWidth="0.7">
        <path d="M44 28 L44 24 L252 24 L252 28" fill="none" />
      </g>
      <text x="44" y="19" {...label}>
        INFERENCE PATH / 03
      </text>
      <text x="296" y="19" {...label} textAnchor="end" fill="#c6f26e">
        CONTEXT
      </text>

      {layers.map((layer) => (
        <text
          key={layer.caption}
          x={layer.cx}
          y="196"
          {...label}
          textAnchor="middle"
        >
          {layer.caption}
        </text>
      ))}
      <text x="44" y="206" {...label} fill="rgba(233,237,240,0.28)">
        TOKENS 04 · TEMP 0.2
      </text>
    </svg>
  );
}

function SecurityVisual() {
  const blips = [
    { x: 150, y: 84, delay: 0.2 },
    { x: 96, y: 130, delay: 1.5 },
    { x: 112, y: 76, delay: 2.8 },
    { x: 142, y: 146, delay: 3.6 },
  ];

  return (
    <svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">
      <g fill="none" stroke="rgba(242,179,106,0.2)" strokeWidth="0.7">
        {[26, 45, 64].map((r) => (
          <circle key={r} cx="124" cy="110" r={r} />
        ))}
        <line x1="60" y1="110" x2="188" y2="110" />
        <line x1="124" y1="46" x2="124" y2="174" />
        <line x1="79" y1="65" x2="169" y2="155" strokeOpacity="0.5" />
        <line x1="169" y1="65" x2="79" y2="155" strokeOpacity="0.5" />
      </g>

      {/* sweep */}
      <g className="visual-sweep">
        <path
          d="M124 110 L124 46 A64 64 0 0 1 179.5 78 Z"
          fill="rgba(242,179,106,0.09)"
        />
        <line
          x1="124"
          y1="110"
          x2="124"
          y2="46"
          stroke="#f2b36a"
          strokeWidth="0.9"
          strokeOpacity="0.7"
        />
      </g>

      <circle cx="124" cy="110" r="2.4" fill="#f2b36a" />

      {blips.map((blip) => (
        <g key={`${blip.x}-${blip.y}`}>
          <circle
            cx={blip.x}
            cy={blip.y}
            r="3.4"
            fill="none"
            stroke="#f2b36a"
            strokeWidth="0.9"
            className="visual-ping"
            style={{ animationDelay: `${blip.delay}s` }}
          />
          <circle cx={blip.x} cy={blip.y} r="1.1" fill="#f2b36a" />
        </g>
      ))}

      <text x="24" y="19" {...label}>
        PERIMETER / RADAR
      </text>
      <text x="24" y="202" {...label} fill="rgba(233,237,240,0.28)">
        SURFACE 04 · SEGMENTED
      </text>

      {/* control list */}
      <line x1="214" y1="44" x2="214" y2="176" stroke={LINE} strokeWidth="0.7" />
      <text x="228" y="52" {...label}>
        CONTROL
      </text>
      {[
        { y: 78, name: "ACCESS", state: "KEY" },
        { y: 106, name: "SEGMENT", state: "VLAN" },
        { y: 134, name: "AUDIT", state: "LOG" },
        { y: 162, name: "PATCH", state: "WIN" },
      ].map((row) => (
        <g key={row.name}>
          <rect
            x="228"
            y={row.y - 6}
            width="3"
            height="3"
            fill="#c6f26e"
            opacity="0.8"
          />
          <text x="236" y={row.y} {...label} fill={DIM}>
            {row.name}
          </text>
          <text x="296" y={row.y} {...label} textAnchor="end">
            {row.state}
          </text>
        </g>
      ))}

      <path
        d="M124 34 L146 42 L146 58 L124 70 L102 58 L102 42 Z"
        fill="none"
        stroke="rgba(242,179,106,0.5)"
        strokeWidth="0.7"
      />
      <path
        d="M117 51 L122 56 L131 46"
        fill="none"
        stroke="#f2b36a"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NetworkVisual() {
  const bands = [
    { y: 40, label: "VLAN 10", color: "rgba(95,227,255,0.14)" },
    { y: 80, label: "VLAN 20", color: "rgba(198,242,110,0.14)" },
    { y: 120, label: "VLAN 30", color: "rgba(242,179,106,0.14)" },
  ];

  return (
    <svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">
      {bands.map((band) => (
        <g key={band.label}>
          <rect
            x="20"
            y={band.y}
            width="280"
            height="34"
            fill={PANEL}
            stroke={LINE}
            strokeWidth="0.6"
          />
          <line
            x1="20"
            y1={band.y + 17}
            x2="300"
            y2={band.y + 17}
            stroke={band.color}
            strokeWidth="0.6"
            strokeDasharray="2 6"
          />
          <text
            x="296"
            y={band.y + 12}
            {...label}
            textAnchor="end"
            fill="rgba(233,237,240,0.3)"
          >
            {band.label}
          </text>
        </g>
      ))}

      {/* route */}
      <path
        d="M44 57 L96 57 L150 97 L206 97 L206 137 L264 137"
        fill="none"
        stroke="rgba(95,227,255,0.22)"
        strokeWidth="1.4"
      />
      <path
        d="M44 57 L96 57 L150 97 L206 97 L206 137 L264 137"
        fill="none"
        stroke="#5fe3ff"
        strokeWidth="1.1"
        strokeDasharray="4 8"
        className="visual-dash"
      />

      {/* client */}
      <rect
        x="30"
        y="51"
        width="14"
        height="12"
        fill="#0b1014"
        stroke="rgba(233,237,240,0.45)"
        strokeWidth="0.8"
      />
      <rect x="33" y="54" width="8" height="1.4" fill={FAINT} />
      <rect x="33" y="57" width="5" height="1.4" fill="rgba(233,237,240,0.22)" />

      {/* router 1 */}
      <g transform="translate(96 57)">
        <polygon
          points="0,-7 7,0 0,7 -7,0"
          fill="#0b1014"
          stroke="#5fe3ff"
          strokeWidth="0.9"
        />
        <circle cx="0" cy="0" r="1.4" fill="#5fe3ff" />
      </g>

      {/* switch */}
      <g transform="translate(150 97)">
        <rect
          x="-8"
          y="-7"
          width="16"
          height="14"
          fill="#0b1014"
          stroke="rgba(198,242,110,0.65)"
          strokeWidth="0.9"
        />
        {[-4, 0, 4].map((x) => (
          <rect key={x} x={x - 1.2} y="-2" width="2.4" height="4" fill="#c6f26e" opacity="0.55" />
        ))}
      </g>

      {/* router 2 */}
      <g transform="translate(206 137)">
        <polygon
          points="0,-7 7,0 0,7 -7,0"
          fill="#0b1014"
          stroke="#5fe3ff"
          strokeWidth="0.9"
        />
        <circle cx="0" cy="0" r="1.4" fill="#5fe3ff" />
      </g>

      {/* server */}
      <g transform="translate(264 137)">
        <rect
          x="-9"
          y="-8"
          width="18"
          height="16"
          fill="#0b1014"
          stroke="rgba(233,237,240,0.45)"
          strokeWidth="0.8"
        />
        <circle cx="-4" cy="-3" r="1" fill="#c6f26e" className="visual-pulse" />
        <rect x="-4" y="2" width="8" height="1.2" fill={FAINT} />
      </g>

      <text x="24" y="19" {...label}>
        ROUTE / ORTHOGONAL
      </text>
      <text x="296" y="19" {...label} textAnchor="end" fill="#5fe3ff">
        SAMPLE GRAPH
      </text>
      <text x="24" y="196" {...label}>
        HOPS 04 · PATH ACCESS → CORE → SERVICE
      </text>
      <text x="296" y="196" {...label} textAnchor="end" fill="rgba(233,237,240,0.28)">
        TTL 64
      </text>

      <g fill="rgba(233,237,240,0.22)">
        {[24, 30, 36, 42].map((x) => (
          <rect key={x} x={x} y="204" width="3" height="3" />
        ))}
      </g>
      <g fill="#5fe3ff">
        <rect x="24" y="204" width="3" height="3" opacity="0.9" />
        <rect x="30" y="204" width="3" height="3" opacity="0.55" />
      </g>
    </svg>
  );
}

function ServerVisual() {
  const units = [
    { y: 38, name: "NODE-01" },
    { y: 74, name: "NODE-02" },
    { y: 110, name: "NODE-03" },
    { y: 146, name: "NODE-04" },
  ];

  return (
    <svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">
      <rect
        x="32"
        y="30"
        width="104"
        height="164"
        fill={PANEL}
        stroke={LINE}
        strokeWidth="0.8"
      />

      {units.map((unit, unitIndex) => (
        <g key={unit.name}>
          <rect
            x="38"
            y={unit.y}
            width="92"
            height="30"
            fill="#0b1014"
            stroke="rgba(233,237,240,0.12)"
            strokeWidth="0.7"
          />
          <circle
            cx="44"
            cy={unit.y + 10}
            r="1.6"
            fill={unitIndex === 3 ? "#f2b36a" : "#c6f26e"}
            opacity="0.9"
          />
          {[0, 1, 2].map((bar) => (
            <rect
              key={bar}
              x={52 + bar * 6}
              y={unit.y + 12}
              width="3"
              height="11"
              fill={unitIndex === 3 ? "#f2b36a" : "#5fe3ff"}
              opacity="0.55"
              className="visual-bar"
              style={{
                animationDelay: `${(unitIndex * 3 + bar) * 0.24}s`,
                transformBox: "fill-box",
                transformOrigin: "bottom center",
              }}
            />
          ))}
          <text
            x="76"
            y={unit.y + 13}
            className="font-mono"
            fontSize="5"
            letterSpacing="0.9"
            fill={DIM}
          >
            {unit.name}
          </text>
          {[0, 1, 2, 3, 4, 5].map((port) => (
            <rect
              key={port}
              x={76 + port * 7}
              y={unit.y + 20}
              width="4"
              height="2"
              fill="rgba(233,237,240,0.16)"
            />
          ))}
        </g>
      ))}

      {/* storage */}
      {[
        { y: 46, name: "DISK-A" },
        { y: 112, name: "DISK-B" },
      ].map((disk) => (
        <g key={disk.name}>
          <rect
            x="180"
            y={disk.y + 5}
            width="32"
            height="28"
            fill={PANEL}
            stroke="rgba(95,227,255,0.4)"
            strokeWidth="0.8"
          />
          <ellipse
            cx="196"
            cy={disk.y + 5}
            rx="16"
            ry="5"
            fill="#0b1014"
            stroke="rgba(95,227,255,0.5)"
            strokeWidth="0.8"
          />
          <ellipse
            cx="196"
            cy={disk.y + 33}
            rx="16"
            ry="5"
            fill="none"
            stroke="rgba(95,227,255,0.35)"
            strokeWidth="0.8"
          />
          <text
            x="196"
            y={disk.y + 22}
            className="font-mono"
            fontSize="4.8"
            letterSpacing="0.8"
            fill={FAINT}
            textAnchor="middle"
          >
            {disk.name}
          </text>
        </g>
      ))}

      <line
        x1="196"
        y1="84"
        x2="196"
        y2="112"
        stroke="#c6f26e"
        strokeWidth="0.9"
        strokeDasharray="3 6"
        className="visual-dash"
      />
      <polygon points="192,104 200,104 196,110" fill="#c6f26e" opacity="0.8" />
      <text x="222" y="100" {...label} fill="rgba(198,242,110,0.7)">
        REPLICA
      </text>

      {/* backup */}
      <g>
        <rect
          x="240"
          y="146"
          width="56"
          height="30"
          fill={PANEL}
          stroke="rgba(198,242,110,0.35)"
          strokeWidth="0.7"
        />
        <text x="246" y="157" {...label} fill={DIM}>
          BACKUP
        </text>
        <path
          d="M246 168 L249 171 L255 163"
          fill="none"
          stroke="#c6f26e"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="260" y="170" {...label} fill="rgba(198,242,110,0.65)">
          VERIFY
        </text>
      </g>

      {/* thermal */}
      <text x="180" y="176" {...label}>
        THERMAL
      </text>
      <path
        d="M180 200 L192 196 L204 199 L216 190 L228 194 L240 186 L252 189 L264 182 L276 185 L288 180"
        fill="none"
        stroke="rgba(242,179,106,0.75)"
        strokeWidth="1"
      />
      <circle cx="288" cy="180" r="1.6" fill="#f2b36a" className="visual-pulse" />

      <text x="24" y="19" {...label}>
        RACK / A
      </text>
      <text x="296" y="19" {...label} textAnchor="end">
        VIRTUAL / STORAGE
      </text>
      <text x="24" y="206" {...label} fill="rgba(233,237,240,0.28)">
        UNITS 04 · SAMPLE METRICS
      </text>
    </svg>
  );
}

function WebVisual() {
  const waterfall = [
    { y: 166, name: "DOC", width: 96, color: "#5fe3ff", delay: 0 },
    { y: 176, name: "CSS", width: 70, color: "rgba(233,237,240,0.5)", delay: 0.5 },
    { y: 186, name: "API", width: 44, color: "#c6f26e", delay: 1 },
    { y: 196, name: "JS", width: 26, color: "#f2b36a", delay: 1.5 },
  ];

  return (
    <svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">
      <rect
        x="24"
        y="26"
        width="272"
        height="122"
        fill="#0a0f13"
        stroke="rgba(233,237,240,0.18)"
        strokeWidth="0.8"
      />
      <line x1="24" y1="48" x2="296" y2="48" stroke={LINE} strokeWidth="0.7" />

      {[36, 44, 52].map((x, index) => (
        <circle
          key={x}
          cx={x}
          cy="37"
          r="1.7"
          fill={index === 0 ? "#f2b36a" : "rgba(233,237,240,0.25)"}
        />
      ))}

      <rect
        x="64"
        y="31"
        width="150"
        height="12"
        fill="rgba(233,237,240,0.03)"
        stroke="rgba(233,237,240,0.1)"
        strokeWidth="0.6"
      />
      <text x="70" y="39" {...label} fill={FAINT}>
        app.local/api/status
      </text>
      <text x="290" y="39" {...label} textAnchor="end" fill="#c6f26e">
        200
      </text>

      {/* sidebar */}
      <rect x="24" y="48" width="52" height="100" fill={PANEL} />
      <line x1="40" y1="62" x2="66" y2="62" stroke="#5fe3ff" strokeWidth="1.4" />
      {[76, 88, 100].map((y) => (
        <line
          key={y}
          x1="40"
          y1={y}
          x2={y === 88 ? 62 : 56}
          y2={y}
          stroke="rgba(233,237,240,0.18)"
          strokeWidth="1"
        />
      ))}

      {/* content cards */}
      <rect
        x="88"
        y="60"
        width="86"
        height="36"
        fill={PANEL}
        stroke="rgba(233,237,240,0.1)"
        strokeWidth="0.6"
      />
      <text x="94" y="70" {...label} fill={FAINT}>
        REQUESTS
      </text>
      <text x="94" y="86" className="font-mono" fontSize="12" fill={DIM}>
        1 284
      </text>

      <rect
        x="184"
        y="60"
        width="100"
        height="36"
        fill={PANEL}
        stroke="rgba(233,237,240,0.1)"
        strokeWidth="0.6"
      />
      <text x="190" y="70" {...label} fill={FAINT}>
        RESPONSE / MS
      </text>
      <text x="190" y="86" className="font-mono" fontSize="12" fill="#5fe3ff">
        42
      </text>

      <rect
        x="88"
        y="104"
        width="196"
        height="34"
        fill={PANEL}
        stroke="rgba(233,237,240,0.1)"
        strokeWidth="0.6"
      />
      <polyline
        points="96,132 112,126 128,130 144,118 160,122 176,112 192,116 208,106 224,110 240,102 256,106 272,98"
        fill="none"
        stroke="#5fe3ff"
        strokeWidth="1"
      />
      <circle cx="272" cy="98" r="1.8" fill="#5fe3ff" className="visual-pulse" />

      {/* pointer */}
      <g transform="translate(96 72)">
        <g className="visual-cursor">
          <path
            d="M0 0 L0 10 L2.8 7.2 L5 11 L7.2 9.8 L5.2 6.4 L9 6 Z"
            fill="#e9edf0"
            stroke="#06080a"
            strokeWidth="0.7"
          />
        </g>
      </g>

      {/* waterfall */}
      <text x="24" y="158" {...label}>
        LOAD / WATERFALL
      </text>
      {waterfall.map((row) => (
        <g key={row.name}>
          <text x="24" y={row.y + 3} {...label} fill={FAINT}>
            {row.name}
          </text>
          <rect
            x="52"
            y={row.y - 2}
            width={row.width}
            height="4"
            fill={row.color}
            opacity="0.7"
            className="visual-grow"
            style={{ animationDelay: `${row.delay}s` }}
          />
        </g>
      ))}
      <text x="296" y="199" {...label} textAnchor="end" fill="rgba(233,237,240,0.28)">
        TTFB 12ms
      </text>
    </svg>
  );
}

function SystemsVisual() {
  const logs = [
    { y: 166, time: "14:02:11", name: "if.eth0", state: "LINK UP", color: "rgba(198,242,110,0.8)" },
    { y: 178, time: "14:02:26", name: "disk.sda", state: "I/O WAIT", color: "rgba(242,179,106,0.9)" },
    { y: 190, time: "14:02:41", name: "svc.api", state: "LATENCY", color: "rgba(95,227,255,0.8)" },
  ];

  return (
    <svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">
      <g stroke="rgba(233,237,240,0.06)" strokeWidth="0.6">
        {[40, 60, 80, 100, 120, 140].map((y) => (
          <line key={y} x1="24" y1={y} x2="264" y2={y} />
        ))}
        {[24, 64, 104, 144, 184, 224, 264].map((x) => (
          <line key={x} x1={x} y1="40" x2={x} y2="140" />
        ))}
      </g>

      <line x1="24" y1="100" x2="264" y2="100" stroke={LINE} strokeWidth="0.8" />

      <path
        d="M24 100 L52 100 L60 94 L68 100 L96 100 L104 86 L112 112 L120 100 L150 100 L158 96 L166 100 L196 100 L204 68 L212 128 L220 100 L248 100 L256 94 L264 100"
        fill="none"
        stroke="#5fe3ff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      <line
        x1="24"
        y1="40"
        x2="24"
        y2="140"
        stroke="rgba(95,227,255,0.55)"
        strokeWidth="0.9"
        className="visual-trace"
      />

      {/* anomaly */}
      <line
        x1="204"
        y1="40"
        x2="204"
        y2="140"
        stroke="rgba(242,179,106,0.45)"
        strokeWidth="0.7"
        strokeDasharray="3 5"
      />
      <circle
        cx="204"
        cy="68"
        r="3"
        fill="none"
        stroke="#f2b36a"
        strokeWidth="0.9"
        className="visual-ping"
      />
      <circle cx="204" cy="68" r="1.4" fill="#f2b36a" />
      <text x="210" y="63" {...label} fill="#f2b36a">
        SPIKE +184ms
      </text>

      <text x="24" y="19" {...label}>
        TRACE / NODE-04
      </text>
      <text x="264" y="19" {...label} textAnchor="end" fill="#5fe3ff">
        12.4 ms
      </text>

      <line x1="24" y1="152" x2="296" y2="152" stroke={LINE} strokeWidth="0.7" />
      <text x="296" y="163" {...label} textAnchor="end" fill="rgba(233,237,240,0.28)">
        LOG STREAM
      </text>

      {logs.map((log) => (
        <g key={log.time}>
          <text x="24" y={log.y} className="font-mono" fontSize="5" letterSpacing="0.7" fill="rgba(233,237,240,0.32)">
            {log.time}
          </text>
          <text x="70" y={log.y} className="font-mono" fontSize="5" letterSpacing="0.7" fill={DIM}>
            {log.name}
          </text>
          <text x="296" y={log.y} className="font-mono" fontSize="5" letterSpacing="0.7" textAnchor="end" fill={log.color}>
            {log.state}
          </text>
        </g>
      ))}

      <rect x="24" y="200" width="18" height="2" fill="rgba(233,237,240,0.18)" />
      <rect x="24" y="200" width="11" height="2" fill="#5fe3ff" />
      <text x="48" y="203" {...label} fill="rgba(233,237,240,0.32)">
        BASELINE / RESOLVED
      </text>
    </svg>
  );
}

const visuals: Record<DisciplineId, () => JSX.Element> = {
  ai: AiVisual,
  security: SecurityVisual,
  network: NetworkVisual,
  server: ServerVisual,
  web: WebVisual,
  systems: SystemsVisual,
};

export function DisciplineVisual({
  id,
  className,
}: {
  id: DisciplineId;
  className?: string;
}) {
  const Visual = visuals[id];
  return (
    <div className={cn("discipline-visual h-full w-full", className)}>
      <Visual />
    </div>
  );
}
