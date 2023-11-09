"use client";
import { useEffect, useState, useRef } from "react";
// need AuthProvider for client components to use useSession
import { useAudioPlayer } from "react-use-audio-player";
import styles from "./styles.module.scss";
import classNames from "classNames/bind";
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
  const { load, togglePlayPause, getPosition, seek, playing, duration } =
    useAudioPlayer();

  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const dragRef = useRef(isDragging);
  const dragPosRef = useRef(dragPosition);
  const frameRef = useRef<number>();
  const durationRef = useRef(0);
  const barElm = useRef<HTMLDivElement>(null);

  // console.log("playing", playing, duration);
  useEffect(() => {
    load("/music/relaxing_music.mp3", {
      autoplay: false,
      onload: () => {
        // TODO: check if updating state is necessary
        // TODO: show spinner while it's loading
        console.log("loaded");
      },
      onend: () => {
        // TODO: skip to next song
      },
    });
  }, []);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // update position bar
  useEffect(() => {
    const animate = () => {
      setPosition(Math.floor(getPosition())); // round the numbers so it doesn't constantly re-render
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      frameRef.current && cancelAnimationFrame(frameRef.current);
    };
  }, [getPosition]);

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
    console.log("position update", position);
  }, [position]);

  useEffect(() => {
    // TODO: skip location mechanics
    const handleDragEnd = () => {
      if (!dragRef.current || !barElm.current) return;
      // const rect = barElm.current.getBoundingClientRect();
      // const newPosition = normalizePosition(
      //   (dragPosRef.current / rect.width) * durationRef.current
      // );
      console.log("drag end", dragPosRef.current);
      dragRef.current = false;
      seek(dragPosRef.current);
      setIsDragging(false);
    };

    const handleDragMove = (evt: MouseEvent) => {
      if (!dragRef.current || !barElm.current) return;
      const rect = barElm.current.getBoundingClientRect();
      const location = evt.clientX - rect.x;
      const newPosition = normalizePosition(
        (location / rect.width) * durationRef.current
      );
      console.log("dragging", newPosition);
      dragPosRef.current = newPosition;
      setDragPosition(newPosition);
    };

    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("mousemove", handleDragMove);

    return () => {
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("mousemove", handleDragMove);
    };
  }, []);

  const handleDragStart = (evt: React.MouseEvent<HTMLElement>) => {
    dragRef.current = true;
    setIsDragging(true);
    let div = evt.target as HTMLInputElement;
    const rect = div.getBoundingClientRect();
    const location = evt.clientX - rect.x;
    const newPosition = (location / rect.width) * duration;
    dragPosRef.current = newPosition;
    setDragPosition(newPosition);
    console.log("drag start", newPosition);
  };

  return (
    <div>
      <div>Player</div>
      <div>
        <button>Prev</button>
        <button onClick={() => togglePlayPause()}>
          {playing ? "Pause" : "Play"}
        </button>
        <button>Next</button>
      </div>
      <div>Name of the song</div>
      <div className={cx("progress-bar")}>
        <div className={cx("time")}>
          {getTime(isDragging ? dragPosition : position)}
        </div>
        <div
          ref={barElm}
          className={cx("bar")}
          onMouseDown={(evt) => handleDragStart(evt)}
        >
          <div
            className={cx("progress")}
            style={{
              width:
                Math.round(
                  ((isDragging ? dragPosition : position) / duration) * 100
                ) + "%",
            }}
          ></div>
        </div>
        <div className={cx("time")}>{getTime(duration)}</div>
      </div>
      <div />
    </div>
  );
};
export default Player;
