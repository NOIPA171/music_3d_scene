"use client";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Hills from "./Hills";
import { OrbitControls } from "@react-three/drei";

import SceneBase from "./SceneBase";
import Sea from "./Sea";
import { usePlayer } from "@/context/PlayerProvider";

// MeshWobbleMaterial -> can be used for flower/plants

const Scene = () => {
  const { currentTrack } = usePlayer();
  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{
          zoom: 150,
          near: 0.1,
          far: 1000,
          position: [-3, 2, -2.2],
        }}
      >
        <ambientLight intensity={0.4} />
        <ambientLight intensity={0.4} color={"#2fb5c6"} />
        <directionalLight
          castShadow
          position={[2.5, 8, 5]}
          // shadow-mapSize={[1024, 1024]}
          shadow-mapSize={[2048, 2048]}
          radius={2}
        ></directionalLight>
        <OrbitControls />
        {/* <color args={["#8FA87C"]} attach="background" /> */}
        <color args={["#3F7388"]} attach="background" />
        {/* <fog attach="fog" color="yellow" near={0.1} far={20} /> */}
        <fog attach="fog" color="#3F7388" near={0.1} far={12} />
        <SceneBase />
        {/* {currentTrack.environment === "hills" && <Hills />} */}
        {/* {currentTrack.environment === "sea" && <Sea />} */}
        <Sea />
      </Canvas>
    </>
  );
};

export default Scene;
