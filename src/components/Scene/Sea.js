"use client";

import { useEffect, useRef } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";
import { useFrame, extend } from "@react-three/fiber";
import {
  useGLTF,
  Sampler,
  Sky,
  shaderMaterial,
  useAnimations,
} from "@react-three/drei";
import { RGBADepthPacking } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexShader from "./shaders/seaweedVertex.glsl";
import swayVertexShader from "./shaders/swayVertex.glsl";

const uWindVelocity = 1.5;
const kelpBend = 0.01;
const sceneFile = "/kelp.glb";

const KelpLeaves = ({ rotation, position, node }) => {
  const leavesMaterial = useRef();
  const rand = useRef(Math.random() * 10);

  useFrame((state) => {
    if (!leavesMaterial.current) return;
    leavesMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
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
        ref={leavesMaterial}
        baseMaterial={MeshStandardMaterial}
        vertexShader={vertexShader}
        uniforms={{
          uPos: { value: position },
          uFrequency: { value: 18 },
          uAmplitude: { value: 0.1 },
          uBend: { value: kelpBend },
          uTime: { value: 0 },
          uWindVelocity: { value: uWindVelocity },
          uRand: { value: rand.current },
        }}
        color="green"
        side={DoubleSide}
      />
    </mesh>
  );
};

const Kelp = ({ rotationY = 0, position, scale = 1 }) => {
  const { nodes } = useGLTF(sceneFile);
  const stemMaterial = useRef();

  useFrame((state, delta) => {
    if (!stemMaterial.current) return;
    stemMaterial.current.uniforms.uTime.value += delta;
  });

  return (
    <group scale={scale}>
      <KelpLeaves
        position={position}
        node={nodes.leaves001}
        rotation={[0, rotationY, 0]}
      />
      <KelpLeaves
        position={position}
        rotation={[0, Math.PI / 2 + rotationY, 0]}
        node={nodes.leaves002}
      />
      <KelpLeaves
        position={position}
        rotation={[0, Math.PI * 1.3 + rotationY, 0]}
        node={nodes.leaves003}
      />
      <mesh
        geometry={nodes.stem.geometry}
        castShadow
        receiveShadow
        position={position}
        scale={nodes.stem.scale}
      >
        <CustomShaderMaterial
          ref={stemMaterial}
          baseMaterial={MeshStandardMaterial}
          vertexShader={swayVertexShader}
          uniforms={{
            uBend: { value: kelpBend },
            uTime: { value: 0 },
            uWindVelocity: { value: uWindVelocity },
          }}
          color="green"
        />
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
      <fog attach="fog" color="blue" near={0.1} far={20} />
      <Kelp position={[1, 0, 0]} />
      <Kelp position={[1.5, 0, 0.8]} rotationY={Math.PI} />
      <Kelp position={[-1, 0, 0]} rotationY={Math.PI / 2} />
    </>
  );
};

export default SeaScene;
