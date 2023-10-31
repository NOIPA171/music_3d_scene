import Image from "next/image";
import styles from "./page.module.css";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Scene from "./Scene";
export default async function Home() {
  const session = await getServerSession(options);
  return (
    <>
      {session ? <div>Logged in! {session?.user?.name}</div> : <div>Login</div>}
      <Scene />
    </>
  );
}
