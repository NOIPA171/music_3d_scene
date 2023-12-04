"use client";
import songList from "@/utils/data";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import { usePlayer } from "@/context/PlayerProvider";
const cx = classNames.bind(styles);

const formatIndex = (num: number) => {
  return num >= 10 ? num : `0${num}`;
};

const SongList = () => {
  const { loadSong, currentTrackIdx, playing } = usePlayer();
  return (
    <ul className={cx("player-list")}>
      {songList.map((song, idx) => (
        <li
          key={idx}
          onClick={() => loadSong(idx, playing)}
          className={cx({
            active: idx === currentTrackIdx,
          })}
        >
          {formatIndex(idx + 1)} <span /> {song.song_name}
        </li>
      ))}
    </ul>
  );
};
export default SongList;
