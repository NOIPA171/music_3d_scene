"use client";

import { useLayoutEffect, useRef, useEffect } from "react";
import { MeshStandardMaterial, DoubleSide, Object3D } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexShader from "./shaders/seaweedVertex.glsl";
import swayVertexShader from "./shaders/swayVertex.glsl";

const uWindVelocity = 1.5;
const kelpBend = 0.01;
const sceneFile = "/sea_scene.glb";

const Fish = () => {
  const { nodes, animations } = useGLTF("fish.glb");
  const { ref, actions, names } = useAnimations(animations);
  console.log("fish", nodes, actions, names);

  useEffect(() => {
    actions[names[0]].reset().play();
  }, [actions, names]);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * -0.1;
  });

  return (
    <>
      <group ref={ref} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={nodes.Armature} position={[3, 1, 0]} scale={10} />
        {/* Pivot */}
        <primitive object={new Object3D()} />
        {nodes.Fish.children.map((child, idx) => (
          <skinnedMesh
            key={`fish_${idx}`}
            castShadow
            receiveShadow
            material={child.material}
            geometry={child.geometry}
            skeleton={child.skeleton}
          />
        ))}
      </group>
    </>
  );
};

const Rocks = () => {
  const { nodes } = useGLTF(sceneFile);
  return (
    <mesh geometry={nodes.sea_rocks.geometry}>
      <meshStandardMaterial color={nodes.sea_rocks.material.color} />
    </mesh>
  );
};

const CoralFloor = () => {
  const { nodes } = useGLTF(sceneFile);
  return (
    <mesh
      geometry={nodes.coral_floor.geometry}
      scale={nodes.coral_floor.scale}
      position={nodes.coral_floor.position}
      rotation={nodes.coral_floor.rotation}
    >
      <meshStandardMaterial color="#7365c2" />
    </mesh>
  );
};

const CoralFern = () => {
  const { nodes } = useGLTF(sceneFile);
  return (
    <mesh
      geometry={nodes.coral_fern.geometry}
      scale={nodes.coral_fern.scale}
      position={nodes.coral_fern.position}
      rotation={nodes.coral_fern.rotation}
    >
      <meshStandardMaterial color="#fa70ca" />
    </mesh>
  );
};

const Corals = () => {
  const { nodes } = useGLTF(sceneFile);
  return (
    <mesh
      geometry={nodes.coral.geometry}
      scale={nodes.coral.scale}
      position={nodes.coral.position}
      rotation={nodes.coral.rotation}
    >
      <meshStandardMaterial color="#ff7045" />
    </mesh>
  );
};

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

const BigKelp = ({ rotationY = 0, position }) => {
  const { nodes } = useGLTF(sceneFile);
  const stemMaterial = useRef();

  useFrame((state) => {
    if (!stemMaterial.current) return;
    stemMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group>
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

const SmallKelp = ({ rotationY = 0, position }) => {
  const { nodes } = useGLTF(sceneFile);
  const stemMaterial = useRef();

  useFrame((state) => {
    if (!stemMaterial.current) return;
    stemMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group>
      <KelpLeaves
        position={position}
        node={nodes.sm_leaves}
        rotation={[0, rotationY, 0]}
      />
      <KelpLeaves
        position={position}
        rotation={[0, Math.PI / 2 + rotationY, 0]}
        node={nodes.sm_leaves001}
      />
      <KelpLeaves
        position={position}
        rotation={[0, Math.PI * 1.3 + rotationY, 0]}
        node={nodes.sm_leaves002}
      />
      <mesh
        geometry={nodes.sm_stem.geometry}
        castShadow
        receiveShadow
        position={position}
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
  const lights = useRef([]);

  useLayoutEffect(() => {
    // update light
    if (!lights.current?.length) return;
    lights.current.forEach((light) => {
      light.target.updateMatrixWorld();
    });
  }, []);

  return (
    <>
      <spotLight
        ref={(elm) => (lights.current[0] = elm)}
        castShadow
        decay={2}
        penumbra={1}
        angle={Math.PI / 20}
        color="#6ee6f5"
        position={[3.5, 5, 5]}
        intensity={150}
        target-position={[1.5, 0, 0]}
      ></spotLight>
      <spotLight
        ref={(elm) => (lights.current[1] = elm)}
        castShadow
        decay={2}
        penumbra={1}
        angle={Math.PI / 20}
        color="#6ee6f5"
        position={[0.75, 5, 5]}
        intensity={150}
        target-position={[-1.25, 0, 0]}
      ></spotLight>
      <BigKelp position={[1, 0, 0]} />
      <BigKelp position={[1.7, 0, 0.75]} rotationY={Math.PI} />
      <BigKelp position={[-1.2, 0, -0.1]} rotationY={Math.PI / 2} />
      <SmallKelp position={[1.3, 0, -0.5]} />
      <SmallKelp position={[-1, 0, 0.6]} rotationY={Math.PI / 3} />
      <SmallKelp position={[1.1, 0, 0.8]} rotationY={Math.PI / 4} />
      <Rocks />
      <CoralFern />
      <Corals />
      <CoralFloor />
      <Fish />
    </>
  );
};

export default SeaScene;
