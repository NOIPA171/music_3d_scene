"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Box from "./models/Box";
import Hills from "./Hills";
import {
  OrbitControls,
  useGLTF,
  MeshWobbleMaterial,
  Sampler,
} from "@react-three/drei";

// MeshWobbleMaterial -> can be used for flower/plants

export function Chair() {
  const { nodes, materials } = useGLTF("/Chair.glb");
  console.log("nodes", nodes);
  console.log("materials", materials);

  return (
    <mesh
      geometry={nodes.Chair_mesh.geometry}
      position={[-0.42, 0.51, -0.62]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial factor={0.4} map={materials.blinn1SG.map} />
    </mesh>
  );
}

const Scene = () => {
  return (
    <>
      <Canvas shadows>
        <OrbitControls />

        <Hills />
        {/* <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} /> */}
        <directionalLight color="red" position={[0, 0, 5]} />
        {/* <mesh rotation-x={1}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial />
        </mesh> */}
        <mesh
          visible
          userData={{ hello: "world" }}
          position={[1, 2, 3]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="hotpink" transparent />
        </mesh>
        {/* <Chair /> */}
      </Canvas>
    </>
  );
};

export default Scene;
