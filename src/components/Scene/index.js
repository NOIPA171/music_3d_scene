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

import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";

import Test from "./Test";

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
      <Canvas
        shadows
        orthographic
        camera={{
          fov: 45,
          zoom: 100,
          near: 0.1,
          far: 200,
          position: [3, 2, 6],
        }}
      >
        <ambientLight intensity={0.5} />
        <OrbitControls />
        <Hills />
        {/* <Test /> */}

        {/* <Sampler
          // weight={"normal"} // the name of the attribute to be used as sampling weight
          // transform={({ dummy, sampledMesh, position, normal }) => {
          //   dummy.scale.setScalar(Math.random() * 0.1);

          //   const worldPosition = sampledMesh.localToWorld(position);
          //   dummy.position.copy(worldPosition);

          //   dummy.lookAt(normal.clone().add(position));
          //   dummy.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5);
          //   dummy.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5);
          //   dummy.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5);
          // }} // a function that transforms each instance given a sample. See the examples for more.
          count={16} // Number of samples
        >
          <mesh> 
            <sphereGeometry args={[2]} />
            <meshNormalMaterial />
          </mesh>

          <instancedMesh args={[null, null, 1000]}>
            <sphereGeometry args={[0.1]} />
            <meshNormalMaterial />
          </instancedMesh>
        </Sampler> */}
      </Canvas>
    </>
  );
};

export default Scene;
