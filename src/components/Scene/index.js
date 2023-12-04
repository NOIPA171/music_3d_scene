"use client";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Hills from "./Hills";
import { OrbitControls } from "@react-three/drei";

import SceneBase from "./SceneBase";
import Sea from "./Sea";

// MeshWobbleMaterial -> can be used for flower/plants

const Scene = () => {
  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{
          fov: 45,
          zoom: 150,
          near: 0.1,
          far: 1000,
          position: [-3, 2, -2.2],
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[2.5, 8, 5]}
          // shadow-mapSize={[1024, 1024]}
          shadow-mapSize={[2048, 2048]}
          radius={2}
        ></directionalLight>
        <OrbitControls />
        <SceneBase />
        <Hills />
        <Sea />
      </Canvas>
    </>
  );
};

export default Scene;
