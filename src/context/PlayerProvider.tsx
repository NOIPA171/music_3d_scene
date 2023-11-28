"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import songList from "@/utils/data.json";

const PlayerContext = createContext<PlayerProps>({
  currentTrackIdx: 0,
  setCurrentTrackIdx: () => {},
  songList,
  loadSong: () => {},
  isReady: false,
  playing: false,
  duration: 0,
});

const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const { isReady, playing, duration } = useGlobalAudioPlayer();

  const { load } = useGlobalAudioPlayer();

  const loadSong = (index: number, autoplay: boolean = true) => {
    setCurrentTrackIdx(index);
    load("/music/" + songList[index].source, {
      autoplay,
      onload: () => {
        // TODO: check if updating state is necessary
        // TODO: show spinner while it's loading
        console.log("loaded");
      },
      onend: () => {
        // TODO: skip to next song
        const newIdx = songList.length % (index + 1);
        loadSong(newIdx);
        setCurrentTrackIdx(newIdx);
      },
    });
  };

  useEffect(() => {
    loadSong(currentTrackIdx, false);
  }, []);

  const values: PlayerProps = {
    currentTrackIdx,
    setCurrentTrackIdx,
    songList,
    loadSong,
    isReady,
    playing,
    duration,
  };

  return (
    <>
      <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>
    </>
  );
};

export default PlayerProvider;

export const usePlayer = () => {
  const player = useContext(PlayerContext);
  return player;
};
