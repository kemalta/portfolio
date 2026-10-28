"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { TopologyFallback } from "@/components/three/TopologyFallback";
import { TopologyScene } from "@/components/three/TopologyScene";
import { WebGLBoundary } from "@/components/three/WebGLBoundary";
import { useWebGLSupport } from "@/lib/hooks/useWebGLSupport";
import type { NodeGroup } from "@/lib/network";
import { cn } from "@/lib/utils";

function SceneControls({
  resetSignal,
  autoRotate,
}: {
  resetSignal: number;
  autoRotate: boolean;
}) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (!controls.current) return;
    camera.position.set(8.1, 5.9, 8.3);
    controls.current.target.set(0, 0.7, 0);
    controls.current.update();
  }, [resetSignal, camera]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={[0, 0.7, 0]}
      enablePan={false}
      enableDamping
      dampingFactor={0.065}
      minDistance={4.2}
      maxDistance={16}
      minPolarAngle={0.4}
      maxPolarAngle={1.5}
      autoRotate={autoRotate}
      autoRotateSpeed={0.45}
    />
  );
}

function Floor() {
  return (
    <group position={[0, -2.75, 0]}>
      <gridHelper
        args={[20, 40, "#1d3038", "#101b21"]}
        frustumCulled={false}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[4.4, 4.42, 96]} />
        <meshBasicMaterial
          color="#5fe3ff"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]}>
        <ringGeometry args={[7.2, 7.22, 96]} />
        <meshBasicMaterial
          color="#5fe3ff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

type Props = {
  hovered: string | null;
  selected: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  activeGroups: NodeGroup[];
  resetSignal: number;
  autoRotate: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
};

export function LabTopology({
  hovered,
  selected,
  onHover,
  onSelect,
  activeGroups,
  resetSignal,
  autoRotate,
  reducedMotion,
  isMobile,
}: Props) {
  const supported = useWebGLSupport();
  const [ready, setReady] = useState(false);

  return (
    <div className="relative h-full w-full">
      <TopologyFallback
        showLabels={!ready}
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-100",
        )}
      />
      {supported ? (
        <WebGLBoundary fallback={null}>
          <Canvas
            className={cn(
              "!absolute inset-0 cursor-grab transition-opacity duration-700 active:cursor-grabbing",
              ready ? "opacity-100" : "opacity-0",
            )}
            dpr={[1, isMobile ? 1.4 : 1.75]}
            camera={{ position: [8.1, 5.9, 8.3], fov: 40, near: 0.1, far: 80 }}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: "high-performance",
              stencil: false,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.toneMapping = THREE.NoToneMapping;
              setReady(true);
            }}
            fallback={null}
          >
            <SceneControls
              resetSignal={resetSignal}
              autoRotate={autoRotate && !reducedMotion && !hovered}
            />
            <Floor />
            <TopologyScene
              hovered={hovered}
              selected={selected}
              onHover={onHover}
              onSelect={onSelect}
              activeGroups={activeGroups}
              reducedMotion={reducedMotion}
              lite={isMobile}
              nodeLabels
              autoRotate={!reducedMotion}
            />
          </Canvas>
        </WebGLBoundary>
      ) : null}
    </div>
  );
}
