"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Box from "./models/Box";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

const Scene = () => {
  // useEffect(() => {
  //   const getPlayingData = async () => {
  //     const res = await fetch("https://api.spotify.com/v1/me/player", {
  //       method: "GET",
  //       headers: {Authorization: `Bearer ${token}`}
  //     });
  //     const result = await res.json();
  //     console.log(result);
  //   };
  //   getPlayingData();
  // }, [])
  // const { data: session } = useSession();
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // }
  // return (
  //   <>
  //     Not signed in <br />
  //     <button onClick={() => signIn()}>Sign in</button>
  //   </>
  // );
  return (
    <>
      <button onClick={() => signIn()}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </>
  );
};

export default Scene;
