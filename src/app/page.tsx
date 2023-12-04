import Scene from "@/components/Scene";
import Player from "@/components/Player";
import SongList from "@/components/SongList";
import PlayerProvider from "@/context/PlayerProvider";

export default async function Home() {
  return (
    <PlayerProvider>
      <h1>STUDY SPACE</h1>
      <Scene />
      <Player />
      <SongList />
    </PlayerProvider>
  );
}
