import {
  groupMeta,
  networkEdges,
  networkNodes,
  type NodeGroup,
} from "@/lib/network";
import { cn } from "@/lib/utils";

const project = (x: number, y: number) => [50 + x * 8.6, 48 - y * 8.4] as const;

const groupAnchors: Record<NodeGroup, { x: number; y: number }> = {
  ai: { x: 62, y: 14 },
  security: { x: 30, y: 27 },
  infra: { x: 67, y: 58 },
  web: { x: 22, y: 66 },
};

/**
 * Static topology used while WebGL boots and whenever it is unavailable.
 * It is a real part of the composition, not an error box.
 */
export function TopologyFallback({
  className,
  showLabels = true,
}: {
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Soyut ağ topolojisi: yapay zekâ, güvenlik, altyapı ve web düğümleri"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <radialGradient id="topo-glow" cx="50%" cy="48%" r="52%">
          <stop offset="0%" stopColor="#5fe3ff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#5fe3ff" stopOpacity="0" />
        </radialGradient>
        <filter id="topo-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <circle cx="50" cy="48" r="46" fill="url(#topo-glow)" />

      {[17, 28, 39].map((radius) => (
        <circle
          key={radius}
          cx="50"
          cy="48"
          r={radius}
          fill="none"
          stroke="rgba(95,227,255,0.12)"
          strokeWidth="0.18"
          strokeDasharray="1 2.4"
        />
      ))}

      {networkEdges.map((edge, index) => {
        const from = networkNodes.find((node) => node.id === edge.from);
        const to = networkNodes.find((node) => node.id === edge.to);
        if (!from || !to) return null;
        const [x1, y1] = project(from.position[0], from.position[1]);
        const [x2, y2] = project(to.position[0], to.position[1]);
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(95,227,255,0.17)"
              strokeWidth="0.2"
            />
            {edge.flow ? (
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(95,227,255,0.55)"
                strokeWidth="0.28"
                strokeDasharray="1.2 10"
                style={{
                  animation: `signal-dash ${5 + (index % 4)}s linear infinite`,
                }}
              />
            ) : null}
          </g>
        );
      })}

      {networkNodes.map((node) => {
        const [x, y] = project(node.position[0], node.position[1]);
        const meta = groupMeta[node.group];
        return (
          <g key={node.id}>
            <circle cx={x} cy={y} r="2.6" fill={meta.color} opacity="0.08" />
            <circle
              cx={x}
              cy={y}
              r="1.55"
              fill="none"
              stroke={meta.color}
              strokeOpacity="0.4"
              strokeWidth="0.2"
            />
            <circle cx={x} cy={y} r="0.72" fill={meta.color} filter="url(#topo-blur)" />
            <circle cx={x} cy={y} r="0.46" fill="#f2f8fb" />
          </g>
        );
      })}

      {showLabels
        ? (Object.keys(groupAnchors) as NodeGroup[]).map((group) => {
            const meta = groupMeta[group];
            const anchor = groupAnchors[group];
            return (
              <g key={group}>
                <line
                  x1={anchor.x - 4}
                  y1={anchor.y}
                  x2={anchor.x - 1.5}
                  y2={anchor.y}
                  stroke={meta.color}
                  strokeOpacity="0.55"
                  strokeWidth="0.22"
                />
                <text
                  x={anchor.x}
                  y={anchor.y + 0.8}
                  fill={meta.color}
                  fontSize="2.2"
                  letterSpacing="1.1"
                  fontFamily="var(--font-mono), monospace"
                >
                  {meta.label}
                </text>
              </g>
            );
          })
        : null}
    </svg>
  );
}
