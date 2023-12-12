"use client";
import { Canvas } from "@react-three/fiber";
import Hills from "./Hills";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";

import SceneBase from "./SceneBase";
import Sea from "./Sea";
import { usePlayer } from "@/context/PlayerProvider";
import trackMap from "@/utils/trackMap.ts";

// MeshWobbleMaterial -> can be used for flower/plants

const Scene = () => {
  const { currentEnvironment } = usePlayer();

  const trackData = trackMap[currentEnvironment];
  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{
          zoom: 150,
          near: 0.1,
          far: 1000,
          position: [-3, 3, -2.2],
        }}
      >
        <ambientLight intensity={0.4} />
        <ambientLight intensity={0.4} color={trackData.ambienceColor} />
        <directionalLight
          castShadow
          position={[2.5, 8, 5]}
          shadow-mapSize={[2048, 2048]}
          radius={2}
        ></directionalLight>
        <OrbitControls />
        <fog
          attach="fog"
          color={trackData.fog.color}
          near={0.1}
          far={trackData.fog.far}
        />
        {/* TODO: update position & fix vertexShaders */}
        <group
        //  position={[0.2, -0.3, 0]}
        >
          {currentEnvironment === "hills" && <Hills />}
          {currentEnvironment === "sea" && <Sea />}
          <SceneBase />
        </group>
      </Canvas>
    </>
  );
};

export default Scene;
