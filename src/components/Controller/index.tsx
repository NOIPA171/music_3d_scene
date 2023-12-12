"use client";
import { useEffect, useState, useRef } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { useControl } from "@/context/ControlProvider";
import { motion } from "framer-motion";
import Image from "next/image";
import Toggle from "react-toggle";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import { usePlayer } from "@/context/PlayerProvider";

const cx = classNames.bind(styles);

const Controller = () => {
  const { setCurrentEnvironment, currentEnvironment } = usePlayer();
  const { isShow, setIsShow } = useControl();
  const [isExpand, setIsExpand] = useState(true);

  return (
    <div className={cx("controls-wrapper")}>
      <button
        className={cx("show-btn")}
        onClick={() => setIsShow((prev) => !prev)}
      >
        <Image
          src={`/icons/${isShow ? "eye" : "eye-off"}.svg`}
          alt={isShow ? "hide controls" : "show controls"}
          width={24}
          height={24}
        />
      </button>
      {/* Using style to show/not show to prevent bug in accordian animation */}
      <div className={cx("controls", { show: isShow })}>
        <div>
          <label>
            <span>Ambient Sounds</span>
            <Toggle
              className={cx("toggle")}
              icons={false}
              // onChange={this.handleTofuChange}
            />
          </label>
        </div>
        <div>
          <label>
            <span>Auto-Change Scene</span>
            <Toggle
              className={cx("toggle")}
              icons={false}
              // onChange={this.handleTofuChange}
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
