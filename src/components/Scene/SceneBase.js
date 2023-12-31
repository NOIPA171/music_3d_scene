"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { usePlayer } from "@/context/PlayerProvider";
import trackMap from "@/utils/trackMap.ts";
import { prefix } from "@/utils/env";

const sceneFile = `${prefix}/scene_base.glb`;

const Character = () => {
  const { nodes, animations } = useGLTF(`${prefix}/character.glb`);
  const { ref, actions, names } = useAnimations(animations);
  // console.log("character", nodes, actions, names);

  useEffect(() => {
    actions[names[0]].reset().play();
  }, [actions, names]);

  return (
    <>
      <group ref={ref} position={[0, 0.44, -0.05]} scale={0.0078}>
        <primitive object={nodes.GLTF_created_0_rootJoint} />
        {nodes.Body.children.map((child, idx) => (
          <skinnedMesh
            key={`char_${idx}`}
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
          <meshStandardMaterial color={child.material.color} />
        </mesh>
      ))}
      <pointLight intensity={1.5} position={[0, 8, 0]} color="#d1be30" />
    </group>
  );
};

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
  const { nodes } = useGLTF(sceneFile);

  const { currentEnvironment } = usePlayer();

  const { camera } = useThree();

  useFrame(() => {
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
  });

  useEffect(() => {
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
  }, []);

  const trackData = trackMap[currentEnvironment];

  return (
    <>
      <Lamp />
      <Character />
      <Books />
      <TableBook />
      <Table />
      <Chair />
      <group>
        <mesh
          geometry={nodes.rockFlat.geometry}
          position={nodes.rockFlat.position}
          scale={nodes.rockFlat.scale}
        >
          <meshStandardMaterial color={trackData.baseRock.baseColor} />
        </mesh>
        <mesh
          geometry={nodes.rockFlat001.geometry}
          position={nodes.rockFlat001.position}
          scale={nodes.rockFlat001.scale}
          receiveShadow
        >
          <meshStandardMaterial color={trackData.baseRock.topColor} />
        </mesh>
      </group>
    </>
  );
};

export default SceneBase;
