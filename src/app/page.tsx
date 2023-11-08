import Image from "next/image";
import styles from "./page.module.css";
// import Script from "next/script";

import Scene from "@/components/Scene";
import Player from "@/components/Player";

export default async function Home() {
  return (
    <>
      <Scene />
      <Player />
    </>
  );
}
