"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function CapitalNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const positions = [];

    for (let i = 0; i < 180; i++) {
      const radius = 2.3 + Math.random() * 0.15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }

    return new Float32Array(positions);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere */}
      <mesh>
        <sphereGeometry args={[2.25, 32, 32]} />
        <meshBasicMaterial
          color="#d4a017"
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>

      {/* Inner sphere */}
      <mesh>
        <sphereGeometry args={[2.08, 24, 24]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.025}
        />
      </mesh>

      {/* Capital points */}
      <Points positions={points} stride={3}>
        <PointMaterial
          transparent
          color="#d4a017"
          size={0.035}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2.8, 0.3, 0]}>
        <torusGeometry args={[2.65, 0.012, 8, 128]} />
        <meshBasicMaterial
          color="#d4a017"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Second orbital ring */}
      <mesh rotation={[0.7, 0.2, 0.9]}>
        <torusGeometry args={[2.9, 0.009, 8, 128]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  );
}

export default function AboutVisual() {
  return (
    <div className="relative h-[380px] w-full md:h-[520px]">
      <Canvas
        camera={{
          position: [0, 0, 6.5],
          fov: 45,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={0.5} />

        <CapitalNetwork />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}