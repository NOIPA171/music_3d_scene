"use client";
import { useEffect, useState, useRef } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import Image from "next/image";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import { usePlayer } from "@/context/PlayerProvider";
const cx = classNames.bind(styles);

const parseDigits = (number: number): string => {
  return number > 10 ? `${number}` : `0${number}`;
};

const getTime = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = parseDigits(Math.round(duration % 60));
  return `${minutes}:${seconds}`;
};

const Player = () => {
  const { togglePlayPause, getPosition, seek } = useGlobalAudioPlayer();
  const {
    loadSong,
    currentTrackIdx,
    currentTrack,
    isReady,
    playing,
    duration,
  } = usePlayer();
  const [position, setPosition] = useState(0); // as in position in the track
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(isDragging);
  // used for event listeners
  const posRef = useRef(position); // updated with position
  const frameRef = useRef<number>(); // for cancelling requestAnimationFrame
  const durationRef = useRef(0); // same as duration from audio
  // element that detects dragging
  const barElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // update durationRef when song is loaded
    durationRef.current = duration;
  }, [duration]);

  // update position bar
  const animateProgressBar = () => {
    setPosition(Math.floor(getPosition())); // round the numbers so it doesn't constantly re-render
    frameRef.current = requestAnimationFrame(animateProgressBar);
  };

  useEffect(() => {
    if (playing && !isDragging) {
      frameRef.current = window.requestAnimationFrame(animateProgressBar);
    } else {
      frameRef.current && cancelAnimationFrame(frameRef.current);
    }

    return () => {
      frameRef.current && cancelAnimationFrame(frameRef.current);
    };
  }, [playing, isDragging, animateProgressBar]);

  // handle max and min of dragging position
  const normalizePosition = (num: number) => {
    if (num > durationRef.current) {
      return durationRef.current;
    } else if (num < 0) {
      return 0;
    }
    return num;
  };

  useEffect(() => {
    // seek position on drag end
    const handleDragEnd = () => {
      if (!dragRef.current || !barElm.current) return;
      // console.log("drag end", posRef.current);
      dragRef.current = false;
      seek(posRef.current);
      setIsDragging(false);
    };

    // update bar position on moving
    const handleDragMove = (evt: MouseEvent) => {
      if (!dragRef.current || !barElm.current) return;
      const rect = barElm.current.getBoundingClientRect();
      const location = evt.clientX - rect.x;
      const newPosition = normalizePosition(
        (location / rect.width) * durationRef.current
      );
      // console.log("dragging", newPosition);
      posRef.current = newPosition;
      setPosition(newPosition);
    };

    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("mousemove", handleDragMove);

    return () => {
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("mousemove", handleDragMove);
    };
  }, []);

  // initiate drag
  const handleDragStart = (evt: React.MouseEvent) => {
    if (!barElm.current) return;
    dragRef.current = true;
    setIsDragging(true);
    const rect = barElm.current.getBoundingClientRect();
    const location = evt.clientX - rect.x;
    const newPosition = (location / rect.width) * duration;
    posRef.current = newPosition;
    setPosition(newPosition);
    // console.log("drag start", newPosition);
  };

  return (
    <div className={cx("player")}>
      <div className={cx("controls")}>
        <button onClick={() => loadSong(currentTrackIdx - 1, playing)}>
          <Image
            src={`/icons/player-skip-back.svg`}
            alt="skip back"
            width={24}
            height={24}
          />
        </button>
        <button onClick={() => togglePlayPause()} className={cx("main-btn")}>
          <Image
            src={`/icons/player-${playing ? "pause" : "play"}.svg`}
            alt={playing ? "pause" : "play"}
            width={24}
            height={24}
          />
        </button>
        <button onClick={() => loadSong(currentTrackIdx + 1, playing)}>
          <Image
            src={`/icons/player-skip-forward.svg`}
            alt="skip back"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div>{currentTrack.song_name}</div>
      <div className={cx("progress-bar")}>
        <div className={cx("time")}>{isReady ? getTime(position) : "-:--"}</div>
        <div
          ref={barElm}
          className={cx("bar", { active: isDragging })}
          onMouseDown={(evt) => handleDragStart(evt)}
        >
          <div
            className={cx("progress-bg")}
            style={
              {
                "--bar-transform":
                  -100 + (Math.round((position / duration) * 100) || 0) + "%",
              } as React.CSSProperties
            }
          >
            <div className={cx("progress-cont")}>
              <div className={cx("progress")}></div>
            </div>
            <div className={cx("progress-btn")}></div>
          </div>
        </div>
        <div className={cx("time")}>{isReady ? getTime(duration) : "-:--"}</div>
      </div>
    </div>
  );
};
export default Player;
