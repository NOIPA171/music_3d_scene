"use client";

import { useEffect, useRef } from "react";
import { MeshStandardMaterial } from "three";
import { useFrame, extend } from "@react-three/fiber";
import {
  useGLTF,
  MeshWobbleMaterial,
  Sampler,
  Sky,
  shaderMaterial,
  useAnimations,
} from "@react-three/drei";
import { RGBADepthPacking } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexShader from "./shaders/seaweedVertex.glsl";

const uWindVelocity = 1.5;
const sceneFile = "/kelp.glb";

const KelpLeaves = ({ rotation, position, node }) => {
  const { nodes } = useGLTF(sceneFile);
  const kelpMaterials = useRef([]);
  const rand = useRef(Math.random() * 10);

  useFrame((state, delta) => {
    if (!kelpMaterials.current.length) return;
    kelpMaterials.current.forEach((elm) => (elm.uniforms.uTime.value += delta));
  });

  return (
    <mesh
      geometry={node.geometry}
      castShadow
      receiveShadow
      position={position}
      scale={node.scale}
      rotation={rotation}
    >
      <CustomShaderMaterial
        ref={(elm) => kelpMaterials.current.push(elm)}
        baseMaterial={MeshStandardMaterial}
        vertexShader={vertexShader}
        uniforms={{
          uPos: { value: position },
          uFrequency: { value: 18 },
          uAmplitude: { value: 0.1 },
          uTime: { value: 0 },
          uWindVelocity: { value: uWindVelocity },
          uRand: { value: rand.current },
        }}
      />
    </mesh>
  );
};

const Kelp = () => {
  const { nodes } = useGLTF(sceneFile);
  const kelpMaterials = useRef([]);

  useFrame((state, delta) => {
    if (!kelpMaterials.current.length) return;
    kelpMaterials.current.forEach((elm) => (elm.uniforms.uTime.value += delta));
  });

  return (
    <group>
      <KelpLeaves position={nodes.stem.position} node={nodes.leaves001} />
      <KelpLeaves
        position={nodes.stem.position}
        rotation={[0, Math.PI / 2, 0]}
        node={nodes.leaves002}
      />
      <KelpLeaves
        position={nodes.stem.position}
        rotation={[0, Math.PI * 1.3, 0]}
        node={nodes.leaves003}
      />
      <mesh
        geometry={nodes.stem.geometry}
        castShadow
        receiveShadow
        position={nodes.stem.position}
        scale={nodes.stem.scale}
      >
        <meshStandardMaterial />
      </mesh>
    </group>
  );
};

const SeaScene = () => {
  const { nodes, materials, scene, ...gltf } = useGLTF(sceneFile);

  console.log("nodes", nodes);
  console.log("materials", materials);
  console.log("scene", scene);
  console.log("gltf", gltf);

  return (
    <>
      {/* <fog attach="fog" color="yellow" near={0.1} far={20} /> */}
      <Kelp />
    </>
  );
};

export default SeaScene;
