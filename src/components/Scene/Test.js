import ReactDOM from "react-dom";
import React, { useRef, useEffect } from "react";

import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

import { Canvas } from "@react-three/fiber";

import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Object3D, Vector3 } from "three";

// https://github.com/pmndrs/react-three-fiber/discussions/2125#discussioncomment-2391005

function SampledSurface(props) {
  const objects = useRef();
  const { instance } = props;

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
  }, [props.children]);

  return (
    <group {...props} ref={objects}>
      {props.children}
    </group>
  );
}

export default function Test() {
  const instance = useRef();
  const { nodes, materials, scene } = useGLTF("/new_scene2.glb");

  return (
    <>
      <instancedMesh ref={instance} args={[null, null, 100]}>
        {/* <group position={nodes.grass.position} rotation={nodes.grass.rotation}>
          {nodes.grass.children.map((child, idx) => (
            <mesh key={`grass_${idx}`} geometry={child.geometry} castShadow>
              <meshStandardMaterial color={child.material.color} />
            </mesh>
          ))}
        </group> */}
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshPhongMaterial attach="material" color={0x00ffaa} />
      </instancedMesh>
      <SampledSurface count={16} instance={instance}>
        <mesh
          geometry={nodes.rockFlat001.geometry}
          position={nodes.rockFlat001.position}
          scale={nodes.rockFlat001.scale}
          receiveShadow
        >
          <meshStandardMaterial color={nodes.rockFlat001.material.color} />
        </mesh>
      </SampledSurface>
    </>
  );
}

// export default function Test() {
//   const instance = useRef();

//   return (
//     <>
//       <instancedMesh ref={instance} args={[null, null, 100]}>
//         <boxGeometry args={[0.2, 0.2, 0.2]} />
//         <meshPhongMaterial attach="material" color={0x00ffaa} />
//       </instancedMesh>
//       <SampledSurface count={16} instance={instance}>
//         <mesh>
//           <sphereGeometry attach="geometry" args={[2, 10]} />
//           <meshStandardMaterial color={0x333333} />
//         </mesh>
//       </SampledSurface>
//     </>
//   );
// }
