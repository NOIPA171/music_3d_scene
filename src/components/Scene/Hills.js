"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  MeshWobbleMaterial,
  Sampler,
  Sky,
} from "@react-three/drei";

// MeshWobbleMaterial -> can be used for flower/plants
const Hills = () => {
  const { nodes, materials, scene, ...gltf } = useGLTF("/new_scene2.glb");
  console.log("nodes", nodes);
  console.log("materials", materials);
  console.log("scene", scene);
  console.log("gltf", gltf);
  return (
    <>
      {/* <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      /> */}
      {/* <color args={["#eee"]} attach="background" /> */}
      <ambientLight intensity={0.5} />
      {/* <pointLight position={[15, 10, 10]} castShadow /> */}
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        // shadow-mapSize={[1024, 1024]}
        shadow-mapSize={[2048, 2048]}
        radius={2}
      >
        {/* <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} /> */}
      </directionalLight>
      <fog attach="fog" color="yellow" near={1} far={10} />
      <group position={nodes.grass.position} rotation={nodes.grass.rotation}>
        {nodes.grass.children.map((child, idx) => (
          <mesh key={`grass_${idx}`} geometry={child.geometry} castShadow>
            <MeshWobbleMaterial color={child.material.color} />
          </mesh>
        ))}
      </group>
      <mesh
        geometry={nodes.table.geometry}
        position={nodes.table.position}
        scale={nodes.table.scale}
        castShadow
      >
        <meshStandardMaterial color={materials.table.color} />
      </mesh>
      <group>
        <mesh
          geometry={nodes.rockFlat.geometry}
          position={nodes.rockFlat.position}
          scale={nodes.rockFlat.scale}
        >
          <meshStandardMaterial color={materials.rock_base.color} />
        </mesh>
        <mesh
          geometry={nodes.rockFlat001.geometry}
          position={nodes.rockFlat001.position}
          scale={nodes.rockFlat001.scale}
          receiveShadow
        >
          <meshStandardMaterial color={nodes.rockFlat001.material.color} />
        </mesh>
      </group>
    </>
  );
};

export default Hills;
