"use client";
import songList from "@/utils/data";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import { usePlayer } from "@/context/PlayerProvider";
import { useControl } from "@/context/ControlProvider";
const cx = classNames.bind(styles);

const formatIndex = (num: number) => {
  return num >= 10 ? num : `0${num}`;
};

const SongList = () => {
  const { loadSong, currentTrackIdx, playing } = usePlayer();
  const { isShow } = useControl();
  if (!isShow) {
    return null;
  }
  return (
    <ul className={cx("player-list")}>
      {songList.map((song, idx) => (
        <li
          key={idx}
          onClick={() => loadSong(idx, playing)}
          className={cx({
            active: idx === currentTrackIdx,
          })}
          onKeyDown={(evt) => {
            if (evt.code === "Space" || evt.code === "Enter") {
              loadSong(idx, playing);
            }
          }}
          tabIndex={0}
          role="button"
        >
          {formatIndex(idx + 1)} <span /> {song.song_name}
        </li>
      ))}
    </ul>
  );
};
export default SongList;
