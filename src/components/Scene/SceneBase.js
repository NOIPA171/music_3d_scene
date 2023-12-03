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

import vertexShader from "./vertex.glsl";

const uWindVelocity = 1.5;
const sceneFile = "/scene_base.glb";

const Character = () => {
  const { nodes, materials, scene, animations } = useGLTF("character.glb");
  const { ref, actions, names } = useAnimations(animations);
  console.log("character", nodes, materials, scene, actions, names);

  useEffect(() => {
    actions[names[0]].reset().play();
  }, [actions, names]);

  return (
    <>
      <group ref={ref} position={[0, 0.44, -0.05]} scale={0.0078}>
        <primitive object={nodes.mixamorigHips_34} />
        <skinnedMesh
          castShadow
          receiveShadow
          material={materials["Material.001"]}
          geometry={nodes.Body.geometry}
          skeleton={nodes.Body.skeleton}
        />
        {/* <mesh
          receiveShadow
          geometry={nodes.Face.geometry}
          material={materials.face}
        ></mesh>
        <mesh
          receiveShadow
          geometry={nodes.Hair.geometry}
          material={materials.hair}
        ></mesh> */}
      </group>
    </>
  );
};

const Lamp = () => {
  const { nodes } = useGLTF(sceneFile);
  return (
    <group
      position={nodes.standing_lamp.position}
      rotation={nodes.standing_lamp.rotation}
      scale={nodes.standing_lamp.scale}
    >
      {nodes.standing_lamp.children.map((child, idx) => (
        <mesh
          key={`standing_lamp_${idx}`}
          geometry={child.geometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={child.material.color}
            transparent={child.material.opacity !== 1}
            opacity={child.material.opacity}
          />
        </mesh>
      ))}
      {/* <pointLight intensity={0.5} position={[0, 8, 0]} /> */}
    </group>
  );
};

const TableBook = () => {
  const { nodes } = useGLTF(sceneFile);
  return (
    <group
      position={nodes.tableBook.position}
      rotation={nodes.tableBook.rotation}
      scale={nodes.tableBook.scale}
    >
      {nodes.tableBook.children.map((child, idx) => (
        <mesh
          key={`tableBook_${idx}`}
          geometry={child.geometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={child.material.color} />
        </mesh>
      ))}
    </group>
  );
};

const Chair = () => {
  const { nodes, materials } = useGLTF(sceneFile);
  return (
    <mesh
      geometry={nodes.chair.geometry}
      rotation={nodes.chair.rotation}
      position={nodes.chair.position}
      scale={nodes.chair.scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={materials.Wood.color} />
    </mesh>
  );
};

const Table = () => {
  const { nodes, materials } = useGLTF(sceneFile);
  return (
    <mesh
      geometry={nodes.table.geometry}
      rotation={nodes.table.rotation}
      position={nodes.table.position}
      scale={nodes.table.scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={materials.table.color} />
    </mesh>
  );
};

const SceneBase = () => {
  const { nodes, materials, scene, ...gltf } = useGLTF(sceneFile);
  const grassMaterials = useRef([]);

  useFrame((state, delta) => {
    if (!grassMaterials.current.length) return;
    grassMaterials.current.forEach(
      (elm) => (elm.uniforms.uTime.value += delta)
    );
  });

  console.log("nodes", nodes);
  console.log("materials", materials);
  console.log("scene", scene);
  console.log("gltf", gltf);

  return (
    <>
      <Lamp />
      <Character />
      <TableBook />
      <Table />
      <Chair />
      <color args={["#8FA87C"]} attach="background" />
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
      {/* <mesh rotation={[Math.PI / -2, 0, 0]} position={[0, -0.37, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={"red"} />
      </mesh> */}
    </>
  );
};

export default SceneBase;
