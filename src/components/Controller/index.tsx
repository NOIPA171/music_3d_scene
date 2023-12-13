"use client";
import { useEffect, useState, useRef } from "react";
import { useControl } from "@/context/ControlProvider";
import { motion } from "framer-motion";
import Image from "next/image";
import Toggle from "react-toggle";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import { prefix } from "@/utils/env";
import { usePlayer } from "@/context/PlayerProvider";
import { Howl, Howler } from "howler";

const cx = classNames.bind(styles);

const Controller = () => {
  const { setCurrentEnvironment, currentEnvironment } = usePlayer();
  const { isShow, setIsShow, setIsAutoChange, isAutoChange, isAmbient } =
    useControl();
  const [isExpand, setIsExpand] = useState(true);

  useEffect(() => {
    console.log("run");
    // const sound = new Howl({
    //   src: ["/ambience/underwater-ambience-6201.mp3"],
    //   loop: true,
    //   volume: 0.3,
    //   onload: () => {
    //     console.log("load");
    //   },
    // });
    // const track1 = sound.play();
    // sound.fade(0, 1, 1000, track1);
    // console.log(sound.duration(track1));
    // setTimeout(() => {
    //   sound.fade(1, 0, 1000, track1);
    // }, sound.duration() - 1000);
  }, []);

  return (
    <div className={cx("controls-wrapper")}>
      <button
        className={cx("show-btn")}
        onClick={() => setIsShow((prev) => !prev)}
      >
        <Image
          src={`${prefix}/icons/${isShow ? "eye" : "eye-off"}.svg`}
          alt={isShow ? "hide controls" : "show controls"}
          width={24}
          height={24}
        />
      </button>
      {/* Using style to show/not show to prevent bug in accordian animation */}
      <div className={cx("controls", { show: isShow })}>
        {/* <div>
          <label>
            <span>Ambient Sounds</span>
            <Toggle className={cx("toggle")} icons={false} />
          </label>
        </div> */}
        <div>
          <label>
            <span>Auto-Change Scene</span>
            <Toggle
              className={cx("toggle")}
              icons={false}
              checked={isAutoChange}
              onChange={() => setIsAutoChange((prev) => !prev)}
            />
          </label>
        </div>
        <div className={cx("accordian", { expanded: isExpand })}>
          <div
            className={cx("accordian-title")}
            role="button"
            onClick={() => setIsExpand((prev) => !prev)}
          >
            Environment
            <Image
              src={`/icons/triangle.svg`}
              alt={isExpand ? "close" : "expand"}
              width={6}
              height={6}
              className={cx("triangle")}
            />
          </div>
          <motion.ul
            className={cx("accordian-content")}
            animate={isExpand ? "open" : "closed"}
            variants={{
              open: { height: "auto" },
              closed: { height: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <li
              role="button"
              className={cx({ active: currentEnvironment === "hills" })}
              onClick={() => setCurrentEnvironment("hills")}
            >
              Hills
            </li>
            <li
              role="button"
              className={cx({ active: currentEnvironment === "sea" })}
              onClick={() => setCurrentEnvironment("sea")}
            >
              Ocean
            </li>
          </motion.ul>
        </div>
      </div>
    </div>
  );
};
export default Controller;
