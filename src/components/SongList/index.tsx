"use client";
import songList from "@/utils/data.json";
import styles from "./styles.module.scss";
import classNames from "classNames/bind";
import { usePlayer } from "@/context/PlayerProvider";
const cx = classNames.bind(styles);

const formatIndex = (num: number) => {
  return num >= 10 ? num : `0${num}`;
};

const SongList = () => {
  const { loadSong, currentTrackIdx } = usePlayer();
  return (
    <ul className={cx("player-list")}>
      {songList.map((song, idx) => (
        <li
          key={idx}
          onClick={() => loadSong(idx)}
          className={cx({
            active: idx === currentTrackIdx,
          })}
        >
          {formatIndex(idx + 1)} <span /> {song.environment}
        </li>
      ))}
    </ul>
  );
};
export default SongList;
