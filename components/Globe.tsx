"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function GlobeMesh() {
  return (
    <mesh>
      <sphereGeometry args={[3, 24, 24]} />
      <meshBasicMaterial
        color="#C89B3C"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

export default function Globe() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        right-0
        top-0
        h-full
        w-full
        overflow-hidden
        md:w-1/2
      "
      aria-hidden="true"
    >
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <GlobeMesh />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}