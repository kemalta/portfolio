"use client";

import { Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { damp, seededRandom } from "@/lib/utils";
import {
  groupMeta,
  networkEdges,
  networkNodes,
  nodeMap,
  type NodeGroup,
  type NetworkNode,
} from "@/lib/network";

const EDGE_VERTEX = /* glsl */ `
  attribute float aProgress;
  attribute float aSeed;
  attribute float aActive;
  varying float vProgress;
  varying float vSeed;
  varying float vActive;

  void main() {
    vProgress = aProgress;
    vSeed = aSeed;
    vActive = aActive;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EDGE_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vProgress;
  varying float vSeed;
  varying float vActive;

  void main() {
    float travel = fract(vProgress - uTime * 0.055 + vSeed);
    float pulse = smoothstep(0.0, 0.012, travel) * (1.0 - smoothstep(0.012, 0.075, travel));
    float alpha = (0.085 + pulse * 0.85 + vActive * 0.16) * uOpacity;
    vec3 color = mix(uColor, vec3(0.86, 0.98, 1.0), pulse);
    gl_FragColor = vec4(color, alpha);
  }
`;

function EdgeField({
  activeIds,
  reducedMotion,
}: {
  activeIds: Set<string> | null;
  reducedMotion: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(networkEdges.length * 2 * 3);
    const progress = new Float32Array(networkEdges.length * 2);
    const seeds = new Float32Array(networkEdges.length * 2);
    const active = new Float32Array(networkEdges.length * 2);
    const random = seededRandom(4821);

    networkEdges.forEach((edge, index) => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (!from || !to) return;
      const base = index * 6;
      positions[base] = from.position[0];
      positions[base + 1] = from.position[1];
      positions[base + 2] = from.position[2];
      positions[base + 3] = to.position[0];
      positions[base + 4] = to.position[1];
      positions[base + 5] = to.position[2];

      progress[index * 2] = 0;
      progress[index * 2 + 1] = 1;
      const seed = random();
      seeds[index * 2] = seed;
      seeds[index * 2 + 1] = seed;
      active[index * 2] = 0;
      active[index * 2 + 1] = 0;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aProgress", new THREE.BufferAttribute(progress, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aActive", new THREE.BufferAttribute(active, 1));
    return geo;
  }, []);

  useEffect(() => {
    const attr = geometry.getAttribute("aActive") as THREE.BufferAttribute;
    for (let index = 0; index < networkEdges.length; index += 1) {
      const edge = networkEdges[index];
      const isActive =
        activeIds !== null &&
        activeIds.has(edge.from) &&
        activeIds.has(edge.to);
      attr.setX(index * 2, isActive ? 1 : 0);
      attr.setX(index * 2 + 1, isActive ? 1 : 0);
    }
    attr.needsUpdate = true;
  }, [activeIds, geometry]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = reducedMotion
        ? 0
        : state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#5fe3ff") },
      uOpacity: { value: 0.85 },
    }),
    [],
  );

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={EDGE_VERTEX}
        fragmentShader={EDGE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function Packets({
  activeIds,
  reducedMotion,
  lite,
}: {
  activeIds: Set<string> | null;
  reducedMotion: boolean;
  lite: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const packets = useMemo(() => {
    const random = seededRandom(9203);
    const flows = networkEdges
      .map((edge, index) => ({ edge, index }))
      .filter(({ edge }) => edge.flow);
    const perEdge = lite ? 1 : 2;

    return flows.flatMap(({ edge }) => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (!from || !to) return [];
      const fromVector = new THREE.Vector3(...from.position);
      const toVector = new THREE.Vector3(...to.position);
      return Array.from({ length: perEdge }, () => ({
        from: fromVector,
        to: toVector,
        fromId: from.id,
        toId: to.id,
        offset: random(),
        speed: 0.045 + random() * 0.06,
      }));
    });
  }, [lite]);

  useEffect(() => {
    if (!mesh.current) return;
    packets.forEach((packet, index) => {
      const node = nodeMap.get(packet.toId);
      const color = node ? groupMeta[node.group].color : "#5fe3ff";
      mesh.current?.setColorAt(index, new THREE.Color(color));
    });
    if (mesh.current?.instanceColor) {
      mesh.current.instanceColor.needsUpdate = true;
    }
  }, [packets]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    packets.forEach((packet, index) => {
      const t = (time * packet.speed + packet.offset) % 1;
      dummy.position.lerpVectors(packet.from, packet.to, t);
      dummy.position.y += Math.sin(t * Math.PI) * 0.09;
      const active =
        activeIds !== null &&
        activeIds.has(packet.fromId) &&
        activeIds.has(packet.toId);
      dummy.scale.setScalar(active ? 1.9 : 1);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, packets.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.033, 6, 6]} />
      <meshBasicMaterial
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Node({
  node,
  active,
  dimmed,
  showLabel,
  onHover,
  onSelect,
  reducedMotion,
}: {
  node: NetworkNode;
  active: boolean;
  dimmed: boolean;
  showLabel: boolean;
  onHover: (id: string | null) => void;
  onSelect?: (id: string) => void;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const meta = groupMeta[node.group];

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    if (group.current) {
      const target = active ? 1.45 : dimmed ? 0.72 : 1;
      group.current.scale.setScalar(damp(group.current.scale.x, target, 7, dt));
    }
    if (core.current && !reducedMotion) {
      core.current.rotation.y += dt * 0.55;
      core.current.rotation.x += dt * 0.22;
    }
    if (ring.current && !reducedMotion) {
      ring.current.rotation.z = time * (0.35 + (node.position[0] + 4) * 0.04);
    }
  });

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(node.id);
  };

  return (
    <group ref={group} position={node.position}>
      <mesh
        ref={core}
        onPointerOver={handleOver}
        onPointerOut={() => onHover(null)}
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.(node.id);
        }}
      >
        <octahedronGeometry args={[active ? 0.145 : 0.115, 0]} />
        <meshBasicMaterial
          color={active ? "#f4fbff" : meta.color}
          toneMapped={false}
          transparent
          opacity={dimmed ? 0.35 : 1}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial
          color={meta.color}
          transparent
          opacity={active ? 0.12 : dimmed ? 0.02 : 0.055}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.19, 0.202, 32]} />
        <meshBasicMaterial
          color={meta.color}
          transparent
          opacity={active ? 0.95 : dimmed ? 0.1 : 0.35}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.38, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </mesh>

      {showLabel ? (
        <Html
          position={[0, 0.36, 0]}
          center
          zIndexRange={[20, 0]}
          style={{ pointerEvents: "none" }}
          className="hidden select-none whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.18em] text-ink/80 sm:block"
        >
          {node.label}
        </Html>
      ) : null}
    </group>
  );
}

