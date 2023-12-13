"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import songList from "@/utils/data";
import trackMap from "@/utils/trackMap";
import { useControl } from "./ControlProvider";
import { prefix } from "@/utils/env";

const PlayerContext = createContext<PlayerProps>({
  currentTrackIdx: 0,
  currentTrack: songList[0],
  currentEnvironment: songList[0].environment,
  setCurrentEnvironment: () => {},
  songList,
  loadSong: () => {},
  isReady: false,
  playing: false,
  duration: 0,
});

const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(songList[currentTrackIdx]);
  const [currentEnvironment, setCurrentEnvironment] = useState(
    songList[currentTrackIdx].environment
  );
  const { isReady, playing, duration, load } = useGlobalAudioPlayer();
  const { isAutoChange } = useControl();

  const normalizeIdx = (num: number): number =>
    (songList.length + num) % songList.length;

  const loadSong = (index: number, autoplay: boolean = true) => {
    const currIdx = normalizeIdx(index);
    setCurrentTrackIdx(currIdx);
    setCurrentTrack(songList[currIdx]);
    if (isAutoChange) {
      setCurrentEnvironment(songList[currIdx].environment);
    }
    load(`${prefix}/music/` + songList[currIdx].source, {
      autoplay,
      html5: true,
      onend: () => {
        const newIdx = normalizeIdx(currIdx + 1);
        loadSong(newIdx);
        setCurrentTrackIdx(newIdx);
        setCurrentTrack(songList[newIdx]);
        if (isAutoChange) {
          setCurrentEnvironment(songList[newIdx].environment);
        }
      },
    });
  };

  useEffect(() => {
    loadSong(currentTrackIdx, false);
  }, []);

  useEffect(() => {
    // change bg on environment change
    const colors = trackMap[currentEnvironment].bgColor;
    document.body.style.setProperty("--background-start-rgb", colors[0]);
    document.body.style.setProperty("--background-end-rgb", colors[1]);
  }, [currentEnvironment]);

  const values: PlayerProps = {
    currentTrackIdx,
    currentTrack,
    currentEnvironment,
    setCurrentEnvironment,
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
