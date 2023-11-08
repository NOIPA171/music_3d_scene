"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Box from "./models/Box";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { OrbitControls, useGLTF, MeshWobbleMaterial } from "@react-three/drei";

// MeshWobbleMaterial -> can be used for flower/plants

export function Chair() {
  const { nodes, materials } = useGLTF("/Chair.glb");
  // console.log("nodes", nodes);
  // console.log("materials", materials);
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

export const SimpleChair = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <button onClick={() => signIn()}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
      <Canvas>
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />

        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh rotation-x={1}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial />
        </mesh>

        <mesh
          visible
          userData={{ hello: "world" }}
          position={[1, 2, 3]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="hotpink" transparent />
        </mesh>

        <directionalLight
          castShadow
          position={[2.5, 8, 5]}
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, 10, -10]}
          />
        </directionalLight>

        <Chair />
      </Canvas>
    </>
  );
};

export default Scene;