function GroupTag({
  group,
  position,
}: {
  group: NodeGroup;
  position: [number, number, number];
}) {
  const meta = groupMeta[group];
  return (
    <Html
      position={position}
      center
      zIndexRange={[10, 0]}
      style={{ pointerEvents: "none" }}
      className="hidden select-none items-center gap-2 whitespace-nowrap sm:flex"
    >
      <span
        className="h-px w-4"
        style={{ backgroundColor: meta.color, opacity: 0.6 }}
      />
      <span
        className="font-mono text-[8px] uppercase tracking-[0.26em]"
        style={{ color: meta.color }}
      >
        {meta.label}
      </span>
    </Html>
  );
}

export type TopologySceneProps = {
  hovered: string | null;
  selected?: string | null;
  onHover: (id: string | null) => void;
  onSelect?: (id: string) => void;
  activeGroups?: NodeGroup[] | null;
  activeIds?: Set<string> | null;
  reducedMotion?: boolean;
  lite?: boolean;
  nodeLabels?: boolean;
  groupLabels?: boolean;
  autoRotate?: boolean;
};

export function TopologyScene({
  hovered,
  selected = null,
  onHover,
  onSelect,
  activeGroups = null,
  activeIds = null,
  reducedMotion = false,
  lite = false,
  nodeLabels = false,
  groupLabels = true,
  autoRotate = true,
}: TopologySceneProps) {
  const root = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!root.current || reducedMotion || !autoRotate) return;
    const dt = Math.min(delta, 0.05);
    root.current.rotation.y += dt * 0.045;
  });

  const groupPositions = useMemo(() => {
    const buckets = new Map<NodeGroup, [number, number, number]>();

    (Object.keys(groupMeta) as NodeGroup[]).forEach((group) => {
      const nodes = networkNodes.filter((node) => node.group === group);
      if (nodes.length === 0) return;
      const sum = nodes.reduce(
        (acc, node) => [
          acc[0] + node.position[0],
          acc[1] + node.position[1],
          acc[2] + node.position[2],
        ],
        [0, 0, 0],
      );
      buckets.set(group, [
        sum[0] / nodes.length,
        sum[1] / nodes.length + 0.68,
        sum[2] / nodes.length,
      ]);
    });

    return buckets;
  }, []);

  return (
    <group ref={root} rotation={[0.03, -0.18, 0]}>
      <EdgeField activeIds={activeIds} reducedMotion={reducedMotion} />
      <Packets activeIds={activeIds} reducedMotion={reducedMotion} lite={lite} />

      {networkNodes.map((node) => {
        const isActive = hovered === node.id || selected === node.id;
        const dimmed = Boolean(activeGroups && !activeGroups.includes(node.group));
        return (
          <Node
            key={node.id}
            node={node}
            active={isActive}
            dimmed={dimmed}
            showLabel={isActive || nodeLabels}
            onHover={onHover}
            onSelect={onSelect}
            reducedMotion={reducedMotion}
          />
        );
      })}

      {groupLabels
        ? [...groupPositions.entries()].map(([group, position]) => (
            <GroupTag key={group} group={group} position={position} />
          ))
        : null}
    </group>
  );
}
