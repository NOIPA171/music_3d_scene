import Image from "next/image";
import styles from "./page.module.css";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Scene from "./Scene";
import { getToken } from "next-auth/jwt";
import { useEffect } from "react";
const secret = process.env.NEXTAUTH_SECRET;

export default async function Home() {
  const session = await getServerSession(options);
  console.log("session", session);
  return (
    <>
      {session ? <div>Logged in! {session?.user?.name}</div> : <div>Login</div>}
      <Scene />
    </>
  );
}
