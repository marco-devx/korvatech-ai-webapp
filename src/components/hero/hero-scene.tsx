"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { HeroFallback } from "./hero-fallback";

/**
 * "Convergence" — the brochure's cover motif in 3D: a perspective corridor of
 * hairlines converging to a vanishing point, with copper packets (releases)
 * travelling toward the viewer. Pointer tilts the corridor; scroll dollies in.
 */

const BG = new THREE.Color("#152726");
const LINE = new THREE.Color("#3f544c");
const LINE_SOFT = new THREE.Color("#2a403a");
const COPPER = new THREE.Color("#d4aa80");
const COPPER_DIM = new THREE.Color("#6b563f");

const NEAR_Z = 3;
const FAR_Z = -48;
const HALF_W = 7.4;
const HALF_H = 4.4;
const PER_SIDE = 20;
const PACKETS = 64;
const RING_DEPTHS = [-1.5, -6, -12, -20, -31];

export type PointerRef = React.RefObject<{ x: number; y: number }>;

function perimeter(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < PER_SIDE; i++) {
    const t = (i + 0.5) / PER_SIDE;
    pts.push(new THREE.Vector3(-HALF_W + t * 2 * HALF_W, HALF_H, NEAR_Z));
    pts.push(new THREE.Vector3(HALF_W, HALF_H - t * 2 * HALF_H, NEAR_Z));
    pts.push(new THREE.Vector3(HALF_W - t * 2 * HALF_W, -HALF_H, NEAR_Z));
    pts.push(new THREE.Vector3(-HALF_W, -HALF_H + t * 2 * HALF_H, NEAR_Z));
  }
  return pts;
}

const VP = new THREE.Vector3(0, 0, FAR_Z);
const PERIMETER = perimeter();

function Corridor() {
  "use no memo";
  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    PERIMETER.forEach((p, i) => {
      const accent = i % 13 === 0;
      const near = accent ? COPPER_DIM : LINE;
      pos.push(VP.x, VP.y, VP.z, p.x, p.y, p.z);
      col.push(BG.r, BG.g, BG.b, near.r, near.g, near.b);
    });
    // Depth rings: rectangles along the corridor, scaled by perspective.
    for (const z of RING_DEPTHS) {
      const s = (z - FAR_Z) / (NEAR_Z - FAR_Z);
      const w = HALF_W * s;
      const h = HALF_H * s;
      const c = LINE_SOFT.clone().lerp(BG, 1 - s * 0.9);
      const corners = [
        [-w, h],
        [w, h],
        [w, -h],
        [-w, -h],
      ];
      for (let i = 0; i < 4; i++) {
        const a = corners[i];
        const b = corners[(i + 1) % 4];
        pos.push(a[0], a[1], z, b[0], b[1], z);
        col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
    }
    return { positions: new Float32Array(pos), colors: new Float32Array(col) };
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.9} />
    </lineSegments>
  );
}

function Packets() {
  "use no memo";
  const ref = useRef<THREE.Points>(null);
  const state = useMemo(() => {
    const line = new Int16Array(PACKETS);
    const t = new Float32Array(PACKETS);
    const speed = new Float32Array(PACKETS);
    for (let i = 0; i < PACKETS; i++) {
      line[i] = Math.floor(Math.random() * PERIMETER.length);
      t[i] = Math.random();
      speed[i] = 0.05 + Math.random() * 0.09;
    }
    return { line, t, speed, positions: new Float32Array(PACKETS * 3) };
  }, []);

  const sprite = useMemo(() => {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      g.addColorStop(0, "rgba(232,207,174,1)");
      g.addColorStop(0.35, "rgba(212,170,128,0.9)");
      g.addColorStop(1, "rgba(212,170,128,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < PACKETS; i++) {
      state.t[i] += delta * state.speed[i];
      if (state.t[i] > 1) {
        state.t[i] = 0;
        state.line[i] = Math.floor(Math.random() * PERIMETER.length);
      }
      // Ease so packets accelerate as they approach (perspective feel).
      const e = state.t[i] ** 1.6;
      const p = PERIMETER[state.line[i]];
      arr[i * 3] = VP.x + (p.x - VP.x) * e;
      arr[i * 3 + 1] = VP.y + (p.y - VP.y) * e;
      arr[i * 3 + 2] = VP.z + (p.z - VP.z) * e;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[state.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.34}
        map={sprite}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        color={COPPER}
      />
    </points>
  );
}

function Marker() {
  "use no memo";
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * 0.25;
    ref.current.position.y = 1.1 + Math.sin(t * 0.6) * 0.18;
  });
  const square = useMemo(
    () =>
      new Float32Array([
        -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
      ]),
    [],
  );
  return (
    <group ref={ref} position={[4.6, 1.1, 0.5]}>
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[square, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={COPPER} transparent opacity={0.85} />
      </lineLoop>
      <mesh>
        <planeGeometry args={[0.34, 0.34]} />
        <meshBasicMaterial color={COPPER} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Rig({
  pointer,
  progress,
}: {
  pointer: PointerRef;
  progress: MotionValue<number>;
}) {
  "use no memo";
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const target = useRef({ rx: 0, ry: 0, px: 0 });

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const p = pointer.current ?? { x: 0, y: 0 };
    const t = clock.getElapsedTime();
    const k = 1 - Math.exp(-delta * 2.2);
    target.current.rx += (-p.y * 0.09 - target.current.rx) * k;
    target.current.ry += (p.x * 0.14 - target.current.ry) * k;
    target.current.px += (p.x * 0.5 - target.current.px) * k;
    g.rotation.x = target.current.rx + Math.sin(t * 0.18) * 0.012;
    g.rotation.y = target.current.ry;
    g.position.x = target.current.px;
    const s = progress.get();
    g.rotation.z = Math.sin(t * 0.11) * 0.02 + s * 0.22;
    camera.position.z = 8.5 - s * 4.5;
    camera.position.y = -s * 1.2;
    camera.lookAt(0, 0, -6);
  });

  return (
    <group ref={group}>
      <Corridor />
      <Packets />
      <Marker />
    </group>
  );
}

export default function HeroScene({
  pointer,
  progress,
  active,
}: {
  pointer: PointerRef;
  progress: MotionValue<number>;
  active: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ fov: 54, near: 0.1, far: 120, position: [0, 0, 8.5] }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      fallback={<HeroFallback className="h-full w-full" />}
      frameloop={active ? "always" : "never"}
      style={{ position: "absolute", inset: 0, background: "transparent" }}
      aria-hidden
    >
      <fog attach="fog" args={[BG, 6, 52]} />
      <Rig pointer={pointer} progress={progress} />
    </Canvas>
  );
}
