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
const sceneFile = "/hills_scene.glb";

const Books = () => {
  const { nodes } = useGLTF(sceneFile);
  return (
    <group
      position={nodes.books.position}
      rotation={nodes.books.rotation}
      scale={nodes.books.scale}
    >
      {nodes.books.children.map((child, idx) => (
        <mesh
          key={`grass_${idx}`}
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

const Rocks = () => {
  const { nodes, materials } = useGLTF(sceneFile);
  return (
    <mesh
      geometry={nodes.rock.geometry}
      rotation={nodes.rock.rotation}
      position={nodes.rock.position}
      scale={nodes.rock.scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={materials.rock.color} />
    </mesh>
  );
};

const Tree = () => {
  const { nodes } = useGLTF(sceneFile);
  return (
    <group
      position={nodes.tree.position}
      rotation={nodes.tree.rotation}
      scale={nodes.tree.scale}
    >
      {nodes.tree.children.map((child, idx) => (
        <mesh
          key={`tree_${idx}`}
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

const Flowers = () => {
  const { nodes } = useGLTF(sceneFile);
  const flowerMaterials = useRef([]);

  useFrame((state, delta) => {
    if (!flowerMaterials.current.length) return;
    flowerMaterials.current.forEach(
      (elm) => (elm.uniforms.uTime.value += delta)
    );
  });

  return (
    <group
      position={nodes.tall_flowers.position}
      rotation={nodes.tall_flowers.rotation}
      scale={nodes.tall_flowers.scale}
    >
      {nodes.tall_flowers.children.map((child, idx) => (
        <mesh
          key={`flowers_${idx}`}
          geometry={child.geometry}
          castShadow
          receiveShadow
        >
          <CustomShaderMaterial
            ref={(elm) => flowerMaterials.current.push(elm)}
            baseMaterial={MeshStandardMaterial}
            vertexShader={vertexShader}
            // silent parameter to true disables the default warning if needed
            // silent
            uniforms={{
              uColor: { value: child.material.color },
              uPosition: { value: nodes.tall_flowers.position },
              uBend: { value: 0.05 },
              uTime: { value: 0 },
              uWindVelocity: { value: uWindVelocity },
            }}
            // flatShading
            color={child.material.color}
            // ...
          />
        </mesh>
      ))}
    </group>
  );
};

const Grass = () => {
  const { nodes } = useGLTF(sceneFile);
  const grassMaterials = useRef([]);

  useFrame((state, delta) => {
    if (!grassMaterials.current.length) return;
    grassMaterials.current.forEach(
      (elm) => (elm.uniforms.uTime.value += delta)
    );
  });

  return (
    <group position={nodes.grass.position} rotation={nodes.grass.rotation}>
      {nodes.grass.children.map((child, idx) => (
        <mesh
          key={`grass_${idx}`}
          geometry={child.geometry}
          castShadow
          receiveShadow
        >
          <CustomShaderMaterial
            ref={(elm) => grassMaterials.current.push(elm)}
            baseMaterial={MeshStandardMaterial}
            vertexShader={vertexShader}
            // silent parameter to true disables the default warning if needed
            // silent
            uniforms={{
              uColor: { value: child.material.color },
              uPosition: { value: nodes.grass.position },
              uBend: { value: 1 },
              uTime: { value: 0 },
              uWindVelocity: { value: uWindVelocity },
            }}
            // flatShading
            color={child.material.color}
            // ...
          />
        </mesh>
      ))}
    </group>
  );
};

const HillsScene = () => {
  const { nodes, materials, scene, ...gltf } = useGLTF(sceneFile);

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
      {/* <fog attach="fog" color="#8FA87C" near={0.1} far={15} /> */}
      <fog attach="fog" color="yellow" near={0.1} far={20} />
      <Books />
      <Tree />
      <Flowers />
      <Grass />
      <Rocks />
    </>
  );
};

export default HillsScene;
