"use client";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
  const instance = useRef();
  const objects = useRef();

  useEffect(() => {
    if (objects.current && objects.current.children[0] && instance.current) {
      const sampler = new MeshSurfaceSampler(
        objects.current.children[0]
      ).build();
      const _position = new Vector3();
      const _normal = new Vector3();
      const dummy = new Object3D();

      for (let i = 0; i < 100; i++) {
        sampler.sample(_position, _normal);
        _normal.add(_position);

        dummy.position.copy(_position);
        dummy.lookAt(_normal);
        dummy.updateMatrix();

        instance.current.setMatrixAt(i, dummy.matrix);
      }
      instance.current.instanceMatrix.needsUpdate = true;
      objects.current.add(instance.current);
    }
  }, []);
  return (
    <>
      <Canvas shadows>
        <OrbitControls />
        <Hills />
      </Canvas>
    </>
  );
};

export default Scene;
