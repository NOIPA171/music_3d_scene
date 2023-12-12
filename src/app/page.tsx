import Scene from "@/components/Scene";
import Player from "@/components/Player";
import SongList from "@/components/SongList";
import Controller from "@/components/Controller";
import PlayerProvider from "@/context/PlayerProvider";
import ControlProvider from "@/context/ControlProvider";

export default async function Home() {
  return (
    <ControlProvider>
      <PlayerProvider>
        <h1>STUDY SPACE</h1>
        <Scene />
        <Player />
        <SongList />
        <Controller />
      </PlayerProvider>
    </ControlProvider>
  );
}
