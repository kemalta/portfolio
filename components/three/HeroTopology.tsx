"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type MutableRefObject, useState } from "react";
import * as THREE from "three";
import { TopologyFallback } from "@/components/three/TopologyFallback";
import { TopologyScene } from "@/components/three/TopologyScene";
import { WebGLBoundary } from "@/components/three/WebGLBoundary";
import { useWebGLSupport } from "@/lib/hooks/useWebGLSupport";
import { nodeMap, groupMeta } from "@/lib/network";
import { cn, damp } from "@/lib/utils";

function CameraRig({
  scrollRef,
  reducedMotion,
  isMobile,
}: {
  scrollRef: MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const { camera } = useThree();
  const baseZ = isMobile ? 11.6 : 8.7;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const scroll = scrollRef.current;
    const targetX = reducedMotion ? 0 : state.pointer.x * 0.5;
    const targetY = 0.95 + (reducedMotion ? 0 : state.pointer.y * 0.35);
    const targetZ = baseZ + scroll * 2.4;

    camera.position.x = damp(camera.position.x, targetX, 1.8, dt);
    camera.position.y = damp(camera.position.y, targetY, 1.8, dt);
    camera.position.z = damp(camera.position.z, targetZ, 1.8, dt);
    camera.lookAt(0, 0.85, 0);
  });

  return null;
}

type Props = {
  scrollRef: MutableRefObject<number>;
  reducedMotion: boolean;
  isMobile: boolean;
};

export function HeroTopology({ scrollRef, reducedMotion, isMobile }: Props) {
  const supported = useWebGLSupport();
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const node = hovered ? nodeMap.get(hovered) : null;
  const meta = node ? groupMeta[node.group] : null;

  return (
    <div className="relative h-full w-full">
      <TopologyFallback
        showLabels={!ready}
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          ready ? "opacity-0" : "opacity-100",
        )}
      />

      {supported ? (
        <WebGLBoundary fallback={null}>
          <Canvas
            className={cn(
              "!absolute inset-0 transition-opacity duration-1000",
              ready ? "opacity-100" : "opacity-0",
            )}
            dpr={[1, isMobile ? 1.4 : 1.8]}
            camera={{
              position: [0, 0.95, isMobile ? 11.6 : 8.7],
              fov: 42,
              near: 0.1,
              far: 60,
            }}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.toneMapping = THREE.NoToneMapping;
              setReady(true);
            }}
            fallback={null}
          >
            <CameraRig
              scrollRef={scrollRef}
              reducedMotion={reducedMotion}
              isMobile={isMobile}
            />
            <TopologyScene
              hovered={hovered}
              onHover={setHovered}
              reducedMotion={reducedMotion}
              lite={isMobile}
              groupLabels
            />
          </Canvas>
        </WebGLBoundary>
      ) : null}

      <div className="pointer-events-none absolute bottom-0 right-0 hidden w-[19rem] border border-line bg-void/80 px-4 py-3 backdrop-blur-sm md:block">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
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
        <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink">
          {node ? `${node.label} — ${node.role}` : "İnteraktif ağ / örnek graf"}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-dim">
          {node ? node.detail : "Düğümlerin üzerine gelerek rolleri okuyun."}
        </p>
      </div>
    </div>
  );
}

export default HeroTopology;
